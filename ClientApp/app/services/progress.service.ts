import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BrowserXhr } from '@angular/http';

@Injectable()
export class ProgressService {
    private uploadProgress: Subject<any> = new Subject();

    startTracking() {
        this.uploadProgress = new Subject();
        return this.uploadProgress;
    }

    notify(progress: any) {
        this.uploadProgress.next(progress);
    }

    endTracking() {
        this.uploadProgress.complete();
    }
}

// XMLHttpRequest
// BrowserXhr
@Injectable()
export class BrowserXhrWithProgress extends BrowserXhr {
    // because we are extending one of an Angular classes,
    // we need to call its constructor
    constructor(private service: ProgressService) { super(); }

    build(): XMLHttpRequest {
        var xhr: XMLHttpRequest = super.build();

        xhr.upload.onprogress = (event) => {
            this.service.notify(this.createProgress(event));
        }

        xhr.upload.onloadend = () => {
            this.service.endTracking();            
        }

        return xhr;
    }

    private createProgress(event: any) {
        return {
            total: event.total,
            percentage: Math.round(event.loaded / event.total * 100)
        };
    }
}