import { MatDialogModule } from '@angular/material/dialog';
import { MatTreeModule } from '@angular/material/tree';
import { HeaderToolbarComponent } from './pages/share/header-toolbar/header-toolbar.component';
import { BackPageService } from './_services/back-page.service';
import { AuthGuardService } from './guards/auth-guard.service';
import { MusicManagementModule } from './pages/music-management/music-management.module';
import { AuthModule } from './pages/auth/auth.module';
import { BASE_PATH } from './_services/swagger-auto-generated/variables';
import { ApiModule } from './_services/swagger-auto-generated/api.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { InternationalizationModule } from './internationalization/internationalization.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { AdminBoardComponent } from './pages/admin-board/admin-board.component';

import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { NgxMaskModule } from 'ngx-mask';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { ShareModule } from './pages/share/share.module';
import { CookieService } from 'ngx-cookie-service';

/**
* The http loader factory : Loads the files from define path.
* @param {HttpClient} http
* @returns {TranslateHttpLoader}
* @constructor
*/
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/locales/', '.json');
}
import { registerLocaleData } from '@angular/common';
import localePT from '@angular/common/locales/pt';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EventManagementModule } from './pages/event-management/event-management.module';
import { ChangeSpaceComponent } from './pages/home/change-space/change-space.component';
import { EditMyUserComponent } from './pages/my-profile/edit-my-user/edit-my-user.component';
import { SpaceRequestComponent } from './pages/my-profile/space-request/space-request.component';
import { AutosizeModule } from 'ngx-autosize';
import { SpaceRequestAfterSaveDialogComponent } from './pages/my-profile/space-request/space-request-after-save-dialog/space-request-after-save-dialog.component';

registerLocaleData(localePT);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdminBoardComponent,
    PageNotFoundComponent,
    MyProfileComponent,
    HeaderToolbarComponent,
    ChangeSpaceComponent,
    EditMyUserComponent,
    SpaceRequestComponent,
    SpaceRequestAfterSaveDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgxMaskModule.forRoot(),
    AutosizeModule,
    InternationalizationModule.forRoot({ locale_id: 'pt-BR' }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    ApiModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatIconModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatMenuModule,
    AuthModule,
    MusicManagementModule,
    EventManagementModule,
    ShareModule,
    MatSnackBarModule,
    MatTreeModule,
    MatDialogModule,
    MatTooltipModule
  ],
  providers: [authInterceptorProviders, CookieService, AuthGuardService, BackPageService,
    {provide: BASE_PATH, useValue: environment.API_BASE_PATH}],
  bootstrap: [AppComponent]
})
export class AppModule { }
