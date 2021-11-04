import { Observable, BehaviorSubject } from 'rxjs';
import { EventDto } from './../../_services/swagger-auto-generated/model/eventDto';
import { EventService } from './../../_services/event.service';
import { SnackBarService } from './../../_services/snack-bar.service';
import { RangeDate } from './../../_services/model/rangeDateEnum';
import { LocalizationService } from './../../internationalization/localization.service';
import { Title } from '@angular/platform-browser';
import { BackPageService } from './../../_services/back-page.service';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { MatChip, MatChipList } from '@angular/material/chips';
import { MatTabChangeEvent } from '@angular/material/tabs';

export interface ChipFilter {
  ref?: string
  displayValue: string,
  isSelected: boolean
}
@Component({
  selector: 'app-event-management',
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EventManagementComponent implements OnInit {
  private _myEvents?: ChipFilter;
  private _currentTab: number = 1;
  private _rangeDate: RangeDate = RangeDate.CURRENT_MONTH;
  private _dataNextEvents: EventDto[] = [];
  private _dataOldEvents: EventDto[] = [];

  chipRangeList?: ChipFilter[];
  myEventsTab1: ChipFilter;
  myEventsTab2: ChipFilter;

  isLoadingNextEvents = true;
  isLoadingOldEvents = false;

  eventsFiltered?: Observable<EventDto[]>;

  private currentSubject?: BehaviorSubject<EventDto[]>;

  constructor(private titleService: Title,
    private backPageService: BackPageService,
    private localizationService: LocalizationService,
    private snackBarService: SnackBarService,
    private eventService: EventService) {
      this._myEvents = {
        displayValue: localizationService.translate('event.chip.myEvents'),
        isSelected: false
      };

      this.myEventsTab1 = this.myEventsTab2 = this._myEvents;
    }

  ngOnInit(): void {
    this.backPageService.setBackPageValue('/home', this.localizationService.translate('section.events'));
    this.chipRangeList = Object.values(RangeDate).map(range => {
      return {
        ref: range,
        displayValue: this.localizationService.translate(`event.rangeDate.${range}`),
        isSelected: (range === RangeDate.CURRENT_MONTH)
      }
    })

    this.currentSubject = new BehaviorSubject<EventDto[]>([]);
    this.eventsFiltered = this.currentSubject.asObservable();

    this.loadNextEvents();
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    this._currentTab = ++tabChangeEvent.index;

    if (this._currentTab === 1) {
      this.loadNextEvents();
    } else {
      this.loadOldEvents();
    }
  }

  loadNextEvents() {
    this.isLoadingNextEvents = true;
    this.eventService.findAllNextEventsBySpace().subscribe(res => {
      this._dataNextEvents = res;

      this.checkFilterMyEvents(this._dataNextEvents, this.myEventsTab1)
      this.isLoadingNextEvents = false;
    }, err => {

      this.isLoadingNextEvents = false;
    })
  }

  private checkFilterMyEvents(dataEventList: EventDto[], myEventChip: ChipFilter) {
    var eventFilteredList;

    if (myEventChip?.isSelected) {
      eventFilteredList = dataEventList.filter(e => e.isUserLoggedIncluded);
      if (myEventChip.isSelected && dataEventList.length === eventFilteredList.length) {
        this.snackBarService.info(this.localizationService.translate('event.userLoggedInAllEvents'));
      }
    } else {
      eventFilteredList = dataEventList;
    }

    this.currentSubject?.next(eventFilteredList);
  }

  loadOldEvents() {
    this.isLoadingOldEvents = true;
    this.eventService.findAllOldEventsBySpace(this._rangeDate).subscribe(res => {
      this._dataOldEvents = res;

      this.checkFilterMyEvents(this._dataOldEvents, this.myEventsTab2)
      this.isLoadingOldEvents = false;
    }, err => {

      this.isLoadingOldEvents = false;
    })
  }

  toggleSelection(list: MatChipList, chipSelected: MatChip, item?: ChipFilter) {
    const ref = (item && item?.ref) ? item.ref : '';
    var myEventSelected: boolean = this.myEventsTab2.isSelected;

    if (ref in RangeDate) {
      this._rangeDate = RangeDate[ref as keyof typeof RangeDate];
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
}
