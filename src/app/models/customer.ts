export interface Customer
{
    id:number;
    customerCode:string;
    customerName:string;
    contactPerson?:string;
    mobileNo?:string;
    email?:string;
    address1?:string;
    address2?:string;
    city?:string;
    state?:string;
    country?:string;
    zipCode?:string;
    gstNo?:string;
    isActive?:boolean;
    isDeleted?:boolean;

}