
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-society',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="page-container">
      <h1>Society Management</h1>
      <mat-card>
        <mat-card-content>
          <p>Society configuration and management features will be implemented here.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container { max-width: 800px; margin: 0 auto; }
  `]
})
export class SocietyComponent {}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-society',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 p-4">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h1 class="text-3xl font-bold text-gray-800 mb-6">Society Management</h1>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
              <h2 class="text-xl font-semibold mb-4">Society Information</h2>
              <form [formGroup]="societyForm" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium mb-2">Society Name</label>
                  <input formControlName="name" class="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50" placeholder="Enter society name">
                </div>
                <div>
                  <label class="block text-sm font-medium mb-2">Registration Number</label>
                  <input formControlName="regNumber" class="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50" placeholder="Enter registration number">
                </div>
                <div>
                  <label class="block text-sm font-medium mb-2">Address</label>
                  <textarea formControlName="address" rows="3" class="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50" placeholder="Enter society address"></textarea>
                </div>
                <button type="submit" class="w-full bg-white text-purple-600 font-semibold py-2 px-4 rounded-md hover:bg-gray-100 transition duration-200">
                  Update Society Info
                </button>
              </form>
            </div>
            
            <div class="space-y-6">
              <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-green-800 mb-2">Financial Year</h3>
                <p class="text-green-600">Current Year: 2024-2025</p>
                <p class="text-green-600">Status: Active</p>
              </div>
              
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-blue-800 mb-2">Member Statistics</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-blue-600">150</div>
                    <div class="text-sm text-blue-500">Total Members</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-blue-600">25</div>
                    <div class="text-sm text-blue-500">New This Month</div>
                  </div>
                </div>
              </div>
              
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 class="text-lg font-semibold text-yellow-800 mb-2">Quick Actions</h3>
                <div class="space-y-2">
                  <button class="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-200">
                    Generate Reports
                  </button>
                  <button class="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-200">
                    Backup Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SocietyComponent {
  societyForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.societyForm = this.fb.group({
      name: ['ABC Credit Society', Validators.required],
      regNumber: ['SOC/2024/001', Validators.required],
      address: ['123 Main Street, City, State - 123456', Validators.required]
    });
  }
}
