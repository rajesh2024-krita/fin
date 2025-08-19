import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

interface Permission {
  module: string;
  menuName: string;
  category: string;
  permissions: {
    read: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
}

@Component({
  selector: 'app-authority',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="min-h-screen bg-gray-50 p-4">
      <div class="max-w-7xl mx-auto">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h1 class="text-3xl font-bold text-gray-800 mb-6">Authority & Permissions Management</h1>

          <form [formGroup]="authorityForm" class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <mat-form-field appearance="outline">
                <mat-label>Select Role</mat-label>
                <mat-select formControlName="selectedRole">
                  <mat-option value="SUPER_ADMIN">Super Admin</mat-option>
                  <mat-option value="SOCIETY_ADMIN">Society Admin</mat-option>
                  <mat-option value="ACCOUNTANT">Accountant</mat-option>
                  <mat-option value="MEMBER">Member</mat-option>
                </mat-select>
              </mat-form-field>

              <div class="flex items-center space-x-4">
                <button mat-raised-button color="primary" class="bg-blue-600 hover:bg-blue-700">
                  Load Permissions
                </button>
                <button mat-raised-button color="accent" class="bg-green-600 hover:bg-green-700">
                  Save Changes
                </button>
              </div>
            </div>
          </form>

          <mat-tab-group class="mb-6">
            <mat-tab *ngFor="let category of categories" [label]="category">
              <div class="p-4">
                <div class="grid grid-cols-1 gap-4">
                  <div *ngFor="let permission of getPermissionsByCategory(category)"
                       class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                    <div class="flex items-center justify-between mb-3">
                      <h3 class="text-lg font-semibold text-gray-700">{{ permission.menuName }}</h3>
                      <span class="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{{ permission.module }}</span>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div class="flex items-center space-x-2">
                        <mat-checkbox
                          [(ngModel)]="permission.permissions.read"
                          color="primary">
                        </mat-checkbox>
                        <span class="text-sm text-gray-600">Read</span>
                        <mat-icon class="text-green-500 text-sm">visibility</mat-icon>
                      </div>

                      <div class="flex items-center space-x-2">
                        <mat-checkbox
                          [(ngModel)]="permission.permissions.create"
                          color="primary">
                        </mat-checkbox>
                        <span class="text-sm text-gray-600">Create</span>
                        <mat-icon class="text-blue-500 text-sm">add_circle</mat-icon>
                      </div>

                      <div class="flex items-center space-x-2">
                        <mat-checkbox
                          [(ngModel)]="permission.permissions.update"
                          color="primary">
                        </mat-checkbox>
                        <span class="text-sm text-gray-600">Update</span>
                        <mat-icon class="text-orange-500 text-sm">edit</mat-icon>
                      </div>

                      <div class="flex items-center space-x-2">
                        <mat-checkbox
                          [(ngModel)]="permission.permissions.delete"
                          color="primary">
                        </mat-checkbox>
                        <span class="text-sm text-gray-600">Delete</span>
                        <mat-icon class="text-red-500 text-sm">delete</mat-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </mat-tab>
          </mat-tab-group>

          <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
            <h3 class="text-xl font-semibold mb-4">Permission Summary</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold">{{ getTotalPermissions() }}</div>
                <div class="text-sm">Total Modules</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold">{{ getActivePermissions('read') }}</div>
                <div class="text-sm">Read Access</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold">{{ getActivePermissions('create') }}</div>
                <div class="text-sm">Create Access</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold">{{ getActivePermissions('delete') }}</div>
                <div class="text-sm">Delete Access</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    ::ng-deep .mat-mdc-tab-body-wrapper {
      flex-grow: 1;
    }
    ::ng-deep .mat-mdc-tab-group {
      height: auto;
    }
  `]
})
export class AuthorityComponent implements OnInit {
  authorityForm: FormGroup;
  categories = ['Master', 'Transaction', 'Accounts', 'Reports', 'File', 'Security'];

  permissions: Permission[] = [
    // Master Menu
    { module: 'member-details', menuName: 'Member Details', category: 'Master', permissions: { read: true, create: true, update: true, delete: false } },
    { module: 'table', menuName: 'Table Management', category: 'Master', permissions: { read: true, create: true, update: true, delete: false } },
    { module: 'deposit-scheme', menuName: 'Deposit Scheme', category: 'Master', permissions: { read: true, create: true, update: true, delete: false } },
    { module: 'interest-master', menuName: 'Interest Master', category: 'Master', permissions: { read: true, create: true, update: true, delete: false } },

    // Transaction Menu
    { module: 'deposit-receipt', menuName: 'Deposit Receipt', category: 'Transaction', permissions: { read: true, create: true, update: true, delete: false } },
    { module: 'deposit-payment', menuName: 'Deposit Payment', category: 'Transaction', permissions: { read: true, create: true, update: true, delete: false } },
    { module: 'deposit-slip', menuName: 'Deposit Slip', category: 'Transaction', permissions: { read: true, create: true, update: true, delete: false } },
    { module: 'deposit-renew', menuName: 'Deposit Renew', category: 'Transaction', permissions: { read: true, create: true, update: true, delete: false } },
    { module: 'account-closure', menuName: 'Account Closure', category: 'Transaction', permissions: { read: true, create: true, update: true, delete: false } },
    { module: 'loan-taken', menuName: 'Loan Taken', category: 'Transaction', permissions: { read: true, create: true, update: true, delete: false } },
    { module: 'demand-process', menuName: 'Demand Process', category: 'Transaction', permissions: { read: true, create: true, update: true, delete: false } },

    // Accounts Menu
    { module: 'cash-book', menuName: 'Cash Book', category: 'Accounts', permissions: { read: true, create: true, update: true, delete: false } },
    { module: 'day-book', menuName: 'Day Book', category: 'Accounts', permissions: { read: true, create: true, update: true, delete: false } },
    { module: 'ledger', menuName: 'Ledger', category: 'Accounts', permissions: { read: true, create: true, update: true, delete: false } },
    { module: 'group', menuName: 'Group', category: 'Accounts', permissions: { read: true, create: true, update: true, delete: false } },
    { module: 'trial-balance', menuName: 'Trial Balance', category: 'Accounts', permissions: { read: true, create: false, update: false, delete: false } },
    { module: 'balance-sheet', menuName: 'Balance Sheet', category: 'Accounts', permissions: { read: true, create: false, update: false, delete: false } },
    { module: 'profit-loss', menuName: 'Profit & Loss', category: 'Accounts', permissions: { read: true, create: false, update: false, delete: false } },
    { module: 'receipt-payment', menuName: 'Receipt & Payment', category: 'Accounts', permissions: { read: true, create: true, update: true, delete: false } },
    { module: 'voucher', menuName: 'Voucher', category: 'Accounts', permissions: { read: true, create: true, update: true, delete: false } },
    { module: 'loan-receipt', menuName: 'Loan Receipt', category: 'Accounts', permissions: { read: true, create: true, update: true, delete: false } },

    // Reports Menu
    { module: 'employees-report', menuName: 'Employee Reports', category: 'Reports', permissions: { read: true, create: false, update: false, delete: false } },
    { module: 'voucher-report', menuName: 'Voucher Reports', category: 'Reports', permissions: { read: true, create: false, update: false, delete: false } },
    { module: 'opening-balance-report', menuName: 'Opening Balance Report', category: 'Reports', permissions: { read: true, create: false, update: false, delete: false } },
    { module: 'closing-balance-report', menuName: 'Closing Balance Report', category: 'Reports', permissions: { read: true, create: false, update: false, delete: false } },
    { module: 'loan-report', menuName: 'Loan Reports', category: 'Reports', permissions: { read: true, create: false, update: false, delete: false } },

    // File Menu
    { module: 'society', menuName: 'Society Management', category: 'File', permissions: { read: true, create: false, update: true, delete: false } },
    { module: 'create-new-year', menuName: 'Create New Year', category: 'File', permissions: { read: true, create: true, update: false, delete: false } },
    { module: 'edit-opening-balance', menuName: 'Edit Opening Balance', category: 'File', permissions: { read: true, create: false, update: true, delete: false } },

    // Security Menu
    { module: 'authority', menuName: 'Authority Management', category: 'Security', permissions: { read: true, create: true, update: true, delete: false } },
    { module: 'my-rights', menuName: 'My Rights', category: 'Security', permissions: { read: true, create: false, update: false, delete: false } },
    { module: 'new-user', menuName: 'New User', category: 'Security', permissions: { read: true, create: true, update: true, delete: false } },
    { module: 'retrieve-password', menuName: 'Retrieve Password', category: 'Security', permissions: { read: true, create: false, update: true, delete: false } },
    { module: 'change-password', menuName: 'Change Password', category: 'Security', permissions: { read: true, create: false, update: true, delete: false } },
    { module: 'admin-handover', menuName: 'Admin Handover', category: 'Security', permissions: { read: true, create: true, update: true, delete: false } }
  ];

  constructor(private fb: FormBuilder) {
    this.authorityForm = this.fb.group({
      selectedRole: ['SUPER_ADMIN']
    });
  }

  ngOnInit() {}

  getPermissionsByCategory(category: string): Permission[] {
    return this.permissions.filter(p => p.category === category);
  }

  getTotalPermissions(): number {
    return this.permissions.length;
  }

  getActivePermissions(type: 'read' | 'create' | 'update' | 'delete'): number {
    return this.permissions.filter(p => p.permissions[type]).length;
  }
}