
import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snackbar';
import { MemberService, Member } from '../../../services/member.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-member-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './member-details.component.html',
  styleUrl: './member-details.component.css'
})
export class MemberDetailsComponent implements OnInit {
  generalForm: FormGroup;
  photoBalanceForm: FormGroup;
  deductionForm: FormGroup;
  
  memberPhoto = signal<string | null>(null);
  memberSignature = signal<string | null>(null);
  members = signal<Member[]>([]);
  currentMember = signal<Member | null>(null);
  isEditMode = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  displayedColumns: string[] = ['memberNo', 'name', 'email', 'mobile', 'status', 'actions'];

  constructor(
    private fb: FormBuilder,
    private memberService: MemberService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.generalForm = this.fb.group({
      memberNo: ['', Validators.required],
      name: ['', Validators.required],
      fhName: ['', Validators.required],
      officeAddress: [''],
      city: [''],
      phoneOffice: [''],
      branch: [''],
      phoneResidence: [''],
      designation: [''],
      mobile: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      residenceAddress: [''],
      dateOfBirth: [''],
      dojSociety: [''],
      email: ['', [Validators.email]],
      dojJob: [''],
      doRetirement: [''],
      nominee: [''],
      nomineeRelation: ['']
    });

    this.photoBalanceForm = this.fb.group({
      shareAmount: [0, [Validators.required, Validators.min(0)]],
      cdAmount: [0, [Validators.required, Validators.min(0)]],
      bankName: [''],
      payableAt: [''],
      accountNo: [''],
      status: ['Active'],
      date: ['']
    });

    this.deductionForm = this.fb.group({
      shareDeduction: [0],
      withdrawal: [0],
      gLoanInstalment: [0],
      eLoanInstalment: [0]
    });
  }

  ngOnInit() {
    this.loadMembers();
    
    // Check if editing existing member
    const memberId = this.route.snapshot.paramMap.get('id');
    if (memberId) {
      this.loadMemberForEdit(parseInt(memberId));
    }
  }

  loadMembers() {
    this.isLoading.set(true);
    this.memberService.getAllMembers().subscribe({
      next: (members) => {
        this.members.set(members);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading members:', error);
        this.showSnackBar('Error loading members');
        this.isLoading.set(false);
      }
    });
  }

  loadMemberForEdit(id: number) {
    this.memberService.getMemberById(id).subscribe({
      next: (member) => {
        this.currentMember.set(member);
        this.isEditMode.set(true);
        this.populateForm(member);
      },
      error: (error) => {
        console.error('Error loading member:', error);
        this.showSnackBar('Error loading member for edit');
      }
    });
  }

  populateForm(member: Member) {
    this.generalForm.patchValue({
      memberNo: member.memberNo,
      name: member.name,
      fhName: member.fhName,
      officeAddress: member.officeAddress,
      city: member.city,
      phoneOffice: member.phoneOffice,
      branch: member.branch,
      phoneResidence: member.phoneResidence,
      designation: member.designation,
      mobile: member.mobile,
      residenceAddress: member.residenceAddress,
      dateOfBirth: member.dateOfBirth,
      dojSociety: member.dojSociety,
      email: member.email,
      dojJob: member.dojJob,
      doRetirement: member.doRetirement,
      nominee: member.nominee,
      nomineeRelation: member.nomineeRelation
    });

    this.photoBalanceForm.patchValue({
      shareAmount: member.shareAmount,
      cdAmount: member.cdAmount,
      bankName: member.bankName,
      payableAt: member.payableAt,
      accountNo: member.accountNo,
      status: member.status,
      date: member.date
    });

    this.deductionForm.patchValue({
      shareDeduction: member.shareDeduction,
      withdrawal: member.withdrawal,
      gLoanInstalment: member.gLoanInstalment,
      eLoanInstalment: member.eLoanInstalment
    });
  }

  onFileSelected(event: any, type: 'photo' | 'signature') {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'photo') {
          this.memberPhoto.set(result);
        } else {
          this.memberSignature.set(result);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onSave() {
    if (this.generalForm.valid && this.photoBalanceForm.valid) {
      const memberData: Member = {
        ...this.generalForm.value,
        ...this.photoBalanceForm.value,
        ...this.deductionForm.value,
        photoPath: this.memberPhoto(),
        signaturePath: this.memberSignature()
      };

      this.isLoading.set(true);

      if (this.isEditMode() && this.currentMember()) {
        // Update existing member
        this.memberService.updateMember(this.currentMember()!.id!, memberData).subscribe({
          next: (updatedMember) => {
            this.showSnackBar('Member updated successfully');
            this.loadMembers();
            this.resetForm();
            this.isLoading.set(false);
          },
          error: (error) => {
            console.error('Error updating member:', error);
            this.showSnackBar('Error updating member');
            this.isLoading.set(false);
          }
        });
      } else {
        // Create new member
        this.memberService.createMember(memberData).subscribe({
          next: (newMember) => {
            this.showSnackBar('Member created successfully');
            this.loadMembers();
            this.resetForm();
            this.isLoading.set(false);
          },
          error: (error) => {
            console.error('Error creating member:', error);
            this.showSnackBar('Error creating member');
            this.isLoading.set(false);
          }
        });
      }
    } else {
      this.showSnackBar('Please fill all required fields correctly');
    }
  }

  onEdit(member: Member) {
    this.currentMember.set(member);
    this.isEditMode.set(true);
    this.populateForm(member);
    this.showSnackBar('Member loaded for editing');
  }

  onDelete(member: Member) {
    if (confirm(`Are you sure you want to delete member ${member.name}?`)) {
      this.memberService.deleteMember(member.id!).subscribe({
        next: () => {
          this.showSnackBar('Member deleted successfully');
          this.loadMembers();
        },
        error: (error) => {
          console.error('Error deleting member:', error);
          this.showSnackBar('Error deleting member');
        }
      });
    }
  }

  onCancel() {
    this.resetForm();
  }

  resetForm() {
    this.generalForm.reset();
    this.photoBalanceForm.reset();
    this.deductionForm.reset();
    this.memberPhoto.set(null);
    this.memberSignature.set(null);
    this.currentMember.set(null);
    this.isEditMode.set(false);
    
    // Reset to default values
    this.photoBalanceForm.patchValue({
      shareAmount: 0,
      cdAmount: 0,
      status: 'Active'
    });
  }

  private showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
