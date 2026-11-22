export interface Customer {
  id: number;
  customerCode: string;
  customerName: string;
  mobileNo?: string | null;
  city?: string | null;   // ASSUMED: remove if your Customer DTO has no city/state
  state?: string | null;
  isActive?: boolean | null;
  isDeleted: boolean | false;
}
 
export interface CustomerFilter {
  customerCode: string;
  customerName: string;
  city: string;
  mobileNumber?: string | null;
  isActive: boolean | null;
  pageNumber: number;
  pageSize: number;
}
 
export interface CustomerRequest {
  customerCode: string;
  customerName: string;
  mobileNo?: string | null;
  city: string | null;
  state: string | null;
  isActive: boolean;
  isDeleted: boolean | false;
}
 
 