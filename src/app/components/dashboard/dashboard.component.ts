
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule, MatIconModule],
  template: `
    <div class="dashboard-container">
      <h1>Welcome to Financial Management System</h1>
      <p *ngIf="currentUser" class="welcome-message">
        Hello, {{currentUser.firstName}} {{currentUser.lastName}}! 
        You are logged in as {{getUserRoleDisplay()}}.
      </p>
      
      <mat-grid-list cols="{{getColumns()}}" rowHeight="200px" gutterSize="16px">
        <mat-grid-tile>
          <mat-card class="dashboard-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>account_balance</mat-icon>
              <mat-card-title>Accounts</mat-card-title>
              <mat-card-subtitle>Manage account ledgers</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>View and manage account balances, ledgers, and financial statements.</p>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
        
        <mat-grid-tile>
          <mat-card class="dashboard-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>receipt</mat-icon>
              <mat-card-title>Transactions</mat-card-title>
              <mat-card-subtitle>Record transactions</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>Handle deposits, payments, and loan transactions efficiently.</p>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
        
        <mat-grid-tile>
          <mat-card class="dashboard-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>assessment</mat-icon>
              <mat-card-title>Reports</mat-card-title>
              <mat-card-subtitle>Generate reports</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>Create comprehensive financial reports and statements.</p>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
        
        <mat-grid-tile *ngIf="!isMember()">
          <mat-card class="dashboard-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>settings</mat-icon>
              <mat-card-title>Master Data</mat-card-title>
              <mat-card-subtitle>Configure system</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>Manage member details, schemes, and system configuration.</p>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    h1 {
      text-align: center;
      margin-bottom: 16px;
      color: #333;
    }
    
    .welcome-message {
      text-align: center;
      margin-bottom: 32px;
      font-size: 16px;
      color: #666;
    }
    
    .dashboard-card {
      width: 100%;
      height: 100%;
      cursor: pointer;
      transition: transform 0.2s ease-in-out;
    }
    
    .dashboard-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    }
    
    mat-grid-list {
      margin-top: 24px;
    }
    
    mat-icon[mat-card-avatar] {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  getColumns(): number {
    return window.innerWidth > 768 ? 3 : 1;
  }

  isMember(): boolean {
    return this.currentUser?.role === 'MEMBER';
  }

  getUserRoleDisplay(): string {
    if (!this.currentUser) return '';
    return this.currentUser.role
      .replace('_', ' ')
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  }
}
