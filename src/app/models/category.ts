export interface Category {
  id: number;
  code: string;
  name: string;
  description?: string;
  IsActive: boolean;
  createdBy?: string;
  createdDate?: string;
  updatedBy?: string;
  updatedDate?: string;
}
 
export interface CategoryFilter {
  code: string;
  name: string;
  IsActive: boolean | null;
  pageNumber: number;
  pageSize: number;
}
 
export interface CategoryRequest {
  code: string;
  name: string;
  description?: string | null;
  IsActive: boolean;
}
 
 