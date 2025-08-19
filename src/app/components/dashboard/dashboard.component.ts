
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>people</mat-icon>
            <mat-card-title>Total Members</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">1,234</div>
            <div class="stat-label">Active Members</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>account_balance</mat-icon>
            <mat-card-title>Total Deposits</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">₹45,67,890</div>
            <div class="stat-label">Current Balance</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>credit_card</mat-icon>
            <mat-card-title>Active Loans</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">₹12,34,567</div>
            <div class="stat-label">Outstanding Amount</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>trending_up</mat-icon>
            <mat-card-title>Monthly Interest</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">₹2,34,567</div>
            <div class="stat-label">This Month</div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <button mat-raised-button color="primary" routerLink="/master/member-details">
            <mat-icon>person_add</mat-icon>
            Add Member
          </button>
          <button mat-raised-button color="accent" routerLink="/transaction/deposit-receipt">
            <mat-icon>add</mat-icon>
            New Deposit
          </button>
          <button mat-raised-button color="warn" routerLink="/transaction/loan-taken">
            <mat-icon>money</mat-icon>
            Process Loan
          </button>
          <button mat-raised-button routerLink="/accounts/voucher">
            <mat-icon>receipt</mat-icon>
            Create Voucher
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }

    .stat-card {
      text-align: center;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: #1976d2;
      margin: 10px 0;
    }

    .stat-label {
      color: #666;
      font-size: 0.9rem;
    }

    .quick-actions {
      margin-top: 40px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 20px;
    }

    .actions-grid button {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
  `]
})
export class DashboardComponent {}
