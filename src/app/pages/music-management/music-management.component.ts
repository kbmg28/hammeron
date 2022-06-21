import { DeleteMusicDialogComponent } from './delete-music-dialog/delete-music-dialog.component';
import { MusicStatusEnum } from 'src/app/_services/model/enums/musicStatusEnum';
import { ElementSelectStaticApp } from '../../_services/model/ElementSelectStaticApp';
import { SingersFilterDialogComponent } from './singers-filter-dialog/singers-filter-dialog.component';
import { SnackBarService } from '../../_services/snack-bar.service';
import { Title } from '@angular/platform-browser';
import { LocalizationService } from '../../internationalization/localization.service';
import { MusicWithSingerAndLinksDto } from '../../_services/swagger-auto-generated';
import { MusicService } from '../../_services/music.service';
import { ViewMusicDialogComponent } from './view-music-dialog/view-music-dialog.component';
import { BackPageService } from '../../_services/back-page.service';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {BehaviorSubject, Observable, Subject, Subscription} from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, map } from 'rxjs/operators';
import { MatChip } from '@angular/material/chips';
import {UserLogged} from "../auth/login/userLogged";

@Component({
  selector: 'app-music-management',
  templateUrl: './music-management.component.html',
  styleUrls: ['./music-management.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MusicManagementComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  //public searchInputValue: string = '';new BehaviorSubject
  public seachInputSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  // public searchInputValue?: Observable<string>;

  private $data: MusicWithSingerAndLinksDto[] = [];
  private $singersData: Array<string> = new Array<string>();
  private $paramToSearch: string = '';

  data: MusicWithSingerAndLinksDto[] = [];
  selectedSingersList: Array<string> = new Array<string>();

  selectedMusicStatus: ElementSelectStaticApp[] = [];
  musicStatusList?: ElementSelectStaticApp[];

  isLoading: boolean = false;
  totalData?: number;

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
    this.createMusicStatusList();
    this.findMusicListOfSpace();
    this.searchMusic();
  }

  ngOnDestroy() {
    this.seachInputSubject.getValue()
    this.subscriptions.unsubscribe();
  }

  get searchInputValue(): string {
    return this.seachInputSubject.getValue();
  }

  openMusicDetailsDialog(item: MusicWithSingerAndLinksDto) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      position: {
        'bottom': '0'
      },
      data: item
    }

    this.dialogService.open(ViewMusicDialogComponent, dialogConfig);
  }

  openDeleteMusicDialog(item: MusicWithSingerAndLinksDto) {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      position: {
        'bottom': '0'
      },
      data: item
    }

    const dialogRef = this.dialogService.open(DeleteMusicDialogComponent, dialogConfig);

    const dialogRefSub = dialogRef.afterClosed().subscribe((reloadList: boolean) => {
      if (reloadList) {
        this.findMusicListOfSpace();
      }
    });

    this.subscriptions.add(dialogRefSub);
  }

  openSingersFilterDialog() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      position: {
        'bottom': '0'
      },
      data: this.$singersData
    }

    const dialogRef = this.dialogService.open(SingersFilterDialogComponent, dialogConfig);

    const dialogRefSub = dialogRef.afterClosed().subscribe((result: Array<string>) => {
      this.selectedSingersList = result || [];

      this.musicFullFilter();
    });

    this.subscriptions.add(dialogRefSub);
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

  onSearchQueryInput(event: Event): void {
    const searchQuery = (event.target as HTMLInputElement).value;
    this.seachInputSubject.next(searchQuery);
  }

  searchMusic(){
    const searchMusicSub = this.seachInputSubject
      .pipe(
          debounceTime(150),
          distinctUntilChanged(),
          tap((paramToSearch) => {
            this.$paramToSearch = (paramToSearch) ? paramToSearch : '';
            this.musicFullFilter();
          })
      )
      .subscribe();

    this.subscriptions.add(searchMusicSub);
  }

  hasSelectedSingers(): boolean {
    return this.selectedSingersList.length > 0;
  }

  toggleSelection(chipSelected: MatChip, item: ElementSelectStaticApp) {
    chipSelected.toggleSelected();

    if (chipSelected.selected) {
      this.selectedMusicStatus?.push(item);
    } else {
      if (this.selectedMusicStatus.length > 0) {
        this.selectedMusicStatus = this.selectedMusicStatus.filter(actual => actual.ref !== item.ref);
      }
    }

    this.musicFullFilter();
  }

  hasMusicList() {
    if (this.isLoading) {
      return true;
    }
    return this.$data?.length > 0;
  }

  hasMusicListWithFilterApplied() {
    if (this.isLoading || this.$data?.length === 0) {
      return true;
    }
    return this.data.length !== 0;
  }

 private findMusicListOfSpace() {
  this.isLoading= true;

  const findAllBySpaceSub = this.musicService.findAllBySpace()
    .subscribe(res => {
      this.totalData = res.length;
      this.$data = res.sort((a, b) => a.name.localeCompare(b.name));

      this.$singersData = this.$data
        .map(music => music.singer.name)
        .sort()
        .reduce((init: string[], current) => {
          if (init.length === 0 || init[init.length - 1] !== current) {
            init.push(current);
          }
          return init;
        }, []);

      this.data = this.filterByMusicStatus(this.$data);
      this.isLoading= false;
    }, err => {
      this.snackBarService.error(err);
      this.isLoading= false;
    });

  this.subscriptions.add(findAllBySpaceSub);
}

private createMusicStatusList() {
  this.musicStatusList = Object.values(MusicStatusEnum).map(obj => {
    const keyStatus = `music.status.${obj}`;
    const isSelected = (obj === MusicStatusEnum.ENABLED);
    var objToArray = {
      i18n: keyStatus,
      ref: obj,
      displayValue: this.localizationService.translate(keyStatus),
      isSelected: isSelected
    };

    if (isSelected) {
      this.selectedMusicStatus.push(objToArray);
    }

    return objToArray;
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
    const argNoAcents = arg.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return arr.filter((item: MusicWithSingerAndLinksDto) => {
      const musicNameNoAccents = item.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const singerNameNoAccents = item.singer.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      return (musicNameNoAccents.includes(argNoAcents) || singerNameNoAccents.includes(argNoAcents))
    });
  }

  return this.$data;
}

private filterByMusicStatus(arr: MusicWithSingerAndLinksDto[]): MusicWithSingerAndLinksDto[] {
  if (this.selectedMusicStatus.length > 0) {
    return arr.filter((item: MusicWithSingerAndLinksDto) => {
      return this.selectedMusicStatus.some(itemSelected => item.musicStatus.toUpperCase() === itemSelected?.ref.toUpperCase())
    });
  }

  return arr;
}

private filterOfSingersSelected(): MusicWithSingerAndLinksDto[] {

  const allSingersWithLowerCase = this.selectedSingersList?.map(res => res.toLocaleLowerCase());

  return this.$data.filter((item: MusicWithSingerAndLinksDto) => {
    return allSingersWithLowerCase.some(singer => singer.toString() === item.singer.name.toLowerCase());
  });
}

}
