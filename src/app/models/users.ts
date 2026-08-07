import { isActive } from "@angular/router";

export interface Users
{
     id: number;
    userName: string;
    email: string;
    password: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    displayName: string;
    phoneNumber: string;
    alternatePhone?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    dateOfBirth: string;
    isActive: boolean;

}