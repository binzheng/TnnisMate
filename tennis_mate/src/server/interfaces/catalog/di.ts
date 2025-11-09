import { PrismaCatalogRepository } from "~/server/adapters/catalog/prisma-catalog-repo";
import {
	CreateCourtUseCase,
	CreateFacilityUseCase,
	DeleteCourtUseCase,
	DeleteFacilityUseCase,
	ListCourtsUseCase,
	ListFacilitiesUseCase,
	UpdateCourtUseCase,
	UpdateFacilityUseCase,
} from "~/server/core/usecases/catalog/usecases";
import type { PrismaClient } from "~/server/generated-types";

export function createCatalogUseCases(db: PrismaClient) {
	const repo = new PrismaCatalogRepository(db);
	return {
		listFacilities: new ListFacilitiesUseCase(repo),
		listCourts: new ListCourtsUseCase(repo),
		createFacility: new CreateFacilityUseCase(repo),
		updateFacility: new UpdateFacilityUseCase(repo),
		deleteFacility: new DeleteFacilityUseCase(repo),
		createCourt: new CreateCourtUseCase(repo),
		updateCourt: new UpdateCourtUseCase(repo),
		deleteCourt: new DeleteCourtUseCase(repo),
	} as const;
}
