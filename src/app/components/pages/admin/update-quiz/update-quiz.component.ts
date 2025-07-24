import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from '../../../../services/quiz.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../../services/category.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-quiz',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatIconModule,
    MatSnackBarModule],
  templateUrl: './update-quiz.component.html',
  styleUrl: './update-quiz.component.css'
})
export class UpdateQuizComponent {
  qId = 0;
  quiz: any;

  form!: FormGroup;

  categories: any;

  constructor(private _route: ActivatedRoute, private _quiz: QuizService, private fb: FormBuilder, private _cat: CategoryService, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.qId = +this._route.snapshot.params['qid']; // Convert to number

    // Initialize form first
    this.form = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      maxMarks: ['', [Validators.required, Validators.min(1)]],
      numberOfQuestions: ['', [Validators.required, Validators.min(1)]],
      active: [true],
      category: [null, [Validators.required]]
    });

    // Fetch categories
    this._cat.categories().subscribe({
      next: (data) => {
        this.categories = data;
        // console.log('Categories loaded:', this.categories);
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
        Swal.fire('Error', 'Failed to load categories', 'error');
      }
    });

    // Fetch quiz data and populate form
    this._quiz.getQuiz(this.qId).subscribe({
      next: (data) => {
        this.quiz = data;
        // console.log('Quiz data loaded:', this.quiz);
        // console.log('Quiz category:', this.quiz.category);

        // Populate the form with existing quiz data
        this.form.patchValue({
          title: this.quiz.title,
          description: this.quiz.description,
          maxMarks: this.quiz.maxMarks.toString(),
          numberOfQuestions: this.quiz.numberOfQuestions.toString(),
          active: this.quiz.active,
          category: this.quiz.category?.cid
        });

        // console.log('Form value after patch:', this.form.value);
      },
      error: (err) => {
        console.error('Error fetching quiz:', err);
        Swal.fire('Error', 'Failed to load quiz data', 'error');
      }
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

      // Find the selected category object
      const selectedCategory = this.categories.find((cat: any) => cat.cid === this.form.value.category);

      const formData = {
        qId: this.qId,
        title: title,
        description: description,
        maxMarks: maxMarks,
        numberOfQuestions: numberOfQuestions,
        active: this.form.value.active,
        category: selectedCategory || null
      };

      // console.log('Form Data:', formData);

      // call server

      this._quiz.updateQuiz(formData).subscribe({
        next: (res) => {
          Swal.fire('Success', 'Quiz updated successfully!', 'success');
          this._snackBar.open('Quiz updated successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          // console.log('Form Data:', formData);

        },
        error: (err) => {
          console.error('Error updating quiz:', err);
          this._snackBar.open('Failed to update quiz', 'Close', {
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
