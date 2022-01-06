import { SpaceApproveDto } from './../../../_services/swagger-auto-generated/model/spaceApproveDto';
import { SpaceRequestDetailsDialogComponent } from './space-request-details-dialog/space-request-details-dialog.component';
import { SpaceDto } from './../../../_services/swagger-auto-generated/model/spaceDto';
import { SnackBarService } from './../../../_services/snack-bar.service';
import { SpaceService } from './../../../_services/space.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/_services/auth.service';
import { BackPageService } from './../../../_services/back-page.service';
import { Router } from '@angular/router';
import { TokenStorageService } from './../../../_services/token-storage.service';
import { LocalizationService } from './../../../internationalization/localization.service';
import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-space-to-approve-list',
  templateUrl: './space-to-approve-list.component.html',
  styleUrls: ['./space-to-approve-list.component.scss']
})
export class SpaceToApproveListComponent implements OnInit {

  private _currentTab: number = 1;
  private _dataSpaceOpen: SpaceDto[] = [];

  isLoadingOpenSpace = true;
  isLoadingClosedSpace = false;

  totalOpenSpace?: number;
  totalClosedSpace?: number;

  eventsFiltered?: Observable<SpaceDto[]>;

  private currentSubject?: BehaviorSubject<SpaceDto[]>;

  constructor(private titleService: Title,
    private localizationService: LocalizationService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private backPageService: BackPageService,
    private authService: AuthService,
    private dialogService: MatDialog,
    private spaceService: SpaceService,
    private snackBarService: SnackBarService,) { }

  ngOnInit(): void {
    this.backPageService.setBackPageValue('/my-profile', this.localizationService.translate('myProfile.spaceToApprove.describe'));

    this.currentSubject = new BehaviorSubject<any[]>([]);
    this.eventsFiltered = this.currentSubject.asObservable();
    this.loadSpaceOpen();
  }

  openEventDetailsDialog(item: SpaceDto) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      position: {
        'bottom': '0'
      },
      data: item
    }

    const dialogRef = this.dialogService.open(SpaceRequestDetailsDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((wasChangeStatus: boolean) => {
      if(wasChangeStatus) {
        this.loadSpaceOpen();
      }
    }, err => {
    });

  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    this._currentTab = ++tabChangeEvent.index;
    this.currentSubject?.next([]);

    if (this._currentTab === 1) {
      this.loadSpaceOpen();
    } else {
    //  this.loadSpaceClose();
    }
  }

  loadSpaceOpen(){
    this.isLoadingOpenSpace = true;
    this.spaceService.findAllSpaceByStatus(SpaceApproveDto.SpaceStatusEnumEnum.REQUESTED).subscribe(res => {
      this._dataSpaceOpen = res;
      this.totalOpenSpace = res.length;

      this.currentSubject?.next(res);

      this.isLoadingOpenSpace = false;
    }, err => {
      this.snackBarService.error(err);
      this.isLoadingOpenSpace = false;
    });
  }

  hasOpenSpace() {
    if(this.isLoadingOpenSpace) {
      return true;
    }
    return this._dataSpaceOpen && this._dataSpaceOpen.length > 0;
  }

}
