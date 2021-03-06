import { Subscription } from 'rxjs';
import { ChangeSpaceComponent } from './../../home/change-space/change-space.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackBarService } from './../../../_services/snack-bar.service';
import { CurrentSpaceStorage } from './../../../_services/model/currentSpaceStorage';
import { SpaceStorageService } from './../../../_services/space-storage.service';
import { SpaceService } from './../../../_services/space.service';
import { UserLogged } from './../../auth/login/userLogged';
import { TokenStorageService } from './../../../_services/token-storage.service';
import { LocalizationService } from './../../../internationalization/localization.service';
import { BackPageService } from './../../../_services/back-page.service';
import { AuthService } from 'src/app/_services/auth.service';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";
@Component({
  selector: 'app-header-toolbar',
  templateUrl: './header-toolbar.component.html',
  styleUrls: ['./header-toolbar.component.scss']
})
export class HeaderToolbarComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscriptions = new Subscription();

  currentUser?: UserLogged;
  isLoggedIn = false;
  showToolbarHeader = true;
  showBackButtonToolbarHeader = false;
  showChangeSpaceButtonToolbarHeader = false;
  textBackButtonToolbarHeader?: string;
  firstName?: string;

  constructor(private authService: AuthService,
    private backPageService: BackPageService,
    private dialogService: MatDialog,
    private localizationService: LocalizationService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private spaceService: SpaceService,
    private spaceStorageService: SpaceStorageService,
    private snackBarService: SnackBarService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {

    Promise.resolve().then(() => {
      this.firstName = this.tokenStorageService.getFirstName();
      const currentUserSub = this.authService.currentUser.subscribe(user => {
        this.currentUser = user;
        this.isLoggedIn = this.authService.isLoggedIn
      });

      const backPageSub = this.backPageService.backPage.subscribe(backPage =>{
        this.showBackButtonToolbarHeader = backPage.showBackButtonToolbarHeader
        this.showChangeSpaceButtonToolbarHeader = backPage.showChangeSpaceButtonToolbarHeader || false;
        this.textBackButtonToolbarHeader = backPage.textValue
        this.showToolbarHeader = (backPage.showBackButtonToolbarHeader || this.isLoggedIn)
      });

      this.subscriptions.add(currentUserSub);
      this.subscriptions.add(backPageSub);
    })
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
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

  openDialogChangeSpace(): void{
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      position: {
        'bottom': '0'
      },
      disableClose: true
    }

    const dialogRef = this.dialogService.open(ChangeSpaceComponent, dialogConfig);

    const dialogSub = dialogRef.afterClosed().subscribe((selectedSpaceId: string) => {
      if(selectedSpaceId) {
        this.changeSpace(selectedSpaceId);
      }
    }, err => {
      this.snackBarService.error(err);
    });

    this.subscriptions.add(dialogSub);
  }

  private changeSpace(spaceId: string): void {

    const changeSpaceSub = this.spaceService.changeSpaceViewOfUserLogged(spaceId)
      .subscribe(tokenUpdated => {
        const decode = jwt_decode<any>(tokenUpdated);

          const currentSpace: CurrentSpaceStorage = {
            spaceId: decode.spaceId,
            spaceName: decode.spaceName
          };

          this.tokenStorageService.saveToken(tokenUpdated);
          this.spaceStorageService.saveSpace(currentSpace);
        }, err => {
          this.snackBarService.error(err);
        }
      );

    this.subscriptions.add(changeSpaceSub);
  }
}
