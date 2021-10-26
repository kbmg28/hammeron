import { ResponseDataSetUserWithPermissionDto } from './../../_services/swagger-auto-generated/model/responseDataSetUserWithPermissionDto';
import { BackPageService } from './../../_services/back-page.service';
import { UserService } from './../../_services/user.service';
import { LocalizationService } from './../../internationalization/localization.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-board',
  templateUrl: './admin-board.component.html',
  styleUrls: ['./admin-board.component.scss']
})
export class AdminBoardComponent implements OnInit {

  list: Array<any> = [];

  constructor(private titleService: Title, private localizationService: LocalizationService,
    private userService: UserService, private backPageService: BackPageService) { }

  ngOnInit(): void {
    this.backPageService.setBackPageValue('/home', 'Admin Board');
  }

}
