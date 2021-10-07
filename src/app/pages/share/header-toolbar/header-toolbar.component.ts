import { UserLogged } from './../../auth/login/userLogged';
import { TokenStorageService } from './../../../_services/token-storage.service';
import { LocalizationService } from './../../../internationalization/localization.service';
import { BackPageService } from './../../../_services/back-page.service';
import { AuthService } from 'src/app/_services/auth.service';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-toolbar',
  templateUrl: './header-toolbar.component.html',
  styleUrls: ['./header-toolbar.component.scss']
})
export class HeaderToolbarComponent implements OnInit, AfterViewInit {

  currentUser?: UserLogged;
  isLoggedIn = false;
  showToolbarHeader = true;
  showBackButtonToolbarHeader = false;
  textBackButtonToolbarHeader?: string;
  firstName?: string;

  constructor(private authService: AuthService,
    private backPageService: BackPageService,
    private localizationService: LocalizationService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {

    Promise.resolve().then(() => {
      this.firstName = this.tokenStorageService.getFirstName();
      this.authService.currentUser.subscribe(user => {
        this.currentUser = user;
        this.isLoggedIn = this.authService.isLoggedIn
      });

      this.backPageService.backPage.subscribe(backPage =>{
        this.showBackButtonToolbarHeader = backPage.showBackButtonToolbarHeader
        this.textBackButtonToolbarHeader = backPage.textValue
        this.showToolbarHeader = (backPage.showBackButtonToolbarHeader || this.isLoggedIn)
      })
    })
  }

  returnToPage(): void {
    const backPageValue = this.backPageService.backPageValue;
    this.router.navigate([backPageValue.routeValue])
  }

  onLogout(): void {
    this.authService.signOut();
    this.router.navigate(['/login'])
  }

  onMyProfile(): void {
    this.router.navigate(['/my-profile'])
  }

}
