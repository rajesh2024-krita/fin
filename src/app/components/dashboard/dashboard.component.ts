
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
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p class="text-gray-600 dark:text-gray-400">Welcome to your Financial Management System</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Members Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Members</p>
              <p class="text-3xl font-bold text-blue-600 dark:text-blue-400">1,234</p>
              <p class="text-xs text-gray-500 dark:text-gray-500">+12 this month</p>
            </div>
            <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <mat-icon class="text-blue-600 dark:text-blue-400">people</mat-icon>
            </div>
          </div>
        </div>

        <!-- Total Deposits Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Deposits</p>
              <p class="text-3xl font-bold text-green-600 dark:text-green-400">₹25.6L</p>
              <p class="text-xs text-gray-500 dark:text-gray-500">+5.2% from last month</p>
            </div>
            <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <mat-icon class="text-green-600 dark:text-green-400">account_balance_wallet</mat-icon>
            </div>
          </div>
        </div>

        <!-- Active Loans Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Loans</p>
              <p class="text-3xl font-bold text-orange-600 dark:text-orange-400">89</p>
              <p class="text-xs text-gray-500 dark:text-gray-500">₹12.3L outstanding</p>
            </div>
            <div class="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
              <mat-icon class="text-orange-600 dark:text-orange-400">trending_up</mat-icon>
            </div>
          </div>
        </div>

        <!-- Monthly Transactions Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
              <p class="text-3xl font-bold text-purple-600 dark:text-purple-400">567</p>
              <p class="text-xs text-gray-500 dark:text-gray-500">Transactions</p>
            </div>
            <div class="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <mat-icon class="text-purple-600 dark:text-purple-400">receipt</mat-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions & Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Quick Actions -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">Commonly used features</p>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-2 gap-4">
              <button 
                routerLink="/master/member-details"
                class="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200 group"
              >
                <mat-icon class="text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform">person_add</mat-icon>
                <span class="text-sm font-medium text-blue-900 dark:text-blue-300">Add Member</span>
              </button>
              
              <button 
                routerLink="/transaction/deposit-receipt"
                class="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200 group"
              >
                <mat-icon class="text-green-600 dark:text-green-400 mb-2 group-hover:scale-110 transition-transform">account_balance</mat-icon>
                <span class="text-sm font-medium text-green-900 dark:text-green-300">New Deposit</span>
              </button>
              
              <button 
                routerLink="/transaction/loan-taken"
                class="flex flex-col items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors duration-200 group"
              >
                <mat-icon class="text-orange-600 dark:text-orange-400 mb-2 group-hover:scale-110 transition-transform">trending_up</mat-icon>
                <span class="text-sm font-medium text-orange-900 dark:text-orange-300">Process Loan</span>
              </button>
              
              <button 
                routerLink="/reports/employees"
                class="flex flex-col items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200 group"
              >
                <mat-icon class="text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform">assessment</mat-icon>
                <span class="text-sm font-medium text-purple-900 dark:text-purple-300">View Reports</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">Latest system activities</p>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <mat-icon class="text-green-600 dark:text-green-400 text-sm">person_add</mat-icon>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">New member registered</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">John Doe joined the society</p>
                  <p class="text-xs text-gray-400 dark:text-gray-500">2 hours ago</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-3">
                <div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <mat-icon class="text-blue-600 dark:text-blue-400 text-sm">account_balance</mat-icon>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Deposit processed</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">₹50,000 deposit received</p>
                  <p class="text-xs text-gray-400 dark:text-gray-500">4 hours ago</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-3">
                <div class="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <mat-icon class="text-orange-600 dark:text-orange-400 text-sm">trending_up</mat-icon>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Loan approved</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">₹2,00,000 loan sanctioned</p>
                  <p class="text-xs text-gray-400 dark:text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart Section -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Financial Overview</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400">Monthly deposits and withdrawals</p>
        </div>
        <div class="p-6">
          <div class="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="text-center">
              <mat-icon class="text-6xl text-gray-400 dark:text-gray-500 mb-4">insert_chart</mat-icon>
              <p class="text-gray-500 dark:text-gray-400">Chart component will be integrated here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class DashboardComponent {}
