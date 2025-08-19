
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-my-rights',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `<div class="page-container"><h1>My Rights</h1><mat-card><mat-card-content><p>User rights and permissions display.</p></mat-card-content></mat-card></div>`,
  styles: [`    .page-container { max-width: 800px; margin: 0 auto; }  `]
})
export class MyRightsComponent {}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService, User } from '../../../../services/auth.service';

@Component({
  selector: 'app-my-rights',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatChipsModule],
  template: `
    <div class="min-h-screen bg-gray-50 p-4">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h1 class="text-3xl font-bold text-gray-800 mb-6">My Rights & Permissions</h1>
          
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div class="lg:col-span-1">
              <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                <div class="text-center">
                  <mat-icon class="text-6xl mb-4">account_circle</mat-icon>
                  <h2 class="text-xl font-semibold">{{ currentUser?.firstName }} {{ currentUser?.lastName }}</h2>
                  <p class="text-blue-100">{{ getUserRoleDisplayName() }}</p>
                  <p class="text-blue-100 text-sm mt-2">{{ currentUser?.societyName }}</p>
                </div>
              </div>
            </div>
            
            <div class="lg:col-span-2">
              <div class="space-y-4">
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 class="text-lg font-semibold text-green-800 mb-2">Access Level</h3>
                  <mat-chip-set>
                    <mat-chip *ngFor="let access of accessLevels" [class]="getChipClass(access.level)">
                      {{ access.name }}
                    </mat-chip>
                  </mat-chip-set>
                </div>
                
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 class="text-lg font-semibold text-blue-800 mb-2">Module Permissions</h3>
                  <div class="grid grid-cols-2 gap-2">
                    <div *ngFor="let module of modulePermissions" class="flex items-center space-x-2">
                      <mat-icon [class]="module.hasAccess ? 'text-green-500' : 'text-red-500'">
                        {{ module.hasAccess ? 'check_circle' : 'cancel' }}
                      </mat-icon>
                      <span class="text-sm" [class]="module.hasAccess ? 'text-green-700' : 'text-red-700'">
                        {{ module.name }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="space-y-6">
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 class="text-lg font-semibold text-yellow-800 mb-4">Detailed Permissions</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div *ngFor="let permission of detailedPermissions" class="bg-white rounded-lg p-3 border">
                  <h4 class="font-medium text-gray-700 mb-2">{{ permission.category }}</h4>
                  <div class="space-y-1">
                    <div class="flex items-center space-x-2 text-sm">
                      <mat-icon class="text-xs" [class]="permission.read ? 'text-green-500' : 'text-gray-300'">visibility</mat-icon>
                      <span>Read</span>
                    </div>
                    <div class="flex items-center space-x-2 text-sm">
                      <mat-icon class="text-xs" [class]="permission.create ? 'text-blue-500' : 'text-gray-300'">add</mat-icon>
                      <span>Create</span>
                    </div>
                    <div class="flex items-center space-x-2 text-sm">
                      <mat-icon class="text-xs" [class]="permission.update ? 'text-orange-500' : 'text-gray-300'">edit</mat-icon>
                      <span>Update</span>
                    </div>
                    <div class="flex items-center space-x-2 text-sm">
                      <mat-icon class="text-xs" [class]="permission.delete ? 'text-red-500' : 'text-gray-300'">delete</mat-icon>
                      <span>Delete</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MyRightsComponent implements OnInit {
  currentUser: User | null = null;
  accessLevels = [
    { name: 'Dashboard', level: 'full' },
    { name: 'Reports', level: 'read' },
    { name: 'Transactions', level: 'full' },
    { name: 'Admin', level: 'none' }
  ];
  
  modulePermissions = [
    { name: 'Member Details', hasAccess: true },
    { name: 'Deposit Scheme', hasAccess: true },
    { name: 'Loan Management', hasAccess: true },
    { name: 'User Management', hasAccess: false },
    { name: 'Authority Settings', hasAccess: false },
    { name: 'Backup & Restore', hasAccess: false }
  ];
  
  detailedPermissions = [
    { category: 'Master', read: true, create: true, update: true, delete: false },
    { category: 'Transaction', read: true, create: true, update: true, delete: false },
    { category: 'Accounts', read: true, create: true, update: true, delete: false },
    { category: 'Reports', read: true, create: false, update: false, delete: false }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  getUserRoleDisplayName(): string {
    if (!this.currentUser) return '';
    return this.currentUser.role
      .replace('_', ' ')
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  getChipClass(level: string): string {
    switch (level) {
      case 'full': return 'bg-green-100 text-green-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'none': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
