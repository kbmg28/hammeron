import { SnackBarService } from '../../../_services/snack-bar.service';
import { SingerDto } from '../../../_services/swagger-auto-generated/model/singerDto';
import { Observable } from 'rxjs';
import { MusicLinkDto } from '../../../_services/swagger-auto-generated/model/musicLinkDto';
import { MusicWithSingerAndLinksDto } from '../../../_services/swagger-auto-generated/model/musicWithSingerAndLinksDto';
import { MusicService } from '../../../_services/music.service';
import { Title } from '@angular/platform-browser';
import { LocalizationService } from '../../../internationalization/localization.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BackPageService } from '../../../_services/back-page.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { startWith, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-create-or-edit-music',
  templateUrl: './create-or-edit-music.component.html',
  styleUrls: ['./create-or-edit-music.component.scss']
})
export class CreateOrEditMusicComponent implements OnInit {
  musicForm: FormGroup;
  musicToEdit?: MusicWithSingerAndLinksDto;
  youTubeLinkToEdit?: string;
  spotifyLinkToEdit?: string;
  chordLinkToEdit?: string;

  singerList: SingerDto[] = [];
  filteredOptions?: Observable<SingerDto[]>;

  isLoading = false;
  isAnEdition = false;
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
    this.checkIfEdition();
    const textHeader = this.localizationService.translate(this.isAnEdition ? "music.edit" : "music.create");
    this.backPageService.setBackPageValue('/music', textHeader);

    this.isLoading = true;
    this.loadSingers();
  }

  get musicName() {  return this.musicForm.get('musicName'); }
  get singerName() {   return this.musicForm.get('singerName'); }
  get youtubeLink() {    return this.musicForm.get('youtubeLink'); }
  get spotifyLink() {    return this.musicForm.get('spotifyLink'); }
  get chordLink() {    return this.musicForm.get('chordLink'); }

  changeStatus() {
    this.slideStatus = !this.slideStatus;
  }

  clickCheckbox() {
    this.checkBoxRejected = !this.checkBoxRejected;
  }

  isInvalidFormOrNoChanges(): boolean {
    const isInvalidFormOrIsLoading = !this.musicForm.valid || this.isLoading;
    var isDisabled: boolean;

    if (this.isAnEdition) {
      const isNotEqualsName = this.musicName?.value !== this.musicToEdit?.name;
      const isNotEqualsSingerName = this.singerName?.value !== this.musicToEdit?.singer.name;
      const isNotEqualsYoutubeLink = this.youtubeLink?.value != this.youTubeLinkToEdit;
      const isNotEqualsSpotifyLink = this.spotifyLink?.value != this.spotifyLinkToEdit;
      const isNotEqualsChordLink = this.chordLink?.value != this.chordLinkToEdit;
      const isNotEqualsStatus = this.slideStatus !== (this.musicToEdit?.musicStatus === MusicWithSingerAndLinksDto.MusicStatusEnum.ENABLED);
      const isNotEqualsRejected = this.checkBoxRejected !== (this.musicToEdit?.musicStatus === MusicWithSingerAndLinksDto.MusicStatusEnum.REJECTED);

      const hasNoChanges = !(isNotEqualsName || isNotEqualsSingerName ||
                            isNotEqualsYoutubeLink || isNotEqualsSpotifyLink || isNotEqualsChordLink ||
                            isNotEqualsStatus || isNotEqualsRejected);

      isDisabled= isInvalidFormOrIsLoading || hasNoChanges;
    } else {
      isDisabled = isInvalidFormOrIsLoading;
    }
    return isDisabled;
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

    var singerName: string;
    var singerId;

    const singerExist = this.singerList.find(singer => singer.name === this.singerName?.value);

    if (singerExist) {
      singerId = singerExist.id;
      singerName = singerExist.name;
    } else {
      singerName = this.singerName?.value;
    }

    const body: MusicWithSingerAndLinksDto = {
      name: this.musicName?.value,
      musicStatus: status,
      singer: {
        id: singerId,
        name: singerName
      },
      links: linksArray
    }

    this.isLoading = true;

    this.isAnEdition ? this.editMusic(body) : this.createMusic(body);
  }

  private createMusic(body: MusicWithSingerAndLinksDto) {
    this.musicService.create(body)
      .subscribe(res => {

        this.isLoading = false;
        this.snackBarService.success(this.localizationService.translate('snackBar.savedSuccessfully'));
        this.router.navigate(["/music"]);
      },
        err => {
          this.isLoading = false;
          this.snackBarService.error(err);
        }
      );
  }

  private editMusic(body: MusicWithSingerAndLinksDto) {
    this.musicService.edit(this.musicToEdit?.id || '', body)
      .subscribe(res => {

        this.isLoading = false;
        this.snackBarService.success(this.localizationService.translate('snackBar.savedSuccessfully'));
        this.router.navigate(["/music"]);
      },
        err => {
          this.isLoading = false;
          this.snackBarService.error(err);
        }
      );
  }

  private checkIfEdition() {
    if(history.state && history.state.id) {
      this.isAnEdition = true;

      const musicToEditReceive = history.state;

      this.musicToEdit = musicToEditReceive;

      const linkList: MusicLinkDto[] = musicToEditReceive.links;

      this.musicName?.setValue(musicToEditReceive.name);

      linkList.forEach(obj => {

        switch(obj.typeLink) {

          case MusicLinkDto.TypeLinkEnum.YOUTUBE: {
            this.youtubeLink?.setValue(obj.link);
            if(this.isAnEdition) {
              this.youTubeLinkToEdit = obj.link;
            }
          }; break;

          case MusicLinkDto.TypeLinkEnum.SPOTIFY: {
            this.spotifyLink?.setValue(obj.link);
            if(this.isAnEdition) {
              this.spotifyLinkToEdit = obj.link;
            }
          }; break;

          case MusicLinkDto.TypeLinkEnum.CHORD: {
            this.chordLink?.setValue(obj.link);
            if(this.isAnEdition) {
              this.chordLinkToEdit = obj.link;
            }
          }; break;
        }
      });

      this.singerName?.setValue(musicToEditReceive.singer.name);

      this.checkBoxRejected = this.musicToEdit?.musicStatus === MusicWithSingerAndLinksDto.MusicStatusEnum.REJECTED;
      this.slideStatus = this.musicToEdit?.musicStatus === MusicWithSingerAndLinksDto.MusicStatusEnum.ENABLED;
    }else {
      this.isAnEdition = false;
    }
  }

  private loadSingers() {
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

  private _filter(value: string): SingerDto[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.singerList.filter(option => option.name.toLowerCase().includes(filterValue));
    }

    return this.singerList;
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
