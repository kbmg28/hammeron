import { ViewMusicDialogComponent } from './view-music-dialog/view-music-dialog.component';
import { BackPageService } from './../../_services/back-page.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-music-management',
  templateUrl: './music-management.component.html',
  styleUrls: ['./music-management.component.scss']
})
export class MusicManagementComponent implements OnInit {

  constructor(private backPageService: BackPageService, public dialogService: MatDialog) { }

  ngOnInit(): void {
    this.backPageService.setBackPageValue('/home', 'Music Management');
  }

  openDialog() {
    let dialogConfig = new MatDialogConfig();
    dialogConfig = {
      position: {
        'bottom': '0'
      },
      panelClass: 'full-screen-modal',
      width: '100vw',
      maxWidth: 'max-width: none',
      data: {
        id: 1,
        musicName: '[Nome da Música]'
      }
    }

    const dialogRef = this.dialogService.open(ViewMusicDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
