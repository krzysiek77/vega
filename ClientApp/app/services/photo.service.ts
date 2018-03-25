import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class PhotoService {

    constructor(private http: Http) {}

    getPhotos(vehicleId: number) {
        return this.http.get(`/api/vehicles/${vehicleId}/photos`)
            .map(res => res.json());
    }

    upload(vehicleId: number, photo: any) {
        var formData = new FormData();
        // 1st argument: name, must be exactly the same as a name of an argument in an API methods that is called
        formData.append('file', photo);
        return this.http.post(`/api/vehicles/${vehicleId}/photos`, formData)
            .map(res => res.json());
    }
}