import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UsersService } from '../../services/users.service';
import { Users } from '../../models/users';
import { PagedResult } from '../../models/paged-result';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';
import { UsersFormComponent } from '../users-form/users-form.component';

@Component({
  selector: 'app-users-list',
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
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent implements OnInit {

  users = signal<Users[]>([]);
  dataSource!: MatTableDataSource<Users>;

  displayedColumns: string[] = [
    'userName',
    'email',
    'password',
    'firstName',
    'middleName',
    'lastName',
    'displayName',
    'phoneNumber',
    'alternatePhone',
    'addressLine1',
    'addressLine2',
    'city',
    'state',
    'zipCode',
    'country',
    'dateOfBirth',
    'actions'
  ];

  isLoading = false;

  filterForm!: FormGroup;

  pageSize = 10;
  pageIndex = 0;
  totalRecords = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: UsersService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.initFilterForm();
    this.loadUsers();
  }

  initFilterForm() {
    this.filterForm = this.fb.group({
      userName: [''],
      displayName: [''],
      city: [''],
      dateOfBirth: ['']
    });

    this.filterForm.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.pageIndex = 0;
        this.loadUsers();
      });
  }

  clearFilters() {
    this.filterForm.reset({
      userName: '',
      displayName: '',
      city: '',
      dateOfBirth: ''
    });

    this.pageIndex = 0;
    this.loadUsers();
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  async loadUsers() {

    this.isLoading = true;

    try {

      const filter = this.filterForm.value || {};

      const res: PagedResult<Users> = await firstValueFrom(
        this.service.getPagedUsers(
          filter.userName,
          filter.displayName,
          filter.dateOfBirth,
          filter.city,
          this.pageIndex + 1,
          this.pageSize
        )
      );

      this.users.set(res?.data ?? []);
      this.totalRecords = res.totalRecords;

      this.dataSource = new MatTableDataSource(res?.data ?? []);

      setTimeout(() => {
        this.dataSource.sort = this.sort;
      });

    } catch {

      this.snackBar.open(
        'User Loading Error',
        'Close',
        {
          duration: 3000
        }
      );

    } finally {

      this.isLoading = false;

    }
  }

  async delete(id: number, name: string) {

    const dialogRef = this.dialog.open(
      ConfirmDialogComponent,
      {
        width: '350px',
        data: { name },
      }
    );

    const result = await firstValueFrom(
      dialogRef.afterClosed()
    );

    if (!result) return;

    try {

      await firstValueFrom(
        this.service.Delete(id)
      );

      this.snackBar.open(
        'User deleted successfully',
        'Close',
        {
          duration: 3000,
        }
      );

      await this.loadUsers();
      this.clearFilters();

    } catch {

      this.snackBar.open(
        'User delete error',
        'Close',
        {
          duration: 3000,
        }
      );

    }
  }

  openAddDialog() {

    const dialogRef = this.dialog.open(
      UsersFormComponent,
      {
        width: '900px',
        maxHeight: '90vh',
        panelClass: 'custom-dialog',
        autoFocus: false,
        data: null,
      }
    );

    dialogRef.afterClosed().subscribe((result) => {

      if (result) {

        this.snackBar.open(
          'User created successfully',
          'Close',
          {
            duration: 3000
          }
        );

        this.loadUsers();
      }
    });
  }

  openEditDialog(user: any) {

    const dialogRef = this.dialog.open(
      UsersFormComponent,
      {
        width: '900px',
        maxHeight: '90vh',
        panelClass: 'custom-dialog',
        autoFocus: false,
        data: user,
      }
    );

    dialogRef.afterClosed().subscribe((result) => {

      if (result === true) {

        this.snackBar.open(
          'User updated successfully',
          'Close',
          {
            duration: 3000
          }
        );

        this.loadUsers();
      }
    });
  }
}