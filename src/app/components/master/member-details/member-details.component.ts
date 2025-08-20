
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
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AuthService, UserRole } from '../../../services/auth.service';

interface Member {
  id: number;
  memberNo: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  society: string;
  joinDate: Date;
  status: string;
  address?: string;
  city?: string;
  state?: string;
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
    MatTooltipModule
  ],
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {
  memberForm: FormGroup;
  members: Member[] = [];
  filteredMembers: Member[] = [];
  editingMember: Member | null = null;
  nextMemberNo = 1001;
  showMemberForm = false;
  
  // Filter properties
  searchTerm = '';
  selectedRole = '';
  selectedSociety = '';
  selectedStatus = '';
  
  // Permission properties
  canCreateMembers = false;
  canEditMembers = false;
  canDeleteMembers = false;
  currentUser: any = null;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
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
    const userRole = this.currentUser?.role;
    
    // Super Admin and Society Admin can create and edit members
    this.canCreateMembers = userRole === UserRole.SUPER_ADMIN || userRole === UserRole.SOCIETY_ADMIN;
    this.canEditMembers = userRole === UserRole.SUPER_ADMIN || userRole === UserRole.SOCIETY_ADMIN;
    
    // Only Super Admin can delete members
    this.canDeleteMembers = userRole === UserRole.SUPER_ADMIN;
  }

  createForm(): FormGroup {
    return this.fb.group({
      memberNo: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      role: ['', Validators.required],
      society: ['', Validators.required],
      joinDate: [new Date(), Validators.required],
      status: ['Active', Validators.required],
      address: [''],
      city: [''],
      state: ['']
    });
  }

  generateMemberNo() {
    this.memberForm.patchValue({
      memberNo: `MEM${this.nextMemberNo.toString().padStart(4, '0')}`
    });
  }

  loadSampleData() {
    this.members = [
      {
        id: 1,
        memberNo: 'MEM1001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '9876543210',
        role: 'Member',
        society: 'Main Branch',
        joinDate: new Date('2024-01-15'),
        status: 'Active',
        address: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra'
      },
      {
        id: 2,
        memberNo: 'MEM1002',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@email.com',
        phone: '9876543211',
        role: 'Executive',
        society: 'North Branch',
        joinDate: new Date('2024-02-20'),
        status: 'Active',
        address: '456 Oak Avenue',
        city: 'Delhi',
        state: 'Delhi'
      },
      {
        id: 3,
        memberNo: 'MEM1003',
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@email.com',
        phone: '9876543212',
        role: 'Board Member',
        society: 'South Branch',
        joinDate: new Date('2023-12-10'),
        status: 'Inactive',
        address: '789 Pine Road',
        city: 'Bangalore',
        state: 'Karnataka'
      }
    ];
    this.filteredMembers = [...this.members];
    this.nextMemberNo = Math.max(...this.members.map(m => parseInt(m.memberNo.slice(3)))) + 1;
  }

  applyFilters() {
    this.filteredMembers = this.members.filter(member => {
      const searchMatch = !this.searchTerm || 
        member.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        member.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        member.phone.includes(this.searchTerm) ||
        member.memberNo.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const roleMatch = !this.selectedRole || member.role === this.selectedRole;
      const societyMatch = !this.selectedSociety || member.society === this.selectedSociety;
      const statusMatch = !this.selectedStatus || member.status === this.selectedStatus;
      
      return searchMatch && roleMatch && societyMatch && statusMatch;
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedRole = '';
    this.selectedSociety = '';
    this.selectedStatus = '';
    this.filteredMembers = [...this.members];
  }

  getInitials(firstName: string, lastName: string): string {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  openMemberForm() {
    this.resetForm();
    this.showMemberForm = true;
  }

  closeMemberForm() {
    this.showMemberForm = false;
    this.resetForm();
  }

  resetForm() {
    this.editingMember = null;
    this.memberForm.reset();
    this.memberForm.patchValue({
      joinDate: new Date(),
      status: 'Active'
    });
    this.generateMemberNo();
  }

  saveMember() {
    if (this.memberForm.valid) {
      const formValue = this.memberForm.value;
      
      if (this.editingMember) {
        // Update existing member
        const index = this.members.findIndex(m => m.id === this.editingMember!.id);
        this.members[index] = { 
          ...this.editingMember, 
          ...formValue
        };
        this.snackBar.open('Member updated successfully', 'Close', { duration: 3000 });
      } else {
        // Add new member
        const newMember: Member = {
          id: Date.now(),
          ...formValue
        };
        this.members.push(newMember);
        this.nextMemberNo++;
        this.snackBar.open('Member added successfully', 'Close', { duration: 3000 });
      }
      
      this.applyFilters();
      this.closeMemberForm();
    } else {
      this.snackBar.open('Please fill all required fields correctly', 'Close', { duration: 3000 });
    }
  }

  editMember(member: Member) {
    this.editingMember = member;
    this.memberForm.patchValue(member);
    this.showMemberForm = true;
  }

  deleteMember(id: number) {
    if (confirm('Are you sure you want to delete this member?')) {
      this.members = this.members.filter(m => m.id !== id);
      this.applyFilters();
      this.snackBar.open('Member deleted successfully', 'Close', { duration: 3000 });
    }
  }

  viewMember(member: Member) {
    // Navigate to member details page
    this.router.navigate(['/master/member-details', member.id]);
  }

  // Export functions
  exportToCSV() {
    const csvData = this.convertToCSV(this.filteredMembers);
    this.downloadFile(csvData, 'members.csv', 'text/csv');
    this.snackBar.open('Members exported to CSV', 'Close', { duration: 2000 });
  }

  exportToExcel() {
    // For Excel export, we'll use CSV format as a simple implementation
    const csvData = this.convertToCSV(this.filteredMembers);
    this.downloadFile(csvData, 'members.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    this.snackBar.open('Members exported to Excel', 'Close', { duration: 2000 });
  }

  exportToPDF() {
    // Simple PDF export implementation
    const pdfContent = this.convertToPDF(this.filteredMembers);
    this.downloadFile(pdfContent, 'members.pdf', 'application/pdf');
    this.snackBar.open('Members exported to PDF', 'Close', { duration: 2000 });
  }

  private convertToCSV(data: Member[]): string {
    const headers = ['Member No', 'First Name', 'Last Name', 'Email', 'Phone', 'Role', 'Society', 'Join Date', 'Status'];
    const csvContent = [
      headers.join(','),
      ...data.map(member => [
        member.memberNo,
        member.firstName,
        member.lastName,
        member.email,
        member.phone,
        member.role,
        member.society,
        member.joinDate.toLocaleDateString(),
        member.status
      ].join(','))
    ].join('\n');
    
    return csvContent;
  }

  private convertToPDF(data: Member[]): string {
    // Simple text-based PDF content (in real implementation, use a PDF library)
    let content = 'Members Report\n\n';
    content += 'Member No\tFirst Name\tLast Name\tEmail\tPhone\tRole\tSociety\tJoin Date\tStatus\n';
    
    data.forEach(member => {
      content += `${member.memberNo}\t${member.firstName}\t${member.lastName}\t${member.email}\t${member.phone}\t${member.role}\t${member.society}\t${member.joinDate.toLocaleDateString()}\t${member.status}\n`;
    });
    
    return content;
  }

  private downloadFile(content: string, filename: string, contentType: string) {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
