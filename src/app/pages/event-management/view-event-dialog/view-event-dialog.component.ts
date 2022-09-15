import { Subscription } from 'rxjs';
import { TokenStorageService } from '../../../_services/token-storage.service';
import { DeleteEventDialogComponent } from '../delete-event-dialog/delete-event-dialog.component';
import {
  EventDetailsDto,
  MusicLinkDto,
  UserDto,
  MusicWithSingerAndLinksDto,
  SingerDto,
  EventDto
} from '../../../_services/swagger-auto-generated';
import {MusicLink} from '../../../_services/model/musicLink';
import {EventService} from '../../../_services/event.service';
import {SnackBarService} from '../../../_services/snack-bar.service';
import {LocalizationService} from '../../../internationalization/localization.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { UserPermissionEnum } from 'src/app/_services/model/enums/userPermissionEnum';

interface MusicDetails {
  id?: string;
  name: string;
  musicStatus: MusicWithSingerAndLinksDto.MusicStatusEnum;
  singer: SingerDto;
  links?: Array<MusicLink>;
  youtubeEmbedLink?: string;
}

@Component({
  selector: 'app-view-event-dialog',
  templateUrl: './view-event-dialog.component.html',
  styleUrls: ['./view-event-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewEventDialogComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  event: EventDto;
  eventDetails?: EventDetailsDto;
  isOpenedDeleteDialog = false;
  musicDetailsList: MusicDetails[] = [];
  userList: UserDto[] = [];

  isLoadingEventInfo = true;

  constructor(private dialogRef: MatDialogRef<ViewEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: EventDto,
    private localizationService: LocalizationService,
    private snackBarService: SnackBarService,
    private dialogService: MatDialog,
    private eventService: EventService,
    private tokenStorageService: TokenStorageService) {
      this.event = data;
    }

  ngOnInit(): void {
    this.isLoadingEventInfo = true;
    const findEventByIdSub = this.eventService.findById(this.event.id || '').subscribe(res => {
      this.eventDetails = res;
      this.userList = res.userList || [];

      this.generateMusicDetailsList(res.musicList || []);
      dispatchEvent(new Event('resize'));
      this.isLoadingEventInfo = false;
    }, err => {
      this.snackBarService.error(err);
      this.isLoadingEventInfo = false;
      this.close(false);
    });

    this.subscriptions.add(findEventByIdSub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  hasMusics() {
    if(this.isLoadingEventInfo) {
      return true;
    }
    return this.musicDetailsList && this.musicDetailsList.length > 0;
  }

  hasPeoples() {
    if(this.isLoadingEventInfo) {
      return true;
    }
    return this.userList && this.userList.length > 0;
  }

  canDeleteEvent(): boolean {
    const permissions = new Set<string>(this.tokenStorageService.getUserLogged().permissions);

    return this.isValidToEdit() && permissions.has(UserPermissionEnum.SPACE_OWNER);
  }

  close(wasDeleted: boolean) {
    this.dialogRef.close(wasDeleted);
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
    }

    return color;
  }

  isValidToEdit(): boolean {
    const today = new Date();
    today.setHours(today.getHours() - 2);

    const utcDateTime = this.eventDetails?.utcDateTime;

    if (!utcDateTime) {
      return false;
    }

    return new Date(utcDateTime) >= today;
  }

  openDeleteDialog(): void {
    this.isOpenedDeleteDialog = true;
    const dialogRef = this.dialogService.open(DeleteEventDialogComponent, {
      disableClose: true,
      data: this.event.id
    });

    const dialogRefSub = dialogRef.afterClosed().subscribe((wasDeleted: boolean) => {
      if(wasDeleted) {
        this.close(true);
      }

      this.isOpenedDeleteDialog = false;
    }, () => {
      this.isOpenedDeleteDialog = false;
    });

    this.subscriptions.add(dialogRefSub);
  }

  getYoutubeId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    const res = (match && match[2].length === 11)
      ? match[2]
      : null;

    return `https://www.youtube.com/embed/${res}?autoplay=1`;
  }

  private generateMusicDetailsList(list: MusicWithSingerAndLinksDto[]) {

    this.musicDetailsList = list.map(dto => {

      let musicLinks = this.generateLinkList(dto.links || []);
      let youtubeEmbedLink = '';

      if (musicLinks.length > 0) {

        let firstLink = musicLinks[0];

        if (firstLink.typeLink === MusicLinkDto.TypeLinkEnum.YOUTUBE) {
          youtubeEmbedLink = this.getYoutubeId(firstLink.link || '');
        }

      }

      var musicLink: MusicDetails = {
        id: dto.id,
        name: dto.name,
        singer: dto.singer,
        musicStatus: dto.musicStatus,
        links: musicLinks,
        youtubeEmbedLink: youtubeEmbedLink
      };

      return musicLink;
    });
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

}
