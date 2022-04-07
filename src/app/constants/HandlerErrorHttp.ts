import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';


export function handleError(errorRes: HttpErrorResponse) {
  let errorMessage = '';

  if (![0, 401, 302].find(statusNum => statusNum === errorRes.status)) {
    errorMessage = (!errorRes.error || !errorRes.error.error || !errorRes.error.error.message) ?
        '' :
        errorRes.error.error.message
  } else {
    errorMessage = '';
  }

  return throwError(errorMessage);
}
