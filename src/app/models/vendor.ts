export interface Vendor {
  id: number;
  vendorCode: string;
  vendorName: string;
  mobileNo: string | null;
  city?: string | null;   // ASSUMED: remove if your Vendor DTO has no city/state
  state?: string | null;
  isActive?: boolean | null;
  isDeleted: boolean | false;
}
 
export interface VendorFilter {
  vendorCode: string;
  vendorName: string;
  mobileNumber: string;
  city: string;
  isActive: boolean | null;
  pageNumber: number;
  pageSize: number;
}
 
export interface VendorRequest {
  vendorCode: string;
  vendorName: string;
  mobileNo: string;
  city: string | null;
  state: string | null;
  isActive: boolean;
  isDeleted: boolean | false;
}