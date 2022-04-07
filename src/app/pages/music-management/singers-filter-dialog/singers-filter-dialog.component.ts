import { ElementSelectStaticApp } from './../../../_services/model/ElementSelectStaticApp';
import { map, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { Component, OnInit, Inject, ViewEncapsulation, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatChip } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fromEvent, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-singers-filter-dialog',
  templateUrl: './singers-filter-dialog.component.html',
  styleUrls: ['./singers-filter-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SingersFilterDialogComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  private $paramToSearch: string = '';
  private $data: ElementSelectStaticApp[] = [];

  public searchInputValue: string = '';
  public seachInputSubject: Subject<string> = new Subject<string>();

  singerFilteredList: Array<ElementSelectStaticApp> = [];
  singerSelectedList: Array<string> = new Array<string>();

  constructor(private dialogRef: MatDialogRef<SingersFilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: Array<string>) {

      this.singerFilteredList = this.$data = data.sort((a, b) => a.localeCompare(b))
        .map(singerName => {
          return {
            ref: singerName,
            displayValue: singerName,
            isSelected: false
          }
      });
    }


  ngOnInit(): void {
    this.searchSinger();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  toggleSelection(chip: MatChip, item: ElementSelectStaticApp) {
    if (!chip.selected) {
      this.singerSelectedList.push(item.displayValue);
    } else {
      this.singerSelectedList.splice(this.singerSelectedList.indexOf(item.displayValue));
    }
    chip.toggleSelected();
 }

  close() {
    this.dialogRef.close(this.singerSelectedList);
  }

  hasSingerList() {
    return this.singerFilteredList.length > 0;
  }

  searchSinger(){
    const searchSingerSub = this.seachInputSubject
      .pipe(
          map(value => value.toLowerCase()),
          debounceTime(150),
          distinctUntilChanged(),
          tap((paramToSearch) => {
            this.$paramToSearch = (paramToSearch) ? paramToSearch : '';
            this.searchInputValue = this.$paramToSearch;
            this.singerFilter();
          })
      )
      .subscribe();

      this.subscriptions.add(searchSingerSub);
  }

  private singerFilter() {
    this.singerFilteredList = (this.$paramToSearch === '') ?
        this.dataWithSingerPreviousSelected(this.$data) :
        this.filterByArgument(this.$data, this.$paramToSearch);
  }

  private dataWithSingerPreviousSelected(listToCheck: ElementSelectStaticApp[]) {
    return listToCheck.map(singerElement => {
      if (!!this.singerSelectedList.find(selection => selection === singerElement.displayValue)) {
        singerElement.isSelected = true;
      }

      return singerElement;
    })
  }

  private filterByArgument(arr: ElementSelectStaticApp[], arg: string): ElementSelectStaticApp[] {
    if (arg.length > 0) {
      const arrFiltered = arr.filter((item: ElementSelectStaticApp) => {
        return item.displayValue.toLowerCase().includes(arg)
      });
      return this.dataWithSingerPreviousSelected(arrFiltered)
    }

    return this.dataWithSingerPreviousSelected(this.$data);
  }

}
