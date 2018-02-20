import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/Observable/forkJoin';

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
    features: [],
    contact: {}
  };

  constructor(
    private route: ActivatedRoute, // to read route parameters
    private router: Router, // to navigate user to different page if they pass invalid id
    private vehicleService: VehicleService
  ) { 
    route.params.subscribe(p => {
      this.vehicle.id = +p['id']; // + in-front to convert string to number
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
        
        if (this.vehicle.id)
          this.vehicle = data[2];
      }, err => {
        if (err.status == 404)
          this.router.navigate(['/home']);
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

  submit() {
    this.vehicleService.create(this.vehicle)
      .subscribe(
        x => console.log(x) 
      // instead of handling errors here, they are handled on app.module level by custom class.
      //,
      // err => {
      //   // to catch and display server site errors
      //   // if (err.status == 400) {

      //   // }
      //   this.toastyService.error({
      //     title: 'Error',
      //     msg: 'An unexpected error happened.',
      //     theme: 'bootstrap',
      //     showClose: true,
      //     timeout: 5000
      //   });
      // }
    );
  }

}
