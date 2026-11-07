export interface CategoryFilter {
  code: string;
  name: string;
  isActive: boolean | null;
  pageNumber: number;
  pageSize: number;
}