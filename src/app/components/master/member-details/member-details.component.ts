
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: Date;
  status: 'Active' | 'Inactive' | 'Pending';
  type: 'Regular' | 'Premium' | 'Corporate';
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
    FormsModule
  ],
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'phone', 'joinDate', 'status', 'actions'];
  
  members: Member[] = [
    {
      id: 'M001',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+91 98765 43210',
      joinDate: new Date('2023-01-15'),
      status: 'Active',
      type: 'Regular'
    },
    {
      id: 'M002',
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+91 98765 43211',
      joinDate: new Date('2023-02-20'),
      status: 'Active',
      type: 'Premium'
    },
    {
      id: 'M003',
      name: 'Bob Johnson',
      email: 'bob.johnson@email.com',
      phone: '+91 98765 43212',
      joinDate: new Date('2023-03-10'),
      status: 'Pending',
      type: 'Regular'
    },
    {
      id: 'M004',
      name: 'Alice Brown',
      email: 'alice.brown@email.com',
      phone: '+91 98765 43213',
      joinDate: new Date('2023-04-05'),
      status: 'Inactive',
      type: 'Corporate'
    }
  ];

  ngOnInit() {
    // Component initialization logic
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
      case 'Inactive':
        return 'bg-gradient-to-r from-red-500 to-pink-600 text-white';
      case 'Pending':
        return 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Active':
        return 'check_circle';
      case 'Inactive':
        return 'cancel';
      case 'Pending':
        return 'schedule';
      default:
        return 'help';
    }
  }
}
