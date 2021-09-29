import { BackPageService } from './../../../_services/back-page.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  constructor(private backPageService: BackPageService) { }

  ngOnInit(): void {
    this.backPageService.setBackPageValue('/login', 'Reset Password');
  }

}
