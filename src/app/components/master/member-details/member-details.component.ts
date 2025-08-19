
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthService, UserRole } from '../../../services/auth.service';

interface Member {
  id: number;
  // General Tab
  memberNo: string;
  name: string;
  fatherHusbandName: string;
  officeAddress: string;
  city: string;
  phoneOffice: string;
  branch: string;
  phoneResidence: string;
  designation: string;
  mobile: string;
  residenceAddress: string;
  dob: Date;
  dojSociety: Date;
  email: string;
  doj: Date;
  dor: Date | null;
  nominee: string;
  nomineeRelation: string;
  
  // Photo & Opening Balance Tab
  openingBalanceShare: number;
  openingBalanceCR: number;
  bankName: string;
  bankPayableAt: string;
  bankAccountNo: string;
  status: string;
  statusDate: Date;
  photo: string | null;
  signature: string | null;
  
  // Monthly Deduction Tab
  deductionShare: number;
  deductionWithdrawal: number;
  deductionGLoanInstalment: number;
  deductionELoanInstalment: number;
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
    MatTooltipModule,
    MatTabsModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSidenavModule
  ],
  template: `
    <div class="page-container">
      <mat-sidenav-container class="sidenav-container">
        <!-- Main Content -->
        <mat-sidenav-content>
          <div class="page-header">
            <h1>Member Details Management</h1>
            <div class="header-actions" *ngIf="canCreateMembers">
              <button mat-raised-button color="primary" (click)="openMemberForm()" 
                      class="add-member-btn">
                <mat-icon>add</mat-icon>
                Add New Member
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

          <!-- Members List -->
          <mat-card class="table-card" *ngIf="canCreateMembers || canEditMembers">
            <mat-card-header>
              <div class="card-header-content">
                <mat-card-title>Members List ({{filteredMembers.length}})</mat-card-title>
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
                  
                  <ng-container matColumnDef="mobile">
                    <th mat-header-cell *matHeaderCellDef>Mobile</th>
                    <td mat-cell *matCellDef="let member">{{member.mobile}}</td>
                  </ng-container>
                  
                  <ng-container matColumnDef="branch">
                    <th mat-header-cell *matHeaderCellDef>Branch</th>
                    <td mat-cell *matCellDef="let member">{{member.branch}}</td>
                  </ng-container>
                  
                  <ng-container matColumnDef="dojSociety">
                    <th mat-header-cell *matHeaderCellDef>DOJ Society</th>
                    <td mat-cell *matCellDef="let member">{{member.dojSociety | date}}</td>
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
                      <span>{{member.mobile}}</span>
                    </div>
                    <div class="info-row">
                      <mat-icon>business</mat-icon>
                      <span>{{member.branch}}</span>
                    </div>
                    <div class="info-row">
                      <mat-icon>calendar_today</mat-icon>
                      <span>{{member.dojSociety | date}}</span>
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
        </mat-sidenav-content>

        <!-- Offcanvas Form -->
        <mat-sidenav #memberFormSidenav 
                     mode="over" 
                     position="end" 
                     class="member-form-sidenav"
                     (closed)="closeMemberForm()">
          <div class="sidenav-header">
            <h2>{{editingMember ? 'Edit Member' : 'Add New Member'}}</h2>
            <button mat-icon-button (click)="closeMemberForm()">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <div class="sidenav-content">
            <form [formGroup]="memberForm" (ngSubmit)="saveMember()">
              <mat-tab-group class="member-tabs">
                
                <!-- General Tab -->
                <mat-tab label="General">
                  <div class="tab-content">
                    <div class="form-grid">
                      <mat-form-field appearance="outline">
                        <mat-label>Member No</mat-label>
                        <input matInput formControlName="memberNo" readonly>
                      </mat-form-field>
                      
                      <mat-form-field appearance="outline">
                        <mat-label>Name</mat-label>
                        <input matInput formControlName="name" required>
                        <mat-error *ngIf="memberForm.get('name')?.hasError('required')">Name is required</mat-error>
                      </mat-form-field>
                      
                      <mat-form-field appearance="outline">
                        <mat-label>F/H Name</mat-label>
                        <input matInput formControlName="fatherHusbandName" required>
                      </mat-form-field>
                      
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Office Address</mat-label>
                        <textarea matInput formControlName="officeAddress" rows="2"></textarea>
                      </mat-form-field>
                      
                      <mat-form-field appearance="outline">
                        <mat-label>City</mat-label>
                        <input matInput formControlName="city" required>
                      </mat-form-field>
                      
                      <mat-form-field appearance="outline">
                        <mat-label>Phone (Off.)</mat-label>
                        <input matInput formControlName="phoneOffice">
                      </mat-form-field>
                      
                      <mat-form-field appearance="outline">
                        <mat-label>Branch</mat-label>
                        <mat-select formControlName="branch">
                          <mat-option value="Main Branch">Main Branch</mat-option>
                          <mat-option value="Branch A">Branch A</mat-option>
                          <mat-option value="Branch B">Branch B</mat-option>
                          <mat-option value="Branch C">Branch C</mat-option>
                        </mat-select>
                      </mat-form-field>
                      
                      <mat-form-field appearance="outline">
                        <mat-label>Phone (Res.)</mat-label>
                        <input matInput formControlName="phoneResidence">
                      </mat-form-field>
                      
                      <mat-form-field appearance="outline">
                        <mat-label>Designation</mat-label>
                        <input matInput formControlName="designation">
                      </mat-form-field>
                      
                      <mat-form-field appearance="outline">
                        <mat-label>Mobile</mat-label>
                        <input matInput formControlName="mobile" required>
                      </mat-form-field>
                      
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Residence Address</mat-label>
                        <textarea matInput formControlName="residenceAddress" rows="2" required></textarea>
                      </mat-form-field>
                      
                      <mat-form-field appearance="outline">
                        <mat-label>Date of Birth</mat-label>
                        <input matInput [matDatepicker]="dobPicker" formControlName="dob">
                        <mat-datepicker-toggle matSuffix [for]="dobPicker"></mat-datepicker-toggle>
                        <mat-datepicker #dobPicker></mat-datepicker>
                      </mat-form-field>
                      
                      <mat-form-field appearance="outline">
                        <mat-label>DOJ Society</mat-label>
                        <input matInput [matDatepicker]="dojSocietyPicker" formControlName="dojSociety">
                        <mat-datepicker-toggle matSuffix [for]="dojSocietyPicker"></mat-datepicker-toggle>
                        <mat-datepicker #dojSocietyPicker></mat-datepicker>
                      </mat-form-field>
                      
                      <mat-form-field appearance="outline">
                        <mat-label>Email</mat-label>
                        <input matInput type="email" formControlName="email">
                      </mat-form-field>
                      
                      <mat-form-field appearance="outline">
                        <mat-label>DOJ</mat-label>
                        <input matInput [matDatepicker]="dojPicker" formControlName="doj">
                        <mat-datepicker-toggle matSuffix [for]="dojPicker"></mat-datepicker-toggle>
                        <mat-datepicker #dojPicker></mat-datepicker>
                      </mat-form-field>
                      
                      <mat-form-field appearance="outline">
                        <mat-label>DOR</mat-label>
                        <input matInput [matDatepicker]="dorPicker" formControlName="dor">
                        <mat-datepicker-toggle matSuffix [for]="dorPicker"></mat-datepicker-toggle>
                        <mat-datepicker #dorPicker></mat-datepicker>
                      </mat-form-field>
                      
                      <mat-form-field appearance="outline">
                        <mat-label>Nominee</mat-label>
                        <input matInput formControlName="nominee">
                      </mat-form-field>
                      
                      <mat-form-field appearance="outline">
                        <mat-label>Nominee Relation</mat-label>
                        <mat-select formControlName="nomineeRelation">
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
                </mat-tab>
                
                <!-- Photo & Opening Balance Tab -->
                <mat-tab label="Photo & Opening Balance">
                  <div class="tab-content">
                    <div class="form-grid">
                      <div class="photo-upload-section full-width">
                        <h3>Photo & Signature</h3>
                        <div class="upload-row">
                          <div class="upload-item">
                            <label>Member Photo</label>
                            <div class="image-upload-area" (click)="photoInput.click()">
                              <img *ngIf="photoPreview" [src]="photoPreview" alt="Member Photo" class="preview-image">
                              <div *ngIf="!photoPreview" class="upload-placeholder">
                                <mat-icon>add_a_photo</mat-icon>
                                <span>Click to upload photo</span>
                              </div>
                            </div>
                            <input #photoInput type="file" accept="image/*" (change)="onPhotoSelected($event)" style="display: none">
                          </div>
                          
                          <div class="upload-item">
                            <label>Signature</label>
                            <div class="image-upload-area" (click)="signatureInput.click()">
                              <img *ngIf="signaturePreview" [src]="signaturePreview" alt="Signature" class="preview-image">
                              <div *ngIf="!signaturePreview" class="upload-placeholder">
                                <mat-icon>edit</mat-icon>
                                <span>Click to upload signature</span>
                              </div>
                            </div>
                            <input #signatureInput type="file" accept="image/*" (change)="onSignatureSelected($event)" style="display: none">
                          </div>
                        </div>
                      </div>
                      
                      <div class="section-divider full-width"></div>
                      
                      <h3 class="full-width">Opening Balance</h3>
                      
                      <mat-form-field appearance="outline">
                        <mat-label>Opening Balance (Share)</mat-label>
                        <input matInput type="number" formControlName="openingBalanceShare">
                      </mat-form-field>
                      
                      <mat-form-field appearance="outline">
                        <mat-label>Opening Balance (CR)</mat-label>
                        <input matInput type="number" formControlName="openingBalanceCR">
                      </mat-form-field>
                      
                      <h3 class="full-width">Bank Details</h3>
                      
                      <mat-form-field appearance="outline">
                        <mat-label>Bank Name</mat-label>
                        <input matInput formControlName="bankName">
                      </mat-form-field>
                      
                      <mat-form-field appearance="outline">
                        <mat-label>Payable At</mat-label>
                        <input matInput formControlName="bankPayableAt">
                      </mat-form-field>
                      
                      <mat-form-field appearance="outline">
                        <mat-label>Account No</mat-label>
                        <input matInput formControlName="bankAccountNo">
                      </mat-form-field>
                      
                      <mat-form-field appearance="outline">
                        <mat-label>Status</mat-label>
                        <mat-select formControlName="status">
                          <mat-option value="Active">Active</mat-option>
                          <mat-option value="Inactive">Inactive</mat-option>
                          <mat-option value="Suspended">Suspended</mat-option>
                          <mat-option value="Closed">Closed</mat-option>
                        </mat-select>
                      </mat-form-field>
                      
                      <mat-form-field appearance="outline">
                        <mat-label>Status Date</mat-label>
                        <input matInput [matDatepicker]="statusDatePicker" formControlName="statusDate">
                        <mat-datepicker-toggle matSuffix [for]="statusDatePicker"></mat-datepicker-toggle>
                        <mat-datepicker #statusDatePicker></mat-datepicker>
                      </mat-form-field>
                    </div>
                  </div>
                </mat-tab>
                
                <!-- Monthly Deduction Tab -->
                <mat-tab label="Monthly Deduction">
                  <div class="tab-content">
                    <div class="form-grid">
                      <h3 class="full-width">Monthly Deductions</h3>
                      
                      <mat-form-field appearance="outline">
                        <mat-label>Share Deduction</mat-label>
                        <input matInput type="number" formControlName="deductionShare">
                      </mat-form-field>
                      
                      <mat-form-field appearance="outline">
                        <mat-label>Withdrawal Deduction</mat-label>
                        <input matInput type="number" formControlName="deductionWithdrawal">
                      </mat-form-field>
                      
                      <mat-form-field appearance="outline">
                        <mat-label>G Loan Instalment</mat-label>
                        <input matInput type="number" formControlName="deductionGLoanInstalment">
                      </mat-form-field>
                      
                      <mat-form-field appearance="outline">
                        <mat-label>E Loan Instalment</mat-label>
                        <input matInput type="number" formControlName="deductionELoanInstalment">
                      </mat-form-field>
                    </div>
                  </div>
                </mat-tab>
                
              </mat-tab-group>
              
              <div class="form-actions">
                <button mat-raised-button color="primary" type="submit" 
                        [disabled]="!memberForm.valid || !canCreateMembers"
                        class="submit-btn">
                  <mat-icon>{{editingMember ? 'update' : 'add'}}</mat-icon>
                  {{editingMember ? 'Update Member' : 'Add Member'}}
                </button>
                <button mat-stroked-button type="button" (click)="closeMemberForm()">
                  <mat-icon>cancel</mat-icon>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </mat-sidenav>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 16px;
    }

    .sidenav-container {
      min-height: calc(100vh - 32px);
    }

    .member-form-sidenav {
      width: 600px;
      max-width: 90vw;
    }

    .sidenav-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid #e0e0e0;
      background-color: #fafafa;
    }

    .sidenav-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
    }

    .sidenav-content {
      padding: 24px;
      overflow-y: auto;
      height: calc(100vh - 80px);
    }

    .add-member-btn {
      min-width: 150px;
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
    
    .member-tabs {
      margin-bottom: 24px;
    }
    
    .tab-content {
      padding: 24px 0;
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
    
    .section-divider {
      height: 1px;
      background-color: #e0e0e0;
      margin: 20px 0;
    }
    
    .photo-upload-section {
      margin-bottom: 20px;
    }
    
    .upload-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 16px;
    }
    
    .upload-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .upload-item label {
      font-weight: 500;
      color: #666;
    }
    
    .image-upload-area {
      border: 2px dashed #ddd;
      border-radius: 8px;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: border-color 0.3s;
      overflow: hidden;
    }
    
    .image-upload-area:hover {
      border-color: #2196f3;
    }
    
    .upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: #666;
      text-align: center;
    }
    
    .preview-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: cover;
    }
    
    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      flex-wrap: wrap;
      margin-top: 24px;
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
    
    .status-closed {
      background-color: #f5f5f5;
      color: #424242;
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

      .member-form-sidenav {
        width: 100vw;
        max-width: 100vw;
      }

      .sidenav-content {
        padding: 16px;
      }
      
      .form-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      
      .upload-row {
        grid-template-columns: 1fr;
      }
      
      .form-actions {
        justify-content: stretch;
        flex-direction: column;
      }
      
      .form-actions button {
        width: 100%;
        margin-bottom: 8px;
      }
      
      .desktop-view {
        display: none;
      }
      
      .mobile-view {
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

      .add-member-btn {
        width: 100%;
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
  displayedColumns = ['memberNo', 'name', 'mobile', 'branch', 'dojSociety', 'status', 'actions'];
  editingMember: Member | null = null;
  nextMemberNo = 1001;
  canCreateMembers = false;
  canEditMembers = false;
  currentUser: any = null;
  photoPreview: string | null = null;
  signaturePreview: string | null = null;
  
  @ViewChild('memberFormSidenav') memberFormSidenav!: any;

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
      // General Tab
      memberNo: [''],
      name: ['', Validators.required],
      fatherHusbandName: ['', Validators.required],
      officeAddress: [''],
      city: ['', Validators.required],
      phoneOffice: [''],
      branch: ['', Validators.required],
      phoneResidence: [''],
      designation: [''],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      residenceAddress: ['', Validators.required],
      dob: [''],
      dojSociety: [new Date(), Validators.required],
      email: ['', [Validators.email]],
      doj: [new Date(), Validators.required],
      dor: [''],
      nominee: [''],
      nomineeRelation: [''],
      
      // Photo & Opening Balance Tab
      openingBalanceShare: [0],
      openingBalanceCR: [0],
      bankName: [''],
      bankPayableAt: [''],
      bankAccountNo: [''],
      status: ['Active', Validators.required],
      statusDate: [new Date(), Validators.required],
      
      // Monthly Deduction Tab
      deductionShare: [0],
      deductionWithdrawal: [0],
      deductionGLoanInstalment: [0],
      deductionELoanInstalment: [0]
    });
  }

  generateMemberNo() {
    this.memberForm.patchValue({
      memberNo: `MEM${this.nextMemberNo.toString().padStart(4, '0')}`
    });
  }

  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSignatureSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.signaturePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  loadSampleData() {
    this.members = [
      {
        id: 1,
        memberNo: 'MEM1001',
        name: 'John Doe',
        fatherHusbandName: 'Robert Doe',
        officeAddress: '123 Business Street, City',
        city: 'Mumbai',
        phoneOffice: '022-12345678',
        branch: 'Main Branch',
        phoneResidence: '022-87654321',
        designation: 'Manager',
        mobile: '9876543210',
        residenceAddress: '123 Main Street, City, State',
        dob: new Date('1985-05-15'),
        dojSociety: new Date('2024-01-15'),
        email: 'john.doe@email.com',
        doj: new Date('2024-01-15'),
        dor: null,
        nominee: 'Jane Doe',
        nomineeRelation: 'Spouse',
        openingBalanceShare: 1000,
        openingBalanceCR: 500,
        bankName: 'State Bank of India',
        bankPayableAt: 'Mumbai Branch',
        bankAccountNo: '123456789',
        status: 'Active',
        statusDate: new Date('2024-01-15'),
        photo: null,
        signature: null,
        deductionShare: 100,
        deductionWithdrawal: 0,
        deductionGLoanInstalment: 200,
        deductionELoanInstalment: 150
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
        this.members[index] = { 
          ...this.editingMember, 
          ...formValue,
          photo: this.photoPreview,
          signature: this.signaturePreview
        };
        this.snackBar.open('Member updated successfully', 'Close', { duration: 3000 });
      } else {
        // Add new member
        const newMember: Member = {
          id: Date.now(),
          ...formValue,
          photo: this.photoPreview,
          signature: this.signaturePreview
        };
        this.members.push(newMember);
        this.nextMemberNo++;
        this.snackBar.open('Member added successfully', 'Close', { duration: 3000 });
      }
      
      this.filteredMembers = [...this.members];
      this.closeMemberForm();
    }
  }

  editMember(member: Member) {
    this.editingMember = member;
    this.memberForm.patchValue(member);
    this.photoPreview = member.photo;
    this.signaturePreview = member.signature;
    this.memberFormSidenav.open();
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
    this.photoPreview = null;
    this.signaturePreview = null;
    this.memberForm.patchValue({
      dojSociety: new Date(),
      doj: new Date(),
      statusDate: new Date(),
      status: 'Active',
      openingBalanceShare: 0,
      openingBalanceCR: 0,
      deductionShare: 0,
      deductionWithdrawal: 0,
      deductionGLoanInstalment: 0,
      deductionELoanInstalment: 0
    });
    this.generateMemberNo();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredMembers = this.members.filter(member =>
      member.name.toLowerCase().includes(filterValue) ||
      member.mobile.includes(filterValue) ||
      member.memberNo.toLowerCase().includes(filterValue) ||
      member.branch.toLowerCase().includes(filterValue)
    );
  }

  openMemberForm() {
    this.resetForm();
    this.memberFormSidenav.open();
  }

  closeMemberForm() {
    this.memberFormSidenav.close();
    this.resetForm();
  }

  scrollToForm() {
    this.openMemberForm();
  }
}
