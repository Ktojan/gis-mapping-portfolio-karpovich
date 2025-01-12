import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'comp-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild('aboutModal') aboutModal: TemplateRef<HTMLElement>;
  dialog = inject(MatDialog);
  displayAbout = true;
  private router = inject(Router);

  menuLinks = {
    arcgis: [
      {
        routerLink: '/arcgis-basic',
        icon: 'view_in_ar',
        label: 'Basic',
        hasOwnAbout: false
      },
    ],
    leaflet: [
      {
        routerLink: '/leaflet',
        icon: 'shape_line',
        label: 'Drawing, polygons, export',
        hasOwnAbout: true
      },
    ],
    mapbox: [
      {
        routerLink: '/location-geofencing',
        icon: 'location_searching',
        label: 'Geofencing, tracking location',
        hasOwnAbout: false
      },
      {
        routerLink: '/sync-camera-drone',
        icon: 'sync',
        label: 'Sync: virtual map-camera and aeroshot',
        hasOwnAbout: false
      },
      {
        routerLink: '/drone-mission',
        icon: 'route',
        label: 'Drone-like missions set',
        hasOwnAbout: true
      },
      {
        routerLink: '/moveAndStreamWS',
        icon: 'settings_input_antenna',
        label: 'Stream location via websocket',
        hasOwnAbout: true
      },
      {
        routerLink: '/indoor3d',
        icon: 'flight',
        label: 'Indoor scheme with 3D',
        hasOwnAbout: true
      }
    ],
  }

  ngOnInit() {
    this.router.events.pipe(
      filter((event: any) => event instanceof NavigationEnd),
      map((event: NavigationEnd) => event.url)
    ).subscribe(link => {
      // const item = this.menuLinks.find(el => el.routerLink === link); //todo concat
      // if (!item) return;
      // this.displayAbout = !item.hasOwnAbout;
    })
  }

  clickAbout(enterAnimationDuration: string, exitAnimationDuration: string) {
    this.dialog.open(this.aboutModal, {
      width: '50vw',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}
