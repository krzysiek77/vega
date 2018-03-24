import { ToastyService } from 'ng2-toasty';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { SaveVehicle } from '../../models/vehicle';

@Component({
  selector: 'app-view-vehicle',
  templateUrl: './view-vehicle.component.html',
  styleUrls: ['./view-vehicle.component.css']
})
export class ViewVehicleComponent implements OnInit {
  vehicle: any = {};
  vehicleId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toasty: ToastyService,
    private vehicleService: VehicleService) { 

      route.params.subscribe(p => {
        this.vehicleId = +p['id'];
        if (isNaN(this.vehicleId) || this.vehicleId <= 0) {
          router.navigate(['/vehicles']);
          return;
        }
      })
    }

  ngOnInit() {
    console.log("ngOnInit = " + this.vehicleId);
    this.vehicleService.getVehicle(this.vehicleId)
      .subscribe(
        v => this.vehicle = v,
        err => {
          if (err.status == 404) {
            this.router.navigate(['/vehicles']);
            return;
          }
        });
    console.log("ngOnInit: " + this.vehicle.id);
  }

  delete() {
    if (confirm("Are you sure?")) {
      this.vehicleService.delete(this.vehicle.id)
        .subscribe(x => {
          this.router.navigate(['/vehicles']);
          this.toasty.info({
            title: 'Deleted',
            msg: 'The vehicle was sucessfully deleted.',
            theme: 'bootstrap',
            showClose: true,
            timeout: 5000
          });
        })
    }
  }

}
