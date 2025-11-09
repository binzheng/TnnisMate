import type {
	CatalogRepository,
	CourtDto,
	FacilityDto,
} from "~/server/core/usecases/catalog/ports";
import type { PrismaClient } from "~/server/generated-types";

export class PrismaCatalogRepository implements CatalogRepository {
	constructor(private db: PrismaClient) {}

	listFacilities(): Promise<FacilityDto[]> {
		return this.db.facility.findMany({
			orderBy: { name: "asc" },
			select: { id: true, name: true },
		}) as unknown as Promise<FacilityDto[]>;
	}
	listCourts(): Promise<
		Array<{ id: string; name: string; facility: { id: string; name: string } }>
	> {
		return this.db.court.findMany({
			orderBy: [{ facility: { name: "asc" } }, { name: "asc" }],
			select: {
				id: true,
				name: true,
				facility: { select: { name: true, id: true } },
			},
		}) as any;
	}
	createFacility(name: string): Promise<FacilityDto> {
		return this.db.facility.create({ data: { name } }) as any;
	}
	updateFacility(id: string, name: string): Promise<FacilityDto> {
		return this.db.facility.update({ where: { id }, data: { name } }) as any;
	}
	async deleteFacility(id: string): Promise<void> {
		await this.db.facility.delete({ where: { id } });
	}
	countCourtsByFacility(facilityId: string): Promise<number> {
		return this.db.court.count({ where: { facilityId } });
	}
	createCourt(name: string, facilityId: string): Promise<CourtDto> {
		return this.db.court.create({ data: { name, facilityId } }) as any;
	}
	updateCourt(id: string, name: string): Promise<CourtDto> {
		return this.db.court.update({ where: { id }, data: { name } }) as any;
	}
	async deleteCourt(id: string): Promise<void> {
		await this.db.court.delete({ where: { id } });
	}
	countReservationsByCourt(courtId: string): Promise<number> {
		return this.db.reservation.count({ where: { courtId } });
	}
}
