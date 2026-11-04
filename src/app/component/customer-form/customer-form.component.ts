import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent} from '@angular/material/dialog';
import {Customer } from '../../models/customer';
import { SelectOnFocusDirective } from "../../custom-directives/select-on-focus.directive";

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatSelectModule,
    MatIconModule,
    SelectOnFocusDirective,
    MatDialogContent
  ],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {

  form!: FormGroup;
  isEdit = false;
  id!: number;
  isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private service: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CustomerFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {

    this.form = this.fb.group({

      customerCode: ['',[ Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      customerName: ['',[ Validators.required,  Validators.minLength(1),  Validators.maxLength(100)]],
      contactPerson: ['',[ Validators.maxLength(100)]],
      mobileNo: ['',[ Validators.maxLength(20)]],
      email: ['',[ Validators.email, Validators.maxLength(100)]],
      address1: ['',[ Validators.maxLength(200)]],
      address2: ['',[ Validators.maxLength(200)]],
      city: ['',[ Validators.maxLength(100) ]],
      state: ['',[ Validators.maxLength(100)]],
      country: ['',[ Validators.maxLength(100)]],
      zipCode: ['',[ Validators.maxLength(20)]],
      gstNo: ['',[ Validators.maxLength(50)]],
      isActive: [true],
      isDeleted: [false],
      createdBy: ['Admin']
    });
    
    if (this.data) {
      this.isEdit = true;
      this.id = this.data.id;
      this.form.patchValue(this.data);
    }
  }

  submit() {

    this.isSubmitted = true;
  console.log("Form Valid:", this.form.valid);
  console.log("Form Value:", this.form.value);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;

    const payload: Customer = {
  ...formValue,
  isActive: formValue.isActive === true,
  isDeleted: formValue.isDeleted === true
};
  console.log("Customer Id:", this.id);
  console.log("Payload:", payload);

    if (this.isEdit) {

      this.service.Update(this.id, payload).subscribe({

        next: () => {
          this.dialogRef.close(true);
        },

        error: () => {
          this.snackBar.open(
            'Error updating customer',
            'Close',
            {
              duration: 3000
            }
          );
        }

      });

    } else {

      this.service.create(payload).subscribe({

        next: () => {
          this.dialogRef.close(true);
        },

        error: () => {
          this.snackBar.open(
            'Error creating customer',
            'Close',
            {
              duration: 3000
            }
          );
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