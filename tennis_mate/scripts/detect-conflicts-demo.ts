// Demo script adapted from the illustrative test. Not part of vitest runs.
import { InMemoryReservationReader, DetectConflictsUseCase, overlapsHalfOpen } from '@/server/core/usecases/reservations/detect-conflicts';
import type { ReservationSlot } from '@/server/core/usecases/reservations/ports';

const base = (overrides: Partial<ReservationSlot> = {}): ReservationSlot => ({
  id: overrides.id ?? 'r1',
  courtId: overrides.courtId ?? 'c1',
  userId: overrides.userId ?? 'u1',
  start: overrides.start ?? new Date('2025-01-01T09:00:00Z'),
  end: overrides.end ?? new Date('2025-01-01T10:00:00Z'),
});

export async function demo() {
  const data: ReservationSlot[] = [
    base({ id: 'r1' }),
    base({ id: 'r2', start: new Date('2025-01-01T10:00:00Z'), end: new Date('2025-01-01T11:00:00Z') }),
  ];
  const uc = new DetectConflictsUseCase(new InMemoryReservationReader(data));

  const res1 = await uc.execute({ start: new Date('2025-01-01T09:30:00Z'), end: new Date('2025-01-01T10:30:00Z'), courtId: 'c1', userId: 'u1' });
  console.log('res1', res1);

  const res2 = await uc.execute({ start: new Date('2025-01-01T10:00:00Z'), end: new Date('2025-01-01T11:00:00Z'), courtId: 'c1' });
  console.log('res2', res2);

  const res3 = await uc.execute({ start: new Date('2025-01-01T11:00:00Z'), end: new Date('2025-01-01T12:00:00Z'), courtId: 'c1' });
  console.log('res3', res3);

  // Quick pure function checks
  console.assert(overlapsHalfOpen(new Date(0), new Date(10), new Date(5), new Date(15)) === true, 'overlap');
  console.assert(overlapsHalfOpen(new Date(0), new Date(10), new Date(10), new Date(15)) === false, 'boundary half-open');
}

// To run manually in Node (ESM), import and call demo() from a small runner.
// e.g. create scripts/run-demo.mjs with: import { demo } from './detect-conflicts-demo.ts'; demo();

