import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggedGuardService  implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | boolean {
    if (!this.authService.isLoggedIn) {
      return true;
    }

    this.router.navigate(["/home"]);

    return false;
  }
}
