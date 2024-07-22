import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';
import { BPDocumentsUploadsService } from '../service/BPDocumentsUploads/bpdocuments-uploads.service';
import { FinancialService } from 'src/app/service/Financial/financial.service';
import { BPFinancialService } from '../service/BPfinancial/bpfinancial.service';


@Component({
  selector: 'app-bpfile-upload',
  templateUrl: './bpfile-upload.component.html',
  styleUrls: ['./bpfile-upload.component.css']
})
export class BPFileUploadComponent implements OnInit {

  @Input() UploadFor: any;
  @Input() ApplicationID: any;
  @Input() isFinancial: boolean | null;
  @Output() public onUploadFinisheded = new EventEmitter();
  @Output() public passFileName = new EventEmitter<{ uploadFor: string; fileName: string }>();
  @Output() onUploadSuccess: EventEmitter<any> = new EventEmitter();
  isDragging: boolean = false;
  isActiveDropArea: boolean = false;

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  progress: number = 0;
  message: string | undefined;
  response: { dbPath: string; } | undefined = { dbPath: '' };
  fileName: string = "";
  stringifiedData: any;
  CurrentUser: any;
  fileUploadName: string;
  fileExtention: string;
  currentApplication: any;

  constructor(private http: HttpClient, private sharedService: SharedService, private bpDocumentUploadService: BPDocumentsUploadsService, private financialService: FinancialService, private bpFinancialService: BPFinancialService) { }

  ngOnInit(): void {
    this.CurrentUser = JSON.parse(localStorage.getItem('LoggedInUserInfo') || '{}');
    this.currentApplication = this.sharedService.getViewApplicationIndex();
    this.ApplicationID = this.sharedService.getApplicationID();
  }

  dragOver(event: DragEvent): void {
    event.preventDefault();
    this.isActiveDropArea = true;
  }

  dragEnter(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  dragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    this.isActiveDropArea = false;

  }

  drop(event: DragEvent): void {
    event.preventDefault();

    this.isDragging = false;
    this.isActiveDropArea = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.uploadFile(event.dataTransfer.files);
    }
  }

  uploadFile(files: any) {
    
    if (this.ApplicationID == "isRep") {
      
      if (files && files.length === 0) {
        return;
      }

      if (files && files.length === 0) {
        return;
      }

      let fileToUpload = files ? <File>files[0] : null;

      if (fileToUpload === null) {
        return;
      }

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

      if (this.UploadFor == "Doc") {
        
        if (this.ApplicationID === undefined) {
          this.fileUploadName = fileNameParts[0];
        } else {
          this.fileUploadName = fileNameParts[0];
        }

      }
      else {
        
        this.fileUploadName = this.UploadFor.substring(' ');
      }

      const handleResponse = (data: any) => {
        
        if (data?.responseCode == 1) {
          
          const matchedDocument = data.dateSet.find(doc => doc.documentName === this.fileUploadName + this.fileExtention);

          if (matchedDocument) {
            
            alert('Oops, you cannot upload files with the same name!');
          } else {
            this.fileName = fileToUpload.name;
            this.passFileName.emit({ uploadFor: this.UploadFor, fileName: fileToUpload.name });
            
            this.UploadDocuments(fileToUpload, this.fileUploadName + this.fileExtention);
            
          }
        } else {
          alert(data?.responseMessage);
          console.error("Response:", data);
        }
      };

      const handleError = (error: any) => {
        console.error("Error: ", error);
      };

      const serviceCall = (this.isFinancial || this.isFinancial === null)

        ? () => this.bpDocumentUploadService.getAllDocumentsForRepository()
        : () => this.bpDocumentUploadService.getAllDocumentsForRepository();

      serviceCall().subscribe(handleResponse, handleError);
    } else {
      
      if (files && files.length === 0) {
        return;
      }

      if (files && files.length === 0) {
        return;
      }

      let fileToUpload = files ? <File>files[0] : null;

      if (fileToUpload === null) {
        return;
      }

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

      if (this.UploadFor == "Doc") {
        
        if (this.ApplicationID === undefined) {
          this.fileUploadName = fileNameParts[0] + "_appID";
        } else {
          this.fileUploadName = fileNameParts[0] + "_appID" + this.ApplicationID;
        }

      }
      else {
        
        this.fileUploadName = this.UploadFor.substring(' ') + "_appID" + this.ApplicationID;
      }

      const handleResponse = (data: any) => {
        
        if (data?.responseCode == 1) {
          
          const matchedDocument = data.dateSet.find(doc => doc.documentName === this.fileUploadName + this.fileExtention);

          if (matchedDocument) {
            
            alert('Oops, you cannot upload files with the same name!');
          } else {
            this.fileName = fileToUpload.name;
            this.passFileName.emit({ uploadFor: this.UploadFor, fileName: fileToUpload.name });
            this.UploadDocuments(fileToUpload, this.fileUploadName + this.fileExtention);
            
          }
        } else {
          alert(data?.responseMessage);
          console.error("Response:", data);
        }
      };

      const handleError = (error: any) => {
        console.error("Error: ", error);
      };

      const serviceCall = (this.isFinancial || this.isFinancial === null)

        ? () => this.financialService.getFinancialByApplicationID(this.ApplicationID)
        : () => this.bpDocumentUploadService.getAllDocumentsForApplication(this.ApplicationID);

      serviceCall().subscribe(handleResponse, handleError);
    }
  }

  UploadDocuments(file: File, fileName: string): void {
    const formData = new FormData();
    formData.append('file', file, fileName);
    
    this.http.post(this.apiUrl + 'bPDocumentUploads/UploadDocument', formData, { reportProgress: true, observe: 'events' })
      .subscribe({
        next: (event) => {
          
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this, this.progress = Math.round(100 * event.loaded / event.total);
          }
          else if (event.type === HttpEventType.Response) {
            this.message = 'Upload success.';
            if (this.isFinancial) {
              this.financialuploadFinished(event.body,this.ApplicationID,this.CurrentUser);
            }
            else {
              
              this.uploadFinished(event.body, this.ApplicationID, this.CurrentUser);
            }

          }
        },
        error: (err: HttpErrorResponse) => console.log(err)


      });
  }

  uploadFinished = (event: any, applicationID: any, applicationData: any) => {
    debugger;
    this.response = event;
    debugger;
    const documentName = this.response?.dbPath.substring(this.response?.dbPath.indexOf('d') + 2);
    
    this.bpDocumentUploadService.addUpdateDocument(0, documentName, this.response?.dbPath, applicationID, applicationData.appUserId, this.CurrentUser.appUserId, "Building Application", null, null, null, null).subscribe((data: any) => {
      
      if (data.responseCode == 1) {
        this.onUploadSuccess.emit(event.body);

      }
    }, error => {
      console.log("Error: ", error);
    })
  }

  onDeleteFile() {
    if (!this.fileName) {
      return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete this file "${this.fileName}"?`);
    if (!confirmDelete) {
      return;
    }

    const handleResponse = (data: any) => {
      
      if (data?.responseCode == 1) {
        const matchedDocument = data.dateSet.find(doc => doc.documentName === this.fileUploadName + this.fileExtention);
        
        if (matchedDocument) {
          if (this.isFinancial) {
            this.bpFinancialService.deleteFinancial(matchedDocument.financialID).subscribe(response => {
              if (response) {
                this.fileName = '';
                this.onUploadFinisheded.emit();
              }
              else {
                alert('Failed to delete file from the server');
              }
            }, error => {
              console.log("Erorr: ", error);
              alert('An error occurred while deleting the file.');
            });
          }
          else {


            this.bpDocumentUploadService.deleteDocument(matchedDocument.documentID).subscribe(response => {
              if (response) {
                this.fileName = '';
                this.onUploadFinisheded.emit();
              }
              else {
                alert('Failed to delete file from the server');
              }
            }, error => {
              console.log("Erorr: ", error);
              alert('An error occurred while deleting the file.');

            });
          }
        }
        else {
          alert('No matching file founde in the server database.');
        }
      }
      else {
        alert(data?.responseMessage);
        console.error("Response :", data);
      }
    };

    const handleError = (error: any) => {
      console.error("Error: ", error);
    }

    const serviceCall = (this.isFinancial || this.isFinancial === null)

      ? () => this.bpFinancialService.getFinancialByApplicationID(this.ApplicationID)
      : () => this.bpDocumentUploadService.getAllDocumentsForApplication(this.ApplicationID);

    serviceCall().subscribe(handleResponse, handleError);

  }

  financialuploadFinished = (event: any, applicationID: any, applicationData: any) => {
    
    this.response = event;
    console.log("this.response", this.response);
    console.log("this.response?.dbPath", this.response?.dbPath);
    console.log("applicationData", applicationData);

    const documentName = this.response?.dbPath.substring(this.response?.dbPath.indexOf('d') + 2);
    console.log("documentName", documentName);

    this.bpFinancialService.addUpdateFinancial(0, documentName, "Financial", documentName, this.response?.dbPath, applicationID,applicationData.appUserId).subscribe((data: any) => {


      if (data.responseCode == 1) {

        // Emit the onUploadSuccess event after a successful upload
        this.onUploadSuccess.emit(event.body);
      }
      else {
        alert("An Error occured while trying to upload Financial Document");  
      }




    }, error => {
      console.log("Error: ", error);
    })


  }
}

 

