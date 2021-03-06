import { BrowserXhrWithProgress, ProgressService } from './services/progress.service';
import { ViewVehicleComponent } from './components/view-vehicle/view-vehicle.component';
import { PaginationComponent } from './components/shared/pagination/pagination.component';
import { VehiclesListComponent } from './components/vehicles-list/vehicles-list.component';
import * as Raven from 'raven-js';

import { AppErrorHandler } from './components/app/app.error-handler';
import { ErrorHandler } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule, BrowserXhr } from '@angular/http';
import { RouterModule } from '@angular/router';

import { ToastyModule } from 'ng2-toasty';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { CounterComponent } from './components/counter/counter.component';
import { VehicleFormComponent } from './components/vehicle-form/vehicle-form.component';

import { VehicleService } from './services/vehicle.service';
import { PhotoService } from './services/photo.service';

Raven
    .config('https://cbcf673de706411e8b977dee9300bd64@sentry.io/291441')
    .install();
@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        CounterComponent,
        FetchDataComponent,
        HomeComponent,
        VehicleFormComponent,
        VehiclesListComponent,
        ViewVehicleComponent,
        PaginationComponent,
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        ToastyModule.forRoot(),
        RouterModule.forRoot([
            { path: '', redirectTo: 'vehicles', pathMatch: 'full' },
            { path: 'vehicles/new', component: VehicleFormComponent },
            { path: 'vehicles/edit/:id', component: VehicleFormComponent },
            { path: 'vehicles/:id', component: ViewVehicleComponent },
            { path: 'vehicles', component: VehiclesListComponent },
            { path: 'home', component: HomeComponent },
            { path: 'counter', component: CounterComponent },
            { path: 'fetch-data', component: FetchDataComponent },
            { path: '**', redirectTo: 'home' }
        ])
    ],
    providers: [
        { provide: ErrorHandler, useClass: AppErrorHandler}, // wherever instance of ErrorHandler is needed, create instance of AppErrorHandler instead
        { provide: BrowserXhr, useClass: BrowserXhrWithProgress },
        VehicleService,
        PhotoService,
        ProgressService
    ]
})
export class AppModuleShared {
}
