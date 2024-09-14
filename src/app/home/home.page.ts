import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point'; // Import Point class
import { Geolocation } from '@capacitor/geolocation';
import PictureMarkerSymol from '@arcgis/core/symbols/PictureMarkerSymbol';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor() {}
  private latitude: number | any;
  private longitude: number | any;

  public async ngOnInit() {
    // Get the current position
    const position = await Geolocation.getCurrentPosition();
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;

    // Create the map
    const map = new Map({
      basemap: "topo-vector"
    });

    // Create the map view
    const view = new MapView({
      container: "container",
      map: map,
      zoom: 13,
      center: [this.longitude, this.latitude] // Corrected: longitude first, then latitude
    });

    // Create a Point geometry
    const point = new Point({
      longitude: this.longitude,
      latitude: this.latitude
    });

    // Create a marker symbol
    const markerSymbol = new PictureMarkerSymol({
      type: "picture-marker",
      url: "assets/location.png",
      width: "20px",
      height: "20px"
    });
    
      /* type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
      color: [226, 119, 40], // Orange
      outline: {
        color: [255, 255, 255], // White
        width: 2
      } */

    // Create a Graphic and set its geometry and symbol
    const pointGraphic = new Graphic({
      geometry: point,
      symbol: markerSymbol
    });

    // Add the Graphic to the view
    view.graphics.add(pointGraphic);
  }
}