
import { LocalizationService } from './internationalization/localization.service';
import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private swUpdate: SwUpdate,
    private localizationService: LocalizationService) {
    }

  ngOnInit(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {

        if(confirm(this.localizationService.translate('config.newVersionAvailable'))) {

            window.location.reload();
        }
      });
    }
  }
}
