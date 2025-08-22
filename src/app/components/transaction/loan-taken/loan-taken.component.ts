
import { Component, signal, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';

interface LoanSummary {
  loanNo: string;
  loanDate: Date;
  amount: number;
  member: string;
  edpNo: string;
}

interface Employee {
  edpNo: string;
  memberName: string;
}

@Component({
  selector: 'app-loan-taken',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule
  ],
  template: `
    <div class="animate-fade-in">
      <!-- Page Header -->
      <div class="content-header mb-6">
        <div class="breadcrumb">
          <span>Transaction</span>
          <mat-icon class="breadcrumb-separator">chevron_right</mat-icon>
          <span class="breadcrumb-active">Loan Taken</span>
        </div>
        <h1 class="text-page-title">Loan Management</h1>
        <p class="text-body text-gray-600 dark:text-gray-400">Process and manage loan applications</p>
      </div>

      <!-- Main Loan Form -->
      <form class="form-container" [formGroup]="loanForm">
        <mat-card class="card">
          <!-- Card Header -->
          <div class="card-header bg-gradient-to-r from-blue-600 to-purple-600">
            <div class="card-title">
              <mat-icon>account_balance</mat-icon>
              <span>Loan Entry Form</span>
            </div>
            <div class="flex gap-3">
              <button type="button" class="btn btn-outline-light" (click)="openLoanSummary()">
                <mat-icon>list</mat-icon>
                Loan Summary
              </button>
            </div>
          </div>

          <mat-card-content class="p-0">
            <div class="p-6">
              <!-- Loan Basic Details Section -->
              <div class="form-section">
                <div class="form-section-header">
                  <mat-icon>description</mat-icon>
                  <span>Loan Details</span>
                </div>
                <div class="form-section-content">
                  <div class="form-grid form-grid-3">
                    <div class="form-field">
                      <label class="form-label form-label-required">Loan Type</label>
                      <select class="form-select" formControlName="loanType">
                        <option value="">Select loan type</option>
                        <option value="General">General Loan</option>
                        <option value="Emergency">Emergency Loan</option>
                        <option value="Festival">Festival Loan</option>
                        <option value="Medical">Medical Loan</option>
                      </select>
                      <div class="form-error" *ngIf="loanForm.get('loanType')?.invalid && loanForm.get('loanType')?.touched">
                        Loan type is required
                      </div>
                    </div>

                    <div class="form-field">
                      <label class="form-label form-label-required">Loan No.</label>
                      <input 
                        type="text" 
                        class="form-input"
                        placeholder="Enter loan number"
                        formControlName="loanNo">
                      <div class="form-error" *ngIf="loanForm.get('loanNo')?.invalid && loanForm.get('loanNo')?.touched">
                        Loan number is required
                      </div>
                    </div>

                    <div class="form-field">
                      <label class="form-label form-label-required">Loan Date</label>
                      <input 
                        type="date" 
                        class="form-input"
                        formControlName="loanDate">
                      <div class="form-error" *ngIf="loanForm.get('loanDate')?.invalid && loanForm.get('loanDate')?.touched">
                        Loan date is required
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Employee Details Section -->
              <div class="form-section">
                <div class="form-section-header">
                  <mat-icon>person</mat-icon>
                  <span>Employee Details</span>
                </div>
                <div class="form-section-content">
                  <div class="form-grid form-grid-2">
                    <div class="form-field">
                      <label class="form-label form-label-required">EDP No.</label>
                      <div class="input-group">
                        <input 
                          type="text" 
                          class="form-input"
                          placeholder="Enter EDP number"
                          formControlName="edpNo">
                        <button type="button" class="btn btn-outline" (click)="openEmployeeSearch()">
                          <mat-icon>search</mat-icon>
                          Search
                        </button>
                      </div>
                      <div class="form-error" *ngIf="loanForm.get('edpNo')?.invalid && loanForm.get('edpNo')?.touched">
                        EDP number is required
                      </div>
                    </div>

                    <div class="form-field">
                      <label class="form-label">Name</label>
                      <input 
                        type="text" 
                        class="form-input"
                        placeholder="Auto-filled from employee search"
                        formControlName="name"
                        readonly>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Loan Amount Section -->
              <div class="form-section">
                <div class="form-section-header">
                  <mat-icon>payments</mat-icon>
                  <span>Loan Amount & Terms</span>
                </div>
                <div class="form-section-content">
                  <div class="form-grid form-grid-3">
                    <div class="form-field">
                      <label class="form-label form-label-required">Loan Amount</label>
                      <input 
                        type="number" 
                        class="form-input"
                        placeholder="Enter loan amount"
                        formControlName="loanAmount"
                        (input)="calculateNetLoan()">
                      <div class="form-error" *ngIf="loanForm.get('loanAmount')?.invalid && loanForm.get('loanAmount')?.touched">
                        Loan amount is required
                      </div>
                    </div>

                    <div class="form-field">
                      <label class="form-label">Previous Loan (Remaining)</label>
                      <input 
                        type="number" 
                        class="form-input"
                        placeholder="Auto-calculated"
                        formControlName="previousLoan"
                        readonly>
                    </div>

                    <div class="form-field">
                      <label class="form-label">Net Loan</label>
                      <input 
                        type="number" 
                        class="form-input calculation-field"
                        placeholder="Auto-calculated"
                        formControlName="netLoan"
                        readonly>
                    </div>

                    <div class="form-field">
                      <label class="form-label form-label-required">No. of Installments</label>
                      <input 
                        type="number" 
                        class="form-input"
                        placeholder="Enter number of installments"
                        formControlName="noOfInstallments"
                        (input)="calculateInstallmentAmount()">
                      <div class="form-error" *ngIf="loanForm.get('noOfInstallments')?.invalid && loanForm.get('noOfInstallments')?.touched">
                        Number of installments is required
                      </div>
                    </div>

                    <div class="form-field">
                      <label class="form-label">Installment Amount</label>
                      <input 
                        type="number" 
                        class="form-input calculation-field"
                        placeholder="Auto-calculated"
                        formControlName="installmentAmount"
                        readonly>
                    </div>

                    <div class="form-field">
                      <label class="form-label">Last Salary</label>
                      <input 
                        type="number" 
                        class="form-input"
                        placeholder="Enter last salary"
                        formControlName="lastSalary">
                    </div>
                  </div>

                  <div class="form-field mt-4">
                    <label class="form-label">Purpose</label>
                    <textarea 
                      class="form-textarea"
                      placeholder="Enter purpose of loan"
                      rows="3"
                      formControlName="purpose"></textarea>
                  </div>
                </div>
              </div>

              <!-- Balance Information Section -->
              <div class="form-section">
                <div class="form-section-header">
                  <mat-icon>account_balance_wallet</mat-icon>
                  <span>Balance Information</span>
                </div>
                <div class="form-section-content">
                  <div class="balance-grid">
                    <div class="balance-column">
                      <h4 class="balance-column-title">Current Balance</h4>
                      <div class="form-grid form-grid-2">
                        <div class="form-field">
                          <label class="form-label">Share</label>
                          <input 
                            type="number" 
                            class="form-input"
                            placeholder="Current share"
                            formControlName="shareLeft">
                        </div>
                        <div class="form-field">
                          <label class="form-label">CD (Credit Deposit)</label>
                          <input 
                            type="number" 
                            class="form-input"
                            placeholder="Current CD"
                            formControlName="cdLeft">
                        </div>
                      </div>
                    </div>

                    <div class="balance-column">
                      <h4 class="balance-column-title">After Loan</h4>
                      <div class="form-grid form-grid-2">
                        <div class="form-field">
                          <label class="form-label">Share</label>
                          <input 
                            type="number" 
                            class="form-input"
                            placeholder="Remaining share"
                            formControlName="shareRight">
                        </div>
                        <div class="form-field">
                          <label class="form-label">CD</label>
                          <input 
                            type="number" 
                            class="form-input"
                            placeholder="Remaining CD"
                            formControlName="cdRight">
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="form-grid form-grid-2 mt-4">
                    <div class="form-field">
                      <label class="form-label">MWF</label>
                      <input 
                        type="number" 
                        class="form-input"
                        placeholder="Enter MWF amount"
                        formControlName="mwf">
                    </div>
                    <div class="form-field">
                      <label class="form-label">Pay Amount</label>
                      <input 
                        type="number" 
                        class="form-input"
                        placeholder="Enter pay amount"
                        formControlName="payAmount">
                    </div>
                  </div>
                </div>
              </div>

              <!-- Authorization Section -->
              <div class="form-section" *ngIf="requiresAuthorization()">
                <div class="form-section-header">
                  <mat-icon>verified</mat-icon>
                  <span>Authorization</span>
                </div>
                <div class="form-section-content">
                  <div class="form-field">
                    <label class="form-label form-label-required">Authorized By</label>
                    <select class="form-select" formControlName="authorizedBy">
                      <option value="">Select authorizing officer</option>
                      <option value="Manager">Manager</option>
                      <option value="Assistant Manager">Assistant Manager</option>
                      <option value="President">President</option>
                      <option value="Secretary">Secretary</option>
                    </select>
                    <div class="form-error" *ngIf="loanForm.get('authorizedBy')?.invalid && loanForm.get('authorizedBy')?.touched">
                      Authorization is required for this loan amount
                    </div>
                  </div>
                </div>
              </div>

              <!-- Payment Details Section -->
              <div class="form-section">
                <div class="form-section-header">
                  <mat-icon>payment</mat-icon>
                  <span>Payment Details</span>
                </div>
                <div class="form-section-content">
                  <div class="form-grid form-grid-3">
                    <div class="form-field">
                      <label class="form-label form-label-required">Payment Mode</label>
                      <select class="form-select" formControlName="paymentMode" (change)="onPaymentModeChange()">
                        <option value="">Select payment mode</option>
                        <option value="Cash">Cash</option>
                        <option value="Cheque">Cheque</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                      </select>
                      <div class="form-error" *ngIf="loanForm.get('paymentMode')?.invalid && loanForm.get('paymentMode')?.touched">
                        Payment mode is required
                      </div>
                    </div>

                    <div class="form-field" *ngIf="showBankFields()">
                      <label class="form-label">Bank</label>
                      <input 
                        type="text" 
                        class="form-input"
                        placeholder="Enter bank name"
                        formControlName="bank">
                    </div>

                    <div class="form-field" *ngIf="showChequeFields()">
                      <label class="form-label">Cheque No.</label>
                      <input 
                        type="text" 
                        class="form-input"
                        placeholder="Enter cheque number"
                        formControlName="chequeNo">
                    </div>

                    <div class="form-field" *ngIf="showChequeFields()">
                      <label class="form-label">Cheque Date</label>
                      <input 
                        type="date" 
                        class="form-input"
                        formControlName="chequeDate">
                    </div>
                  </div>
                </div>
              </div>

              <!-- Transaction Details Section -->
              <div class="form-section">
                <div class="form-section-header">
                  <mat-icon>swap_horiz</mat-icon>
                  <span>Transaction Details</span>
                </div>
                <div class="form-section-content">
                  <div class="form-grid form-grid-2">
                    <div class="form-field">
                      <label class="form-label">Given</label>
                      <select class="form-select" formControlName="given">
                        <option value="">Select member</option>
                        <option value="M001 - John Doe">M001 - John Doe</option>
                        <option value="M002 - Jane Smith">M002 - Jane Smith</option>
                        <option value="M003 - Mike Johnson">M003 - Mike Johnson</option>
                      </select>
                    </div>

                    <div class="form-field">
                      <label class="form-label">Taken</label>
                      <select class="form-select" formControlName="taken">
                        <option value="">Select member</option>
                        <option value="M001 - John Doe">M001 - John Doe</option>
                        <option value="M002 - Jane Smith">M002 - Jane Smith</option>
                        <option value="M003 - Mike Johnson">M003 - Mike Johnson</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </mat-card-content>

          <!-- Action Buttons -->
          <div class="card-actions">
            <div class="flex justify-end gap-3">
              <button type="button" class="btn btn-secondary" (click)="onCancel()">
                <mat-icon>close</mat-icon>
                Cancel
              </button>
              <button type="button" class="btn btn-primary" (click)="onSave()">
                <mat-icon>save</mat-icon>
                Save Loan
              </button>
            </div>
          </div>
        </mat-card>
      </form>
    </div>
  `,
  styleUrl: './loan-taken.component.css'
})
export class LoanTakenComponent {
  loanForm: FormGroup;
  
  // Sample data
  loanSummaryData: LoanSummary[] = [
    { loanNo: 'L001', loanDate: new Date('2024-01-15'), amount: 50000, member: 'John Doe', edpNo: 'EMP001' },
    { loanNo: 'L002', loanDate: new Date('2024-01-20'), amount: 75000, member: 'Jane Smith', edpNo: 'EMP002' },
    { loanNo: 'L003', loanDate: new Date('2024-01-25'), amount: 30000, member: 'Mike Johnson', edpNo: 'EMP003' }
  ];

  employeeData: Employee[] = [
    { edpNo: 'EMP001', memberName: 'John Doe' },
    { edpNo: 'EMP002', memberName: 'Jane Smith' },
    { edpNo: 'EMP003', memberName: 'Mike Johnson' },
    { edpNo: 'EMP004', memberName: 'Sarah Wilson' },
    { edpNo: 'EMP005', memberName: 'David Brown' }
  ];

  constructor(private fb: FormBuilder, private dialog: MatDialog) {
    this.loanForm = this.fb.group({
      loanType: ['', Validators.required],
      loanNo: ['', Validators.required],
      loanDate: ['', Validators.required],
      edpNo: ['', Validators.required],
      name: [''],
      loanAmount: ['', [Validators.required, Validators.min(1)]],
      previousLoan: [0],
      netLoan: [0],
      noOfInstallments: ['', [Validators.required, Validators.min(1)]],
      installmentAmount: [0],
      purpose: [''],
      authorizedBy: [''],
      paymentMode: ['', Validators.required],
      bank: [''],
      chequeNo: [''],
      chequeDate: [''],
      shareLeft: [0],
      cdLeft: [0],
      shareRight: [0],
      cdRight: [0],
      lastSalary: [0],
      mwf: [0],
      payAmount: [0],
      given: [''],
      taken: ['']
    });
  }

  calculateNetLoan() {
    const loanAmount = this.loanForm.get('loanAmount')?.value || 0;
    const previousLoan = this.loanForm.get('previousLoan')?.value || 0;
    const netLoan = loanAmount - previousLoan;
    this.loanForm.patchValue({ netLoan });
    this.calculateInstallmentAmount();
  }

  calculateInstallmentAmount() {
    const netLoan = this.loanForm.get('netLoan')?.value || 0;
    const noOfInstallments = this.loanForm.get('noOfInstallments')?.value || 1;
    const installmentAmount = netLoan / noOfInstallments;
    this.loanForm.patchValue({ installmentAmount: Math.round(installmentAmount) });
  }

  requiresAuthorization(): boolean {
    const loanAmount = this.loanForm.get('loanAmount')?.value || 0;
    return loanAmount > 100000; // Require authorization for loans above 1 lakh
  }

  onPaymentModeChange() {
    const paymentMode = this.loanForm.get('paymentMode')?.value;
    if (paymentMode !== 'Cheque') {
      this.loanForm.patchValue({ chequeNo: '', chequeDate: '' });
    }
    if (paymentMode === 'Cash') {
      this.loanForm.patchValue({ bank: '' });
    }
  }

  showBankFields(): boolean {
    const paymentMode = this.loanForm.get('paymentMode')?.value;
    return paymentMode === 'Cheque' || paymentMode === 'Bank Transfer';
  }

  showChequeFields(): boolean {
    return this.loanForm.get('paymentMode')?.value === 'Cheque';
  }

  openLoanSummary() {
    const dialogRef = this.dialog.open(LoanSummaryDialog, {
      width: '800px',
      data: this.loanSummaryData
    });
  }

  openEmployeeSearch() {
    const dialogRef = this.dialog.open(EmployeeSearchDialog, {
      width: '600px',
      data: this.employeeData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loanForm.patchValue({
          edpNo: result.edpNo,
          name: result.memberName
        });
      }
    });
  }

  onSave() {
    if (this.loanForm.valid) {
      const formData = this.loanForm.value;
      console.log('Loan data:', formData);
      // Handle save logic here
    } else {
      this.markFormGroupTouched(this.loanForm);
    }
  }

  onCancel() {
    this.loanForm.reset();
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}

// Loan Summary Dialog Component
@Component({
  selector: 'loan-summary-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatTableModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2 class="dialog-title">
          <mat-icon>list</mat-icon>
          Loan Summary
        </h2>
        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="dialog-content">
        <div class="search-container mb-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-icon matPrefix>search</mat-icon>
            <input matInput placeholder="Search loans..." [(ngModel)]="searchTerm" (input)="applyFilter()">
          </mat-form-field>
        </div>

        <div class="table-container">
          <table mat-table [dataSource]="dataSource" class="loan-summary-table">
            <ng-container matColumnDef="loanNo">
              <th mat-header-cell *matHeaderCellDef>Loan No.</th>
              <td mat-cell *matCellDef="let loan">{{loan.loanNo}}</td>
            </ng-container>

            <ng-container matColumnDef="loanDate">
              <th mat-header-cell *matHeaderCellDef>Loan Date</th>
              <td mat-cell *matCellDef="let loan">{{loan.loanDate | date:'dd/MM/yyyy'}}</td>
            </ng-container>

            <ng-container matColumnDef="amount">
              <th mat-header-cell *matHeaderCellDef>Amount</th>
              <td mat-cell *matCellDef="let loan">{{loan.amount | currency:'INR':'symbol':'1.0-0'}}</td>
            </ng-container>

            <ng-container matColumnDef="member">
              <th mat-header-cell *matHeaderCellDef>Member</th>
              <td mat-cell *matCellDef="let loan">{{loan.member}}</td>
            </ng-container>

            <ng-container matColumnDef="edpNo">
              <th mat-header-cell *matHeaderCellDef>EDP No.</th>
              <td mat-cell *matCellDef="let loan">{{loan.edpNo}}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 0;
    }
    .dialog-header {
      padding: 20px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .dialog-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
    }
    .dialog-content {
      padding: 24px;
    }
    .table-container {
      max-height: 400px;
      overflow-y: auto;
    }
    .loan-summary-table {
      width: 100%;
    }
    .w-full {
      width: 100%;
    }
    .mb-4 {
      margin-bottom: 16px;
    }
  `]
})
export class LoanSummaryDialog {
  displayedColumns: string[] = ['loanNo', 'loanDate', 'amount', 'member', 'edpNo'];
  dataSource = new MatTableDataSource<LoanSummary>([]);
  searchTerm = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: LoanSummary[], private dialogRef: MatDialogRef<LoanSummaryDialog>) {
    this.dataSource.data = data;
  }

  applyFilter() {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  close() {
    this.dialogRef.close();
  }
}

// Employee Search Dialog Component
@Component({
  selector: 'employee-search-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatTableModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2 class="dialog-title">
          <mat-icon>search</mat-icon>
          Employee Search
        </h2>
        <button mat-icon-button (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="dialog-content">
        <div class="search-container mb-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-icon matPrefix>search</mat-icon>
            <input matInput placeholder="Search employees..." [(ngModel)]="searchTerm" (input)="applyFilter()">
          </mat-form-field>
        </div>

        <div class="table-container">
          <table mat-table [dataSource]="dataSource" class="employee-search-table">
            <ng-container matColumnDef="edpNo">
              <th mat-header-cell *matHeaderCellDef>EDP No.</th>
              <td mat-cell *matCellDef="let employee">{{employee.edpNo}}</td>
            </ng-container>

            <ng-container matColumnDef="memberName">
              <th mat-header-cell *matHeaderCellDef>Member Name</th>
              <td mat-cell *matCellDef="let employee">{{employee.memberName}}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                class="clickable-row" 
                (click)="selectEmployee(row)"></tr>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 0;
    }
    .dialog-header {
      padding: 20px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .dialog-title {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
    }
    .dialog-content {
      padding: 24px;
    }
    .table-container {
      max-height: 400px;
      overflow-y: auto;
    }
    .employee-search-table {
      width: 100%;
    }
    .clickable-row {
      cursor: pointer;
    }
    .clickable-row:hover {
      background-color: #f5f5f5;
    }
    .w-full {
      width: 100%;
    }
    .mb-4 {
      margin-bottom: 16px;
    }
  `]
})
export class EmployeeSearchDialog {
  displayedColumns: string[] = ['edpNo', 'memberName'];
  dataSource = new MatTableDataSource<Employee>([]);
  searchTerm = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: Employee[], private dialogRef: MatDialogRef<EmployeeSearchDialog>) {
    this.dataSource.data = data;
  }

  applyFilter() {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  selectEmployee(employee: Employee) {
    this.dialogRef.close(employee);
  }

  close() {
    this.dialogRef.close();
  }
}
