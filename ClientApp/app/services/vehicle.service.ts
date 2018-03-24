import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'
import { SaveVehicle } from '../models/vehicle';

@Injectable()
export class VehicleService {
  private readonly vehiclesEndpoint = '/api/vehicles';
  private readonly makesEndpoint = '/api/makes/';
  private readonly featuresEndpoint = '/api/features';

  constructor(private http: Http) { }

  getMakes() {
    return this.http.get(this.makesEndpoint)
      .map(res => res.json());
  }

  getModels(makeId: number) {
    return this.http.get(this.makesEndpoint + makeId + '/models/')
      .map(res => res.json());
  }

  getFeatures() {
    return this.http.get(this.featuresEndpoint)
      .map(res => res.json());
  }

  create(vehicle: SaveVehicle) {
    return this.http.post(this.vehiclesEndpoint, vehicle)
      .map(res => res.json());
  }

  getVehicle(id: any) {
    // var res2 = this.http.get(this.vehiclesEndpoint + "/" + id)
    //   .map(res => res.json());
    // console.log("getVehicle - id: " + id);
    // console.log("getVehicle: " + JSON.stringify(res2));
    // return res2;
    return this.http.get(this.vehiclesEndpoint + "/" + id)
      .map(res => res.json());
    
  }

  update(vehicle: SaveVehicle) {
    return this.http.put(this.vehiclesEndpoint + '/' + vehicle.id, vehicle)
      .map(res => res.json());
  }

  delete(id: number) {
    return this.http.delete(this.vehiclesEndpoint + '/' + id)
      .map(res => res.json())
  }

  getVehicles(filter: {}) {
    return this.http.get(this.vehiclesEndpoint + '?' + this.toQueryString(filter))
      .map(res => res.json());
  }

  toQueryString(obj: any) {
    var parts =[];
    for (var property in obj) {
      var value = obj[property]; // or obj.property
      if (value != null && value != undefined)
        parts.push(encodeURIComponent(property) + '=' + encodeURIComponent(value));
    }

    return parts.join('&');
  }
}
