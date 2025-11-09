import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from '@/server/auth/password';

describe('password hashing', () => {
  it('hashes and verifies a password', () => {
    const hash = hashPassword('secret-1234');
    expect(hash).toMatch(/^pbkdf2\$/);
    expect(verifyPassword('secret-1234', hash)).toBe(true);
    expect(verifyPassword('wrong', hash)).toBe(false);
  });
});

