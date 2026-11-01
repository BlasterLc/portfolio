import { join } from 'node:path';
import { App } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { beforeAll, describe, expect, it } from 'vitest';
import { PortfolioStack } from '../lib/portfolio-stack';

describe('PortfolioStack', () => {
  let t: Template;
  beforeAll(() => {
    const stack = new PortfolioStack(new App(), 'Test', {
      env: { account: '123456789012', region: 'us-east-1' },
      backendEntry: join(__dirname, '../../backend/src/handler.ts'),
      allowedOrigins: ['https://example.amplifyapp.com'],
    });
    t = Template.fromStack(stack);
  }, 60_000);

  it('has one pay-per-request table whose items expire by TTL', () => {
    t.resourceCountIs('AWS::DynamoDB::Table', 1);
    t.hasResourceProperties('AWS::DynamoDB::Table', {
      BillingMode: 'PAY_PER_REQUEST',
      TimeToLiveSpecification: { AttributeName: 'expiresAt', Enabled: true },
      KeySchema: [{ AttributeName: 'pk', KeyType: 'HASH' }, { AttributeName: 'sk', KeyType: 'RANGE' }],
    });
  });
  it('runs the API on Node 22 with a short timeout and a log retention', () => {
    t.hasResourceProperties('AWS::Lambda::Function', { Runtime: 'nodejs22.x', Timeout: 10 });
    t.hasResourceProperties('AWS::Logs::LogGroup', { RetentionInDays: 30 });
  });
  it('exposes only GET and POST /saves, with CORS for the allowed origin only', () => {
    const routes = t.findResources('AWS::ApiGatewayV2::Route');
    const keys = Object.values(routes).map((r) => (r as { Properties: { RouteKey: string } }).Properties.RouteKey).sort();
    expect(keys).toEqual(['GET /saves', 'POST /saves']);
    t.hasResourceProperties('AWS::ApiGatewayV2::Api', {
      CorsConfiguration: Match.objectLike({ AllowOrigins: ['https://example.amplifyapp.com'], AllowMethods: ['GET', 'POST', 'OPTIONS'], AllowHeaders: ['content-type'] }),
    });
  });
  it('throttles the whole API at the gateway', () => {
    t.hasResourceProperties('AWS::ApiGatewayV2::Stage', { StageName: '$default', DefaultRouteSettings: { ThrottlingRateLimit: 5, ThrottlingBurstLimit: 10 } });
  });
  it('gives the Lambda access to the table and nothing wider', () => {
    const policies = JSON.stringify(t.findResources('AWS::IAM::Policy'));
    expect(policies).toContain('dynamodb:PutItem');
    expect(policies).not.toContain('"Resource":"*"');
  });
  it('has the two alarms and outputs the API URL', () => {
    t.resourceCountIs('AWS::CloudWatch::Alarm', 2);
    t.hasOutput('ApiUrl', {});
  });
});
