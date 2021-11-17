import { MusicOnlyIdAndMusicNameAndSingerNameDto } from './../swagger-auto-generated/model/musicOnlyIdAndMusicNameAndSingerNameDto';

export interface MusicGroupingBySingerName {
  singerName: string;
  musics: MusicOnlyIdAndMusicNameAndSingerNameDto[];
}
