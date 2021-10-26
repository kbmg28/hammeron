import { ResponseDataMusicWithSingerAndLinksDto } from './swagger-auto-generated/model/responseDataMusicWithSingerAndLinksDto';
import { MusicWithSingerAndLinksDto } from './swagger-auto-generated/model/musicWithSingerAndLinksDto';
import { map } from 'rxjs/operators';
import { ResponseDataSetMusicWithSingerAndLinksDto } from './swagger-auto-generated/model/responseDataSetMusicWithSingerAndLinksDto';
import { Observable } from 'rxjs';
import { MusicControllerService } from './swagger-auto-generated/api/musicController.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MusicService {


  constructor(private musicApi: MusicControllerService) { }

  findAllBySpace(spaceId: string): Observable<Array<MusicWithSingerAndLinksDto>> {

    return this.musicApi.findAllMusicUsingGET(spaceId)
    .pipe(
      // catchError(this.handleError),
      map((resData: ResponseDataSetMusicWithSingerAndLinksDto) => {
        return resData?.content || [];
      })
    );
  }

  create(spaceId: string, body: MusicWithSingerAndLinksDto): Observable<MusicWithSingerAndLinksDto> {

    return this.musicApi.createMusicUsingPOST(spaceId, body)
    .pipe(
      // catchError(this.handleError),
      map((resData: any) => {
        return resData?.content;
      })
    );
  }
}
