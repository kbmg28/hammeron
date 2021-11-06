/**
 * API for controlling church music
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 0.0.3
 * Contact: kb.developer.br@gmail.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { MusicTopUsedDto } from './musicTopUsedDto';
import { ResponseError } from './responseError';

export interface ResponseDataListMusicTopUsedDto { 
    content?: Array<MusicTopUsedDto>;
    error?: ResponseError;
}