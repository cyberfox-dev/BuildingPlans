import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';
import { DocumentUploadService } from 'src/app/service/DocumentUpload/document-upload.service';
import { FinancialService } from 'src/app/service/Financial/financial.service';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  @Input() UploadFor: any;
  @Input() ApplicationID: any;
  @Input() isFinancial: boolean | null;
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
    currentApplication: any;

  constructor(private http: HttpClient, private shared: SharedService, private documentUploadService: DocumentUploadService, private financialService: FinancialService,) { }

  ngOnInit(): void {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.currentApplication = this.shared.getViewApplicationIndex();
    if (this.UploadFor == "Doc" || this.UploadFor == "") {
      this.ApplicationID = this.currentApplication.applicationID;
    } else {
      this.ApplicationID = this.shared.getApplicationID();
    }
    
  }

  uploadFile(files: any) {
    if (files.length === 0) {
      return;
    }
    
    let fileToUpload = <File>files[0];
  const fileNameParts = fileToUpload.name.split('.');
    this.fileExtention = fileNameParts.length > 1 ? `.${fileNameParts[fileNameParts.length - 1].toLowerCase()}` : "";

    if (fileNameParts.length > 2 || this.fileExtention === ".webp") {
      if (this.fileExtention === ".webp") {
    alert("You cannot upload .webp files!");
  } else {
    alert("Invalid file name.");
  }
  return;
}
    if (this.UploadFor == "Doc" || this.UploadFor == "") {
      this.fileUploadName = fileNameParts[0] + "-appID-" + this.ApplicationID;
    } else {
      this.fileUploadName = this.UploadFor.substring(' ') + "-appID-" + this.ApplicationID;
    }
    

   

    if (this.isFinancial) {
      this.financialService.getFinancialByApplicationID(this.ApplicationID).subscribe((data: any) => {
        if (data && data.responseCode == 1) {
          
          // Searching for a match in the dataset
          let matchedDocument = data.dateSet.find(doc => doc.documentName === this.fileUploadName + this.fileExtention);
          
          if (matchedDocument) {
            
            alert('Oops, you cannot upload files with the same name!');
          } else
          {
            this.fileName = fileToUpload.name; // Set the fileName property with the selected file name

            this.passFileName.emit({ uploadFor: this.UploadFor, fileName: fileToUpload.name });
            // Instead of pushing the file for a temporary upload, immediately call UploadDocuments
            this.UploadDocuments(fileToUpload, this.fileUploadName + this.fileExtention);


          }
        } else {
          alert(data.responseMessage);
          console.log("Response:", data);
        }
      }, error => {
        console.log("Error: ", error);
      });
    }
    else {
      this.documentUploadService.getAllDocumentsForApplication(this.ApplicationID).subscribe((data: any) => {
        if (data && data.responseCode == 1) {
          
          // Searching for a match in the dataset
          let matchedDocument = data.dateSet.find(doc => doc.documentName === this.fileUploadName + this.fileExtention);
          
          if (matchedDocument) {
            
            alert('Oops, you cannot upload files with the same name!');
          } else {// If a match is found
            this.passFileName.emit({ uploadFor: this.UploadFor, fileName: fileToUpload.name });
            // Instead of pushing the file for a temporary upload, immediately call UploadDocuments
            this.UploadDocuments(fileToUpload, this.fileUploadName + this.fileExtention);

          }
        } else {
          alert(data.responseMessage);
          console.log("Response:", data);
        }
      }, error => {
        console.log("Error: ", error);
      });
    }
   



  }


  onDeleteFile() {
    if (!this.fileName) {
      return; // No file selected, nothing to delete
    }
    
    const confirmDelete = confirm(`Are you sure you want to delete the file "${this.fileName}"?`);
    if (!confirmDelete) {
      return; // User cancelled the delete operation
    }
    
    this.documentUploadService.getAllDocumentsForApplication(this.ApplicationID).subscribe((data: any) => {
      if (data && data.responseCode == 1) {
        
        // Searching for a match in the dataset
        let matchedDocument = data.dateSet.find(doc => doc.documentName === this.fileUploadName + this.fileExtention);
        
        if (matchedDocument) {
          
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
    
    const formData = new FormData();
    formData.append('file', file, fileName);
    
    this.http.post(this.apiUrl + 'documentUpload/UploadDocument', formData, { reportProgress: true, observe: 'events' })
      .subscribe({
        next: (event) => {
          
          if (event.type === HttpEventType.UploadProgress && event.total)
            this.progress = Math.round(100 * event.loaded / event.total);
          else if (event.type === HttpEventType.Response) {
            this.message = 'Upload success.';
            if (this.isFinancial) {
              this.financialuploadFinished(event.body, this.ApplicationID, this.CurrentUser); // Pass CurrentUser assuming it contains relevant user data. Adjust as needed.
            }
            else {
              this.uploadFinished(event.body, this.ApplicationID, this.CurrentUser); // Pass CurrentUser assuming it contains relevant user data. Adjust as needed.
            }
           
            
          }
        },
        error: (err: HttpErrorResponse) => console.log(err)
      });
  }

  uploadFinished = (event: any, applicationID: any, applicationData: any) => {
    
    this.response = event;
    console.log("this.response", this.response);
    console.log("this.response?.dbPath", this.response?.dbPath);
    console.log("applicationData", applicationData);
    
    const documentName = this.response?.dbPath.substring(this.response?.dbPath.indexOf('d') + 2);
    console.log("documentName", documentName);
    
    this.documentUploadService.addUpdateDocument(0, documentName, this.response?.dbPath, applicationID, applicationData.appUserId, this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {
        
        // Emit the onUploadSuccess event after a successful upload
        this.onUploadSuccess.emit(event.body); 
      }





    }, error => {
      console.log("Error: ", error);
    })


  }


  financialuploadFinished = (event: any, applicationID: any, applicationData: any) => {
    
    this.response = event;
    console.log("this.response", this.response);
    console.log("this.response?.dbPath", this.response?.dbPath);
    console.log("applicationData", applicationData);
    
    const documentName = this.response?.dbPath.substring(this.response?.dbPath.indexOf('d') + 2);
    console.log("documentName", documentName);
    
    this.financialService.addUpdateFinancial(0, documentName, "Financial", documentName, this.response?.dbPath, applicationID, "System Generated Invoice").subscribe((data: any) => {
  

      if (data.responseCode == 1) {
        
        // Emit the onUploadSuccess event after a successful upload
        this.onUploadSuccess.emit(event.body);
      }





    }, error => {
      console.log("Error: ", error);
    })


  }


}
