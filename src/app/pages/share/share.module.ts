import { HammeronLoadingComponent } from './hammeron-loading/hammeron-loading.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaskModule } from 'ngx-mask';
import {SafePipe} from "../../_helpers/safe.pipe";
import { HammeronEventCardComponent } from './hammeron-event-card/hammeron-event-card.component';
import {MatCardModule} from "@angular/material/card";
import {MatRippleModule} from "@angular/material/core";


@NgModule({
  declarations: [
    HammeronLoadingComponent,
    SafePipe,
    HammeronEventCardComponent
  ],
    exports: [
        HammeronLoadingComponent,
        SafePipe,
        HammeronEventCardComponent
    ],
  imports: [
    TranslateModule.forChild(),
    NgxMaskModule.forChild(),
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatRippleModule,
  ]
})
export class ShareModule { }
