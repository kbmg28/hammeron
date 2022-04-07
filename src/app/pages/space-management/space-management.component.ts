import { MatTabChangeEvent } from '@angular/material/tabs';
import { AddPeopleSpaceDialogComponent } from './add-people-space-dialog/add-people-space-dialog.component';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { SpaceStorageService } from './../../_services/space-storage.service';
import { SpaceOverviewDto } from './../../_services/swagger-auto-generated/model/spaceOverviewDto';
import { SpaceService } from './../../_services/space.service';
import { UserWithPermissionDto } from './../../_services/swagger-auto-generated/model/userWithPermissionDto';
import { UserService } from './../../_services/user.service';
import { SnackBarService } from './../../_services/snack-bar.service';
import { LocalizationService } from './../../internationalization/localization.service';
import { BackPageService } from './../../_services/back-page.service';
import { Title } from '@angular/platform-browser';
import { AfterViewInit, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';

interface PermissionTemplate {
  key: string,
  value: string
}

interface UserTable {
  cellPhone?: string;
  email?: string;
  id?: string;
  name: string;
  permissionList?: string[]
}

@Component({
  selector: 'app-space-management',
  templateUrl: './space-management.component.html',
  styleUrls: ['./space-management.component.scss']
})
export class SpaceManagementComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  private _currentTab: number = 1;
  private currentSubject?: BehaviorSubject<UserWithPermissionDto[]>;

  displayedColumns: string[] = ['name', 'permissionList', 'email', 'cellPhone'];
  dataSource?: MatTableDataSource<UserTable>;
  overviewData: SpaceOverviewDto = {};
  spaceName = '';

  isLoadingOverviewData = false;
  isLoadingPeoplesData = false;
  isOpenedAddPeopleDialog = false;

  dataObs?: Observable<UserWithPermissionDto[]>;

  constructor(private titleService: Title,
    private backPageService: BackPageService,
    private dialogService: MatDialog,
    private localizationService: LocalizationService,
    private snackBarService: SnackBarService,
    private userService: UserService,
    private spaceService: SpaceService,
    private spaceStorageService: SpaceStorageService,
    private _liveAnnouncer: LiveAnnouncer) {
      this.titleService.setTitle(this.localizationService.translate('titleRoutesBrowser.spaceManagement'));
    }

  ngOnInit(): void {
    this.backPageService.setBackPageValue('/home', this.localizationService.translate('space.sectionName'));
    this.spaceName = this.spaceStorageService.getSpace().spaceName;

    this.currentSubject = new BehaviorSubject<UserWithPermissionDto[]>([]);
    this.dataObs = this.currentSubject.asObservable();

    this.findOverviewInfo();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    this._currentTab = ++tabChangeEvent.index;

    if (this._currentTab === 1) {
      this.findOverviewInfo();
    } else {
      this.findAllUsersOfSpace();
    }
  }

  openUserDetailsDialog(row: any) {
    // implement
  }

  translateTypeEvent(eventType: string = '') {
    return this.localizationService.translate(`event.tab.${eventType.toLowerCase()}`);
  }

  translateMusicStatus(musicStatus: string = '') {
    return this.localizationService.translate(`music.status.${musicStatus}`);
  }

  translatePermission(permissionName: string = '') {
    return this.localizationService.translate(`user.permissions.${permissionName}`);
  }

  openAddPeopleDialog(): void {
    this.isOpenedAddPeopleDialog = true;
    const dialogRef = this.dialogService.open(AddPeopleSpaceDialogComponent, {
      position: {
        'bottom': '0'
      },
      disableClose: true,
      data: ''
    });

    const dialogRefSub = dialogRef.afterClosed().subscribe(res => {
      if(res) {
        this.findAllUsersOfSpace();
      }

      this.isOpenedAddPeopleDialog = false;
    }, err => {
      this.isOpenedAddPeopleDialog = false;
    });

    this.subscriptions.add(dialogRefSub);
  }

  findOverviewInfo() {
    this.isLoadingOverviewData = true;

    const overviewSpaceSub = this.spaceService.overview().subscribe(res => {
      this.overviewData = res;

      this.isLoadingOverviewData = false;
    }, err => {
      this.snackBarService.error(err);
      this.isLoadingOverviewData = false;
    });

    this.subscriptions.add(overviewSpaceSub);
  }

  findAllUsersOfSpace() {
    this.isLoadingPeoplesData = true;

    const allUsersBySpaceSub = this.userService.findAllBySpace().subscribe(res => {
      this.currentSubject?.next(res);
      const tableData = res.map(userDto => {
        const permissionFormatted = userDto.permissionList?.map(permission => {
          return this.localizationService.translate(`user.permissions.${permission}`);
        });

        const userTable: UserTable = {
          id: userDto.id,
          name: userDto.name || '',
          email: userDto.email,
          cellPhone: userDto.cellPhone,
          permissionList: permissionFormatted
        }
        return userTable;
      }).sort((a, b) => a.name.localeCompare(b.name));

      this.dataSource = new MatTableDataSource(tableData);
      this.isLoadingPeoplesData = false;
    }, err => {
      this.snackBarService.error(err);
      this.isLoadingPeoplesData = false;
    });
    this.subscriptions.add(allUsersBySpaceSub);
  }
}
