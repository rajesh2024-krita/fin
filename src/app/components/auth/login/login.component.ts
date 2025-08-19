
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <!-- Logo and Title -->
        <div class="text-center mb-8">
          <div class="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <mat-icon class="text-white text-3xl">account_balance</mat-icon>
          </div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Financial Management</h1>
          <p class="text-gray-600">Sign in to your account</p>
        </div>

        <!-- Login Card -->
        <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Email Field -->
            <div>
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Email Address</mat-label>
                <input matInput 
                       type="email" 
                       formControlName="email" 
                       placeholder="Enter your email"
                       [class.border-red-300]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                <mat-icon matSuffix class="text-gray-400">email</mat-icon>
                <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                  Email is required
                </mat-error>
                <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                  Please enter a valid email
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Password Field -->
            <div>
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Password</mat-label>
                <input matInput 
                       [type]="hidePassword ? 'password' : 'text'" 
                       formControlName="password" 
                       placeholder="Enter your password"
                       [class.border-red-300]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                <button type="button" 
                        matSuffix 
                        mat-icon-button 
                        (click)="hidePassword = !hidePassword"
                        class="text-gray-400 hover:text-gray-600">
                  <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                  Password is required
                </mat-error>
                <mat-error *ngIf="loginForm.get('password')?.hasError('minlength')">
                  Password must be at least 6 characters
                </mat-error>
              </mat-form-field>
            </div>

            <!-- Remember Me and Forgot Password -->
            <div class="flex items-center justify-between text-sm">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" 
                       formControlName="rememberMe" 
                       class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
                <span class="text-gray-600">Remember me</span>
              </label>
              <button type="button" 
                      class="text-blue-600 hover:text-blue-800 font-medium"
                      (click)="forgotPassword()">
                Forgot password?
              </button>
            </div>

            <!-- Login Button -->
            <button type="submit" 
                    [disabled]="loginForm.invalid || isLoading"
                    class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2">
              <mat-spinner *ngIf="isLoading" diameter="20" color="accent"></mat-spinner>
              <span *ngIf="!isLoading">Sign In</span>
              <span *ngIf="isLoading">Signing In...</span>
            </button>

            <!-- Demo Accounts -->
            <div class="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 class="text-sm font-medium text-gray-700 mb-3">Demo Accounts:</h3>
              <div class="space-y-2 text-xs text-gray-600">
                <div class="flex justify-between">
                  <span>Super Admin:</span>
                  <button type="button" 
                          (click)="fillDemoCredentials('admin@demo.com', 'password')"
                          class="text-blue-600 hover:text-blue-800">
                    admin@demo.com / password
                  </button>
                </div>
                <div class="flex justify-between">
                  <span>Society Admin:</span>
                  <button type="button" 
                          (click)="fillDemoCredentials('society@demo.com', 'password')"
                          class="text-blue-600 hover:text-blue-800">
                    society@demo.com / password
                  </button>
                </div>
                <div class="flex justify-between">
                  <span>Accountant:</span>
                  <button type="button" 
                          (click)="fillDemoCredentials('accountant@demo.com', 'password')"
                          class="text-blue-600 hover:text-blue-800">
                    accountant@demo.com / password
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Footer -->
        <div class="text-center mt-8 text-sm text-gray-600">
          <p>&copy; 2024 Financial Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
    
    .mat-mdc-form-field {
      width: 100%;
    }
    
    .mat-mdc-form-field-appearance-outline .mat-mdc-form-field-outline {
      border-radius: 8px;
    }
    
    .mat-mdc-form-field-appearance-outline .mat-mdc-form-field-outline-thick {
      border-width: 2px;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit() {
    // Check if user is already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password, rememberMe } = this.loginForm.value;
      
      // Simulate API call
      setTimeout(() => {
        try {
          const success = this.authService.login(email, password, rememberMe);
          if (success) {
            this.snackBar.open('Login successful! Welcome back.', 'Close', { 
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.router.navigate(['/dashboard']);
          } else {
            this.snackBar.open('Invalid email or password. Please try again.', 'Close', { 
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        } catch (error) {
          this.snackBar.open('Login failed. Please try again.', 'Close', { 
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        } finally {
          this.isLoading = false;
        }
      }, 1500);
    } else {
      this.markFormGroupTouched();
    }
  }

  fillDemoCredentials(email: string, password: string) {
    this.loginForm.patchValue({
      email: email,
      password: password
    });
  }

  forgotPassword() {
    this.snackBar.open('Password reset functionality will be implemented soon.', 'Close', { 
      duration: 3000 
    });
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}
