import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from '../../../../services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-categories',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './add-categories.component.html',
  styleUrl: './add-categories.component.css'
})
export class AddCategoriesComponent {
  form!: FormGroup;
  constructor(private fb: FormBuilder, private snack: MatSnackBar, private _category: CategoryService) { }

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.form.value.title.trim() === '' || this.form.value.description.trim() === '') {

        this.snack.open('Title and Description cannot be empty', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        return;
      }
      else {
        console.log('Form Data:', this.form.value);
        this._category.addCategory(this.form.value).subscribe({
          next: (res) => {
            Swal
            this.form.reset();
          },
          error: (err) => {
            console.error('Error adding category:', err);
            this.snack.open('Failed to add category', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
      // Handle form submission here
    } else {
      console.log('Form is invalid');
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }
}
