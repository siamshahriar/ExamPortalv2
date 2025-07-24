import { LocationStrategy, CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../../../../services/question.service';
import Swal from 'sweetalert2';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css'
})
export class StartComponent implements OnDestroy {

  qid: any;
  questions: any;

  marksGot = 0;
  correctAnswers = 0;
  attempted = 0;
  isSubmitted = false;

  timer: any; // Timer variable to hold the interval
  timeRemaining: number = 0; // Time remaining in seconds
  timerInterval: any; // Interval reference
  initialTime: number = 0; // Initial time for progress calculation

  constructor(private locationSt: LocationStrategy, private _route: ActivatedRoute, private _question: QuestionService, private router: Router, private ngxLoader: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.preventBackButton();
    this.qid = this._route.snapshot.params['qid'];
    this.loadQuestions();
  }

  loadQuestions() {
    this.ngxLoader.start(); // Start loader
    this._question.getQuestionsOfQuizForTest(this.qid).subscribe(
      (data: any) => {
        this.questions = data;
        this.timeRemaining = this.questions.length * 2 * 60; // 2 minutes per question
        this.initialTime = this.timeRemaining;

        // Initialize givenAnswer property for each question
        this.questions.forEach((q: any) => {
          q['givenAnswer'] = '';
        });

        // Initialize attempted counter
        this.updateAttemptedCount();

        // Start the timer
        this.startTimer();

        this.ngxLoader.stop(); // Stop loader
      },
      (error: any) => {
        console.error("Error loading questions", error);
        this.ngxLoader.stop(); // Stop loader on error

        Swal.fire({
          icon: 'error',
          title: 'Error Loading Questions',
          text: 'Failed to load quiz questions. Please try again later.',
          confirmButtonText: 'Go Back',
          confirmButtonColor: '#dc3545'
        }).then(() => {
          // Navigate back to previous page
          this.router.navigate(['/user-dashboard']);
        });
      }
    );
  }

  preventBackButton() {
    history.pushState(null, '', location.href);
    this.locationSt.onPopState(() => {
      // If quiz is already submitted, allow free navigation
      if (this.isSubmitted) {
        this.router.navigate(['/user-dashboard/0']);
        return;
      }

      history.pushState(null, '', location.href);

      // Show warning when user tries to go back during active quiz
      Swal.fire({
        icon: 'warning',
        title: 'Are you sure?',
        text: 'You are in the middle of an exam. Going back will lose your progress!',
        showCancelButton: true,
        confirmButtonText: 'Yes, Exit Exam',
        cancelButtonText: 'Stay in Exam',
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#28a745',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          // Clear the timer
          this.clearTimer();

          // Navigate to dashboard or previous page
          this.router.navigate(['/user-dashboard']);
        }
      });
    });
  }

  selectAnswer(question: any, selectedOption: string) {
    question.givenAnswer = selectedOption;
    // Update the attempted count after setting the answer
    this.updateAttemptedCount();
  }

  updateAttemptedCount() {
    this.attempted = 0;
    if (this.questions) {
      this.questions.forEach((q: any) => {
        if (q.givenAnswer && q.givenAnswer.trim() !== '' && q.givenAnswer !== null && q.givenAnswer !== undefined) {
          this.attempted++;
        }
      });
    }
    console.log('Attempted count updated:', this.attempted); // Debug log
  }

  submitQuiz() {
    if (this.attempted === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Answers Selected',
        text: 'Please answer at least one question before submitting.',
        confirmButtonColor: '#667eea'
      });
      return;
    }

    // Show confirmation dialog
    Swal.fire({
      icon: 'question',
      title: 'Submit Quiz?',
      html: `
        <div style="text-align: left; margin: 20px 0;">
          <p><strong>Quiz Summary:</strong></p>
          <p>📝 Total Questions: ${this.questions.length}</p>
          <p>✅ Attempted: ${this.attempted}</p>
          <p>❌ Remaining: ${this.questions.length - this.attempted}</p>
        </div>
        <p style="margin-top: 20px;">Are you sure you want to submit your quiz?</p>
      `,
      showCancelButton: true,
      confirmButtonText: 'Yes, Submit!',
      cancelButtonText: 'Continue Quiz',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear the timer
        this.clearTimer();

        // Calculate results and show them in template
        this.calculateResults();
        this.isSubmitted = true;
      }
    });
  }

  calculateResults() {

    //call to server to check questions
    this.ngxLoader.start(); // Start loader for quiz evaluation
    this._question.evalQuiz(this.questions).subscribe(
      (data: any) => {
        this.correctAnswers = data.correctAnswers;
        this.marksGot = data.marksGot;
        this.attempted = data.attempted;
        this.isSubmitted = true;

        this.ngxLoader.stop(); // Stop loader

        Swal.fire({
          icon: 'success',
          title: 'Quiz Submitted Successfully!',
          text: `You answered ${this.correctAnswers} out of ${this.questions.length} questions correctly.`,
          confirmButtonText: 'View Results',
          confirmButtonColor: '#28a745'
        });
      },
      (error: any) => {
        console.error("Error evaluating quiz", error);
        this.ngxLoader.stop(); // Stop loader on error
        Swal.fire({
          icon: 'error',
          title: 'Error Submitting Quiz',
          text: 'There was an error while submitting your quiz. Please try again later.',
          confirmButtonText: 'Go Back',
          confirmButtonColor: '#dc3545'
        });
      }
    );


    // this.correctAnswers = 0;
    // this.marksGot = 0;

    // this.questions.forEach((question: any) => {
    //   if (question.givenAnswer === question.answer) {
    //     this.correctAnswers++;
    //     // Assuming each question has equal marks
    //     const marksPerQuestion = parseInt(question.quiz.maxMarks) / this.questions.length;
    //     this.marksGot += marksPerQuestion;
    //   }
    // });
  }

  goToDashboard() {
    this.router.navigate(['/user-dashboard/0']);
  }

  getAccuracy(): number {
    return this.attempted > 0 ? Math.round((this.correctAnswers / this.attempted) * 100) : 0;
  }

  getRoundedMarks(): number {
    return Math.round(this.marksGot);
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;

      if (this.timeRemaining <= 0) {
        this.timeUp();
      }
    }, 1000);
  }

  clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  timeUp() {
    this.clearTimer();

    Swal.fire({
      icon: 'warning',
      title: 'Time\'s Up!',
      text: 'Your quiz time has expired. The quiz will be submitted automatically.',
      confirmButtonText: 'View Results',
      confirmButtonColor: '#dc3545',
      allowOutsideClick: false
    }).then(() => {
      this.autoSubmitQuiz();
    });
  }

  autoSubmitQuiz() {
    this.calculateResults();
    this.isSubmitted = true;
  }

  getFormattedTime(): string {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  getProgressValue(): number {
    if (this.initialTime === 0) return 0;
    return ((this.initialTime - this.timeRemaining) / this.initialTime) * 100;
  }

  getTimeColor(): string {
    const percentage = (this.timeRemaining / this.initialTime) * 100;
    if (percentage <= 10) return '#dc3545'; // Red
    if (percentage <= 25) return '#ffc107'; // Yellow
    return '#28a745'; // Green
  }

  getRoundedProgress(): number {
    return Math.round(this.getProgressValue());
  }

  getTotalTimeMinutes(): number {
    return Math.floor(this.initialTime / 60);
  }

}
