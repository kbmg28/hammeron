import { AuthGuardService } from './../../guards/auth-guard.service';
import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventManagementComponent } from './event-management.component';


const routes: Routes = [
  { path: 'event', component: EventManagementComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  declarations: [
    EventManagementComponent
  ],
  imports: [
    CommonModule
  ]
})
export class EventManagementModule { }
