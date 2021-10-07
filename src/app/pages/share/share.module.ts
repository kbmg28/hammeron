import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaskModule } from 'ngx-mask';


@NgModule({
  declarations: [

  ],
  imports: [
    TranslateModule.forChild(),
    NgxMaskModule.forChild(),
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ]
})
export class ShareModule { }
