// --------------------------- ANGULAR  ----------------- //
import { Component, ElementRef, inject, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as L from 'leaflet';
import { TerraDraw, TerraDrawCircleMode, TerraDrawFreehandMode, TerraDrawPolygonMode, TerraDrawRectangleMode, TerraDrawSelectMode }
 from 'terra-draw'; // https://github.com/JamesLMilner/terra-draw/tree/main
 import { TerraDrawLeafletAdapter } from "terra-draw-leaflet-adapter";
 import './SidePanel/leaflet-sidepanel.min.js';// https://github.com/maxwell-ilai/Leaflet.SidePanel/tree/main
import four_circles from './Four_circles.json';

@Component({
  selector: 'comp-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrl: './leaflet.component.scss'
})
export class LeafletComponent {
  @ViewChild('map') mapElement: ElementRef<HTMLElement>;
  @ViewChild('saveDrawnModal') saveDrawnModal: TemplateRef<any> | undefined;

  readonly dialog = inject(MatDialog);

  map: L.Map = null;
  osmHOT: L.TileLayer = {};
  layerControl: L.Control;
  panelRight: any;
  isDrawing = false;
  draw: TerraDraw;
  config = {
    TabukCoords: [28.57955, 36.501812],
    basicZoom: 19,
    defaultFillOpacity: 0.6,
    activeDrawName: '',
    activeDrawColor: '',
    activeDrawTool: '',
    currentDrawObj: { newLayerName: '', features: [] },
    saveNewDrawColors: ['green', 'yellow', 'brown', 'red', 'violet'],
    isDrawingLayer: false,
    customDrawsCounter: 1,
    drawFigures: []
  }  

  ngAfterViewInit() {
    this.createLayers();
    this.setupMap();
    this.addControls();
    this.createSidePanel(); 
  }

  createLayers() {
    this.osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom: this.config.basicZoom,
      attribution: 'Tiles style by Humanitarian OpenStreetMap Team'
    });    
  }

  setupMap() {
    this.map = L.map('map', {}).setView(this.config.TabukCoords, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: this.config.basicZoom,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.osmHOT.addTo(this.map);  //detailed map from humanitarian france team

    // Import from geojson file
   L.geoJson(four_circles).eachLayer(function (layer) {
    layer.bindPopup(layer.feature.properties?.name + `\n radius: ` + layer.feature.properties?.radiusKilometers.toFixed(2) + 'km (imported from geo-json file)');
  }).addTo(this.map);
    
    console.log('--- The map using Leaflet is created! ----', this.map);
  }

  addControls() {
    const baseMaps = {
      "OpenStreetMap HOT Detailed": this.osmHOT,
    };
    this.layerControl = L.control.layers(baseMaps).addTo(this.map);

    L.control.scale({imperial: false, metric: true, maxWidth: 200}).addTo(this.map);
  }

  createSidePanel() {
    this.panelRight = L.control.sidepanel('panelID', {
      panelPosition: 'left',
      hasTabs: true,
      tabsPosition: 'top',
      pushControls: true,
      darkMode: false,
      startTab: 'tab-1',
      closed: false
    }).addTo(this.map);
  }

  switchEditMode(e) {
    if (e.checked) {      
      this.addToolbarDraw();
    }
    else {
      this.draw.stop();
      this.mapElement.nativeElement.style.cursor = 'grab';
    }
  }

    // ---------------------------- START OF terra-draw HANDLERS ------------------------- //
    addToolbarDraw() {
      const adapter = new TerraDrawLeafletAdapter({ map: this.map, lib: L });  
      const modes = [new TerraDrawPolygonMode(), new TerraDrawRectangleMode(), new TerraDrawCircleMode(), new TerraDrawFreehandMode(), new TerraDrawSelectMode({
        // Allow manual deselection of features
        allowManualDeselection: true,
        flags: {
          point: {
            feature: {
              draggable: true,
            },
          },
          circle: {
            feature: {
              draggable: true,
              coordinates: {
                midpoints: true,
                draggable: true,
                deletable: true,
              },
            },
          },      
        },       
      })];

      this.draw = new TerraDraw({
         adapter: adapter,
         modes
      });
      this.config.drawFigures = modes.map(el => el['mode']);  
    }
  
    startNewLayer() {
      this.draw.start();
      this.config.isDrawingLayer = true;
      this.draw.setMode("polygon");
      this.config.activeDrawTool = this.config.drawFigures[0] || "polygon";
      this.config.currentDrawObj = { newLayerName: '', features: [] };
    }  
  
    saveEdited() {
      let features = this.draw.getSnapshot();
      const newLayerName = this.config.activeDrawName || `Custom_${this.config.customDrawsCounter}`;
      if (!this.config.activeDrawName) this.config.customDrawsCounter++;
      features.forEach(f => f.properties['name'] = newLayerName);
      this.config.currentDrawObj = { features, newLayerName };
      const ftrs = L.geoJson(features, {
        style: setInitialStyles.bind(this, true),
      }).addTo(this.map);
      this.layerControl.addOverlay(ftrs, newLayerName);
      this.draw.stop();
      this.resetDrawConfig();
      this.layerControl.expand();
      setTimeout(() => {
        this.layerControl.collapse();      
      }, 2300);    
    }
  
    clearEdited() { this.draw.stop();  this.draw.start(); }
  
    openSaveObjectDialog() {
      const dialogRef = this.dialog.open(this.saveDrawnModal);  
      dialogRef.afterClosed().subscribe(isSaved => {
        if (isSaved) this.saveEdited();
        else  this.draw.stop();
      });
    }

    exportJSONtoFIle() { //todo less like a spike
      const body = {
        "type": "FeatureCollection",
        "features": this.config.currentDrawObj.features
      };
      let dataUri = "data:application/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(body));
      let linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", this.config.currentDrawObj.newLayerName + ".json");
      linkElement.click();  
      this.config.currentDrawObj = { newLayerName: '', features: [] };
    }
  
    resetDrawConfig() {
      this.config.activeDrawName = '';
      this.config.activeDrawColor = '';
      this.config.activeDrawTool = '';
      this.config.isDrawingLayer = false;
    } 

    switchDrawTool() { 
      this.draw.setMode(this.config.activeDrawTool || "polygon");
    }

    setDrawFigureIcon(figure: string): string {
      switch (figure) {
        case 'polygon':
          return 'polyline' 
        case 'freehand':
          return 'draw'
        case 'select':
          return 'border_clear'
        default:
          return figure
      }
    }  
}

function setInitialStyles(feature, isDrawn?: boolean) {
  return {
      fillColor: this.config.activeDrawColor || 'black',
      weight: 3,
      opacity: 1,
      color: this.config.activeDrawColor || 'black',
      fillOpacity: isDrawn ? 0.6 : 0.2
  };
}

