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

  @Input() UploadFor: any;
  @Output() public onUploadFinished = new EventEmitter();
  
  
  constructor(private http: HttpClient, private shared: SharedService) { }

  ngOnInit(): void {
  }
  uploadFile = (files: any) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);


    this.shared.pushFileForTempFileUpload(formData,this.UploadFor);

    //this.http.post('https://localhost:7123/api/documentUpload/UploadDocument', formData, { reportProgress: true, observe: 'events' })
    //  .subscribe({
    //    next: (event) => {
          
    //      if (event.type === HttpEventType.UploadProgress && event.total)
    //        this.progress = Math.round(100 * event.loaded / event.total);
    //      else if (event.type === HttpEventType.Response) {
    //        this.message = 'Upload success.';
    //        this.onUploadFinished.emit(event.body);
    //      }
    //    },
    //    error: (err: HttpErrorResponse) => console.log(err)
    //  });
  }



}
