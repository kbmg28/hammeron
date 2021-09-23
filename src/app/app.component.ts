import { UserLogged } from './pages/auth/login/userLogged';
import { AuthService } from 'src/app/_services/auth.service';
import { Router } from '@angular/router';
import { LocalizationService } from './internationalization/localization.service';
import { TokenStorageService } from './_services/token-storage.service';
import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentUser?: UserLogged;
  isLoggedIn = false;
  showAdminBoard = false;
  showUserBoard = false;
  firstName?: string;
  showUserPanel = false;

  constructor(private authService: AuthService, private swUpdate: SwUpdate,
    private localizationService: LocalizationService, private router: Router) {

    this.authService.currentUser.subscribe(user => {
        this.currentUser = user;
        this.isLoggedIn = this.authService.isLoggedIn
      });
    }

  ngOnInit(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {

        if(confirm(this.localizationService.translate('config.newVersionAvailable'))) {

            window.location.reload();
        }
      });
    }
  }

  onLogout(): void {
    this.authService.signOut();
    this.router.navigate(['/login'])
  }

  onMyProfile(): void {
    this.router.navigate(['/my-profile'])
  }

  clickAccount(): void {
    this.showUserPanel = !this.showUserPanel
  }
}
