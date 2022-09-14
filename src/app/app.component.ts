import { AfterViewInit, Component } from '@angular/core';
import { ImageDrawService } from './image-draw.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  constructor(
    private imageDrawService: ImageDrawService
  ) { }

  ngAfterViewInit(): void {
    this.imageDrawService.initImageDrawMap();
  }

  handleImageUpload(e: any): void {

    const fileReader = new FileReader();
    fileReader.readAsDataURL(e.target.files[0]);
    fileReader.onloadend = (event: any) => {

      const image = new Image;
      image.src = fileReader.result as string;
      image.onload = (any) => {

        this.imageDrawService.addImage(event.target.result, image.width, image.height);
      }
    }
  }

  handleDrawingUpload(e: any): void {

    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0]);
    fileReader.onloadend = (event: any) => {
      const json = JSON.parse(event.target.result);
      this.imageDrawService.addDrawings(json);
    }
  }

  downloadGeojson(){
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.imageDrawService.drawLayers.toGeoJSON()));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", 'drawings.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }



}
