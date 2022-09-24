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
      zoomDelta: .5,
      preferCanvas: true,
      touchExtend: false
    });

    this.map.addLayer(this.drawLayers);

    var options: Control.DrawConstructorOptions = {
      position: 'topright',
      draw: {
        polyline: {
          showLength: false,
          shapeOptions: {
            color: '#f357a1',
            weight: 10
          }
        },
        polygon: {
          allowIntersection: true,
        },
        circlemarker: false,
        circle: false,
        rectangle: false
      },
      edit: {
        featureGroup: this.drawLayers,
        remove: true,
      }
    };

    const drawControl = new Control.Draw(options);
    this.map.addControl(drawControl);

    this.drawingCreated();
  }

  addImage(imageUrl: string, width: number, height: number) {
    const overlay = imageOverlay(imageUrl, [[0, 0], [height, width]]).addTo(this.map);

    this.map.fitBounds(overlay.getBounds());
  }

  drawingCreated(): void {
    this.map.on(Draw.Event.CREATED, (e) => {
      this.drawLayers.addLayer(e.layer);
    });
  }

  addDrawings(geojson: any) {
    this.drawLayers.clearLayers();
    geoJSON(geojson, {
      onEachFeature: (_, layer) => {
        this.drawLayers.addLayer(layer)
      }
    });

  }

}
