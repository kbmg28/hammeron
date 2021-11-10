import { EventDto } from './../../../_services/swagger-auto-generated/model/eventDto';
import { LocalizationService } from './../../../internationalization/localization.service';
import { SnackBarService } from './../../../_services/snack-bar.service';
import { MusicWithSingerAndLinksDto } from './../../../_services/swagger-auto-generated/model/musicWithSingerAndLinksDto';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MusicService } from 'src/app/_services/music.service';

@Component({
  selector: 'app-delete-music-dialog',
  templateUrl: './delete-music-dialog.component.html',
  styleUrls: ['./delete-music-dialog.component.scss']
})
export class DeleteMusicDialogComponent implements OnInit {
  data: MusicWithSingerAndLinksDto;
  eventList?: EventDto[];

  isLoading: boolean = false;

  constructor(private dialogRef: MatDialogRef<DeleteMusicDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: MusicWithSingerAndLinksDto,
            private musicService: MusicService,
            private snackBarService: SnackBarService,
            private localizationService: LocalizationService) {
      this.data = data;
    }

  ngOnInit(): void {
    this.findEventList();
  }

  close(reloadList: boolean = false) {
    this.dialogRef.close(reloadList);
  }

  hasNoEventsAssociated() {
    return this.eventList && this.eventList.length > 0;
  }

  onDeleteMusic() {
    this.musicService.delete(this.data?.id || '').subscribe(() => {

      this.isLoading = false;
      this.snackBarService.success(this.localizationService.translate('snackBar.deleteSuccessfully'), 10);
      this.close(true);
    },
      err => {
        this.isLoading = false;
        this.snackBarService.error(err);
      }
    );
  }

  private findEventList() {
    this.musicService.findAllEventsOfMusic(this.data.id || '')
      .subscribe(res => {
        this.eventList = res.events;
      }, err => {
        this.snackBarService.error(err);
      });
  }

}
