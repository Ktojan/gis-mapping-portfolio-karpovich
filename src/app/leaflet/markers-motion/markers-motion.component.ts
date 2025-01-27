// --------------------------- ANGULAR  ----------------- //
import { Component, ElementRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import  'leaflet.motion/dist/leaflet.motion.min.js'; //https://github.com/Igor-Vladyka/leaflet.motion
import '../SidePanel/leaflet-sidepanel.min.js';// https://github.com/maxwell-ilai/Leaflet.SidePanel/tree/main
import titanic_route from "./Titanic_route.json"
import iceberg_route from "./iceberg_route.json"
import lifeboates_route from "./lifeboats_route.json"

@Component({
  selector: 'comp-markers-motion',
  templateUrl: './markers-motion.component.html',
  styleUrl: './markers-motion.component.scss'
})
export class MarkersMotionComponent {
  @ViewChild('markersmotionmap') mapElement: ElementRef<HTMLElement>;

  map: L.Map = null;
  TitanicRoute_1: L.polyline;
  TitanicRoute_2: L.polyline;
  TitanicRoute_3: L.polyline;
  IcebergRoute: L.polyline;
  LifeboatsArray = [];
  wreckPlaceCoords = [];
  motionLaunched = false;
  config = {
    startCoords: [48.62, -30.45],
    basicZoom: 4,
    firstChunkMs: 9000,
    secondChunkMs: 3000,
  }  

  ngAfterViewInit() {
    this.setupMap();
    this.createSidePanel();
    this.createMotions();
  }

  setupMap() {
    this.map = L.map('markersmotionmap', {}).setView(this.config.startCoords, this.config.basicZoom);
    L.tileLayer('https://tile.tracestrack.com/topo__/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    L.control.scale({imperial: false, metric: true, maxWidth: 200}).addTo(this.map);
  }

  createSidePanel() {
    L.control.sidepanel('tinanic-about-panel', {
      panelPosition: 'right',
      darkMode: false,
      closed: false
    }).addTo(this.map);
  }

  createMotions() {
    const TitanicRoute = JSON.parse(JSON.stringify(titanic_route));
    this.wreckPlaceCoords = TitanicRoute[5];

    // --------------- 1 chunk: Ireland - Wreck place
    this.TitanicRoute_1 = L.motion.polyline(TitanicRoute.slice(0,4), { color: "green" },
    {
      auto: true,
      easing: L.Motion.Ease.swing
    },
    {
      removeOnEnd: true,
      icon: L.icon({iconUrl: "/images/titanic_anim.png"})
    }).motionDuration(this.config.firstChunkMs);

    // --------------- 2 chunk: Wreck place drifting
    this.TitanicRoute_2 = L.motion.polyline(TitanicRoute.slice(3,5), { color: "gray" },
    {
      auto: false,
    },
    {
      removeOnEnd: true,
      icon: L.icon({iconUrl: "/images/titanic_anim.png"})
    }).motionDuration(this.config.secondChunkMs);

    // --------------- 1a-2a chunk: Iceberg moving toward Wreck place
    this.IcebergRoute = L.motion.polyline(iceberg_route, { color: "transparent" },
    {
      auto: true,
      removeOnEnd: true,
    },
    {
      showMarker: false,
      icon: L.icon({iconUrl: "/images/iceberg.png"})
    }).motionDuration(13000);

    // --------------- 3 chunk: Wreck place drifting
     this.TitanicRoute_3 = L.motion.polyline(TitanicRoute.slice(4,6), { color: "gray" },
        {
          auto: false,
          removeOnEnd: true,
          easing: L.Motion.Ease.easeOutSine
        },
        {
          showMarker: false,
          icon: L.icon({iconUrl: "/images/sinking_titanic.png"})
        }).motionDuration(6000);

    // --------------- 4 chunk: Wreck place lifeboats moving
    // Jack-Rose animation
    this.LifeboatsArray[0] = L.motion.polyline([this.wreckPlaceCoords, lifeboates_route.pop()], { color: "transparent" },
      {removeOnEnd: true}, { icon: L.icon({iconUrl: "/images/two_above.png"})}).motionDuration(7000);

    lifeboates_route.forEach(endPoint =>  this.LifeboatsArray.push(
      L.motion.polyline([this.wreckPlaceCoords, endPoint], { color: "transparent" },
      {}, {icon: L.icon({iconUrl: "/images/lifeboat.gif", iconSize: [24, 24]})}).motionDuration(15000)
    ));    
  }

  startMotion() {
    const TitanicBeforeWreck = L.motion.seq([this.TitanicRoute_1, this.TitanicRoute_2]);
    const WreckPeriod =  L.motion.group([TitanicBeforeWreck, this.IcebergRoute]).addTo(this.map); // group -> simultaneosly
    const LifeboatsGroup =  L.motion.group(this.LifeboatsArray).addTo(this.map);
    const ComposedAnimation = L.motion.seq([this.TitanicRoute_3, LifeboatsGroup]).addTo(this.map);
      
    WreckPeriod.motionStart();
    setTimeout(() => {
      this.map.flyTo(this.wreckPlaceCoords, 6);
    }, 7000);
    // start "sinking" part after first ones, enabled to implement it with group->group
    setTimeout(() => ComposedAnimation.motionStart(), this.config.firstChunkMs + this.config.secondChunkMs);
  }
}

