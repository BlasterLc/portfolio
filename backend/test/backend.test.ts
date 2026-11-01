import { describe, expect, it } from 'vitest';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { createHandler } from '../src/handler.js';
import { CAPS, checkLimits, visitorHash, type CounterStore } from '../src/limits.js';
import type { Save, SaveStore } from '../src/store.js';
import { COLORS, LIMITS, parseSave } from '../src/validate.js';

const body = (o: unknown) => JSON.stringify(o);
const ok = (o: unknown) => parseSave(body(o));

describe('parseSave', () => {
  it('accepts a normal save and tidies spaces', () => {
    const r = ok({ name: '  Ana   M  ', message: 'Great  room!', color: 'teal' });
    expect(r).toEqual({ ok: true, value: { name: 'Ana M', message: 'Great room!', color: 'teal' } });
  });
  it('picks a random valid color when none is sent', () => {
    const r = ok({ name: 'Ana', message: 'hi' });
    expect(r.ok && (COLORS as readonly string[]).includes(r.value.color)).toBe(true);
  });
  it('accepts accents, emoji-free punctuation and non latin letters', () => {
    expect(ok({ name: 'José-Ñandú', message: '¡Qué nostalgia! ¿Y la PS2?' }).ok).toBe(true);
    expect(ok({ name: 'Юлия', message: 'ok' }).ok).toBe(true);
  });
  it.each([
    ['empty name', { name: '   ', message: 'x' }, 'name_required'],
    ['name too long', { name: 'a'.repeat(LIMITS.nameMax + 1), message: 'x' }, 'name_too_long'],
    ['name with markup', { name: '<b>x</b>', message: 'x' }, 'name_invalid'],
    ['name that is a link', { name: 'spam.com', message: 'x' }, 'name_invalid'],
    ['empty message', { name: 'Ana', message: ' ' }, 'message_required'],
    ['message too long', { name: 'Ana', message: 'a'.repeat(LIMITS.messageMax + 1) }, 'message_too_long'],
    ['html in message', { name: 'Ana', message: 'hi <script>alert(1)</script>' }, 'message_invalid'],
    ['link in message', { name: 'Ana', message: 'see https://example.com' }, 'message_links'],
    ['bare domain in message', { name: 'Ana', message: 'visit my-site.com now' }, 'message_links'],
    ['hidden characters', { name: 'Ana', message: 'hi' + String.fromCharCode(0x200b) + ' there' }, 'message_invalid'],
    ['bidi override', { name: 'Ana', message: 'abc' + String.fromCharCode(0x202e) + 'def' }, 'message_invalid'],
    ['bad color', { name: 'Ana', message: 'x', color: 'black' }, 'invalid_color'],
    ['honeypot filled', { name: 'Ana', message: 'x', website: 'http://bot' }, 'rejected'],
    ['numbers instead of text', { name: 1, message: 2 }, 'invalid_fields'],
  ])('rejects %s', (_label, input, code) => {
    const r = ok(input);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.code).toBe(code);
  });
  it('counts characters, not bytes (140 emoji-less accented characters pass)', () => {
    expect(ok({ name: 'Ana', message: 'é'.repeat(LIMITS.messageMax) }).ok).toBe(true);
  });
  it('rejects non-JSON, arrays, empty and oversized bodies', () => {
    expect(parseSave('not json')).toMatchObject({ ok: false, code: 'invalid_json' });
    expect(parseSave('[]')).toMatchObject({ ok: false, code: 'invalid_body' });
    expect(parseSave('')).toMatchObject({ ok: false, code: 'empty_body' });
    expect(parseSave(body({ name: 'a', message: 'x'.repeat(3000) }))).toMatchObject({ ok: false, status: 413, code: 'body_too_large' });
  });
  it('decodes base64 bodies', () => {
    const b64 = Buffer.from(body({ name: 'Ana', message: 'hola' })).toString('base64');
    expect(parseSave(b64, true).ok).toBe(true);
  });
});

/** In-memory counter store with the same contract as the DynamoDB one. */
function fakeCounters() {
  const map = new Map<string, number>();
  const store: CounterStore = {
    async increment(key, max) {
      const n = map.get(key) ?? 0;
      if (n >= max) return false;
      map.set(key, n + 1);
      return true;
    },
  };
  return { store, map };
}

describe('checkLimits', () => {
  const t = new Date('2026-11-02T15:30:10Z');
  it('allows a visitor up to the hourly cap and then says when to retry', async () => {
    const { store } = fakeCounters();
    for (let i = 0; i < CAPS.perVisitorPerHour; i++) expect((await checkLimits(store, 'v1', t)).ok).toBe(true);
    const r = await checkLimits(store, 'v1', t);
    expect(r).toMatchObject({ ok: false, scope: 'visitor' });
    expect(r.ok === false && r.retryAfterSec).toBe(3600 - (30 * 60 + 10));
  });
  it('caps the whole site per minute, across visitors', async () => {
    const { store } = fakeCounters();
    for (let i = 0; i < CAPS.perMinute; i++) expect((await checkLimits(store, `v${i}`, t)).ok).toBe(true);
    expect(await checkLimits(store, 'someone-else', t)).toMatchObject({ ok: false, scope: 'minute' });
    expect((await checkLimits(store, 'someone-else', new Date(t.getTime() + 60_000))).ok).toBe(true);   // next minute: free again
  });
  it('caps the whole site per day', async () => {
    const { store } = fakeCounters();
    let denied = 0;
    for (let m = 0; m < 40 && denied === 0; m++) for (let i = 0; i < CAPS.perMinute; i++) {
      const r = await checkLimits(store, `v${m}-${i}`, new Date(t.getTime() + m * 60_000));
      if (!r.ok) { denied++; expect(r.scope).toBe('day'); break; }
    }
    expect(denied).toBe(1);
  });
  it('hashes the IP and never returns it', () => {
    const h = visitorHash('203.0.113.9', 'salt');
    expect(h).toMatch(/^[0-9a-f]{24}$/);
    expect(h).not.toContain('203');
    expect(visitorHash('203.0.113.9', 'other')).not.toBe(h);
  });
});

function fakeSaves() {
  const rows: Save[] = [], pending: Save[] = [];       // like the real table: new saves are pending and only approved ones are public
  const store: SaveStore = {
    async put(s, now) { const save = { id: String(pending.length + rows.length + 1), ...s, createdAt: now.toISOString() }; pending.unshift(save); return save; },
    async list(limit) { return rows.slice(0, limit); },
  };
  const approve = () => { rows.unshift(...pending.splice(0)); };
  return { store, rows, pending, approve };
}

const ev = (method: string, path: string, over: Partial<APIGatewayProxyEventV2> = {}): APIGatewayProxyEventV2 => ({
  version: '2.0', routeKey: `${method} ${path}`, rawPath: path, rawQueryString: '', headers: { 'content-type': 'application/json' }, isBase64Encoded: false,
  requestContext: { http: { method, path, protocol: 'HTTP/1.1', sourceIp: '198.51.100.7', userAgent: 'test' } } as APIGatewayProxyEventV2['requestContext'],
  ...over,
});

describe('handler', () => {
  const make = () => {
    const saves = fakeSaves(), counters = fakeCounters();
    const h = createHandler({ saves: saves.store, counters: counters.store, salt: 's', now: () => new Date('2026-11-02T15:30:10Z') });
    return { h, saves, counters };
  };
  it('creates a pending save (202) that is only listed, newest first, once approved', async () => {
    const { h, saves } = make();
    const created = await h(ev('POST', '/saves', { body: body({ name: 'Ana', message: 'hello', color: 'pink' }) }));
    expect(created).toMatchObject({ statusCode: 202 });
    await h(ev('POST', '/saves', { body: body({ name: 'Beto', message: 'second' }), requestContext: { http: { method: 'POST', path: '/saves', protocol: 'HTTP/1.1', sourceIp: '198.51.100.8', userAgent: 't' } } as APIGatewayProxyEventV2['requestContext'] }));
    const before = await h(ev('GET', '/saves'));
    expect(JSON.parse(String((before as { body: string }).body)).saves).toEqual([]);
    saves.approve();
    const list = await h(ev('GET', '/saves'));
    const data = JSON.parse(String((list as { body: string }).body));
    expect(list).toMatchObject({ statusCode: 200 });
    expect(data.saves.map((s: Save) => s.name)).toEqual(['Beto', 'Ana']);
  });
  it('never echoes the visitor address and sets safe headers', async () => {
    const { h } = make();
    const r = await h(ev('POST', '/saves', { body: body({ name: 'Ana', message: 'hello' }) })) as { body: string; headers: Record<string, string> };
    expect(r.body).not.toContain('198.51.100.7');
    expect(r.headers['cache-control']).toBe('no-store');
    expect(r.headers['x-content-type-options']).toBe('nosniff');
  });
  it('returns clean errors: 400, 404, 405, 415, 429', async () => {
    const { h } = make();
    expect(await h(ev('POST', '/saves', { body: body({ name: '', message: 'x' }) }))).toMatchObject({ statusCode: 400 });
    expect(await h(ev('GET', '/other'))).toMatchObject({ statusCode: 404 });
    expect(await h(ev('DELETE', '/saves'))).toMatchObject({ statusCode: 405, headers: { allow: 'GET, POST' } });
    expect(await h(ev('POST', '/saves', { headers: { 'content-type': 'text/plain' }, body: 'x' }))).toMatchObject({ statusCode: 415 });
    for (let i = 0; i < CAPS.perVisitorPerHour; i++) await h(ev('POST', '/saves', { body: body({ name: 'Ana', message: 'again' }) }));
    const limited = await h(ev('POST', '/saves', { body: body({ name: 'Ana', message: 'again' }) })) as { statusCode: number; headers: Record<string, string> };
    expect(limited.statusCode).toBe(429);
    expect(Number(limited.headers['retry-after'])).toBeGreaterThan(0);
  });
  it('does not count invalid requests against the limits', async () => {
    const { h, counters } = make();
    await h(ev('POST', '/saves', { body: body({ name: '', message: 'x' }) }));
    expect(counters.map.size).toBe(0);
  });
  it('turns store failures into a generic 500 without leaking details', async () => {
    const h = createHandler({ saves: { put: async () => { throw new Error('secret table name'); }, list: async () => [] }, counters: fakeCounters().store, salt: 's', now: () => new Date() });
    const r = await h(ev('POST', '/saves', { body: body({ name: 'Ana', message: 'hello' }) })) as { statusCode: number; body: string };
    expect(r.statusCode).toBe(500);
    expect(r.body).not.toContain('secret');
  });
});

describe('friendly-language filter', () => {
  it.each(['eres un idiota', 'fuck you', 'p u t a', 'ID1OT', 'hijueputa!!', 'kill yourself'])('rejects %s', (m) => {
    const r = parseSave(JSON.stringify({ name: 'Ana', message: m }));
    expect(r).toMatchObject({ ok: false, code: 'not_friendly' });
  });
  it('rejects an offensive name too', () => {
    expect(parseSave(JSON.stringify({ name: 'puto', message: 'hola' }))).toMatchObject({ ok: false, code: 'not_friendly' });
  });
  it.each(['Great work, loved the room!', 'Me encantó la PS2, muy nostálgico', 'Classic Scunthorpe and Dickens', 'Cono de helado'])('lets %s through', (m) => {
    expect(parseSave(JSON.stringify({ name: 'Ana', message: m }))).toMatchObject({ ok: true });
  });
});
