import { ViewEventDialogComponent } from './../event-management/view-event-dialog/view-event-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { UserPermissionEnum } from './../../_services/model/enums/userPermissionEnum';
import { MusicTopUsedDto } from './../../_services/swagger-auto-generated/model/musicTopUsedDto';
import { MusicService } from './../../_services/music.service';
import { EventDto } from './../../_services/swagger-auto-generated/model/eventDto';
import { EventService } from './../../_services/event.service';
import { SnackBarService } from './../../_services/snack-bar.service';
import { CurrentSpaceStorage } from './../../_services/model/currentSpaceStorage';
import { SpaceService } from './../../_services/space.service';
import { SpaceStorageService } from './../../_services/space-storage.service';
import { BackPageService } from './../../_services/back-page.service';
import { Router } from '@angular/router';
import { TokenStorageService } from './../../_services/token-storage.service';
import { UserService } from './../../_services/user.service';
import { LocalizationService } from './../../internationalization/localization.service';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscriptions = new Subscription();

  isLoggedIn = false;
  isLoadingNextEvents = true;
  isLoadingTop10Music = true;

  currentSpace?: CurrentSpaceStorage;
  nextEventsToDisplay: EventDto[] = [];
  musicTopUserList: MusicTopUsedDto[] = [];

  constructor(private titleService: Title,
    private localizationService: LocalizationService,
    private backPageService: BackPageService,
    private tokenStorageService: TokenStorageService,
    private spaceService: SpaceService,
    private spaceStorage: SpaceStorageService,
    private snackBarService: SnackBarService,
    private eventService: EventService,
    private musicService: MusicService,
    private dialogService: MatDialog,) {
    this.titleService.setTitle(localizationService.translate('titleRoutesBrowser.home'));
   }

  ngOnInit(): void {
    var firstName = this.tokenStorageService.getFirstName();
    this.backPageService.setBackPageValue(undefined, `Olá, ${firstName}`, true);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewInit() {

    Promise.resolve().then(() => {
      const spaceSubscription = this.spaceStorage.currentSpace.subscribe(spaceStorage =>{

        if(spaceStorage?.spaceId) {
          if (this.currentSpace?.spaceId !== spaceStorage.spaceId) {
            this.currentSpace = spaceStorage;
            this.findAllNextEventsOfCurrentSpace();
            this.findTop10MusicMoreUsedInEvents();
          }
        } else {
          const lastSpaceDatabaseSubscription = this.spaceService.findCurrentSpaceOfUserLogged().subscribe(lastSpace => {
            const currentSpace: CurrentSpaceStorage = {
              spaceId: lastSpace.spaceId,
              spaceName: lastSpace.name
            };

            this.spaceStorage.saveSpace(currentSpace);
            this.currentSpace = currentSpace;
            this.findAllNextEventsOfCurrentSpace();
            this.findTop10MusicMoreUsedInEvents();
          }, err => {
            this.snackBarService.error(err);
          });

          this.subscriptions.add(lastSpaceDatabaseSubscription);
        }
      })

      this.subscriptions.add(spaceSubscription);
    })
  }

  hasNextEvents() {
    if (this.isLoadingNextEvents) {
      return true;
    }
    return this.nextEventsToDisplay?.length > 0;
  }

  openEventDetailsDialog(item: EventDto) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      position: {
        'bottom': '0'
      },
      panelClass: 'full-screen-modal',
      width: '100vw',
      maxWidth: 'max-width: none',
      data: item
    }

    this.dialogService.open(ViewEventDialogComponent, dialogConfig);
  }

  private findAllNextEventsOfCurrentSpace() {
    this.isLoadingNextEvents = true;
    const allNextEventsSubscription = this.eventService.findAllNextEventsBySpace().subscribe(res => {
      this.nextEventsToDisplay = res.slice(0, 2);
      this.isLoadingNextEvents = false;
    }, err => {

      this.isLoadingNextEvents = false;
    });

    this.subscriptions.add(allNextEventsSubscription);
  }

  private findTop10MusicMoreUsedInEvents() {
    this.isLoadingTop10Music = true;
    const topMusicsSubscription = this.musicService.findTop10MusicMoreUsedInEvents().subscribe(res => {
      this.musicTopUserList = res;
      this.isLoadingTop10Music = false;
    }, err => {

      this.isLoadingTop10Music = false;
    });

    this.subscriptions.add(topMusicsSubscription);
  }

}
