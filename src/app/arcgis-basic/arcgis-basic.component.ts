/*
  Copyright 2020 Esri
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { loadModules } from 'esri-loader';
import esri = __esri;

@Component({
  selector: 'comp-arcgis-basic',
  templateUrl: './arcgis-basic.component.html',
  styleUrl: './arcgis-basic.component.scss',
})
export class ArcgisBasicComponent {
  @Output() mapLoaded = new EventEmitter<boolean>();
  @ViewChild('mapViewNode', { static: true }) private mapViewEl: ElementRef;

  mapCenter = [-122.4194, 37.7749];  
  basemapType = 'satellite';
  mapZoomLevel = 12;
  private _loaded = false;
  private _view: esri.MapView = null;
  // private _zoom: number = 10;
  // private _center: Array<number> = [0.1278, 51.5074];
  // private _basemap: string = 'streets'

  ngOnInit() {
  // Initialize MapView and return an instance of MapView
  this.initializeMap().then(mapView => {
    // The map has been initialized
    console.log("mapView ready: ", this._view.ready);
    this._loaded = this._view.ready;
    console.log('The map has loaded: ', mapView);
    this.mapLoaded.emit(true);
    });
  }

  async initializeMap() {
    try {
      // setDefaultOptions({ version: '4.13' });
      const [EsriMap, EsriMapView] = await loadModules([
        'esri/Map',
        'esri/views/MapView'
      ]);

      // Set type of map
      const mapProperties: esri.MapProperties = {
        basemap: this.basemapType
      };

      const map: esri.Map = new EsriMap(mapProperties);

      // Set type of map view
      const mapViewProperties: esri.MapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: this.mapCenter,
        zoom: this. mapZoomLevel,
        map: map
      };

      const mapView: esri.MapView = new EsriMapView(mapViewProperties);

      // All resources in the MapView and the map have loaded.
      // Now execute additional processes
      mapView.when(() => {
        this.mapLoaded.emit(true);
      });
    } catch (error) {
      alert('We have an error: ' + error);
    }
  }

}


