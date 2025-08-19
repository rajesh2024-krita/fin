
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SOCIETY_ADMIN = 'SOCIETY_ADMIN',
  ACCOUNTANT = 'ACCOUNTANT',
  MEMBER = 'MEMBER'
}

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  societyId?: number;
  permissions: Permission[];
}

export interface Permission {
  resource: string;
  actions: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private router: Router) {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
      this.isLoggedInSubject.next(true);
    }
  }

  login(username: string, password: string): Observable<boolean> {
    return new Observable(observer => {
      // Mock authentication - replace with actual API call
      if (username === 'admin' && password === 'admin') {
        const user: User = {
          id: 1,
          username: 'admin',
          firstName: 'System',
          lastName: 'Administrator',
          email: 'admin@society.com',
          role: UserRole.SUPER_ADMIN,
          permissions: [
            { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
            { resource: 'accounts', actions: ['create', 'read', 'update', 'delete'] },
            { resource: 'transactions', actions: ['create', 'read', 'update', 'delete'] },
            { resource: 'reports', actions: ['read'] }
          ]
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.isLoggedInSubject.next(true);
        observer.next(true);
      } else {
        observer.next(false);
      }
      observer.complete();
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasPermission(resource: string, action: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    const permission = user.permissions.find(p => p.resource === resource);
    return permission ? permission.actions.includes(action) : false;
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }
}
