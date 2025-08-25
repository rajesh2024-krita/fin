import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MemberService, Member } from '../../services/member.service';

@Component({
  selector: 'app-member-details-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <div class="d-flex justify-content-between align-items-center">
                <h4 class="card-title">Member Details</h4>
                <div>
                  <button class="btn btn-secondary me-2" (click)="goBack()">
                    <mat-icon>arrow_back</mat-icon>
                    Back
                  </button>
                  <button class="btn btn-primary" (click)="editMember()" *ngIf="member">
                    <mat-icon>edit</mat-icon>
                    Edit
                  </button>
                </div>
              </div>
            </div>

            <div class="card-body" *ngIf="member && !loading">
              <div class="row">
                <div class="col-md-6">
                  <h5>Personal Information</h5>
                  <table class="table table-bordered">
                    <tr>
                      <td><strong>Member Number:</strong></td>
                      <td>{{ member.memberNo }}</td>
                    </tr>
                    <tr>
                      <td><strong>Name:</strong></td>
                      <td>{{ member.name }}</td>
                    </tr>
                    <tr>
                      <td><strong>Father/Husband Name:</strong></td>
                      <td>{{ member.fhName || 'N/A' }}</td>
                    </tr>
                    <tr>
                      <td><strong>Date of Birth:</strong></td>
                      <td>{{ formatDate(member.dateOfBirth) || 'N/A' }}</td>
                    </tr>
                    <tr>
                      <td><strong>Mobile:</strong></td>
                      <td>{{ member.mobile || 'N/A' }}</td>
                    </tr>
                    <tr>
                      <td><strong>Email:</strong></td>
                      <td>{{ member.email || 'N/A' }}</td>
                    </tr>
                  </table>
                </div>

                <div class="col-md-6">
                  <h5>Professional Information</h5>
                  <table class="table table-bordered">
                    <tr>
                      <td><strong>Designation:</strong></td>
                      <td>{{ member.designation || 'N/A' }}</td>
                    </tr>
                    <tr>
                      <td><strong>City:</strong></td>
                      <td>{{ member.city || 'N/A' }}</td>
                    </tr>
                    <tr>
                      <td><strong>Branch:</strong></td>
                      <td>{{ member.branch || 'N/A' }}</td>
                    </tr>
                    <tr>
                      <td><strong>Share Amount:</strong></td>
                      <td>₹{{ member.shareAmount || 0 }}</td>
                    </tr>
                    <tr>
                      <td><strong>Office Address:</strong></td>
                      <td>{{ member.officeAddress || 'N/A' }}</td>
                    </tr>
                    <tr>
                      <td><strong>Residence Address:</strong></td>
                      <td>{{ member.residenceAddress || 'N/A' }}</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>

            <div class="card-body text-center" *ngIf="loading">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-3">Loading member details...</p>
            </div>

            <div class="card-body text-center" *ngIf="!member && !loading">
              <mat-icon class="text-muted display-1">person_off</mat-icon>
              <h5 class="mt-3">Member Not Found</h5>
              <p class="text-muted">The member you're looking for doesn't exist.</p>
              <button class="btn btn-primary" (click)="goBack()">
                Back to Members
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 1200px;
    }

    .card {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border: 1px solid #ddd;
    }

    .card-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid #ddd;
      padding: 15px;
    }

    .card-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .card-body {
      padding: 20px;
    }

    .table {
      margin-bottom: 0;
    }

    .table td {
      padding: 8px 12px;
      vertical-align: top;
    }

    .table td:first-child {
      width: 40%;
      background-color: #f8f9fa;
    }

    .btn {
      border-radius: 4px;
    }

    .me-2 {
      margin-right: 0.5rem;
    }

    .mt-3 {
      margin-top: 1rem;
    }

    .text-muted {
      color: #6c757d;
    }

    .display-1 {
      font-size: 3rem;
    }
  `]
})
export class MemberDetailsViewComponent implements OnInit {
  member: Member | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private memberService: MemberService
  ) {}

  ngOnInit() {
    const memberId = this.route.snapshot.paramMap.get('id');
    if (memberId) {
      this.loadMember(parseInt(memberId));
    }
  }

  loadMember(id: number) {
    this.loading = true;
    this.memberService.getMemberById(id).subscribe({
      next: (member) => {
        this.member = member;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading member:', error);
        this.member = null;
        this.loading = false;
      }
    });
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString();
  }

  goBack() {
    this.router.navigate(['/master/member-details']);
  }

  editMember() {
    if (this.member) {
      this.router.navigate(['/master/member-details'], { 
        queryParams: { edit: this.member.id } 
      });
    }
  }
}