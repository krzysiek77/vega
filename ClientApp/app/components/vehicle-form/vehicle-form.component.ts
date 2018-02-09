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

  constructor(private makeService: MakeService,
    private modelService: ModelService) { }

  ngOnInit() {
    this.makeService.getMakes().subscribe(makes => {
      this.makes = makes;
    });

  }

  onMakeChange()
  {
    var selectedMake = this.makes.find(m => m.id == this.vehicle.make);
    //this.models = selectedMake ? selectedMake.models : [];
    if (selectedMake) {
      this.modelService.getModels(selectedMake.id).subscribe(models => {
        this.models = models;
        console.log("get models for make: ", this.models);
      });
    } else {
      this.models = [];
    }
    
  }

}
