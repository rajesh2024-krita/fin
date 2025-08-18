
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

interface Loan {
  id: number;
  loanId: string;
  memberCode: string;
  memberName: string;
  loanAmount: number;
  interestRate: number;
  tenure: number;
  loanDate: string;
  status: string;
  emi: number;
}

@Component({
  selector: 'app-loan-taken',
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
    MatSnackBarModule
  ],
  template: `
    <div class="page-container">
      <h1>Loan Management</h1>
      
      <!-- Add/Edit Form -->
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>{{isEditing ? 'Edit' : 'Process'}} Loan</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loanForm" (ngSubmit)="onSubmit()" class="loan-form">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Loan ID</mat-label>
                <input matInput formControlName="loanId" required>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Member Code</mat-label>
                <input matInput formControlName="memberCode" required>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Member Name</mat-label>
                <input matInput formControlName="memberName" required>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Loan Amount (₹)</mat-label>
                <input matInput formControlName="loanAmount" type="number" required (input)="calculateEMI()">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Interest Rate (%)</mat-label>
                <input matInput formControlName="interestRate" type="number" step="0.01" required (input)="calculateEMI()">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Tenure (Months)</mat-label>
                <input matInput formControlName="tenure" type="number" required (input)="calculateEMI()">
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Loan Date</mat-label>
                <input matInput formControlName="loanDate" type="date" required>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Calculated EMI (₹)</mat-label>
                <input matInput [value]="calculatedEMI" readonly>
              </mat-form-field>
            </div>
            
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="loanForm.invalid">
                {{isEditing ? 'Update' : 'Process'}} Loan
              </button>
              <button mat-button type="button" (click)="resetForm()" *ngIf="isEditing">
                Cancel
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
      
      <!-- Loans Table -->
      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>Processed Loans</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="loans" class="mat-elevation-z2">
            <ng-container matColumnDef="loanId">
              <th mat-header-cell *matHeaderCellDef>Loan ID</th>
              <td mat-cell *matCellDef="let loan">{{loan.loanId}}</td>
            </ng-container>
            
            <ng-container matColumnDef="memberCode">
              <th mat-header-cell *matHeaderCellDef>Member</th>
              <td mat-cell *matCellDef="let loan">{{loan.memberCode}} - {{loan.memberName}}</td>
            </ng-container>
            
            <ng-container matColumnDef="loanAmount">
              <th mat-header-cell *matHeaderCellDef>Amount</th>
              <td mat-cell *matCellDef="let loan">₹{{loan.loanAmount | number}}</td>
            </ng-container>
            
            <ng-container matColumnDef="interestRate">
              <th mat-header-cell *matHeaderCellDef>Rate</th>
              <td mat-cell *matCellDef="let loan">{{loan.interestRate}}%</td>
            </ng-container>
            
            <ng-container matColumnDef="tenure">
              <th mat-header-cell *matHeaderCellDef>Tenure</th>
              <td mat-cell *matCellDef="let loan">{{loan.tenure}} months</td>
            </ng-container>
            
            <ng-container matColumnDef="emi">
              <th mat-header-cell *matHeaderCellDef>EMI</th>
              <td mat-cell *matCellDef="let loan">₹{{loan.emi | number}}</td>
            </ng-container>
            
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let loan">{{loan.status}}</td>
            </ng-container>
            
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let loan">
                <button mat-icon-button color="primary" (click)="editLoan(loan)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="accent" (click)="viewLoan(loan)">
                  <mat-icon>visibility</mat-icon>
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
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .form-card, .table-card {
      margin-bottom: 20px;
    }
    
    .loan-form {
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
    
    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 16px;
    }
    
    table {
      width: 100%;
    }
  `]
})
export class LoanTakenComponent implements OnInit {
  loanForm: FormGroup;
  loans: Loan[] = [];
  isEditing = false;
  editingId: number | null = null;
  calculatedEMI = 0;
  displayedColumns: string[] = ['loanId', 'memberCode', 'loanAmount', 'interestRate', 'tenure', 'emi', 'status', 'actions'];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.loanForm = this.fb.group({
      loanId: ['', Validators.required],
      memberCode: ['', Validators.required],
      memberName: ['', Validators.required],
      loanAmount: ['', [Validators.required, Validators.min(1)]],
      interestRate: ['', [Validators.required, Validators.min(0)]],
      tenure: ['', [Validators.required, Validators.min(1)]],
      loanDate: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadSampleData();
  }

  loadSampleData() {
    this.loans = [
      {
        id: 1,
        loanId: 'LN001',
        memberCode: 'MEM001',
        memberName: 'John Doe',
        loanAmount: 100000,
        interestRate: 12,
        tenure: 24,
        loanDate: '2024-01-15',
        status: 'Active',
        emi: 4707
      },
      {
        id: 2,
        loanId: 'LN002',
        memberCode: 'MEM002',
        memberName: 'Jane Smith',
        loanAmount: 50000,
        interestRate: 10,
        tenure: 12,
        loanDate: '2024-01-20',
        status: 'Active',
        emi: 4388
      }
    ];
  }

  calculateEMI() {
    const amount = this.loanForm.get('loanAmount')?.value;
    const rate = this.loanForm.get('interestRate')?.value;
    const tenure = this.loanForm.get('tenure')?.value;

    if (amount && rate && tenure) {
      const monthlyRate = rate / 12 / 100;
      const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                  (Math.pow(1 + monthlyRate, tenure) - 1);
      this.calculatedEMI = Math.round(emi);
    } else {
      this.calculatedEMI = 0;
    }
  }

  onSubmit() {
    if (this.loanForm.valid) {
      const formValue = this.loanForm.value;
      
      if (this.isEditing && this.editingId) {
        const index = this.loans.findIndex(l => l.id === this.editingId);
        if (index !== -1) {
          this.loans[index] = { 
            ...this.loans[index], 
            ...formValue, 
            emi: this.calculatedEMI 
          };
          this.snackBar.open('Loan updated successfully!', 'Close', { duration: 3000 });
        }
      } else {
        const newLoan: Loan = {
          id: this.loans.length + 1,
          ...formValue,
          emi: this.calculatedEMI,
          status: 'Active'
        };
        this.loans.push(newLoan);
        this.snackBar.open('Loan processed successfully!', 'Close', { duration: 3000 });
      }
      
      this.resetForm();
    }
  }

  editLoan(loan: Loan) {
    this.isEditing = true;
    this.editingId = loan.id;
    this.loanForm.patchValue(loan);
    this.calculatedEMI = loan.emi;
  }

  viewLoan(loan: Loan) {
    this.snackBar.open(`Loan Details: ${loan.loanId} - ${loan.memberName}`, 'Close', { duration: 5000 });
  }

  resetForm() {
    this.loanForm.reset();
    this.isEditing = false;
    this.editingId = null;
    this.calculatedEMI = 0;
  }
}
