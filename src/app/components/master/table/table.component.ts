
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `<div class="page-container"><h1>Table Management</h1><mat-card><mat-card-content><p>Data table configuration and management.</p></mat-card-content></mat-card></div>`,
  styles: [`    .page-container { max-width: 800px; margin: 0 auto; }  `]
})
export class TableComponent {}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-gray-50 p-4">
      <div class="max-w-6xl mx-auto">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h1 class="text-3xl font-bold text-gray-800 mb-6">Table Management</h1>
          <p class="text-gray-600 mb-6">Manage and configure system tables and data structures.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <mat-icon class="text-blue-600 text-3xl mb-3">table_chart</mat-icon>
              <h3 class="text-lg font-semibold text-blue-800 mb-2">Member Tables</h3>
              <p class="text-blue-600 text-sm mb-4">Configure member data tables and relationships</p>
              <button mat-raised-button color="primary" class="w-full">Manage</button>
            </div>
            
            <div class="bg-green-50 border border-green-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <mat-icon class="text-green-600 text-3xl mb-3">account_balance</mat-icon>
              <h3 class="text-lg font-semibold text-green-800 mb-2">Financial Tables</h3>
              <p class="text-green-600 text-sm mb-4">Manage deposit and loan table structures</p>
              <button mat-raised-button color="primary" class="w-full">Manage</button>
            </div>
            
            <div class="bg-purple-50 border border-purple-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <mat-icon class="text-purple-600 text-3xl mb-3">settings</mat-icon>
              <h3 class="text-lg font-semibold text-purple-800 mb-2">System Tables</h3>
              <p class="text-purple-600 text-sm mb-4">Configure system configuration tables</p>
              <button mat-raised-button color="primary" class="w-full">Manage</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TableComponent {}
