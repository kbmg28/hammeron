import { BackPageService } from './../../_services/back-page.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  constructor(private backPageService: BackPageService) { }

  ngOnInit(): void {
    this.backPageService.setBackPageValue('/home', 'Page Not Found');
  }

}
