import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { MusicManagementComponent } from './music-management.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaskModule } from 'ngx-mask';
import { MatButtonModule } from '@angular/material/button';


const routes: Routes = [
  { path: 'music', component: MusicManagementComponent },
];

@NgModule({
  declarations: [
    MusicManagementComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    NgxMaskModule.forChild(),
    MatButtonModule
  ]
})
export class MusicManagementModule { }
