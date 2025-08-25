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
      <h2 mat-dialog-title>{{isEditMode ? 'Edit Member' : 'Add New Member'}}</h2>

      <mat-dialog-content>
        <form [formGroup]="memberForm" class="member-form">
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Member Number</mat-label>
              <input matInput formControlName="memberNo" required>
              <mat-error>Member number is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Name</mat-label>
              <input matInput formControlName="name" required>
              <mat-error>Name is required</mat-error>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Father/Husband Name</mat-label>
              <input matInput formControlName="fhName">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Date of Birth</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="dateOfBirth">
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Mobile</mat-label>
              <input matInput formControlName="mobile">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email">
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Designation</mat-label>
              <input matInput formControlName="designation">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>City</mat-label>
              <input matInput formControlName="city">
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>Branch</mat-label>
              <input matInput formControlName="branch">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Share Amount</mat-label>
              <input matInput formControlName="shareAmount" type="number">
            </mat-form-field>
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" (click)="onSave()" [disabled]="!memberForm.valid">
          {{isEditMode ? 'Update' : 'Save'}}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .member-dialog {
      width: 600px;
      max-height: 80vh;
    }

    .member-form {
      padding: 20px 0;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-row mat-form-field {
      flex: 1;
    }

    mat-dialog-actions {
      justify-content: flex-end;
      gap: 8px;
    }
  `]
})
export class MemberFormDialogComponent implements OnInit {
  memberForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private memberService: MemberService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<MemberFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.isEditMode = data.mode === 'edit';
    this.memberForm = this.createForm();
  }

  ngOnInit() {
    if (this.isEditMode && this.data.member) {
      this.memberForm.patchValue(this.data.member);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      memberNo: ['', Validators.required],
      name: ['', Validators.required],
      fhName: [''],
      dateOfBirth: [''],
      mobile: [''],
      email: ['', Validators.email],
      designation: [''],
      city: [''],
      branch: [''],
      shareAmount: [0]
    });
  }

  onSave() {
    if (this.memberForm.valid) {
      const memberData = this.memberForm.value;

      if (this.isEditMode) {
        memberData.id = this.data.member?.id;
        this.memberService.updateMember(memberData.id, memberData).subscribe({
          next: () => {
            this.snackBar.open('Member updated successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.snackBar.open('Error updating member', 'Close', { duration: 3000 });
            console.error('Update error:', error);
          }
        });
      } else {
        this.memberService.createMember(memberData).subscribe({
          next: () => {
            this.snackBar.open('Member created successfully', 'Close', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.snackBar.open('Error creating member', 'Close', { duration: 3000 });
            console.error('Create error:', error);
          }
        });
      }
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}