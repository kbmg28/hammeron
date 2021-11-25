import { SnackBarService } from './../../_services/snack-bar.service';
import { LocalizationService } from './../../internationalization/localization.service';
import { BackPageService } from './../../_services/back-page.service';
import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-space-management',
  templateUrl: './space-management.component.html',
  styleUrls: ['./space-management.component.scss']
})
export class SpaceManagementComponent implements OnInit {


  constructor(private titleService: Title,
    private backPageService: BackPageService,
    private dialogService: MatDialog,
    private localizationService: LocalizationService,
    private snackBarService: SnackBarService) {
      this.titleService.setTitle('title...');
    }

  ngOnInit(): void {
    this.backPageService.setBackPageValue('/home', this.localizationService.translate('space.sectionName'));
  }

}
