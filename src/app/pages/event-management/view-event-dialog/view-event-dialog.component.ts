import { UserDto } from './../../../_services/swagger-auto-generated/model/userDto';
import { SingerDto } from './../../../_services/swagger-auto-generated/model/singerDto';
import { MusicLinkDto } from './../../../_services/swagger-auto-generated/model/musicLinkDto';
import { MusicLink } from './../../../_services/model/musicLink';
import { EventDto } from './../../../_services/swagger-auto-generated/model/eventDto';
import { EventService } from './../../../_services/event.service';
import { SnackBarService } from './../../../_services/snack-bar.service';
import { LocalizationService } from './../../../internationalization/localization.service';
import { MusicWithSingerAndLinksDto } from './../../../_services/swagger-auto-generated/model/musicWithSingerAndLinksDto';
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';

interface MusicDetails {
  id?: string;
  name: string;
  musicStatus: MusicWithSingerAndLinksDto.MusicStatusEnum;
  singer: SingerDto;
  links?: Array<MusicLink>;
}

@Component({
  selector: 'app-view-event-dialog',
  templateUrl: './view-event-dialog.component.html',
  styleUrls: ['./view-event-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewEventDialogComponent implements OnInit {

  event: EventDto;
  panelOpenState = false;
  musicDetailsList: MusicDetails[] = [];
  userList: UserDto[] = [];

  constructor(private dialogRef: MatDialogRef<ViewEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: EventDto,
    private localizationService: LocalizationService,
    private snackBarService: SnackBarService,
    private eventService: EventService) {
      this.event = data;
    }

  ngOnInit(): void {
    this.eventService.findById(this.event.id || '').subscribe(res => {
      this.userList = res.userList || [];
      this.generateMusicDetailsList(res.musicList || []);
    }, err => {

    });
  }

  close() {
    this.dialogRef.close();
  }

  getDetailsMusicItem(item: MusicDetails): string {
    return `${item?.singer?.name} • `;
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

  private generateMusicDetailsList(list: MusicWithSingerAndLinksDto[]) {

    this.musicDetailsList = list.map(dto => {
      var musicLink: MusicDetails = {
        id: dto.id,
        name: dto.name,
        singer: dto.singer,
        musicStatus: dto.musicStatus,
        links: this.generateLinkList(dto.links || [])
      };

      return musicLink;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }

  private generateLinkList(linkList: MusicLinkDto[]): MusicLink[] {
    return linkList.map(linkRef => {
      let png, displayValue;
      let order = '';

      switch (linkRef.typeLink) {
        case MusicLinkDto.TypeLinkEnum.YOUTUBE: {
          png = '/assets/png/youtube.png';
          displayValue = 'YouTube';
          order = "1";
        }; break;

        case MusicLinkDto.TypeLinkEnum.SPOTIFY: {
          png = '/assets/png/spotify.png';
          displayValue = 'Spotify';
          order = "2";
        }; break;

        case MusicLinkDto.TypeLinkEnum.CHORD: {
          png = '/assets/png/cifraclub.png';
          displayValue = 'CifraClub';
          order = "3";
        }; break;
      }

      var musicLink: MusicLink = {
        pngRef: png,
        displayValue: displayValue,
        link: linkRef.link,
        order: order
      };

      return musicLink;
    }).sort((a, b) => a.order.localeCompare(b.order));
  }

}
