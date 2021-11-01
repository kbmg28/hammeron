import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatChip } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-singers-filter-dialog',
  templateUrl: './singers-filter-dialog.component.html',
  styleUrls: ['./singers-filter-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SingersFilterDialogComponent implements OnInit {

  allSingerList: Array<string>;
  singerSelectedList: Array<string> = new Array<string>();

  constructor(private dialogRef: MatDialogRef<SingersFilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: Array<string>) {
      this.allSingerList = data.sort((a, b) => a.localeCompare(b));
    }


  ngOnInit(): void {
  }

  toggleSelection(chip: MatChip, item: string) {
    if (!chip.selected) {
      this.singerSelectedList.push(item);
    } else {
      this.singerSelectedList.splice(this.singerSelectedList.indexOf(item));
    }
    chip.toggleSelected();
 }

  close() {
    this.dialogRef.close(this.singerSelectedList);
  }

}
