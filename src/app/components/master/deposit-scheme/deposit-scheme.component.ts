
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

interface DepositScheme {
  id: number;
  schemeName: string;
  schemeCode: string;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  tenure: number;
  tenureType: string;
  status: string;
}

@Component({
  selector: 'app-deposit-scheme',
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
      <h1>Deposit Scheme Management</h1>
      
      <!-- Add/Edit Form -->
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>{{isEditing ? 'Edit' : 'Add'}} Deposit Scheme</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="schemeForm" (ngSubmit)="onSubmit()" class="scheme-form">
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Scheme Code</mat-label>
                <input matInput formControlName="schemeCode" required>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Scheme Name</mat-label>
                <input matInput formControlName="schemeName" required>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Interest Rate (%)</mat-label>
                <input matInput formControlName="interestRate" type="number" step="0.01" required>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Tenure</mat-label>
                <input matInput formControlName="tenure" type="number" required>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Tenure Type</mat-label>
                <mat-select formControlName="tenureType" required>
                  <mat-option value="months">Months</mat-option>
                  <mat-option value="years">Years</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Minimum Amount</mat-label>
                <input matInput formControlName="minAmount" type="number" required>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Maximum Amount</mat-label>
                <input matInput formControlName="maxAmount" type="number" required>
              </mat-form-field>
            </div>
            
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="schemeForm.invalid">
                {{isEditing ? 'Update' : 'Add'}} Scheme
              </button>
              <button mat-button type="button" (click)="resetForm()" *ngIf="isEditing">
                Cancel
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
      
      <!-- Schemes Table -->
      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>Deposit Schemes</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="schemes" class="mat-elevation-z2">
            <ng-container matColumnDef="schemeCode">
              <th mat-header-cell *matHeaderCellDef>Code</th>
              <td mat-cell *matCellDef="let scheme">{{scheme.schemeCode}}</td>
            </ng-container>
            
            <ng-container matColumnDef="schemeName">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let scheme">{{scheme.schemeName}}</td>
            </ng-container>
            
            <ng-container matColumnDef="interestRate">
              <th mat-header-cell *matHeaderCellDef>Interest Rate</th>
              <td mat-cell *matCellDef="let scheme">{{scheme.interestRate}}%</td>
            </ng-container>
            
            <ng-container matColumnDef="tenure">
              <th mat-header-cell *matHeaderCellDef>Tenure</th>
              <td mat-cell *matCellDef="let scheme">{{scheme.tenure}} {{scheme.tenureType}}</td>
            </ng-container>
            
            <ng-container matColumnDef="amount">
              <th mat-header-cell *matHeaderCellDef>Amount Range</th>
              <td mat-cell *matCellDef="let scheme">₹{{scheme.minAmount}} - ₹{{scheme.maxAmount}}</td>
            </ng-container>
            
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let scheme">{{scheme.status}}</td>
            </ng-container>
            
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let scheme">
                <button mat-icon-button color="primary" (click)="editScheme(scheme)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteScheme(scheme.id)">
                  <mat-icon>delete</mat-icon>
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
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .form-card, .table-card {
      margin-bottom: 20px;
    }
    
    .scheme-form {
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
export class DepositSchemeComponent implements OnInit {
  schemeForm: FormGroup;
  schemes: DepositScheme[] = [];
  isEditing = false;
  editingId: number | null = null;
  displayedColumns: string[] = ['schemeCode', 'schemeName', 'interestRate', 'tenure', 'amount', 'status', 'actions'];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.schemeForm = this.fb.group({
      schemeCode: ['', Validators.required],
      schemeName: ['', Validators.required],
      interestRate: ['', [Validators.required, Validators.min(0)]],
      minAmount: ['', [Validators.required, Validators.min(1)]],
      maxAmount: ['', [Validators.required, Validators.min(1)]],
      tenure: ['', [Validators.required, Validators.min(1)]],
      tenureType: ['months', Validators.required]
    });
  }

  ngOnInit() {
    this.loadSampleData();
  }

  loadSampleData() {
    this.schemes = [
      {
        id: 1,
        schemeCode: 'RD001',
        schemeName: 'Regular Deposit',
        interestRate: 7.5,
        minAmount: 500,
        maxAmount: 50000,
        tenure: 12,
        tenureType: 'months',
        status: 'Active'
      },
      {
        id: 2,
        schemeCode: 'FD001',
        schemeName: 'Fixed Deposit',
        interestRate: 8.0,
        minAmount: 1000,
        maxAmount: 100000,
        tenure: 2,
        tenureType: 'years',
        status: 'Active'
      }
    ];
  }

  onSubmit() {
    if (this.schemeForm.valid) {
      const formValue = this.schemeForm.value;
      
      if (this.isEditing && this.editingId) {
        const index = this.schemes.findIndex(s => s.id === this.editingId);
        if (index !== -1) {
          this.schemes[index] = { ...this.schemes[index], ...formValue };
          this.snackBar.open('Scheme updated successfully!', 'Close', { duration: 3000 });
        }
      } else {
        const newScheme: DepositScheme = {
          id: this.schemes.length + 1,
          ...formValue,
          status: 'Active'
        };
        this.schemes.push(newScheme);
        this.snackBar.open('Scheme added successfully!', 'Close', { duration: 3000 });
      }
      
      this.resetForm();
    }
  }

  editScheme(scheme: DepositScheme) {
    this.isEditing = true;
    this.editingId = scheme.id;
    this.schemeForm.patchValue(scheme);
  }

  deleteScheme(id: number) {
    if (confirm('Are you sure you want to delete this scheme?')) {
      this.schemes = this.schemes.filter(s => s.id !== id);
      this.snackBar.open('Scheme deleted successfully!', 'Close', { duration: 3000 });
    }
  }

  resetForm() {
    this.schemeForm.reset();
    this.schemeForm.patchValue({ tenureType: 'months' });
    this.isEditing = false;
    this.editingId = null;
  }
}
