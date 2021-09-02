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
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showUserBoard = false;
  username?: string;

  constructor(private tokenStorageService: TokenStorageService, private swUpdate: SwUpdate, private localizationService: LocalizationService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showUserBoard = this.roles.includes('ROLE_USER');

      this.username = user.username;
    }

  if (this.swUpdate.isEnabled) {
    this.swUpdate.available.subscribe(() => {

      if(confirm(this.localizationService.translate('config.newVersionAvailable'))) {

          window.location.reload();
      }
    });
  }

  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
