import { TokenStorageService } from './../../_services/token-storage.service';
import { SpaceStorageService } from './../../_services/space-storage.service';
import { ViewEventDialogComponent } from './view-event-dialog/view-event-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ElementSelectStaticApp } from './../../_services/model/ElementSelectStaticApp';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { EventDto } from './../../_services/swagger-auto-generated/model/eventDto';
import { EventService } from './../../_services/event.service';
import { SnackBarService } from './../../_services/snack-bar.service';
import { RangeDateEnum } from '../../_services/model/enums/rangeDateEnum';
import { LocalizationService } from './../../internationalization/localization.service';
import { Title } from '@angular/platform-browser';
import { BackPageService } from './../../_services/back-page.service';
import { Component, OnInit, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { MatChip, MatChipList } from '@angular/material/chips';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { UserPermissionEnum } from 'src/app/_services/model/enums/userPermissionEnum';

@Component({
  selector: 'app-event-management',
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventManagementComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  private _myEvents?: ElementSelectStaticApp;
  private _currentTab: number = 1;
  private _rangeDate: RangeDateEnum = RangeDateEnum.CURRENT_MONTH;
  private _dataNextEvents: EventDto[] = [];
  private _dataOldEvents: EventDto[] = [];

  chipRangeList?: ElementSelectStaticApp[];
  myEventsTab1: ElementSelectStaticApp;
  myEventsTab2: ElementSelectStaticApp;

  isLoadingNextEvents = true;
  isLoadingOldEvents = false;

  totalNextEvents?: number;
  totalOldEvents?: number;

  eventsFiltered?: Observable<EventDto[]>;

  private currentSubject?: BehaviorSubject<EventDto[]>;

  constructor(private titleService: Title,
    private backPageService: BackPageService,
    private localizationService: LocalizationService,
    private dialogService: MatDialog,
    private snackBarService: SnackBarService,
    private eventService: EventService,
    private tokenStorageService: TokenStorageService) {
      this._myEvents = {
        displayValue: localizationService.translate('event.chip.myEvents'),
        isSelected: false
      };

      this.myEventsTab1 = this.myEventsTab2 = this._myEvents;
    }

  ngOnInit(): void {
    this.backPageService.setBackPageValue('/home', this.localizationService.translate('section.events'));
    this.chipRangeList = Object.values(RangeDateEnum).map(range => {
      return {
        ref: range,
        displayValue: this.localizationService.translate(`event.rangeDate.${range}`),
        isSelected: (range === RangeDateEnum.CURRENT_MONTH)
      }
    });

    this.currentSubject = new BehaviorSubject<EventDto[]>([]);
    this.eventsFiltered = this.currentSubject.asObservable();

    this.loadNextEvents();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  canAddEvent(): boolean {
    const permissions = new Set<string>(this.tokenStorageService.getUserLogged().permissions);

    return permissions.has(UserPermissionEnum.SPACE_OWNER);
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

    const dialogRef = this.dialogService.open(ViewEventDialogComponent, dialogConfig);

    const dialogRefSub = dialogRef.afterClosed().subscribe((wasDeleted: boolean) => {
      if(wasDeleted) {
        this.loadNextEvents();
      }
    }, err => {
    });

    this.subscriptions.add(dialogRefSub);
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    this._currentTab = ++tabChangeEvent.index;
    this.currentSubject?.next([]);

    if (this._currentTab === 1) {
      this.loadNextEvents();
    } else {
      this.loadOldEvents();
    }
  }

  loadNextEvents() {
    this.isLoadingNextEvents = true;
    const findAllNextSub = this.eventService.findAllNextEventsBySpace().subscribe(res => {
      this._dataNextEvents = res;
      this.totalNextEvents = res.length;

      this.checkFilterMyEvents(this._dataNextEvents, this.myEventsTab1)
      this.isLoadingNextEvents = false;
    }, err => {

      this.isLoadingNextEvents = false;
    });

    this.subscriptions.add(findAllNextSub);
  }

  private checkFilterMyEvents(dataEventList: EventDto[], myEventChip: ElementSelectStaticApp) {
    var eventFilteredList;

    if (myEventChip?.isSelected) {
      eventFilteredList = dataEventList.filter(e => e.isUserLoggedIncluded);
      if (myEventChip.isSelected && dataEventList.length === eventFilteredList.length && dataEventList.length > 0) {
        this.snackBarService.info(this.localizationService.translate('event.userLoggedInAllEvents'));
      }
    } else {
      eventFilteredList = dataEventList;
    }

    this.currentSubject?.next(eventFilteredList);
  }

  loadOldEvents() {
    this.isLoadingOldEvents = true;
    const findAllOldSub = this.eventService.findAllOldEventsBySpace(this._rangeDate).subscribe(res => {
      this._dataOldEvents = res;
      this.totalOldEvents = res.length;

      this.checkFilterMyEvents(this._dataOldEvents, this.myEventsTab2)
      this.isLoadingOldEvents = false;
    }, err => {

      this.isLoadingOldEvents = false;
    });

    this.subscriptions.add(findAllOldSub);
  }

  toggleSelection(list: MatChipList, chipSelected: MatChip, item?: ElementSelectStaticApp) {
    const ref = (item && item?.ref) ? item.ref : '';
    var myEventSelected: boolean = this.myEventsTab2.isSelected;

    if (ref in RangeDateEnum) {
      this._rangeDate = RangeDateEnum[ref as keyof typeof RangeDateEnum];
      list.chips.filter(chipItem => chipItem.value.trim() !== this._myEvents?.displayValue.trim() && chipItem.selected)
          .forEach(chipItem => chipItem.toggleSelected());

      this.loadOldEvents();
    } else {
      myEventSelected = !chipSelected.selected;
    }

    chipSelected.toggleSelected();

    if (this._currentTab === 1) {
      this.myEventsTab1 = {
        ref: this.myEventsTab1?.ref,
        displayValue: this.myEventsTab1?.displayValue || "",
        isSelected: chipSelected.selected
      };
      this.checkFilterMyEvents(this._dataNextEvents, this.myEventsTab1)
    } else {
      this.myEventsTab2 = {
        ref: this.myEventsTab2?.ref,
        displayValue: this.myEventsTab2?.displayValue || "",
        isSelected: myEventSelected
      };
      this.checkFilterMyEvents(this._dataOldEvents, this.myEventsTab2)
    }

  }

  hasNextEvents() {
    if(this.isLoadingNextEvents) {
      return true;
    }
    return this._dataNextEvents && this._dataNextEvents.length > 0;
  }

  hasOldEvents() {
    if(this.isLoadingOldEvents) {
      return true;
    }
    return this._dataOldEvents && this._dataOldEvents.length > 0;
  }
}
