import { Injectable, signal } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Category } from "../models/category";
import { PagedResult } from "../models/paged-result";

@Injectable({ providedIn: 'root'})

export class CategoryService 
{
  private apiUrl = "http://localhost:5258/api/Category";
  categories = signal<Category[]>([]);
  constructor(
    private http: HttpClient) {}
  getPagedItems
  (
    code: string,
    name: string,
    PageNumber: number,
    PageSize: number
  ): Observable<PagedResult<Category>> 
  {
    let params = new HttpParams()
      .set('code', code || '')
      .set('name', name || '')
      .set('PageNumber', PageNumber)
      .set('PageSize', PageSize);
    return this.http.get<PagedResult<Category>>
    (`${this.apiUrl}/GetAllPaged`,{ params });
  }

  GetAll(): Observable<Category[]> 
  {
    return this.http.get<Category[]>(`${this.apiUrl}/GetAll`);
  }
  GetById(Id: number): Observable<Category> 
  {
    return this.http.get<Category>(`${this.apiUrl}/GetById/${Id}`);
  }
  create(request: Category): Observable<number> 
  {
    return this.http.post<number>(`${this.apiUrl}/Create`,request);
  }
  Update(Id: number, request: Category): Observable<boolean> 
  {
    return this.http.put<boolean>(`${this.apiUrl}/Update/${Id}`,request);
  }
  delete(Id: number): Observable<boolean>
  {
    return this.http.delete<boolean>(`${this.apiUrl}/Delete/${Id}`);
  }
}