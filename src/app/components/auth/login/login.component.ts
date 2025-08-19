
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

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
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <!-- Logo and Title -->
        <div class="text-center mb-8">
          <mat-icon class="text-white text-6xl mb-4">account_balance</mat-icon>
          <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">Financial Management System</h1>
          <p class="text-blue-100">Sign in to your account</p>
        </div>

        <!-- Login Form -->
        <mat-card class="card p-6 sm:p-8">
          <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <div class="space-y-6">
              <div>
                <mat-form-field class="full-width">
                  <mat-label>Username or Email</mat-label>
                  <input 
                    matInput 
                    type="text" 
                    [(ngModel)]="loginData.username" 
                    name="username"
                    required
                    autocomplete="username"
                    [disabled]="loading">
                  <mat-icon matSuffix>person</mat-icon>
                </mat-form-field>
              </div>

              <div>
                <mat-form-field class="full-width">
                  <mat-label>Password</mat-label>
                  <input 
                    matInput 
                    [type]="hidePassword ? 'password' : 'text'" 
                    [(ngModel)]="loginData.password" 
                    name="password"
                    required
                    autocomplete="current-password"
                    [disabled]="loading">
                  <button 
                    mat-icon-button 
                    matSuffix 
                    type="button"
                    (click)="hidePassword = !hidePassword"
                    [disabled]="loading">
                    <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                  </button>
                </mat-form-field>
              </div>

              <div class="flex items-center justify-between text-sm">
                <label class="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    [(ngModel)]="loginData.rememberMe" 
                    name="rememberMe"
                    class="mr-2"
                    [disabled]="loading">
                  <span class="text-gray-600">Remember me</span>
                </label>
                <a href="#" class="text-blue-600 hover:text-blue-800">Forgot password?</a>
              </div>

              <button 
                mat-raised-button 
                color="primary" 
                type="submit" 
                class="full-width h-12 text-lg"
                [disabled]="!loginForm.valid || loading">
                <mat-spinner diameter="20" *ngIf="loading" class="mr-2"></mat-spinner>
                <span *ngIf="!loading">Sign In</span>
                <span *ngIf="loading">Signing in...</span>
              </button>
            </div>
          </form>

          <!-- Demo Credentials -->
          <div class="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 class="text-sm font-medium text-gray-800 mb-2">Demo Credentials:</h3>
            <div class="space-y-1 text-xs text-gray-600">
              <div class="flex justify-between">
                <span>Super Admin:</span>
                <span>admin@demo.com / admin123</span>
              </div>
              <div class="flex justify-between">
                <span>Society Admin:</span>
                <span>society@demo.com / society123</span>
              </div>
              <div class="flex justify-between">
                <span>Accountant:</span>
                <span>accountant@demo.com / acc123</span>
              </div>
              <div class="flex justify-between">
                <span>Member:</span>
                <span>member@demo.com / member123</span>
              </div>
            </div>
          </div>
        </mat-card>

        <!-- Footer -->
        <div class="text-center mt-6 text-blue-100 text-sm">
          <p>&copy; 2024 Financial Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginData = {
    username: '',
    password: '',
    rememberMe: false
  };
  
  hidePassword = true;
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Check if user is already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    if (!this.loginData.username || !this.loginData.password) {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
      return;
    }

    this.loading = true;

    // Simulate API call
    setTimeout(() => {
      const success = this.authService.login(this.loginData.username, this.loginData.password);
      
      if (success) {
        this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      } else {
        this.snackBar.open('Invalid credentials. Please try again.', 'Close', { duration: 3000 });
      }
      
      this.loading = false;
    }, 1500);
  }
}
