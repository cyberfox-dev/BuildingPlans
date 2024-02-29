import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';
import { DocumentUploadService } from 'src/app/service/DocumentUpload/document-upload.service';
import { FinancialService } from 'src/app/service/Financial/financial.service';
import { PermitService } from '../service/Permit/permit.service';
import { PermitComponentComponent } from 'src/app/permit-component/permit-component.component';
import { MobileFieldTrackingService } from '../service/MFT/mobile-field-tracking.service';



@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  @Input() UploadFor: any;
  @Input() ApplicationID: any;
  @Input() descriptionForDocRepoS: any | null;
  @Input() isFinancial: boolean | null;
   //  Financial POP Kyle 15/01/24
  @Input() uploadingPOP: boolean | null;
  //  Financial POP Kyle 15/01/24

  //Service Information Kyle 
  @Input() isPlanningDoc: boolean | null;
  //Service Information Kyle 
  @Input() isCalledInsidePermit: boolean | null;
  @Input() permitSubForCommentID: any;
  
  @Input() ServiceConditionActive: boolean | null;
  @Output() public onUploadFinished = new EventEmitter();
  @Output() public passFileName = new EventEmitter<{ uploadFor: string; fileName: string }>();
  @Output() onUploadSuccess: EventEmitter<any> = new EventEmitter();
  isDragging: boolean = false;
  isActiveDropArea: boolean = false;
 
  private readonly apiUrl: string = this.shared.getApiUrl() + '/api/';
  progress: number = 0;
  message: string | undefined;
  response: { dbPath: string; } | undefined = { dbPath: '' };
  fileName: string = '';
  stringifiedData: any;
  CurrentUser: any;
  fileUploadName: string;
  fileExtention: string;
  currentApplication: any;
   //Service Information Kyle 31/01/24
  stringifiedDataUserProfile: any;
  CurrentUserProfile: any;
  MFTID: number = 0;

  @Input() isStatusOfWork: boolean | null;
  @Input() MftNote: string | null;
  //Service Information Kyle 31/01/24
  constructor(private http: HttpClient, private shared: SharedService, private documentUploadService: DocumentUploadService, private financialService: FinancialService, private permitService: PermitService, private permitComponentComponent: PermitComponentComponent, private MFTService: MobileFieldTrackingService) { }

  ngOnInit(): void {
    this.CurrentUser = JSON.parse(localStorage.getItem('LoggedInUserInfo') || '{}');
    this.currentApplication = this.shared.getViewApplicationIndex();
     //Service Information Kyle 31/01/24
    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);
     //Service Information Kyle 31/01/24
    if (this.ApplicationID == "isRep") {

    }
    else {
      
        if (this.UploadFor === "Doc" || !this.UploadFor) {
          this.ApplicationID = this.currentApplication?.applicationID;
        } else {
          if (this.ApplicationID === 0) {
            this.ApplicationID = this.shared.getApplicationID();
          }
          else {
             //this is for the permit
          }
        
        }
      
    }
  }

  // New drag and drop handlers
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

        ? () => this.documentUploadService.getAllDocumentsForRepository()
        : () => this.documentUploadService.getAllDocumentsForRepository();

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
          this.currentApplication
          this.fileUploadName = fileNameParts[0] + "_appID";
        }
       //  Financial POP Kyle 15/01/24
        else if (this.uploadingPOP === true) {
          
          const projectNumber = this.currentApplication.ProjectNumber;
       
            this.fileUploadName = "Proof Of Payment _appID" + this.ApplicationID;
          
        }
        else {
          this.fileUploadName = fileNameParts[0] + "_appID" + this.ApplicationID;
        }
       //  Financial POP Kyle 15/01/24
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
        : () => this.documentUploadService.getAllDocumentsForApplication(this.ApplicationID);

      serviceCall().subscribe(handleResponse, handleError);
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
    
    if (this.ApplicationID == "isRep") {
      const handleResponse = (data: any) => {
        
        if (data?.responseCode == 1) {
          
          const matchedDocument = data.dateSet.find(doc => doc.documentName === this.fileUploadName + this.fileExtention);

          if (matchedDocument) {
            
            if (this.isFinancial) {
              this.financialService.deleteFinancial(matchedDocument.financialID).subscribe(response => {
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
            }
          
            else {
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
            }


          } else {
            alert('No matching file found in the server database.');
            
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

        ? () => this.documentUploadService.getAllDocumentsForRepository()
        : () => this.documentUploadService.getAllDocumentsForRepository();

      serviceCall().subscribe(handleResponse, handleError);
    }

    else if (this.isCalledInsidePermit) {
      
      this.permitService.deleteDocumentFromPermitSubForComment(this.ApplicationID, this.permitSubForCommentID).subscribe((data: any) => {
        
        if (data.responseCode == 1) {
       
          this.fileName = '';
          this.onUploadFinished.emit();
        }
        else {
          alert(data.responseMessage);

        }
      

      }, error => {
        console.log("ErrorGetPermitDocForApplication: ", error);
      })
      
    }
    //Status of works Kyle 16-02-24
    else if (this.isStatusOfWork) {
      this.MFTService.deleteDocumentFromMFT(this.ApplicationID, this.fileUploadName + this.fileExtention).subscribe((data: any) => {
        if (data.responseCode == 1) {
          
          this.fileName = '';
          this.MFTID = data.dateSet.mftid;
          this.onUploadFinished.emit();
        }
        else {
          alert(data.responseMessage);

        }


      }, error => {
        console.log("ErrorGetPermitDocForApplication: ", error);
      })
    }
    else {
      const handleResponse = (data: any) => {
        
        if (data?.responseCode == 1) {
          
          const matchedDocument = data.dateSet.find(doc => doc.documentName === this.fileUploadName + this.fileExtention);

          if (matchedDocument) {
            
            if (this.isFinancial) {
              this.financialService.deleteFinancial(matchedDocument.financialID).subscribe(response => {
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
            }
            else {
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
            }


          } else {
            alert('No matching file found in the server database.');
            
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
        : () => this.documentUploadService.getAllDocumentsForApplication(this.ApplicationID);

      serviceCall().subscribe(handleResponse, handleError);
    }




  
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
            // #region permitupload Sindiswa 08 January 2024 - for the purpose of uploading documents under the "Permits" tab
            if (this.isCalledInsidePermit) {
              this.permitUploadFinished(event.body, this.permitSubForCommentID);
            }
            // #endregion
            //Service Information Kyle 31/01/24
            if (this.isPlanningDoc) {
              this.isPlanningUploadFinished(event.body, this.ApplicationID, this.CurrentUser);
            }
            if (this.isStatusOfWork) {
              this.isStatusOfWorkUploadFinished(event.body, this.ApplicationID, this.CurrentUser);
            }
            //Service Information Kyle 31/01/24
            else if ((this.isFinancial == false || this.isFinancial == null) && (this.isCalledInsidePermit == false || this.isCalledInsidePermit == null) && (this.isPlanningDoc == false || this.isPlanningDoc == null) && (this.isStatusOfWork == false || this.isStatusOfWork == null)) {
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
    if (this.ServiceConditionActive === true) {
      this.shared.RepFileUploadCat = "Service Condition";
    }
    const documentName = this.response?.dbPath.substring(this.response?.dbPath.indexOf('d') + 2);
    console.log("documentName", documentName);
    if (this.ApplicationID == "isRep") {
      this.documentUploadService.addUpdateDocument(0, documentName, this.response?.dbPath, null, applicationData.appUserId, this.CurrentUser.appUserId, this.shared.RepFileUploadCat, this.shared.RepFileUploadSubID, this.shared.RepFileUploadSubName, null, true, this.descriptionForDocRepoS).subscribe((data: any) => {

        if (data.responseCode == 1) {
          
          // Emit the onUploadSuccess event after a successful upload
          this.onUploadSuccess.emit(event.body);
          this.shared.RepFileUploadCat = null;
          this.shared.RepFileUploadSubID = null;
          this.shared.RepFileUploadSubName = null;
        }





      }, error => {
        console.log("Error: ", error);
      })
    } else {
      if (this.ServiceConditionActive === true) {
        const groupName = "Service Condition";
        this.documentUploadService.addUpdateDocument(0, documentName, this.response?.dbPath, applicationID, applicationData.appUserId, this.CurrentUser.appUserId, groupName).subscribe((data: any) => {

          if (data.responseCode == 1) {
            
            // Emit the onUploadSuccess event after a successful upload
            this.onUploadSuccess.emit(event.body);
          }





        }, error => {
          console.log("Error: ", error);
        })
      }
      else {
     
        this.documentUploadService.addUpdateDocument(0, documentName, this.response?.dbPath, applicationID, applicationData.appUserId, this.CurrentUser.appUserId).subscribe((data: any) => {
          
          if (data.responseCode == 1) {
            
            // Emit the onUploadSuccess event after a successful upload
            this.onUploadSuccess.emit(event.body);
          }





        }, error => {
          console.log("Error: ", error);
        })
      }
     
    }

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

  // #region permitupload Sindiswa 08 January 2024 - for the purpose of uploading documents under the "Permits" tab
  permitUploadFinished = (event: any, permitSubForCommentID: any) => {
    this.response = event;
    const documentName = this.response?.dbPath.substring(this.response?.dbPath.indexOf('d') + 2);
    
    //
    this.permitService.addUpdatePermitSubForComment(permitSubForCommentID, null, null, null, null, null, null, null, null, null, this.response?.dbPath, documentName).subscribe((data: any) => {
      if (data.responseCode == 1) {
        
        // Emit the onUploadSuccess event after a successful upload
        this.onUploadSuccess.emit(event.body);
       
      }

    }, error => {
      console.log("Error: ", error);
    })
  }
  // #endregion

   //Service Information Kyle 31/01/24
  isPlanningUploadFinished = (event: any, applicationID: any, applicationData: any) => {
    this.response = event;
    const documentName = this.response?.dbPath.substring(this.response?.dbPath.indexOf('d') + 2);

    this.documentUploadService.addUpdateDocument(0, documentName, this.response?.dbPath, applicationID, applicationData.appUserId, this.CurrentUser.appUserId, "Service Information", this.CurrentUserProfile[0].subDepartmentID, this.CurrentUserProfile[0].subDepartmentName,true).subscribe((data: any) => {

      if (data.responseCode == 1) {

        // Emit the onUploadSuccess event after a successful upload
        this.onUploadSuccess.emit(event.body);
     
      }





    }, error => {
      console.log("Error: ", error);
    })
  }

  //Status of works Kyle 16-02-24
  isStatusOfWorkUploadFinished = (event: any, applicationID: any, applicationData: any) => {
    this.response = event;
    const documentName = this.response?.dbPath.substring(this.response?.dbPath.indexOf('d') + 2);
    
    this.MFTService.addUpdateMFT(this.MFTID,this.MftNote,applicationID,documentName,this.response?.dbPath,this.CurrentUser.appUserId,this.CurrentUser.fullName).subscribe((data: any) => {
      
      if (data.responseCode == 1) {
        
        // Emit the onUploadSuccess event after a successful upload
        this.onUploadSuccess.emit(event.body);

      }





    }, error => {
      console.log("Error: ", error);
    })
  }
   //Service Information Kyle 31/01/24
}
