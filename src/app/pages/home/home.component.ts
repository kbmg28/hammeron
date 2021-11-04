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
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isLoggedIn = false;
  isLoadingNextEvents = true;

  nextEventsToDisplay: EventDto[] = [];

  constructor(private titleService: Title,
    private localizationService: LocalizationService,
    private backPageService: BackPageService,
    private tokenStorageService: TokenStorageService,
    private spaceService: SpaceService,
    private spaceStorage: SpaceStorageService,
    private snackBarService: SnackBarService,
    private eventService: EventService) {
    this.titleService.setTitle(localizationService.translate('titleRoutesBrowser.home'));
   }

  ngOnInit(): void {
    var firstName = this.tokenStorageService.getFirstName();
    this.backPageService.setBackPageValue(undefined, `Olá, ${firstName}`);

    this.spaceService.findCurrentSpaceOfUserLogged().subscribe(lastSpace => {
      const currentSpace: CurrentSpaceStorage = {
        spaceId: lastSpace.spaceId,
        spaceName: lastSpace.name
      };

      this.spaceStorage.saveSpace(currentSpace);
      //this.snackBarService.success(err);
    }, err => {
      this.snackBarService.error(err);
    })

    this.isLoadingNextEvents = true;
    this.eventService.findAllNextEventsBySpace().subscribe(res => {
      this.nextEventsToDisplay = res.slice(0, 2);
      this.isLoadingNextEvents = false;
    }, err => {

      this.isLoadingNextEvents = false;
    })
  }

  hasNextEvents() {
    return !this.isLoadingNextEvents && this.nextEventsToDisplay?.length > 0
  }
}
