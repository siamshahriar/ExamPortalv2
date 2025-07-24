import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { QuizService } from '../../../../services/quiz.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-load-quiz',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatDividerModule,
    MatTooltipModule,
    RouterModule
  ],
  templateUrl: './load-quiz.component.html',
  styleUrl: './load-quiz.component.css'
})
export class LoadQuizComponent implements OnInit {

  catId: any;
  quizzes: any;

  constructor(private _route: ActivatedRoute, private _quiz: QuizService) { }

  ngOnInit(): void {
    // this.catId = this._route.snapshot.params['catId'];
    // console.log(this.catId);

    this._route.params.subscribe((params) => {
      this.catId = params['catId'];
      console.log("Category ID from route:", this.catId);
      if (this.catId === "0") {
        // Load all quizzes
        console.log("Loading all quizzes");

        this._quiz.getActiveQuizzes().subscribe(
          (data: any) => {
            console.log("Quizzes loaded successfully", data);
            this.quizzes = data;
          },
          (error: any) => {
            console.error("Error loading quizzes", error);
          }
        );
      }
      else {
        // Load quizzes for the specific category
        console.log(`Loading quizzes for category ID: ${this.catId}`);
        this._quiz.getActiveQuizzesOfCategory(this.catId).subscribe(
          (data: any) => {
            console.log("Quizzes for category loaded successfully", data);
            this.quizzes = data;
          },
          (error: any) => {
            console.error("Error loading quizzes for category", error);
          }
        );
      }
    });


  }

}
