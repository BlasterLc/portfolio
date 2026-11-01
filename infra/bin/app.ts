import { join } from 'node:path';
import { App } from 'aws-cdk-lib';
import { PortfolioStack } from '../lib/portfolio-stack';

const app = new App();

new PortfolioStack(app, 'PortfolioApi', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-east-1' },
  backendEntry: join(__dirname, '../../backend/src/handler.ts'),
  allowedOrigins: [
    'https://main.d5w3zjhtyz0vy.amplifyapp.com',
    'http://localhost:8766',
    'http://127.0.0.1:8766',
  ],
  // The alert address does not live in the repo: `ALERT_EMAIL=you@example.com npm run deploy:api`.
  alertEmail: process.env.ALERT_EMAIL,
});
