import { VehicleService } from './../../services/vehicle.service';
import { SaveVehicle, Vehicle, KeyValuePair } from './../../models/vehicle';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles-list.component.html',
  styleUrls: ['./vehicles-list.component.css']
})
export class VehiclesListComponent implements OnInit {
  vehicles: Vehicle[] = [];
  allVehicles: Vehicle[] = [];
  makes: KeyValuePair[] = [];
  models: KeyValuePair[] = [];
  filter: any = {};

  constructor(private vehicleService: VehicleService) { }

  ngOnInit() {
    this.vehicleService.getMakes()
      .subscribe(makes => this.makes = makes);

    this.vehicleService.getVehicles()
      .subscribe(vehicles => this.vehicles = this.allVehicles = vehicles);
  }

  onFilterChange() {
    var vehicles = this.allVehicles;
    var selectedMakeId = 0;

    if (this.filter.makeId) {
      vehicles = vehicles.filter(v => v.make.id == this.filter.makeId);
      selectedMakeId = this.filter.makeId;
      this.vehicleService.getModels(this.filter.makeId)
        .subscribe(models => this.models = models);
    } else {
      // clear list of models
      delete this.models;
    }

    if (this.filter.modelId)
      vehicles = vehicles.filter(v => v.model.id == this.filter.modelId);

    this.vehicles = vehicles;

    // delete it, so it won't affert another search when the make has been changed
    delete this.filter.modelId;
  }

  resetFilter() {
    this.filter = {};
    this.onFilterChange();
  }

}
