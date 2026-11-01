/** Lambda behind an API Gateway HTTP API (payload format 2.0): GET /saves and POST /saves. */
import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { checkLimits, visitorHash, type CounterStore } from './limits.js';
import { createStores, type SaveStore } from './store.js';
import { parseSave } from './validate.js';

const LIST_SIZE = 30;

export interface Deps {
  saves: SaveStore;
  counters: CounterStore;
  salt: string;
  now: () => Date;
}

const json = (status: number, body: unknown, headers: Record<string, string> = {}): APIGatewayProxyStructuredResultV2 => ({
  statusCode: status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...headers },
  body: JSON.stringify(body),
});

const err = (status: number, code: string, message: string, headers?: Record<string, string>) => json(status, { error: code, message }, headers);

export function createHandler(deps: Deps) {
  return async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyStructuredResultV2> => {
    const method = event.requestContext.http.method;
    const path = event.rawPath.replace(/\/+$/, '') || '/';
    if (path !== '/saves') return err(404, 'not_found', 'Unknown route.');

    try {
      if (method === 'GET') {
        const saves = await deps.saves.list(LIST_SIZE);
        return json(200, { saves });
      }

      if (method === 'POST') {
        const ctype = (event.headers?.['content-type'] ?? '').toLowerCase();
        if (!ctype.startsWith('application/json')) return err(415, 'unsupported_media_type', 'Send application/json.');
        const parsed = parseSave(event.body, event.isBase64Encoded);
        if (!parsed.ok) return err(parsed.status, parsed.code, parsed.message);

        const visitor = visitorHash(event.requestContext.http.sourceIp || 'unknown', deps.salt);
        const limit = await checkLimits(deps.counters, visitor, deps.now());
        if (!limit.ok) {
          const msg = limit.scope === 'visitor' ? 'You have left enough saves for now. Try again later.' : 'The memory card is busy. Try again in a moment.';
          return err(429, 'rate_limited', msg, { 'retry-after': String(limit.retryAfterSec) });
        }

        await deps.saves.put(parsed.value, deps.now());
        return json(202, { status: 'pending', message: 'Thanks! Your save will appear on the memory card once it has been reviewed.' });
      }

      return err(405, 'method_not_allowed', 'Use GET or POST.', { allow: 'GET, POST' });
    } catch (e) {
      console.error('unhandled error', e instanceof Error ? { name: e.name, message: e.message } : e);   // no request data in the logs
      return err(500, 'server_error', 'Something went wrong. Please try again.');
    }
  };
}

/** Entry point used by Lambda: wires the real DynamoDB table. */
const stores = createStores(process.env.TABLE_NAME ?? '');
export const handler = createHandler({ saves: stores.saves, counters: stores.counters, salt: process.env.IP_SALT ?? 'dev-salt', now: () => new Date() });
