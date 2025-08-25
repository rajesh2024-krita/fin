import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MemberService, Member } from '../../../services/member.service';
import { MemberFormDialogComponent } from './member-form-dialog.component';
import { Router } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-member-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule
  ],
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {
  dataSource = new MatTableDataSource<Member>([]);
  displayedColumns: string[] = ['memberNo', 'name', 'mobile', 'status', 'actions'];
  loading: boolean = false; // Added loading state
  allMembers: Member[] = [];
  searchTerm: string = '';

  constructor(
    private memberService: MemberService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    this.loading = true;
    this.memberService.getAllMembers().subscribe({
      next: (members) => {
        this.allMembers = members; // Store all members for filtering
        this.dataSource.data = members;
        this.loading = false;
        console.log('Members loaded:', members); // Kept for debugging
      },
      error: (error) => {
        console.error('Error loading members:', error);
        this.showSnackBar('Error loading members');
        this.loading = false;
      }
    });
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.dataSource.data = this.allMembers;
      return;
    }

    const filtered = this.allMembers.filter(member =>
      member.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      member.memberNo?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      member.mobile?.includes(this.searchTerm)
    );

    this.dataSource.data = filtered;
  }

  openMemberDialog(mode: 'create' | 'edit', member?: Member) {
    const dialogRef = this.dialog.open(MemberFormDialogComponent, {
      width: '600px',
      data: { mode, member }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMembers();
      }
    });
  }

  // Legacy methods for backward compatibility
  openOffCanvas(mode: 'create' | 'edit', member?: Member) {
    this.openMemberDialog(mode, member);
  }

  closeOffCanvas() {
    // This method is no longer needed but kept for compatibility
  }

  onView(member: Member) {
    console.log('Viewing member:', member);
    // Implement view logic - could open a read-only modal
    this.router.navigate(['/member-details-view', member.id]);
  }

  onEdit(member: Member) {
    this.openMemberDialog('edit', member);
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

  private showSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  // Added methods from changes
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewMember(memberId: number) {
    this.router.navigate(['/member-details-view', memberId]);
  }

  deleteMember(memberId: number) {
    if (confirm('Are you sure you want to delete this member?')) {
      this.memberService.deleteMember(memberId).subscribe({
        next: () => {
          this.snackBar.open('Member deleted successfully', 'Close', { duration: 3000 });
          this.loadMembers();
        },
        error: (error) => {
          this.snackBar.open('Error deleting member', 'Close', { duration: 3000 });
          console.error('Delete error:', error);
        }
      });
    }
  }
}