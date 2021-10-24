import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-music-dialog',
  templateUrl: './view-music-dialog.component.html',
  styleUrls: ['./view-music-dialog.component.scss']
})
export class ViewMusicDialogComponent implements OnInit {

  musicName: string;

  constructor(private dialogRef: MatDialogRef<ViewMusicDialogComponent>,
    @Inject(MAT_DIALOG_DATA) {id, musicName}: any) {
      this.musicName = musicName;
    }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

}
