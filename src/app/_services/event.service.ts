import { EventDetailsDto } from './swagger-auto-generated/model/eventDetailsDto';
import { ResponseDataEventDetailsDto } from './swagger-auto-generated/model/responseDataEventDetailsDto';
import { ResponseDataEventDto } from './swagger-auto-generated/model/responseDataEventDto';
import { EventWithMusicListDto } from './swagger-auto-generated/model/eventWithMusicListDto';
import { RangeDateEnum } from './model/enums/rangeDateEnum';
import { EventDto } from './swagger-auto-generated/model/eventDto';
import { ResponseDataListEventDto } from './swagger-auto-generated/model/responseDataListEventDto';
import { Observable, throwError } from 'rxjs';
import { SpaceStorageService } from './space-storage.service';
import { EventControllerService } from './swagger-auto-generated/api/eventController.service';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private eventApi: EventControllerService,
    private spaceStorage: SpaceStorageService
  ) { }

  findById(eventId: string): Observable<EventDetailsDto> {
    return this.eventApi.findByIdUsingGET(eventId)
      .pipe(
        catchError(this.handleError),
        map((resData: ResponseDataEventDetailsDto) => {
          return resData?.content || {};
      })
    );
  }

  findAllNextEventsBySpace(): Observable<Array<EventDto>> {
    return this.eventApi.findAllEventsUsingGET(true)
      .pipe(
        catchError(this.handleError),
        map((resData: ResponseDataListEventDto) => {
          return resData?.content || [];
      })
    );
  }

  findAllOldEventsBySpace(rangeDate: RangeDateEnum): Observable<Array<EventDto>> {
    return this.eventApi.findAllEventsUsingGET(false, rangeDate)
      .pipe(
        catchError(this.handleError),
        map((resData: ResponseDataListEventDto) => {
          return resData?.content || [];
      })
    );
  }

  create(body: EventWithMusicListDto): Observable<EventDto> {
    return this.eventApi.createEventUsingPOST(body)
      .pipe(
        catchError(this.handleError),
        map((resData: ResponseDataEventDto) => {
          return resData?.content || {};
      })
    );
  }

  edit(idEvent: string, body: EventWithMusicListDto): Observable<EventDto> {
    return this.eventApi.updateEventUsingPUT(idEvent, body)
      .pipe(
        catchError(this.handleError),
        map((resData: ResponseDataEventDto) => {
          return resData?.content || {};
      })
    );
  }

  private handleError(errorRes: HttpErrorResponse) {

    let errorMessage = 'An unknown error occurred!';

    if (!errorRes.error || !errorRes.error.error.message) {
      return throwError(errorMessage);
    }
    errorMessage = errorRes.error.error.message

    return throwError(errorMessage);
  }
}
