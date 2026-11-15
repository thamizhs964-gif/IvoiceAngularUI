 
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { Category } from '../models/category';
import { CategoryFilter } from '../models/category-filter';
import { ApiResponse } from '../models/api-response';
 
// Your API returns data[] and totalRecords at the root level.
export type CategoryListResponse = ApiResponse<Category[]> & {
  totalRecords: number;
};
 
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly http = inject(HttpClient);
 
  private readonly apiUrl = `${environment.apiUrl}/v1/Category`;
 
  // GET: api/v1/Category/GetAllPaged
  getPaged(
    filter: CategoryFilter,
  ): Observable<CategoryListResponse> {
 
    let params = new HttpParams()
      .set('code', filter.code ?? '')
      .set('name', filter.name ?? '')
      .set('pageNumber', String(filter.pageNumber))
      .set('pageSize', String(filter.pageSize));
 
      if (filter.isActive !== null && filter.isActive !== undefined) {
    params = params.set('isActive', String(filter.isActive));
  }
 
    return this.http.get<CategoryListResponse>(
      `${this.apiUrl}/GetAllPaged`,
      { params },
    );
  }
 
  getAll(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(
      `${this.apiUrl}/GetAll`
    );
  }
 
  getById(id: number): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(
      `${this.apiUrl}/GetById/${id}`
    );
  }
 
  create(category: Category): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(
      `${this.apiUrl}/Create`,
      category
    );
  }
 
  update(id: number, category: Category): Observable<boolean> {
    return this.http.put<boolean>(
      `${this.apiUrl}/Update/${id}`,
      category
    );
  }
}
 
 