import { Subscription } from 'rxjs';
import { SpaceRequestDto } from './../../../_services/swagger-auto-generated/model/spaceRequestDto';
import { Title } from '@angular/platform-browser';
import { SpaceService } from './../../../_services/space.service';
import { SnackBarService } from './../../../_services/snack-bar.service';
import { BackPageService } from './../../../_services/back-page.service';
import { Router } from '@angular/router';
import { LocalizationService } from './../../../internationalization/localization.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SpaceRequestAfterSaveDialogComponent } from './space-request-after-save-dialog/space-request-after-save-dialog.component';

@Component({
  selector: 'app-space-request',
  templateUrl: './space-request.component.html',
  styleUrls: ['./space-request.component.scss']
})
export class SpaceRequestComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  spaceRequestForm: FormGroup;
  isLoading: boolean = false;

  constructor(private titleService: Title,
    private localizationService: LocalizationService,
    private router: Router,
    private backPageService: BackPageService,
    private spaceService: SpaceService,
    private fb: FormBuilder,
    private snackBarService: SnackBarService,
    private dialog: MatDialog) {
      this.spaceRequestForm = this.fb.group({
        name: [null, [Validators.required]],
        justification: [null, [Validators.required]]
      });
    }

  ngOnInit(): void {
    this.backPageService.setBackPageValue('/my-profile', this.localizationService.translate('myProfile.spaceRequest'));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  get name() {  return this.spaceRequestForm.get('name'); }
  get justification() {  return this.spaceRequestForm.get('justification'); }

  openDialog() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      position: {
        'bottom': '0'
      },
      panelClass: 'full-screen-modal',
      width: '100vw',
      maxWidth: 'max-width: none',
      disableClose: true
    }

    const dialogRef = this.dialog.open(SpaceRequestAfterSaveDialogComponent, dialogConfig);


    const dialogRefSub = dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/my-profile']);
    });

    this.subscriptions.add(dialogRefSub);
  }

  onSave() {
    const body: SpaceRequestDto = {
      name: this.name?.value,
      justification: this.justification?.value
    }

    this.isLoading = true;

    const requestNewSpaceSub = this.spaceService.requestNewSpace(body).subscribe(res => {

      this.isLoading = false;
      this.openDialog();
    }, err => {
      this.snackBarService.error(err);
      this.isLoading = false;
    });

    this.subscriptions.add(requestNewSpaceSub);
  }
}
