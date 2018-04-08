// src/app/auth/auth.service.ts
import { JwtHelper } from 'angular2-jwt';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import * as auth0 from 'auth0-js';

@Injectable()
export class AuthService {
  private roles: string[] =[];

  auth0 = new auth0.WebAuth({
    clientID: 'OnceAC5DRjJtE7nGNqviZM9rTTTdnQwR',
    domain: 'blus4uuu.eu.auth0.com',
    responseType: 'token id_token',
    audience: 'https://api.vega.com',
    redirectUri: 'http://localhost:5000/vehicles',
    scope: 'openid profile',
  });

  constructor(public router: Router) {
    // Get user info from local storage
      this.readUserInfoFromLocalStorage();
  }

  private readUserInfoFromLocalStorage() {
    // this.profile = JSON.parse(localStorage.getItem('profile'));
  
    let token = localStorage.getItem('access_token');
    if (token) {
      let jwtHelper = new JwtHelper();
      let decodedToken = jwtHelper.decodeToken(token);
      this.roles = decodedToken['https://vega.com/roles'];
    }
  }

  public isInRole(roleName: string) {
    return this.roles.indexOf(roleName) > -1;
  }

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err: any, authResult: any) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        this.readUserInfoFromLocalStorage();
        this.router.navigate(['/home']);
        console.log("authResult", authResult);
      } else if (err) {
        this.router.navigate(['/home']);
        console.log(err);
      }
    });
  }

  private setSession(authResult: any): void {
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    // access_token changed to token, because it's the value that AuthHttp is looking for
    localStorage.setItem('token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    this.roles = [];
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '{}');
    return new Date().getTime() < expiresAt;
  }

}