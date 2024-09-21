import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  mapView: MapView | any;
  map: Map | any;

  constructor() {}

  async ngOnInit() {
    this.map = new Map({
      basemap: "topo-vector" // Basemap default
    });

    this.mapView = new MapView({
      container: "container", // Sesuaikan dengan id container di template HTML
      map: this.map,
      zoom: 8
    });

    let weatherServiceFL = new ImageryLayer({
      url: WeatherServiceUrl
    });
    this.map.add(weatherServiceFL);

    weatherServiceFL.when(() => {
      this.addMarkerInRadarArea(-81.804393, 36.105740); // Koordinat contoh
    });

    await this.updateUserLocationOnMap();
    setInterval(this.updateUserLocationOnMap.bind(this), 10000);
  }

  // Fungsi untuk mengubah basemap sesuai pilihan dropdown
  changeBasemap(event: any) {
    const selectedBasemap = event.detail.value; // Dapatkan basemap yang dipilih
    this.map.basemap = selectedBasemap; // Ganti basemap peta
  }

  async getLocationService(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((resp) => {
        resolve([resp.coords.latitude, resp.coords.longitude]);
      })
    })
  }

  async updateUserLocationOnMap() {
    let latlng = await this.getLocationService();
    let geom = new Point({ latitude: latlng[0], longitude: latlng[1] });
    if (this.mapView.graphics.length > 0) {
      this.mapView.graphics.getItemAt(0).geometry = geom;
    } else {
      const userLocationGraphic = new Graphic({
        symbol: new SimpleMarkerSymbol({
          color: "blue",
          size: "12px"
        }),
        geometry: geom
      });
      this.mapView.graphics.add(userLocationGraphic);
    }
  }

  addMarkerInRadarArea(longitude: number, latitude: number) {
    const radarMarker = new Graphic({
      geometry: new Point({
        longitude: longitude,
        latitude: latitude
      }),
      symbol: new SimpleMarkerSymbol({
        color: "red",
        size: "12px",
        outline: {
          color: "white",
          width: 2
        }
      })
    });

    this.mapView.graphics.add(radarMarker);
  }
}

const WeatherServiceUrl = 'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer';


  /* private latitude: number | any;
  private longitude: number | any; */

  /* public async ngOnInit() {
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
    }); */
    
      /* type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
      color: [226, 119, 40], // Orange
      outline: {
        color: [255, 255, 255], // White
        width: 2
      } */

   /*  // Create a Graphic and set its geometry and symbol
    const pointGraphic = new Graphic({
      geometry: point,
      symbol: markerSymbol
    });

    // Add the Graphic to the view
    view.graphics.add(pointGraphic);
  } */