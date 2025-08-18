
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

interface Member {
  id: number;
  memberCode: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
  email: string;
  dateOfJoining: Date;
  membershipType: string;
  status: string;
  nomineeName: string;
  nomineeRelation: string;
  shareAmount: number;
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
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatDialogModule
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
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>First Name</mat-label>
                <input matInput formControlName="firstName" required>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName" required>
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
              
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" type="email">
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Address</mat-label>
                <textarea matInput formControlName="address" rows="3" required></textarea>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>City</mat-label>
                <input matInput formControlName="city" required>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>State</mat-label>
                <input matInput formControlName="state" required>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Pin Code</mat-label>
                <input matInput formControlName="pinCode" required>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Date of Joining</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="dateOfJoining" required>
                <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Membership Type</mat-label>
                <mat-select formControlName="membershipType" required>
                  <mat-option value="Regular">Regular</mat-option>
                  <mat-option value="Associate">Associate</mat-option>
                  <mat-option value="Nominal">Nominal</mat-option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Status</mat-label>
                <mat-select formControlName="status" required>
                  <mat-option value="Active">Active</mat-option>
                  <mat-option value="Inactive">Inactive</mat-option>
                  <mat-option value="Suspended">Suspended</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Nominee Name</mat-label>
                <input matInput formControlName="nomineeName">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Nominee Relation</mat-label>
                <input matInput formControlName="nomineeRelation">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Share Amount</mat-label>
                <input matInput formControlName="shareAmount" type="number" required>
              </mat-form-field>
            </div>
            
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="!memberForm.valid">
                {{isEditing ? 'Update' : 'Add'}} Member
              </button>
              <button mat-button type="button" (click)="resetForm()" class="ml-2">
                Reset
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
          <div class="table-container">
            <table mat-table [dataSource]="members" class="mat-elevation-z8">
              
              <ng-container matColumnDef="memberCode">
                <th mat-header-cell *matHeaderCellDef>Member Code</th>
                <td mat-cell *matCellDef="let member">{{member.memberCode}}</td>
              </ng-container>

              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Name</th>
                <td mat-cell *matCellDef="let member">{{member.firstName}} {{member.lastName}}</td>
              </ng-container>

              <ng-container matColumnDef="phone">
                <th mat-header-cell *matHeaderCellDef>Phone</th>
                <td mat-cell *matCellDef="let member">{{member.phone}}</td>
              </ng-container>

              <ng-container matColumnDef="membershipType">
                <th mat-header-cell *matHeaderCellDef>Type</th>
                <td mat-cell *matCellDef="let member">{{member.membershipType}}</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let member">
                  <span [class]="'status-badge status-' + member.status.toLowerCase()">{{member.status}}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="shareAmount">
                <th mat-header-cell *matHeaderCellDef>Share Amount</th>
                <td mat-cell *matCellDef="let member">₹{{member.shareAmount | number}}</td>
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
          </div>
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
      gap: 20px;
    }

    .form-row {
      display: flex;
      gap: 20px;
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
      gap: 10px;
      margin-top: 20px;
    }

    .table-container {
      max-height: 600px;
      overflow: auto;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-active {
      background-color: #e8f5e8;
      color: #2e7d32;
    }

    .status-inactive {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .status-suspended {
      background-color: #ffebee;
      color: #c62828;
    }

    .ml-2 {
      margin-left: 8px;
    }
  `]
})
export class MemberDetailsComponent implements OnInit {
  memberForm: FormGroup;
  members: Member[] = [];
  isEditing = false;
  editingId: number | null = null;
  displayedColumns: string[] = ['memberCode', 'name', 'phone', 'membershipType', 'status', 'shareAmount', 'actions'];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.memberForm = this.fb.group({
      memberCode: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      fatherName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pinCode: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.email]],
      dateOfJoining: ['', Validators.required],
      membershipType: ['', Validators.required],
      status: ['Active', Validators.required],
      nomineeName: [''],
      nomineeRelation: [''],
      shareAmount: [0, [Validators.required, Validators.min(0)]]
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
        firstName: 'John',
        lastName: 'Doe',
        fatherName: 'Robert Doe',
        address: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pinCode: '400001',
        phone: '9876543210',
        email: 'john.doe@email.com',
        dateOfJoining: new Date('2023-01-15'),
        membershipType: 'Regular',
        status: 'Active',
        nomineeName: 'Jane Doe',
        nomineeRelation: 'Wife',
        shareAmount: 5000
      },
      {
        id: 2,
        memberCode: 'MEM002',
        firstName: 'Alice',
        lastName: 'Smith',
        fatherName: 'Michael Smith',
        address: '456 Oak Avenue',
        city: 'Delhi',
        state: 'Delhi',
        pinCode: '110001',
        phone: '9876543211',
        email: 'alice.smith@email.com',
        dateOfJoining: new Date('2023-02-20'),
        membershipType: 'Associate',
        status: 'Active',
        nomineeName: 'Bob Smith',
        nomineeRelation: 'Brother',
        shareAmount: 3000
      }
    ];
  }

  onSubmit() {
    if (this.memberForm.valid) {
      const formData = this.memberForm.value;
      
      if (this.isEditing && this.editingId) {
        // Update existing member
        const index = this.members.findIndex(m => m.id === this.editingId);
        if (index !== -1) {
          this.members[index] = { ...formData, id: this.editingId };
          this.snackBar.open('Member updated successfully!', 'Close', { duration: 3000 });
        }
      } else {
        // Add new member
        const newMember: Member = {
          ...formData,
          id: Math.max(...this.members.map(m => m.id), 0) + 1
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
    this.memberForm.patchValue({ status: 'Active', shareAmount: 0 });
    this.isEditing = false;
    this.editingId = null;
  }
}
