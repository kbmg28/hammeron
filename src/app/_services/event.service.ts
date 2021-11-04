import { RangeDate } from './model/rangeDateEnum';
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

  findAllNextEventsBySpace(): Observable<Array<EventDto>> {
    const spaceId = this.spaceStorage.getSpace().spaceId;

    return this.eventApi.findAllEventsUsingGET(spaceId, true)
      .pipe(
        catchError(this.handleError),
        map((resData: ResponseDataListEventDto) => {
          return resData?.content || [];
      })
    );
  }

  findAllOldEventsBySpace(rangeDate: RangeDate): Observable<Array<EventDto>> {
    const spaceId = this.spaceStorage.getSpace().spaceId;

    return this.eventApi.findAllEventsUsingGET(spaceId, false, rangeDate)
      .pipe(
        catchError(this.handleError),
        map((resData: ResponseDataListEventDto) => {
          return resData?.content || [];
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
