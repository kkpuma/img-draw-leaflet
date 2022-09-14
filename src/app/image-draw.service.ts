import { Injectable } from "@angular/core";
import { Map, CRS, imageOverlay, FeatureGroup, Control, Draw, geoJSON } from 'leaflet';
import 'leaflet-draw';

@Injectable({
  providedIn: 'root',
})
export class ImageDrawService {

  private map: Map;
  drawLayers = new FeatureGroup();

  initImageDrawMap(): void {
    this.map = new Map('image-draw-map', {
      crs: CRS.Simple,
      minZoom: -3,
      zoomSnap: 0,
      zoomDelta: .5
    });

    this.map.addLayer(this.drawLayers);

    var options: Control.DrawConstructorOptions = {
      position: 'topright',
      draw: {
        polyline: {
          shapeOptions: {
            color: '#f357a1',
            weight: 10
          }
        },
        polygon: {
          allowIntersection: true, // Restricts shapes to simple polygons
          drawError: {
            color: 'red', // Color the shape will turn when intersects
            message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
          },
          shapeOptions: {
            color: 'red'
          }
        },
        circlemarker: false,
        circle: false, // Turns off this drawing tool
        rectangle: false
      },
      edit: {
        featureGroup: this.drawLayers, //REQUIRED!!
        remove: false
      }
    };

    const drawControl = new Control.Draw(options);
    this.map.addControl(drawControl);

    this.onDrawCreated();
  }

  addImage(imageUrl: string, width: number, height: number) {
    const overlay = imageOverlay(imageUrl, [[0, 0], [height, width]]).addTo(this.map);

    this.map.fitBounds(overlay.getBounds());
  }

  onDrawCreated(): void {
    this.map.on(Draw.Event.CREATED, (e) => {
      console.log(e);
      this.drawLayers.addLayer(e.layer);
      console.log(this.drawLayers.toGeoJSON())
    });
  }

  addDrawings(geojson: any) {
    geoJSON(geojson).addTo(this.map);
  }

}
