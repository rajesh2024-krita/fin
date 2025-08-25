
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MemberService, Member } from '../../services/member.service';

@Component({
  selector: 'app-member-details-view',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule
  ],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div class="max-w-4xl mx-auto space-y-6">
        
        <!-- Header -->
        <div class="flex items-center justify-between">
          <button 
            (click)="goBack()"
            class="inline-flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
          >
            <mat-icon class="mr-2">arrow_back</mat-icon>
            Back to Members
          </button>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-500 dark:text-gray-400">Loading member details...</p>
        </div>

        <!-- Member Details -->
        <div *ngIf="member && !loading">
          <!-- Main Member Card -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <!-- Header -->
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
              <div class="flex items-start justify-between">
                <div class="flex items-center space-x-4">
                  <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-xl font-semibold">
                    {{ getInitials(member.name || '', member.fhName || '') }}
                  </div>
                  <div>
                    <h1 class="text-2xl font-bold">{{ member.name }}</h1>
                    <p class="text-blue-100">{{ member.fhName }}</p>
                    <p class="text-blue-200 text-sm">Member #{{ member.memberNo }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <mat-chip-set>
                    <mat-chip [color]="member.status === 'Active' ? 'primary' : 'warn'">
                      {{ member.status || 'Active' }}
                    </mat-chip>
                  </mat-chip-set>
                  <button 
                    mat-raised-button 
                    color="accent"
                    (click)="editMember()"
                    class="mt-2"
                  >
                    <mat-icon>edit</mat-icon>
                    Edit Member
                  </button>
                </div>
              </div>
            </div>

            <!-- Tab Content -->
            <mat-tab-group class="p-6">
              <!-- Personal Information -->
              <mat-tab label="Personal Info">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</label>
                    <p class="text-gray-900 dark:text-white">{{ formatDate(member.dateOfBirth) || 'Not provided' }}</p>
                  </div>
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Mobile</label>
                    <p class="text-gray-900 dark:text-white">{{ member.mobile || 'Not provided' }}</p>
                  </div>
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                    <p class="text-gray-900 dark:text-white">{{ member.email || 'Not provided' }}</p>
                  </div>
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Designation</label>
                    <p class="text-gray-900 dark:text-white">{{ member.designation || 'Not provided' }}</p>
                  </div>
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-500 dark:text-gray-400">City</label>
                    <p class="text-gray-900 dark:text-white">{{ member.city || 'Not provided' }}</p>
                  </div>
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Branch</label>
                    <p class="text-gray-900 dark:text-white">{{ member.branch || 'Not provided' }}</p>
                  </div>
                </div>
              </mat-tab>

              <!-- Contact Information -->
              <mat-tab label="Contact Info">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  <div class="space-y-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Office Details</h3>
                    <div class="space-y-1">
                      <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Office Address</label>
                      <p class="text-gray-900 dark:text-white">{{ member.officeAddress || 'Not provided' }}</p>
                    </div>
                    <div class="space-y-1">
                      <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Office Phone</label>
                      <p class="text-gray-900 dark:text-white">{{ member.phoneOffice || 'Not provided' }}</p>
                    </div>
                  </div>
                  <div class="space-y-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Residence Details</h3>
                    <div class="space-y-1">
                      <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Residence Address</label>
                      <p class="text-gray-900 dark:text-white">{{ member.residenceAddress || 'Not provided' }}</p>
                    </div>
                    <div class="space-y-1">
                      <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Residence Phone</label>
                      <p class="text-gray-900 dark:text-white">{{ member.phoneResidence || 'Not provided' }}</p>
                    </div>
                  </div>
                </div>
              </mat-tab>

              <!-- Financial Information -->
              <mat-tab label="Financial Info">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Share Amount</label>
                    <p class="text-gray-900 dark:text-white text-lg font-semibold">₹{{ member.shareAmount || 0 }}</p>
                  </div>
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-500 dark:text-gray-400">CD Amount</label>
                    <p class="text-gray-900 dark:text-white text-lg font-semibold">₹{{ member.cdAmount || 0 }}</p>
                  </div>
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Bank Name</label>
                    <p class="text-gray-900 dark:text-white">{{ member.bankName || 'Not provided' }}</p>
                  </div>
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Account No</label>
                    <p class="text-gray-900 dark:text-white">{{ member.accountNo || 'Not provided' }}</p>
                  </div>
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Payable At</label>
                    <p class="text-gray-900 dark:text-white">{{ member.payableAt || 'Not provided' }}</p>
                  </div>
                </div>
              </mat-tab>

              <!-- Employment & Dates -->
              <mat-tab label="Employment">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Joining Job</label>
                    <p class="text-gray-900 dark:text-white">{{ formatDate(member.dojJob) || 'Not provided' }}</p>
                  </div>
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Retirement</label>
                    <p class="text-gray-900 dark:text-white">{{ formatDate(member.doRetirement) || 'Not provided' }}</p>
                  </div>
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Joining Society</label>
                    <p class="text-gray-900 dark:text-white">{{ formatDate(member.dojSociety) || 'Not provided' }}</p>
                  </div>
                </div>
              </mat-tab>

              <!-- Nominee Information -->
              <mat-tab label="Nominee">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Nominee Name</label>
                    <p class="text-gray-900 dark:text-white">{{ member.nominee || 'Not provided' }}</p>
                  </div>
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Nominee Relation</label>
                    <p class="text-gray-900 dark:text-white">{{ member.nomineeRelation || 'Not provided' }}</p>
                  </div>
                </div>
              </mat-tab>
            </mat-tab-group>
          </div>
        </div>

        <!-- Member Not Found -->
        <div *ngIf="!member && !loading" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <mat-icon class="text-6xl text-gray-400 dark:text-gray-500 mb-4">person_off</mat-icon>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Member Not Found</h3>
          <p class="text-gray-500 dark:text-gray-400 mb-4">The member you're looking for doesn't exist or has been removed.</p>
          <button 
            (click)="goBack()"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            Back to Members
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
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
    return dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  getInitials(name: string, fhName: string): string {
    const nameInitial = name ? name.charAt(0).toUpperCase() : '';
    const fhNameInitial = fhName ? fhName.charAt(0).toUpperCase() : '';
    return nameInitial + fhNameInitial || 'M';
  }

  goBack() {
    this.router.navigate(['/master/member-details']);
  }

  editMember() {
    // Navigate back to member list with edit mode
    this.router.navigate(['/master/member-details'], { 
      queryParams: { edit: this.member?.id } 
    });
  }
}
