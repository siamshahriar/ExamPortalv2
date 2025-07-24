import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../../services/category.service';
import Swal from 'sweetalert2';
import { QuizService } from '../../../../services/quiz.service';
@Component({
  selector: 'app-add-quiz',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './add-quiz.component.html',
  styleUrl: './add-quiz.component.css'
})
export class AddQuizComponent {
  form!: FormGroup;

  categories: any;

  constructor(private fb: FormBuilder, private _cat: CategoryService, private _snackBar: MatSnackBar, private _quiz: QuizService) {

  }

  ngOnInit() {
    // Initialize form or fetch categories if needed
    this._cat.categories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        Swal.fire('Error', 'Failed to load categories', 'error');
      }
    });

    this.form = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      maxMarks: ['', [Validators.required, Validators.min(1)]],
      numberOfQuestions: ['', [Validators.required, Validators.min(1)]],
      active: [true],
      category: [null, [Validators.required]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      // Check for empty strings with trim()
      const title = this.form.value.title?.trim();
      const description = this.form.value.description?.trim();
      const maxMarks = this.form.value.maxMarks?.trim();
      const numberOfQuestions = this.form.value.numberOfQuestions?.trim();

      if (!title || !description || !maxMarks || !numberOfQuestions) {
        this._snackBar.open('Please fill in all required fields properly. Spaces only are not allowed.', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
        return;
      }

      if (isNaN(Number(maxMarks)) || Number(maxMarks) < 1) {
        this._snackBar.open('Maximum marks must be a valid number greater than 0', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
        return;
      }

      if (isNaN(Number(numberOfQuestions)) || Number(numberOfQuestions) < 1) {
        this._snackBar.open('Number of questions must be a valid number greater than 0', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
        return;
      }

      if (!this.form.value.category) {
        this._snackBar.open('Please select a category', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
        return;
      }

      const formData = {
        title: title,
        description: description,
        maxMarks: maxMarks,
        numberOfQuestions: numberOfQuestions,
        active: this.form.value.active,
        category: {
          cid: this.form.value.category
        }
      };

      //call server

      this._quiz.addQuiz(formData).subscribe({
        next: (res) => {
          Swal.fire('Success', 'Quiz added successfully!', 'success');
          this._snackBar.open('Quiz added successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          console.log('Form Data:', formData);
          this.form.reset({
            title: '',
            description: '',
            maxMarks: '',
            numberOfQuestions: '',
            active: true,
            category: null
          });
        },
        error: (err) => {
          console.error('Error adding quiz:', err);
          this._snackBar.open('Failed to add quiz', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });




      // Handle form submission here
    } else {
      this._snackBar.open('Please fix the form errors before submitting', 'Close', {
        duration: 4000,
        panelClass: ['error-snackbar']
      });
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
