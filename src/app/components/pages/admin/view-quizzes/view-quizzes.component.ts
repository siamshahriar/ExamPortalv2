import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { QuizService } from '../../../../services/quiz.service';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-quizzes',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './view-quizzes.component.html',
  styleUrl: './view-quizzes.component.css'
})
export class ViewQuizzesComponent {
  quizzes: any;
  constructor(private _quiz: QuizService) { }

  ngOnInit() {
    this._quiz.quizzes().subscribe({
      next: (data: any) => {
        this.quizzes = data;
      },
      error: (error) => {
        console.error('Error fetching quizzes:', error);
        Swal.fire('Error', 'Failed to load quizzes', 'error');
      }
    });
  }


  //delete quiz
  deleteQuiz(qId: number) {


    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this._quiz.deleteQuiz(qId).subscribe({
          next: (data) => {
            Swal.fire('Success', 'Quiz deleted successfully', 'success');
            this.quizzes = this.quizzes.filter((q: any) => q.qId !== qId);
          },
          error: (error) => {
            console.error('Error deleting quiz:', error);
            Swal.fire('Error', 'Failed to delete quiz', 'error');
          }
        });
      }
    });



  }
}
