import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { MusicTopUsedDto, EventDto } from '../../_services/swagger-auto-generated';
import { MusicService } from '../../_services/music.service';
import { EventService } from '../../_services/event.service';
import { SnackBarService } from '../../_services/snack-bar.service';
import { CurrentSpaceStorage } from '../../_services/model/currentSpaceStorage';
import { SpaceService } from '../../_services/space.service';
import { SpaceStorageService } from '../../_services/space-storage.service';
import { BackPageService } from '../../_services/back-page.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { LocalizationService } from '../../internationalization/localization.service';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscriptions = new Subscription();

  isLoadingNextEvents = true;
  isLoadingTop10Music = true;
  isEventWasDeleted = false;

  currentSpace?: CurrentSpaceStorage;
  musicTopUserList: MusicTopUsedDto[] = [];

  nextEventsToDisplay?: Observable<EventDto[]>;
  private currentSubject: BehaviorSubject<EventDto[]> = new BehaviorSubject<EventDto[]>([]);


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
    this.nextEventsToDisplay = this.currentSubject.asObservable();
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
              spaceId: lastSpace.spaceId || '',
              spaceName: lastSpace.name || ''
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
    return this.currentSubject.getValue().length > 0;
  }

  hasTopTenMusic() {
    if (this.isLoadingTop10Music) {
      return true;
    }
    return this.musicTopUserList?.length > 0;
  }

  checkIfShouldReload($event: boolean = false) {
    this.isEventWasDeleted = $event;

    if(this.isEventWasDeleted) {
      this.findAllNextEventsOfCurrentSpace();
    }
  }

  private findAllNextEventsOfCurrentSpace() {
    this.isLoadingNextEvents = true;
    const allNextEventsSubscription = this.eventService.findAllNextEventsBySpace().subscribe(res => {
      this.currentSubject.next(res.slice(0, 2));
      this.isEventWasDeleted = this.isLoadingNextEvents = false;
    }, () => {

      this.isLoadingNextEvents = false;
    });

    this.subscriptions.add(allNextEventsSubscription);
  }

  private findTop10MusicMoreUsedInEvents() {
    this.isLoadingTop10Music = true;
    const topMusicsSubscription = this.musicService.findTop10MusicMoreUsedInEvents(this.currentSpace?.spaceId).subscribe(res => {
      this.musicTopUserList = res;
      this.isLoadingTop10Music = false;
    }, () => {

      this.isLoadingTop10Music = false;
    });

    this.subscriptions.add(topMusicsSubscription);
  }

}
