import { Component, Input, OnInit, ViewChild ,AfterViewInit} from '@angular/core';
import { MatTable } from '@angular/material/table';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DocumentUploadService } from '../service/DocumentUpload/document-upload.service';
import { PermitComponentComponent } from 'src/app/permit-component/permit-component.component';
import { SharedService } from "../shared/shared.service";
import { PermitService } from '../service/Permit/permit.service';

export interface DocumentsList {
  DocumentID: number;
  DocumentName: string;
  DocumentLocalPath: string;
  ApplicationID: number;
  AssignedUserID: string;
  DocumentGroupName: string;
}

@Component({
  selector: 'app-documents-component',
  templateUrl: './documents-component.component.html',
  styleUrls: ['./documents-component.component.css']
})
export class DocumentsComponentComponent implements OnInit{

  @Input() ApplicationID: number;
  @Input() ServiceConditionActive: boolean | null; 
  DocumentsList: DocumentsList[] = [];
  private readonly apiUrl: string = this.shared.getApiUrl() + '/api/';

  fileAttrs = "Upload File:";
  fileAttrsName = "Doc";
 
  @ViewChild(MatTable) DocumentsListTable: MatTable<DocumentsList> | undefined;

  fileAttr = 'Choose File';
  displayedColumnsDocs: string[] = ['DocumentName', 'actions'];
  dataSourceDoc = this.DocumentsList;
    currentApplication: any;
    applicationDataForView: any;
  hasFile: boolean;
  fileCount = 0;

  stringifiedDataUserProfile: any;
  CurrentUserProfile: any;

  @Input() isCalledInsidePermit: boolean = false; //default?
  @Input() permitSubForCommentID: any;
  @Input() permitDocumentName: any |null;
  @Input() permitCommentStatus: string;//Permit Kyle 13-02-24
  

  hasDocument: boolean = false;
  fromReApplyArchive: boolean; //reapply Sindiswa 26 January 2024
  constructor(private documentUploadService: DocumentUploadService, private modalService: NgbModal, private shared: SharedService, private permitService: PermitService, private permitComponentComponent: PermitComponentComponent) { }

  ngOnInit(): void {
    //this.currentApplication = this.shared.getViewApplicationIndex();
    this.ApplicationID = this.shared.applicationID;
    //Permit Kyle 13-02-24
    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);
    //Permit Kyle 13-02-24
    this.getAllDocsForApplication();
    //this.hasPermitSubForCommentDocument();
    //this.fromReApplyArchive = this.shared.getFromReApplyArchive(); //reapply Sindiswa 26 January 2024
   

  }
 
  uploadFileEvt(imgFile: any) {
    if (imgFile.target.files && imgFile.target.files[0]) {
      this.fileAttr = '';
      Array.from(imgFile.target.files).forEach((file: any) => {
        this.fileAttr += file.name + ' - ';
      });
      // HTML5 FileReader API
      let reader = new FileReader();
      reader.onload = (e: any) => {
        let image = new Image();
        image.src = e.target.result;
        image.onload = (rs) => {
          let imgBase64Path = e.target.result;
          //  console.log("e.target.result", e.target.result); 
        };
      };
      reader.readAsDataURL(imgFile.target.files[0]);
      // Reset if duplicate image uploaded again

    } else {
      this.fileAttr = 'Choose File';
    }
  }

  lastUploadEvent: any;

  onUploadFinished(event: any) {
    this.lastUploadEvent = event;  // Store the event data
    // Other logic (if any)...
  }

  ConfirmUpload() {
    if (!window.confirm("Are you sure you want to upload the file? You cannot change or delete this document once you save!")) {
      // Use the stored event data
      this.onFileDelete(this.lastUploadEvent, 0);
    } else {
      this.permitComponentComponent.getAllPermitForComment();
    }
    // Rest of the logic...
  }
  onCloseFile() {
    if (this.hasFile) {
      if (confirm("The file will be uploaded if you proceed. Click 'OK' to upload or 'Cancel' to delete the file before proceeding.")) {
        this.modalService.dismissAll();
      }
      else {
                    
      }

    } else {
      this.permitComponentComponent.getAllPermitForComment();
      this.modalService.dismissAll();
    }


  }

  changeHasFile() {
      if (this.hasFile) {
        this.hasFile = false;
      } else {
        this.hasFile = true;
       
      }
  }
  onPassFileName(event: { uploadFor: string; fileName: string }) {
    
    const { uploadFor, fileName } = event;
    const index = parseInt(uploadFor.substring('CoverLetter'.length));
    this.fileAttrsName = "Doc";
   /* this.hasFile = true;*/
    this.fileCount = this.fileCount + 1;
  }
  onFileDelete(event: any, index: number) {
   
    this.fileAttrsName = "Doc";
    this.hasFile = false;
    //this.getAllDocsForApplication();
    this.fileCount = this.fileCount - 1;
  }

  onFileUpload(event: any) {
    if (this.isCalledInsidePermit) {
        /*this.permitComponentComponent.getAllPermitForComment();*/
    }
   
  }

  viewDocument(index: any) {
    
    if (this.permitDocumentName != null && index == -1) {
      // Make an HTTP GET request to fetch the document
      fetch(this.apiUrl + `documentUpload/GetDocument?filename=${this.permitDocumentName}`)
        .then(response => {
          if (response.ok) {
            // The response status is in the 200 range

            return response.blob(); // Extract the response body as a Blob

          } else {
            throw new Error('Error fetching the document');
          }
        })
        .then(blob => {
          // Create a URL for the Blob object
          const documentURL = URL.createObjectURL(blob);

          window.open(documentURL, '_blank');

          // Download the document
          const link = document.createElement('a');
          link.href = documentURL;
          link.download = this.DocumentsList[index].DocumentName; // Set the downloaded file name
          link.click();
        })
        .catch(error => {
          console.log(error);
          // Handle the error appropriately
        });
    }
    else {

      // Make an HTTP GET request to fetch the document
      fetch(this.apiUrl + `documentUpload/GetDocument?filename=${this.DocumentsList[index].DocumentName}`)
        .then(response => {
          if (response.ok) {
            // The response status is in the 200 range

            return response.blob(); // Extract the response body as a Blob

          } else {
            throw new Error('Error fetching the document');
          }
        })
        .then(blob => {
          // Create a URL for the Blob object
          const documentURL = URL.createObjectURL(blob);

          window.open(documentURL, '_blank');

          // Download the document
          const link = document.createElement('a');
          link.href = documentURL;
          link.download = this.DocumentsList[index].DocumentName; // Set the downloaded file name
          link.click();
        })
        .catch(error => {
          console.log(error);
          // Handle the error appropriately
        });
    }

  

  }


  getAllDocsForApplication() {
    this.DocumentsList.splice(0, this.DocumentsList.length);
    this.documentUploadService.getAllDocumentsForApplication(this.ApplicationID).subscribe((data: any) => {

      if (data.responseCode == 1) {
        
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDocList = {} as DocumentsList;

          const current = data.dateSet[i];
          const nameCheck = current.documentName.substring(0, 13);

          if (current.documentName != "Service Condition" && nameCheck != "Approval Pack") {
            tempDocList.DocumentID = current.documentID;
            tempDocList.DocumentName = current.documentName;
            tempDocList.DocumentLocalPath = current.documentLocalPath;
            tempDocList.ApplicationID = current.applicationID;
            tempDocList.AssignedUserID = current.assignedUserID;

            this.DocumentsList.push(tempDocList);
          }
         
        }

        this.DocumentsListTable?.renderRows();
        console.log("GOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCS", this.DocumentsList[0]);
      }
      else {
        alert(data.responseMessage);

      }
      console.log("reponseGetAllDocsForApplication", data);

    }, error => {
      console.log("ErrorGetAllDocsForApplication: ", error);
    })

  }
  openDocUpload(newSub: any) {
    this.modalService.open(newSub, { backdrop: 'static', centered: true, size: 'lg' });
  }

  // #region permitUpload Sindiswa 09 January 2024 - the upload button should be disabled after ONE document has been uploaded
  hasPermitSubForCommentDocument() {

    console.log("This is the acquired permitforSubCommentID", this.permitSubForCommentID);
    if (this.isCalledInsidePermit) {
      this.permitService.hasPermitSubForCommentDocuments(this.permitSubForCommentID).subscribe((data) => {
    
        console.log("API Response:", data);
        console.log("This is the response for the Has Document question", data.HasDocuments);
        this.hasDocument = data && data.dateSet.hasDocuments;
       
      
      });
      console.log("PermitCommentStatusDocuments", this.permitCommentStatus, this.hasDocument, this.isCalledInsidePermit);
    }
  }
  // #endregion
  //Permit Kyle 13-02-24
  deletePermitDocument() {

    
    if (confirm("Are you sure you want to delete this document?")) {

      this.permitService.deleteDocumentFromPermitSubForComment(this.ApplicationID, this.permitSubForCommentID).subscribe((data: any) => {
        
        if (data.responseCode == 1) {
          alert(data.responseMessage);
          this.hasPermitSubForCommentDocument()
        }
        else {
          alert(data.responseMessage);

        }

      }, error => {
        console.log("ErrorGetAllDocsForApplication: ", error);
      })
    }
    
  }
  //Permit Kyle 13-02-24
  
}
