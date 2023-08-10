import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';
import { DocumentUploadService } from 'src/app/service/DocumentUpload/document-upload.service';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  @Input() UploadFor: any;
  @Input() ApplicationID: any;
  @Output() public onUploadFinished = new EventEmitter();
  @Output() public passFileName = new EventEmitter<{ uploadFor: string; fileName: string }>();
  @Output() onUploadSuccess: EventEmitter<any> = new EventEmitter();
  private readonly apiUrl: string = this.shared.getApiUrl();
  progress: number = 0;
  message: string | undefined;
  response: { dbPath: ''; } | undefined
  fileName: string = '';
    stringifiedData: any;
    CurrentUser: any;
    fileUploadName: string;
    fileExtention: string;

  constructor(private http: HttpClient, private shared: SharedService, private documentUploadService: DocumentUploadService,) { }

  ngOnInit(): void {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.ApplicationID = this.shared.getApplicationID();
  }

  uploadFile(files: any) {
    if (files.length === 0) {
      return;
    }
    debugger;
    let fileToUpload = <File>files[0];
    this.fileExtention = fileToUpload.name.substring(fileToUpload.name.indexOf('.'));
    if (this.fileExtention == ".webp") {
      alert("You cannot upload .webp files!");
      return;
    }

     this.fileUploadName = this.UploadFor.substring(' ') + "-appID-"  + this.ApplicationID;

    this.fileName = fileToUpload.name; // Set the fileName property with the selected file name

    this.passFileName.emit({ uploadFor: this.UploadFor, fileName: fileToUpload.name });

    console.log("THIS IS THE FILE NAME!", this.fileUploadName);
    debugger;
    // Instead of pushing the file for a temporary upload, immediately call UploadDocuments
    this.UploadDocuments(fileToUpload, this.fileUploadName + this.fileExtention);
  }


  onDeleteFile() {
    if (!this.fileName) {
      return; // No file selected, nothing to delete
    }
    debugger;
    const confirmDelete = confirm(`Are you sure you want to delete the file "${this.fileName}"?`);
    if (!confirmDelete) {
      return; // User cancelled the delete operation
    }
    debugger;
    this.documentUploadService.getAllDocumentsForApplication(this.ApplicationID).subscribe((data: any) => {
      if (data && data.responseCode == 1) {
        debugger;
        // Searching for a match in the dataset
        let matchedDocument = data.dateSet.find(doc => doc.documentName === this.fileUploadName + this.fileExtention);
        debugger;
        if (matchedDocument) {
          debugger;
          // If a match is found, delete using the documentID
          this.documentUploadService.deleteDocument(matchedDocument.documentID).subscribe(response => {
            if (response) { // Assuming server responds with true on successful deletion
              this.fileName = '';
              this.onUploadFinished.emit();
            } else {
              alert('Failed to delete the file from the server.');
            }
          }, error => {
            console.log("Error:", error);
            alert('An error occurred while deleting the file.');
          });
        } else {
          alert('No matching file found in the server database.');
        }
      } else {
        alert(data.responseMessage);
        console.log("Response:", data);
      }
    }, error => {
      console.log("Error: ", error);
    });
  }



  // Modify UploadDocuments to accept File and fileName parameters:
  UploadDocuments(file: File, fileName: string): void {
    debugger;
    const formData = new FormData();
    formData.append('file', file, fileName);
    debugger;
    this.http.post(this.apiUrl + 'documentUpload/UploadDocument', formData, { reportProgress: true, observe: 'events' })
      .subscribe({
        next: (event) => {
          debugger;
          if (event.type === HttpEventType.UploadProgress && event.total)
            this.progress = Math.round(100 * event.loaded / event.total);
          else if (event.type === HttpEventType.Response) {
            this.message = 'Upload success.';
            this.uploadFinished(event.body, this.ApplicationID, this.CurrentUser); // Pass CurrentUser assuming it contains relevant user data. Adjust as needed.
            
          }
        },
        error: (err: HttpErrorResponse) => console.log(err)
      });
  }

  uploadFinished = (event: any, applicationID: any, applicationData: any) => {
    debugger;
    this.response = event;
    console.log("this.response", this.response);
    console.log("this.response?.dbPath", this.response?.dbPath);
    console.log("applicationData", applicationData);
    debugger;
    const documentName = this.response?.dbPath.substring(this.response?.dbPath.indexOf('d') + 2);
    console.log("documentName", documentName);
    debugger;
    this.documentUploadService.addUpdateDocument(0, documentName, this.response?.dbPath, applicationID, applicationData.appUserId, this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {
        debugger;
        // Emit the onUploadSuccess event after a successful upload
        this.onUploadSuccess.emit(event.body); 
      }





    }, error => {
      console.log("Error: ", error);
    })


  }

}
