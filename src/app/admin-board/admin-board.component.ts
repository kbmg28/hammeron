import { UserService } from './../_services/user.service';
import { LocalizationService } from './../internationalization/localization.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-board',
  templateUrl: './admin-board.component.html',
  styleUrls: ['./admin-board.component.scss']
})
export class AdminBoardComponent implements OnInit {

  list: Array<string> = [];

  constructor(private titleService: Title, private localizationService: LocalizationService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.findAllUsers();
  }

  findAllUsers() {
    this.userService.findAll().subscribe(res => {
      this.list = res;
    })
  }
}
