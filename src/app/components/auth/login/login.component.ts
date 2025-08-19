import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Financial Management System</mat-card-title>
          <mat-card-subtitle>Please sign in to continue</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="login()" #loginForm="ngForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Username</mat-label>
              <input matInput [(ngModel)]="username" name="username" required>
              <mat-icon matSuffix>person</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" [(ngModel)]="password" name="password" required>
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
            </mat-form-field>

            <div *ngIf="errorMessage" class="error-message">
              {{errorMessage}}
            </div>

            <button mat-raised-button color="primary" type="submit" class="full-width login-button" [disabled]="!loginForm.valid || isLoading">
              {{isLoading ? 'Signing in...' : 'Sign In'}}
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 20px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .login-button {
      height: 48px;
      font-size: 16px;
      margin-top: 16px;
    }

    .error-message {
      color: #f44336;
      font-size: 14px;
      margin-bottom: 16px;
      text-align: center;
    }

    mat-card-header {
      text-align: center;
      margin-bottom: 24px;
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  hidePassword = true;
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter both username and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.username, this.password).subscribe(
      success => {
        this.isLoading = false;
        if (success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Invalid username or password';
        }
      },
      error => {
        this.isLoading = false;
        this.errorMessage = 'Login failed. Please try again.';
      }
    );
  }
}