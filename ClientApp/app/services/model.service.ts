import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'

@Injectable()
export class ModelService {

  constructor(private http: Http) { }

  getModels(makeId: number) {
    return this.http.get('/api/makes/' + makeId + '/models/')
      .map(res => res.json());
  }

}
