import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Injectable()
export class AuthGuard {
  constructor(protected router: Router, protected keycloak: KeycloakService) {}

  canActivate(): boolean | UrlTree {
    try {
      return this.keycloak.isLoggedIn();
    } catch (error) {
      return this.router.parseUrl('/auth');
    }
  }
}
