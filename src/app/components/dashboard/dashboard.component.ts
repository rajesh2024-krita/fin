
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatIconModule, 
    MatButtonModule, 
    MatProgressBarModule,
    MatChipsModule
  ],
  template: `
    <div class="min-h-screen bg-gray-50 p-4">
      <div class="max-w-7xl mx-auto">
        <!-- Welcome Header -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-6 text-white">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 class="text-3xl font-bold mb-2">Welcome back, {{ currentUser?.firstName }}!</h1>
              <p class="text-blue-100">{{ getCurrentDate() }} • {{ getUserRoleDisplayName() }}</p>
              <p class="text-blue-100 text-sm">{{ currentUser?.societyName }}</p>
            </div>
            <div class="mt-4 md:mt-0">
              <div class="bg-white/20 rounded-lg p-4 text-center">
                <div class="text-2xl font-bold">{{ getCurrentFinancialYear() }}</div>
                <div class="text-sm text-blue-100">Financial Year</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Key Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div class="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
            <div class="flex items-center">
              <div class="p-3 bg-green-100 rounded-lg">
                <mat-icon class="text-green-600">account_balance</mat-icon>
              </div>
              <div class="ml-4">
                <div class="text-2xl font-bold text-gray-800">₹ 12.5L</div>
                <div class="text-sm text-gray-600">Total Deposits</div>
                <div class="text-xs text-green-600">+12% from last month</div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div class="flex items-center">
              <div class="p-3 bg-blue-100 rounded-lg">
                <mat-icon class="text-blue-600">people</mat-icon>
              </div>
              <div class="ml-4">
                <div class="text-2xl font-bold text-gray-800">1,248</div>
                <div class="text-sm text-gray-600">Total Members</div>
                <div class="text-xs text-blue-600">+25 new this month</div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
            <div class="flex items-center">
              <div class="p-3 bg-orange-100 rounded-lg">
                <mat-icon class="text-orange-600">trending_up</mat-icon>
              </div>
              <div class="ml-4">
                <div class="text-2xl font-bold text-gray-800">₹ 8.2L</div>
                <div class="text-sm text-gray-600">Active Loans</div>
                <div class="text-xs text-orange-600">15 loans pending</div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
            <div class="flex items-center">
              <div class="p-3 bg-purple-100 rounded-lg">
                <mat-icon class="text-purple-600">account_balance_wallet</mat-icon>
              </div>
              <div class="ml-4">
                <div class="text-2xl font-bold text-gray-800">₹ 2.8L</div>
                <div class="text-sm text-gray-600">Monthly Interest</div>
                <div class="text-xs text-purple-600">+8% growth</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts and Recent Activities -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <!-- Financial Overview Chart -->
          <div class="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-4">Financial Overview</h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>Deposits Collection</span>
                  <span>75%</span>
                </div>
                <mat-progress-bar mode="determinate" value="75" color="primary" class="h-2"></mat-progress-bar>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>Loan Recovery</span>
                  <span>60%</span>
                </div>
                <mat-progress-bar mode="determinate" value="60" color="accent" class="h-2"></mat-progress-bar>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span>Interest Payments</span>
                  <span="90%</span>
                </div>
                <mat-progress-bar mode="determinate" value="90" color="warn" class="h-2"></mat-progress-bar>
              </div>
            </div>
            
            <div class="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 class="font-medium text-gray-700 mb-2">Monthly Targets vs Achievement</h4>
              <div class="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div class="text-2xl font-bold text-green-600">₹ 5.2L</div>
                  <div class="text-xs text-gray-600">Target</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-blue-600">₹ 4.8L</div>
                  <div class="text-xs text-gray-600">Achieved</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-orange-600">92%</div>
                  <div class="text-xs text-gray-600">Performance</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activities -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h3>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="p-2 bg-green-100 rounded-lg">
                  <mat-icon class="text-green-600 text-sm">add_circle</mat-icon>
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium text-gray-800">New Member Added</div>
                  <div class="text-xs text-gray-600">Rajesh Kumar - ID: 1249</div>
                  <div class="text-xs text-gray-500">2 hours ago</div>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <div class="p-2 bg-blue-100 rounded-lg">
                  <mat-icon class="text-blue-600 text-sm">account_balance</mat-icon>
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium text-gray-800">Deposit Received</div>
                  <div class="text-xs text-gray-600">₹ 50,000 from Priya Sharma</div>
                  <div class="text-xs text-gray-500">4 hours ago</div>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <div class="p-2 bg-orange-100 rounded-lg">
                  <mat-icon class="text-orange-600 text-sm">receipt</mat-icon>
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium text-gray-800">Loan Approved</div>
                  <div class="text-xs text-gray-600">₹ 2,00,000 for Amit Patel</div>
                  <div class="text-xs text-gray-500">1 day ago</div>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <div class="p-2 bg-purple-100 rounded-lg">
                  <mat-icon class="text-purple-600 text-sm">payment</mat-icon>
                </div>
                <div class="flex-1">
                  <div class="text-sm font-medium text-gray-800">Interest Paid</div>
                  <div class="text-xs text-gray-600">Monthly interest distributed</div>
                  <div class="text-xs text-gray-500">2 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <button mat-raised-button 
                    (click)="navigateTo('/master/member-details')"
                    class="p-4 text-center bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors">
              <mat-icon class="text-blue-600 mb-2">person_add</mat-icon>
              <div class="text-sm font-medium text-blue-800">Add Member</div>
            </button>

            <button mat-raised-button 
                    (click)="navigateTo('/transaction/deposit-receipt')"
                    class="p-4 text-center bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors">
              <mat-icon class="text-green-600 mb-2">account_balance</mat-icon>
              <div class="text-sm font-medium text-green-800">New Deposit</div>
            </button>

            <button mat-raised-button 
                    (click)="navigateTo('/transaction/loan-taken')"
                    class="p-4 text-center bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-colors">
              <mat-icon class="text-orange-600 mb-2">trending_up</mat-icon>
              <div class="text-sm font-medium text-orange-800">Process Loan</div>
            </button>

            <button mat-raised-button 
                    (click)="navigateTo('/accounts/voucher')"
                    class="p-4 text-center bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors">
              <mat-icon class="text-purple-600 mb-2">receipt</mat-icon>
              <div class="text-sm font-medium text-purple-800">Create Voucher</div>
            </button>

            <button mat-raised-button 
                    (click)="navigateTo('/reports/employees')"
                    class="p-4 text-center bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors">
              <mat-icon class="text-indigo-600 mb-2">assessment</mat-icon>
              <div class="text-sm font-medium text-indigo-800">View Reports</div>
            </button>

            <button mat-raised-button 
                    (click)="navigateTo('/backup')"
                    class="p-4 text-center bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors">
              <mat-icon class="text-red-600 mb-2">backup</mat-icon>
              <div class="text-sm font-medium text-red-800">Backup Data</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  getCurrentFinancialYear(): string {
    const today = new Date();
    const currentYear = today.getFullYear();
    const isAfterMarch = today.getMonth() >= 3; // April starts financial year
    
    if (isAfterMarch) {
      return `${currentYear}-${currentYear + 1}`;
    } else {
      return `${currentYear - 1}-${currentYear}`;
    }
  }

  getUserRoleDisplayName(): string {
    if (!this.currentUser) return '';
    return this.currentUser.role
      .replace('_', ' ')
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
