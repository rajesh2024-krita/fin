
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';

interface SocietyData {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  fax: string;
  email: string;
  website: string;
  registrationNo: string;
  interests: {
    dividend: number;
    od: number;
    cd: number;
    loan: number;
    emergencyLoan: number;
    las: number;
  };
  limits: {
    share: number;
    loan: number;
    emergencyLoan: number;
  };
  chBounceCharge: number;
  chequeReturnCharge: string;
  cash: number;
  bonus: number;
}

interface ApprovalRequest {
  id: string;
  societyId: string;
  requestedBy: string;
  requestedAt: Date;
  changes: Partial<SocietyData>;
  approvals: ApprovalStatus[];
  totalRequired: number;
  status: 'pending' | 'approved' | 'rejected';
}

interface ApprovalStatus {
  userId: string;
  userName: string;
  approved: boolean;
  approvedAt?: Date;
  comments?: string;
}

interface User {
  id: string;
  name: string;
  role: string;
}

@Component({
  selector: 'app-society-approval-dialog',
  template: `
    <div class="p-6">
      <div class="flex items-center mb-4">
        <mat-icon class="text-blue-500 mr-3">check_circle</mat-icon>
        <h2 class="text-section-header font-semibold">Approve Society Changes</h2>
      </div>
      
      <div class="space-y-4 mb-6">
        <p class="text-body text-gray-600 dark:text-gray-400">
          Do you want to approve the pending changes to society information?
        </p>
        
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Comments (Optional)</mat-label>
          <textarea matInput [(ngModel)]="comments" rows="3" placeholder="Add any comments about your approval"></textarea>
        </mat-form-field>
      </div>
      
      <div class="flex justify-end space-x-3">
        <button mat-button (click)="cancel()" class="btn-secondary">
          Cancel
        </button>
        <button mat-raised-button (click)="approve()" class="btn-primary">
          <mat-icon class="mr-2">check</mat-icon>
          Approve Changes
        </button>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule]
})
export class SocietyApprovalDialogComponent {
  comments = '';

  constructor(private dialogRef: MatDialogRef<SocietyApprovalDialogComponent>) {}

  approve() {
    this.dialogRef.close({ approved: true, comments: this.comments });
  }

  cancel() {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-society',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatChipsModule,
    MatBadgeModule,
    MatDialogModule,
    MatTooltipModule,
    MatProgressBarModule
  ],
  template: `
    <div class="space-y-6 animate-fade-in">
      <!-- Professional Page Header -->
      <div class="card-professional overflow-hidden">
        <div class="gradient-header p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <!-- Breadcrumb -->
              <nav class="breadcrumb-professional text-white/80 mb-2">
                <span>Dashboard</span>
                <mat-icon class="separator text-sm">chevron_right</mat-icon>
                <span>File</span>
                <mat-icon class="separator text-sm">chevron_right</mat-icon>
                <span class="active text-white font-medium">Society</span>
              </nav>
              
              <div class="flex items-center space-x-3">
                <div class="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <mat-icon class="text-2xl">business</mat-icon>
                </div>
                <div>
                  <h1 class="text-page-title font-bold">Society Management</h1>
                  <p class="text-body text-white/90">Manage society information and settings</p>
                </div>
              </div>
            </div>
            
            <!-- Pending Approval Badge -->
            <div *ngIf="pendingRequest" class="status-badge warning animate-pulse">
              <mat-icon class="text-sm mr-1">pending</mat-icon>
              Pending Approval ({{getApprovedCount()}}/{{pendingRequest.totalRequired}})
            </div>
          </div>
        </div>
      </div>

      <!-- Approval Status Panel -->
      <div *ngIf="pendingRequest" class="card-professional">
        <div class="gradient-secondary p-4">
          <div class="flex items-center space-x-3">
            <mat-icon class="text-white text-xl">approval</mat-icon>
            <h3 class="text-section-header font-semibold text-white">Approval Status</h3>
          </div>
        </div>
        
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">{{getApprovedCount()}}</div>
                <div class="text-caption text-gray-500">Approved</div>
              </div>
              <div class="text-gray-300">/</div>
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-600">{{pendingRequest.totalRequired}}</div>
                <div class="text-caption text-gray-500">Required</div>
              </div>
            </div>
            
            <div class="flex-1 mx-6">
              <mat-progress-bar 
                mode="determinate" 
                [value]="getApprovalProgress()"
                class="h-3 rounded-full">
              </mat-progress-bar>
            </div>
            
            <div class="text-right">
              <div class="text-body font-medium text-gray-800 dark:text-white">
                {{getPendingCount()}} pending
              </div>
              <div class="text-caption text-gray-500">
                Requested by {{pendingRequest.requestedBy}}
              </div>
            </div>
          </div>
          
          <!-- Approver List -->
          <div class="space-y-2 mb-4">
            <h4 class="text-body font-semibold text-gray-800 dark:text-white mb-3">Approval Status:</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div *ngFor="let approval of pendingRequest.approvals" 
                   class="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <div class="flex items-center space-x-3">
                  <div [class]="approval.approved ? 'w-3 h-3 bg-green-500 rounded-full' : 'w-3 h-3 bg-gray-300 rounded-full'"></div>
                  <span class="text-body font-medium">{{approval.userName}}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <mat-icon *ngIf="approval.approved" class="text-green-500 text-lg">check_circle</mat-icon>
                  <mat-icon *ngIf="!approval.approved" class="text-gray-400 text-lg">pending</mat-icon>
                  <span class="text-caption text-gray-500">
                    {{approval.approved ? (approval.approvedAt | date:'short') : 'Pending'}}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Approve Button -->
          <div *ngIf="canApprove()" class="flex justify-end">
            <button mat-raised-button (click)="openApprovalDialog()" class="btn-primary">
              <mat-icon class="mr-2">check_circle</mat-icon>
              Approve Changes
            </button>
          </div>
        </div>
      </div>

      <!-- Society Form -->
      <div class="card-professional">
        <div class="gradient-header p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <mat-icon class="text-white text-xl">business</mat-icon>
              <h3 class="text-section-header font-semibold text-white">Society Information</h3>
            </div>
            <div class="flex space-x-2">
              <button *ngIf="!isEditing" mat-button (click)="enableEdit()" class="text-white hover:bg-white/20">
                <mat-icon class="mr-2">edit</mat-icon>
                Edit
              </button>
              <button *ngIf="isEditing" mat-button (click)="cancelEdit()" class="text-white hover:bg-white/20">
                <mat-icon class="mr-2">cancel</mat-icon>
                Cancel
              </button>
              <button *ngIf="isEditing" mat-raised-button (click)="saveChanges()" class="bg-white/20 text-white hover:bg-white/30">
                <mat-icon class="mr-2">save</mat-icon>
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <div class="p-6">
          <form [formGroup]="societyForm">
            <mat-tab-group class="professional-tabs">
              
              <!-- Basic Information Tab -->
              <mat-tab label="Basic Information">
                <div class="form-section-content">
                  <div class="form-grid form-grid-2">
                    <mat-form-field appearance="outline">
                      <mat-label>Society Name *</mat-label>
                      <input matInput formControlName="name" [readonly]="!isEditing" placeholder="Enter society name">
                      <mat-icon matSuffix>business</mat-icon>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Registration Number *</mat-label>
                      <input matInput formControlName="registrationNo" [readonly]="!isEditing" placeholder="Enter registration number">
                      <mat-icon matSuffix>assignment</mat-icon>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="md:col-span-2">
                      <mat-label>Address *</mat-label>
                      <textarea matInput formControlName="address" rows="3" [readonly]="!isEditing" placeholder="Enter complete address"></textarea>
                      <mat-icon matSuffix>location_on</mat-icon>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>City *</mat-label>
                      <input matInput formControlName="city" [readonly]="!isEditing" placeholder="Enter city name">
                      <mat-icon matSuffix>location_city</mat-icon>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Phone Number *</mat-label>
                      <input matInput formControlName="phone" [readonly]="!isEditing" placeholder="Enter phone number">
                      <mat-icon matSuffix>phone</mat-icon>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Fax Number</mat-label>
                      <input matInput formControlName="fax" [readonly]="!isEditing" placeholder="Enter fax number">
                      <mat-icon matSuffix>fax</mat-icon>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Email Address *</mat-label>
                      <input matInput type="email" formControlName="email" [readonly]="!isEditing" placeholder="Enter email address">
                      <mat-icon matSuffix>email</mat-icon>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="md:col-span-2">
                      <mat-label>Website URL</mat-label>
                      <input matInput formControlName="website" [readonly]="!isEditing" placeholder="Enter website URL">
                      <mat-icon matSuffix>web</mat-icon>
                    </mat-form-field>
                  </div>
                </div>
              </mat-tab>

              <!-- Interest Rates Tab -->
              <mat-tab label="Interest Rates">
                <div class="form-section-content">
                  <div class="mb-6">
                    <h4 class="text-section-header text-gray-700 dark:text-gray-300 mb-4">Configure Interest Rates (%)</h4>
                    <p class="text-body-sm text-gray-500 mb-6">Set the annual interest rates for different financial products</p>
                  </div>
                  <div class="form-grid form-grid-3">
                    <mat-form-field appearance="outline">
                      <mat-label>Dividend Rate (%)</mat-label>
                      <input matInput type="number" step="0.1" min="0" max="100" formControlName="dividend" [readonly]="!isEditing" placeholder="0.0">
                      <mat-icon matSuffix>trending_up</mat-icon>
                      <mat-hint>Annual dividend rate</mat-hint>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Overdraft Rate (%)</mat-label>
                      <input matInput type="number" step="0.1" min="0" max="100" formControlName="od" [readonly]="!isEditing" placeholder="0.0">
                      <mat-icon matSuffix>account_balance</mat-icon>
                      <mat-hint>OD interest rate</mat-hint>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Certificate Deposit (%)</mat-label>
                      <input matInput type="number" step="0.1" min="0" max="100" formControlName="cd" [readonly]="!isEditing" placeholder="0.0">
                      <mat-icon matSuffix>savings</mat-icon>
                      <mat-hint>CD interest rate</mat-hint>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Regular Loan (%)</mat-label>
                      <input matInput type="number" step="0.1" min="0" max="100" formControlName="loan" [readonly]="!isEditing" placeholder="0.0">
                      <mat-icon matSuffix>money</mat-icon>
                      <mat-hint>Standard loan rate</mat-hint>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Emergency Loan (%)</mat-label>
                      <input matInput type="number" step="0.1" min="0" max="100" formControlName="emergencyLoan" [readonly]="!isEditing" placeholder="0.0">
                      <mat-icon matSuffix>emergency</mat-icon>
                      <mat-hint>Emergency loan rate</mat-hint>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>LAS Rate (%)</mat-label>
                      <input matInput type="number" step="0.1" min="0" max="100" formControlName="las" [readonly]="!isEditing" placeholder="0.0">
                      <mat-icon matSuffix>assessment</mat-icon>
                      <mat-hint>Loan against shares</mat-hint>
                    </mat-form-field>
                  </div>
                </div>
              </mat-tab>

              <!-- Limits Tab -->
              <mat-tab label="Financial Limits">
                <div class="form-section-content">
                  <div class="mb-6">
                    <h4 class="text-section-header text-gray-700 dark:text-gray-300 mb-4">Configure Financial Limits</h4>
                    <p class="text-body-sm text-gray-500 mb-6">Set maximum limits for different financial transactions</p>
                  </div>
                  <div class="form-grid form-grid-3">
                    <mat-form-field appearance="outline">
                      <mat-label>Share Limit (₹)</mat-label>
                      <input matInput type="number" min="0" formControlName="shareLimit" [readonly]="!isEditing" placeholder="0">
                      <mat-icon matSuffix>share</mat-icon>
                      <mat-hint>Maximum share amount</mat-hint>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Loan Limit (₹)</mat-label>
                      <input matInput type="number" min="0" formControlName="loanLimit" [readonly]="!isEditing" placeholder="0">
                      <mat-icon matSuffix>account_balance_wallet</mat-icon>
                      <mat-hint>Maximum loan amount</mat-hint>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Emergency Loan Limit (₹)</mat-label>
                      <input matInput type="number" min="0" formControlName="emergencyLoanLimit" [readonly]="!isEditing" placeholder="0">
                      <mat-icon matSuffix>emergency</mat-icon>
                      <mat-hint>Maximum emergency loan</mat-hint>
                    </mat-form-field>
                  </div>
                </div>
              </mat-tab>

              <!-- Charges Tab -->
              <mat-tab label="Charges & Fees">
                <div class="form-section-content">
                  <div class="mb-6">
                    <h4 class="text-section-header text-gray-700 dark:text-gray-300 mb-4">Configure Charges & Fees</h4>
                    <p class="text-body-sm text-gray-500 mb-6">Set various charges and bonus amounts for society operations</p>
                  </div>
                  <div class="form-grid form-grid-2">
                    <mat-form-field appearance="outline">
                      <mat-label>Cheque Bounce Charge (₹)</mat-label>
                      <input matInput type="number" min="0" formControlName="chBounceCharge" [readonly]="!isEditing" placeholder="0">
                      <mat-icon matSuffix>money_off</mat-icon>
                      <mat-hint>Charge for bounced cheques</mat-hint>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Cheque Return Charge Type</mat-label>
                      <mat-select formControlName="chequeReturnCharge" [disabled]="!isEditing">
                        <mat-option value="">Select charge type</mat-option>
                        <mat-option value="fixed">Fixed Amount</mat-option>
                        <mat-option value="percentage">Percentage Based</mat-option>
                      </mat-select>
                      <mat-icon matSuffix>receipt</mat-icon>
                      <mat-hint>How cheque return charges are calculated</mat-hint>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Cash Handling Charge (₹)</mat-label>
                      <input matInput type="number" min="0" formControlName="cash" [readonly]="!isEditing" placeholder="0">
                      <mat-icon matSuffix>payments</mat-icon>
                      <mat-hint>Charge for cash transactions</mat-hint>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Annual Bonus (₹)</mat-label>
                      <input matInput type="number" min="0" formControlName="bonus" [readonly]="!isEditing" placeholder="0">
                      <mat-icon matSuffix>card_giftcard</mat-icon>
                      <mat-hint>Annual bonus amount for members</mat-hint>
                    </mat-form-field>
                  </div>
                </div>
              </mat-tab>

            </mat-tab-group>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .professional-tabs ::ng-deep .mat-mdc-tab-group {
      --mdc-secondary-navigation-tab-container-height: 48px;
    }

    .professional-tabs ::ng-deep .mat-mdc-tab {
      min-width: 120px;
      font-weight: 500;
    }

    .professional-tabs ::ng-deep .mat-mdc-tab-header {
      border-bottom: 1px solid var(--color-border);
    }

    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: .5; }
    }
  `]
})
export class SocietyComponent implements OnInit {
  societyForm: FormGroup;
  isEditing = false;
  societyData: SocietyData | null = null;
  pendingRequest: ApprovalRequest | null = null;
  currentUser = { id: 'user1', name: 'John Doe', role: 'society_admin' };
  
  // Mock users who need to approve
  approvalUsers: User[] = [
    { id: 'user1', name: 'John Doe', role: 'society_admin' },
    { id: 'user2', name: 'Jane Smith', role: 'society_admin' },
    { id: 'user3', name: 'Bob Wilson', role: 'super_admin' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.societyForm = this.createForm();
  }

  ngOnInit() {
    this.loadSocietyData();
    this.loadPendingRequest();
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      registrationNo: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', Validators.required],
      fax: [''],
      email: ['', [Validators.required, Validators.email]],
      website: [''],
      dividend: [0, [Validators.min(0), Validators.max(100)]],
      od: [0, [Validators.min(0), Validators.max(100)]],
      cd: [0, [Validators.min(0), Validators.max(100)]],
      loan: [0, [Validators.min(0), Validators.max(100)]],
      emergencyLoan: [0, [Validators.min(0), Validators.max(100)]],
      las: [0, [Validators.min(0), Validators.max(100)]],
      shareLimit: [0, Validators.min(0)],
      loanLimit: [0, Validators.min(0)],
      emergencyLoanLimit: [0, Validators.min(0)],
      chBounceCharge: [0, Validators.min(0)],
      chequeReturnCharge: ['fixed'],
      cash: [0, Validators.min(0)],
      bonus: [0, Validators.min(0)]
    });
  }

  loadSocietyData() {
    // Mock data - replace with actual API call
    this.societyData = {
      id: 'society1',
      name: 'ABC Housing Society',
      address: '123 Main Street, Downtown',
      city: 'Mumbai',
      phone: '+91 9876543210',
      fax: '+91 2234567890',
      email: 'info@abcsociety.com',
      website: 'www.abcsociety.com',
      registrationNo: 'REG123456789',
      interests: {
        dividend: 8.5,
        od: 12.0,
        cd: 6.5,
        loan: 10.0,
        emergencyLoan: 15.0,
        las: 7.5
      },
      limits: {
        share: 500000,
        loan: 1000000,
        emergencyLoan: 200000
      },
      chBounceCharge: 500,
      chequeReturnCharge: 'fixed',
      cash: 1000,
      bonus: 2500
    };

    this.populateForm();
  }

  loadPendingRequest() {
    // Mock pending request - replace with actual API call
    this.pendingRequest = {
      id: 'req1',
      societyId: 'society1',
      requestedBy: 'John Doe',
      requestedAt: new Date(),
      changes: {
        name: 'ABC Premium Housing Society',
        interests: { dividend: 9.0, od: 12.0, cd: 7.0, loan: 10.5, emergencyLoan: 15.5, las: 8.0 }
      },
      approvals: [
        { userId: 'user1', userName: 'John Doe', approved: true, approvedAt: new Date() },
        { userId: 'user2', userName: 'Jane Smith', approved: false },
        { userId: 'user3', userName: 'Bob Wilson', approved: false }
      ],
      totalRequired: 3,
      status: 'pending'
    };
  }

  populateForm() {
    if (this.societyData) {
      this.societyForm.patchValue({
        name: this.societyData.name,
        registrationNo: this.societyData.registrationNo,
        address: this.societyData.address,
        city: this.societyData.city,
        phone: this.societyData.phone,
        fax: this.societyData.fax,
        email: this.societyData.email,
        website: this.societyData.website,
        dividend: this.societyData.interests.dividend,
        od: this.societyData.interests.od,
        cd: this.societyData.interests.cd,
        loan: this.societyData.interests.loan,
        emergencyLoan: this.societyData.interests.emergencyLoan,
        las: this.societyData.interests.las,
        shareLimit: this.societyData.limits.share,
        loanLimit: this.societyData.limits.loan,
        emergencyLoanLimit: this.societyData.limits.emergencyLoan,
        chBounceCharge: this.societyData.chBounceCharge,
        chequeReturnCharge: this.societyData.chequeReturnCharge,
        cash: this.societyData.cash,
        bonus: this.societyData.bonus
      });
    }
  }

  enableEdit() {
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
    this.populateForm(); // Reset form to original values
  }

  saveChanges() {
    if (this.societyForm.valid) {
      // Create approval request
      const changes = this.societyForm.value;
      
      // Simulate creating a new approval request
      this.pendingRequest = {
        id: 'req' + Date.now(),
        societyId: 'society1',
        requestedBy: this.currentUser.name,
        requestedAt: new Date(),
        changes: changes,
        approvals: this.approvalUsers.map(user => ({
          userId: user.id,
          userName: user.name,
          approved: false
        })),
        totalRequired: this.approvalUsers.length,
        status: 'pending'
      };

      this.isEditing = false;
      
      // Show success message
      console.log('Changes saved and sent for approval');
    }
  }

  getApprovedCount(): number {
    return this.pendingRequest?.approvals.filter(a => a.approved).length || 0;
  }

  getPendingCount(): number {
    return this.pendingRequest?.approvals.filter(a => !a.approved).length || 0;
  }

  getApprovalProgress(): number {
    if (!this.pendingRequest) return 0;
    return (this.getApprovedCount() / this.pendingRequest.totalRequired) * 100;
  }

  canApprove(): any {
    if (!this.pendingRequest) return false;
    const userApproval = this.pendingRequest.approvals.find(a => a.userId === this.currentUser.id);
    return userApproval && !userApproval.approved;
  }

  openApprovalDialog() {
    const dialogRef = this.dialog.open(SocietyApprovalDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.approved) {
        this.approveChanges(result.comments);
      }
    });
  }

  approveChanges(comments?: string) {
    if (!this.pendingRequest) return;

    const userApproval = this.pendingRequest.approvals.find(a => a.userId === this.currentUser.id);
    if (userApproval) {
      userApproval.approved = true;
      userApproval.approvedAt = new Date();
      userApproval.comments = comments;

      // Check if all approvals are complete
      const allApproved = this.pendingRequest.approvals.every(a => a.approved);
      if (allApproved) {
        // Apply changes to society data
        this.applyPendingChanges();
        this.pendingRequest = null;
      }
    }
  }

  applyPendingChanges() {
    if (!this.pendingRequest || !this.societyData) return;

    // Merge pending changes with society data
    Object.assign(this.societyData, this.pendingRequest.changes);
    this.populateForm();
    
    console.log('All approvals complete. Changes applied successfully!');
  }
}
