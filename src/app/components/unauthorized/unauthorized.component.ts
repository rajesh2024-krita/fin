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
        <mat-card-header>
          <mat-icon mat-card-avatar color="warn">block</mat-icon>
          <mat-card-title>Access Denied</mat-card-title>
          <mat-card-subtitle>You don't have permission to access this resource</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>Sorry, you don't have the necessary permissions to view this page. Please contact your administrator if you believe this is an error.</p>
        </mat-card-content>
        <mat-card-actions align="center">
          <button mat-raised-button color="primary" (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Go Back
          </button>
          <button mat-raised-button (click)="goToDashboard()">
            <mat-icon>home</mat-icon>
            Dashboard
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      padding: 24px;
    }

    .unauthorized-card {
      max-width: 500px;
      text-align: center;
    }

    mat-icon[mat-card-avatar] {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    mat-card-actions button {
      margin: 0 8px;
    }
  `]
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