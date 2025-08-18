
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  
  // File Menu
  { path: 'file/society', loadComponent: () => import('./components/file/society/society.component').then(m => m.SocietyComponent) },
  { path: 'file/security/authority', loadComponent: () => import('./components/file/security/authority/authority.component').then(m => m.AuthorityComponent) },
  { path: 'file/security/my-rights', loadComponent: () => import('./components/file/security/my-rights/my-rights.component').then(m => m.MyRightsComponent) },
  { path: 'file/security/new-user', loadComponent: () => import('./components/file/security/new-user/new-user.component').then(m => m.NewUserComponent) },
  { path: 'file/security/retrieve-password', loadComponent: () => import('./components/file/security/retrieve-password/retrieve-password.component').then(m => m.RetrievePasswordComponent) },
  { path: 'file/security/change-password', loadComponent: () => import('./components/file/security/change-password/change-password.component').then(m => m.ChangePasswordComponent) },
  { path: 'file/security/admin-handover', loadComponent: () => import('./components/file/security/admin-handover/admin-handover.component').then(m => m.AdminHandoverComponent) },
  { path: 'file/create-new-year', loadComponent: () => import('./components/file/create-new-year/create-new-year.component').then(m => m.CreateNewYearComponent) },
  { path: 'file/edit-opening-balance', loadComponent: () => import('./components/file/edit-opening-balance/edit-opening-balance.component').then(m => m.EditOpeningBalanceComponent) },
  
  // Master Menu
  { path: 'master/member-details', loadComponent: () => import('./components/master/member-details/member-details.component').then(m => m.MemberDetailsComponent) },
  { path: 'master/table', loadComponent: () => import('./components/master/table/table.component').then(m => m.TableComponent) },
  { path: 'master/deposit-scheme', loadComponent: () => import('./components/master/deposit-scheme/deposit-scheme.component').then(m => m.DepositSchemeComponent) },
  { path: 'master/interest-master', loadComponent: () => import('./components/master/interest-master/interest-master.component').then(m => m.InterestMasterComponent) },
  
  // Transaction Menu
  { path: 'transaction/loan-taken', loadComponent: () => import('./components/transaction/loan-taken/loan-taken.component').then(m => m.LoanTakenComponent) },
  { path: 'transaction/demand-process', loadComponent: () => import('./components/transaction/demand-process/demand-process.component').then(m => m.DemandProcessComponent) },
  { path: 'transaction/account-closure', loadComponent: () => import('./components/transaction/account-closure/account-closure.component').then(m => m.AccountClosureComponent) },
  { path: 'transaction/deposit-receipt', loadComponent: () => import('./components/transaction/deposit-receipt/deposit-receipt.component').then(m => m.DepositReceiptComponent) },
  { path: 'transaction/deposit-renew', loadComponent: () => import('./components/transaction/deposit-renew/deposit-renew.component').then(m => m.DepositRenewComponent) },
  { path: 'transaction/deposit-slip', loadComponent: () => import('./components/transaction/deposit-slip/deposit-slip.component').then(m => m.DepositSlipComponent) },
  { path: 'transaction/deposit-payment', loadComponent: () => import('./components/transaction/deposit-payment/deposit-payment.component').then(m => m.DepositPaymentComponent) },
  
  // Accounts Menu
  { path: 'accounts/group', loadComponent: () => import('./components/accounts/group/group.component').then(m => m.GroupComponent) },
  { path: 'accounts/ledger', loadComponent: () => import('./components/accounts/ledger/ledger.component').then(m => m.LedgerComponent) },
  { path: 'accounts/cash-book', loadComponent: () => import('./components/accounts/cash-book/cash-book.component').then(m => m.CashBookComponent) },
  { path: 'accounts/day-book', loadComponent: () => import('./components/accounts/day-book/day-book.component').then(m => m.DayBookComponent) },
  { path: 'accounts/voucher', loadComponent: () => import('./components/accounts/voucher/voucher.component').then(m => m.VoucherComponent) },
  { path: 'accounts/loan-receipt', loadComponent: () => import('./components/accounts/loan-receipt/loan-receipt.component').then(m => m.LoanReceiptComponent) },
  { path: 'accounts/trial-balance', loadComponent: () => import('./components/accounts/trial-balance/trial-balance.component').then(m => m.TrialBalanceComponent) },
  { path: 'accounts/balance-sheet', loadComponent: () => import('./components/accounts/balance-sheet/balance-sheet.component').then(m => m.BalanceSheetComponent) },
  { path: 'accounts/profit-loss', loadComponent: () => import('./components/accounts/profit-loss/profit-loss.component').then(m => m.ProfitLossComponent) },
  { path: 'accounts/receipt-payment', loadComponent: () => import('./components/accounts/receipt-payment/receipt-payment.component').then(m => m.ReceiptPaymentComponent) },
  
  // Reports Menu
  { path: 'reports/employees', loadComponent: () => import('./components/reports/employees/employees.component').then(m => m.EmployeesComponent) },
  { path: 'reports/voucher', loadComponent: () => import('./components/reports/voucher/voucher.component').then(m => m.VoucherReportComponent) },
  { path: 'reports/opening-balance', loadComponent: () => import('./components/reports/opening-balance/opening-balance.component').then(m => m.OpeningBalanceComponent) },
  { path: 'reports/closing-balance', loadComponent: () => import('./components/reports/closing-balance/closing-balance.component').then(m => m.ClosingBalanceComponent) },
  { path: 'reports/loan', loadComponent: () => import('./components/reports/loan/loan.component').then(m => m.LoanReportComponent) },
  
  // Other routes
  { path: 'statement', loadComponent: () => import('./components/statement/statement.component').then(m => m.StatementComponent) },
  { path: 'backup', loadComponent: () => import('./components/backup/backup.component').then(m => m.BackupComponent) },
  { path: 'admin', loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent) },
  { path: 'new-year', loadComponent: () => import('./components/new-year/new-year.component').then(m => m.NewYearComponent) },
  { path: 'login', loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent) },
  
  { path: '**', redirectTo: '/dashboard' }
];
