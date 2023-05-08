import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import Cropper from 'cropperjs';
import { LocalService } from '../local.service';

@Component({
  selector: 'app-cropper',
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.css']
})
export class CropperComponent implements AfterViewInit, OnInit {
  @ViewChild('image', { read: ElementRef }) image!: ElementRef;

  private cropper!: Cropper;
  private croppedImages: { top: number, left: number, width: number, height: number }[] = [];

  constructor(public localService: LocalService) { }

  ngOnInit() {
    const storedImages = this.localService.getItem('croppedImages');
    if (storedImages) {
      this.croppedImages = JSON.parse(storedImages);
    }
  }

  ngAfterViewInit() {
    this.cropper = new Cropper(this.image.nativeElement, {
      aspectRatio: 1 / 2,
      viewMode: 3,
      autoCropArea: 0.65,
      restore: true,
      dragMode: 'crop',
      cropBoxMovable: true,
      guides: false,
      center: false,
      cropBoxResizable: true,
      toggleDragModeOnDblclick: false,
      ready: (event: any) => {
        setTimeout(() => {
          this.restoreCroppedElements();
          this.saveCroppedElement();
        },);

      }
    });
  }

  saveCroppedElement() {
    const cropBoxData = this.cropper.getCropBoxData();
    const croppedElement = {
      top: cropBoxData.top,
      left: cropBoxData.left,
      width: cropBoxData.width,
      height: cropBoxData.height,
      color: 'gray'
    };
    this.croppedImages.push(croppedElement);
    this.localService.setItem('croppedImages', JSON.stringify(this.croppedImages));
  }

  restoreCroppedElements() {
    const storedCroppedElements = this.localService.getItem('croppedImages');
    if (storedCroppedElements) {
      this.croppedImages = JSON.parse(storedCroppedElements);

      const divPosition = document.getElementById('imageDiv');
      const imageTop: any = divPosition?.offsetTop;
      const imageLeft: any = divPosition?.offsetLeft;

      this.croppedImages.forEach((croppedElement) => {
        const newCroppedElement = document.createElement('div');
        newCroppedElement.style.position = 'absolute';
        newCroppedElement.style.top =  croppedElement.top + 'px';
        newCroppedElement.style.left = croppedElement.left + 'px';
        newCroppedElement.style.width = croppedElement.width + 'px';
        newCroppedElement.style.height = croppedElement.height + 'px';
        newCroppedElement.style.backgroundColor = 'gray';

        newCroppedElement.classList.add('cropped-card');

        const container = this.image.nativeElement.parentElement;
        container.appendChild(newCroppedElement);
      });

      const lastCroppedElement = this.croppedImages[this.croppedImages.length - 1];
      if (lastCroppedElement) {
        this.cropper.setCropBoxData(lastCroppedElement);
      }
    }
  }



  crop() {
    const canvas = this.cropper.getCroppedCanvas();
    const dataURL = canvas.toDataURL();
    canvas.style.display = 'none';

    const cropBoxData = this.cropper.getCropBoxData();
    const divPosition = document.getElementById('imageDiv');
    const imageTop: any = divPosition?.offsetTop;
    const imageLeft: any = divPosition?.offsetLeft;

    const croppedElement = {
      top: imageTop + cropBoxData.top,
      left: imageLeft + cropBoxData.left,
      width: cropBoxData.width,
      height: cropBoxData.height,
    };

    const newCroppedElement = document.createElement('div');
    newCroppedElement.style.position = 'absolute';
    newCroppedElement.style.top = croppedElement.top + 'px';
    newCroppedElement.style.left = croppedElement.left + 'px';
    newCroppedElement.style.width = croppedElement.width + 'px';
    newCroppedElement.style.height = croppedElement.height + 'px';
    newCroppedElement.style.backgroundColor = 'gray';
    newCroppedElement.classList.add('cropped-card');

    const container = this.image.nativeElement.parentElement;
    container.appendChild(newCroppedElement);

    this.croppedImages.push(croppedElement);
    this.localService.setItem('croppedImages', JSON.stringify(this.croppedImages));

    this.cropper.reset();
  }

  
}
