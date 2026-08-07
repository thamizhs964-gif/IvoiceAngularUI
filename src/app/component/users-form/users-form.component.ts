import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA,MatDialogRef,MatDialogContent} from '@angular/material/dialog';
import { Users } from '../../models/users';
import { SelectOnFocusDirective } from "../../custom-directives/select-on-focus.directive";

@Component({
  selector: 'app-users-form',
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
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.css']
})
export class UsersFormComponent implements OnInit
{
  form!: FormGroup;
  isEdit = false;
  id!: number;
  isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private service: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UsersFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {

    this.form = this.fb.group({

      userName: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(255)
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(500)
        ]
      ],

      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100)
        ]
      ],

      middleName: [
        '',
        [
          Validators.maxLength(100)
        ]
      ],

      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100)
        ]
      ],

      displayName: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(200)
        ]
      ],

      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.maxLength(25)
        ]
      ],

      alternatePhone: [
        '',
        [
          Validators.maxLength(25)
        ]
      ],

      addressLine1: [
        '',
        [
          Validators.required,
          Validators.maxLength(255)
        ]
      ],

      addressLine2: [
        '',
        [
          Validators.maxLength(255)
        ]
      ],

      city: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],

      state: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],

      zipCode: [
        '',
        [
          Validators.required,
          Validators.maxLength(20)
        ]
      ],

      country: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],

      dateOfBirth: ['', Validators.required],

      isActive: [true]

    });

    if (this.data) {
      this.isEdit = true;
      this.id = this.data.id;
      
      this.form.patchValue({
    ...this.data,
    dateOfBirth: this.data.dateOfBirth
      ? this.data.dateOfBirth.split('T')[0]
      : ''
  });
    }
  }

  submit() {

    this.isSubmitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: Users = {
      ...this.form.value
    };

    if (this.isEdit) {

      this.service.Update(this.id, payload).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: () => {
          this.snackBar.open(
            'Error updating user',
            'Close',
            {
              duration: 3000
            }
          );
        },
      });

    } else {

      this.service.Create(payload).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: () => {
          this.snackBar.open(
            'Error creating user',
            'Close',
            {
              duration: 3000
            }
          );
        },
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