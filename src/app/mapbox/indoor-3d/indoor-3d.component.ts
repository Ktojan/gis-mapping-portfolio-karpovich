import { Component } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../../../env.js';
import chicago_museum from "../../../assets/geofiles/chicago_history_museum.json"

@Component({
  selector: 'comp-animate-point',
  template: `
    <div id="indoor3d" #indoor3d>`,
  styleUrl: './indoor-3d.component.scss'
})
export class Indoor3DComponent {
  map: mapboxgl.Map;
  replayAvailable = true;

  ngAfterViewInit() {
    this.map = new mapboxgl.Map({
      container: 'indoor3d',
      accessToken: environment.public_token,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-87.61694, 41.86625], //Chicago
      zoom: 15.99,
      pitch: 40,
      bearing: 20,
      antialias: true
      });

      this.map.on('load', () => {
        this.map.addSource('floorplan', {
            'type': 'geojson',
            /*
             * Each feature in this GeoJSON file contains values for
             * `properties.height`, `properties.base_height`,
             * and `properties.color`.
             * In `addLayer` you will use expressions to set the new
             * layer's paint properties based on these values.
             */
            'data': chicago_museum
        });
        this.map.addLayer({
            'id': 'room-extrusion',
            'type': 'fill-extrusion',
            'source': 'floorplan',
            'paint': {
                // Get the `fill-extrusion-color` from the source `color` property.
                'fill-extrusion-color': ['get', 'color'],
                // Get `fill-extrusion-height` from the source `height` property.
                'fill-extrusion-height': ['get', 'height'],
                // Get `fill-extrusion-base` from the source `base_height` property.
                'fill-extrusion-base': ['get', 'base_height'],
                'fill-extrusion-opacity': 0.8
            }
        });
    });
  }

}


