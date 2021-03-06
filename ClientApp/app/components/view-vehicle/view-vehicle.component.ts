import { ProgressService } from './../../services/progress.service';
import { PhotoService } from './../../services/photo.service';
import { Vehicle } from './../../models/vehicle';
import { ToastyService } from 'ng2-toasty';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { VehicleService } from '../../services/vehicle.service';
import { SaveVehicle } from '../../models/vehicle';

@Component({
  selector: 'app-view-vehicle',
  templateUrl: './view-vehicle.component.html',
  styleUrls: ['./view-vehicle.component.css']
})
export class ViewVehicleComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  // need to be initialized properly in Angular 5 (I think)
  // otherwise it's going to work, but will return errors as well (which is stupid as fuck)
  vehicle: Vehicle = {
    id: 0,
    model: {
      id: 0,
      name: ""
    },
    make: {
      id: 0,
      name: ""
    },
    isRegistered: false,
    features: [],
    contact: {
      name: '',
      phone: '',
      email: ''
    },
    lastUpdated: ""
  };
  vehicleId: number = 0;
  photos: any[] = [];
  progress: any;

  constructor(
    private zone: NgZone,
    private route: ActivatedRoute,
    private router: Router,
    private toasty: ToastyService,
    private photoService: PhotoService,
    private progressService: ProgressService,
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
    this.photoService.getPhotos(this.vehicleId)
      .subscribe(photos => this.photos = photos);

    this.vehicleService.getVehicle(this.vehicleId)
      .subscribe(
        v => this.vehicle = v,
        err => {
          if (err.status == 404) {
            this.router.navigate(['/vehicles']);
            return;
          }
        });
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

  uploadPhoto() {
    this.progressService.startTracking()
      .subscribe(progress => {
        console.log(progress);
        this.zone.run(() => {
          this.progress = progress;
        });
      },
      () => null,
      () => { this.progress = null; });
      
    // If your compiler is showing an error "object is possibly null" on the naitveElement.files[0] part of the photoService.upload statement in uploadPhoto function, simply append "!" between files property and the index like so:
    // this.photoService.upload(this.vehicleId,naitveElement.files![0]).subscribe(x => console.log(x));
    // or do a truthy check like so:
    // if(naitveElement.files)
    // this.photoService.upload(this.vehicleId,naitveElement.files[0]).subscribe(x => console.log(x));
    var nativeElement: HTMLInputElement = this.fileInput.nativeElement;
    var file = nativeElement.files![0];
    nativeElement.value = '';
    
    this.photoService.upload(this.vehicleId, file)
      .subscribe(photo => {
        this.photos.push(photo);
      },
      err => {
        this.toasty.error({
          title: 'Error',
          msg: err.text(),
          theme: 'bootstrap',
          showClose: true,
          timeout: 5000
      });
      });
  }

}
