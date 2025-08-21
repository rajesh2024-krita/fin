
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

interface Member {
  id: string;
  name: string;
  fatherName: string;
  email: string;
  phone: string;
  address: string;
  category: 'regular' | 'associate' | 'life';
  status: 'active' | 'inactive' | 'pending';
  joinDate: Date;
}

@Component({
  selector: 'app-member-details',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule,
    FormsModule
  ],
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  displayedColumns: string[] = ['id', 'name', 'contact', 'address', 'category', 'status', 'joinDate', 'actions'];
  dataSource = new MatTableDataSource<Member>([]);
  
  searchTerm = '';
  selectedStatus = '';
  selectedCategory = '';
  
  members: Member[] = [
    {
      id: 'M001',
      name: 'John Doe',
      fatherName: 'Robert Doe',
      email: 'john.doe@email.com',
      phone: '+91 98765 43210',
      address: '123 Main Street, New York, NY 10001',
      category: 'regular',
      status: 'active',
      joinDate: new Date('2023-01-15')
    },
    {
      id: 'M002',
      name: 'Jane Smith',
      fatherName: 'William Smith',
      email: 'jane.smith@email.com',
      phone: '+91 98765 43211',
      address: '456 Oak Avenue, Los Angeles, CA 90210',
      category: 'associate',
      status: 'active',
      joinDate: new Date('2023-02-20')
    },
    {
      id: 'M003',
      name: 'Bob Johnson',
      fatherName: 'Michael Johnson',
      email: 'bob.johnson@email.com',
      phone: '+91 98765 43212',
      address: '789 Pine Road, Chicago, IL 60601',
      category: 'life',
      status: 'pending',
      joinDate: new Date('2023-03-10')
    },
    {
      id: 'M004',
      name: 'Alice Brown',
      fatherName: 'David Brown',
      email: 'alice.brown@email.com',
      phone: '+91 98765 43213',
      address: '321 Elm Street, Houston, TX 77001',
      category: 'regular',
      status: 'inactive',
      joinDate: new Date('2023-04-05')
    },
    {
      id: 'M005',
      name: 'Charlie Wilson',
      fatherName: 'James Wilson',
      email: 'charlie.wilson@email.com',
      phone: '+91 98765 43214',
      address: '654 Maple Drive, Phoenix, AZ 85001',
      category: 'associate',
      status: 'active',
      joinDate: new Date('2024-01-15')
    }
  ];

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.members);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getTotalMembers(): number {
    return this.members.length;
  }

  getActiveMembers(): number {
    return this.members.filter(member => member.status === 'active').length;
  }

  getInactiveMembers(): number {
    return this.members.filter(member => member.status === 'inactive').length;
  }

  getThisMonthMembers(): number {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return this.members.filter(member => {
      const joinDate = new Date(member.joinDate);
      return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
    }).length;
  }

  getInitials(name: string): string {
    return name.split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  getCategoryBadgeClass(category: string): string {
    switch (category) {
      case 'regular':
        return 'badge badge-secondary';
      case 'associate':
        return 'badge badge-info';
      case 'life':
        return 'badge badge-success';
      default:
        return 'badge badge-secondary';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active':
        return 'badge badge-success';
      case 'inactive':
        return 'badge badge-danger';
      case 'pending':
        return 'badge badge-warning';
      default:
        return 'badge badge-secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'active':
        return 'check_circle';
      case 'inactive':
        return 'cancel';
      case 'pending':
        return 'schedule';
      default:
        return 'help';
    }
  }

  getDateFromNow(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return '1 day ago';
    } else if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  }

  filterMembers(): void {
    let filteredMembers = this.members;

    // Filter by search term
    if (this.searchTerm) {
      const searchLower = this.searchTerm.toLowerCase();
      filteredMembers = filteredMembers.filter(member =>
        member.name.toLowerCase().includes(searchLower) ||
        member.id.toLowerCase().includes(searchLower) ||
        member.phone.toLowerCase().includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower)
      );
    }

    // Filter by status
    if (this.selectedStatus) {
      filteredMembers = filteredMembers.filter(member => member.status === this.selectedStatus);
    }

    // Filter by category
    if (this.selectedCategory) {
      filteredMembers = filteredMembers.filter(member => member.category === this.selectedCategory);
    }

    this.dataSource.data = filteredMembers;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.selectedCategory = '';
    this.dataSource.data = this.members;
  }

  openAddMemberDialog(): void {
    console.log('Opening add member dialog...');
    // TODO: Implement add member dialog
  }

  viewMember(member: Member): void {
    console.log('Viewing member:', member);
    // TODO: Navigate to member details view
  }

  editMember(member: Member): void {
    console.log('Editing member:', member);
    // TODO: Implement edit member dialog
  }

  deleteMember(member: Member): void {
    console.log('Deleting member:', member);
    // TODO: Implement delete confirmation dialog
    if (confirm(`Are you sure you want to delete member ${member.name}?`)) {
      this.members = this.members.filter(m => m.id !== member.id);
      this.filterMembers();
    }
  }
}
