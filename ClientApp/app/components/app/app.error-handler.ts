import * as Raven from 'raven-js';

import { ToastyService } from 'ng2-toasty';
import { ErrorHandler, Inject, NgZone, isDevMode } from "@angular/core";

export class AppErrorHandler implements ErrorHandler {

    constructor(
        @Inject(NgZone) private ngZone: NgZone,
        @Inject(ToastyService) private toastyService: ToastyService) {};

    handleError(error: any): void {
        if (!isDevMode())
            Raven.captureException(error.originalError || error);
        else
            throw error; // throw error to the console

        this.ngZone.run(() => {
            if (typeof(window) !== 'undefined') {
                this.toastyService.error({
                    title: 'Error',
                    msg: 'An unexpected error happened.',
                    theme: 'bootstrap',
                    showClose: true,
                    timeout: 5000
                });
            };
        });
    }
}

// run below to change from DEV to PROD:
// - ASPNETCORE_ENVIRONMENT=Production 
//     (this runs proper section in Configure() in startup.cs)
// - run in terminal: webpack
//     (or npm run webpack - to re-generate main bundle)