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
    <div class="dashboard-container p-6 mx-auto max-w-7xl">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div class="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <mat-card class="p-6 hover:shadow-lg transition-shadow">
          <mat-card-header class="pb-4">
            <mat-icon mat-card-avatar class="bg-blue-500 text-white">people</mat-icon>
            <mat-card-title class="text-lg font-semibold">Total Members</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="text-3xl font-bold text-blue-600">1,234</div>
            <div class="text-sm text-gray-500">Active Members</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="p-6 hover:shadow-lg transition-shadow">
          <mat-card-header class="pb-4">
            <mat-icon mat-card-avatar class="bg-green-500 text-white">account_balance</mat-icon>
            <mat-card-title class="text-lg font-semibold">Total Deposits</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="text-3xl font-bold text-green-600">₹45,67,890</div>
            <div class="text-sm text-gray-500">Current Balance</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="p-6 hover:shadow-lg transition-shadow">
          <mat-card-header class="pb-4">
            <mat-icon mat-card-avatar class="bg-red-500 text-white">credit_card</mat-icon>
            <mat-card-title class="text-lg font-semibold">Active Loans</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="text-3xl font-bold text-red-600">₹12,34,567</div>
            <div class="text-sm text-gray-500">Outstanding Amount</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="p-6 hover:shadow-lg transition-shadow">
          <mat-card-header class="pb-4">
            <mat-icon mat-card-avatar class="bg-purple-500 text-white">trending_up</mat-icon>
            <mat-card-title class="text-lg font-semibold">This Month</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="text-3xl font-bold text-purple-600">₹2,34,567</div>
            <div class="text-sm text-gray-500">New Deposits</div>
          </mat-card-content>
        </mat-card>

        <mat-card class="p-6 hover:shadow-lg transition-shadow">
          <mat-card-header class="pb-4">
            <mat-icon mat-card-avatar class="bg-orange-500 text-white">account_balance_wallet</mat-icon>
            <mat-card-title class="text-lg font-semibold">Active Loans</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="text-3xl font-bold text-orange-600">156</div>
            <div class="text-sm text-gray-500">Outstanding Loans</div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="mt-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div class="actions-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button mat-raised-button color="primary" routerLink="/master/member-details" class="h-16 flex items-center justify-center gap-2">
            <mat-icon>person_add</mat-icon>
            Add Member
          </button>
          <button mat-raised-button color="accent" routerLink="/transaction/deposit-receipt" class="h-16 flex items-center justify-center gap-2">
            <mat-icon>add</mat-icon>
            New Deposit
          </button>
          <button mat-raised-button color="warn" routerLink="/transaction/loan-taken" class="h-16 flex items-center justify-center gap-2">
            <mat-icon>money</mat-icon>
            Process Loan
          </button>
          <button mat-raised-button routerLink="/accounts/voucher" class="h-16 flex items-center justify-center gap-2">
            <mat-icon>receipt</mat-icon>
            Create Voucher
          </button>
        </div>
      </div>

      <div class="mt-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <mat-card class="p-6">
          <mat-card-content>
            <p class="text-gray-600">Recent activity will be displayed here.</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent {}