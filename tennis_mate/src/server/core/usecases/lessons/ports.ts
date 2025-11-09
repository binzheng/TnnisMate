export type SlotId = string;

export interface LessonSlotDto {
  id: string;
  courtId: string;
  coachId?: string | null;
  capacity: number;
  start: Date;
  end: Date;
  court?: { name: string };
}

export interface ListSlotsResult extends Array<LessonSlotDto> {}

export interface CreateSlotInput {
  courtId: string;
  coachId?: string;
  capacity: number;
  start: Date;
  end: Date;
}

export interface UpdateSlotInput {
  id: string;
  capacity?: number;
  start?: Date;
  end?: Date;
  coachId?: string;
}

export interface SearchSlotsQuery {
  start?: Date;
  end?: Date;
  courtId?: string;
  coachId?: string;
}

export interface LessonRepository {
  listSlots(): Promise<ListSlotsResult>;
  createSlot(input: CreateSlotInput): Promise<LessonSlotDto>;
  updateSlot(input: UpdateSlotInput): Promise<LessonSlotDto>;
  deleteSlot(id: SlotId): Promise<void>;
  countReservationsForSlot(id: SlotId): Promise<number>;
  searchCandidateSlots(q: SearchSlotsQuery): Promise<LessonSlotDto[]>;
  bulkChangeReservations(reservationIds: string[], targetSlotId: string): Promise<number>;
}

export type Role = "player" | "coach" | "operator" | "admin" | undefined;
export interface RoleRepository {
  getRole(userId: string): Promise<Role>;
}

