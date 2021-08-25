import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalizationConfigService {
    public locale_id: string = '';
}
