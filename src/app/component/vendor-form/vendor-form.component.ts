import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VendorService } from '../../services/vendor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent } from '@angular/material/dialog';
import { Vendor } from '../../models/vendor';
import { SelectOnFocusDirective } from "../../custom-directives/select-on-focus.directive";
 
@Component({
  selector: 'app-vendor-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    SelectOnFocusDirective,
    MatDialogContent
  ],
  templateUrl: './vendor-form.component.html',
  styleUrls: ['./vendor-form.component.css']
})
export class VendorFormComponent implements OnInit {
 
  form!: FormGroup;
  isEdit = false;
  id!: number;
  isSubmitted = false;
 
  constructor(
    private fb: FormBuilder,
    private service: VendorService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<VendorFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
 
  get f() {
    return this.form.controls;
  }
 
  ngOnInit(): void {
 
    this.form = this.fb.group({
      vendorCode: ['', [Validators.required, Validators.maxLength(20)]],
      vendorName: ['', [Validators.required, Validators.maxLength(100)]],
      contactPerson: ['', Validators.maxLength(100)],
      mobileNo: ['', Validators.maxLength(20)],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      address1: ['', Validators.maxLength(200)],
      address2: ['', Validators.maxLength(200)],
      city: ['', Validators.maxLength(100)],
      state: ['', Validators.maxLength(100)],
      country: ['', Validators.maxLength(100)],
      zipCode: ['', Validators.maxLength(20)],
      gstNo: ['', Validators.maxLength(50)],
      isActive: [true],
      isDeleted: [false]
    });
 
    if (this.data) {
      this.isEdit = true;
      this.id = this.data.id;
      this.form.patchValue(this.data);
    }
  }
 
  submit() {
 
    this.isSubmitted = true;
 
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
 
    const payload: Vendor = {
      ...this.form.value,
      isActive: this.form.value.isActive === true,
      isDeleted: this.form.value.isDeleted === true
    };
 
    if (this.isEdit) {
 
      this.service.Update(this.id, payload).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: () => {
          this.snackBar.open('Error updating vendor', 'Close', {
            duration: 3000
          });
        }
      });
 
    } else {
 
      this.service.create(payload).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: () => {
          this.snackBar.open('Error creating vendor', 'Close', {
            duration: 3000
          });
        }
      });
 
    }
  }
 
  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.key;
    if (!/^[0-9]$/.test(charCode)) {
      event.preventDefault();
    }
  }
 
}