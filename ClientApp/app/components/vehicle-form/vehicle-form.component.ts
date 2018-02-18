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
  features: any[] = [];
  vehicle: any = {
    features: []
  };

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
    delete this.vehicle.modelId;
    
  }

  onFeatureToggle(featureId: number, $event: any) {
    if ($event.target.checked)
      this.vehicle.features.push(featureId);
    else {
      var index = this.vehicle.features.indexOf(featureId);
      this.vehicle.features.splice(index, 1);
    }
  }

}
