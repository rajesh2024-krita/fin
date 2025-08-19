
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { User, UserRole, AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.user ? 'Edit User' : 'Create User' }}</h2>
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content class="space-y-4">
        <mat-form-field class="w-full">
          <mat-label>Username</mat-label>
          <input matInput formControlName="username" required>
        </mat-form-field>
        
        <mat-form-field class="w-full">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" required>
        </mat-form-field>
        
        <mat-form-field class="w-full">
          <mat-label>First Name</mat-label>
          <input matInput formControlName="firstName" required>
        </mat-form-field>
        
        <mat-form-field class="w-full">
          <mat-label>Last Name</mat-label>
          <input matInput formControlName="lastName" required>
        </mat-form-field>
        
        <mat-form-field class="w-full">
          <mat-label>Role</mat-label>
          <mat-select formControlName="role" required>
            <mat-option *ngFor="let role of availableRoles" [value]="role">
              {{ getRoleDisplayName(role) }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </mat-dialog-content>
      
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!userForm.valid">
          {{ data.user ? 'Update' : 'Create' }}
        </button>
      </mat-dialog-actions>
    </form>
  `
})
export class UserFormDialogComponent {
  userForm: FormGroup;
  availableRoles: UserRole[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<UserFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user?: User }
  ) {
    this.userForm = this.fb.group({
      username: [data.user?.username || '', Validators.required],
      email: [data.user?.email || '', [Validators.required, Validators.email]],
      firstName: [data.user?.firstName || '', Validators.required],
      lastName: [data.user?.lastName || '', Validators.required],
      role: [data.user?.role || UserRole.MEMBER, Validators.required]
    });

    this.availableRoles = this.authService.getUserRoles().filter(role =>
      this.authService.canCreateRole(role)
    );
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  getRoleDisplayName(role: UserRole): string {
    const roleNames = {
      [UserRole.SUPER_ADMIN]: 'Super Admin',
      [UserRole.SOCIETY_ADMIN]: 'Society Admin',
      [UserRole.ACCOUNTANT]: 'Accountant',
      [UserRole.MEMBER]: 'Member'
    };
    return roleNames[role];
  }
}
