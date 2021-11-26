import { UserWithPermissionDto } from './../../_services/swagger-auto-generated/model/userWithPermissionDto';
import { UserService } from './../../_services/user.service';
import { SnackBarService } from './../../_services/snack-bar.service';
import { LocalizationService } from './../../internationalization/localization.service';
import { BackPageService } from './../../_services/back-page.service';
import { Title } from '@angular/platform-browser';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
export class SpaceManagementComponent implements OnInit  {
  displayedColumns: string[] = ['name', 'permissionList', 'email', 'cellPhone'];
  dataSource?: MatTableDataSource<UserTable>;
  data: Array<UserWithPermissionDto> = [];

  constructor(private titleService: Title,
    private backPageService: BackPageService,
    private dialogService: MatDialog,
    private localizationService: LocalizationService,
    private snackBarService: SnackBarService,
    private userService: UserService,
    private _liveAnnouncer: LiveAnnouncer) {
      this.titleService.setTitle('title...');
    }

  ngOnInit(): void {
    this.backPageService.setBackPageValue('/home', this.localizationService.translate('space.sectionName'));
    this.findAllUsersOfSpace();
  }

  openUserDetailsDialog(row: any) {
    // implement
  }

  findAllUsersOfSpace() {
    this.userService.findAllBySpace().subscribe(res => {
      this.data = res;
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
    }, err => {
      this.snackBarService.error(err);
    });
  }
}
