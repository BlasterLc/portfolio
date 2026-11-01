import * as cdk from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as cwActions from 'aws-cdk-lib/aws-cloudwatch-actions';

export interface PortfolioStackProps extends cdk.StackProps {
  /** TypeScript file that exports `handler`. */
  backendEntry: string;
  /** Origins allowed by CORS: the Amplify site and the local dev server. */
  allowedOrigins: string[];
  /** Where the alarms are sent. If missing, the alarms exist but notify nobody. */
  alertEmail?: string;
}

/**
 * Guestbook API for the portfolio ("saves" on the memory card):
 * Amplify-hosted page -> API Gateway HTTP API -> Lambda -> DynamoDB.
 */
export class PortfolioStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: PortfolioStackProps) {
    super(scope, id, props);

    // One table: saves (pk "SAVE"), usage counters (pk "RL#..."); both expire by TTL.
    const table = new dynamodb.Table(this, 'GuestbookTable', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: 'expiresAt',
      removalPolicy: cdk.RemovalPolicy.DESTROY, // a contest project: the data goes with the stack
    });

    const fn = new NodejsFunction(this, 'ApiFn', {
      entry: props.backendEntry,
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_22_X,
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      environment: {
        TABLE_NAME: table.tableName,
        // Salt for the visitor fingerprint: the random GUID inside this stack's id (not public, stable for the stack).
        IP_SALT: cdk.Fn.select(2, cdk.Fn.split('/', cdk.Aws.STACK_ID)),
      },
      bundling: { minify: true, sourceMap: true },
      logGroup: new logs.LogGroup(this, 'ApiFnLogs', { retention: logs.RetentionDays.ONE_MONTH, removalPolicy: cdk.RemovalPolicy.DESTROY }),
    });
    table.grantReadWriteData(fn);

    const api = new apigwv2.HttpApi(this, 'Api', {
      apiName: 'portfolio-guestbook',
      createDefaultStage: false,
      corsPreflight: {
        allowOrigins: props.allowedOrigins,
        allowMethods: [apigwv2.CorsHttpMethod.GET, apigwv2.CorsHttpMethod.POST, apigwv2.CorsHttpMethod.OPTIONS],
        allowHeaders: ['content-type'],
        maxAge: cdk.Duration.hours(1),
      },
    });
    api.addRoutes({
      path: '/saves',
      methods: [apigwv2.HttpMethod.GET, apigwv2.HttpMethod.POST],
      integration: new HttpLambdaIntegration('SavesIntegration', fn),
    });
    // First line of defence: a request-rate cap for the whole API, before the Lambda is even invoked.
    new apigwv2.HttpStage(this, 'DefaultStage', {
      httpApi: api,
      stageName: '$default',
      autoDeploy: true,
      throttle: { rateLimit: 5, burstLimit: 10 },
    });

    // Alarms: the account has little concurrency, so abuse is watched rather than blocked.
    const alerts = new sns.Topic(this, 'Alerts');
    if (props.alertEmail) alerts.addSubscription(new subscriptions.EmailSubscription(props.alertEmail));
    const action = new cwActions.SnsAction(alerts);
    new cloudwatch.Alarm(this, 'ApiErrors', {
      alarmDescription: 'The guestbook Lambda finished with an error (unhandled failure or timeout).',
      metric: fn.metricErrors({ period: cdk.Duration.minutes(5), statistic: 'Sum' }),
      threshold: 5,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    }).addAlarmAction(action);
    new cloudwatch.Alarm(this, 'ApiVolume', {
      alarmDescription: 'More than 600 guestbook calls in one hour: unusual use or abuse.',
      metric: fn.metricInvocations({ period: cdk.Duration.hours(1), statistic: 'Sum' }),
      threshold: 600,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    }).addAlarmAction(action);

    cdk.Tags.of(this).add('project', 'build-your-tech');
    cdk.Tags.of(this).add('purpose', 'student-builder-challenge');

    new cdk.CfnOutput(this, 'ApiUrl', { value: api.apiEndpoint, description: 'Base URL of the guestbook API (GET/POST /saves)' });
    new cdk.CfnOutput(this, 'TableName', { value: table.tableName });
  }
}
