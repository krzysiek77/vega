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
  query: any = {
    pageSize: 3
  };
  columns = [
    { title: 'Id'}, //key and isSortable (bool is false by default) are not required, because we don't want to sort by this column
    { title: 'Make', key: 'make', isSortable: true },
    { title: 'Model', key: 'model', isSortable: true },
    { title: 'Contact Name', key: 'contactName', isSortable: true },
    { }, // last column with view link doesn't even have title
  ];

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

  onPageChange(page: number) {
    this.query.page = page;
    this.populateVehicles();
  }

}
