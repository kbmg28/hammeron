import { Subscription } from 'rxjs';
import { SpaceApproveDto } from './../../../../_services/swagger-auto-generated/model/spaceApproveDto';
import { SpaceDto } from './../../../../_services/swagger-auto-generated/model/spaceDto';
import { LocalizationService } from './../../../../internationalization/localization.service';
import { SnackBarService } from './../../../../_services/snack-bar.service';
import { SpaceService } from './../../../../_services/space.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-space-request-details-dialog',
  templateUrl: './space-request-details-dialog.component.html',
  styleUrls: ['./space-request-details-dialog.component.scss']
})
export class SpaceRequestDetailsDialogComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  isLoadingApproveSpace = false;
  isLoadingDeletion = false;
  data?: SpaceDto;

  constructor(private dialogRef: MatDialogRef<SpaceRequestDetailsDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data: SpaceDto,
              private spaceService: SpaceService,
              private snackBarService: SnackBarService,
              private localizationService: LocalizationService) {
    this.data = data;
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  translateStatus(): string {
    return this.localizationService.translate(`space.status.${this.data?.spaceStatus}`)
  }

  cancel() {
    this.close(false);
  }

  approveSpace() {
    this.approveSpaceByStatus(this.data?.spaceId || '', SpaceApproveDto.SpaceStatusEnumEnum.APPROVED);
  }

  negateSpace() {
    this.approveSpaceByStatus(this.data?.spaceId || '', SpaceApproveDto.SpaceStatusEnumEnum.NEGATED);
  }

  private approveSpaceByStatus(spaceId: string, status: SpaceApproveDto.SpaceStatusEnumEnum) {
    this.isLoadingApproveSpace = true;

    const approveSpaceSub = this.spaceService.approveSpace(spaceId, status).subscribe(() => {
      this.isLoadingApproveSpace = false;
      this.snackBarService.success(this.localizationService.translate('snackBar.savedSuccessfully'));
      this.close(true);
    }, err => {
      this.snackBarService.error(err);
      this.isLoadingApproveSpace = false;
    });

    this.subscriptions.add(approveSpaceSub);
  }

  close(param: boolean = false) {
    this.dialogRef.close(param);
  }

}
