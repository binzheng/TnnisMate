import { describe, it, expect } from 'vitest';
import { CreateReservationUseCase, UpdateReservationUseCase, CancelReservationUseCase } from '@/server/core/usecases/reservations/crud-usecases';
import type { ReservationRepository, ReservationSlot } from '@/server/core/usecases/reservations/ports';
import type { AuditPort } from '@/server/core/ports/audit';

class Repo implements ReservationRepository {
  slot: ReservationSlot = { id:'r1', courtId:'c1', userId:'u1', start:new Date(0), end:new Date(1) };
  async create(data:any){ return { ...this.slot, ...data, id:'r2' }; }
  async update(id:string,data:any){ return { ...this.slot, id, ...data }; }
  async cancel(id:string){ return { ...this.slot, id }; }
}
class CaptureAudit implements AuditPort { events:any[]=[]; log(e:any){ this.events.push(e);} }

describe('Reservation CRUD UseCases', () => {
  it('create/update/cancel call repo and audit', async () => {
    const repo = new Repo();
    const audit = new CaptureAudit();
    const c = new CreateReservationUseCase(repo as any, audit);
    const u = new UpdateReservationUseCase(repo as any, audit);
    const d = new CancelReservationUseCase(repo as any, audit);

    const created = await c.execute({ courtId:'c2', userId:'u9', start:new Date(2), end:new Date(3), requestId:'req' });
    expect(created.id).toBe('r2');
    const updated = await u.execute({ id:'r2', start:new Date(4), requestId:'req' });
    expect(updated.start.getTime()).toBe(new Date(4).getTime());
    const canceled = await d.execute({ id:'r2', requestId:'req' });
    expect(canceled.id).toBe('r2');
    const msgs = audit.events.map(e=>e.msg);
    expect(msgs).toEqual(expect.arrayContaining(['reservation.create','reservation.update','reservation.cancel']));
  });
});

