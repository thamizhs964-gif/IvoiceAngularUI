export interface CategoryFilter {
  code: string;
  name: string;
  isactive: boolean | null;
  pageNumber: number;
  pageSize: number;
}