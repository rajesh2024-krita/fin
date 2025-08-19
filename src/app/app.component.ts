
import { Component, OnInit, OnDestroy, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Subscription, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
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
    MatDividerModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Financial Management System';
  currentUser: User | null = null;
  currentUserName = '';
  isMobile = false;
  isLoginPage = false;
  isUserLoggedIn = false;
  private subscriptions: Subscription[] = [];
  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    if (this.isBrowser) {
      this.isMobile = window.innerWidth < 768;
    }
  }

  ngOnInit() {
    const userSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.currentUserName = user ? `${user.firstName} ${user.lastName}` : 'Guest';
    });

    const loginSub = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isUserLoggedIn = isLoggedIn;
      if (!isLoggedIn && this.router.url !== '/login') {
        this.router.navigate(['/login']);
      }
    });

    this.subscriptions.push(userSub, loginSub);

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(event => {
        this.isLoginPage = event.url === '/login';
      });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout() {
    this.authService.logout();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
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
    return true;
  }

  canAccessAdmin(): boolean {
    return this.isSuperAdmin();
  }

  canAccessBackup(): boolean {
    return this.isSuperAdmin() || this.isSocietyAdmin();
  }

  getUserRoleDisplayName(): string {
    if (!this.currentUser) return '';
    return this.currentUser.role
      .replace('_', ' ')
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  }
}
