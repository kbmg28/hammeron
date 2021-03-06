import { Subscription } from 'rxjs';
import { MusicLinkDto } from '../../../_services/swagger-auto-generated';
import { MusicLink } from '../../../_services/model/musicLink';
import { LocalizationService } from '../../../internationalization/localization.service';
import { SnackBarService } from '../../../_services/snack-bar.service';
import { EventDto } from '../../../_services/swagger-auto-generated';
import { MusicWithSingerAndLinksDto } from '../../../_services/swagger-auto-generated';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MusicService } from 'src/app/_services/music.service';

@Component({
  selector: 'app-view-music-dialog',
  templateUrl: './view-music-dialog.component.html',
  styleUrls: ['./view-music-dialog.component.scss']
})
export class ViewMusicDialogComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  data: MusicWithSingerAndLinksDto;
  eventList?: EventDto[];
  musicLinkList?: MusicLink[];
  isLoadingEvents = true;
  isOpenYouTubeMiniPlayer = false;

  constructor(private dialogRef: MatDialogRef<ViewMusicDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: MusicWithSingerAndLinksDto,
    private musicService: MusicService,
    private snackBarService: SnackBarService,
    private localizationService: LocalizationService) {
      this.data = data;
    }

  ngOnInit(): void {
    this.generateLinkList();
    this.findEventList();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  close() {
    this.dialogRef.close();
  }

  hasNoEventsAssociated() {
    return this.eventList && this.eventList.length > 0;
  }

  translateMusicStatus(musicStatus: string) {
    return this.localizationService.translate(`music.status.${musicStatus}`);
  }

  getBackgroundColorStatus(musicStatus: string): string {
    var color = '';

    switch(musicStatus) {
      case MusicWithSingerAndLinksDto.MusicStatusEnum.ENABLED: color = '#E6F5F4'; break;
      case MusicWithSingerAndLinksDto.MusicStatusEnum.DISABLED: color = '#CBCED5'; break;
      case MusicWithSingerAndLinksDto.MusicStatusEnum.REJECTED: color = '#FFDADA'; break;
    }

    return color;
  }

  getDescribeStatus(musicStatus: string): string {
    return this.localizationService.translate(`music.statusDescribe.${musicStatus}`);
  }

  showCopyLinkNotification() {
    this.snackBarService.info(this.localizationService.translate('music.linkCopied'), 2);
  }

  hasEvents() {
    if(this.isLoadingEvents) {
      return true;
    }
    return this.eventList && this.eventList.length > 0;
  }

  getYoutubeId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    const res = (match && match[2].length === 11)
      ? match[2]
      : null;

    return `https://www.youtube.com/embed/${res}`;
  }

  private findEventList() {
    this.isLoadingEvents = true;
    const eventListSub = this.musicService.findOldEventsFromRange3Months(this.data.id || '')
      .subscribe(res => {
        this.eventList = res.events;

        this.isLoadingEvents = false;
      }, err => {
        this.snackBarService.error(err);
        this.isLoadingEvents = false;
      });

    this.subscriptions.add(eventListSub);
  }

  private generateLinkList() {
    this.musicLinkList = this.data.links?.map(linkRef => {
      let png, displayValue;
      let order = '';

      switch (linkRef.typeLink) {
        case MusicLinkDto.TypeLinkEnum.YOUTUBE: {
          png = '/assets/png/youtube.png';
          displayValue = 'YouTube';
          order = "1";
        } break;

        case MusicLinkDto.TypeLinkEnum.SPOTIFY: {
          png = '/assets/png/spotify.png';
          displayValue = 'Spotify';
          order = "2";
        } break;

        case MusicLinkDto.TypeLinkEnum.CHORD: {
          png = '/assets/png/cifraclub.png';
          displayValue = 'CifraClub';
          order = "3";
        } break;
      }

      var musicLink: MusicLink = {
        pngRef: png,
        displayValue: displayValue,
        link: linkRef.link,
        order: order,
        typeLink: linkRef.typeLink
      };

      return musicLink;
    }).sort((a, b) => a.order.localeCompare(b.order));
  }

  openYouTubeMiniPlayer(typeLink?: string): void {
    if (typeLink === MusicLinkDto.TypeLinkEnum.YOUTUBE) {
      this.isOpenYouTubeMiniPlayer = !this.isOpenYouTubeMiniPlayer;
    }
  }
}
