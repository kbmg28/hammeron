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
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

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
    private musicService: MusicService) {
    this.titleService.setTitle(localizationService.translate('titleRoutesBrowser.home'));
   }

  ngOnInit(): void {
    var firstName = this.tokenStorageService.getFirstName();
    this.backPageService.setBackPageValue(undefined, `Olá, ${firstName}`, true);

    this.spaceService.findCurrentSpaceOfUserLogged().subscribe(lastSpace => {
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
    })
  }

  ngAfterViewInit() {

    Promise.resolve().then(() => {
      this.spaceStorage.currentSpace.subscribe(space =>{
        if (this.currentSpace?.spaceId !== space.spaceId) {
          this.currentSpace = space;
          this.findAllNextEventsOfCurrentSpace();
          this.findTop10MusicMoreUsedInEvents();
        }
      })
    })
  }

  hasNextEvents() {
    if (this.isLoadingNextEvents) {
      return true;
    }
    return this.nextEventsToDisplay?.length > 0;
  }

  private findAllNextEventsOfCurrentSpace() {
    this.isLoadingNextEvents = true;
    this.eventService.findAllNextEventsBySpace().subscribe(res => {
      this.nextEventsToDisplay = res.slice(0, 2);
      this.isLoadingNextEvents = false;
    }, err => {

      this.isLoadingNextEvents = false;
    });
  }

  private findTop10MusicMoreUsedInEvents() {
    this.isLoadingTop10Music = true;
    this.musicService.findTop10MusicMoreUsedInEvents().subscribe(res => {
      this.musicTopUserList = res;
      this.isLoadingTop10Music = false;
    }, err => {

      this.isLoadingTop10Music = false;
    });
  }

}
