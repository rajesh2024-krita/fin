
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  membershipDate: Date;
  totalDeposits: number;
  activeLoans: number;
}

@Component({
  selector: 'app-member-details',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatTableModule, MatButtonModule, 
    MatIconModule, MatFormFieldModule, MatInputModule, MatCardModule, MatDialogModule
  ],
  template: `
    <div class="member-container">
      <h1>Member Details</h1>
      
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>{{ isEditing ? 'Edit Member' : 'Add New Member' }}</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="memberForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Full Name</mat-label>
                <input matInput formControlName="name" required>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" required>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Phone</mat-label>
                <input matInput formControlName="phone" required>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Address</mat-label>
                <textarea matInput formControlName="address" rows="3"></textarea>
              </mat-form-field>
            </div>
            
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="!memberForm.valid">
                {{ isEditing ? 'Update' : 'Add' }} Member
              </button>
              <button mat-button type="button" (click)="resetForm()">Reset</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>Members List</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <table mat-table [dataSource]="members" class="members-table">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let member">{{ member.id }}</td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let member">{{ member.name }}</td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let member">{{ member.email }}</td>
            </ng-container>

            <ng-container matColumnDef="phone">
              <th mat-header-cell *matHeaderCellDef>Phone</th>
              <td mat-cell *matCellDef="let member">{{ member.phone }}</td>
            </ng-container>

            <ng-container matColumnDef="totalDeposits">
              <th mat-header-cell *matHeaderCellDef>Total Deposits</th>
              <td mat-cell *matCellDef="let member">₹{{ member.totalDeposits | number:'1.2-2' }}</td>
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
    .member-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .form-card, .table-card {
      margin: 20px 0;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 20px 0;
    }

    .form-actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }

    .members-table {
      width: 100%;
    }

    mat-form-field {
      width: 100%;
    }
  `]
})
export class MemberDetailsComponent implements OnInit {
  memberForm: FormGroup;
  isEditing = false;
  editingId: number | null = null;
  
  displayedColumns = ['id', 'name', 'email', 'phone', 'totalDeposits', 'actions'];
  
  members: Member[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '9876543210', address: '123 Main St', membershipDate: new Date(), totalDeposits: 50000, activeLoans: 1 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '9876543211', address: '456 Oak Ave', membershipDate: new Date(), totalDeposits: 75000, activeLoans: 0 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '9876543212', address: '789 Pine Rd', membershipDate: new Date(), totalDeposits: 30000, activeLoans: 2 }
  ];

  constructor(private fb: FormBuilder) {
    this.memberForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['']
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.memberForm.valid) {
      if (this.isEditing && this.editingId) {
        this.updateMember();
      } else {
        this.addMember();
      }
    }
  }

  addMember() {
    const newMember: Member = {
      id: Math.max(...this.members.map(m => m.id)) + 1,
      ...this.memberForm.value,
      membershipDate: new Date(),
      totalDeposits: 0,
      activeLoans: 0
    };
    this.members.push(newMember);
    this.resetForm();
  }

  editMember(member: Member) {
    this.isEditing = true;
    this.editingId = member.id;
    this.memberForm.patchValue(member);
  }

  updateMember() {
    if (this.editingId) {
      const index = this.members.findIndex(m => m.id === this.editingId);
      if (index !== -1) {
        this.members[index] = { ...this.members[index], ...this.memberForm.value };
      }
    }
    this.resetForm();
  }

  deleteMember(id: number) {
    this.members = this.members.filter(m => m.id !== id);
  }

  resetForm() {
    this.memberForm.reset();
    this.isEditing = false;
    this.editingId = null;
  }
}
