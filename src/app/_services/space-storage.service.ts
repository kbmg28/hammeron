import { CurrentSpaceStorage } from './model/currentSpaceStorage';
import { StorageKeyConstants } from './../constants/StorageKeyConstants';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpaceStorageService {

  constructor() { }

  public saveSpace(currentSpace: CurrentSpaceStorage): void {
    localStorage.removeItem(StorageKeyConstants.CURRENT_SPACE_KEY);
    localStorage.setItem(StorageKeyConstants.CURRENT_SPACE_KEY, JSON.stringify(currentSpace));
  }

  public getSpace(): CurrentSpaceStorage {
    const stringJson = localStorage.getItem(StorageKeyConstants.CURRENT_SPACE_KEY);
    return JSON.parse(stringJson || '{}')
  }

}
