import { FeatureService } from './../../services/feature.service';
import { Component, OnInit } from '@angular/core';
import { MakeService } from '../../services/make.service';
import { ModelService } from '../../services/model.service';

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
    private makeService: MakeService,
    private modelService: ModelService,
    private featureService: FeatureService
  ) { }

  ngOnInit() {
    // get list of all available Makes
    this.makeService.getMakes().subscribe(makes => {
      this.makes = makes;
    });

    // get list of all available Features
    this.featureService.getFeatures().subscribe(features => {
      this.features = features;
      //console.log("Features: ", this.features);
    });
  }

  onMakeChange()
  {
    var selectedMake = this.makes.find(m => m.id == this.vehicle.make);
    //this.models = selectedMake ? selectedMake.models : [];
    if (selectedMake) {
      this.modelService.getModels(selectedMake.id).subscribe(models => {
        this.models = models;
        //console.log("get models for make: ", this.models);
      });
    } else {
      this.models = [];
    }
    
  }

}
