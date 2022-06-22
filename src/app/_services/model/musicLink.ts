import {MusicLinkDto} from "../swagger-auto-generated";

export interface MusicLink {
  displayValue?: string,
  pngRef?: string,
  link?: string,
  order: string,
  typeLink?: MusicLinkDto.TypeLinkEnum
}
