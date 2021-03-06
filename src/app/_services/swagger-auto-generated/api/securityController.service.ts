/**
 * HammerOn API: Easy control the band's songs
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 0.0.4
 * Contact: kb.developer.br@gmail.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *//* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { Observable }                                        from 'rxjs';

import { ActivateUserAccountRefreshDto } from '../model/activateUserAccountRefreshDto';
import { LoginDto } from '../model/loginDto';
import { RegisterDto } from '../model/registerDto';
import { RegisterPasswordDto } from '../model/registerPasswordDto';
import { ResponseDataJwtTokenDto } from '../model/responseDataJwtTokenDto';
import { ResponseDataVoid } from '../model/responseDataVoid';
import { UserChangePasswordDto } from '../model/userChangePasswordDto';
import { UserTokenHashDto } from '../model/userTokenHashDto';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class SecurityControllerService {

    protected basePath = 'http://localhost:8080';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        for (const consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }


    /**
     * activateUserAccount
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public activateUserAccountUsingPOST(body?: UserTokenHashDto, observe?: 'body', reportProgress?: boolean): Observable<ResponseDataVoid>;
    public activateUserAccountUsingPOST(body?: UserTokenHashDto, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseDataVoid>>;
    public activateUserAccountUsingPOST(body?: UserTokenHashDto, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseDataVoid>>;
    public activateUserAccountUsingPOST(body?: UserTokenHashDto, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});

        let headers = this.defaultHeaders;

        // authentication (language) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["language"]) {
            queryParameters = queryParameters.set('language', this.configuration.apiKeys["language"]);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<ResponseDataVoid>('post',`${this.basePath}/security/register/token`,
            {
                body: body,
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * loginAndGetToken
     * 
     * @param gRecaptchaResponse g-recaptcha-response
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public loginAndGetTokenUsingPOST(gRecaptchaResponse: string, body?: LoginDto, observe?: 'body', reportProgress?: boolean): Observable<ResponseDataJwtTokenDto>;
    public loginAndGetTokenUsingPOST(gRecaptchaResponse: string, body?: LoginDto, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseDataJwtTokenDto>>;
    public loginAndGetTokenUsingPOST(gRecaptchaResponse: string, body?: LoginDto, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseDataJwtTokenDto>>;
    public loginAndGetTokenUsingPOST(gRecaptchaResponse: string, body?: LoginDto, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (gRecaptchaResponse === null || gRecaptchaResponse === undefined) {
            throw new Error('Required parameter gRecaptchaResponse was null or undefined when calling loginAndGetTokenUsingPOST.');
        }


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (gRecaptchaResponse !== undefined && gRecaptchaResponse !== null) {
            queryParameters = queryParameters.set('g-recaptcha-response', <any>gRecaptchaResponse);
        }

        let headers = this.defaultHeaders;

        // authentication (language) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["language"]) {
            queryParameters = queryParameters.set('language', this.configuration.apiKeys["language"]);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<ResponseDataJwtTokenDto>('post',`${this.basePath}/security/token-login`,
            {
                body: body,
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * passwordRecoveryChange
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public passwordRecoveryChangeUsingPOST(body?: UserChangePasswordDto, observe?: 'body', reportProgress?: boolean): Observable<ResponseDataVoid>;
    public passwordRecoveryChangeUsingPOST(body?: UserChangePasswordDto, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseDataVoid>>;
    public passwordRecoveryChangeUsingPOST(body?: UserChangePasswordDto, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseDataVoid>>;
    public passwordRecoveryChangeUsingPOST(body?: UserChangePasswordDto, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});

        let headers = this.defaultHeaders;

        // authentication (language) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["language"]) {
            queryParameters = queryParameters.set('language', this.configuration.apiKeys["language"]);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<ResponseDataVoid>('post',`${this.basePath}/security/password-recovery/change`,
            {
                body: body,
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * passwordRecovery
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public passwordRecoveryUsingPOST(body?: ActivateUserAccountRefreshDto, observe?: 'body', reportProgress?: boolean): Observable<ResponseDataVoid>;
    public passwordRecoveryUsingPOST(body?: ActivateUserAccountRefreshDto, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseDataVoid>>;
    public passwordRecoveryUsingPOST(body?: ActivateUserAccountRefreshDto, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseDataVoid>>;
    public passwordRecoveryUsingPOST(body?: ActivateUserAccountRefreshDto, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});

        let headers = this.defaultHeaders;

        // authentication (language) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["language"]) {
            queryParameters = queryParameters.set('language', this.configuration.apiKeys["language"]);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<ResponseDataVoid>('post',`${this.basePath}/security/password-recovery`,
            {
                body: body,
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * registerUserAccount
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public registerUserAccountUsingPOST(body?: RegisterDto, observe?: 'body', reportProgress?: boolean): Observable<ResponseDataVoid>;
    public registerUserAccountUsingPOST(body?: RegisterDto, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseDataVoid>>;
    public registerUserAccountUsingPOST(body?: RegisterDto, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseDataVoid>>;
    public registerUserAccountUsingPOST(body?: RegisterDto, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});

        let headers = this.defaultHeaders;

        // authentication (language) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["language"]) {
            queryParameters = queryParameters.set('language', this.configuration.apiKeys["language"]);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<ResponseDataVoid>('post',`${this.basePath}/security/register`,
            {
                body: body,
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * registerUserPassword
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public registerUserPasswordUsingPOST(body?: RegisterPasswordDto, observe?: 'body', reportProgress?: boolean): Observable<ResponseDataVoid>;
    public registerUserPasswordUsingPOST(body?: RegisterPasswordDto, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseDataVoid>>;
    public registerUserPasswordUsingPOST(body?: RegisterPasswordDto, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseDataVoid>>;
    public registerUserPasswordUsingPOST(body?: RegisterPasswordDto, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});

        let headers = this.defaultHeaders;

        // authentication (language) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["language"]) {
            queryParameters = queryParameters.set('language', this.configuration.apiKeys["language"]);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<ResponseDataVoid>('post',`${this.basePath}/security/register/password`,
            {
                body: body,
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * resendMailToken
     * 
     * @param body 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public resendMailTokenUsingPOST(body?: ActivateUserAccountRefreshDto, observe?: 'body', reportProgress?: boolean): Observable<ResponseDataVoid>;
    public resendMailTokenUsingPOST(body?: ActivateUserAccountRefreshDto, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseDataVoid>>;
    public resendMailTokenUsingPOST(body?: ActivateUserAccountRefreshDto, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseDataVoid>>;
    public resendMailTokenUsingPOST(body?: ActivateUserAccountRefreshDto, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {


        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});

        let headers = this.defaultHeaders;

        // authentication (language) required
        if (this.configuration.apiKeys && this.configuration.apiKeys["language"]) {
            queryParameters = queryParameters.set('language', this.configuration.apiKeys["language"]);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.request<ResponseDataVoid>('post',`${this.basePath}/security/register/token/refresh`,
            {
                body: body,
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
