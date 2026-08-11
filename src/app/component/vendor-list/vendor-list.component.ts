import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { VendorService } from '../../services/vendor.service';
import { Vendor } from '../../models/vendor';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';
import { VendorFormComponent } from '../vendor-form/vendor-form.component';
import { PagedResult } from '../../models/paged-result';
 
@Component({
  selector: 'app-vendor-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.css'],
})
export class VendorListComponent implements OnInit {
 
  vendors = signal<Vendor[]>([]);
  dataSource!: MatTableDataSource<Vendor>;
 
  displayedColumns: string[] = [
    'vendorCode',
    'vendorName',
    'contactPerson',
    'mobileNo',
    'email',
    'city',
    'state',
    'country',
    'gstNo',
    'isActive',
    'actions',
  ];
 
  isLoading = false;
 
  filterForm!: FormGroup;
  pageSize = 10;
  pageIndex = 0;
  totalRecords = 0;
 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
 
  constructor(
    private service: VendorService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private fb: FormBuilder,
  ) {}
 
  ngOnInit(): void {
    this.initFilterForm();
    this.loadVendors();
  }
 
  initFilterForm() {
 
    this.filterForm = this.fb.group({
      vendorCode: [''],
      vendorName: [''],
      mobileNo: [''],
      city: ['']
    });
 
    this.filterForm.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.pageIndex = 0;
        this.loadVendors();
      });
  }
 
  clearFilters() {
 
    this.filterForm.reset({
      vendorCode: '',
      vendorName: '',
      mobileNo: '',
      city: ''
    });
 
    this.pageIndex = 0;
    this.loadVendors();
  }
 
  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadVendors();
  }
 
  async loadVendors() {
 
    this.isLoading = true;
 
    try {
 
      const filter = this.filterForm.value || {};
 
      const res: PagedResult<Vendor> = await firstValueFrom(
        this.service.getPagedVendors(
          filter.vendorCode,
          filter.vendorName,
          filter.mobileNo,
          filter.city,
          this.pageIndex + 1,
          this.pageSize
        )
      );
 
      this.vendors.set(res?.data ?? []);
      this.totalRecords = res.totalRecords;
 
      this.dataSource = new MatTableDataSource(res?.data ?? []);
 
      setTimeout(() => {
        this.dataSource.sort = this.sort;
      });
 
    } catch {
 
      this.snackBar.open('Vendor Loading Error', 'Close', {
        duration: 3000
      });
 
    } finally {
 
      this.isLoading = false;
    }
  }
 
  async delete(id: number, name: string) {
 
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { name },
    });
 
    const result = await firstValueFrom(dialogRef.afterClosed());
 
    if (!result) return;
 
    try {
 
      await firstValueFrom(this.service.delete(id));
 
      this.snackBar.open('Vendor deleted successfully', 'Close', {
        duration: 3000,
      });
 
      await this.loadVendors();
      this.clearFilters();
 
    } catch {
 
      this.snackBar.open('Vendor delete error', 'Close', {
        duration: 3000
      });
 
    }
  }
 
  openAddDialog() {
 
    const dialogRef = this.dialog.open(VendorFormComponent, {
      width: '900px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog',
      autoFocus: false,
      data: null,
    });
 
    dialogRef.afterClosed().subscribe((result) => {
 
      if (result) {
 
        this.snackBar.open('Vendor created successfully', 'Close', {
          duration: 3000
        });
 
        this.loadVendors();
      }
 
    });
  }
 
  openEditDialog(vendor: any) {
 
    const dialogRef = this.dialog.open(VendorFormComponent, {
      width: '900px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog',
      autoFocus: false,
      data: vendor,
    });
 
    dialogRef.afterClosed().subscribe((result) => {
 
      if (result === true) {
 
        this.snackBar.open('Vendor updated successfully', 'Close', {
          duration: 3000
        });
 
        this.loadVendors();
      }
 
    });
  }
}