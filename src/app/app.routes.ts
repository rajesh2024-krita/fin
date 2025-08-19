
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent) },
  
  // Protected routes
  { 
    path: 'dashboard', 
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  
  // User Management
  { 
    path: 'user-management', 
    loadComponent: () => import('./components/user-management/user-management.component').then(m => m.UserManagementComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN', 'SOCIETY_ADMIN'] }
  },
  
  // File Menu Routes
  { 
    path: 'file/society', 
    loadComponent: () => import('./components/file/society/society.component').then(m => m.SocietyComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'file/security/authority', 
    loadComponent: () => import('./components/file/security/authority/authority.component').then(m => m.AuthorityComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN'] }
  },
  { 
    path: 'file/security/my-rights', 
    loadComponent: () => import('./components/file/security/my-rights/my-rights.component').then(m => m.MyRightsComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'file/security/new-user', 
    loadComponent: () => import('./components/file/security/new-user/new-user.component').then(m => m.NewUserComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN', 'SOCIETY_ADMIN'] }
  },
  { 
    path: 'file/security/retrieve-password', 
    loadComponent: () => import('./components/file/security/retrieve-password/retrieve-password.component').then(m => m.RetrievePasswordComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'file/security/change-password', 
    loadComponent: () => import('./components/file/security/change-password/change-password.component').then(m => m.ChangePasswordComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'file/security/admin-handover', 
    loadComponent: () => import('./components/file/security/admin-handover/admin-handover.component').then(m => m.AdminHandoverComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN'] }
  },
  { 
    path: 'file/create-new-year', 
    loadComponent: () => import('./components/file/create-new-year/create-new-year.component').then(m => m.CreateNewYearComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN', 'SOCIETY_ADMIN'] }
  },
  { 
    path: 'file/edit-opening-balance', 
    loadComponent: () => import('./components/file/edit-opening-balance/edit-opening-balance.component').then(m => m.EditOpeningBalanceComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN', 'SOCIETY_ADMIN', 'ACCOUNTANT'] }
  },
  
  // Master Menu Routes
  { 
    path: 'master/member-details', 
    loadComponent: () => import('./components/master/member-details/member-details.component').then(m => m.MemberDetailsComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN', 'SOCIETY_ADMIN', 'ACCOUNTANT'] }
  },
  { 
    path: 'master/table', 
    loadComponent: () => import('./components/master/table/table.component').then(m => m.TableComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN', 'SOCIETY_ADMIN', 'ACCOUNTANT'] }
  },
  { 
    path: 'master/deposit-scheme', 
    loadComponent: () => import('./components/master/deposit-scheme/deposit-scheme.component').then(m => m.DepositSchemeComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN', 'SOCIETY_ADMIN'] }
  },
  { 
    path: 'master/interest-master', 
    loadComponent: () => import('./components/master/interest-master/interest-master.component').then(m => m.InterestMasterComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN', 'SOCIETY_ADMIN'] }
  },
  
  // Transaction Menu Routes
  { 
    path: 'transaction/loan-taken', 
    loadComponent: () => import('./components/transaction/loan-taken/loan-taken.component').then(m => m.LoanTakenComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN', 'SOCIETY_ADMIN', 'ACCOUNTANT'] }
  },
  { 
    path: 'transaction/demand-process', 
    loadComponent: () => import('./components/transaction/demand-process/demand-process.component').then(m => m.DemandProcessComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN', 'SOCIETY_ADMIN', 'ACCOUNTANT'] }
  },
  { 
    path: 'transaction/account-closure', 
    loadComponent: () => import('./components/transaction/account-closure/account-closure.component').then(m => m.AccountClosureComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN', 'SOCIETY_ADMIN'] }
  },
  { 
    path: 'transaction/deposit-receipt', 
    loadComponent: () => import('./components/transaction/deposit-receipt/deposit-receipt.component').then(m => m.DepositReceiptComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN', 'SOCIETY_ADMIN', 'ACCOUNTANT'] }
  },
  { 
    path: 'transaction/deposit-renew', 
    loadComponent: () => import('./components/transaction/deposit-renew/deposit-renew.component').then(m => m.DepositRenewComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN', 'SOCIETY_ADMIN', 'ACCOUNTANT'] }
  },
  { 
    path: 'transaction/deposit-slip', 
    loadComponent: () => import('./components/transaction/deposit-slip/deposit-slip.component').then(m => m.DepositSlipComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN', 'SOCIETY_ADMIN', 'ACCOUNTANT'] }
  },
  { 
    path: 'transaction/deposit-payment', 
    loadComponent: () => import('./components/transaction/deposit-payment/deposit-payment.component').then(m => m.DepositPaymentComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN', 'SOCIETY_ADMIN', 'ACCOUNTANT'] }
  },
  
  // Accounts Menu Routes
  { 
    path: 'accounts/group', 
    loadComponent: () => import('./components/accounts/group/group.component').then(m => m.GroupComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN', 'SOCIETY_ADMIN', 'ACCOUNTANT'] }
  },
  { 
    path: 'accounts/ledger', 
    loadComponent: () => import('./components/accounts/ledger/ledger.component').then(m => m.LedgerComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN', 'SOCIETY_ADMIN', 'ACCOUNTANT'] }
  },
  { 
    path: 'accounts/cash-book', 
    loadComponent: () => import('./components/accounts/cash-book/cash-book.component').then(m => m.CashBookComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN', 'SOCIETY_ADMIN', 'ACCOUNTANT'] }
  },
  { 
    path: 'accounts/day-book', 
    loadComponent: () => import('./components/accounts/day-book/day-book.component').then(m => m.DayBookComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN', 'SOCIETY_ADMIN', 'ACCOUNTANT'] }
  },
  { 
    path: 'accounts/voucher', 
    loadComponent: () => import('./components/accounts/voucher/voucher.component').then(m => m.VoucherComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN', 'SOCIETY_ADMIN', 'ACCOUNTANT'] }
  },
  { 
    path: 'accounts/loan-receipt', 
    loadComponent: () => import('./components/accounts/loan-receipt/loan-receipt.component').then(m => m.LoanReceiptComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN', 'SOCIETY_ADMIN', 'ACCOUNTANT'] }
  },
  { 
    path: 'accounts/trial-balance', 
    loadComponent: () => import('./components/accounts/trial-balance/trial-balance.component').then(m => m.TrialBalanceComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN', 'SOCIETY_ADMIN', 'ACCOUNTANT'] }
  },
  { 
    path: 'accounts/balance-sheet', 
    loadComponent: () => import('./components/accounts/balance-sheet/balance-sheet.component').then(m => m.BalanceSheetComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN', 'SOCIETY_ADMIN', 'ACCOUNTANT'] }
  },
  { 
    path: 'accounts/profit-loss', 
    loadComponent: () => import('./components/accounts/profit-loss/profit-loss.component').then(m => m.ProfitLossComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN', 'SOCIETY_ADMIN', 'ACCOUNTANT'] }
  },
  { 
    path: 'accounts/receipt-payment', 
    loadComponent: () => import('./components/accounts/receipt-payment/receipt-payment.component').then(m => m.ReceiptPaymentComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN', 'SOCIETY_ADMIN', 'ACCOUNTANT'] }
  },
  
  // Reports Menu Routes
  { 
    path: 'reports/employees', 
    loadComponent: () => import('./components/reports/employees/employees.component').then(m => m.EmployeesComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'reports/voucher', 
    loadComponent: () => import('./components/reports/voucher/voucher.component').then(m => m.VoucherReportComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'reports/opening-balance', 
    loadComponent: () => import('./components/reports/opening-balance/opening-balance.component').then(m => m.OpeningBalanceComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'reports/closing-balance', 
    loadComponent: () => import('./components/reports/closing-balance/closing-balance.component').then(m => m.ClosingBalanceComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'reports/loan', 
    loadComponent: () => import('./components/reports/loan/loan.component').then(m => m.LoanReportComponent),
    canActivate: [AuthGuard]
  },
  
  // Other Routes
  { 
    path: 'statement', 
    loadComponent: () => import('./components/statement/statement.component').then(m => m.StatementComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'backup', 
    loadComponent: () => import('./components/backup/backup.component').then(m => m.BackupComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN', 'SOCIETY_ADMIN'] }
  },
  { 
    path: 'admin', 
    loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN'] }
  },
  { 
    path: 'new-year', 
    loadComponent: () => import('./components/new-year/new-year.component').then(m => m.NewYearComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { requiredRole: ['SUPER_ADMIN', 'SOCIETY_ADMIN'] }
  },
  
  // Error routes
  { 
    path: 'unauthorized', 
    loadComponent: () => import('./components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  { path: '**', redirectTo: '/dashboard' }
];
