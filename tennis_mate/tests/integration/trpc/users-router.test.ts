import { describe, it, expect } from 'vitest';
import { createCaller } from '@/server/api/root';

function makeCtx(_role: 'admin' | 'operator' | 'player', db: any) {
  return {
    db,
    session: { user: { id: 'me', name: 'Me', email: 'me@example.com' } } as any,
    requestId: 'req1',
    headers: new Headers(),
  };
}

describe('tRPC users router (integration)', () => {
  it('admin can full-cycle: create -> list -> update -> reset -> delete', async () => {
    const store: any[] = [];
    const db = {
      user: {
        findUnique: async ({ where }: any) => ({ id: where.id, role: 'admin' }),
        findMany: async () => store.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role })),
        create: async ({ data }: any) => { const id = `u${store.length + 1}`; const row = { id, ...data }; store.push(row); return row; },
        update: async ({ where, data }: any) => { const i = store.findIndex(u=>u.id===where.id); store[i] = { ...store[i], ...data }; return store[i]; },
        delete: async ({ where }: any) => { const i = store.findIndex(u=>u.id===where.id); if (i>=0) store.splice(i,1); return { id: where.id }; },
      },
    };

    const caller = createCaller(makeCtx('admin', db) as any);
    const created = await caller.users.create({ email: 'new@example.com', name: 'New', role: 'coach', password: 'pass1234' });
    expect(created.email).toBe('new@example.com');
    const list1 = await caller.users.list();
    expect(list1.length).toBe(1);
    const updated = await caller.users.update({ id: created.id, name: 'NewName' });
    expect(updated.name).toBe('NewName');
    await caller.users.resetPassword({ id: created.id, password: 'changed' });
    await caller.users.remove({ id: created.id });
    const list2 = await caller.users.list();
    expect(list2.length).toBe(0);
  });

  it('operator can list but not create', async () => {
    const db = { user: { findUnique: async () => ({ id:'me', role:'operator' }), findMany: async () => [], create: async () => ({}) } };
    const caller = createCaller(makeCtx('operator', db) as any);
    await expect(caller.users.list()).resolves.toEqual([]);
    await expect(caller.users.create({ email: 'x@y', password: 'aA12345' })).rejects.toBeTruthy();
  });

  it('validates email format on create', async () => {
    const store: any[] = [];
    const db = {
      user: {
        findUnique: async ({ where }: any) => ({ id: where.id, role: 'admin' }),
        create: async ({ data }: any) => { const id = `u${store.length + 1}`; const row = { id, ...data }; store.push(row); return row; },
      },
    };
    const caller = createCaller(makeCtx('admin', db) as any);
    await expect(caller.users.create({ email: 'invalid-email', password: 'pass1234' })).rejects.toThrow();
  });

  it('validates password length on create (min 6)', async () => {
    const store: any[] = [];
    const db = {
      user: {
        findUnique: async ({ where }: any) => ({ id: where.id, role: 'admin' }),
        create: async ({ data }: any) => { const id = `u${store.length + 1}`; const row = { id, ...data }; store.push(row); return row; },
      },
    };
    const caller = createCaller(makeCtx('admin', db) as any);
    await expect(caller.users.create({ email: 'test@example.com', password: '12345' })).rejects.toThrow();
  });

  it('validates password length on reset (min 6)', async () => {
    const store: any[] = [];
    const db = {
      user: {
        findUnique: async ({ where }: any) => ({ id: where.id, role: 'admin' }),
        update: async ({ where, data }: any) => ({ id: where.id, ...data }),
      },
    };
    const caller = createCaller(makeCtx('admin', db) as any);
    await expect(caller.users.resetPassword({ id: 'u1', password: '12345' })).rejects.toThrow();
  });

  it('validates role enum on create', async () => {
    const store: any[] = [];
    const db = {
      user: {
        findUnique: async ({ where }: any) => ({ id: where.id, role: 'admin' }),
        create: async ({ data }: any) => { const id = `u${store.length + 1}`; const row = { id, ...data }; store.push(row); return row; },
      },
    };
    const caller = createCaller(makeCtx('admin', db) as any);
    await expect(caller.users.create({ email: 'test@example.com', role: 'invalid' as any })).rejects.toThrow();
  });

  it('create without password is allowed', async () => {
    const store: any[] = [];
    const db = {
      user: {
        findUnique: async ({ where }: any) => ({ id: where.id, role: 'admin' }),
        create: async ({ data }: any) => { const id = `u${store.length + 1}`; const row = { id, ...data }; store.push(row); return row; },
      },
    };
    const caller = createCaller(makeCtx('admin', db) as any);
    const user = await caller.users.create({ email: 'test@example.com' });
    expect(user.email).toBe('test@example.com');
  });

  it('update validates email format', async () => {
    const db = {
      user: {
        findUnique: async ({ where }: any) => ({ id: where.id, role: 'admin' }),
        update: async ({ where, data }: any) => ({ id: where.id, ...data }),
      },
    };
    const caller = createCaller(makeCtx('admin', db) as any);
    await expect(caller.users.update({ id: 'u1', email: 'invalid-email' })).rejects.toThrow();
  });

  it('player cannot list users', async () => {
    const db = {
      user: {
        findUnique: async () => ({ id: 'me', role: 'player' }),
        findMany: async () => [],
      },
    };
    const caller = createCaller(makeCtx('player', db) as any);
    await expect(caller.users.list()).rejects.toThrow();
  });

  it('player cannot create user', async () => {
    const db = {
      user: {
        findUnique: async () => ({ id: 'me', role: 'player' }),
        create: async ({ data }: any) => ({ id: 'u1', ...data }),
      },
    };
    const caller = createCaller(makeCtx('player', db) as any);
    await expect(caller.users.create({ email: 'test@example.com' })).rejects.toThrow();
  });

  it('coach cannot update user', async () => {
    const db = {
      user: {
        findUnique: async () => ({ id: 'me', role: 'coach' }),
        update: async ({ where, data }: any) => ({ id: where.id, ...data }),
      },
    };
    const caller = createCaller(makeCtx('player', db) as any);
    await expect(caller.users.update({ id: 'u1', name: 'New Name' })).rejects.toThrow();
  });

  it('creates user with all roles', async () => {
    const store: any[] = [];
    const db = {
      user: {
        findUnique: async ({ where }: any) => ({ id: where.id, role: 'admin' }),
        create: async ({ data }: any) => { const id = `u${store.length + 1}`; const row = { id, ...data }; store.push(row); return row; },
      },
    };
    const caller = createCaller(makeCtx('admin', db) as any);

    const player = await caller.users.create({ email: 'player@example.com', role: 'player' });
    const coach = await caller.users.create({ email: 'coach@example.com', role: 'coach' });
    const operator = await caller.users.create({ email: 'operator@example.com', role: 'operator' });
    const admin = await caller.users.create({ email: 'admin@example.com', role: 'admin' });

    expect(player.role).toBe('player');
    expect(coach.role).toBe('coach');
    expect(operator.role).toBe('operator');
    expect(admin.role).toBe('admin');
  });

  it('remove returns ok status', async () => {
    const store: any[] = [{ id: 'u1', email: 'test@x', name: 'Test', role: 'player' }];
    const db = {
      user: {
        findUnique: async ({ where }: any) => ({ id: where.id, role: 'admin' }),
        delete: async ({ where }: any) => { const i = store.findIndex(u=>u.id===where.id); if (i>=0) store.splice(i,1); return { id: where.id }; },
      },
    };
    const caller = createCaller(makeCtx('admin', db) as any);
    const result = await caller.users.remove({ id: 'u1' });
    expect(result.ok).toBe(true);
  });

  it('resetPassword returns ok status', async () => {
    const db = {
      user: {
        findUnique: async ({ where }: any) => ({ id: where.id, role: 'admin' }),
        update: async ({ where, data }: any) => ({ id: where.id, ...data }),
      },
    };
    const caller = createCaller(makeCtx('admin', db) as any);
    const result = await caller.users.resetPassword({ id: 'u1', password: 'newpass123456' });
    expect(result.ok).toBe(true);
  });
});
