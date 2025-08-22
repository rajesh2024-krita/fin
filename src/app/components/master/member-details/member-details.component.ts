
import { Component, signal } from '@angular/core';
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
    MatIconModule
  ],
  templateUrl: './member-details.component.html',
  styleUrl: './member-details.component.css'
})
export class MemberDetailsComponent {
  generalForm: FormGroup;
  photoBalanceForm: FormGroup;
  deductionForm: FormGroup;
  
  memberPhoto = signal<string | null>(null);
  memberSignature = signal<string | null>(null);

  constructor(private fb: FormBuilder) {
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
      dob: [''],
      dojSociety: [''],
      email: ['', [Validators.email]],
      doj: [''],
      dor: [''],
      nominee: [''],
      nomineeRelation: ['']
    });

    this.photoBalanceForm = this.fb.group({
      share: ['', Validators.required],
      cd: ['', Validators.required],
      bankName: [''],
      payableAt: [''],
      accountNo: [''],
      status: ['Active'],
      date: ['']
    });

    this.deductionForm = this.fb.group({
      share: [''],
      withdrawal: [''],
      gLoanInstalment: [''],
      eLoanInstalment: ['']
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
      const formData = {
        general: this.generalForm.value,
        photoBalance: this.photoBalanceForm.value,
        deduction: this.deductionForm.value,
        photo: this.memberPhoto(),
        signature: this.memberSignature()
      };
      console.log('Member data:', formData);
      // Handle save logic here
    }
  }

  onCancel() {
    this.generalForm.reset();
    this.photoBalanceForm.reset();
    this.deductionForm.reset();
    this.memberPhoto.set(null);
    this.memberSignature.set(null);
  }
}
