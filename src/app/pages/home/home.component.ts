import { Router } from '@angular/router';
import { TokenStorageService } from './../../_services/token-storage.service';
import { UserService } from './../../_services/user.service';
import { LocalizationService } from './../../internationalization/localization.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isLoggedIn = false;

  constructor(private titleService: Title, private localizationService: LocalizationService,
    private userService: UserService, private tokenStorageService: TokenStorageService,
    private router: Router) {
    this.titleService.setTitle(localizationService.translate('titleRoutesBrowser.home'));
   }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if(!this.isLoggedIn) {
      this.router.navigate(['/login']).then( () => window.location.reload())

    }
  }
}
