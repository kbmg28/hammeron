import { LocalizationService } from './../../internationalization/localization.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register-confirmation',
  templateUrl: './register-confirmation.component.html',
  styleUrls: ['./register-confirmation.component.scss']
})
export class RegisterConfirmationComponent implements OnInit {

  constructor(private localizationService: LocalizationService) { }

  ngOnInit(): void {
  }

  sendNewToken() {
    console.log('send new token...')
  }

}
