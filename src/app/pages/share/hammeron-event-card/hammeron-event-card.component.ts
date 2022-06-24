import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {EventDto} from "../../../_services/swagger-auto-generated";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ViewEventDialogComponent} from "../../event-management/view-event-dialog/view-event-dialog.component";
import {SnackBarService} from "../../../_services/snack-bar.service";

@Component({
  selector: 'app-hammeron-event-card',
  templateUrl: './hammeron-event-card.component.html',
  styleUrls: ['./hammeron-event-card.component.scss']
})
export class HammeronEventCardComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  @Input()
  eventsObs$?: Observable<EventDto[]>;

  @Input()
  keyMessageNoEventDescribe: string = 'event.noNextEventsDescribe';

  @Input()
  dateFormat: string = 'EEEE, d MMMM';

  @Input()
  loadingWidth: any = 320;

  @Input()
  isLoading: boolean = false;

  @Input()
  hasEvents: boolean = false;

  @Input()
  isEventWasDeleted: boolean = false;

  @Output() isEventWasDeletedChange = new EventEmitter<boolean>();

  constructor(
    private dialogService: MatDialog,
    private snackBarService: SnackBarService) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  openEventDetailsDialog(item: EventDto) {
    let dialogConfig = {
      position: {
        'bottom': '0'
      },
      data: item
    }

    const dialogRef = this.dialogService.open(ViewEventDialogComponent, dialogConfig);

    const dialogRefSub = dialogRef.afterClosed().subscribe((wasDeleted: boolean) => {
      this.isEventWasDeletedChange.emit(wasDeleted);
    }, () => {}
    );

    this.subscriptions.add(dialogRefSub);
  }
}
