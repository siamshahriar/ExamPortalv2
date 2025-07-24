import { MatSnackBar } from '@angular/material/snack-bar';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Object to hold the form data
  public loginData = {
    username: '',
    password: ''
  };

  constructor(private snack: MatSnackBar, private login: LoginService, private router: Router) { }

  onLogin(form: NgForm): void {
    if (form.valid) {
      console.log('Login successful!', this.loginData);
      // Add your authentication logic here
      // For example, call an authentication service
      if (this.loginData.username.trim() === "" || this.loginData.username === null) {
        this.snack.open('Username is required', 'Close', {
          duration: 3000,
        });
        return;
      }
      if (this.loginData.password.trim() === "" || this.loginData.password === null) {
        this.snack.open('Password is required', 'Close', {
          duration: 3000,
        });
        return;
      }

      //request to server to generate token
      this.login.generateToken(this.loginData).subscribe({
        next: (response: any) => {
          console.log('Token generated successfully', response);
          // Swal.fire({
          //   title: 'Success!',
          //   text: 'Login successful!',
          //   icon: 'success',
          //   confirmButtonText: 'OK'
          // });

          //login
          this.login.loginUser(response.token);

          this.login.getCurrentUser().subscribe({
            next: (user: any) => {
              this.login.setUser(user);
              console.log('User details fetched successfully', user);
              //redirect admin to admin dashboard
              //redirect normal user to normal dashboard
              if (this.login.getUserRole() === 'ADMIN') {
                setTimeout(() => {
                  this.router.navigate(['/admin']);
                }, 0);
                this.login.loginUser(response.token);
              } else if (this.login.getUserRole() === 'NORMAL') {
                setTimeout(() => {
                  this.router.navigate(['/user-dashboard/0']);
                }, 0);
                this.login.loginUser(response.token);
              } else {
                this.login.logout();
                setTimeout(() => {
                  this.router.navigate(['/login']);
                }, 0);
              }

            },
            error: (error) => {
              console.error('Error fetching user details', error);
              this.snack.open('Error fetching user details', 'Close', {
                duration: 3000,
                panelClass: ['error-snackbar']
              });
            }
          });
        },
        error: (error) => {
          console.error('Error generating token', error);
          this.snack.open('Invalid credentials, please try again', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      })


    }
  }
}
