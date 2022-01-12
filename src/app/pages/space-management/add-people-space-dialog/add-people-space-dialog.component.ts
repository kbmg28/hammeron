import { UserService } from './../../../_services/user.service';
import { ElementSelectStaticApp } from './../../../_services/model/ElementSelectStaticApp';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LocalizationService } from './../../../internationalization/localization.service';
import { SnackBarService } from './../../../_services/snack-bar.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { UserPermissionEnum } from 'src/app/_services/model/enums/userPermissionEnum';

@Component({
  selector: 'app-add-people-space-dialog',
  templateUrl: './add-people-space-dialog.component.html',
  styleUrls: ['./add-people-space-dialog.component.scss']
})
export class AddPeopleSpaceDialogComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  addPeopleOnSpaceForm: FormGroup;
  data: string;
  isLoading = false;
  permissions: ElementSelectStaticApp[];
  selectedValue?: string;

  constructor(private dialogRef: MatDialogRef<AddPeopleSpaceDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data: string,
              private snackBarService: SnackBarService,
              private localizationService: LocalizationService,
              private fb: FormBuilder,
              private userService: UserService
              ) {

      this.addPeopleOnSpaceForm = this.fb.group({
        email: [null, [Validators.required, Validators.email]],
        permission: ['', Validators.required]
      });

      this.permissions = Object.values(UserPermissionEnum)
        .filter(per => per !== UserPermissionEnum.SYS_ADMIN)
        .map(permission => {
          return {
            i18n: `user.permissions.${permission}`,
            ref: permission,
            displayValue: this.localizationService.translate(`user.permissions.${permission}`),
            isSelected: false
          }
      });

    this.data = data;
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  get email() {   return this.addPeopleOnSpaceForm.get('email'); }
  get permission() {   return this.addPeopleOnSpaceForm.get('permission'); }

  getErrorInvalidEmailMessage() {
    if (this.email?.hasError('required')) {
      return this.localizationService.translate('validations.requiredField');
    }

    return this.email?.hasError('email') ? this.localizationService.translate('validations.user.invalidEmail') : '';
  }

  cancel() {
    this.close(false);
  }

  isInvalidFormOrLoadingRequest(): boolean {
    return !this.addPeopleOnSpaceForm.valid || this.isLoading;
  }

  onSubmit(): void {
    const email = this.email?.value;
    const permission = this.permission?.value;

    this.isLoading = true;

    const changePermissioSub = this.userService.changePermission(email, permission)
      .subscribe(() => {

        this.snackBarService.success(this.localizationService.translate('snackBar.savedSuccessfully'));
        this.isLoading = false;
        this.close(true);
      }, err => {
        this.snackBarService.error(err);
        this.isLoading = false;
      });

    this.subscriptions.add(changePermissioSub);
  }

  private close(param: boolean) {
    this.dialogRef.close(param);
  }

}
