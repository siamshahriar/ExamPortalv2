import { Component, ChangeDetectorRef, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { Subscription, interval } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit, OnDestroy {
  private routerSubscription!: Subscription;
  private intervalSubscription!: Subscription;

  // Cache the login state
  isLoggedIn = false;
  currentUser: any = null;

  constructor(
    public loginService: LoginService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Initialize state
    this.updateAuthState();

    // Subscribe to router events to trigger change detection when navigation occurs
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateAuthState();
      });

    // Check auth state periodically to catch changes
    this.intervalSubscription = interval(100).subscribe(() => {
      this.updateAuthState();
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  private updateAuthState() {
    const newLoginState = this.loginService.isLoggedIn();
    const newUser = this.loginService.getUser();

    if (this.isLoggedIn !== newLoginState || this.currentUser !== newUser) {
      this.isLoggedIn = newLoginState;
      this.currentUser = newUser;
      this.cdr.detectChanges();
    }
  }

  // Get the profile route based on user role
  getProfileRoute(): string {
    const userRole = this.loginService.getUserRole();
    if (userRole === 'ADMIN') {
      return '/admin';
    } else if (userRole === 'NORMAL') {
      return '/user-dashboard/0';
    }
    return '/'; // fallback to home
  }

  logout() {
    this.loginService.logout();
    this.updateAuthState();
    // Use setTimeout to defer navigation to next tick
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 0);
  }

}
