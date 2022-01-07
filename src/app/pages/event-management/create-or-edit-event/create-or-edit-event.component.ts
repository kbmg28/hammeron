import { EventDetailsDto } from './../../../_services/swagger-auto-generated/model/eventDetailsDto';
import { EventDto } from './../../../_services/swagger-auto-generated/model/eventDto';
import { EventWithMusicListDto } from './../../../_services/swagger-auto-generated/model/eventWithMusicListDto';
import { MusicOnlyIdAndMusicNameAndSingerNameDto } from './../../../_services/swagger-auto-generated/model/musicOnlyIdAndMusicNameAndSingerNameDto';
import { MusicGroupingBySingerName } from './../../../_services/model/musicGroupingBySingerName';
import { startWith, filter, map } from 'rxjs/operators';
import { UserOnlyIdNameAndEmailDto } from './../../../_services/swagger-auto-generated/model/userOnlyIdNameAndEmailDto';
import { UserService } from './../../../_services/user.service';
import { EventService } from './../../../_services/event.service';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { SnackBarService } from './../../../_services/snack-bar.service';
import { BackPageService } from './../../../_services/back-page.service';
import { Router } from '@angular/router';
import { LocalizationService } from './../../../internationalization/localization.service';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { MusicService } from 'src/app/_services/music.service';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import * as _ from 'lodash';
import { values } from 'lodash';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-create-or-edit-event',
  templateUrl: './create-or-edit-event.component.html',
  styleUrls: ['./create-or-edit-event.component.scss']
})
export class CreateOrEditEventComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  private eventToEdit?: EventDetailsDto;
  private musicListOfEdition?: MusicOnlyIdAndMusicNameAndSingerNameDto[];
  private participantListOfEdition?: UserOnlyIdNameAndEmailDto[];

  private _participantsToSelectMap: Map<string, UserOnlyIdNameAndEmailDto> = new Map();
  private _selectedParticipantsMap: Map<string, UserOnlyIdNameAndEmailDto> = new Map();
  private _participantsToSelectSubject: BehaviorSubject<any> = new BehaviorSubject([]);
  private _participantsSelectedSubject: BehaviorSubject<any> = new BehaviorSubject([]);

  private _selectedMusicsMap: Map<string, MusicOnlyIdAndMusicNameAndSingerNameDto> = new Map();
  private _musicsToSelectSubject: BehaviorSubject<any> = new BehaviorSubject([]);
  private _musicsSelectedSubject: BehaviorSubject<any> = new BehaviorSubject([]);

  eventForm: FormGroup;
  minDate?: Date;
  maxDate?: Date;

  participantsToSelectList: Observable<UserOnlyIdNameAndEmailDto[]>;
  selectedParticipantList: Observable<UserOnlyIdNameAndEmailDto[]>;

  musicsToSelectList: Observable<MusicGroupingBySingerName[]>;
  selectedMusicsList: Observable<MusicOnlyIdAndMusicNameAndSingerNameDto[]>;

  isLoading = false;
  isLoadingParticipants = false;
  isLoadingMusics = false;
  isAnEdition = false;

  darkTheme: NgxMaterialTimepickerTheme = {
    container: {
        bodyBackgroundColor: '#424242',
        buttonColor: '#fff'
    },
    dial: {
        dialBackgroundColor: '#555',
    },
    clockFace: {
        clockFaceBackgroundColor: '#555',
        clockHandColor: '#9fbd90',
        clockFaceTimeInactiveColor: '#fff'
    }
  };

  constructor(private titleService: Title,
              private backPageService: BackPageService,
              private localizationService: LocalizationService,
              private router: Router,
              private snackBarService: SnackBarService,
              private fb: FormBuilder,
              private musicService: MusicService,
              private userService: UserService,
              private eventService: EventService) {

    this.eventForm = this.fb.group({
      name: [null, [Validators.required]],
      date: [null, [Validators.required]],
      time: [null, [Validators.required]]
    });

    this.selectedParticipantList = this._participantsSelectedSubject.asObservable();
    this.participantsToSelectList = this._participantsToSelectSubject.asObservable();

    this.selectedMusicsList = this._musicsSelectedSubject.asObservable();
    this.musicsToSelectList = this._musicsToSelectSubject.asObservable();

    this.calculateRangeDate();
  }

  ngOnInit(): void {
    this.checkIfEdition();
    this.titleService.setTitle(this.localizationService.translate(this.isAnEdition ?
        'titleRoutesBrowser.events.edit' : 'titleRoutesBrowser.events.create'));
    const textHeader = this.localizationService.translate(this.isAnEdition ? "event.edit" : "event.create");
    this.backPageService.setBackPageValue('/event', textHeader);

    this.loadParticipants();
    this.loadMusics();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  get name() {  return this.eventForm.get('name'); }
  get date() {  return this.eventForm.get('date'); }
  get time() {  return this.eventForm.get('time'); }
  get currentMusicsToSelect(): MusicGroupingBySingerName[] {
    return this._musicsToSelectSubject.value;
  }
  get currentMusicsSelected(): MusicOnlyIdAndMusicNameAndSingerNameDto[] {
    return this._musicsSelectedSubject.value;
  }
  get currentParticipantsSelected(): UserOnlyIdNameAndEmailDto[] {
    return this._participantsSelectedSubject.value;
  }

  isInvalidFormOrNoChanges(): boolean {
    const isInvalidFormOrIsLoading = !this.eventForm.valid || this.isLoading;
    var isDisabled: boolean;

    if (this.isAnEdition) {
      const intersectionMusics = _.intersectionBy(this.currentMusicsSelected, this.musicListOfEdition || [], 'musicId');
      const intersectionParticipants = _.intersectionWith(this.participantListOfEdition, this.currentParticipantsSelected, _.isEqual);

      const initialDateEdition = new Date(`${this.eventToEdit?.date}T${this.eventToEdit?.time}`);

      const isNotEqualsName = this.name?.value !== this.eventToEdit?.name;
      const isNotEqualsDate = this.date?.value.getDate() !== initialDateEdition.getDate();
      const isNotEqualsTime = this.time?.value !== this.eventToEdit?.time;

      const isNotEqualsMusicList = !(intersectionMusics.length === this.musicListOfEdition?.length
                          && this.musicListOfEdition?.length === this.currentMusicsSelected.length);

      const isNotEqualsParticipantList = !(intersectionParticipants.length === this.participantListOfEdition?.length
                          && this.participantListOfEdition?.length === this.currentParticipantsSelected.length);

      const hasNoChanges = !(isNotEqualsName || isNotEqualsDate ||
                              isNotEqualsTime || isNotEqualsMusicList || isNotEqualsParticipantList);

      isDisabled= isInvalidFormOrIsLoading || hasNoChanges;
    } else {
      isDisabled = isInvalidFormOrIsLoading;
    }
    return isDisabled;
  }

  onSelectParticipant(selected: UserOnlyIdNameAndEmailDto) {
    this._selectedParticipantsMap.set(selected.userId, selected);
    this._participantsToSelectMap.delete(selected.userId)
    this._participantsToSelectSubject.next( Array.from( this._participantsToSelectMap.values() ) );
    this._participantsSelectedSubject.next( Array.from( this._selectedParticipantsMap.values() ));
  }

  onRemoveParticipantChip(item: UserOnlyIdNameAndEmailDto) {
    this._participantsToSelectMap.set(item.userId, item);
    this._selectedParticipantsMap.delete(item.userId)

    this.isLoadingParticipants = true;
    this._participantsToSelectSubject.next (Array.from(this._participantsToSelectMap.values())
                          .sort((a, b) => a.name.localeCompare(b.name)));
    this.isLoadingParticipants = false;

    this._participantsSelectedSubject.next(Array.from( this._selectedParticipantsMap.values() ));
  }

  onSelectMusic(selectedGroup: MusicGroupingBySingerName, selectedMusic: MusicOnlyIdAndMusicNameAndSingerNameDto) {
    if (selectedGroup.musics.length === 1) {
      const listUpdated = this.currentMusicsToSelect.filter(mus => mus.singerName !== selectedMusic.singerName);
      this._musicsToSelectSubject.next(listUpdated);
    } else {
      selectedGroup.musics = selectedGroup.musics.filter(mus => mus.musicId !== selectedMusic.musicId)
    }
    this._selectedMusicsMap.set(selectedMusic.musicId, selectedMusic);
    this._musicsSelectedSubject.next( Array.from( this._selectedMusicsMap.values() ));
  }

  onRemoveMusicChip(musicToRemoveOfSelection: MusicOnlyIdAndMusicNameAndSingerNameDto) {
    this.isLoadingMusics = true;
    this._selectedMusicsMap.delete(musicToRemoveOfSelection.musicId)

    const index = this.currentMusicsToSelect.findIndex(group => group.singerName === musicToRemoveOfSelection.singerName);

    if (index >= 0) {
      var musicsOfGroup = this.currentMusicsToSelect[index].musics;
      musicsOfGroup.push(musicToRemoveOfSelection);
      this.currentMusicsToSelect[index].musics = _.sortBy(musicsOfGroup, music => music.musicName);
    } else {
      const newGroupToSelect = {
        singerName: musicToRemoveOfSelection.singerName,
        musics: [musicToRemoveOfSelection]
      }

      this.currentMusicsToSelect.push(newGroupToSelect);
      this.currentMusicsToSelect.sort((a, b) => a.singerName.localeCompare(b.singerName));
    }

    this._musicsSelectedSubject.next( Array.from( this._selectedMusicsMap.values() ));
    this.isLoadingMusics = false;
  }

  onSave() {

    const body: EventWithMusicListDto = {
      name: this.name?.value,
      date: this.date?.value,
      time: this.time?.value,
      musicList: this.currentMusicsSelected,
      userList: this._participantsSelectedSubject.value
    }

    this.isAnEdition ? this.onEdit(body) : this.onCreate(body);
  }

  private onCreate(body: EventWithMusicListDto) {
    const createEventSub = this.eventService.create(body).subscribe(res => {

      this.snackBarService.success(this.localizationService.translate('snackBar.savedSuccessfully'));
      this.router.navigate(['/event']);
    }, err => {
      this.snackBarService.error(err);
    });

    this.subscriptions.add(createEventSub);
  }

  private onEdit(body: EventWithMusicListDto) {
    this.eventService.edit(this.eventToEdit?.id || '', body).subscribe(res => {

      this.snackBarService.success(this.localizationService.translate('snackBar.savedSuccessfully'));
      this.router.navigate(['/event']);
    }, err => {
      this.snackBarService.error(err);
    });
  }

  private calculateRangeDate() {
    const today = new Date();

    this.minDate = today;
    this.maxDate = new Date(today);

    this.maxDate.setMonth(today.getMonth() + 4);
  }

  private loadParticipants() {
    this.isLoadingParticipants = true;

    const loadParticipantsSub = this.userService.findAllAssociationForEvents().subscribe(res => {

      res.sort((a, b) => a.name.localeCompare(b.name));
      if (this.isAnEdition) {
        let selected: UserOnlyIdNameAndEmailDto[] = [];
        let toSelect: UserOnlyIdNameAndEmailDto[] = [];

        res.forEach(element => {
          const user = this.eventToEdit?.userList?.find(u => u.email === element.email);
          const userDto: UserOnlyIdNameAndEmailDto = {
            userId: element.userId,
            name: user?.name || '',
            email: user?.email || ''
          };
          user ? selected.push(userDto) : toSelect.push(element);
        });
        this.participantListOfEdition = selected;

        this._participantsToSelectMap = new Map(toSelect.map(user => [user.userId, user]));
        this._selectedParticipantsMap = new Map(selected.map(user => [user.userId, user]));

        this._participantsToSelectSubject.next( toSelect );
        this._participantsSelectedSubject.next( selected );
      } else {

        this._participantsToSelectSubject.next(res);
        this._participantsToSelectMap = new Map(res.map(user => [user.userId, user]));
      }
      this.isLoadingParticipants = false;
    }, err => {

      this.isLoadingParticipants = false;
    });

    this.subscriptions.add(loadParticipantsSub);
  }

  private loadMusics() {
    this.isLoadingMusics = true;

    const loadMusicsSub = this.musicService.findAllAssociationForEvents().subscribe(res => {
      res = _.sortBy(res, music => music.singerName);
      if (this.isAnEdition) {
        const musicListOfEvent = this.eventToEdit?.musicList || [];
        const musicSelected = musicListOfEvent
            .map(musicOfEvent => {
                const value: MusicOnlyIdAndMusicNameAndSingerNameDto = {
                  musicId: musicOfEvent.id || '',
                  musicName: musicOfEvent.name,
                  singerName: musicOfEvent.singer.name
                }
                this._selectedMusicsMap.set(value.musicId, value);
                return value;
            });
        this.musicListOfEdition = musicSelected;

        this._musicsSelectedSubject.next(musicSelected);
        res = res.filter(mus => !musicListOfEvent.find(musicOfEvent => musicOfEvent.id === mus.musicId));
      }

      const grouped = _.groupBy(res, music => music.singerName);
      const groupSortedBySingerName = _.map(grouped, value => {
        return {
          singerName: value[0].singerName,
          musics: _.sortBy(value, music => music.musicName)
        }
      })
      this._musicsToSelectSubject.next(groupSortedBySingerName);

      this.isLoadingMusics = false;
    }, err => {

      this.isLoadingMusics = false;
    });

    this.subscriptions.add(loadMusicsSub);
  }

  private checkIfEdition() {
    if(history.state && history.state.id) {
      this.isAnEdition = true;

      this.eventToEdit = history.state;
      this.name?.setValue(this.eventToEdit?.name);
      this.date?.setValue(new Date(`${this.eventToEdit?.date}T${this.eventToEdit?.time}`));
      this.time?.setValue(this.eventToEdit?.time);
    }else {
      this.isAnEdition = false;
    }
  }

}
