import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';


import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserListComponent } from './user-list/user-list.component';
import { AuthGuard } from './@core/guards/auth-guard';

import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { MatTooltipModule } from '@angular/material/tooltip';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: '/auth/',
        realm: environment.KEYCLOAK_REALM,
        clientId: environment.KEYCLOAK_CLIENT_ID,
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false,
      },
    });
}

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    KeycloakAngularModule,
    BrowserAnimationsModule, // Add this for animations
    MatSortModule, // For sorting
    MatTableModule, // For tables
    MatButtonModule, // For buttons
    MatIconModule, // For icons
    MatPaginatorModule, // For pagination
    MatTooltipModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    AuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}