
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService, UserRole } from '../../../services/auth.service';

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
    MatTooltipModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Member Details Management</h1>
        <div class="header-actions" *ngIf="canCreateMembers">
          <button mat-fab color="primary" class="add-fab" (click)="scrollToForm()" 
                  [class.hidden-mobile]="true">
            <mat-icon>add</mat-icon>
          </button>
        </div>
      </div>
      
      <!-- Access Denied Message -->
      <mat-card *ngIf="!canCreateMembers && !canEditMembers" class="access-denied">
        <mat-card-content>
          <div class="access-denied-content">
            <mat-icon color="warn">block</mat-icon>
            <h3>Access Denied</h3>
            <p>You don't have permission to manage members. Only Super Admins and Society Admins can create and manage members.</p>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Add/Edit Member Form -->
      <mat-card class="form-card" *ngIf="canCreateMembers" #memberFormCard>
        <mat-card-header>
          <div class="card-header-content">
            <mat-card-title>{{editingMember ? 'Edit Member' : 'Add New Member'}}</mat-card-title>
            <button mat-icon-button class="close-form-btn" (click)="resetForm()" *ngIf="editingMember">
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="memberForm" (ngSubmit)="saveMember()">
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Member No</mat-label>
                <input matInput formControlName="memberNo" placeholder="Auto-generated" readonly>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Full Name</mat-label>
                <input matInput formControlName="name" required>
                <mat-error *ngIf="memberForm.get('name')?.hasError('required')">Name is required</mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Father's Name</mat-label>
                <input matInput formControlName="fatherName" required>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Address</mat-label>
                <textarea matInput formControlName="address" rows="3" required></textarea>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Phone Number</mat-label>
                <input matInput formControlName="phone" required>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Aadhar Number</mat-label>
                <input matInput formControlName="aadharNo" required>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>PAN Number</mat-label>
                <input matInput formControlName="panNo">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Date of Joining</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="dateOfJoining">
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Membership Fee</mat-label>
                <input matInput type="number" formControlName="membershipFee" required>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Status</mat-label>
                <mat-select formControlName="status">
                  <mat-option value="Active">Active</mat-option>
                  <mat-option value="Inactive">Inactive</mat-option>
                  <mat-option value="Suspended">Suspended</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="!memberForm.valid || !canCreateMembers"
                      class="submit-btn">
                <mat-icon>{{editingMember ? 'update' : 'add'}}</mat-icon>
                {{editingMember ? 'Update Member' : 'Add Member'}}
              </button>
              <button mat-stroked-button type="button" (click)="resetForm()" *ngIf="editingMember">
                <mat-icon>cancel</mat-icon>
                Cancel
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
      
      <!-- Members List -->
      <mat-card class="table-card" *ngIf="canCreateMembers || canEditMembers">
        <mat-card-header>
          <div class="card-header-content">
            <mat-card-title>Members List ({{filteredMembers.length}})</mat-card-title>
            <div class="header-actions-mobile">
              <button mat-raised-button color="primary" (click)="scrollToForm()" 
                      *ngIf="canCreateMembers" class="visible-mobile">
                <mat-icon>add</mat-icon>
                Add Member
              </button>
            </div>
          </div>
        </mat-card-header>
        <mat-card-content>
          <div class="table-controls">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Search Members</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Search by name, phone, or member no">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
          
          <!-- Desktop Table View -->
          <div class="table-container desktop-view">
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
                  <div class="action-buttons">
                    <button mat-icon-button (click)="editMember(member)" color="primary" 
                            [disabled]="!canEditMembers"
                            matTooltip="Edit Member">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button (click)="deleteMember(member.id)" color="warn"
                            [disabled]="!canEditMembers"
                            matTooltip="Delete Member">
                      <mat-icon>delete</mat-icon>
                    </button>
                    <button mat-icon-button (click)="viewMember(member)" color="accent"
                            matTooltip="View Details">
                      <mat-icon>visibility</mat-icon>
                    </button>
                  </div>
                </td>
              </ng-container>
              
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <!-- Mobile Card View -->
          <div class="mobile-view">
            <div class="member-card" *ngFor="let member of filteredMembers">
              <div class="member-card-header">
                <div class="member-info">
                  <h3>{{member.name}}</h3>
                  <p class="member-number">{{member.memberNo}}</p>
                </div>
                <span class="status-badge" [class]="'status-' + member.status.toLowerCase()">
                  {{member.status}}
                </span>
              </div>
              <div class="member-card-content">
                <div class="info-row">
                  <mat-icon>phone</mat-icon>
                  <span>{{member.phone}}</span>
                </div>
                <div class="info-row">
                  <mat-icon>calendar_today</mat-icon>
                  <span>{{member.dateOfJoining | date}}</span>
                </div>
                <div class="info-row">
                  <mat-icon>email</mat-icon>
                  <span>{{member.email || 'Not provided'}}</span>
                </div>
              </div>
              <div class="member-card-actions">
                <button mat-button (click)="editMember(member)" color="primary"
                        [disabled]="!canEditMembers">
                  <mat-icon>edit</mat-icon>
                  Edit
                </button>
                <button mat-button (click)="viewMember(member)" color="accent">
                  <mat-icon>visibility</mat-icon>
                  View
                </button>
                <button mat-button (click)="deleteMember(member.id)" color="warn"
                        [disabled]="!canEditMembers">
                  <mat-icon>delete</mat-icon>
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div class="no-data" *ngIf="filteredMembers.length === 0">
            <mat-icon>people_outline</mat-icon>
            <h3>No members found</h3>
            <p>{{members.length === 0 ? 'Start by adding your first member' : 'Try adjusting your search criteria'}}</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 16px;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    
    .page-header h1 {
      margin: 0;
      font-size: 2rem;
      font-weight: 500;
    }
    
    .header-actions {
      position: relative;
    }
    
    .add-fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 1000;
    }
    
    .form-card, .table-card {
      margin-bottom: 24px;
    }
    
    .card-header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }
    
    .full-width {
      grid-column: 1 / -1;
    }
    
    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      flex-wrap: wrap;
    }
    
    .submit-btn {
      min-width: 150px;
    }
    
    .table-controls {
      margin-bottom: 20px;
    }
    
    .search-field {
      width: 100%;
      max-width: 400px;
    }
    
    .table-container {
      overflow-x: auto;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
    }
    
    .members-table {
      width: 100%;
    }
    
    .action-buttons {
      display: flex;
      gap: 4px;
    }
    
    .status-badge {
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
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
      color: #d32f2f;
    }
    
    .access-denied {
      text-align: center;
      padding: 40px 20px;
    }
    
    .access-denied-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    
    .access-denied-content mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }
    
    .access-denied-content h3 {
      margin: 0;
      color: #f44336;
    }
    
    .no-data {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }
    
    .no-data mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      opacity: 0.5;
    }
    
    /* Mobile View Styles */
    .mobile-view {
      display: none;
    }
    
    .member-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      margin-bottom: 16px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .member-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .member-info h3 {
      margin: 0 0 4px 0;
      font-size: 18px;
      font-weight: 500;
    }
    
    .member-number {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
    
    .member-card-content {
      padding: 16px;
    }
    
    .info-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-size: 14px;
    }
    
    .info-row mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #666;
    }
    
    .member-card-actions {
      display: flex;
      justify-content: space-around;
      padding: 12px 16px;
      border-top: 1px solid #f0f0f0;
      background-color: #fafafa;
    }
    
    .member-card-actions button {
      flex: 1;
      margin: 0 4px;
    }
    
    .header-actions-mobile {
      display: none;
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
      .page-container {
        padding: 12px;
      }
      
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
      
      .page-header h1 {
        font-size: 1.5rem;
      }
      
      .form-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      
      .form-actions {
        justify-content: stretch;
      }
      
      .form-actions button {
        flex: 1;
      }
      
      .desktop-view {
        display: none;
      }
      
      .mobile-view {
        display: block;
      }
      
      .hidden-mobile {
        display: none;
      }
      
      .visible-mobile {
        display: inline-flex !important;
      }
      
      .header-actions-mobile {
        display: block;
      }
      
      .search-field {
        max-width: none;
      }
      
      .card-header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
    }
    
    @media (max-width: 480px) {
      .page-container {
        padding: 8px;
      }
      
      .form-card, .table-card {
        margin-bottom: 16px;
      }
      
      .member-card-actions {
        flex-direction: column;
        gap: 8px;
      }
      
      .member-card-actions button {
        margin: 0;
      }
    }
    
    @media (min-width: 769px) {
      .desktop-view {
        display: block;
      }
      
      .mobile-view {
        display: none;
      }
      
      .hidden-mobile {
        display: inline-flex;
      }
      
      .visible-mobile {
        display: none !important;
      }
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
  canCreateMembers = false;
  canEditMembers = false;
  currentUser: any = null;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.memberForm = this.createForm();
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.checkPermissions();
    this.loadSampleData();
    this.generateMemberNo();
  }

  checkPermissions() {
    this.canCreateMembers = this.authService.hasPermission('members', 'create');
    this.canEditMembers = this.authService.hasPermission('members', 'update');
    
    // Only Super Admin and Society Admin can create members
    const userRole = this.currentUser?.role;
    this.canCreateMembers = userRole === UserRole.SUPER_ADMIN || userRole === UserRole.SOCIETY_ADMIN;
    this.canEditMembers = this.canCreateMembers;
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

  scrollToForm() {
    const formElement = document.querySelector('.form-card');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
