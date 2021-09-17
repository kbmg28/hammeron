import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { HeaderToolbarComponent } from './header-toolbar/header-toolbar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaskModule } from 'ngx-mask';


@NgModule({
  declarations: [
    HeaderToolbarComponent,

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
