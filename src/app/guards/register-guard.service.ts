import { TokenStorageService } from './../_services/token-storage.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/_services/auth.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegisterGuardService implements CanActivate {

  constructor(private storageService: TokenStorageService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | boolean {
    if (this.storageService.isNewUserFilledInForm) {
      return true;
    }

    this.router.navigate(["/register"]);

    return false;
  }
}
