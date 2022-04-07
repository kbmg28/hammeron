import { Subscription } from 'rxjs';
import { SnackBarService } from './../../../_services/snack-bar.service';
import { UserDto } from './../../../_services/swagger-auto-generated/model/userDto';
import { UserWithPermissionDto } from './../../../_services/swagger-auto-generated/model/userWithPermissionDto';
import { UserService } from './../../../_services/user.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserLogged } from './../../auth/login/userLogged';
import { AuthService } from './../../../_services/auth.service';
import { BackPageService } from './../../../_services/back-page.service';
import { Router } from '@angular/router';
import { TokenStorageService } from './../../../_services/token-storage.service';
import { LocalizationService } from './../../../internationalization/localization.service';
import { Title } from '@angular/platform-browser';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-edit-my-user',
  templateUrl: './edit-my-user.component.html',
  styleUrls: ['./edit-my-user.component.scss']
})
export class EditMyUserComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  userForm: FormGroup;
  currentUserLogged?: UserWithPermissionDto;
  isLoading: boolean = false;

  constructor(private titleService: Title,
    private localizationService: LocalizationService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private backPageService: BackPageService,
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder,
    private snackBarService: SnackBarService) {
      this.userForm = this.fb.group({
        name: [null, [Validators.required]],
        email: [{ value: null, disabled: true }, [Validators.email]],
        cellPhone: [null, [Validators.required]]
      });
    }

  ngOnInit(): void {
    this.backPageService.setBackPageValue('/my-profile', this.localizationService.translate('myProfile.myData'));
    this.initForm();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  get name() {  return this.userForm.get('name'); }
  get email() {  return this.userForm.get('email'); }
  get cellPhone() {    return this.userForm.get('cellPhone'); }

  isInvalidFormOrNoChanges(): boolean {
    const hasChangedName = this.currentUserLogged?.name !== this.name?.value;
    const hasChangedCellPhone = this.currentUserLogged?.cellPhone !== this.cellPhone?.value;

    const hasNoChanges = !(hasChangedName || hasChangedCellPhone);

    return (!this.userForm.valid || this.isLoading) || hasNoChanges;
  }

  initForm() {
    const findUserLoggedSub = this.userService.findUserLogged().subscribe(res => {
      this.currentUserLogged = res;
      this.name?.setValue(this.currentUserLogged.name)
      this.email?.setValue(this.currentUserLogged.email)
      this.cellPhone?.setValue(this.currentUserLogged.cellPhone)
    }, err => {

    });

    this.subscriptions.add(findUserLoggedSub);
  }

  onSave() {
    const body: UserDto = {
      email: this.currentUserLogged?.email || '',
      name: this.name?.value,
      cellPhone: this.cellPhone?.value
    };

    const updateUserLoggedSub = this.userService.updateUserLogged(body).subscribe(res => {
      let userLoggedFromStorage = this.tokenStorageService.getUserLogged();
      userLoggedFromStorage.name = res.name || '';
      this.tokenStorageService.saveUser(userLoggedFromStorage);
      this.router.navigate(['/my-profile'])
    }, err => {
      this.snackBarService.error(err);
    });

    this.subscriptions.add(updateUserLoggedSub);
  }
}
