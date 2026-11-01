/** Validation of a guestbook "save". Pure functions: no AWS, easy to test. */

export const COLORS = ['red', 'blue', 'green', 'pink', 'yellow', 'teal', 'orange', 'violet'] as const;
export type SaveColor = (typeof COLORS)[number];

export const LIMITS = { nameMax: 20, messageMax: 140, bodyMaxBytes: 2048 } as const;

export interface NewSave {
  name: string;
  message: string;
  color: SaveColor;
}

export type ParseResult =
  | { ok: true; value: NewSave }
  | { ok: false; status: 400 | 413; code: string; message: string };

const CONTROL = /[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2066-\u2069]/u;     // control, zero-width and bidi override characters
const NAME_OK = /^[\p{L}\p{N} ._'’\-!?]+$/u;
const LINK = /(https?:\/\/|www\.|[a-z0-9-]+\.(com|net|org|io|cl|ru|xyz|top|ly|me)\b)/i;
const MARKUP = /[<>]/;

/** Basic filter for the obvious: insults and slurs in Spanish and English. It is only a first net (it is easy to dodge); the real protection is that nothing is public until it is approved. */
const BAD_WORDS = new Set([
  'puta', 'puto', 'putas', 'putos', 'puta madre', 'hijueputa', 'hijodeputa', 'hdp', 'ctm', 'ctmre', 'conchetumare', 'conchesumare', 'culiao', 'culiado', 'weon', 'weona', 'aweonao', 'maricon', 'maricón', 'marica', 'mierda', 'pendejo', 'pendeja', 'cabron', 'cabrona', 'chingar', 'chinga', 'verga', 'pija', 'zorra', 'perra', 'imbecil', 'idiota', 'estupido', 'estupida', 'retrasado', 'retrasada', 'mongolo', 'subnormal', 'muerete', 'matate', 'violar', 'violador', 'nazi', 'hitler', 'sudaca', 'negro de mierda', 
  'fuck', 'fucking', 'fucker', 'motherfucker', 'shit', 'bitch', 'bastard', 'asshole', 'dick', 'cock', 'pussy', 'cunt', 'slut', 'whore', 'fag', 'faggot', 'retard', 'retarded', 'nigger', 'nigga', 'kike', 'chink', 'spic', 'tranny', 'rape', 'rapist', 'kys', 'kill yourself', 'idiot', 'stupid', 'moron', 
]);
const LEET: Record<string, string> = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', '$': 's' };
const normalize = (s: string): string => s.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/[013457@$]/g, (c) => LEET[c] ?? c).replace(/[^a-zñ ]/g, ' ').replace(/(.)\1{2,}/g, '$1$1').replace(/\s+/g, ' ').trim();
export function isOffensive(text: string): boolean {
  const n = normalize(text);
  const words = n.split(' ');
  const squashed = ` ${n} `;
  for (const w of BAD_WORDS) {
    const k = normalize(w);
    if (k.includes(' ') ? squashed.includes(` ${k} `) : words.includes(k) || words.includes(k + 's')) return true;
  }
  const letters = words.length > 2 && words.every((w) => w.length === 1) ? words.join('') : '';          // "p u t a" spelled out
  return letters !== '' && [...BAD_WORDS].some((w) => !w.includes(' ') && w.length > 3 && letters.includes(normalize(w)));
}

const fail = (code: string, message: string, status: 400 | 413 = 400): ParseResult => ({ ok: false, status, code, message });

const tidy = (s: string): string => s.normalize('NFC').replace(/\s+/gu, ' ').trim();

/** Parses the raw request body. Never trusts the shape: anything unexpected is a 400. */
export function parseSave(rawBody: string | null | undefined, isBase64 = false): ParseResult {
  if (!rawBody) return fail('empty_body', 'Send a JSON body with name and message.');
  const text = isBase64 ? Buffer.from(rawBody, 'base64').toString('utf8') : rawBody;
  if (Buffer.byteLength(text, 'utf8') > LIMITS.bodyMaxBytes) return fail('body_too_large', 'That request is too large.', 413);

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return fail('invalid_json', 'The body is not valid JSON.');
  }
  if (typeof data !== 'object' || data === null || Array.isArray(data)) return fail('invalid_body', 'The body must be a JSON object.');
  const o = data as Record<string, unknown>;

  if (typeof o.website === 'string' && o.website.trim() !== '') return fail('rejected', 'This request was rejected.');   // honeypot: real visitors never fill it
  if (typeof o.name !== 'string' || typeof o.message !== 'string') return fail('invalid_fields', 'name and message must be text.');

  const name = tidy(o.name);
  const message = tidy(o.message);
  if (name.length < 1) return fail('name_required', 'Add a short name or nickname.');
  if ([...name].length > LIMITS.nameMax) return fail('name_too_long', `The name can have up to ${LIMITS.nameMax} characters.`);
  if (CONTROL.test(name) || !NAME_OK.test(name) || LINK.test(name)) return fail('name_invalid', 'Use letters, numbers and simple punctuation in the name.');
  if (message.length < 1) return fail('message_required', 'Write a short message.');
  if ([...message].length > LIMITS.messageMax) return fail('message_too_long', `The message can have up to ${LIMITS.messageMax} characters.`);
  if (CONTROL.test(message) || MARKUP.test(message)) return fail('message_invalid', 'The message cannot contain markup or hidden characters.');
  if (LINK.test(message)) return fail('message_links', 'Links are not allowed in the guestbook.');
  if (isOffensive(name) || isOffensive(message)) return fail('not_friendly', 'Please keep the guestbook friendly: rephrase your message and try again.');

  let color: SaveColor;
  if (o.color === undefined || o.color === null || o.color === '') color = COLORS[Math.floor(Math.random() * COLORS.length)] as SaveColor;
  else if (typeof o.color === 'string' && (COLORS as readonly string[]).includes(o.color)) color = o.color as SaveColor;
  else return fail('invalid_color', `color must be one of: ${COLORS.join(', ')}.`);

  return { ok: true, value: { name, message, color } };
}
