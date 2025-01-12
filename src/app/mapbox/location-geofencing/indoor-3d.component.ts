import { Component } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../../../env.js';
import chicago_museum from "../../../assets/geofiles/chicago_history_museum.json"

@Component({
  selector: 'comp-animate-point',
  template: `
    <div id="geo" #geo>`,
  styleUrl: './indoor-3d.component.scss'
})
export class LocationGeofencingComponent {
  map: mapboxgl.Map;
  replayAvailable = true;

  ngAfterViewInit() {
    this.map = new mapboxgl.Map({
      container: 'geo',
      accessToken: environment.public_token,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [30.441442528, 50.4562555], 
      zoom: 14,
      antialias: true
    });

      this.map.on('contextmenu', (e) => {
        if (e.lngLat) this.map.flyTo({center: [e.lngLat.lng, e.lngLat.lat], zoom: 13});
      } )

      this.map.on('load', () => {  
       
    });
    const location = new mapboxgl.GeolocateControl({
      positionOptions: {
          enableHighAccuracy: true
      }, 
      showAccuracyCircle: true,  
      showUserLocation: true,       
      // When active the map will receive updates to the device's location as it changes.
      trackUserLocation: true,
      // Draw an arrow next to the location dot to indicate which direction the device is heading.
      showUserHeading: true
  });

  this.map.addControl(location);
  }

}


