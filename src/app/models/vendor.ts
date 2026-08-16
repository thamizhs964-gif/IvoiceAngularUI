export interface Vendor
{
    Id: number;
    VendorCode: string;
    VendorName: string;
    ContactPerson?: string;
    MobileNo?: string;
    Email?: string;
    Address1?: string;
    Address2?: string;
    City?: string;
    State?: string;
    Country?: string;
    ZipCode?: string;
    GstNo?: string;
    IsActive?: boolean;
    IsDeleted?: boolean;
}