import { Injectable, signal } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Vendor } from "../models/vendor";
import { PagedResult } from "../models/paged-result";
 
@Injectable({ providedIn: 'root' })
 
export class VendorService
{
    private apiUrl = "http://localhost:5258/api/Vendor";
 
    vendors = signal<Vendor[]>([]);
 
    constructor(private http: HttpClient) { }
 
    getPagedVendors
    (
        vendorCode: string,
        vendorName: string,
        mobileNo: string,
        city: string,
        PageNumber: number,
        PageSize: number
    ): Observable<PagedResult<Vendor>>
    {
        let params = new HttpParams()
            .set('vendorCode', vendorCode || '')
            .set('vendorName', vendorName || '')
            .set('mobileNo', mobileNo || '')
            .set('city', city || '')
            .set('PageNumber', PageNumber)
            .set('PageSize', PageSize);
 
        return this.http.get<PagedResult<Vendor>>
            (`${this.apiUrl}/GetAllPaged`, { params });
    }
 
    GetAll(): Observable<Vendor[]>
    {
        return this.http.get<Vendor[]>(`${this.apiUrl}/GetAll`);
    }
 
    GetById(Id: number): Observable<Vendor>
    {
        return this.http.get<Vendor>(`${this.apiUrl}/GetById/${Id}`);
    }
 
    create(request: Vendor): Observable<number>
    {
        return this.http.post<number>(`${this.apiUrl}/Create`, request);
    }
 
    Update(Id: number, request: Vendor): Observable<boolean>
    {
        return this.http.put<boolean>(`${this.apiUrl}/Update/${Id}`, request);
    }
 
    delete(Id: number): Observable<boolean>
    {
        return this.http.delete<boolean>(`${this.apiUrl}/Delete/${Id}`);
    }
}