import { Observable, BehaviorSubject } from 'rxjs';
import { SnackBarService } from './../../../_services/snack-bar.service';
import { BackPageService } from './../../../_services/back-page.service';
import { Router } from '@angular/router';
import { LocalizationService } from './../../../internationalization/localization.service';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Component, forwardRef, OnInit } from '@angular/core';
import { MusicService } from 'src/app/_services/music.service';
import { NgxMaterialTimepickerTheme } from 'ngx-material-timepicker';

export interface Test {
  id: string,
  name: string
}

@Component({
  selector: 'app-create-or-edit-event',
  templateUrl: './create-or-edit-event.component.html',
  styleUrls: ['./create-or-edit-event.component.scss']
})
export class CreateOrEditEventComponent implements OnInit {

  private _participantsToSelectMap: Map<string, Test> = new Map();
  selectedParticipantsMap: Map<string, Test> = new Map();

  private participantsSubject: BehaviorSubject<any> = new BehaviorSubject([]);
  public selectedParticipants: Observable<Test[]>;

  minDate: Date;
  maxDate: Date;

  eventForm: FormGroup;

  list: Test[] = [];
  listToSelect: Test[] = [];
  filteredOptions?: Observable<Test[]>;
  //musicStatusList?: ElementSelectStaticApp[];

  isLoading = false;
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
              private musicService: MusicService) {
    this.eventForm = this.fb.group({
      name: [null, [Validators.required]],
      date: [null, [Validators.required]],
      time: [null, [Validators.required]],
      participants: [null, []]
    });

    const today = new Date()

    this.minDate = today;
    this.maxDate = new Date(today);

    this.maxDate.setMonth(today.getMonth() + 4);

    this.selectedParticipants = this.participantsSubject.asObservable();
  }

  ngOnInit(): void {
    this.checkIfEdition();
    this.titleService.setTitle(this.localizationService.translate(this.isAnEdition ?
        'titleRoutesBrowser.events.edit' : 'titleRoutesBrowser.events.create'));
    const textHeader = this.localizationService.translate(this.isAnEdition ? "event.edit" : "event.create");
    this.backPageService.setBackPageValue('/event', textHeader);

    this.list.push({id: "kaaa", name: "kaaaValue"},
    {id: "ab", name: "abValue"},
    {id: "ba", name: "baValue"},
    {id: "ac", name: "o que acontece se o nome da pessoa for muito grande"},
    {id: "zf", name: "zfValue"},
    {id: "qs", name: "qsValue"});

    this.list.sort((a, b) => a.id.localeCompare(b.id))
    this.listToSelect = this.list;
    this._participantsToSelectMap = new Map(this.listToSelect.map(i => [i.id, i]));
  }

  get name() {  return this.eventForm.get('name'); }
  get date() {  return this.eventForm.get('date'); }
  get time() {  return this.eventForm.get('time'); }

  isInvalidFormOrNoChanges(): boolean {
    const isInvalidFormOrIsLoading = !this.eventForm.valid || this.isLoading;
    var isDisabled: boolean;

    if (this.isAnEdition) {
      // check fields

      const hasNoChanges = true;

      isDisabled= isInvalidFormOrIsLoading || hasNoChanges;
    } else {
      isDisabled = isInvalidFormOrIsLoading;
    }
    return isDisabled;
  }

  onSelectParticipant(selected: any) {
    this.selectedParticipantsMap.set(selected.id, selected);
    this._participantsToSelectMap.delete(selected.id)
    this.listToSelect = Array.from( this._participantsToSelectMap.values() );
    this.participantsSubject.next(Array.from( this.selectedParticipantsMap.values() ));
  }

  onRemoveParticipantChip(item: any) {
    this._participantsToSelectMap.set(item.id, item);
    this.selectedParticipantsMap.delete(item.id)
    this.listToSelect = Array.from(this._participantsToSelectMap.values())
                          .sort((a, b) => a.name.localeCompare(b.name));
    this.participantsSubject.next(Array.from( this.selectedParticipantsMap.values() ));
  }

  onSave() {

  }

  private checkIfEdition() {
    if(history.state && history.state.id) {
      this.isAnEdition = true;

//      this.eventToEdit = history.state;
    }else {
      this.isAnEdition = false;
    }
  }

}
