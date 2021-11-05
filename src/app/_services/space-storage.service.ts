import { BehaviorSubject, Observable } from 'rxjs';
import { CurrentSpaceStorage } from './model/currentSpaceStorage';
import { StorageKeyConstants } from './../constants/StorageKeyConstants';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpaceStorageService {

  private _subject: BehaviorSubject<CurrentSpaceStorage>;
  public currentSpace: Observable<CurrentSpaceStorage>;

  constructor() {
    const currentSpace = this.getSpace();

    this._subject = new BehaviorSubject<CurrentSpaceStorage>(currentSpace);
    this.currentSpace = this._subject.asObservable();
  }

  public saveSpace(currentSpace: CurrentSpaceStorage): void {
    localStorage.removeItem(StorageKeyConstants.CURRENT_SPACE_KEY);
    localStorage.setItem(StorageKeyConstants.CURRENT_SPACE_KEY, JSON.stringify(currentSpace));
    this._subject.next(currentSpace);
  }

  public getSpace(): CurrentSpaceStorage {
    const stringJson = localStorage.getItem(StorageKeyConstants.CURRENT_SPACE_KEY);
    return JSON.parse(stringJson || '{}')
  }

}
