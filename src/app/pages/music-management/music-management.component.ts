import { SingersFilterDialogComponent } from './singers-filter-dialog/singers-filter-dialog.component';
import { SnackBarService } from './../../_services/snack-bar.service';
import { Title } from '@angular/platform-browser';
import { LocalizationService } from './../../internationalization/localization.service';
import { MusicWithSingerAndLinksDto } from './../../_services/swagger-auto-generated/model/musicWithSingerAndLinksDto';
import { MusicService } from './../../_services/music.service';
import { ViewMusicDialogComponent } from './view-music-dialog/view-music-dialog.component';
import { BackPageService } from './../../_services/back-page.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap, map } from 'rxjs/operators';
import { MatChip } from '@angular/material/chips';

@Component({
  selector: 'app-music-management',
  templateUrl: './music-management.component.html',
  styleUrls: ['./music-management.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MusicManagementComponent implements OnInit, AfterViewInit {

  @ViewChild('searchInput', {static: true}) searchInput?: ElementRef;

  private $paramToSearch: string = '';
  private $data: MusicWithSingerAndLinksDto[] = [];
  private $singersData: Array<string> = new Array<string>();

  data: MusicWithSingerAndLinksDto[] = [];
  selectedSingersList: Array<string> = new Array<string>();
  selectedMusicStatus?: string;
  musicStatusList: Array<string> = Object.keys(MusicWithSingerAndLinksDto.MusicStatusEnum);

  constructor(private titleService: Title,
    private backPageService: BackPageService,
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

        this.$singersData = this.$data
              .map(music => music.singer.name)
              .sort()
              .reduce((init: string[], current) => {
                if (init.length === 0 || init[init.length - 1] !== current) {
                    init.push(current);
                }
                return init;
              }, []);
      }, err => {
        this.snackBarService.error(err);
      });
  }

  ngAfterViewInit() {
    this.searchMusic();
  }

  openMusicDetailsDialog(item: MusicWithSingerAndLinksDto) {
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

  openSingersFilterDialog() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      position: {
        'bottom': '0'
      },
      panelClass: 'full-screen-modal',
      width: '100vw',
      maxWidth: 'max-width: none',
      data: this.$singersData
    }

    const dialogRef = this.dialogService.open(SingersFilterDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: Array<string>) => {
      this.selectedSingersList = result || [];

      this.musicFullFilter();
    });
  }

  private musicFullFilter() {
    if (this.hasSelectedSingers()) {
      var dataFilter = this.filterOfSingersSelected();

      dataFilter = this.filterByMusicStatus(dataFilter);

      this.data = (this.$paramToSearch !== '') ? this.filterByArgument(dataFilter, this.$paramToSearch) : dataFilter;

    } else {

      const dataFilter = this.filterByMusicStatus(this.$data);
      this.data = (this.$paramToSearch === '') ? dataFilter : this.filterByArgument(dataFilter, this.$paramToSearch);
    }
  }

  private filterByArgument(arr: MusicWithSingerAndLinksDto[], arg: string): MusicWithSingerAndLinksDto[] {
    if (arg.length > 0) {
      return arr.filter((item: MusicWithSingerAndLinksDto) => {
        return item.name.toLowerCase().includes(arg) ||
                item.singer.name?.toLowerCase().includes(arg)
      });
    }

    return this.$data;
  }

  private filterByMusicStatus(arr: MusicWithSingerAndLinksDto[]): MusicWithSingerAndLinksDto[] {
    if (this.selectedMusicStatus) {
      return arr.filter((item: MusicWithSingerAndLinksDto) => {
                return item.musicStatus.toUpperCase() === this.selectedMusicStatus?.toUpperCase();
      });
    }

    return arr;
  }

  private filterOfSingersSelected(): MusicWithSingerAndLinksDto[] {

    const allSingersWithLowerCase = this.selectedSingersList?.map(res => res.toLocaleLowerCase());

    return this.$data.filter((item: MusicWithSingerAndLinksDto) => {
      return allSingersWithLowerCase.some(a => a.toString() === item.singer.name.toLowerCase());
    });
  }

  getDetailsMusicItem(item: MusicWithSingerAndLinksDto): string {
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

  searchMusic(){
    fromEvent(this.searchInput?.nativeElement, 'keyup')
      .pipe(
          map((event: any) => event.target.value.toString().toLowerCase()),
          debounceTime(150),
          distinctUntilChanged(),
          tap((paramToSearch) => {
            this.$paramToSearch = (paramToSearch) ? paramToSearch : '';
            this.musicFullFilter();
          })
      )
      .subscribe();
  }

  hasSelectedSingers(): boolean {
    return this.selectedSingersList.length > 0;
  }

  toggleSelection(chip: MatChip, item: string) {
    if (!chip.selected) {
      this.selectedMusicStatus = item;
    } else {
      this.selectedMusicStatus = undefined;
    }
    this.musicFullFilter();
    chip.toggleSelected();
 }
}
