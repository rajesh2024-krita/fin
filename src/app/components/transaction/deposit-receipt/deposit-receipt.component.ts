
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
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

interface DepositReceipt {
  id: number;
  receiptNo: string;
  memberNo: string;
  memberName: string;
  depositDate: Date;
  depositScheme: string;
  amount: number;
  interestRate: number;
  maturityDate: Date;
  maturityAmount: number;
  status: string;
  nominee: string;
}

@Component({
  selector: 'app-deposit-receipt',
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
    MatSnackBarModule
  ],
  template: `
    <div class="page-container">
      <h1>Deposit Receipt Management</h1>
      
      <!-- Deposit Receipt Form -->
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>{{editingReceipt ? 'Edit Deposit Receipt' : 'New Deposit Receipt'}}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="receiptForm" (ngSubmit)="saveReceipt()">
            <div class="form-grid">
              <mat-form-field>
                <mat-label>Receipt No</mat-label>
                <input matInput formControlName="receiptNo" readonly>
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>Member No</mat-label>
                <mat-select formControlName="memberNo" (selectionChange)="onMemberSelect($event.value)">
                  <mat-option *ngFor="let member of members" [value]="member.memberNo">
                    {{member.memberNo}} - {{member.name}}
                  </mat-option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>Member Name</mat-label>
                <input matInput formControlName="memberName" readonly>
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>Deposit Date</mat-label>
                <input matInput [matDatepicker]="dpicker" formControlName="depositDate">
                <mat-datepicker-toggle matSuffix [for]="dpicker"></mat-datepicker-toggle>
                <mat-datepicker #dpicker></mat-datepicker>
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>Deposit Scheme</mat-label>
                <mat-select formControlName="depositScheme" (selectionChange)="onSchemeSelect($event.value)">
                  <mat-option value="Fixed Deposit - 1 Year">Fixed Deposit - 1 Year (8.5%)</mat-option>
                  <mat-option value="Fixed Deposit - 2 Years">Fixed Deposit - 2 Years (9%)</mat-option>
                  <mat-option value="Fixed Deposit - 3 Years">Fixed Deposit - 3 Years (9.5%)</mat-option>
                  <mat-option value="Recurring Deposit - 1 Year">Recurring Deposit - 1 Year (8%)</mat-option>
                  <mat-option value="Recurring Deposit - 2 Years">Recurring Deposit - 2 Years (8.5%)</mat-option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>Deposit Amount</mat-label>
                <input matInput type="number" formControlName="amount" (blur)="calculateMaturity()" min="1000">
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>Interest Rate (%)</mat-label>
                <input matInput type="number" formControlName="interestRate" readonly>
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>Maturity Date</mat-label>
                <input matInput [matDatepicker]="mpicker" formControlName="maturityDate" readonly>
                <mat-datepicker-toggle matSuffix [for]="mpicker"></mat-datepicker-toggle>
                <mat-datepicker #mpicker></mat-datepicker>
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>Maturity Amount</mat-label>
                <input matInput type="number" formControlName="maturityAmount" readonly>
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>Nominee</mat-label>
                <input matInput formControlName="nominee" required>
              </mat-form-field>
              
              <mat-form-field>
                <mat-label>Status</mat-label>
                <mat-select formControlName="status">
                  <mat-option value="Active">Active</mat-option>
                  <mat-option value="Matured">Matured</mat-option>
                  <mat-option value="Closed">Closed</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="!receiptForm.valid">
                {{editingReceipt ? 'Update Receipt' : 'Create Receipt'}}
              </button>
              <button mat-button type="button" (click)="resetForm()" *ngIf="editingReceipt">
                Cancel
              </button>
              <button mat-raised-button color="accent" type="button" (click)="printReceipt()" *ngIf="editingReceipt">
                Print Receipt
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
      
      <!-- Deposit Receipts List -->
      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>Deposit Receipts</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="table-controls">
            <mat-form-field>
              <mat-label>Search Receipts</mat-label>
              <input matInput (keyup)="applyFilter($event)" placeholder="Search by receipt no, member no, or name">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
          
          <div class="table-container">
            <table mat-table [dataSource]="filteredReceipts" class="receipts-table">
              <ng-container matColumnDef="receiptNo">
                <th mat-header-cell *matHeaderCellDef>Receipt No</th>
                <td mat-cell *matCellDef="let receipt">{{receipt.receiptNo}}</td>
              </ng-container>
              
              <ng-container matColumnDef="memberDetails">
                <th mat-header-cell *matHeaderCellDef>Member</th>
                <td mat-cell *matCellDef="let receipt">
                  {{receipt.memberNo}} - {{receipt.memberName}}
                </td>
              </ng-container>
              
              <ng-container matColumnDef="scheme">
                <th mat-header-cell *matHeaderCellDef>Scheme</th>
                <td mat-cell *matCellDef="let receipt">{{receipt.depositScheme}}</td>
              </ng-container>
              
              <ng-container matColumnDef="amount">
                <th mat-header-cell *matHeaderCellDef>Amount</th>
                <td mat-cell *matCellDef="let receipt">₹{{receipt.amount | number}}</td>
              </ng-container>
              
              <ng-container matColumnDef="maturityDate">
                <th mat-header-cell *matHeaderCellDef>Maturity Date</th>
                <td mat-cell *matCellDef="let receipt">{{receipt.maturityDate | date}}</td>
              </ng-container>
              
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let receipt">
                  <span class="status-badge" [class]="'status-' + receipt.status.toLowerCase()">
                    {{receipt.status}}
                  </span>
                </td>
              </ng-container>
              
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let receipt">
                  <button mat-icon-button (click)="editReceipt(receipt)" color="primary">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="printReceipt(receipt)" color="accent">
                    <mat-icon>print</mat-icon>
                  </button>
                  <button mat-icon-button (click)="deleteReceipt(receipt.id)" color="warn">
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
    
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
      margin-bottom: 20px;
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
    
    .receipts-table {
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
    
    .status-matured {
      background-color: #ff9800;
      color: white;
    }
    
    .status-closed {
      background-color: #f44336;
      color: white;
    }
  `]
})
export class DepositReceiptComponent implements OnInit {
  receiptForm: FormGroup;
  receipts: DepositReceipt[] = [];
  filteredReceipts: DepositReceipt[] = [];
  displayedColumns = ['receiptNo', 'memberDetails', 'scheme', 'amount', 'maturityDate', 'status', 'actions'];
  editingReceipt: DepositReceipt | null = null;
  nextReceiptNo = 1001;
  
  members = [
    { memberNo: 'MEM1001', name: 'John Doe' },
    { memberNo: 'MEM1002', name: 'Jane Smith' },
    { memberNo: 'MEM1003', name: 'Bob Johnson' }
  ];

  schemes = {
    'Fixed Deposit - 1 Year': { rate: 8.5, tenure: 1 },
    'Fixed Deposit - 2 Years': { rate: 9.0, tenure: 2 },
    'Fixed Deposit - 3 Years': { rate: 9.5, tenure: 3 },
    'Recurring Deposit - 1 Year': { rate: 8.0, tenure: 1 },
    'Recurring Deposit - 2 Years': { rate: 8.5, tenure: 2 }
  };

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.receiptForm = this.createForm();
  }

  ngOnInit() {
    this.loadSampleData();
    this.generateReceiptNo();
  }

  createForm(): FormGroup {
    return this.fb.group({
      receiptNo: [''],
      memberNo: ['', Validators.required],
      memberName: [''],
      depositDate: [new Date(), Validators.required],
      depositScheme: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1000)]],
      interestRate: [''],
      maturityDate: [''],
      maturityAmount: [''],
      nominee: ['', Validators.required],
      status: ['Active', Validators.required]
    });
  }

  generateReceiptNo() {
    this.receiptForm.patchValue({
      receiptNo: `DR${this.nextReceiptNo.toString().padStart(4, '0')}`
    });
  }

  onMemberSelect(memberNo: string) {
    const member = this.members.find(m => m.memberNo === memberNo);
    if (member) {
      this.receiptForm.patchValue({ memberName: member.name });
    }
  }

  onSchemeSelect(scheme: string) {
    const schemeDetails = this.schemes[scheme as keyof typeof this.schemes];
    if (schemeDetails) {
      this.receiptForm.patchValue({ interestRate: schemeDetails.rate });
      this.calculateMaturity();
    }
  }

  calculateMaturity() {
    const amount = this.receiptForm.get('amount')?.value;
    const depositDate = this.receiptForm.get('depositDate')?.value;
    const scheme = this.receiptForm.get('depositScheme')?.value;
    
    if (amount && depositDate && scheme) {
      const schemeDetails = this.schemes[scheme as keyof typeof this.schemes];
      const maturityDate = new Date(depositDate);
      maturityDate.setFullYear(maturityDate.getFullYear() + schemeDetails.tenure);
      
      const maturityAmount = amount * Math.pow(1 + (schemeDetails.rate / 100), schemeDetails.tenure);
      
      this.receiptForm.patchValue({
        maturityDate: maturityDate,
        maturityAmount: Math.round(maturityAmount)
      });
    }
  }

  loadSampleData() {
    this.receipts = [
      {
        id: 1,
        receiptNo: 'DR1001',
        memberNo: 'MEM1001',
        memberName: 'John Doe',
        depositDate: new Date('2024-01-15'),
        depositScheme: 'Fixed Deposit - 2 Years',
        amount: 50000,
        interestRate: 9.0,
        maturityDate: new Date('2026-01-15'),
        maturityAmount: 59405,
        status: 'Active',
        nominee: 'Jane Doe'
      }
    ];
    this.filteredReceipts = [...this.receipts];
    this.nextReceiptNo = Math.max(...this.receipts.map(r => parseInt(r.receiptNo.slice(2))), 1000) + 1;
  }

  saveReceipt() {
    if (this.receiptForm.valid) {
      const formValue = this.receiptForm.value;
      
      if (this.editingReceipt) {
        const index = this.receipts.findIndex(r => r.id === this.editingReceipt!.id);
        this.receipts[index] = { ...this.editingReceipt, ...formValue };
        this.snackBar.open('Receipt updated successfully', 'Close', { duration: 3000 });
      } else {
        const newReceipt: DepositReceipt = {
          id: Date.now(),
          ...formValue
        };
        this.receipts.push(newReceipt);
        this.nextReceiptNo++;
        this.snackBar.open('Receipt created successfully', 'Close', { duration: 3000 });
      }
      
      this.filteredReceipts = [...this.receipts];
      this.resetForm();
    }
  }

  editReceipt(receipt: DepositReceipt) {
    this.editingReceipt = receipt;
    this.receiptForm.patchValue(receipt);
  }

  deleteReceipt(id: number) {
    if (confirm('Are you sure you want to delete this receipt?')) {
      this.receipts = this.receipts.filter(r => r.id !== id);
      this.filteredReceipts = [...this.receipts];
      this.snackBar.open('Receipt deleted successfully', 'Close', { duration: 3000 });
    }
  }

  printReceipt(receipt?: DepositReceipt) {
    this.snackBar.open('Print functionality will be implemented', 'Close', { duration: 2000 });
  }

  resetForm() {
    this.editingReceipt = null;
    this.receiptForm.reset();
    this.receiptForm.patchValue({
      depositDate: new Date(),
      status: 'Active'
    });
    this.generateReceiptNo();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredReceipts = this.receipts.filter(receipt =>
      receipt.receiptNo.toLowerCase().includes(filterValue) ||
      receipt.memberNo.toLowerCase().includes(filterValue) ||
      receipt.memberName.toLowerCase().includes(filterValue)
    );
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-deposit-receipt',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="min-h-screen bg-gray-50 p-4">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h1 class="text-3xl font-bold text-gray-800 mb-6">Deposit Receipt</h1>
          
          <form [formGroup]="depositForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <mat-form-field appearance="outline">
                <mat-label>Member ID</mat-label>
                <input matInput formControlName="memberId" placeholder="Enter member ID">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Member Name</mat-label>
                <input matInput formControlName="memberName" placeholder="Member name" readonly>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Deposit Amount</mat-label>
                <input matInput type="number" formControlName="amount" placeholder="0.00">
                <span matPrefix>₹&nbsp;</span>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Deposit Type</mat-label>
                <mat-select formControlName="depositType">
                  <mat-option value="FD">Fixed Deposit</mat-option>
                  <mat-option value="RD">Recurring Deposit</mat-option>
                  <mat-option value="SD">Savings Deposit</mat-option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Deposit Date</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="depositDate">
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Interest Rate</mat-label>
                <input matInput type="number" formControlName="interestRate" placeholder="0.00">
                <span matSuffix>%</span>
              </mat-form-field>
            </div>
            
            <div class="flex justify-end space-x-4">
              <button mat-button type="button">Cancel</button>
              <button mat-raised-button color="primary" type="submit">Generate Receipt</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class DepositReceiptComponent {
  depositForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.depositForm = this.fb.group({
      memberId: ['', Validators.required],
      memberName: [''],
      amount: ['', [Validators.required, Validators.min(1)]],
      depositType: ['', Validators.required],
      depositDate: [new Date(), Validators.required],
      interestRate: ['', Validators.required]
    });
  }
}
