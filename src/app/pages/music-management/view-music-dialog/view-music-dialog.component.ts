import { MusicWithSingerAndLinksDto } from './../../../_services/swagger-auto-generated/model/musicWithSingerAndLinksDto';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-music-dialog',
  templateUrl: './view-music-dialog.component.html',
  styleUrls: ['./view-music-dialog.component.scss']
})
export class ViewMusicDialogComponent implements OnInit {

  data: MusicWithSingerAndLinksDto;

  constructor(private dialogRef: MatDialogRef<ViewMusicDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: MusicWithSingerAndLinksDto) {
      this.data = data;
    }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

}
