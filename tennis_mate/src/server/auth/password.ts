import { randomBytes, pbkdf2Sync, timingSafeEqual } from 'node:crypto';

const ITER = 100_000;
const KEYLEN = 32;
const DIGEST = 'sha256';

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const key = pbkdf2Sync(password, salt, ITER, KEYLEN, DIGEST);
  return `pbkdf2$${DIGEST}$${ITER}$${salt.toString('hex')}$${key.toString('hex')}`;
}

export function verifyPassword(password: string, stored?: string | null): boolean {
  if (!stored) return false;
  try {
    const parts = stored.split('$');
    if (parts.length < 5) return false;
    const [scheme, digest, iterStr, saltHex, keyHex] = parts as [string, string, string, string, string];
    if (scheme !== 'pbkdf2') return false;
    const iter = Number(iterStr);
    const salt = Buffer.from(String(saltHex), 'hex');
    const expected = Buffer.from(String(keyHex), 'hex');
    const actual = pbkdf2Sync(password, salt, iter, expected.length, digest as any);
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
