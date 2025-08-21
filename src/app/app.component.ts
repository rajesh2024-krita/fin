
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
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
    MatMenuModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatBottomSheetModule,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-in-out', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ transform: 'translateX(-100%)' }))
      ])
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
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
  isSettingsOpen = false;

  // Theme state
  isDarkMode = false;
  layoutDensity: 'compact' | 'comfortable' = 'comfortable';

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Initialize theme from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      this.isDarkMode = localStorage.getItem('theme') === 'dark';
      this.layoutDensity = (localStorage.getItem('layoutDensity') as 'compact' | 'comfortable') || 'comfortable';
    } else {
      this.isDarkMode = false;
      this.layoutDensity = 'comfortable';
    }
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
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    }
    this.applyTheme();
  }


  private applyTheme() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }

  // Layout density management
  toggleLayoutDensity() {
    this.layoutDensity = this.layoutDensity === 'comfortable' ? 'compact' : 'comfortable';
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('layoutDensity', this.layoutDensity);
    }
  }

  // Settings management
  toggleSettings() {
    this.isSettingsOpen = !this.isSettingsOpen;
  }

  // Mobile sidebar management
  toggleMobileSidebar() {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  closeMobileSidebar() {
    this.isMobileSidebarOpen = false;
  }

  // Check if current route is login page
  isLoginPage(): boolean {
    return this.router.url === '/login';
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

  getSpacingClass(): string {
    return this.layoutDensity === 'compact' ? 'p-2 space-y-1' : 'p-4 space-y-3';
  }
}
