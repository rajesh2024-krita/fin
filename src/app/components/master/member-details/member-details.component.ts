
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

interface Member {
  id: number;
  memberCode: string;
  name: string;
  fatherName: string;
  address: string;
  phone: string;
  email: string;
  joinDate: string;
  status: string;
}

@Component({
  selector: 'app-member-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="page-container">
      <h1>Member Details Management</h1>
      
      <!-- Add/Edit Form -->
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>{{isEditing ? 'Edit' : 'Add'}} Member</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="memberForm" (ngSubmit)="onSubmit()" class="member-form">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Member Code</mat-label>
                <input matInput formControlName="memberCode" required>
                <mat-error *ngIf="memberForm.get('memberCode')?.hasError('required')">
                  Member Code is required
                </mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Name</mat-label>
                <input matInput formControlName="name" required>
                <mat-error *ngIf="memberForm.get('name')?.hasError('required')">
                  Name is required
                </mat-error>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Father's Name</mat-label>
                <input matInput formControlName="fatherName" required>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Phone</mat-label>
                <input matInput formControlName="phone" required>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Address</mat-label>
                <textarea matInput formControlName="address" rows="3"></textarea>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" type="email">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Join Date</mat-label>
                <input matInput formControlName="joinDate" type="date" required>
              </mat-form-field>
            </div>
            
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="memberForm.invalid">
                {{isEditing ? 'Update' : 'Add'}} Member
              </button>
              <button mat-button type="button" (click)="resetForm()" *ngIf="isEditing">
                Cancel
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
      
      <!-- Members Table -->
      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>Members List</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="members" class="mat-elevation-z2">
            <ng-container matColumnDef="memberCode">
              <th mat-header-cell *matHeaderCellDef>Member Code</th>
              <td mat-cell *matCellDef="let member">{{member.memberCode}}</td>
            </ng-container>
            
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let member">{{member.name}}</td>
            </ng-container>
            
            <ng-container matColumnDef="fatherName">
              <th mat-header-cell *matHeaderCellDef>Father's Name</th>
              <td mat-cell *matCellDef="let member">{{member.fatherName}}</td>
            </ng-container>
            
            <ng-container matColumnDef="phone">
              <th mat-header-cell *matHeaderCellDef>Phone</th>
              <td mat-cell *matCellDef="let member">{{member.phone}}</td>
            </ng-container>
            
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let member">{{member.status}}</td>
            </ng-container>
            
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let member">
                <button mat-icon-button color="primary" (click)="editMember(member)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteMember(member.id)">
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
    
    .form-card, .table-card {
      margin-bottom: 20px;
    }
    
    .member-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .form-row {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }
    
    .form-row mat-form-field {
      flex: 1;
    }
    
    .full-width {
      width: 100%;
    }
    
    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 16px;
    }
    
    table {
      width: 100%;
    }
    
    .mat-mdc-header-cell, .mat-mdc-cell {
      padding: 8px;
    }
  `]
})
export class MemberDetailsComponent implements OnInit {
  memberForm: FormGroup;
  members: Member[] = [];
  isEditing = false;
  editingId: number | null = null;
  displayedColumns: string[] = ['memberCode', 'name', 'fatherName', 'phone', 'status', 'actions'];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.memberForm = this.fb.group({
      memberCode: ['', Validators.required],
      name: ['', Validators.required],
      fatherName: ['', Validators.required],
      address: [''],
      phone: ['', Validators.required],
      email: ['', [Validators.email]],
      joinDate: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadSampleData();
  }

  loadSampleData() {
    this.members = [
      {
        id: 1,
        memberCode: 'MEM001',
        name: 'John Doe',
        fatherName: 'Robert Doe',
        address: '123 Main St, City',
        phone: '9876543210',
        email: 'john@example.com',
        joinDate: '2023-01-15',
        status: 'Active'
      },
      {
        id: 2,
        memberCode: 'MEM002',
        name: 'Jane Smith',
        fatherName: 'Michael Smith',
        address: '456 Oak Ave, Town',
        phone: '9876543211',
        email: 'jane@example.com',
        joinDate: '2023-02-20',
        status: 'Active'
      }
    ];
  }

  onSubmit() {
    if (this.memberForm.valid) {
      const formValue = this.memberForm.value;
      
      if (this.isEditing && this.editingId) {
        // Update existing member
        const index = this.members.findIndex(m => m.id === this.editingId);
        if (index !== -1) {
          this.members[index] = { ...this.members[index], ...formValue };
          this.snackBar.open('Member updated successfully!', 'Close', { duration: 3000 });
        }
      } else {
        // Add new member
        const newMember: Member = {
          id: this.members.length + 1,
          ...formValue,
          status: 'Active'
        };
        this.members.push(newMember);
        this.snackBar.open('Member added successfully!', 'Close', { duration: 3000 });
      }
      
      this.resetForm();
    }
  }

  editMember(member: Member) {
    this.isEditing = true;
    this.editingId = member.id;
    this.memberForm.patchValue(member);
  }

  deleteMember(id: number) {
    if (confirm('Are you sure you want to delete this member?')) {
      this.members = this.members.filter(m => m.id !== id);
      this.snackBar.open('Member deleted successfully!', 'Close', { duration: 3000 });
    }
  }

  resetForm() {
    this.memberForm.reset();
    this.isEditing = false;
    this.editingId = null;
  }
}
