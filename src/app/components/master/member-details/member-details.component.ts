
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

interface Member {
  id: number;
  memberNo: string;
  name: string;
  fatherName: string;
  address: string;
  phone: string;
  email: string;
  aadharNo: string;
  panNo: string;
  dateOfJoining: Date;
  membershipFee: number;
  status: string;
}

@Component({
  selector: 'app-member-details',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="page-container">
      <h1>Member Details Management</h1>
      
      <!-- Add/Edit Member Form -->
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>{{editingMember ? 'Edit Member' : 'Add New Member'}}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="memberForm" (ngSubmit)="saveMember()">
            <div class="form-grid">
              <mat-form-field>
                <mat-label>Member No</mat-label>
                <input matInput formControlName="memberNo" placeholder="Auto-generated" readonly>
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>Full Name</mat-label>
                <input matInput formControlName="name" required>
                <mat-error *ngIf="memberForm.get('name')?.hasError('required')">Name is required</mat-error>
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>Father's Name</mat-label>
                <input matInput formControlName="fatherName" required>
              </mat-form-field>
              
              <mat-form-field class="full-width">
                <mat-label>Address</mat-label>
                <textarea matInput formControlName="address" rows="3" required></textarea>
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>Phone Number</mat-label>
                <input matInput formControlName="phone" required>
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email">
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>Aadhar Number</mat-label>
                <input matInput formControlName="aadharNo" required>
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>PAN Number</mat-label>
                <input matInput formControlName="panNo">
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>Date of Joining</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="dateOfJoining">
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>Membership Fee</mat-label>
                <input matInput type="number" formControlName="membershipFee" required>
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>Status</mat-label>
                <mat-select formControlName="status">
                  <mat-option value="Active">Active</mat-option>
                  <mat-option value="Inactive">Inactive</mat-option>
                  <mat-option value="Suspended">Suspended</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="!memberForm.valid">
                {{editingMember ? 'Update Member' : 'Add Member'}}
              </button>
              <button mat-button type="button" (click)="resetForm()" *ngIf="editingMember">
                Cancel
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
      
      <!-- Members List -->
      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>Members List</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="table-controls">
            <mat-form-field>
              <mat-label>Search Members</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Search by name, phone, or member no">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
          
          <div class="table-container">
            <table mat-table [dataSource]="filteredMembers" class="members-table">
              <ng-container matColumnDef="memberNo">
                <th mat-header-cell *matHeaderCellDef>Member No</th>
                <td mat-cell *matCellDef="let member">{{member.memberNo}}</td>
              </ng-container>
              
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef>Name</th>
                <td mat-cell *matCellDef="let member">{{member.name}}</td>
              </ng-container>
              
              <ng-container matColumnDef="phone">
                <th mat-header-cell *matHeaderCellDef>Phone</th>
                <td mat-cell *matCellDef="let member">{{member.phone}}</td>
              </ng-container>
              
              <ng-container matColumnDef="dateOfJoining">
                <th mat-header-cell *matHeaderCellDef>Joining Date</th>
                <td mat-cell *matCellDef="let member">{{member.dateOfJoining | date}}</td>
              </ng-container>
              
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let member">
                  <span class="status-badge" [class]="'status-' + member.status.toLowerCase()">
                    {{member.status}}
                  </span>
                </td>
              </ng-container>
              
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let member">
                  <button mat-icon-button (click)="editMember(member)" color="primary">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="deleteMember(member.id)" color="warn">
                    <mat-icon>delete</mat-icon>
                  </button>
                  <button mat-icon-button (click)="viewMember(member)" color="accent">
                    <mat-icon>visibility</mat-icon>
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
    
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
    }
    
    .full-width {
      grid-column: 1 / -1;
    }
    
    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
    
    .table-controls {
      margin-bottom: 20px;
    }
    
    .table-container {
      overflow-x: auto;
    }
    
    .members-table {
      width: 100%;
    }
    
    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
    }
    
    .status-active {
      background-color: #4caf50;
      color: white;
    }
    
    .status-inactive {
      background-color: #ff9800;
      color: white;
    }
    
    .status-suspended {
      background-color: #f44336;
      color: white;
    }
  `]
})
export class MemberDetailsComponent implements OnInit {
  memberForm: FormGroup;
  members: Member[] = [];
  filteredMembers: Member[] = [];
  displayedColumns = ['memberNo', 'name', 'phone', 'dateOfJoining', 'status', 'actions'];
  editingMember: Member | null = null;
  nextMemberNo = 1001;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.memberForm = this.createForm();
  }

  ngOnInit() {
    this.loadSampleData();
    this.generateMemberNo();
  }

  createForm(): FormGroup {
    return this.fb.group({
      memberNo: [''],
      name: ['', Validators.required],
      fatherName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.email]],
      aadharNo: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      panNo: ['', [Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
      dateOfJoining: [new Date(), Validators.required],
      membershipFee: [500, [Validators.required, Validators.min(0)]],
      status: ['Active', Validators.required]
    });
  }

  generateMemberNo() {
    this.memberForm.patchValue({
      memberNo: `MEM${this.nextMemberNo.toString().padStart(4, '0')}`
    });
  }

  loadSampleData() {
    this.members = [
      {
        id: 1,
        memberNo: 'MEM1001',
        name: 'John Doe',
        fatherName: 'Robert Doe',
        address: '123 Main Street, City, State',
        phone: '9876543210',
        email: 'john.doe@email.com',
        aadharNo: '123456789012',
        panNo: 'ABCDE1234F',
        dateOfJoining: new Date('2024-01-15'),
        membershipFee: 500,
        status: 'Active'
      },
      {
        id: 2,
        memberNo: 'MEM1002',
        name: 'Jane Smith',
        fatherName: 'Michael Smith',
        address: '456 Oak Avenue, City, State',
        phone: '9876543211',
        email: 'jane.smith@email.com',
        aadharNo: '123456789013',
        panNo: 'ABCDE1234G',
        dateOfJoining: new Date('2024-01-20'),
        membershipFee: 500,
        status: 'Active'
      }
    ];
    this.filteredMembers = [...this.members];
    this.nextMemberNo = Math.max(...this.members.map(m => parseInt(m.memberNo.slice(3)))) + 1;
  }

  saveMember() {
    if (this.memberForm.valid) {
      const formValue = this.memberForm.value;
      
      if (this.editingMember) {
        // Update existing member
        const index = this.members.findIndex(m => m.id === this.editingMember!.id);
        this.members[index] = { ...this.editingMember, ...formValue };
        this.snackBar.open('Member updated successfully', 'Close', { duration: 3000 });
      } else {
        // Add new member
        const newMember: Member = {
          id: Date.now(),
          ...formValue
        };
        this.members.push(newMember);
        this.nextMemberNo++;
        this.snackBar.open('Member added successfully', 'Close', { duration: 3000 });
      }
      
      this.filteredMembers = [...this.members];
      this.resetForm();
    }
  }

  editMember(member: Member) {
    this.editingMember = member;
    this.memberForm.patchValue(member);
  }

  deleteMember(id: number) {
    if (confirm('Are you sure you want to delete this member?')) {
      this.members = this.members.filter(m => m.id !== id);
      this.filteredMembers = [...this.members];
      this.snackBar.open('Member deleted successfully', 'Close', { duration: 3000 });
    }
  }

  viewMember(member: Member) {
    // Implementation for viewing member details
    this.snackBar.open(`Viewing details for ${member.name}`, 'Close', { duration: 2000 });
  }

  resetForm() {
    this.editingMember = null;
    this.memberForm.reset();
    this.memberForm.patchValue({
      dateOfJoining: new Date(),
      membershipFee: 500,
      status: 'Active'
    });
    this.generateMemberNo();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredMembers = this.members.filter(member =>
      member.name.toLowerCase().includes(filterValue) ||
      member.phone.includes(filterValue) ||
      member.memberNo.toLowerCase().includes(filterValue)
    );
  }
}
