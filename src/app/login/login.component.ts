import { LocalizationService } from './../internationalization/localization.service';
import { TitleRoutesConstants } from './../constants/TitleRoutesConstants';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private titleService: Title, private localizationService: LocalizationService) {
    this.titleService.setTitle(localizationService.translate('titleRoutesBrowser.login'));
   }


  ngOnInit(): void {
  }

}
