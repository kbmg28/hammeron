import { BackPageService } from './_services/back-page.service';
import { UserLogged } from './pages/auth/login/userLogged';
import { AuthService } from 'src/app/_services/auth.service';
import { Router } from '@angular/router';
import { LocalizationService } from './internationalization/localization.service';
import { TokenStorageService } from './_services/token-storage.service';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  currentUser?: UserLogged;
  isLoggedIn = false;
  showToolbarHeader = true;
  showBackButtonToolbarHeader = false;
  textBackButtonToolbarHeader?: string;
  firstName?: string;
  styleVisibility: string = 'hidden';
  styleHeight = '100vh';

  constructor(private authService: AuthService,
    private backPageService: BackPageService,
    private swUpdate: SwUpdate,
    private localizationService: LocalizationService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private cdr: ChangeDetectorRef) {
    }

  ngOnInit(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {

        if(confirm(this.localizationService.translate('config.newVersionAvailable'))) {

            window.location.reload();
        }
      });
    }
    this.firstName = this.tokenStorageService.getFirstName();
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = this.authService.isLoggedIn
    });

    this.backPageService.backPage.subscribe(backPage =>{
      this.showBackButtonToolbarHeader = backPage.showBackButtonToolbarHeader
      this.textBackButtonToolbarHeader = backPage.textValue
      this.showToolbarHeader = (backPage.showBackButtonToolbarHeader || this.isLoggedIn)
      this.styleVisibility = backPage.showBackButtonToolbarHeader ? 'visible' : 'hidden'
      this.styleHeight = this.showToolbarHeader ? '92vh' : '100vh'
      this.cdr.detectChanges();
    })
  }

  onLogout(): void {
    this.authService.signOut();
    this.router.navigate(['/login'])
  }

  onMyProfile(): void {
    this.router.navigate(['/my-profile'])
  }

  returnToPage(): void {
    const backPageValue = this.backPageService.backPageValue;
    this.router.navigate([backPageValue.routeValue])
  }
}
