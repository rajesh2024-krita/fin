
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService, User, UserRole } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
    MatMenuModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Financial Management System';
  currentUser: User | null = null;
  currentUserName = '';
  
  // Menu states
  isMobileSidebarOpen = false;
  isFileMenuOpen = false;
  isSecurityMenuOpen = false;
  isMasterMenuOpen = false;
  isTransactionMenuOpen = false;
  isAccountsMenuOpen = false;
  isReportsMenuOpen = false;
  
  // Theme state
  isDarkMode = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize theme from localStorage
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.applyTheme();
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.currentUserName = user ? `${user.firstName} ${user.lastName}` : 'Guest';
    });

    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (!isLoggedIn && this.router.url !== '/login') {
        this.router.navigate(['/login']);
      }
    });
  }

  // Theme management
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme() {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // Mobile sidebar management
  toggleMobileSidebar() {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  closeMobileSidebar() {
    this.isMobileSidebarOpen = false;
  }

  // Menu toggle methods
  toggleFileMenu() {
    this.isFileMenuOpen = !this.isFileMenuOpen;
  }

  toggleSecurityMenu() {
    this.isSecurityMenuOpen = !this.isSecurityMenuOpen;
  }

  toggleMasterMenu() {
    this.isMasterMenuOpen = !this.isMasterMenuOpen;
  }

  toggleTransactionMenu() {
    this.isTransactionMenuOpen = !this.isTransactionMenuOpen;
  }

  toggleAccountsMenu() {
    this.isAccountsMenuOpen = !this.isAccountsMenuOpen;
  }

  toggleReportsMenu() {
    this.isReportsMenuOpen = !this.isReportsMenuOpen;
  }

  logout() {
    this.authService.logout();
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  isSuperAdmin(): boolean {
    return this.currentUser?.role === UserRole.SUPER_ADMIN;
  }

  isSocietyAdmin(): boolean {
    return this.currentUser?.role === UserRole.SOCIETY_ADMIN;
  }

  isAccountant(): boolean {
    return this.currentUser?.role === UserRole.ACCOUNTANT;
  }

  isMember(): boolean {
    return this.currentUser?.role === UserRole.MEMBER;
  }

  canAccessUserManagement(): boolean {
    return this.authService.hasPermission('users', 'read');
  }

  canCreateUsers(): boolean {
    return this.authService.hasPermission('users', 'create');
  }

  canManageFinancialYear(): boolean {
    return this.isSuperAdmin() || this.isSocietyAdmin();
  }

  canEditOpeningBalance(): boolean {
    return this.isSuperAdmin() || this.isSocietyAdmin() || this.isAccountant();
  }

  canAccessMaster(): boolean {
    return !this.isMember();
  }

  canAccessTransactions(): boolean {
    return !this.isMember();
  }

  canAccessAccounts(): boolean {
    return !this.isMember();
  }

  canAccessReports(): boolean {
    return true; // All users can view reports (with filtered data)
  }

  canAccessAdmin(): boolean {
    return this.isSuperAdmin();
  }

  canAccessBackup(): boolean {
    return this.isSuperAdmin() || this.isSocietyAdmin();
  }

  getUserRoleDisplayName(): string {
    if (!this.currentUser) return '';
    return this.currentUser.role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  }
}
