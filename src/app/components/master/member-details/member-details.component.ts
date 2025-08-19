import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

interface Member {
  id: number;
  membershipId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  category: 'regular' | 'premium' | 'staff';
  status: 'active' | 'inactive' | 'pending';
  joinDate: Date;
  balance: number;
  documents: string[];
}

@Component({
  selector: 'app-member-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule
  ],
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {
  loading = true;
  members: Member[] = [];
  filteredMembers: Member[] = [];

  // Filters
  searchTerm = '';
  statusFilter = '';
  categoryFilter = '';

  // Statistics
  totalMembers = 0;
  activeMembers = 0;
  pendingMembers = 0;
  totalBalance = 0;

  // Table configuration
  displayedColumns: string[] = ['membershipId', 'name', 'phone', 'category', 'joinDate', 'balance', 'status', 'actions'];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    this.loading = true;

    // Simulate API call
    setTimeout(() => {
      this.members = this.generateSampleMembers();
      this.filteredMembers = [...this.members];
      this.calculateStatistics();
      this.loading = false;
    }, 1000);
  }

  generateSampleMembers(): Member[] {
    const sampleMembers: Member[] = [];
    const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emma', 'Chris', 'Lisa', 'Tom', 'Anna'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const categories: ('regular' | 'premium' | 'staff')[] = ['regular', 'premium', 'staff'];
    const statuses: ('active' | 'inactive' | 'pending')[] = ['active', 'inactive', 'pending'];

    for (let i = 1; i <= 50; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

      sampleMembers.push({
        id: i,
        membershipId: `MEM${i.toString().padStart(4, '0')}`,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
        phone: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        address: `${Math.floor(Math.random() * 999) + 1} Sample Street, City, State`,
        category: categories[Math.floor(Math.random() * categories.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        balance: Math.floor(Math.random() * 100000) + 5000,
        documents: ['aadhar.pdf', 'pan.pdf', 'photo.jpg']
      });
    }

    return sampleMembers;
  }

  calculateStatistics() {
    this.totalMembers = this.members.length;
    this.activeMembers = this.members.filter(m => m.status === 'active').length;
    this.pendingMembers = this.members.filter(m => m.status === 'pending').length;
    this.totalBalance = this.members.reduce((sum, m) => sum + m.balance, 0);
  }

  applyFilter() {
    this.filteredMembers = this.members.filter(member => {
      const matchesSearch = !this.searchTerm || 
        member.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        member.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        member.membershipId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        member.phone.includes(this.searchTerm) ||
        member.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = !this.statusFilter || member.status === this.statusFilter;
      const matchesCategory = !this.categoryFilter || member.category === this.categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }

  resetFilters() {
    this.searchTerm = '';
    this.statusFilter = '';
    this.categoryFilter = '';
    this.filteredMembers = [...this.members];
  }

  openAddDialog() {
    this.snackBar.open('Add Member dialog would open here', 'Close', { duration: 3000 });
  }

  viewMember(member: Member) {
    this.snackBar.open(`Viewing details for ${member.firstName} ${member.lastName}`, 'Close', { duration: 3000 });
  }

  editMember(member: Member) {
    this.snackBar.open(`Editing ${member.firstName} ${member.lastName}`, 'Close', { duration: 3000 });
  }

  deleteMember(member: Member) {
    if (confirm(`Are you sure you want to delete ${member.firstName} ${member.lastName}?`)) {
      this.members = this.members.filter(m => m.id !== member.id);
      this.applyFilter();
      this.calculateStatistics();
      this.snackBar.open('Member deleted successfully', 'Close', { duration: 3000 });
    }
  }

  printMemberCard(member: Member) {
    this.snackBar.open(`Printing membership card for ${member.firstName} ${member.lastName}`, 'Close', { duration: 3000 });
  }
}