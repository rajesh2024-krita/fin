
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { UserFormDialogComponent } from './user-form-dialog.component';
import { AuthService, User, UserRole } from '../../services/auth.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
    MatChipsModule,
    FormsModule
  ],
  template: `
    <div class="min-h-screen bg-gray-50 p-4">
      <div class="max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-800">User Management</h1>
              <p class="text-gray-600 mt-1">Manage system users and their permissions</p>
            </div>
            <button mat-raised-button color="primary" (click)="openUserDialog()" 
                    class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
              <mat-icon class="mr-2">person_add</mat-icon>
              Add New User
            </button>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div class="flex items-center">
              <mat-icon class="text-3xl mr-3">people</mat-icon>
              <div>
                <div class="text-2xl font-bold">{{ getTotalUsers() }}</div>
                <div class="text-blue-100">Total Users</div>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div class="flex items-center">
              <mat-icon class="text-3xl mr-3">admin_panel_settings</mat-icon>
              <div>
                <div class="text-2xl font-bold">{{ getAdminCount() }}</div>
                <div class="text-green-100">Admins</div>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div class="flex items-center">
              <mat-icon class="text-3xl mr-3">account_balance</mat-icon>
              <div>
                <div class="text-2xl font-bold">{{ getAccountantCount() }}</div>
                <div class="text-purple-100">Accountants</div>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <div class="flex items-center">
              <mat-icon class="text-3xl mr-3">group</mat-icon>
              <div>
                <div class="text-2xl font-bold">{{ getMemberCount() }}</div>
                <div class="text-orange-100">Members</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters and Search -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <mat-form-field appearance="outline">
              <mat-label>Search Users</mat-label>
              <input matInput [(ngModel)]="searchTerm" placeholder="Search by name, email or ID">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>Filter by Role</mat-label>
              <mat-select [(ngModel)]="selectedRole">
                <mat-option value="">All Roles</mat-option>
                <mat-option value="SUPER_ADMIN">Super Admin</mat-option>
                <mat-option value="SOCIETY_ADMIN">Society Admin</mat-option>
                <mat-option value="ACCOUNTANT">Accountant</mat-option>
                <mat-option value="MEMBER">Member</mat-option>
              </mat-select>
            </mat-form-field>
            
            <mat-form-field appearance="outline">
              <mat-label>Filter by Status</mat-label>
              <mat-select [(ngModel)]="selectedStatus">
                <mat-option value="">All Status</mat-option>
                <mat-option value="active">Active</mat-option>
                <mat-option value="inactive">Inactive</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>

        <!-- Users Table -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="getFilteredUsers()" class="w-full">
              <!-- Avatar and Name Column -->
              <ng-container matColumnDef="user">
                <th mat-header-cell *matHeaderCellDef class="font-semibold text-gray-700">User</th>
                <td mat-cell *matCellDef="let user" class="py-4">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {{ getInitials(user) }}
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">{{ user.firstName }} {{ user.lastName }}</div>
                      <div class="text-sm text-gray-500">{{ user.email }}</div>
                      <div class="text-xs text-gray-400">ID: {{ user.id }}</div>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Role Column -->
              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef class="font-semibold text-gray-700">Role</th>
                <td mat-cell *matCellDef="let user" class="py-4">
                  <mat-chip [class]="getRoleChipClass(user.role)">
                    {{ getRoleDisplayName(user.role) }}
                  </mat-chip>
                </td>
              </ng-container>

              <!-- Society Column -->
              <ng-container matColumnDef="society">
                <th mat-header-cell *matHeaderCellDef class="font-semibold text-gray-700">Society</th>
                <td mat-cell *matCellDef="let user" class="py-4">
                  <div class="text-sm text-gray-900">{{ user.societyName || 'N/A' }}</div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef class="font-semibold text-gray-700">Status</th>
                <td mat-cell *matCellDef="let user" class="py-4">
                  <span [class]="getStatusClass(user.isActive)">
                    <mat-icon class="text-xs mr-1">{{ user.isActive ? 'check_circle' : 'cancel' }}</mat-icon>
                    {{ user.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
              </ng-container>

              <!-- Last Login Column -->
              <ng-container matColumnDef="lastLogin">
                <th mat-header-cell *matHeaderCellDef class="font-semibold text-gray-700">Last Login</th>
                <td mat-cell *matCellDef="let user" class="py-4">
                  <div class="text-sm text-gray-600">{{ formatDate(user.lastLogin) }}</div>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef class="font-semibold text-gray-700">Actions</th>
                <td mat-cell *matCellDef="let user" class="py-4">
                  <div class="flex space-x-2">
                    <button mat-icon-button (click)="editUser(user)" class="text-blue-600 hover:bg-blue-50">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button (click)="toggleUserStatus(user)" [class]="user.isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'">
                      <mat-icon>{{ user.isActive ? 'block' : 'check_circle' }}</mat-icon>
                    </button>
                    <button mat-icon-button (click)="resetPassword(user)" class="text-orange-600 hover:bg-orange-50">
                      <mat-icon>lock_reset</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns" class="bg-gray-50"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-gray-50 transition-colors"></tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mat-mdc-table {
      background: transparent;
    }
    .mat-mdc-header-row {
      background-color: #f9fafb;
    }
    .mat-mdc-row:hover {
      background-color: #f9fafb;
    }
  `]
})
export class UserManagementComponent implements OnInit {
  displayedColumns: string[] = ['user', 'role', 'society', 'status', 'lastLogin', 'actions'];
  users: User[] = [];
  searchTerm = '';
  selectedRole = '';
  selectedStatus = '';

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    // Mock data - replace with actual service call
    this.users = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: UserRole.SUPER_ADMIN,
        societyName: 'ABC Credit Society',
        isActive: true,
        lastLogin: new Date()
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        role: UserRole.SOCIETY_ADMIN,
        societyName: 'ABC Credit Society',
        isActive: true,
        lastLogin: new Date(Date.now() - 86400000)
      },
      {
        id: '3',
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@example.com',
        role: UserRole.ACCOUNTANT,
        societyName: 'ABC Credit Society',
        isActive: true,
        lastLogin: new Date(Date.now() - 172800000)
      }
    ];
  }

  openUserDialog(user?: User) {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '600px',
      data: user || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
        this.snackBar.open('User saved successfully', 'Close', { duration: 3000 });
      }
    });
  }

  editUser(user: User) {
    this.openUserDialog(user);
  }

  toggleUserStatus(user: User) {
    user.isActive = !user.isActive;
    this.snackBar.open(`User ${user.isActive ? 'activated' : 'deactivated'} successfully`, 'Close', { duration: 3000 });
  }

  resetPassword(user: User) {
    this.snackBar.open('Password reset email sent successfully', 'Close', { duration: 3000 });
  }

  getFilteredUsers(): User[] {
    return this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.id.includes(this.searchTerm);
      
      const matchesRole = !this.selectedRole || user.role === this.selectedRole;
      const matchesStatus = !this.selectedStatus || 
        (this.selectedStatus === 'active' && user.isActive) ||
        (this.selectedStatus === 'inactive' && !user.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  getTotalUsers(): number {
    return this.users.length;
  }

  getAdminCount(): number {
    return this.users.filter(u => u.role === UserRole.SUPER_ADMIN || u.role === UserRole.SOCIETY_ADMIN).length;
  }

  getAccountantCount(): number {
    return this.users.filter(u => u.role === UserRole.ACCOUNTANT).length;
  }

  getMemberCount(): number {
    return this.users.filter(u => u.role === UserRole.MEMBER).length;
  }

  getInitials(user: User): string {
    return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
  }

  getRoleDisplayName(role: UserRole): string {
    return role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  getRoleChipClass(role: UserRole): string {
    switch (role) {
      case UserRole.SUPER_ADMIN: return 'bg-red-100 text-red-800';
      case UserRole.SOCIETY_ADMIN: return 'bg-blue-100 text-blue-800';
      case UserRole.ACCOUNTANT: return 'bg-green-100 text-green-800';
      case UserRole.MEMBER: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusClass(isActive: boolean): string {
    return isActive 
      ? 'inline-flex items-center text-green-700 text-sm' 
      : 'inline-flex items-center text-red-700 text-sm';
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString();
  }
}
