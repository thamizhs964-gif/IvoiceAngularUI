import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent
} from '@angular/material/dialog';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    MatDialogContent],
  templateUrl: './Category-form.component.html',
  styleUrls: ['./Category-form.component.css']
})

export class CategoryFormComponent implements OnInit {

  form!: FormGroup;
  isEdit = false;
  id!: number;
  isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private service: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CategoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {

    this.form = this.fb.group({

      code: ['', [Validators.required, Validators.maxLength(5)]],
      name: ['', [Validators.required, Validators.maxLength(25)]],
      description: ['', [Validators.maxLength(100)]],
      isactive: [true]

    });

    if (this.data) {

      console.log("Dialog Data", this.data);
      this.isEdit = true;
      this.id = this.data.id
      console.log("Category Id:", this.id);

      this.form.patchValue({

        code: this.data.code,
        name: this.data.name,
        description: this.data.description,
        isactive: this.data.isactive

      });

      console.log(this.form.value);
    }
  }

  submit() {

    this.isSubmitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const payload: Category = {
      ...this.form.value
    };

    if (this.isEdit) {

      this.service.Update(this.id, payload).subscribe({

        next: () => {
          this.dialogRef.close(true);
        },

        error: () => {
          this.snackBar.open('Error updating Category', 'Close', {
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
          this.snackBar.open('Error creating Category', 'Close', {
            duration: 3000
          });
        }

      });

    }

  }



}