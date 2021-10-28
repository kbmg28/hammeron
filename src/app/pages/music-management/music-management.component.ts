import { SnackBarService } from './../../_services/snack-bar.service';
import { Title } from '@angular/platform-browser';
import { LocalizationService } from './../../internationalization/localization.service';
import { MusicWithSingerAndLinksDto } from './../../_services/swagger-auto-generated/model/musicWithSingerAndLinksDto';
import { MusicService } from './../../_services/music.service';
import { ViewMusicDialogComponent } from './view-music-dialog/view-music-dialog.component';
import { BackPageService } from './../../_services/back-page.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-music-management',
  templateUrl: './music-management.component.html',
  styleUrls: ['./music-management.component.scss']
})
export class MusicManagementComponent implements OnInit, AfterViewInit {

  @ViewChild('searchInput', {static: true}) searchInput?: ElementRef;

  private $data: MusicWithSingerAndLinksDto[] = [];
  data: MusicWithSingerAndLinksDto[] = [];

  constructor(private titleService: Title, private backPageService: BackPageService,
    private dialogService: MatDialog,
    private musicService: MusicService,
    private localizationService: LocalizationService,
    private snackBarService: SnackBarService) {
      this.titleService.setTitle(localizationService.translate('titleRoutesBrowser.songs.management'));
    }

  ngOnInit(): void {
    this.backPageService.setBackPageValue('/home', this.localizationService.translate('section.songs'));
    this.musicService.findAllBySpace()
      .subscribe(res => {

        this.data = this.$data = res.sort((a, b) => a.name.localeCompare(b.name));
      }, err => {
        this.snackBarService.error(err);
      });
  }

  ngAfterViewInit() {
    this.searchMusic();
  }

  openDialog(item: MusicWithSingerAndLinksDto) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      position: {
        'bottom': '0'
      },
      panelClass: 'full-screen-modal',
      width: '100vw',
      maxWidth: 'max-width: none',
      data: item
    }

    this.dialogService.open(ViewMusicDialogComponent, dialogConfig);
  }

  getDetailsMusicItem(item: MusicWithSingerAndLinksDto): string {
    const status = this.localizationService.translate(`music.status.${item.musicStatus}`);
    return `${item?.singer?.name} • ${status}`;
  }

  searchMusic(){
    fromEvent(this.searchInput?.nativeElement, 'keyup')
      .pipe(
          map((event: any) => event.target.value.toString().toLowerCase()),
          debounceTime(150),
          distinctUntilChanged(),
          tap((paramToSearch) => {
            if (paramToSearch) {
              this.data = this.$data.filter((item: MusicWithSingerAndLinksDto) => {
                return item.name.toLowerCase().includes(paramToSearch) ||
                        item.singer.name?.toLowerCase().includes(paramToSearch)
              });
            } else {
              this.data = this.$data;
            }
          })
      )
      .subscribe();
  }
}
