import { describe, it, expect } from 'vitest';
import { createCaller } from '@/server/api/root';

function ctx(db:any){ return { db, session: { user:{ id:'u1'}}, requestId:'req', headers: new Headers() } as any; }

describe('tRPC lessons.listSlots', () => {
  it('returns slots from db (protected)', async () => {
    const db = { lessonSlot: { findMany: async () => [{ id:'s1', courtId:'c1', start:new Date(0), end:new Date(1), capacity:1, court:{ name:'A'}}] } };
    const caller = createCaller(ctx(db));
    const rows = await caller.lessons.listSlots();
    expect(rows[0].id).toBe('s1');
  });
});

