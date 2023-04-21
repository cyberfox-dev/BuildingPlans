import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedService } from "src/app/shared/shared.service";





@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})

export class FileUploadComponent implements OnInit {
  progress: number = 0;
  message: string | undefined;

 // @Input() UploadFor: any;
 // @Output() public onUploadFinished = new EventEmitter();
 // @Output() public passFileName = new EventEmitter<string>();
 ////@Output() public onUploadFile = new EventEmitter();
 //fileName: string = 'C';

  @Input() UploadFor: any;
  @Output() public onUploadFinished = new EventEmitter();
  @Output() public passFileName = new EventEmitter<{ uploadFor: string, fileName: string }>();
  fileName: string = '';
  
  constructor(private http: HttpClient, private shared: SharedService) { }

  ngOnInit(): void {
  }
 
  uploadFile = (files: any) => {
    if (files.length === 0) {
      return;
    }

    let fileToUpload = <File>files[0];
    let fileExtention = fileToUpload.name.substring(fileToUpload.name.indexOf('.'));
    let fileUploadName = fileToUpload.name.substring(0, fileToUpload.name.indexOf('.')) + this.UploadFor;

    this.passFileName.emit({ uploadFor: this.UploadFor, fileName: fileToUpload.name });

    this.shared.pushFileForTempFileUpload(fileToUpload, fileUploadName + fileExtention);
  }


}

// This is the old code
//uploadFile = (files: any) => {


//  if (files.length === 0) {
//    return;
//  }
//  let fileToUpload = <File>files[0];
//  /*    const formData = new FormData();*/

//  let fileExtention = fileToUpload.name.substring(fileToUpload.name.indexOf('.'));
//  let fileUploadName = fileToUpload.name.substring(0, fileToUpload.name.indexOf('.')) + this.UploadFor;
//  this.passFileName.emit(fileToUpload.name);
//  //formData.append('file', fileToUpload, fileToUpload.name + this.UploadFor);


//  this.shared.pushFileForTempFileUpload(fileToUpload, fileUploadName + fileExtention);
//  //const fileForUpload = this.shared.pullFilesForUpload();
//  //console.log("fileForUploadtttttttttttttttttttttttttttttt", fileForUpload);
//  //this.http.post('https://localhost:7123/api/documentUpload/UploadDocument', formData, { reportProgress: true, observe: 'events' })
//  // .subscribe({
//  //    next: (event) => {

//  //     if (event.type === HttpEventType.UploadProgress && event.total)
//  //     this.progress = Math.round(100 * event.loaded / event.total);
//  //     else if (event.type === HttpEventType.Response) {
//  //      this.message = 'Upload success.';
//  //      this.onUploadFinished.emit(event.body);
//  //     }
//  //},
//  //    error: (err: HttpErrorResponse) => console.log(err)
//  //  });
//}
