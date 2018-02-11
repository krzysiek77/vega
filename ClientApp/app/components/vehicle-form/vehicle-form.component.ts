import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.css']
})
export class VehicleFormComponent implements OnInit {
  makes: any[] = [];
  models: any[] = [];
  vehicle: any = {};
  features: any[] = [];

  constructor(
    private vehicleService: VehicleService
  ) { }

  ngOnInit() {
    // get list of all available Makes
    this.vehicleService.getMakes().subscribe(makes => {
      this.makes = makes;
    });

    // get list of all available Features
    this.vehicleService.getFeatures().subscribe(features => {
      this.features = features;
      //console.log("Features: ", this.features);
    });
  }

  onMakeChange()
  {
    var selectedMake = this.makes.find(m => m.id == this.vehicle.make);
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

}
