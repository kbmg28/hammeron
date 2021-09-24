import { BackPageService } from './_services/back-page.service';
import { UserLogged } from './pages/auth/login/userLogged';
import { AuthService } from 'src/app/_services/auth.service';
import { Router } from '@angular/router';
import { LocalizationService } from './internationalization/localization.service';
import { TokenStorageService } from './_services/token-storage.service';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  currentUser?: UserLogged;
  isLoggedIn = false;
  showBackButtonToolbarHeader = false;
  textBackButtonToolbarHeader?: string;
  firstName?: string;
  styleVisibility: string = 'hidden';

  constructor(private authService: AuthService,
    private backPageService: BackPageService,
    private swUpdate: SwUpdate,
    private localizationService: LocalizationService,
    private router: Router,
    private cdr: ChangeDetectorRef) {

      this.authService.currentUser.subscribe(user => {
        this.currentUser = user;
        this.isLoggedIn = this.authService.isLoggedIn
      });
      this.backPageService.backPage.subscribe(backPage =>{
        this.showBackButtonToolbarHeader = backPage.showToolbarHeader
        this.textBackButtonToolbarHeader = backPage.textValue
        this.styleVisibility = backPage.showToolbarHeader ? 'visible' : 'hidden'
      })
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

  ngAfterViewInit() {
    console.log('afterView')
    this.cdr.detectChanges();
  }

  onLogout(): void {
    this.authService.signOut();
    this.router.navigate(['/login'])
  }

  onMyProfile(): void {
    this.router.navigate(['/my-profile'])
  }

  getVisibility(): string {
    console.log(this.styleVisibility)
    return this.showBackButtonToolbarHeader ? 'visible' : 'hidden'
  }

  returnToPage(): void {
    const backPageValue = this.backPageService.backPageValue;
    this.router.navigate([backPageValue.routeValue])
  }
}
