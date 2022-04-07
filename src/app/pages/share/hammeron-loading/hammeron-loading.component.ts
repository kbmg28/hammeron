import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hammeron-loading',
  templateUrl: './hammeron-loading.component.html',
  styleUrls: ['./hammeron-loading.component.scss']
})
export class HammeronLoadingComponent implements OnInit {

  @Input()
  width: any = 320;

  constructor() { }

  ngOnInit(): void {
  }

}
