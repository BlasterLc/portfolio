/** DynamoDB access for the guestbook. One table, three kinds of items (see the key layout below). */
import { ConditionalCheckFailedException, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'node:crypto';
import type { CounterStore } from './limits.js';
import type { NewSave, SaveColor } from './validate.js';

/**
 * Key layout (table `pk` + `sk`, TTL attribute `expiresAt`):
 *   pending    pk = "PENDING"        sk = "<ISO time>#<id>"   -> new saves wait here until the owner approves them (deploy/moderate.sh)
 *   saves      pk = "SAVE"           sk = "<ISO time>#<id>"   -> approved saves, the only ones the public list returns
 *   counters   pk = "RL#..."         sk = "-"                 -> usage limits, deleted by TTL
 */
export const SAVE_TTL_DAYS = 60;
export const PENDING_TTL_DAYS = 14;                                // an unreviewed save disappears on its own

export interface Save {
  id: string;
  name: string;
  message: string;
  color: SaveColor;
  createdAt: string;
}

export interface SaveStore {
  put(save: NewSave, now: Date): Promise<Save>;     // stores it as pending: it is NOT public until approved
  list(limit: number): Promise<Save[]>;
}

export function createStores(tableName: string, client: DynamoDBDocumentClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))): { saves: SaveStore; counters: CounterStore } {
  return {
    saves: {
      async put(save, now) {
        const id = randomUUID().slice(0, 8);
        const createdAt = now.toISOString();
        const item = { pk: 'PENDING', sk: `${createdAt}#${id}`, id, ...save, createdAt, expiresAt: Math.floor(now.getTime() / 1000) + PENDING_TTL_DAYS * 86400 };
        await client.send(new PutCommand({ TableName: tableName, Item: item }));
        return { id, name: save.name, message: save.message, color: save.color, createdAt };
      },
      async list(limit) {
        const out = await client.send(new QueryCommand({
          TableName: tableName,
          KeyConditionExpression: 'pk = :p',
          ExpressionAttributeValues: { ':p': 'SAVE' },
          ScanIndexForward: false,
          Limit: limit,
        }));
        return (out.Items ?? []).map((i) => ({ id: String(i.id), name: String(i.name), message: String(i.message), color: i.color as SaveColor, createdAt: String(i.createdAt) }));
      },
    },
    counters: {
      async increment(key, max, expiresAt) {
        try {
          await client.send(new UpdateCommand({
            TableName: tableName,
            Key: { pk: key, sk: '-' },
            UpdateExpression: 'ADD cnt :one SET expiresAt = if_not_exists(expiresAt, :exp)',
            ConditionExpression: 'attribute_not_exists(cnt) OR cnt < :max',
            ExpressionAttributeValues: { ':one': 1, ':max': max, ':exp': expiresAt },
          }));
          return true;
        } catch (e) {
          if (e instanceof ConditionalCheckFailedException) return false;
          throw e;
        }
      },
    },
  };
}
