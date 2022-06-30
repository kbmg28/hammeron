import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { EventDetailsDto } from './../../../_services/swagger-auto-generated/model/eventDetailsDto';
import { EventDto } from './../../../_services/swagger-auto-generated/model/eventDto';
import { EventWithMusicListDto } from './../../../_services/swagger-auto-generated/model/eventWithMusicListDto';
import { MusicOnlyIdAndMusicNameAndSingerNameDto } from './../../../_services/swagger-auto-generated/model/musicOnlyIdAndMusicNameAndSingerNameDto';
import { MusicGroupingBySingerName } from './../../../_services/model/musicGroupingBySingerName';
import { startWith, filter, map, take, takeUntil } from 'rxjs/operators';
import { UserOnlyIdNameAndEmailDto } from './../../../_services/swagger-auto-generated/model/userOnlyIdNameAndEmailDto';
import { UserService } from './../../../_services/user.service';
import { EventService } from './../../../_services/event.service';
import { Observable, BehaviorSubject, Subscription, ReplaySubject, Subject } from 'rxjs';
import { SnackBarService } from './../../../_services/snack-bar.service';
import { BackPageService } from './../../../_services/back-page.service';
import { Router } from '@angular/router';
import { LocalizationService } from './../../../internationalization/localization.service';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { Component, forwardRef, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MusicService } from 'src/app/_services/music.service';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
import { sortPeopleDefault } from 'src/app/constants/AppUtil';
import { MatSelect } from '@angular/material/select';
import { MusicSimpleToEventDto } from 'src/app/_services/swagger-auto-generated';

@Component({
  selector: 'app-create-or-edit-event',
  templateUrl: './create-or-edit-event.component.html',
  styleUrls: ['./create-or-edit-event.component.scss']
})
export class CreateOrEditEventComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscriptions = new Subscription();

  private eventToEdit?: EventDetailsDto;
  private musicListOfEdition?: MusicSimpleToEventDto[];
  private participantListOfEdition?: UserOnlyIdNameAndEmailDto[];

  musicList: MusicSimpleToEventDto[] = [];
  musicMultiCtrl: FormControl = new FormControl();
  musicMultiFilterCtrl: FormControl = new FormControl();
  filteredMusicMulti: ReplaySubject<MusicSimpleToEventDto[]> = new ReplaySubject<MusicSimpleToEventDto[]>(1);

  userList: UserOnlyIdNameAndEmailDto[] = [];
  userMultiCtrl: FormControl = new FormControl();
  userMultiFilterCtrl: FormControl = new FormControl();
  filteredUserMulti: ReplaySubject<UserOnlyIdNameAndEmailDto[]> = new ReplaySubject<UserOnlyIdNameAndEmailDto[]>(1);

  eventForm: FormGroup;
  minDate?: Date;
  maxDate?: Date;

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

  @ViewChild('musicMultiSelect', { static: true }) musicMultiSelect?: MatSelect;
  protected _musicMultiSelectSubject = new Subject<void>();

  @ViewChild('userMultiSelect', { static: true }) userMultiSelect?: MatSelect;
  protected _userMultiSelectSubject = new Subject<void>();

  constructor(private titleService: Title,
              private backPageService: BackPageService,
              private localizationService: LocalizationService,
              private router: Router,
              private snackBarService: SnackBarService,
              private fb: FormBuilder,
              private musicService: MusicService,
              private userService: UserService,
              private eventService: EventService,
              public datepipe: DatePipe) {

    this.eventForm = this.fb.group({
      name: [null, [Validators.required]],
      date: [null, [Validators.required]],
      time: [null, [Validators.required]]
    });

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

    this.musicMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._musicMultiSelectSubject))
      .subscribe(() => {
        this.filterMusicMulti();
      });
    this.userMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._userMultiSelectSubject))
      .subscribe(() => {
        this.filterUserMulti();
      });
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this._musicMultiSelectSubject.next();
    this._musicMultiSelectSubject.complete();
    this._userMultiSelectSubject.next();
    this._userMultiSelectSubject.complete();
  }

  get name() {  return this.eventForm.get('name'); }
  get date() {  return this.eventForm.get('date'); }
  get time() {  return this.eventForm.get('time'); }

  get currentSelectedMusic(): MusicSimpleToEventDto[] {
    return this.musicMultiCtrl.value;
  }

  get currentSelectedUsers(): MusicSimpleToEventDto[] {
    return this.userMultiCtrl.value;
  }

  isInvalidFormOrNoChanges(): boolean {
    const isInvalidFormOrIsLoading = !this.eventForm.valid || this.isLoading;
    var isDisabled: boolean;

    if (this.isAnEdition && this.eventToEdit) {
      const intersectionMusics = _.intersectionBy(this.currentSelectedMusic, this.musicListOfEdition || [], 'musicId');
      const intersectionParticipants = _.intersectionWith(this.participantListOfEdition, this.currentSelectedUsers, _.isEqual);

      const initialDateEdition = new Date(`${history.state.utcDateTime}`);

      const isNotEqualsName = this.name?.value !== this.eventToEdit.name;
      const isNotEqualsDate = this.date?.value.getDate() !== initialDateEdition.getDate();
      const isNotEqualsTime = this.time?.value !== initialDateEdition.getTime();

      const isNotEqualsMusicList = !(intersectionMusics.length === this.musicListOfEdition?.length
                          && this.musicListOfEdition?.length === this.musicMultiCtrl.value.length);

      const isNotEqualsParticipantList = !(intersectionParticipants.length === this.participantListOfEdition?.length
                          && this.participantListOfEdition?.length === this.userMultiCtrl.value.length);

      const hasNoChanges = !(isNotEqualsName || isNotEqualsDate ||
                              isNotEqualsTime || isNotEqualsMusicList || isNotEqualsParticipantList);

      isDisabled= isInvalidFormOrIsLoading || hasNoChanges;
    } else {
      isDisabled = isInvalidFormOrIsLoading;
    }
    return isDisabled;
  }

  unselectMusic(musicSelected: MusicOnlyIdAndMusicNameAndSingerNameDto) {
    const list: MusicOnlyIdAndMusicNameAndSingerNameDto[] = this.musicMultiCtrl.value

    const newList = list.filter(item => item.musicId !== musicSelected.musicId);
    this.musicMultiCtrl.setValue(newList);
  }

  unselectUser(userSelected: UserOnlyIdNameAndEmailDto) {
    const list: UserOnlyIdNameAndEmailDto[] = this.userMultiCtrl.value

    const newList = list.filter(item => item.userId !== userSelected.userId);
    this.userMultiCtrl.setValue(newList);
  }

  onClickAutoScroll (el: HTMLElement) {
    el.scrollIntoView({block: "center"});
  }

  drop(event: CdkDragDrop<MusicOnlyIdAndMusicNameAndSingerNameDto[]>) {
    const list: MusicOnlyIdAndMusicNameAndSingerNameDto[] = this.musicMultiCtrl.value
    moveItemInArray(this.musicMultiCtrl.value, event.previousIndex, event.currentIndex);
  }

  getMessageNoOptions(): string {
    return this.localizationService.translate('useful.noOptions');
  }

  getMessagePlaceholderMusicSearch(): string {
    return this.localizationService.translate('placeholder.musicManagementSearch');
  }

  getMessagePlaceholderUserSearch(): string {
    return this.localizationService.translate('placeholder.userManagementSearch');
  }

  onSave() {

    const currentZone = (new Date().toString().match(/([-\+][0-9]+)\s/)||['', '+0000'])[1];
    const zoneFormatted = `${currentZone.toString().slice(0, 3)}:${currentZone.toString().slice(3, 5)}`;
    const currentDate = this.datepipe.transform(this.date?.value, 'yyyy-MM-dd');
    this.currentSelectedMusic.forEach((value, index) => value.sequentialOrder = index + 1);

    const body: EventWithMusicListDto = {
      name: this.name?.value,
      utcDateTime: `${currentDate}T${this.time?.value}${zoneFormatted}`,
      timeZoneName: Intl.DateTimeFormat().resolvedOptions().timeZone,
      musicList: this.currentSelectedMusic,
      userList: this.userMultiCtrl.value
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

    this.userMultiCtrl.setValue([]);

    const loadParticipantsSub = this.userService.findAllAssociationForEvents().subscribe(res => {
      this.userList = res;
      this.filteredUserMulti.next(res);

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

        const selectedList = res.filter(music => selected.find(userOfEvent => userOfEvent.userId === music.userId));
        this.userMultiCtrl.setValue(selectedList);
      }

      this.isLoadingParticipants = false;
    }, err => {

      this.isLoadingParticipants = false;
    });

    this.subscriptions.add(loadParticipantsSub);
  }

  private loadMusics() {
    this.isLoadingMusics = true;

    this.musicMultiCtrl.setValue([]);

    const loadMusicsSub = this.musicService.findAllAssociationForEvents().subscribe(allMusicsToAssociation => {

      this.musicList = allMusicsToAssociation;

      this.filteredMusicMulti.next(allMusicsToAssociation);

      if (this.isAnEdition) {
        const musicListOfEvent = this.eventToEdit?.musicList || [];


        this.musicListOfEdition = musicListOfEvent
            .map(musicOfEvent => {

                const value: MusicSimpleToEventDto = {
                  musicId: musicOfEvent.id || '',
                  musicName: musicOfEvent.name,
                  singerName: musicOfEvent.singer.name
                }

                return value;
            });

        this.musicMultiCtrl.setValue(this.musicListOfEdition);
      }

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

      const dateTimeOfEvent = new Date(`${history.state.utcDateTime}`);

      this.name?.setValue(this.eventToEdit?.name);
      this.date?.setValue(dateTimeOfEvent);
      this.time?.setValue(this.datepipe.transform(dateTimeOfEvent.getTime(), 'HH:mm'));

    }else {
      this.isAnEdition = false;
    }
  }

  protected setInitialValue() {
    this.filteredMusicMulti
      .pipe(
        take(1),
        takeUntil(this._musicMultiSelectSubject)
      )
      .subscribe(() => {

          if (this.musicMultiSelect) {
            this.musicMultiSelect.compareWith =
              (a: MusicOnlyIdAndMusicNameAndSingerNameDto, b: MusicOnlyIdAndMusicNameAndSingerNameDto) => {
                return a && b && a.musicId === b.musicId
            };
          }
      });

    this.filteredUserMulti
      .pipe(
        take(1),
        takeUntil(this._userMultiSelectSubject)
      )
      .subscribe(() => {

          if (this.userMultiSelect) {
            this.userMultiSelect.compareWith =
              (a: UserOnlyIdNameAndEmailDto, b: UserOnlyIdNameAndEmailDto) => {
                return a && b && a.userId === b.userId
            };
          }
      });
  }

  filterMusicMulti() {

    if (!this.musicList) {
      return;
    }

    let search = this.musicMultiFilterCtrl.value;

    if (!search) {
      this.filteredMusicMulti.next(this.musicList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredMusicMulti.next(
      this.musicList.filter(music =>
        music.singerName.toLowerCase().indexOf(search) > -1 ||
        music.musicName.toLowerCase().indexOf(search) > -1
      )
    );
  }

  filterUserMulti() {

    if (!this.userList) {
      return;
    }

    let search = this.userMultiFilterCtrl.value;

    if (!search) {
      this.filteredUserMulti.next(this.userList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredUserMulti.next(
      this.userList.filter(user =>
        user.name.toLowerCase().indexOf(search) > -1
      )
    );
  }

}
