import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
// import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    // MatSnackBarModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  public registrationData = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    enabled: true
  };

  constructor(private userSevice: UserService /* , private snackBar: MatSnackBar */) { }

  onRegister(form: NgForm): void {
    if (form.valid) {
      console.log('Form Submitted!', this.registrationData);

      //add user
      this.userSevice.addUser(this.registrationData).subscribe({
        next: (response) => {
          console.log('User registered successfully', response);
          // this.snackBar.open('User registered successfully!', 'Close', {
          //   duration: 5000,
          //   panelClass: ['success-snackbar']
          // });
          Swal.fire({
            title: 'Success!',
            text: 'User registered successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          form.resetForm();
        },
        error: (error) => {
          console.error('Error registering user', error);
          // this.snackBar.open('Error registering user: ' + error.message, 'Close', {
          //   duration: 5000,
          //   panelClass: ['error-snackbar']
          // });
          Swal.fire({
            title: 'Error!',
            text: 'Error registering user: ' + error.message,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }
  }

  onClear(form: NgForm): void {
    form.resetForm();
    this.registrationData = {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      enabled: true
    };
  }

}
