import {Injectable,signal} from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Itemmaster } from "../models/itemmaster";
import { PagedResult } from "../models/paged-result";
 
@Injectable({providedIn:'root'})
 
export class ItemmasterService
{
    private apiUrl="http://localhost:5258/api/ItemMaster";
    items = signal<Itemmaster[]>([]);
    constructor(private http:HttpClient){}
    getPagedItems
    (
        catCode: string,
        itemName: string,
        uom: string,
        PageNumber: number,
        PageSize:number
    ): Observable<PagedResult<Itemmaster>>
    {
        let params =  new HttpParams()
        .set('catCode', catCode || '')
        .set('itemName', itemName || '')
        .set('uom', uom || '')
        .set('PageNumber', PageNumber)
        .set('PageSize', PageSize);
        return this.http.get<PagedResult<Itemmaster>>
        (`${this.apiUrl}/GetAllPaged`, {params});
    }
    GetAll():Observable<Itemmaster[]>
    {
        return this.http.get<Itemmaster[]>(`${this.apiUrl}/GetAll`);
    }
    GetById(Id:number):Observable<Itemmaster>
    {
        return this.http.get<Itemmaster>(`${this.apiUrl}/GetById/${Id}`);
    }
    create(request:Itemmaster):Observable<number>
    {
        return this.http.post<number>(`${this.apiUrl}/Create`,request);
    }
    Update(Id:number, request:Itemmaster):Observable<boolean>
    {
        return this.http.put<boolean>(`${this.apiUrl}/Update/${Id}`,request);
    }
    delete(Id:number):Observable<boolean>
    {
        return this.http.delete<boolean>(`${this.apiUrl}/delete/${Id}`);
    }
}
 
 