import { ResponseDataVoid } from './swagger-auto-generated/model/responseDataVoid';
import { EventDetailsDto } from './swagger-auto-generated/model/eventDetailsDto';
import { ResponseDataEventDetailsDto } from './swagger-auto-generated/model/responseDataEventDetailsDto';
import { ResponseDataEventDto } from './swagger-auto-generated/model/responseDataEventDto';
import { EventWithMusicListDto } from './swagger-auto-generated/model/eventWithMusicListDto';
import { RangeDateEnum } from './model/enums/rangeDateEnum';
import { EventDto } from './swagger-auto-generated/model/eventDto';
import { ResponseDataListEventDto } from './swagger-auto-generated/model/responseDataListEventDto';
import { Observable } from 'rxjs';
import { SpaceStorageService } from './space-storage.service';
import { EventControllerService } from './swagger-auto-generated/api/eventController.service';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { handleError } from './../constants/HandlerErrorHttp'
import { createDateAsUTC } from '../constants/DateUtil';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private eventApi: EventControllerService,
    private spaceStorage: SpaceStorageService,
    public datepipe: DatePipe
  ) { }

  findById(eventId: string): Observable<EventDetailsDto> {
    return this.eventApi.findByIdUsingGET(eventId)
      .pipe(
        catchError(handleError),
        map((resData: ResponseDataEventDetailsDto) => {
          return resData?.content || { utcDateTime: new Date()};
      })
    );
  }

  findAllNextEventsBySpace(): Observable<Array<EventDto>> {
    return this.eventApi.findAllEventsUsingGET(true)
      .pipe(
        catchError(handleError),
        map((resData: ResponseDataListEventDto) => {
          return resData?.content || [];
        })
      );
  }

  findAllOldEventsBySpace(rangeDate: RangeDateEnum): Observable<Array<EventDto>> {
    return this.eventApi.findAllEventsUsingGET(false, rangeDate)
      .pipe(
        catchError(handleError),
        map((resData: ResponseDataListEventDto) => {
          return resData?.content || [];
        })
      );
  }

  create(body: EventWithMusicListDto): Observable<EventDto> {
    return this.eventApi.createEventUsingPOST(body)
      .pipe(
        catchError(handleError),
        map((resData: ResponseDataEventDto) => {
          return resData?.content || {};
      })
    );
  }

  edit(idEvent: string, body: EventWithMusicListDto): Observable<EventDto> {
    return this.eventApi.updateEventUsingPUT(idEvent, body)
      .pipe(
        catchError(handleError),
        map((resData: ResponseDataEventDto) => {
          return resData?.content || {};
      })
    );
  }

  delete(idEvent: string): Observable<void> {
    return this.eventApi.deleteEventUsingDELETE(idEvent)
      .pipe(
        catchError(handleError),
        map((resData: ResponseDataVoid) => {
          return;
      })
    );
  }

}
