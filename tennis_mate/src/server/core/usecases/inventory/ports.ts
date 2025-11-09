export interface StartCsvImportInput { source?: string; rows: Array<Record<string, string>> }
export interface ImportJobDto { id: string; type: string; source?: string | null; status: string; createdAt: Date; finishedAt?: Date | null; added?: number | null; updated?: number | null; removed?: number | null }

export interface InventoryRepository {
  createJob(type: 'csv', source: string): Promise<ImportJobDto>;
  finishJob(id: string, data: { status: 'success'|'failed'; finishedAt: Date; added?: number }): Promise<ImportJobDto>;
  listJobs(limit: number): Promise<ImportJobDto[]>;
}
