import { describe, it, expect } from 'vitest';
import { ListSlotsUseCase } from '@/server/core/usecases/lessons/usecases';
import type { LessonRepository, LessonSlotDto } from '@/server/core/usecases/lessons/ports';
import type { AuditPort } from '@/server/core/ports/audit';

class InMemoryLessonRepo implements LessonRepository {
  constructor(private slots: LessonSlotDto[]) {}
  listSlots() { return Promise.resolve(this.slots); }
  createSlot(): any { throw new Error('not used'); }
  updateSlot(): any { throw new Error('not used'); }
  deleteSlot(): any { throw new Error('not used'); }
  countReservationsForSlot(): any { throw new Error('not used'); }
  searchCandidateSlots(): any { throw new Error('not used'); }
  bulkChangeReservations(): any { throw new Error('not used'); }
}
class CaptureAudit implements AuditPort { events: any[]=[]; log(e:any){ this.events.push(e);} }

describe('ListSlotsUseCase', () => {
  it('lists slots and emits audit', async () => {
    const repo = new InMemoryLessonRepo([{ id: 's1', courtId:'c1', capacity:1, start:new Date(0), end:new Date(1) } as any]);
    const audit = new CaptureAudit();
    const uc = new ListSlotsUseCase(repo as any, audit);
    const res = await uc.execute();
    expect(res).toHaveLength(1);
    expect(audit.events.some(e => e.msg === 'lesson.slot.list')).toBe(true);
  });
});

