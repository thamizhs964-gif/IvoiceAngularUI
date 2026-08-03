import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { PagedResult } from '../../models/paged-result';

@Component({
  selector: 'app-customer-list',
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
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
})
export class CustomerListComponent implements OnInit {

  customer = signal<Customer[]>([]);
  dataSource!: MatTableDataSource<Customer>;

  displayedColumns: string[] = [
    'customerCode',
    'customerName',
    'contactPerson',
    'mobileNo',
    'email',
    'address1',
    'address2',
    'city',
    'state',
    'country',
    'zipCode',
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
    private service: CustomerService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.initFilterForm();
    this.loadcustomer();
  }

  initFilterForm() {
    this.filterForm = this.fb.group({
      customerCode: [''],
      customerName: [''],
      city: [''],
    });

    this.filterForm.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.pageIndex = 0;
        this.loadcustomer();
      });
  }

  clearFilters() {
    this.filterForm.reset({
      customerCode: '',
      customerName: '',
      city: '',
    });

    this.pageIndex = 0;
    this.loadcustomer();
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadcustomer();
  }

    async loadcustomer() {
    this.isLoading = true;

    try {
      const filter = this.filterForm.value || {};

      const res: PagedResult<Customer> = await firstValueFrom(
        this.service.getPagedCustomer(
          filter.customerCode,
          filter.customerName,
          filter.city,
          this.pageIndex + 1,
          this.pageSize
        )
      );

      this.customer.set(res?.data ?? []);
      this.totalRecords = res.totalRecords;
      this.dataSource = new MatTableDataSource(res?.data ?? []);

      setTimeout(() => {
        this.dataSource.sort = this.sort;
      });

    } catch {
      this.snackBar.open('Customer Loading Error', 'Close', {
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

      this.snackBar.open('Customer deleted successfully', 'Close', {
        duration: 3000,
      });

      await this.loadcustomer();
      this.clearFilters();

    } catch {

      this.snackBar.open('Customer delete error', 'Close', {
        duration: 3000,
      });

    }
  }

  openAddDialog() {

    const dialogRef = this.dialog.open(CustomerFormComponent, {
      width: '900px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog',
      autoFocus: false,
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {

      if (result) {

        this.snackBar.open('Customer created successfully', 'Close', {
          duration: 3000
        });

        this.loadcustomer();
      }

    });

  }

  openEditDialog(customer: any) {

    const dialogRef = this.dialog.open(CustomerFormComponent, {
      width: '900px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog',
      autoFocus: false,
      data: customer,
    });

    dialogRef.afterClosed().subscribe((result) => {

      if (result === true) {

        this.snackBar.open('Customer updated successfully', 'Close', {
          duration: 3000
        });

        this.loadcustomer();

      }

    });

  }

}