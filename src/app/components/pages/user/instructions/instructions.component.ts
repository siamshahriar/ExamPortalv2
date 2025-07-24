import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { QuizService } from '../../../../services/quiz.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-instructions',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatListModule,
    RouterModule
  ],
  templateUrl: './instructions.component.html',
  styleUrl: './instructions.component.css'
})
export class InstructionsComponent implements OnInit {
  qid: any;
  quiz: any

  constructor(private _route: ActivatedRoute, private _quiz: QuizService, private router: Router) { }

  ngOnInit(): void {
    // Logic to fetch quiz instructions based on qid
    // This could involve a service call to get the instructions for the quiz
    this._route.params.subscribe((params) => {
      this.qid = params['qid'];
      console.log("Quiz ID from route:", this.qid);

      this._quiz.getQuiz(this.qid).subscribe(
        (data: any) => {
          console.log("Quiz loaded successfully", data);
          this.quiz = data;
        },
        (error: any) => {
          console.error("Error loading quiz", error);
        }
      );
    });
  }

  startQuiz() {
    // Show confirmation dialog before starting quiz
    Swal.fire({
      title: 'Start Quiz?',
      text: 'Once you start, the timer will begin immediately and you cannot pause or resume the quiz!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Start Quiz!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, navigate to quiz
        this.router.navigate(['/start/', this.qid]);

        // Optional: Show a success message
        Swal.fire({
          title: 'Quiz Started!',
          text: 'Good luck with your quiz!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }
}
