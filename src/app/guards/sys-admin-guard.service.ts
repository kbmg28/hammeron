import { TokenStorageService } from './../_services/token-storage.service';
import { Observable } from 'rxjs';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { Injectable } from '@angular/core';
import { UserPermissionEnum } from '../_services/model/enums/userPermissionEnum';

@Injectable({
  providedIn: 'root'
})
export class SysAdminGuardService implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router,
              private tokenStorageService: TokenStorageService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | boolean {
    if (this.authService.isLoggedIn && this.isSysAdmin()) {
      return true;
    }

    this.router.navigate(["/home"]);

    return false;
  }

  isSysAdmin(): boolean {
    const permissions = new Set<string>(this.tokenStorageService.getUserLogged().permissions);

    return permissions.has(UserPermissionEnum.SYS_ADMIN);
  }

}
