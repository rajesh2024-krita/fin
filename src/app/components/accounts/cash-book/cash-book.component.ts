
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
import { MatTabsModule } from '@angular/material/tabs';

interface CashBookEntry {
  id: number;
  date: Date;
  particulars: string;
  voucherNo: string;
  debitAmount: number;
  creditAmount: number;
  balance: number;
  type: 'RECEIPT' | 'PAYMENT';
  category: string;
  referenceNo: string;
  narration: string;
}

@Component({
  selector: 'app-cash-book',
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
    MatTabsModule
  ],
  template: `
    <div class="page-container">
      <h1>Cash Book Management</h1>
      
      <!-- Entry Form -->
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>{{isEditing ? 'Edit' : 'Add'}} Cash Entry</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="entryForm" (ngSubmit)="onSubmit()" class="entry-form">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Date</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="date" required>
                <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Voucher No</mat-label>
                <input matInput formControlName="voucherNo" required>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Type</mat-label>
                <mat-select formControlName="type" required (selectionChange)="onTypeChange($event.value)">
                  <mat-option value="RECEIPT">Cash Receipt</mat-option>
                  <mat-option value="PAYMENT">Cash Payment</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Particulars</mat-label>
                <input matInput formControlName="particulars" required>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Category</mat-label>
                <mat-select formControlName="category" required>
                  <mat-option value="Deposit">Member Deposit</mat-option>
                  <mat-option value="Withdrawal">Member Withdrawal</mat-option>
                  <mat-option value="Loan">Loan Transaction</mat-option>
                  <mat-option value="Interest">Interest Payment</mat-option>
                  <mat-option value="Administrative">Administrative Expense</mat-option>
                  <mat-option value="Other">Other</mat-option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Reference No</mat-label>
                <input matInput formControlName="referenceNo">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Amount</mat-label>
                <input matInput formControlName="amount" type="number" required>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Narration</mat-label>
                <textarea matInput formControlName="narration" rows="3"></textarea>
              </mat-form-field>
            </div>
            
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="!entryForm.valid">
                {{isEditing ? 'Update' : 'Add'}} Entry
              </button>
              <button mat-button type="button" (click)="resetForm()" class="ml-2">
                Reset
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Cash Book Display -->
      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>Cash Book Entries</mat-card-title>
          <div class="balance-summary">
            <div class="balance-item">
              <span class="label">Opening Balance:</span>
              <span class="amount">₹{{openingBalance | number}}</span>
            </div>
            <div class="balance-item">
              <span class="label">Current Balance:</span>
              <span class="amount" [class.negative]="currentBalance < 0">₹{{currentBalance | number}}</span>
            </div>
          </div>
        </mat-card-header>
        <mat-card-content>
          <mat-tab-group>
            <!-- All Entries Tab -->
            <mat-tab label="All Entries">
              <div class="table-container">
                <table mat-table [dataSource]="cashBookEntries" class="mat-elevation-z8">
                  
                  <ng-container matColumnDef="date">
                    <th mat-header-cell *matHeaderCellDef>Date</th>
                    <td mat-cell *matCellDef="let entry">{{entry.date | date:'dd/MM/yyyy'}}</td>
                  </ng-container>

                  <ng-container matColumnDef="voucherNo">
                    <th mat-header-cell *matHeaderCellDef>Voucher No</th>
                    <td mat-cell *matCellDef="let entry">{{entry.voucherNo}}</td>
                  </ng-container>

                  <ng-container matColumnDef="particulars">
                    <th mat-header-cell *matHeaderCellDef>Particulars</th>
                    <td mat-cell *matCellDef="let entry">
                      <div>{{entry.particulars}}</div>
                      <small class="text-muted">{{entry.category}}</small>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="debitAmount">
                    <th mat-header-cell *matHeaderCellDef>Receipts (Dr)</th>
                    <td mat-cell *matCellDef="let entry" class="amount-cell">
                      {{entry.debitAmount > 0 ? (entry.debitAmount | number) : '-'}}
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="creditAmount">
                    <th mat-header-cell *matHeaderCellDef>Payments (Cr)</th>
                    <td mat-cell *matCellDef="let entry" class="amount-cell">
                      {{entry.creditAmount > 0 ? (entry.creditAmount | number) : '-'}}
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="balance">
                    <th mat-header-cell *matHeaderCellDef>Balance</th>
                    <td mat-cell *matCellDef="let entry" class="amount-cell">
                      <span [class.negative]="entry.balance < 0">₹{{entry.balance | number}}</span>
                    </td>
                  </ng-container>

                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef>Actions</th>
                    <td mat-cell *matCellDef="let entry">
                      <button mat-icon-button color="primary" (click)="editEntry(entry)">
                        <mat-icon>edit</mat-icon>
                      </button>
                      <button mat-icon-button color="warn" (click)="deleteEntry(entry.id)">
                        <mat-icon>delete</mat-icon>
                      </button>
                    </td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                  <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                      [class.receipt-row]="row.type === 'RECEIPT'"
                      [class.payment-row]="row.type === 'PAYMENT'"></tr>
                </table>
              </div>
            </mat-tab>

            <!-- Receipts Tab -->
            <mat-tab label="Receipts Only">
              <div class="table-container">
                <table mat-table [dataSource]="receiptsOnly" class="mat-elevation-z8">
                  <ng-container matColumnDef="date">
                    <th mat-header-cell *matHeaderCellDef>Date</th>
                    <td mat-cell *matCellDef="let entry">{{entry.date | date:'dd/MM/yyyy'}}</td>
                  </ng-container>

                  <ng-container matColumnDef="particulars">
                    <th mat-header-cell *matHeaderCellDef>Particulars</th>
                    <td mat-cell *matCellDef="let entry">{{entry.particulars}}</td>
                  </ng-container>

                  <ng-container matColumnDef="amount">
                    <th mat-header-cell *matHeaderCellDef>Amount</th>
                    <td mat-cell *matCellDef="let entry" class="amount-cell">₹{{entry.debitAmount | number}}</td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="['date', 'particulars', 'amount']"></tr>
                  <tr mat-row *matRowDef="let row; columns: ['date', 'particulars', 'amount'];"></tr>
                </table>
                <div class="total-row">
                  <strong>Total Receipts: ₹{{totalReceipts | number}}</strong>
                </div>
              </div>
            </mat-tab>

            <!-- Payments Tab -->
            <mat-tab label="Payments Only">
              <div class="table-container">
                <table mat-table [dataSource]="paymentsOnly" class="mat-elevation-z8">
                  <ng-container matColumnDef="date">
                    <th mat-header-cell *matHeaderCellDef>Date</th>
                    <td mat-cell *matCellDef="let entry">{{entry.date | date:'dd/MM/yyyy'}}</td>
                  </ng-container>

                  <ng-container matColumnDef="particulars">
                    <th mat-header-cell *matHeaderCellDef>Particulars</th>
                    <td mat-cell *matCellDef="let entry">{{entry.particulars}}</td>
                  </ng-container>

                  <ng-container matColumnDef="amount">
                    <th mat-header-cell *matHeaderCellDef>Amount</th>
                    <td mat-cell *matCellDef="let entry" class="amount-cell">₹{{entry.creditAmount | number}}</td>
                  </ng-container>

                  <tr mat-header-row *matHeaderRowDef="['date', 'particulars', 'amount']"></tr>
                  <tr mat-row *matRowDef="let row; columns: ['date', 'particulars', 'amount'];"></tr>
                </table>
                <div class="total-row">
                  <strong>Total Payments: ₹{{totalPayments | number}}</strong>
                </div>
              </div>
            </mat-tab>
          </mat-tab-group>
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

    .entry-form {
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

    .balance-summary {
      display: flex;
      gap: 30px;
      align-items: center;
    }

    .balance-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .balance-item .label {
      font-size: 12px;
      color: #666;
    }

    .balance-item .amount {
      font-size: 16px;
      font-weight: 500;
      color: #2e7d32;
    }

    .amount.negative {
      color: #d32f2f;
    }

    .table-container {
      max-height: 600px;
      overflow: auto;
    }

    .amount-cell {
      text-align: right;
      font-family: monospace;
    }

    .receipt-row {
      background-color: #f1f8e9;
    }

    .payment-row {
      background-color: #fce4ec;
    }

    .text-muted {
      color: #666;
      font-size: 12px;
    }

    .total-row {
      padding: 15px;
      text-align: right;
      background-color: #f5f5f5;
      border-top: 2px solid #ddd;
    }

    .negative {
      color: #d32f2f;
    }

    .ml-2 {
      margin-left: 8px;
    }
  `]
})
export class CashBookComponent implements OnInit {
  entryForm: FormGroup;
  cashBookEntries: CashBookEntry[] = [];
  isEditing = false;
  editingId: number | null = null;
  displayedColumns: string[] = ['date', 'voucherNo', 'particulars', 'debitAmount', 'creditAmount', 'balance', 'actions'];
  
  openingBalance = 50000;
  currentBalance = 0;
  totalReceipts = 0;
  totalPayments = 0;

  receiptsOnly: CashBookEntry[] = [];
  paymentsOnly: CashBookEntry[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.entryForm = this.fb.group({
      date: [new Date(), Validators.required],
      voucherNo: ['', Validators.required],
      particulars: ['', Validators.required],
      type: ['RECEIPT', Validators.required],
      category: ['', Validators.required],
      referenceNo: [''],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      narration: ['']
    });
  }

  ngOnInit() {
    this.generateVoucherNo();
    this.loadSampleData();
    this.calculateTotals();
  }

  generateVoucherNo() {
    const voucherNo = 'V' + Date.now().toString().slice(-6);
    this.entryForm.patchValue({ voucherNo });
  }

  onTypeChange(type: string) {
    this.generateVoucherNo();
  }

  loadSampleData() {
    let runningBalance = this.openingBalance;
    
    this.cashBookEntries = [
      {
        id: 1,
        date: new Date('2024-01-01'),
        particulars: 'Opening Balance',
        voucherNo: 'OB001',
        debitAmount: this.openingBalance,
        creditAmount: 0,
        balance: runningBalance,
        type: 'RECEIPT',
        category: 'Opening',
        referenceNo: '',
        narration: 'Opening balance for the financial year'
      }
    ];

    // Add some sample transactions
    const sampleTransactions = [
      {
        date: new Date('2024-01-02'),
        particulars: 'Member Deposit - John Doe',
        type: 'RECEIPT' as const,
        category: 'Deposit',
        amount: 25000,
        referenceNo: 'DR001234',
        narration: 'Fixed deposit by member John Doe'
      },
      {
        date: new Date('2024-01-03'),
        particulars: 'Office Rent Payment',
        type: 'PAYMENT' as const,
        category: 'Administrative',
        amount: 8000,
        referenceNo: 'RENT001',
        narration: 'Monthly office rent payment'
      },
      {
        date: new Date('2024-01-04'),
        particulars: 'Member Withdrawal - Alice Smith',
        type: 'PAYMENT' as const,
        category: 'Withdrawal',
        amount: 15000,
        referenceNo: 'WD001',
        narration: 'Partial withdrawal by member Alice Smith'
      }
    ];

    sampleTransactions.forEach((transaction, index) => {
      const debitAmount = transaction.type === 'RECEIPT' ? transaction.amount : 0;
      const creditAmount = transaction.type === 'PAYMENT' ? transaction.amount : 0;
      runningBalance += debitAmount - creditAmount;

      this.cashBookEntries.push({
        id: index + 2,
        date: transaction.date,
        particulars: transaction.particulars,
        voucherNo: `V${String(index + 1).padStart(6, '0')}`,
        debitAmount,
        creditAmount,
        balance: runningBalance,
        type: transaction.type,
        category: transaction.category,
        referenceNo: transaction.referenceNo,
        narration: transaction.narration
      });
    });

    this.currentBalance = runningBalance;
  }

  calculateTotals() {
    this.totalReceipts = this.cashBookEntries.reduce((sum, entry) => sum + entry.debitAmount, 0);
    this.totalPayments = this.cashBookEntries.reduce((sum, entry) => sum + entry.creditAmount, 0);
    this.receiptsOnly = this.cashBookEntries.filter(entry => entry.type === 'RECEIPT');
    this.paymentsOnly = this.cashBookEntries.filter(entry => entry.type === 'PAYMENT');
  }

  onSubmit() {
    if (this.entryForm.valid) {
      const formData = this.entryForm.value;
      const amount = formData.amount;
      const type = formData.type;
      
      const debitAmount = type === 'RECEIPT' ? amount : 0;
      const creditAmount = type === 'PAYMENT' ? amount : 0;
      
      if (this.isEditing && this.editingId) {
        const index = this.cashBookEntries.findIndex(e => e.id === this.editingId);
        if (index !== -1) {
          this.cashBookEntries[index] = {
            ...this.cashBookEntries[index],
            ...formData,
            debitAmount,
            creditAmount
          };
          this.recalculateBalances();
          this.snackBar.open('Cash entry updated successfully!', 'Close', { duration: 3000 });
        }
      } else {
        const newEntry: CashBookEntry = {
          id: Math.max(...this.cashBookEntries.map(e => e.id), 0) + 1,
          date: formData.date,
          particulars: formData.particulars,
          voucherNo: formData.voucherNo,
          debitAmount,
          creditAmount,
          balance: 0, // Will be calculated
          type: formData.type,
          category: formData.category,
          referenceNo: formData.referenceNo,
          narration: formData.narration
        };
        
        this.cashBookEntries.push(newEntry);
        this.cashBookEntries.sort((a, b) => a.date.getTime() - b.date.getTime());
        this.recalculateBalances();
        this.snackBar.open('Cash entry added successfully!', 'Close', { duration: 3000 });
      }
      
      this.calculateTotals();
      this.resetForm();
    }
  }

  recalculateBalances() {
    let runningBalance = 0;
    
    this.cashBookEntries.forEach(entry => {
      if (entry.particulars === 'Opening Balance') {
        runningBalance = entry.debitAmount;
      } else {
        runningBalance += entry.debitAmount - entry.creditAmount;
      }
      entry.balance = runningBalance;
    });
    
    this.currentBalance = runningBalance;
  }

  editEntry(entry: CashBookEntry) {
    this.isEditing = true;
    this.editingId = entry.id;
    this.entryForm.patchValue({
      date: entry.date,
      voucherNo: entry.voucherNo,
      particulars: entry.particulars,
      type: entry.type,
      category: entry.category,
      referenceNo: entry.referenceNo,
      amount: entry.type === 'RECEIPT' ? entry.debitAmount : entry.creditAmount,
      narration: entry.narration
    });
  }

  deleteEntry(id: number) {
    const entry = this.cashBookEntries.find(e => e.id === id);
    if (entry && entry.particulars === 'Opening Balance') {
      this.snackBar.open('Cannot delete opening balance entry!', 'Close', { duration: 3000 });
      return;
    }

    if (confirm('Are you sure you want to delete this cash entry?')) {
      this.cashBookEntries = this.cashBookEntries.filter(e => e.id !== id);
      this.recalculateBalances();
      this.calculateTotals();
      this.snackBar.open('Cash entry deleted successfully!', 'Close', { duration: 3000 });
    }
  }

  resetForm() {
    this.entryForm.reset();
    this.entryForm.patchValue({
      date: new Date(),
      type: 'RECEIPT',
      amount: 0
    });
    this.generateVoucherNo();
    this.isEditing = false;
    this.editingId = null;
  }
}
