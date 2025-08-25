import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MemberService, Member } from '../../../services/member.service';

export interface DialogData {
  mode: 'create' | 'edit';
  member?: Member;
}

@Component({
  selector: 'app-member-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  template: `
    <div class="member-dialog">
      <div class="dialog-header">
        <h2 mat-dialog-title class="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <mat-icon>{{isEditMode ? 'edit' : 'person_add'}}</mat-icon>
          {{isEditMode ? 'Edit Member' : 'Create New Member'}}
        </h2>
        <button mat-icon-button (click)="onCancel()" class="text-gray-500 hover:text-gray-700">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content class="dialog-content">
        <form [formGroup]="memberForm" class="member-form">
          <!-- Personal Details Section -->
          <div class="form-section">
            <h3 class="section-title">Personal Details</h3>
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Member Number *</mat-label>
                <input matInput formControlName="memberNo" placeholder="Enter member number" required>
                <mat-error *ngIf="memberForm.get('memberNo')?.hasError('required')">
                  Member number is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Full Name *</mat-label>
                <input matInput formControlName="name" placeholder="Enter full name" required>
                <mat-error *ngIf="memberForm.get('name')?.hasError('required')">
                  Name is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Father/Husband Name *</mat-label>
                <input matInput formControlName="fhName" placeholder="Enter father/husband name" required>
                <mat-error *ngIf="memberForm.get('fhName')?.hasError('required')">
                  Father/Husband name is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Date of Birth</mat-label>
                <input matInput [matDatepicker]="dobPicker" formControlName="dateOfBirth">
                <mat-datepicker-toggle matSuffix [for]="dobPicker"></mat-datepicker-toggle>
                <mat-datepicker #dobPicker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Mobile</mat-label>
                <input matInput formControlName="mobile" placeholder="Enter mobile number" maxlength="10">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" placeholder="Enter email address">
                <mat-error *ngIf="memberForm.get('email')?.hasError('email')">
                  Please enter a valid email
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>City</mat-label>
                <input matInput formControlName="city" placeholder="Enter city">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Status</mat-label>
                <mat-select formControlName="status">
                  <mat-option value="Active">Active</mat-option>
                  <mat-option value="Inactive">Inactive</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-grid-full">
              <mat-form-field appearance="outline">
                <mat-label>Office Address</mat-label>
                <textarea matInput formControlName="officeAddress" placeholder="Enter office address" rows="3"></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Residence Address</mat-label>
                <textarea matInput formControlName="residenceAddress" placeholder="Enter residence address" rows="3"></textarea>
              </mat-form-field>
            </div>
          </div>

          <!-- Professional Details Section -->
          <div class="form-section">
            <h3 class="section-title">Professional Details</h3>
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Designation</mat-label>
                <input matInput formControlName="designation" placeholder="Enter designation">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Branch</mat-label>
                <input matInput formControlName="branch" placeholder="Enter branch">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Date of Joining Job</mat-label>
                <input matInput [matDatepicker]="dojJobPicker" formControlName="dojJob">
                <mat-datepicker-toggle matSuffix [for]="dojJobPicker"></mat-datepicker-toggle>
                <mat-datepicker #dojJobPicker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Date of Retirement</mat-label>
                <input matInput [matDatepicker]="retirementPicker" formControlName="doRetirement">
                <mat-datepicker-toggle matSuffix [for]="retirementPicker"></mat-datepicker-toggle>
                <mat-datepicker #retirementPicker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Date of Joining Society</mat-label>
                <input matInput [matDatepicker]="dojSocietyPicker" formControlName="dojSociety">
                <mat-datepicker-toggle matSuffix [for]="dojSocietyPicker"></mat-datepicker-toggle>
                <mat-datepicker #dojSocietyPicker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Phone Office</mat-label>
                <input matInput formControlName="phoneOffice" placeholder="Enter office phone">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Phone Residence</mat-label>
                <input matInput formControlName="phoneResidence" placeholder="Enter residence phone">
              </mat-form-field>
            </div>
          </div>

          <!-- Financial Details Section -->
          <div class="form-section">
            <h3 class="section-title">Financial Details</h3>
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Share Amount</mat-label>
                <input matInput type="number" formControlName="shareAmount" placeholder="0.00" min="0">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>CD Amount</mat-label>
                <input matInput type="number" formControlName="cdAmount" placeholder="0.00" min="0">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Bank Name</mat-label>
                <input matInput formControlName="bankName" placeholder="Enter bank name">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Payable At</mat-label>
                <input matInput formControlName="payableAt" placeholder="Enter payable location">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Account Number</mat-label>
                <input matInput formControlName="accountNo" placeholder="Enter account number">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Share Deduction</mat-label>
                <input matInput type="number" formControlName="shareDeduction" placeholder="0.00" min="0">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Withdrawal</mat-label>
                <input matInput type="number" formControlName="withdrawal" placeholder="0.00" min="0">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>G-Loan Instalment</mat-label>
                <input matInput type="number" formControlName="gLoanInstalment" placeholder="0.00" min="0">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>E-Loan Instalment</mat-label>
                <input matInput type="number" formControlName="eLoanInstalment" placeholder="0.00" min="0">
              </mat-form-field>
            </div>
          </div>

          <!-- Nominee Details Section -->
          <div class="form-section">
            <h3 class="section-title">Nominee Details</h3>
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Nominee Name</mat-label>
                <input matInput formControlName="nominee" placeholder="Enter nominee name">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Nominee Relation</mat-label>
                <mat-select formControlName="nomineeRelation">
                  <mat-option value="">Select relation</mat-option>
                  <mat-option value="Spouse">Spouse</mat-option>
                  <mat-option value="Son">Son</mat-option>
                  <mat-option value="Daughter">Daughter</mat-option>
                  <mat-option value="Father">Father</mat-option>
                  <mat-option value="Mother">Mother</mat-option>
                  <mat-option value="Brother">Brother</mat-option>
                  <mat-option value="Sister">Sister</mat-option>
                  <mat-option value="Other">Other</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions class="dialog-actions">
        <button mat-button (click)="onCancel()" class="cancel-btn">
          <mat-icon>close</mat-icon>
          Cancel
        </button>
        <button mat-raised-button color="primary" (click)="onSave()" [disabled]="memberForm.invalid || isSubmitting" class="save-btn">
          <mat-icon>{{isEditMode ? 'save' : 'add'}}</mat-icon>
          {{isEditMode ? 'Update Member' : 'Create Member'}}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .member-dialog {
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px 0;
      border-bottom: 1px solid #e0e0e0;
      margin-bottom: 20px;
    }

    .dialog-content {
      flex: 1;
      overflow-y: auto;
      padding: 0 24px;
    }

    .dialog-actions {
      padding: 20px 24px;
      border-top: 1px solid #e0e0e0;
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .form-section {
      margin-bottom: 32px;
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-grid-full {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }

      .form-grid-full {
        grid-template-columns: 1fr;
      }
    }

    .save-btn {
      background-color: #3b82f6 !important;
      color: white !important;
    }

    .cancel-btn {
      color: #6b7280 !important;
    }

    ::ng-deep .mat-mdc-dialog-container {
      padding: 0 !important;
    }
  `]
})
export class MemberFormDialogComponent implements OnInit {
  memberForm: FormGroup;
  isEditMode: boolean;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private memberService: MemberService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<MemberFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.isEditMode = data.mode === 'edit';
    this.memberForm = this.createMemberForm();
  }

  ngOnInit() {
    if (this.isEditMode && this.data.member) {
      this.populateForm(this.data.member);
    }
  }

  private createMemberForm(): FormGroup {
    return this.fb.group({
      memberNo: ['', Validators.required],
      name: ['', Validators.required],
      fhName: ['', Validators.required],
      dateOfBirth: [''],
      mobile: [''],
      email: ['', Validators.email],
      designation: [''],
      dojJob: [''],
      doRetirement: [''],
      branch: [''],
      dojSociety: [''],
      officeAddress: [''],
      residenceAddress: [''],
      city: [''],
      phoneOffice: [''],
      phoneResidence: [''],
      nominee: [''],
      nomineeRelation: [''],
      shareAmount: [0, [Validators.min(0)]],
      cdAmount: [0, [Validators.min(0)]],
      bankName: [''],
      payableAt: [''],
      accountNo: [''],
      status: ['Active'],
      shareDeduction: [0],
      withdrawal: [0],
      gLoanInstalment: [0],
      eLoanInstalment: [0]
    });
  }

  populateForm(member: Member) {
    this.memberForm.patchValue({
      memberNo: member.memberNo,
      name: member.name,
      fhName: member.fhName,
      dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth) : null,
      mobile: member.mobile,
      email: member.email,
      designation: member.designation,
      dojJob: member.dojJob ? new Date(member.dojJob) : null,
      doRetirement: member.doRetirement ? new Date(member.doRetirement) : null,
      branch: member.branch,
      dojSociety: member.dojSociety ? new Date(member.dojSociety) : null,
      officeAddress: member.officeAddress,
      residenceAddress: member.residenceAddress,
      city: member.city,
      phoneOffice: member.phoneOffice,
      phoneResidence: member.phoneResidence,
      nominee: member.nominee,
      nomineeRelation: member.nomineeRelation,
      shareAmount: member.shareAmount,
      cdAmount: member.cdAmount,
      bankName: member.bankName,
      payableAt: member.payableAt,
      accountNo: member.accountNo,
      status: member.status,
      shareDeduction: member.shareDeduction,
      withdrawal: member.withdrawal,
      gLoanInstalment: member.gLoanInstalment,
      eLoanInstalment: member.eLoanInstalment
    });
  }

  onSave() {
    if (this.memberForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formData = this.memberForm.value as Member;

      const operation = this.isEditMode
        ? this.memberService.updateMember(this.data.member!.id!, formData)
        : this.memberService.createMember(formData);

      operation.subscribe({
        next: () => {
          this.showSnackBar(this.isEditMode ? 'Member updated successfully' : 'Member created successfully');
          this.dialogRef.close('saved');
        },
        error: (error) => {
          console.error('Error saving member:', error);
          this.showSnackBar(this.isEditMode ? 'Error updating member' : 'Error creating member');
        },
        complete: () => this.isSubmitting = false
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}