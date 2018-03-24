import { ToastyService } from 'ng2-toasty';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/Observable/forkJoin';
import * as _ from 'underscore';

import { VehicleService } from '../../services/vehicle.service';
import { Vehicle, SaveVehicle } from './../../models/vehicle';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {
  makes: any[] = [];
  models: any[] = [];
  features: any[] = [];
  vehicle: SaveVehicle = {
    id: 0,
    makeId: 0,
    modelId: 0,
    isRegistered: false,
    features: [],
    contact: {
      name: '',
      phone: '',
      email: ''
    }
  };

  constructor(
    private route: ActivatedRoute, // to read route parameters
    private router: Router, // to navigate user to different page if they pass invalid id
    private vehicleService: VehicleService,
    private toastyService: ToastyService
  ) { 
    route.params.subscribe(p => {
      this.vehicle.id = +p['id'] || 0; // + in-front to convert string to number
    });
  }

  ngOnInit() {
    var sources = [
      this.vehicleService.getMakes(),
      this.vehicleService.getFeatures()
    ];

    // to not call it, when creating new vehicle (id = 0 or NaN).
    // otherwise it goes into loop and redirect to /home every time when I try to hit /vehicles/new
    if (this.vehicle.id)
      sources.push(this.vehicleService.getVehicle(this.vehicle.id));

    Observable.forkJoin(sources)
      .subscribe(data => {
        this.makes = data[0];
        this.features = data[1];
        
        if (this.vehicle.id) {
          this.setVehicle(data[2]);
          this.populateModels();
        }
          
      }, err => {
        if (err.status == 404)
          this.router.navigate(['/home']);
      });
  }

  // how to map object from server (complete representation of a vehicle)
  // to a save vehicle resource object.
  private setVehicle(v: Vehicle) {
    this.vehicle.id = v.id;
    this.vehicle.modelId = v.model.id;
    this.vehicle.makeId = v.make.id;
    this.vehicle.isRegistered = v.isRegistered;
    this.vehicle.contact = v.contact;
    this.vehicle.features = _.pluck(v.features, 'id');
  }

  onMakeChange()
  {
    this.populateModels();
    delete this.vehicle.modelId;
  }

  private populateModels() {
    var selectedMake = this.makes.find(m => m.id == this.vehicle.makeId);
    //this.models = selectedMake ? selectedMake.models : [];
    if (selectedMake) {
      this.vehicleService.getModels(selectedMake.id).subscribe(models => {
        this.models = models;
        //console.log("get models for make: ", this.models);
      });
    } else {
      this.models = [];
    }
  }

  onFeatureToggle(featureId: number, $event: any) {
    if ($event.target.checked)
      this.vehicle.features.push(featureId);
    else {
      var index = this.vehicle.features.indexOf(featureId);
      this.vehicle.features.splice(index, 1);
    }
  }

  submit() {
    var result$ = (this.vehicle.id) ?  this.vehicleService.update(this.vehicle) : this.vehicleService.create(this.vehicle);
      result$.subscribe(vehicle => {
        this.toastyService.success({
          title: 'Success',
          msg: 'The vehicle was sucessfully saved.',
          theme: 'bootstrap',
          showClose: true,
          timeout: 5000
        });
        this.router.navigate(['/vehicles/', vehicle.id])
      });
  }
}
