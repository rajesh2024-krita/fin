
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="unauthorized-container">
      <mat-card class="unauthorized-card">
        <mat-card-content>
          <div class="content">
            <mat-icon class="warning-icon">warning</mat-icon>
            <h1>Access Denied</h1>
            <p>You don't have permission to access this page.</p>
            <p>Please contact your administrator if you believe this is an error.</p>
            <button mat-raised-button color="primary" (click)="goToDashboard()">
              Go to Dashboard
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .unauthorized-card {
      max-width: 400px;
      text-align: center;
    }

    .content {
      padding: 20px;
    }

    .warning-icon {
      font-size: 64px;
      color: #ff9800;
      margin-bottom: 16px;
    }

    h1 {
      color: #333;
      margin-bottom: 16px;
    }

    p {
      color: #666;
      margin-bottom: 16px;
    }
  `]
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div class="max-w-md mx-auto text-center">
        <div class="bg-white rounded-lg shadow-lg p-8">
          <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <mat-icon class="text-red-600 text-4xl">block</mat-icon>
          </div>
          
          <h1 class="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p class="text-gray-600 mb-6">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
          
          <div class="space-y-3">
            <button mat-raised-button color="primary" (click)="goBack()" class="w-full">
              Go Back
            </button>
            <button mat-button (click)="goToDashboard()" class="w-full">
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  goBack() {
    window.history.back();
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
