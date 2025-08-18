
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  username: string;
  email: string;
  membershipDate: Date;
  totalDeposits: number;
  totalLoans: number;
  activeLoans: number;
}

interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  membershipDate: Date;
  totalDeposits: number;
  totalLoans: number;
  activeLoans: number;
}

interface Deposit {
  id: number;
  memberId: number;
  memberName: string;
  amount: number;
  date: Date;
  description: string;
  status: 'pending' | 'completed';
}

interface Loan {
  id: number;
  memberId: number;
  memberName: string;
  amount: number;
  interestRate: number;
  term: number; // in months
  monthlyPayment: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'defaulted';
  remainingBalance: number;
}

interface Transaction {
  id: number;
  type: 'deposit' | 'loan' | 'repayment' | 'interest';
  memberId: number;
  memberName: string;
  amount: number;
  date: Date;
  description: string;
  reference: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Financial Management System';
  currentView: 'login' | 'dashboard' | 'members' | 'deposits' | 'loans' | 'reports' | 'transactions' = 'login';
  showAddMember = false;
  showAddDeposit = false;
  showAddLoan = false;
  
  user: User = {
    id: 1,
    username: '',
    email: '',
    membershipDate: new Date(),
    totalDeposits: 0,
    totalLoans: 0,
    activeLoans: 0
  };

  newMember: Omit<Member, 'id' | 'membershipDate' | 'totalDeposits' | 'totalLoans' | 'activeLoans'> = {
    name: '',
    email: '',
    phone: '',
    address: ''
  };

  newDeposit: Omit<Deposit, 'id' | 'date' | 'memberName'> = {
    memberId: 0,
    amount: 0,
    description: '',
    status: 'pending'
  };

  newLoan: Omit<Loan, 'id' | 'memberName' | 'startDate' | 'endDate' | 'monthlyPayment' | 'remainingBalance'> = {
    memberId: 0,
    amount: 0,
    interestRate: 5,
    term: 12,
    status: 'active'
  };

  members: Member[] = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1234567890',
      address: '123 Main St, City',
      membershipDate: new Date('2023-01-15'),
      totalDeposits: 5000,
      totalLoans: 2000,
      activeLoans: 1500
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1234567891',
      address: '456 Oak Ave, City',
      membershipDate: new Date('2023-03-20'),
      totalDeposits: 7500,
      totalLoans: 3000,
      activeLoans: 2500
    },
    {
      id: 3,
      name: 'Mike Davis',
      email: 'mike@example.com',
      phone: '+1234567892',
      address: '789 Pine St, City',
      membershipDate: new Date('2023-06-10'),
      totalDeposits: 3200,
      totalLoans: 1000,
      activeLoans: 800
    }
  ];

  deposits: Deposit[] = [
    {
      id: 1,
      memberId: 1,
      memberName: 'John Smith',
      amount: 1000,
      date: new Date('2024-01-15'),
      description: 'Monthly deposit',
      status: 'completed'
    },
    {
      id: 2,
      memberId: 2,
      memberName: 'Sarah Johnson',
      amount: 1500,
      date: new Date('2024-01-20'),
      description: 'Monthly deposit',
      status: 'completed'
    },
    {
      id: 3,
      memberId: 3,
      memberName: 'Mike Davis',
      amount: 800,
      date: new Date('2024-01-25'),
      description: 'Monthly deposit',
      status: 'pending'
    }
  ];

  loans: Loan[] = [
    {
      id: 1,
      memberId: 1,
      memberName: 'John Smith',
      amount: 5000,
      interestRate: 8,
      term: 24,
      monthlyPayment: 226,
      startDate: new Date('2023-12-01'),
      endDate: new Date('2025-12-01'),
      status: 'active',
      remainingBalance: 4200
    },
    {
      id: 2,
      memberId: 2,
      memberName: 'Sarah Johnson',
      amount: 10000,
      interestRate: 7.5,
      term: 36,
      monthlyPayment: 313,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2027-01-01'),
      status: 'active',
      remainingBalance: 9500
    }
  ];

  transactions: Transaction[] = [
    {
      id: 1,
      type: 'deposit',
      memberId: 1,
      memberName: 'John Smith',
      amount: 1000,
      date: new Date('2024-01-15'),
      description: 'Monthly deposit',
      reference: 'DEP001'
    },
    {
      id: 2,
      type: 'loan',
      memberId: 1,
      memberName: 'John Smith',
      amount: 5000,
      date: new Date('2023-12-01'),
      description: 'Personal loan',
      reference: 'LON001'
    },
    {
      id: 3,
      type: 'repayment',
      memberId: 1,
      memberName: 'John Smith',
      amount: 226,
      date: new Date('2024-01-01'),
      description: 'Loan repayment',
      reference: 'REP001'
    }
  ];

  login(): void {
    if (this.user.username && this.user.email) {
      this.currentView = 'dashboard';
    }
  }

  addMember(): void {
    if (this.newMember.name.trim()) {
      const member: Member = {
        ...this.newMember,
        id: this.generateId(this.members),
        membershipDate: new Date(),
        totalDeposits: 0,
        totalLoans: 0,
        activeLoans: 0
      };
      
      this.members.push(member);
      this.resetNewMember();
      this.showAddMember = false;
    }
  }

  addDeposit(): void {
    if (this.newDeposit.amount > 0 && this.newDeposit.memberId > 0) {
      const member = this.members.find(m => m.id === this.newDeposit.memberId);
      if (member) {
        const deposit: Deposit = {
          ...this.newDeposit,
          id: this.generateId(this.deposits),
          date: new Date(),
          memberName: member.name
        };
        
        this.deposits.push(deposit);
        
        // Update member's total deposits
        member.totalDeposits += this.newDeposit.amount;
        
        // Add transaction
        this.addTransaction('deposit', this.newDeposit.memberId, member.name, this.newDeposit.amount, 'Deposit');
        
        this.resetNewDeposit();
        this.showAddDeposit = false;
      }
    }
  }

  addLoan(): void {
    if (this.newLoan.amount > 0 && this.newLoan.memberId > 0) {
      const member = this.members.find(m => m.id === this.newLoan.memberId);
      if (member) {
        const monthlyPayment = this.calculateMonthlyPayment(
          this.newLoan.amount, 
          this.newLoan.interestRate, 
          this.newLoan.term
        );
        
        const loan: Loan = {
          ...this.newLoan,
          id: this.generateId(this.loans),
          memberName: member.name,
          startDate: new Date(),
          endDate: new Date(Date.now() + this.newLoan.term * 30 * 24 * 60 * 60 * 1000),
          monthlyPayment: monthlyPayment,
          remainingBalance: this.newLoan.amount
        };
        
        this.loans.push(loan);
        
        // Update member's loan totals
        member.totalLoans += this.newLoan.amount;
        member.activeLoans += this.newLoan.amount;
        
        // Add transaction
        this.addTransaction('loan', this.newLoan.memberId, member.name, this.newLoan.amount, 'Loan disbursement');
        
        this.resetNewLoan();
        this.showAddLoan = false;
      }
    }
  }

  calculateMonthlyPayment(principal: number, annualRate: number, months: number): number {
    const monthlyRate = annualRate / 100 / 12;
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                   (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(payment * 100) / 100;
  }

  addTransaction(type: Transaction['type'], memberId: number, memberName: string, amount: number, description: string): void {
    const transaction: Transaction = {
      id: this.generateId(this.transactions),
      type,
      memberId,
      memberName,
      amount,
      date: new Date(),
      description,
      reference: this.generateReference(type)
    };
    this.transactions.unshift(transaction);
  }

  generateReference(type: string): string {
    const prefix = type.toUpperCase().substring(0, 3);
    const number = String(Date.now()).slice(-6);
    return `${prefix}${number}`;
  }

  // Financial Reports
  getTotalDeposits(): number {
    return this.deposits.filter(d => d.status === 'completed').reduce((sum, d) => sum + d.amount, 0);
  }

  getTotalLoans(): number {
    return this.loans.reduce((sum, l) => sum + l.amount, 0);
  }

  getTotalActiveLoans(): number {
    return this.loans.filter(l => l.status === 'active').reduce((sum, l) => sum + l.remainingBalance, 0);
  }

  getTotalMembers(): number {
    return this.members.length;
  }

  getMonthlyInterestIncome(): number {
    return this.loans.filter(l => l.status === 'active')
                    .reduce((sum, l) => sum + (l.remainingBalance * l.interestRate / 100 / 12), 0);
  }

  getTrialBalance(): any {
    return {
      assets: {
        cash: this.getTotalDeposits(),
        loansReceivable: this.getTotalActiveLoans(),
        total: this.getTotalDeposits() + this.getTotalActiveLoans()
      },
      liabilities: {
        memberDeposits: this.getTotalDeposits(),
        total: this.getTotalDeposits()
      },
      equity: {
        retainedEarnings: this.getTotalActiveLoans(),
        total: this.getTotalActiveLoans()
      }
    };
  }

  private generateId(array: any[]): number {
    return Math.max(...array.map(item => item.id), 0) + 1;
  }

  private resetNewMember(): void {
    this.newMember = {
      name: '',
      email: '',
      phone: '',
      address: ''
    };
  }

  private resetNewDeposit(): void {
    this.newDeposit = {
      memberId: 0,
      amount: 0,
      description: '',
      status: 'pending'
    };
  }

  private resetNewLoan(): void {
    this.newLoan = {
      memberId: 0,
      amount: 0,
      interestRate: 5,
      term: 12,
      status: 'active'
    };
  }
}
