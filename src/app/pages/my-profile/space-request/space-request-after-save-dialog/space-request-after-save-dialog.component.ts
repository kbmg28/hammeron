import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-space-request-after-save-dialog',
  templateUrl: './space-request-after-save-dialog.component.html',
  styleUrls: ['./space-request-after-save-dialog.component.scss']
})
export class SpaceRequestAfterSaveDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<SpaceRequestAfterSaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any) { }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

}
