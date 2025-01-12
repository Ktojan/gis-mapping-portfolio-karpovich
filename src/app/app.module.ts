import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SyncCameraDroneComponent } from './mapbox/sync-camera-drone/sync-camera-drone.component';
import { MoveAndStreamWS } from './mapbox/moveAndStreamWS/moveAndStreamWS.component';
import { LeafletComponent } from './leaflet/leaflet.component';
// --------------------------- MAPBOX stuff and files ----------------- //
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
// ---------------------------Material stuff ----------------------//
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MapboxService } from './mapbox/sync-camera-drone/mapbox.service';
import { MatCardModule } from '@angular/material/card';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule,  MatDialogActions,  MatDialogClose,  MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { DroneMissionComp } from './mapbox/drone-mission-mimic/drone-mission.component';
import { ArcgisBasicComponent } from './arcgis-basic/arcgis-basic.component';
import { Indoor3DComponent } from './mapbox/indoor-3d/indoor-3d.component';
import { HomeComponent } from './home/home.component';
import { LocationGeofencingComponent } from './mapbox/location-geofencing/indoor-3d.component';

@NgModule({
  declarations: [
    AppComponent,
    SyncCameraDroneComponent,
    MoveAndStreamWS,
    LeafletComponent,
    DroneMissionComp,
    Indoor3DComponent,
    LocationGeofencingComponent,
    ArcgisBasicComponent,
    NotFoundPageComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    MatDialogModule, MatDialogActions,  MatDialogClose,  MatDialogContent, MatDialogTitle , MatCardModule, MatButtonModule, MatSelectModule,
    MatInputModule, MatSlideToggleModule, MatIconModule, MatMenuModule,
    NgxMapboxGLModule,
  ],
  providers: [MapboxService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
