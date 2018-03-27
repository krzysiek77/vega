import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(protected auth: AuthService) { }

    canActivate() {
        if (this.auth.isAuthenticated())
            return true;

        let element = document.getElementById('login-button');
        
        if (element)
            element.click();

        return false;
    }
}