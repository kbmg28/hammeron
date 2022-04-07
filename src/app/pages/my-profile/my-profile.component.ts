import { UserLogged } from './../auth/login/userLogged';
import { AuthService } from './../../_services/auth.service';
import { BackPageService } from './../../_services/back-page.service';
import { Router } from '@angular/router';
import { TokenStorageService } from './../../_services/token-storage.service';
import { LocalizationService } from './../../internationalization/localization.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserPermissionEnum } from 'src/app/_services/model/enums/userPermissionEnum';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  language: string = localStorage.getItem('language') || 'pt-BR';

  userLogged?: UserLogged;
  initialsLetter?: string;

  constructor(private titleService: Title, private localizationService: LocalizationService,
    private tokenStorageService: TokenStorageService, private router: Router,
    private backPageService: BackPageService, private authService: AuthService) { }

  ngOnInit(): void {
    this.backPageService.setBackPageValue('/home', this.localizationService.translate('myProfile.header'));
    this.userLogged = this.tokenStorageService.getUserLogged();
    this.getInitialsLetter();

  }

  isSysAdmin(): boolean {
    const permissions = new Set<string>(this.tokenStorageService.getUserLogged().permissions);

    return permissions.has(UserPermissionEnum.SYS_ADMIN);
  }

  onSelect(lang: string): void {
    localStorage.setItem('language', lang);
    this.localizationService.initService();
  }

  onLogout(): void {
    this.authService.signOut();
  }

  private getInitialsLetter() {
    const nameSplit = this.userLogged?.name.split(" ") || [];
    const firstName = nameSplit[0];

    if (nameSplit.length > 1) {
      const lastName = nameSplit[nameSplit.length - 1];
      this.initialsLetter = `${firstName[0]}${lastName[0]}`;
    } else {
      this.initialsLetter = firstName[0];
    }
  }

}
