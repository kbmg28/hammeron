import { LocalizationService } from './../../internationalization/localization.service';
import { Title } from '@angular/platform-browser';
import { BackPageService } from './../../_services/back-page.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-management',
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.scss']
})
export class EventManagementComponent implements OnInit {

  constructor(private titleService: Title,
    private backPageService: BackPageService,
    private localizationService: LocalizationService,) { }

  ngOnInit(): void {
    this.backPageService.setBackPageValue('/home', this.localizationService.translate('section.events'));
  }

}
