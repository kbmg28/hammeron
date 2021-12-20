import { LocalizationService } from './../../../internationalization/localization.service';
import { EventService } from './../../../_services/event.service';
import { SnackBarService } from './../../../_services/snack-bar.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-delete-event-dialog',
  templateUrl: './delete-event-dialog.component.html',
  styleUrls: ['./delete-event-dialog.component.scss']
})
export class DeleteEventDialogComponent implements OnInit {

  idEvent: string;
  isLoadingDeletion = false;

  constructor(private dialogRef: MatDialogRef<DeleteEventDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data: string,
              private eventService: EventService,
              private snackBarService: SnackBarService,
              private localizationService: LocalizationService) {
    this.idEvent = data;
  }

  ngOnInit(): void {
  }

  cancel() {
    this.close(false);
  }

  delete() {
    this.isLoadingDeletion = true;
    this.eventService.delete(this.idEvent).subscribe(() => {
      const message = this.localizationService.translate('snackBar.deleteSuccessfully');
      this.snackBarService.success(message);

      this.isLoadingDeletion = false;
      this.close(true);
    }, err => {
      this.snackBarService.error(err);
      this.isLoadingDeletion = false;
      this.cancel();
    })
  }

  private close(param: boolean) {
    this.dialogRef.close(param);
  }

}
