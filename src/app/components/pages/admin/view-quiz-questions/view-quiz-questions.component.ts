import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { QuestionService } from '../../../../services/question.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-quiz-questions',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatToolbarModule,
    MatDividerModule,
    MatBadgeModule,
    MatProgressSpinnerModule,

  ],
  templateUrl: './view-quiz-questions.component.html',
  styleUrl: './view-quiz-questions.component.css'
})
export class ViewQuizQuestionsComponent {
  qId: any;
  qTitle: any;
  questions: any[] = [];
  loading: boolean = true;

  constructor(private _route: ActivatedRoute, private _question: QuestionService, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.qId = this._route.snapshot.params['qid'];
    this.qTitle = this._route.snapshot.params['title'];
    this._question.getQuestionsOfQuiz(this.qId).subscribe({
      next: (data: any) => {
        this.questions = data;
        this.loading = false;
        // console.log('Questions loaded:', this.questions);
      }
      ,
      error: (err) => {
        console.error('Error fetching questions:', err);
        this.loading = false;
      }
    });


    // console.log('Quiz ID:', this.qId);
    // console.log('Quiz Title:', this.qTitle);
  }

  getOptionLetter(index: number): string {
    return String.fromCharCode(65 + index); // A, B, C, D
  }

  isCorrectOption(question: any, optionValue: string): boolean {
    return question.answer === optionValue;
  }

  deleteQuestion(quesId: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this._question.deleteQuestion(quesId).subscribe({
          next: (data: any) => {
            // Remove the question from the local array
            this.questions = this.questions.filter(q => q.quesId !== quesId);

            Swal.fire({
              title: 'Deleted!',
              text: 'Question has been deleted successfully.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
          },
          error: (error) => {
            console.error('Error deleting question:', error);
            this._snackBar.open('Error deleting question. Please try again.', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }
}
