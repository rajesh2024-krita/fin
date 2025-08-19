import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterLink, Router } from '@angular/router';
import { AuthService, User, UserRole } from '../../services/auth.service';

interface DashboardCard {
  title: string;
  value: string;
  icon: string;
  color: string;
  route?: string;
}

interface QuickAction {
  title: string;
  icon: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    RouterLink
  ],
  template: `
    <div class="container-responsive">
      <!-- Welcome Section -->
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {{ currentUser?.firstName }}!
        </h1>
        <p class="text-gray-600">
          {{ currentUser?.societyName ? currentUser?.societyName + ' - ' : '' }}
          {{ getUserRoleDisplayName() }}
        </p>
      </div>

      <!-- Statistics Cards -->
      <div class="grid-responsive mb-6 sm:mb-8">
        <mat-card
          *ngFor="let card of dashboardCards"
          class="card p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
          [routerLink]="card.route">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 mb-1">{{ card.title }}</p>
              <p class="text-xl sm:text-2xl font-bold" [ngClass]="card.color">{{ card.value }}</p>
            </div>
            <mat-icon [ngClass]="card.color + ' text-3xl sm:text-4xl'">{{ card.icon }}</mat-icon>
          </div>
        </mat-card>
      </div>

      <!-- Quick Actions -->
      <div class="mb-6 sm:mb-8">
        <h2 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <button
            *ngFor="let action of quickActions"
            mat-raised-button
            [routerLink]="action.route"
            class="flex flex-col items-center p-3 sm:p-4 h-20 sm:h-24"
            [ngClass]="action.color">
            <mat-icon class="mb-1 sm:mb-2">{{ action.icon }}</mat-icon>
            <span class="text-xs sm:text-sm text-center">{{ action.title }}</span>
          </button>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <mat-card class="card p-4 sm:p-6">
          <h3 class="text-lg font-semibold mb-4">Recent Transactions</h3>
          <div class="space-y-3">
            <div *ngFor="let transaction of recentTransactions"
                 class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <div>
                <p class="font-medium text-sm sm:text-base">{{ transaction.description }}</p>
                <p class="text-xs sm:text-sm text-gray-600">{{ transaction.date }}</p>
              </div>
              <span class="font-semibold"
                    [ngClass]="transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'">
                {{ transaction.type === 'credit' ? '+' : '-' }}₹{{ transaction.amount }}
              </span>
            </div>
          </div>
          <button mat-button color="primary" class="mt-4 w-full">View All Transactions</button>
        </mat-card>

        <mat-card class="card p-4 sm:p-6">
          <h3 class="text-lg font-semibold mb-4">Pending Tasks</h3>
          <div class="space-y-3">
            <div *ngFor="let task of pendingTasks"
                 class="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div class="flex items-center">
                <mat-icon class="text-orange-500 mr-2 text-sm">{{ task.icon }}</mat-icon>
                <div>
                  <p class="font-medium text-sm sm:text-base">{{ task.title }}</p>
                  <p class="text-xs sm:text-sm text-gray-600">{{ task.description }}</p>
                </div>
              </div>
              <span class="status-badge status-pending text-xs">{{ task.priority }}</span>
            </div>
          </div>
          <button mat-button color="primary" class="mt-4 w-full">View All Tasks</button>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .container-responsive {
      padding: 1rem;
    }
    .grid-responsive {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }
    .card {
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
    }
    .btn-primary { background-color: #3b82f6; color: white; }
    .btn-success { background-color: #10b981; color: white; }
    .btn-secondary { background-color: #64748b; color: white; }
    .btn-danger { background-color: #ef4444; color: white; }
    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 0.375rem;
      font-weight: 600;
    }
    .status-pending {
      background-color: #fbbfa0;
      color: #d9770e;
    }
    /* Responsive adjustments */
    @media (min-width: 640px) {
      .container-responsive {
        padding: 2rem;
      }
      .grid-responsive {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
      }
      .card {
        padding: 1.5rem;
      }
    }
    @media (min-width: 768px) {
      .grid-responsive {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      }
    }
    @media (min-width: 1024px) {
      .grid-responsive {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }
    }
     @media (min-width: 1280px) {
      .grid-responsive {
        grid-template-columns: repeat(6, minmax(0, 1fr));
      }
    }

    /* Specific styles for the dashboard cards */
    .card.p-4 { padding: 1rem; }
    .card.p-6 { padding: 1.5rem; }
    @media (min-width: 640px) {
      .card.p-4 { padding: 1.5rem; }
      .card.p-6 { padding: 2rem; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;

  dashboardCards: DashboardCard[] = [
    {
      title: 'Total Members',
      value: '1,234',
      icon: 'people',
      color: 'text-blue-600',
      route: '/master/member-details'
    },
    {
      title: 'Active Loans',
      value: '₹45,67,890',
      icon: 'account_balance_wallet',
      color: 'text-green-600',
      route: '/transaction/loan-taken'
    },
    {
      title: 'Total Deposits',
      value: '₹1,23,45,678',
      icon: 'savings',
      color: 'text-purple-600',
      route: '/transaction/deposit-receipt'
    },
    {
      title: 'Pending Approvals',
      value: '23',
      icon: 'pending_actions',
      color: 'text-orange-600',
      route: '/admin'
    }
  ];

  quickActions: QuickAction[] = [
    { title: 'New Member', icon: 'person_add', route: '/master/member-details', color: 'btn-primary' },
    { title: 'Loan Entry', icon: 'account_balance', route: '/transaction/loan-taken', color: 'btn-success' },
    { title: 'Deposit', icon: 'savings', route: '/transaction/deposit-receipt', color: 'btn-secondary' },
    { title: 'Payment', icon: 'payment', route: '/transaction/deposit-payment', color: 'btn-danger' },
    { title: 'Reports', icon: 'assessment', route: '/reports/employees', color: 'btn-primary' },
    { title: 'Backup', icon: 'backup', route: '/backup', color: 'btn-secondary' }
  ];

  recentTransactions = [
    { description: 'Loan Payment - John Doe', date: 'Today, 2:30 PM', amount: '5,000', type: 'credit' },
    { description: 'New Deposit - Jane Smith', date: 'Today, 1:15 PM', amount: '25,000', type: 'credit' },
    { description: 'Loan Disbursement - Mike Wilson', date: 'Yesterday, 4:45 PM', amount: '50,000', type: 'debit' },
    { description: 'Interest Payment', date: 'Yesterday, 10:30 AM', amount: '2,500', type: 'credit' }
  ];

  pendingTasks = [
    { title: 'Loan Approval', description: 'Review loan application #1234', icon: 'task_alt', priority: 'High' },
    { title: 'Account Verification', description: 'Verify new member documents', icon: 'verified_user', priority: 'Medium' },
    { title: 'Monthly Report', description: 'Generate monthly financial report', icon: 'summarize', priority: 'Low' },
    { title: 'System Backup', description: 'Scheduled database backup', icon: 'backup', priority: 'High' }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Fix for login issue: Check if user is logged in, if not, redirect to login
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  getUserRoleDisplayName(): string {
    if (!this.currentUser) return '';
    // Explicitly cast to UserRole if possible or handle potential undefined roles
    const role = this.currentUser.role as UserRole;
    return role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }
}