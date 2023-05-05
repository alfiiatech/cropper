import { Component, ElementRef, ViewChild } from '@angular/core';
import Cropper from 'cropperjs';

@Component({
  selector: 'app-cropper',
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.css']
})

export class CropperComponent {
  @ViewChild('image', { read: ElementRef }) image!: ElementRef;

  private cropper!: Cropper;

  ngAfterViewInit() {
    this.cropper = new Cropper(this.image.nativeElement, {
      aspectRatio: 1,
      viewMode: 3,
      autoCropArea: 1,
      dragMode: 'move'
    });

  }



  crop() {
    const canvas = this.cropper.getCroppedCanvas();
    const dataURL = canvas.toDataURL();
    canvas.style.display = "none";

    const file = this.dataURLtoFile(dataURL, 'croppedImage.png');
    console.log(file);
    // localStorage.setItem("image ", 'croppedImage.png');
    // console.log(localStorage)

    const cropBoxData = this.cropper.getCropBoxData();
    console.log("cropdata", cropBoxData);
    this.cropper.setCropBoxData({
      left: cropBoxData.left,
      top: cropBoxData.top,
      width: cropBoxData.width,
      height: cropBoxData.height
    });


    const divPosition = document.getElementById('imageDiv');
    const imageTop: any = divPosition?.offsetTop;
    const imageLeft: any = divPosition?.offsetLeft;

    console.log("top", imageTop);
    console.log("left", imageLeft);


    const croppedElement = document.createElement('div');
    croppedElement.style.position = 'absolute';
    croppedElement.style.top = (imageTop + this.cropper.getCropBoxData().top) + 'px';
    croppedElement.style.left = (imageLeft + this.cropper.getCropBoxData().left) + 'px';
    croppedElement.style.width = this.cropper.getCropBoxData().width + 'px';
    croppedElement.style.height = this.cropper.getCropBoxData().height + 'px';
    croppedElement.style.backgroundColor = 'gray';
    croppedElement.classList.add('cropped-card');

    const container = this.image.nativeElement.parentElement;
    container.appendChild(croppedElement);


  }


  private dataURLtoFile(dataURL: string, filename: string): File {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }
}

function useRef<T>(arg0: null) {
  throw new Error('Function not implemented.');
}
