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
  makes: KeyValuePair[] = [];
  models: KeyValuePair[] = [];
  query: any = {};

  constructor(private vehicleService: VehicleService) { }

  ngOnInit() {
    this.vehicleService.getMakes()
      .subscribe(makes => this.makes = makes);

    this.populateVehicles();
  }

  private populateVehicles() {
    if (this.query.makeId) {
      this.vehicleService.getModels(this.query.makeId)
        .subscribe(models => this.models = models);
    } else {
      // clear list of models
      delete this.models;
    }
    this.vehicleService.getVehicles(this.query)
      .subscribe(vehicles => this.vehicles = vehicles);

    // delete it, so it won't affert another search when the make has been changed
    delete this.query.modelId;
  }

  onFilterChange() {
    this.populateVehicles();
  }

  resetFilter() {
    this.query = {};
    this.onFilterChange();
  }

  sortBy(columnName: string) {
    if (this.query.sortBy === columnName) {
      this.query.isSortAscending = !this.query.isSortAscending;
    } else {
      this.query.sortBy = columnName;
      this.query.isSortAscending = true;
    }
    this.populateVehicles();
  } 

}
