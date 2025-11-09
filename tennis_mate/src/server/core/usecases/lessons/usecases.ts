import { TRPCError } from "@trpc/server";
import type { CreateSlotInput, LessonRepository, LessonSlotDto, SearchSlotsQuery, UpdateSlotInput } from "./ports";
import type { AuthzPort } from "~/server/core/ports/authz";
import type { AuditPort } from "~/server/core/ports/audit";

export class ListSlotsUseCase {
  constructor(private repo: LessonRepository, private audit?: AuditPort) {}
  async execute() {
    const res = await this.repo.listSlots();
    this.audit?.log({ level: 'info', msg: 'lesson.slot.list' });
    return res;
  }
}

export class CreateSlotUseCase {
  constructor(private repo: LessonRepository, private authz: AuthzPort, private audit?: AuditPort) {}
  async execute(userId: string, input: CreateSlotInput): Promise<LessonSlotDto> {
    await this.authz.requireRole(userId, ["coach", "operator", "admin"]);
    const slot = await this.repo.createSlot(input);
    this.audit?.log({ level: 'info', msg: 'lesson.slot.create', userId, resource: `lessonSlot:${slot.id}` });
    return slot;
  }
}

export class UpdateSlotUseCase {
  constructor(private repo: LessonRepository, private authz: AuthzPort, private audit?: AuditPort) {}
  async execute(userId: string, input: UpdateSlotInput): Promise<LessonSlotDto> {
    await this.authz.requireRole(userId, ["coach", "operator", "admin"]);
    const slot = await this.repo.updateSlot(input);
    this.audit?.log({ level: 'info', msg: 'lesson.slot.update', userId, resource: `lessonSlot:${slot.id}` });
    return slot;
  }
}

export class DeleteSlotUseCase {
  constructor(private repo: LessonRepository, private authz: AuthzPort, private audit?: AuditPort) {}
  async execute(userId: string, id: string): Promise<void> {
    await this.authz.requireRole(userId, ["operator", "admin"]);
    const cnt = await this.repo.countReservationsForSlot(id);
    if (cnt > 0) throw new TRPCError({ code: "BAD_REQUEST", message: "予約が存在するため削除できません" });
    await this.repo.deleteSlot(id);
    this.audit?.log({ level: 'info', msg: 'lesson.slot.delete', userId, resource: `lessonSlot:${id}` });
  }
}

export class SearchCandidateSlotsUseCase {
  constructor(private repo: LessonRepository) {}
  execute(q: SearchSlotsQuery) { return this.repo.searchCandidateSlots(q); }
}

export class BulkChangeReservationsUseCase {
  constructor(private repo: LessonRepository, private authz: AuthzPort, private audit?: AuditPort) {}
  async execute(userId: string, reservationIds: string[], targetSlotId: string): Promise<number> {
    await this.authz.requireRole(userId, ["operator", "admin"]);
    const updated = await this.repo.bulkChangeReservations(reservationIds, targetSlotId);
    this.audit?.log({ level: 'info', msg: 'lesson.reservation.bulkChange', userId, resource: `lessonSlot:${targetSlotId}`, meta: { count: updated } });
    return updated;
  }
}
