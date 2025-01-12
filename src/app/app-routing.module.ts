import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SyncCameraDroneComponent } from './mapbox/sync-camera-drone/sync-camera-drone.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { MoveAndStreamWS } from './mapbox/moveAndStreamWS/moveAndStreamWS.component';
import { LeafletComponent } from './leaflet/leaflet.component';
import { DroneMissionComp } from './mapbox/drone-mission-mimic/drone-mission.component';
import { ArcgisBasicComponent } from './arcgis-basic/arcgis-basic.component';
import { Indoor3DComponent } from './mapbox/indoor-3d/indoor-3d.component';
import { HomeComponent } from './home/home.component';
import { LocationGeofencingComponent } from './mapbox/location-geofencing/indoor-3d.component';

const routes: Routes = [
  {path: '', component: HomeComponent },
  {path: 'sync-camera-drone', component: SyncCameraDroneComponent },
  {path: 'leaflet', component: LeafletComponent },
  {path: 'moveAndStreamWS', component: MoveAndStreamWS },
  {path: 'drone-mission', component: DroneMissionComp },
  {path: 'indoor3d', component: Indoor3DComponent },
  {path: 'location-geofencing', component: LocationGeofencingComponent },
  {path: 'arcgis-basic', component: ArcgisBasicComponent },
  {path: '**', component: NotFoundPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
