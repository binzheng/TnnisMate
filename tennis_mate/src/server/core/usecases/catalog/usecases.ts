import { TRPCError } from "@trpc/server";
import type { CatalogRepository } from "./ports";

export class ListFacilitiesUseCase {
	constructor(private repo: CatalogRepository) {}
	execute() {
		return this.repo.listFacilities();
	}
}
export class ListCourtsUseCase {
	constructor(private repo: CatalogRepository) {}
	async execute() {
		const rows = await this.repo.listCourts();
		return rows.map((c) => ({
			id: c.id,
			name: c.name,
			facilityId: c.facility.id,
			facilityName: c.facility.name,
		}));
	}
}

export class CreateFacilityUseCase {
	constructor(private repo: CatalogRepository) {}
	execute(name: string) {
		return this.repo.createFacility(name);
	}
}
export class UpdateFacilityUseCase {
	constructor(private repo: CatalogRepository) {}
	execute(id: string, name: string) {
		return this.repo.updateFacility(id, name);
	}
}
export class DeleteFacilityUseCase {
	constructor(private repo: CatalogRepository) {}
	async execute(id: string) {
		const courts = await this.repo.countCourtsByFacility(id);
		if (courts > 0)
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "施設に紐づくコートがあるため削除できません",
			});
		await this.repo.deleteFacility(id);
	}
}

export class CreateCourtUseCase {
	constructor(private repo: CatalogRepository) {}
	execute(name: string, facilityId: string) {
		return this.repo.createCourt(name, facilityId);
	}
}
export class UpdateCourtUseCase {
	constructor(private repo: CatalogRepository) {}
	execute(id: string, name: string) {
		return this.repo.updateCourt(id, name);
	}
}
export class DeleteCourtUseCase {
	constructor(private repo: CatalogRepository) {}
	async execute(id: string) {
		const reservations = await this.repo.countReservationsByCourt(id);
		if (reservations > 0)
			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "予約が存在するためコートを削除できません",
			});
		await this.repo.deleteCourt(id);
	}
}
