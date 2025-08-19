import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthService, User, UserRole } from '../../services/auth.service';
import { UserFormDialogComponent } from './user-form-dialog.component';

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <h2 mat-dialog-title>{{data.user ? 'Edit' : 'Create'}} User</h2>
    <mat-dialog-content>
      <form [formGroup]="userForm" class="user-form">
        <mat-form-field appearance="outline">
          <mat-label>Username</mat-label>
          <input matInput formControlName="username" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>First Name</mat-label>
          <input matInput formControlName="firstName" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Last Name</mat-label>
          <input matInput formControlName="lastName" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Role</mat-label>
          <mat-select formControlName="role" required>
            <mat-option *ngFor="let role of availableRoles" [value]="role">
              {{getRoleDisplayName(role)}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" *ngIf="showSocietyFields">
          <mat-label>Society ID</mat-label>
          <input matInput type="number" formControlName="societyId">
        </mat-form-field>

        <mat-form-field appearance="outline" *ngIf="showSocietyFields">
          <mat-label>Society Name</mat-label>
          <input matInput formControlName="societyName">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="userForm.invalid">
        {{data.user ? 'Update' : 'Create'}}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .user-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 400px;
    }
  `]
})
export class UserFormDialogComponent implements OnInit {
  userForm: FormGroup;
  availableRoles: UserRole[] = [];
  showSocietyFields = false;

  constructor(
    public dialogRef: MatDialogRef<UserFormDialogComponent>,
    private fb: FormBuilder,
    private authService: AuthService,
    // public data: { user?: User }
    @Inject(MAT_DIALOG_DATA) public data: { user?: User }
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      role: ['', Validators.required],
      societyId: [''],
      societyName: ['']
    });
  }

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    this.availableRoles = this.authService.getUserRoles().filter(role => 
      this.authService.canCreateRole(role)
    );

    if (this.data.user) {
      this.userForm.patchValue(this.data.user);
    }

    // Set default society info for non-super admins
    if (currentUser?.role !== UserRole.SUPER_ADMIN) {
      this.userForm.patchValue({
        societyId: currentUser?.societyId,
        societyName: currentUser?.societyName
      });
      this.showSocietyFields = true;
    }

    this.userForm.get('role')?.valueChanges.subscribe(role => {
      this.showSocietyFields = role !== UserRole.SUPER_ADMIN;
    });
  }

  getRoleDisplayName(role: UserRole): string {
    return role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    MatSlideToggleModule
  ],
  template: `
    <div class="page-container">
      <h1>User Management</h1>

      <mat-card>
        <mat-card-header>
          <mat-card-title>System Users</mat-card-title>
          <div class="header-actions">
            <button mat-raised-button color="primary" (click)="openUserDialog()" 
                    *ngIf="canCreateUsers">
              <mat-icon>add</mat-icon>
              Add User
            </button>
          </div>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="dataSource" class="user-table">
            <ng-container matColumnDef="username">
              <th mat-header-cell *matHeaderCellDef>Username</th>
              <td mat-cell *matCellDef="let user">{{user.username}}</td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let user">{{user.firstName}} {{user.lastName}}</td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let user">{{user.email}}</td>
            </ng-container>

            <ng-container matColumnDef="role">
              <th mat-header-cell *matHeaderCellDef>Role</th>
              <td mat-cell *matCellDef="let user">
                <span class="role-badge" [class]="'role-' + user.role.toLowerCase()">
                  {{getRoleDisplayName(user.role)}}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="society">
              <th mat-header-cell *matHeaderCellDef>Society</th>
              <td mat-cell *matCellDef="let user">{{user.societyName || 'N/A'}}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let user">
                <mat-slide-toggle [checked]="user.isActive" 
                                  (change)="toggleUserStatus(user)"
                                  [disabled]="!canEditUser(user)">
                </mat-slide-toggle>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let user">
                <button mat-icon-button (click)="openUserDialog(user)" 
                        [disabled]="!canEditUser(user)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteUser(user)" 
                        [disabled]="!canDeleteUser(user)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .header-actions {
      margin-left: auto;
    }

    .user-table {
      width: 100%;
      margin-top: 16px;
    }

    .role-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .role-super_admin { background-color: #ff5722; color: white; }
    .role-society_admin { background-color: #2196f3; color: white; }
    .role-accountant { background-color: #4caf50; color: white; }
    .role-member { background-color: #9e9e9e; color: white; }

    mat-card-header {
      display: flex;
      align-items: center;
    }
  `]
})
export class UserManagementComponent implements OnInit {
  displayedColumns: string[] = ['username', 'name', 'email', 'role', 'society', 'status', 'actions'];
  dataSource = new MatTableDataSource<User>();
  currentUser: User | null = null;
  canCreateUsers = false;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.canCreateUsers = this.authService.hasPermission('users', 'create');
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getUsers().subscribe(users => {
      this.dataSource.data = users;
    });
  }

  openUserDialog(user?: User) {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '500px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (user) {
          // Update existing user
          const updatedUser = { ...user, ...result };
          this.authService.updateUser(updatedUser);
          this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
        } else {
          // Create new user
          this.authService.createUser(result).subscribe({
            next: (newUser) => {
              this.snackBar.open('User created successfully', 'Close', { duration: 3000 });
              this.loadUsers();
            },
            error: (error) => {
              this.snackBar.open('Failed to create user', 'Close', { duration: 3000 });
            }
          });
        }
      }
    });
  }

  toggleUserStatus(user: User) {
    user.isActive = !user.isActive;
    this.authService.updateUser(user);
    this.snackBar.open(`User ${user.isActive ? 'activated' : 'deactivated'}`, 'Close', { duration: 3000 });
  }

  deleteUser(user: User) {
    if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
      this.authService.deleteUser(user.id);
      this.loadUsers();
      this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
    }
  }

  canEditUser(user: User): boolean {
    if (!this.currentUser) return false;
    if (this.currentUser.role === UserRole.SUPER_ADMIN) return true;
    if (this.currentUser.role === UserRole.SOCIETY_ADMIN) {
      return user.societyId === this.currentUser.societyId && user.role !== UserRole.SUPER_ADMIN;
    }
    return false;
  }

  canDeleteUser(user: User): boolean {
    return this.canEditUser(user) && user.id !== this.currentUser?.id;
  }

  getRoleDisplayName(role: UserRole): string {
    return role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }
}