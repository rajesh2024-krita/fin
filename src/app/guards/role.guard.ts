
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as UserRole[];
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    if (requiredRoles.includes(currentUser.role)) {
      return true;
    }

    this.router.navigate(['/unauthorized']);
    return false;
  }
}
