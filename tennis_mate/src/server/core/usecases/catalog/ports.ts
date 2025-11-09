export interface FacilityDto {
	id: string;
	name: string;
}
export interface CourtDto {
	id: string;
	name: string;
	facilityId: string;
	facilityName?: string;
}

export interface CatalogRepository {
	listFacilities(): Promise<FacilityDto[]>;
	listCourts(): Promise<
		Array<{ id: string; name: string; facility: { id: string; name: string } }>
	>;
	createFacility(name: string): Promise<FacilityDto>;
	updateFacility(id: string, name: string): Promise<FacilityDto>;
	deleteFacility(id: string): Promise<void>;
	countCourtsByFacility(facilityId: string): Promise<number>;
	createCourt(name: string, facilityId: string): Promise<CourtDto>;
	updateCourt(id: string, name: string): Promise<CourtDto>;
	deleteCourt(id: string): Promise<void>;
	countReservationsByCourt(courtId: string): Promise<number>;
}
