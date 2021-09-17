import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-button-loading',
  templateUrl: './button-loading.component.html',
  styleUrls: ['./button-loading.component.scss']
})
export class ButtonLoadingComponent implements OnInit, OnChanges {

  @Input()
  isLoading: boolean = false;

  @Input()
  isValidForm: boolean = false;

  @Input()
  keyMessage: string = 'button.continue';

  @Input()
  backgroundColor: string = '#142454';

  @Input()
  textColor: string = 'white';

  @Input()
  buttonWidthSize: string = '';

  @Input()
  buttonHeightSize: string = '';

  layoutBackgroundColor = '';
  layoutTextColor = '';

  constructor() { }

  ngOnInit(): void {
    this.getConditionToChangeLayout();
  }

  ngOnChanges() {
    this.getConditionToChangeLayout();
  }

  getConditionToChangeLayout(): void {
    if (!this.isValidForm && !this.isLoading) {
      this.layoutBackgroundColor = this.backgroundColor;
      this.layoutTextColor = this.textColor;
    } else {
      this.layoutBackgroundColor = '';
      this.layoutTextColor = '';
    }
  }

}
