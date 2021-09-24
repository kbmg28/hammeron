import { BackPageInterface } from './model/backPage';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { StorageKeyConstants } from '../constants/StorageKeyConstants'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class BackPageService {

  private backPageSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public backPage: Observable<BackPageInterface>;

  constructor(private route: Router) {
    const defaultBackPage = { showToolbarHeader: false }
    const backPageLocalStorage = localStorage.getItem(StorageKeyConstants.BACK_PAGE_KEY);

    if (backPageLocalStorage !== null) {
      this.backPageSubject = new BehaviorSubject<BackPageInterface>(JSON.parse(backPageLocalStorage))
    } else {
      this.backPageSubject = new BehaviorSubject<BackPageInterface>(defaultBackPage)
      localStorage.setItem(StorageKeyConstants.BACK_PAGE_KEY, JSON.stringify(defaultBackPage))
    }

    this.backPage = this.backPageSubject.asObservable();
  }

  public get backPageValue(): BackPageInterface {
    return this.backPageSubject.value;
  }

  public setBackPageValue(routeValue?: string, textValue?: string): void {
    var newBackPageValue: BackPageInterface = {
      showToolbarHeader: !!textValue,
      routeValue: routeValue,
      textValue: textValue
    }
console.log(newBackPageValue)
    localStorage.setItem(StorageKeyConstants.BACK_PAGE_KEY, JSON.stringify(newBackPageValue))
    this.backPageSubject.next(newBackPageValue);

  }


}
