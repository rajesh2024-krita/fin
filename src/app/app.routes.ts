import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { UserRole } from './services/auth.service';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'unauthorized', 
    loadComponent: () => import('./components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },

  // File Menu Routes
  {
    path: 'file/society',
    loadComponent: () => import('./components/file/society/society.component').then(m => m.SocietyComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.SUPER_ADMIN, UserRole.SOCIETY_ADMIN] }
  },
  {
    path: 'file/create-new-year',
    loadComponent: () => import('./components/file/create-new-year/create-new-year.component').then(m => m.CreateNewYearComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.SUPER_ADMIN, UserRole.SOCIETY_ADMIN] }
  },
  {
    path: 'file/edit-opening-balance',
    loadComponent: () => import('./components/file/edit-opening-balance/edit-opening-balance.component').then(m => m.EditOpeningBalanceComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.SUPER_ADMIN, UserRole.SOCIETY_ADMIN, UserRole.ACCOUNTANT] }
  },

  // Security Routes
  {
    path: 'file/security/authority',
    loadComponent: () => import('./components/file/security/authority/authority.component').then(m => m.AuthorityComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.SUPER_ADMIN] }
  },
  {
    path: 'file/security/new-user',
    loadComponent: () => import('./components/file/security/new-user/new-user.component').then(m => m.NewUserComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.SUPER_ADMIN, UserRole.SOCIETY_ADMIN] }
  },
  {
    path: 'file/security/my-rights',
    loadComponent: () => import('./components/file/security/my-rights/my-rights.component').then(m => m.MyRightsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'file/security/change-password',
    loadComponent: () => import('./components/file/security/change-password/change-password.component').then(m => m.ChangePasswordComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'file/security/retrieve-password',
    loadComponent: () => import('./components/file/security/retrieve-password/retrieve-password.component').then(m => m.RetrievePasswordComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.SUPER_ADMIN] }
  },
  {
    path: 'file/security/admin-handover',
    loadComponent: () => import('./components/file/security/admin-handover/admin-handover.component').then(m => m.AdminHandoverComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.SUPER_ADMIN] }
  },

  // Master Routes
  {
    path: 'master/member-details',
    loadComponent: () => import('./components/master/member-details/member-details.component').then(m => m.MemberDetailsComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.SUPER_ADMIN, UserRole.SOCIETY_ADMIN, UserRole.ACCOUNTANT] }
  },
  {
    path: 'master/deposit-scheme',
    loadComponent: () => import('./components/master/deposit-scheme/deposit-scheme.component').then(m => m.DepositSchemeComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.SUPER_ADMIN, UserRole.SOCIETY_ADMIN, UserRole.ACCOUNTANT] }
  },
  {
    path: 'master/interest-master',
    loadComponent: () => import('./components/master/interest-master/interest-master.component').then(m => m.InterestMasterComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.SUPER_ADMIN, UserRole.SOCIETY_ADMIN, UserRole.ACCOUNTANT] }
  },
  {
    path: 'master/table',
    loadComponent: () => import('./components/master/table/table.component').then(m => m.TableComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.SUPER_ADMIN, UserRole.SOCIETY_ADMIN, UserRole.ACCOUNTANT] }
  },

  // User Management
  {
    path: 'user-management',
    loadComponent: () => import('./components/user-management/user-management.component').then(m => m.UserManagementComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.SUPER_ADMIN, UserRole.SOCIETY_ADMIN] }
  },

  // Admin Routes
  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.SUPER_ADMIN] }
  },

  // Backup Routes
  {
    path: 'backup',
    loadComponent: () => import('./components/backup/backup.component').then(m => m.BackupComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserRole.SUPER_ADMIN, UserRole.SOCIETY_ADMIN] }
  },

  // Catch all route
  { path: '**', redirectTo: '/dashboard' }
];