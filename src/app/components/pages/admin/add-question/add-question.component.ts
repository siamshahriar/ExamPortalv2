import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { QuestionService } from '../../../../services/question.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-question',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatToolbarModule,
    MatDividerModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './add-question.component.html',
  styleUrl: './add-question.component.css'
})
export class AddQuestionComponent {

  qId: any;
  qTitle: any;
  question: any = {
    quiz: {

    },
    content: '',
    image: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    answer: '',
  }

  constructor(private _route: ActivatedRoute, private _question: QuestionService, private _snackBar: MatSnackBar, private _router: Router) { }

  ngOnInit() {
    this.qId = this._route.snapshot.params['qid'];
    this.qTitle = this._route.snapshot.params['title'];
    this.question.quiz["qId"] = this.qId;
  }

  getFormData() {
    const formData = {
      content: this.question.content?.trim(),
      image: this.question.image?.trim(),
      option1: this.question.option1?.trim(),
      option2: this.question.option2?.trim(),
      option3: this.question.option3?.trim(),
      option4: this.question.option4?.trim(),
      answer: this.question.answer?.trim(),
      quiz: {
        qId: parseInt(this.qId)
      }
    };
    console.log('Form Data:', formData);
    return formData;
  }

  onSubmit() {
    if (this.isFormValid()) {
      const data = this.getFormData();

      this._question.addQuestion(data).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Success!',
            text: 'Question added successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            // Navigate back to the previous page
            this._router.navigate(['/admin/view-questions', this.qId, this.qTitle]);
          });
        },
        error: (error) => {
          console.error('Error adding question:', error);
          this._snackBar.open('Failed to add question. Please try again.', 'Close', {
            duration: 4000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this._snackBar.open('Please fill in all required fields properly. Spaces only are not allowed.', 'Close', {
        duration: 4000,
        panelClass: ['error-snackbar']
      });
    }
  }

  isFormValid(): boolean {
    // Trim whitespace and check if fields are truly empty
    const content = this.question.content?.trim();
    const option1 = this.question.option1?.trim();
    const option2 = this.question.option2?.trim();
    const option3 = this.question.option3?.trim();
    const option4 = this.question.option4?.trim();
    const answer = this.question.answer?.trim();

    return !!(
      content &&
      option1 &&
      option2 &&
      option3 &&
      option4 &&
      answer
    );
  }

  getAvailableOptions(): string[] {
    const options = [];
    if (this.question.option1) options.push(this.question.option1);
    if (this.question.option2) options.push(this.question.option2);
    if (this.question.option3) options.push(this.question.option3);
    if (this.question.option4) options.push(this.question.option4);
    return options;
  }

}
