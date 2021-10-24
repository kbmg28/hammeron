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
  checked = true;

  constructor(private titleService: Title,
              private localizationService: LocalizationService,
              private router: Router,
              private fb: FormBuilder,
              private backPageService: BackPageService) {

    this.musicForm = this.fb.group({
      musicName: [null, [Validators.required]],
      singerName: [null, [Validators.required]],
      youtubeLink: [null, [Validators.required]],
      spotifyLink: [null, [Validators.required]],
      chordLink: [null, [Validators.required]],
      active: [null, [Validators.required]],
      rejected: [null, [Validators.required]],
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
  get active() {    return this.musicForm.get('active'); }
  get rejected() {    return this.musicForm.get('rejected'); }

  /*
  getErrorInvalidNameMessage() {
    return (this.name?.hasError('required')) ? this.requiredFieldMessage : ''
  }
*/
  changeStatus() {
    this.checked = !this.checked;
  }
}
