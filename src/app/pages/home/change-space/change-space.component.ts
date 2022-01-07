import { Subscription } from 'rxjs';
import { CurrentSpaceStorage } from './../../../_services/model/currentSpaceStorage';
import { SpaceStorageService } from './../../../_services/space-storage.service';
import { MySpace } from './../../../_services/swagger-auto-generated/model/mySpace';
import { SnackBarService } from './../../../_services/snack-bar.service';
import { SpaceService } from './../../../_services/space.service';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-change-space',
  templateUrl: './change-space.component.html',
  styleUrls: ['./change-space.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChangeSpaceComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

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

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  findAllSpacesOfUser() {
    this.isLoading = true;
    const findAllSpacesSub = this.spaceService.findAllSpacesOfUserLogged().subscribe(res => {
      this.list = res;
      this.list.forEach(e => {
        e.lastAccessed = (e.spaceId === this.spaceSelected?.spaceId);
      })

      this.isLoading = false;
    }, err => {
      this.snackBarService.error(err);
      this.isLoading = false;
    });

    this.subscriptions.add(findAllSpacesSub);
  }

  changeRadioButton(item: MySpace) {

    this.list.forEach(e => {
      const isSelectedSpace = (e.spaceId === item.spaceId);
      e.lastAccessed = isSelectedSpace;
      if(isSelectedSpace) {
        this.spaceSelected = e;
      }
    })
  }

  close() {
    this.dialogRef.close(this.spaceSelected?.spaceId);
  }

}
