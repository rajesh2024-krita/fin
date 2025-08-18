
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

interface DepositReceipt {
  id: number;
  receiptNo: string;
  memberCode: string;
  memberName: string;
  depositDate: Date;
  schemeCode: string;
  schemeName: string;
  principalAmount: number;
  interestRate: number;
  maturityPeriod: number;
  maturityDate: Date;
  maturityAmount: number;
  status: string;
  createdDate: Date;
}

@Component({
  selector: 'app-deposit-receipt',
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
    MatSnackBarModule
  ],
  template: `
    <div class="page-container">
      <h1>Deposit Receipt Management</h1>
      
      <!-- Deposit Receipt Form -->
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>{{isEditing ? 'Edit' : 'Create'}} Deposit Receipt</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="depositForm" (ngSubmit)="onSubmit()" class="deposit-form">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Receipt No</mat-label>
                <input matInput formControlName="receiptNo" required>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Member Code</mat-label>
                <mat-select formControlName="memberCode" required (selectionChange)="onMemberSelect($event.value)">
                  <mat-option value="MEM001">MEM001 - John Doe</mat-option>
                  <mat-option value="MEM002">MEM002 - Alice Smith</mat-option>
                  <mat-option value="MEM003">MEM003 - Bob Johnson</mat-option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Member Name</mat-label>
                <input matInput formControlName="memberName" readonly>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Deposit Date</mat-label>
                <input matInput [matDatepicker]="depositPicker" formControlName="depositDate" required>
                <mat-datepicker-toggle matIconSuffix [for]="depositPicker"></mat-datepicker-toggle>
                <mat-datepicker #depositPicker></mat-datepicker>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Scheme</mat-label>
                <mat-select formControlName="schemeCode" required (selectionChange)="onSchemeSelect($event.value)">
                  <mat-option value="FD001">FD001 - Fixed Deposit 1 Year</mat-option>
                  <mat-option value="FD002">FD002 - Fixed Deposit 2 Years</mat-option>
                  <mat-option value="RD001">RD001 - Recurring Deposit</mat-option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Principal Amount</mat-label>
                <input matInput formControlName="principalAmount" type="number" required (input)="calculateMaturity()">
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Interest Rate (%)</mat-label>
                <input matInput formControlName="interestRate" type="number" step="0.01" readonly>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Maturity Period (Months)</mat-label>
                <input matInput formControlName="maturityPeriod" type="number" readonly>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Maturity Date</mat-label>
                <input matInput formControlName="maturityDate" readonly>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Maturity Amount</mat-label>
                <input matInput formControlName="maturityAmount" type="number" readonly>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Status</mat-label>
                <mat-select formControlName="status" required>
                  <mat-option value="Active">Active</mat-option>
                  <mat-option value="Matured">Matured</mat-option>
                  <mat-option value="Closed">Closed</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="!depositForm.valid">
                {{isEditing ? 'Update' : 'Create'}} Receipt
              </button>
              <button mat-button type="button" (click)="resetForm()" class="ml-2">
                Reset
              </button>
              <button mat-raised-button color="accent" type="button" (click)="printReceipt()" class="ml-2" [disabled]="!depositForm.valid">
                Print Receipt
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Deposit Receipts Table -->
      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>Deposit Receipts</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="table-container">
            <table mat-table [dataSource]="depositReceipts" class="mat-elevation-z8">
              
              <ng-container matColumnDef="receiptNo">
                <th mat-header-cell *matHeaderCellDef>Receipt No</th>
                <td mat-cell *matCellDef="let receipt">{{receipt.receiptNo}}</td>
              </ng-container>

              <ng-container matColumnDef="memberCode">
                <th mat-header-cell *matHeaderCellDef>Member</th>
                <td mat-cell *matCellDef="let receipt">{{receipt.memberCode}} - {{receipt.memberName}}</td>
              </ng-container>

              <ng-container matColumnDef="depositDate">
                <th mat-header-cell *matHeaderCellDef>Deposit Date</th>
                <td mat-cell *matCellDef="let receipt">{{receipt.depositDate | date:'dd/MM/yyyy'}}</td>
              </ng-container>

              <ng-container matColumnDef="schemeName">
                <th mat-header-cell *matHeaderCellDef>Scheme</th>
                <td mat-cell *matCellDef="let receipt">{{receipt.schemeName}}</td>
              </ng-container>

              <ng-container matColumnDef="principalAmount">
                <th mat-header-cell *matHeaderCellDef>Principal</th>
                <td mat-cell *matCellDef="let receipt">₹{{receipt.principalAmount | number}}</td>
              </ng-container>

              <ng-container matColumnDef="maturityAmount">
                <th mat-header-cell *matHeaderCellDef>Maturity Amount</th>
                <td mat-cell *matCellDef="let receipt">₹{{receipt.maturityAmount | number}}</td>
              </ng-container>

              <ng-container matColumnDef="maturityDate">
                <th mat-header-cell *matHeaderCellDef>Maturity Date</th>
                <td mat-cell *matCellDef="let receipt">{{receipt.maturityDate | date:'dd/MM/yyyy'}}</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let receipt">
                  <span [class]="'status-badge status-' + receipt.status.toLowerCase()">{{receipt.status}}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let receipt">
                  <button mat-icon-button color="primary" (click)="editReceipt(receipt)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="accent" (click)="printReceipt(receipt)">
                    <mat-icon>print</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteReceipt(receipt.id)">
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
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }

    .form-card, .table-card {
      margin-bottom: 20px;
    }

    .deposit-form {
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

    .status-matured {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .status-closed {
      background-color: #ffebee;
      color: #c62828;
    }

    .ml-2 {
      margin-left: 8px;
    }
  `]
})
export class DepositReceiptComponent implements OnInit {
  depositForm: FormGroup;
  depositReceipts: DepositReceipt[] = [];
  isEditing = false;
  editingId: number | null = null;
  displayedColumns: string[] = ['receiptNo', 'memberCode', 'depositDate', 'schemeName', 'principalAmount', 'maturityAmount', 'maturityDate', 'status', 'actions'];

  schemes = [
    { code: 'FD001', name: 'Fixed Deposit 1 Year', interestRate: 7.5, maturityPeriod: 12 },
    { code: 'FD002', name: 'Fixed Deposit 2 Years', interestRate: 8.0, maturityPeriod: 24 },
    { code: 'RD001', name: 'Recurring Deposit', interestRate: 7.0, maturityPeriod: 12 }
  ];

  members = [
    { code: 'MEM001', name: 'John Doe' },
    { code: 'MEM002', name: 'Alice Smith' },
    { code: 'MEM003', name: 'Bob Johnson' }
  ];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.depositForm = this.fb.group({
      receiptNo: ['', Validators.required],
      memberCode: ['', Validators.required],
      memberName: [''],
      depositDate: [new Date(), Validators.required],
      schemeCode: ['', Validators.required],
      principalAmount: [0, [Validators.required, Validators.min(1)]],
      interestRate: [0],
      maturityPeriod: [0],
      maturityDate: [''],
      maturityAmount: [0],
      status: ['Active', Validators.required]
    });
  }

  ngOnInit() {
    this.generateReceiptNo();
    this.loadSampleData();
  }

  generateReceiptNo() {
    const receiptNo = 'DR' + Date.now().toString().slice(-6);
    this.depositForm.patchValue({ receiptNo });
  }

  onMemberSelect(memberCode: string) {
    const member = this.members.find(m => m.code === memberCode);
    if (member) {
      this.depositForm.patchValue({ memberName: member.name });
    }
  }

  onSchemeSelect(schemeCode: string) {
    const scheme = this.schemes.find(s => s.code === schemeCode);
    if (scheme) {
      this.depositForm.patchValue({
        interestRate: scheme.interestRate,
        maturityPeriod: scheme.maturityPeriod
      });
      this.calculateMaturity();
    }
  }

  calculateMaturity() {
    const formValue = this.depositForm.value;
    const principal = formValue.principalAmount || 0;
    const rate = formValue.interestRate || 0;
    const period = formValue.maturityPeriod || 0;
    const depositDate = new Date(formValue.depositDate);

    if (principal > 0 && rate > 0 && period > 0) {
      // Simple interest calculation
      const interest = (principal * rate * period) / (12 * 100);
      const maturityAmount = principal + interest;
      
      // Calculate maturity date
      const maturityDate = new Date(depositDate);
      maturityDate.setMonth(maturityDate.getMonth() + period);

      this.depositForm.patchValue({
        maturityAmount: Math.round(maturityAmount),
        maturityDate: maturityDate.toISOString().split('T')[0]
      });
    }
  }

  loadSampleData() {
    this.depositReceipts = [
      {
        id: 1,
        receiptNo: 'DR001234',
        memberCode: 'MEM001',
        memberName: 'John Doe',
        depositDate: new Date('2024-01-15'),
        schemeCode: 'FD001',
        schemeName: 'Fixed Deposit 1 Year',
        principalAmount: 100000,
        interestRate: 7.5,
        maturityPeriod: 12,
        maturityDate: new Date('2025-01-15'),
        maturityAmount: 107500,
        status: 'Active',
        createdDate: new Date()
      }
    ];
  }

  onSubmit() {
    if (this.depositForm.valid) {
      const formData = this.depositForm.value;
      const scheme = this.schemes.find(s => s.code === formData.schemeCode);
      
      if (this.isEditing && this.editingId) {
        const index = this.depositReceipts.findIndex(r => r.id === this.editingId);
        if (index !== -1) {
          this.depositReceipts[index] = {
            ...formData,
            id: this.editingId,
            schemeName: scheme?.name || '',
            createdDate: this.depositReceipts[index].createdDate
          };
          this.snackBar.open('Deposit receipt updated successfully!', 'Close', { duration: 3000 });
        }
      } else {
        const newReceipt: DepositReceipt = {
          ...formData,
          id: Math.max(...this.depositReceipts.map(r => r.id), 0) + 1,
          schemeName: scheme?.name || '',
          createdDate: new Date()
        };
        this.depositReceipts.push(newReceipt);
        this.snackBar.open('Deposit receipt created successfully!', 'Close', { duration: 3000 });
      }
      
      this.resetForm();
    }
  }

  editReceipt(receipt: DepositReceipt) {
    this.isEditing = true;
    this.editingId = receipt.id;
    this.depositForm.patchValue({
      ...receipt,
      depositDate: receipt.depositDate,
      maturityDate: receipt.maturityDate.toISOString().split('T')[0]
    });
  }

  deleteReceipt(id: number) {
    if (confirm('Are you sure you want to delete this deposit receipt?')) {
      this.depositReceipts = this.depositReceipts.filter(r => r.id !== id);
      this.snackBar.open('Deposit receipt deleted successfully!', 'Close', { duration: 3000 });
    }
  }

  printReceipt(receipt?: DepositReceipt) {
    if (receipt) {
      this.snackBar.open(`Printing receipt ${receipt.receiptNo}...`, 'Close', { duration: 2000 });
    } else if (this.depositForm.valid) {
      const receiptNo = this.depositForm.get('receiptNo')?.value;
      this.snackBar.open(`Printing receipt ${receiptNo}...`, 'Close', { duration: 2000 });
    }
  }

  resetForm() {
    this.depositForm.reset();
    this.depositForm.patchValue({
      status: 'Active',
      depositDate: new Date(),
      principalAmount: 0,
      maturityAmount: 0
    });
    this.generateReceiptNo();
    this.isEditing = false;
    this.editingId = null;
  }
}
