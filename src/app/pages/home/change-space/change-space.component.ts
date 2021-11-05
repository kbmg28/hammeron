import { CurrentSpaceStorage } from './../../../_services/model/currentSpaceStorage';
import { SpaceStorageService } from './../../../_services/space-storage.service';
import { MySpace } from './../../../_services/swagger-auto-generated/model/mySpace';
import { SnackBarService } from './../../../_services/snack-bar.service';
import { SpaceService } from './../../../_services/space.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-change-space',
  templateUrl: './change-space.component.html',
  styleUrls: ['./change-space.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChangeSpaceComponent implements OnInit {

  isLoading: boolean = false;
  list: MySpace[] = [];
  spaceSelected?: MySpace;

  constructor(private dialogRef: MatDialogRef<ChangeSpaceComponent>,
              private spaceService: SpaceService,
              private spaceStorageService: SpaceStorageService,
              private snackBarService: SnackBarService) { }

  ngOnInit(): void {
    const storageSpace = this.spaceStorageService.getSpace();
    this.spaceSelected = {
      lastAccessed: true,
      name: storageSpace.spaceName,
      spaceId: storageSpace.spaceId
    };

    this.findAllSpacesOfUser();
  }

  findAllSpacesOfUser() {
    this.isLoading = true;
    this.spaceService.findAllSpacesOfUserLogged().subscribe(res => {
      this.list = res;
      this.list.forEach(e => {
        e.lastAccessed = (e.spaceId === this.spaceSelected?.spaceId);
      })

      this.isLoading = false;
    }, err => {
      this.snackBarService.error(err);
      this.isLoading = false;
    })
  }

  changeRadioButton(item: MySpace) {

    this.list.forEach(e => {
      const isSelectedSpace = (e.spaceId === item.spaceId);
      e.lastAccessed = isSelectedSpace;
      if(isSelectedSpace) {
        this.spaceSelected = e;
        this.changeSpace(e.spaceId);
      }
    })
  }

  close() {
    this.dialogRef.close(this.spaceSelected?.spaceId);
  }

  private changeSpace(spaceId: string): void {

    this.spaceService.changeSpaceViewOfUserLogged(spaceId)
    .subscribe(res => {
        const currentSpace: CurrentSpaceStorage = {
          spaceId: res.spaceId,
          spaceName: res.name
        };

        this.spaceStorageService.saveSpace(currentSpace);
      }, err => {
        this.snackBarService.error(err);
      }
    )
  }
}
