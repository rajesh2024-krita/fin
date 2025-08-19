
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
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {
  memberForm: FormGroup;
  members: Member[] = [];
  filteredMembers: Member[] = [];
  displayedColumns = ['memberNo', 'name', 'mobile', 'branch', 'dojSociety', 'status', 'actions'];
  editingMember: Member | null = null;
  currentMember: Member | null = null;
  nextMemberNo = 1001;
  canCreateMembers = false;
  canEditMembers = false;
  currentUser: any = null;
  photoPreview: string | null = null;
  signaturePreview: string | null = null;
  showMemberForm = false;
  activeTab = 0;
  searchTerm = '';
  statusFilter = 'all';
  
  stats = {
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0
  };

  tabs = [
    { title: 'General' },
    { title: 'Photo & Opening Balance' },
    { title: 'Monthly Deduction' },
    { title: 'Photo' }
  ];
  
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
    this.updateStats();
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
      fhName: ['', Validators.required],
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
      openingBalanceCr: [0],
      bankName: [''],
      payableAt: [''],
      accountNo: [''],
      status: ['active', Validators.required],
      date: [new Date(), Validators.required],
      
      // Monthly Deduction Tab
      deductionShare: [0],
      deductionWithdrawal: [0],
      gLoanInstalment: [0],
      eLoanInstalment: [0]
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

  // Tab navigation methods
  setActiveTab(index: number) {
    this.activeTab = index;
  }

  // File handling methods
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onPhotoDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handlePhotoFile(files[0]);
    }
  }

  onSignatureDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleSignatureFile(files[0]);
    }
  }

  onPhotoSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handlePhotoFile(file);
    }
  }

  onSignatureSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleSignatureFile(file);
    }
  }

  private handlePhotoFile(file: File) {
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      this.snackBar.open('Photo file size should be less than 2MB', 'Close', { duration: 3000 });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.photoPreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  private handleSignatureFile(file: File) {
    if (file.size > 1 * 1024 * 1024) { // 1MB limit
      this.snackBar.open('Signature file size should be less than 1MB', 'Close', { duration: 3000 });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.signaturePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  removePhoto() {
    this.photoPreview = null;
  }

  removeSignature() {
    this.signaturePreview = null;
  }

  // Search and filter methods
  filterMembers() {
    let filtered = this.members;

    // Apply text search
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(term) ||
        member.memberNo.toLowerCase().includes(term) ||
        member.mobile.includes(term) ||
        member.email.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(member => member.status === this.statusFilter);
    }

    this.filteredMembers = filtered;
  }

  setStatusFilter(status: string) {
    this.statusFilter = status;
    this.filterMembers();
  }

  // Update statistics
  updateStats() {
    this.stats.total = this.members.length;
    this.stats.active = this.members.filter(m => m.status === 'active').length;
    this.stats.inactive = this.members.filter(m => m.status === 'inactive').length;
    this.stats.pending = this.members.filter(m => m.status === 'pending').length;
  }

  // Override existing methods to work with new form structure
  openMemberForm() {
    this.resetForm();
    this.showMemberForm = true;
  }

  closeMemberForm() {
    this.showMemberForm = false;
    this.resetForm();
  }

  editMember(member: Member) {
    this.currentMember = member;
    this.editingMember = member;
    this.memberForm.patchValue({
      memberNo: member.memberNo,
      name: member.name,
      fhName: member.fatherHusbandName,
      mobile: member.mobile,
      email: member.email,
      branch: member.branch,
      phoneOffice: member.phoneOffice,
      phoneResidence: member.phoneResidence,
      designation: member.designation,
      officeAddress: member.officeAddress,
      residenceAddress: member.residenceAddress,
      city: member.city,
      dob: member.dob,
      dojSociety: member.dojSociety,
      doj: member.doj,
      dor: member.dor,
      nominee: member.nominee,
      nomineeRelation: member.nomineeRelation,
      openingBalanceShare: member.openingBalanceShare,
      openingBalanceCr: member.openingBalanceCR,
      bankName: member.bankName,
      payableAt: member.bankPayableAt,
      accountNo: member.bankAccountNo,
      status: member.status,
      date: member.statusDate,
      deductionShare: member.deductionShare,
      deductionWithdrawal: member.deductionWithdrawal,
      gLoanInstalment: member.deductionGLoanInstalment,
      eLoanInstalment: member.deductionELoanInstalment
    });
    this.photoPreview = member.photo;
    this.signaturePreview = member.signature;
    this.showMemberForm = true;
  }

  saveMember() {
    if (this.memberForm.valid) {
      const formValue = this.memberForm.value;
      
      if (this.editingMember) {
        // Update existing member
        const index = this.members.findIndex(m => m.id === this.editingMember!.id);
        this.members[index] = { 
          ...this.editingMember,
          memberNo: formValue.memberNo,
          name: formValue.name,
          fatherHusbandName: formValue.fhName,
          mobile: formValue.mobile,
          email: formValue.email,
          branch: formValue.branch,
          phoneOffice: formValue.phoneOffice,
          phoneResidence: formValue.phoneResidence,
          designation: formValue.designation,
          officeAddress: formValue.officeAddress,
          residenceAddress: formValue.residenceAddress,
          city: formValue.city,
          dob: formValue.dob,
          dojSociety: formValue.dojSociety,
          doj: formValue.doj,
          dor: formValue.dor,
          nominee: formValue.nominee,
          nomineeRelation: formValue.nomineeRelation,
          openingBalanceShare: formValue.openingBalanceShare,
          openingBalanceCR: formValue.openingBalanceCr,
          bankName: formValue.bankName,
          bankPayableAt: formValue.payableAt,
          bankAccountNo: formValue.accountNo,
          status: formValue.status,
          statusDate: formValue.date,
          deductionShare: formValue.deductionShare,
          deductionWithdrawal: formValue.deductionWithdrawal,
          deductionGLoanInstalment: formValue.gLoanInstalment,
          deductionELoanInstalment: formValue.eLoanInstalment,
          photo: this.photoPreview,
          signature: this.signaturePreview
        };
        this.snackBar.open('Member updated successfully', 'Close', { duration: 3000 });
      } else {
        // Add new member
        const newMember: Member = {
          id: Date.now(),
          memberNo: formValue.memberNo,
          name: formValue.name,
          fatherHusbandName: formValue.fhName,
          mobile: formValue.mobile,
          email: formValue.email,
          branch: formValue.branch,
          phoneOffice: formValue.phoneOffice,
          phoneResidence: formValue.phoneResidence,
          designation: formValue.designation,
          officeAddress: formValue.officeAddress,
          residenceAddress: formValue.residenceAddress,
          city: formValue.city,
          dob: formValue.dob,
          dojSociety: formValue.dojSociety,
          doj: formValue.doj,
          dor: formValue.dor,
          nominee: formValue.nominee,
          nomineeRelation: formValue.nomineeRelation,
          openingBalanceShare: formValue.openingBalanceShare,
          openingBalanceCR: formValue.openingBalanceCr,
          bankName: formValue.bankName,
          bankPayableAt: formValue.payableAt,
          bankAccountNo: formValue.accountNo,
          status: formValue.status,
          statusDate: formValue.date,
          deductionShare: formValue.deductionShare,
          deductionWithdrawal: formValue.deductionWithdrawal,
          deductionGLoanInstalment: formValue.gLoanInstalment,
          deductionELoanInstalment: formValue.eLoanInstalment,
          photo: this.photoPreview,
          signature: this.signaturePreview
        };
        this.members.push(newMember);
        this.nextMemberNo++;
        this.snackBar.open('Member added successfully', 'Close', { duration: 3000 });
      }
      
      this.updateStats();
      this.filterMembers();
      this.closeMemberForm();
    }
  }

  resetForm() {
    this.currentMember = null;
    this.editingMember = null;
    this.memberForm.reset();
    this.photoPreview = null;
    this.signaturePreview = null;
    this.activeTab = 0;
    this.memberForm.patchValue({
      dojSociety: new Date(),
      doj: new Date(),
      date: new Date(),
      status: 'active',
      openingBalanceShare: 0,
      openingBalanceCr: 0,
      deductionShare: 0,
      deductionWithdrawal: 0,
      gLoanInstalment: 0,
      eLoanInstalment: 0
    });
    this.generateMemberNo();
  }
}
