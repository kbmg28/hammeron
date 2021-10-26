import { MusicLinkDto } from './../../../_services/swagger-auto-generated/model/musicLinkDto';
import { MusicWithSingerAndLinksDto } from './../../../_services/swagger-auto-generated/model/musicWithSingerAndLinksDto';
import { MusicService } from './../../../_services/music.service';
import { Title } from '@angular/platform-browser';
import { LocalizationService } from './../../../internationalization/localization.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackPageService } from './../../../_services/back-page.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-music',
  templateUrl: './create-music.component.html',
  styleUrls: ['./create-music.component.scss']
})
export class CreateMusicComponent implements OnInit {

  musicForm: FormGroup;

  isLoading = false;
  slideStatus = true;
  checkBoxRejected = false;

  constructor(private titleService: Title,
              private localizationService: LocalizationService,
              private router: Router,
              private fb: FormBuilder,
              private backPageService: BackPageService,
              private musicService: MusicService,) {

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
      singer: {
        name: this.singerName?.value
      },
      links: linksArray
    }

    this.isLoading = true;
    this.musicService.create('a68a48a9-9528-46d5-90e7-d42a1c58420c', body)
      .subscribe(res => {

        this.isLoading = false;
        this.router.navigate(["/music"])
      },
      err => {
        this.isLoading = false;
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
