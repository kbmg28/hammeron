import { SnackBarService } from './../../../_services/snack-bar.service';
import { SingerDto } from './../../../_services/swagger-auto-generated/model/singerDto';
import { Observable } from 'rxjs';
import { MusicLinkDto } from './../../../_services/swagger-auto-generated/model/musicLinkDto';
import { MusicWithSingerAndLinksDto } from './../../../_services/swagger-auto-generated/model/musicWithSingerAndLinksDto';
import { MusicService } from './../../../_services/music.service';
import { Title } from '@angular/platform-browser';
import { LocalizationService } from './../../../internationalization/localization.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackPageService } from './../../../_services/back-page.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { startWith, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-create-music',
  templateUrl: './create-music.component.html',
  styleUrls: ['./create-music.component.scss']
})
export class CreateMusicComponent implements OnInit {

  musicForm: FormGroup;
  singerList: SingerDto[] = [];
  filteredOptions?: Observable<SingerDto[]>;
  singerSelected?: SingerDto;

  isLoading = false;
  slideStatus = true;
  checkBoxRejected = false;

  constructor(private titleService: Title,
              private localizationService: LocalizationService,
              private router: Router,
              private fb: FormBuilder,
              private backPageService: BackPageService,
              private musicService: MusicService,
              private snackBarService: SnackBarService) {
    this.titleService.setTitle(localizationService.translate('titleRoutesBrowser.songs.create'));

    this.musicForm = this.fb.group({
      musicName: [null, [Validators.required]],
      singerName: [null, [Validators.required]],
      youtubeLink: [null, []],
      spotifyLink: [null, []],
      chordLink: [null, []]
    });
  }

  ngOnInit(): void {
    const textHeader = this.localizationService.translate("music.create");
    this.backPageService.setBackPageValue('/music', textHeader);

    this.isLoading = true;
    this.musicService.findAllSingerBySpace()
      .subscribe(res => {
        this.singerList = res;

        this.filteredOptions = this.singerName!.valueChanges
          .pipe(
            startWith(''),
            filter(value => typeof value === 'string'),
            map(value => this._filter(value))
          );
        this.isLoading = false;
      }, err => {
        this.isLoading = false;
        this.snackBarService.error(err);
      });
  }

  get musicName() {  return this.musicForm.get('musicName'); }
  get singerName() {   return this.musicForm.get('singerName'); }
  get youtubeLink() {    return this.musicForm.get('youtubeLink'); }
  get spotifyLink() {    return this.musicForm.get('spotifyLink'); }
  get chordLink() {    return this.musicForm.get('chordLink'); }

  private _filter(value: string): SingerDto[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.singerList.filter(option => option.name.toLowerCase().includes(filterValue));
    }

    return this.singerList;
  }

  displayFn(singer: SingerDto): string {
    return singer && singer.name ? singer.name : '';
  }

  selectSinger(singer: SingerDto) {
    this.singerSelected = singer;
  }

  changeStatus() {
    this.slideStatus = !this.slideStatus;
  }

  clickCheckbox() {
    this.checkBoxRejected = !this.checkBoxRejected;
  }

  onSave() {
    let status: MusicWithSingerAndLinksDto.MusicStatusEnum;

    if (this.checkBoxRejected) {
      status = MusicWithSingerAndLinksDto.MusicStatusEnum.REJECTED;
    } else {
      status = this.slideStatus? MusicWithSingerAndLinksDto.MusicStatusEnum.ENABLED :
                            MusicWithSingerAndLinksDto.MusicStatusEnum.DISABLED;
    }
    var linksArray: Array<MusicLinkDto> = [];

    this.addInArrayIfPresent(linksArray, this.youtubeLink?.value, MusicLinkDto.TypeLinkEnum.YOUTUBE);
    this.addInArrayIfPresent(linksArray, this.spotifyLink?.value, MusicLinkDto.TypeLinkEnum.SPOTIFY);
    this.addInArrayIfPresent(linksArray, this.chordLink?.value, MusicLinkDto.TypeLinkEnum.CHORD);

    const body: MusicWithSingerAndLinksDto = {
      name: this.musicName?.value,
      musicStatus: status,
      singer: (this.singerSelected && this.singerSelected.name === this.singerName?.value) ?
                  this.singerSelected :
                  {name: this.singerName?.value},
      links: linksArray
    }

    this.isLoading = true;
    this.musicService.create( body)
      .subscribe(res => {

        this.isLoading = false;
        //this.snackBarService.success('');
        this.router.navigate(["/music"])
      },
      err => {
        this.isLoading = false;
        this.snackBarService.error(err);
      }
    );
  }

  private addInArrayIfPresent(array: Array<MusicLinkDto>, link: string, type: MusicLinkDto.TypeLinkEnum) {
    if (!!link) {
      array.push({
        link: link,
        typeLink: type
      })
    }
  }
}
