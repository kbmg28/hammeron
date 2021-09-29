import { BackPageService } from './../../_services/back-page.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-music-management',
  templateUrl: './music-management.component.html',
  styleUrls: ['./music-management.component.scss']
})
export class MusicManagementComponent implements OnInit {

  constructor(private backPageService: BackPageService) { }

  ngOnInit(): void {
    this.backPageService.setBackPageValue('/home', 'Music Management');
  }

}
