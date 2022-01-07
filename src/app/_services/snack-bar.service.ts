import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private _snackBar: MatSnackBar) { }

  info(message: string, durationTimeInSeconds: number = 5) {
    this.open(message, durationTimeInSeconds, 'info-snackbar')
  }

  success(message: string, durationTimeInSeconds: number = 5) {
    this.open(message, durationTimeInSeconds, 'success-snackbar')
  }

  warn(message: string, durationTimeInSeconds: number = 5) {
    this.open(message, durationTimeInSeconds, 'warn-snackbar')
  }

  error(message: string, durationTimeInSeconds: number = 5) {
    this.open(message, durationTimeInSeconds, 'error-snackbar')
  }

  private open(message: string, durationTimeInSeconds: number = 5, type: string) {
    if(!message) {
      return;
    }

    const options: MatSnackBarConfig = {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: durationTimeInSeconds * 1000,
      panelClass: [type]
    }
    this._snackBar.open(message, 'X', options);
  }

}
