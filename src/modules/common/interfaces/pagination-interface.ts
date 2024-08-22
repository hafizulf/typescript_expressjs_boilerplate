export interface IPagination {
  page: number,
  limit: number,
  offset: number,
  totalRows: number,
  currentRows: number,
  totalPages: number,
  prevPage: number | null,
  nextPage: number | null,
}
