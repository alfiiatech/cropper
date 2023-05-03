import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import Cropper from 'cropperjs';

@Component({
  selector: 'app-cropper',
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.css']
})
export class CropperComponent implements OnInit, AfterViewInit, OnDestroy {
crop() {
throw new Error('Method not implemented.');
}
  @ViewChild('image') imageElement!: ElementRef<HTMLImageElement>;

  private cropper!: Cropper;

  constructor(private readonly elementRef: ElementRef) { }

  ngOnInit(): void { }

  ngAfterViewInit() {
    const image = this.imageElement.nativeElement;
    this.cropper = new Cropper(image, {
      aspectRatio: 16 / 9,
      crop(event) {
        console.log("x:",event.detail.x);
        console.log("y;",event.detail.y);
        console.log("width:",event.detail.width);
        console.log(event.detail.height);
        console.log(event.detail.rotate);
        console.log(event.detail.scaleX);
        console.log(event.detail.scaleY);
      },
    });

    const canvas = this.cropper.getCroppedCanvas();
    const context = canvas.getContext('2d');

    if (!context) {
      console.error('Could not get 2d context for canvas');
      return;
    }

    const cropBoxData = this.cropper.getCropBoxData();
    const cropBoxLeft = cropBoxData.left;
    const cropBoxTop = cropBoxData.top;
    const cropBoxWidth = cropBoxData.width;
    const cropBoxHeight = cropBoxData.height;

    const imageData = context.getImageData(cropBoxLeft, cropBoxTop, cropBoxWidth, cropBoxHeight);
    const data = imageData.data;

    for (let y = 0; y < cropBoxHeight; y++) {
      for (let x = 0; x < cropBoxWidth; x++) {
        const pixelIndex = (y  *cropBoxWidth + x)  *4;
        const r = data[pixelIndex];
        const g = data[pixelIndex + 1];
        const b = data[pixelIndex + 2];
        const gray = (r + g + b) / 3;
        data[pixelIndex] = gray;
        data[pixelIndex + 1] = gray;
        data[pixelIndex + 2] = gray;
      }
    }

    context.putImageData(imageData, cropBoxLeft, cropBoxTop);
    const url = canvas.toDataURL();
    localStorage.setItem('croppedImage', url);
    this.cropper.replace(url);
    this.cropper.disable();


  }

  ngOnDestroy() {
    if (this.cropper) {
      this.cropper.destroy();
    }
  }
}
