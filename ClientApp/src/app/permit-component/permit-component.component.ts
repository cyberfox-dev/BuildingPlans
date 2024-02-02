import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PermitService } from 'src/app/service/Permit/permit.service'
import { SharedService } from "../shared/shared.service";
import { ApplicationsService } from '../service/Applications/applications.service';
import { PDFDocument } from 'pdf-lib';


//PTC = Permit To Comment
export interface PTCList {
  ZoneName: any;
  ZoneID: any;
  PermitSubForCommentID: number;
  ApplicationID: number;
  SubDepartmentID: number;
  UserAssaignedToComment: string;
  SubDepartmentName: string;
  PermitComment: string;
  PermitCommentStatus: string;
  PermitDocName: string;
  DocumentLocalPath: string;
}

@Component({
  selector: 'app-permit-component',
  templateUrl: './permit-component.component.html',
  styleUrls: ['./permit-component.component.css']
})

export class PermitComponentComponent implements OnInit {

  PTCList: PTCList[] = [];
  //permitupload Sindiswa 08 January 2024
  displayedColumns: string[] = ['subDepartmentName','zoneName' ,'comment' ,'indication', 'addDocument'];
  dataSource = this.PTCList;
  MeetOnSite = "MeetOnSite";
  Approved = "Approved";
  Rejected = "Rejected";
  null = null;// what is this
  pdfBlobs = [];
  @ViewChild(MatTable) PTCListTable: MatTable<PTCList> | undefined;
    AllCurrentUserRoles: any;
    stringifiedData: any;
    stringifiedDataCurrentUser: any;
    CurrentUser: any;
    stringifiedDataCurrentUserProfile: any;
    CurrentUserProfile: any;
    CanIssuePermit: boolean;
    CanConsolidate: boolean;
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private permitService: PermitService, private shared: SharedService, private applicationsService: ApplicationsService,) { }

  ngOnInit(): void {
    this.getAllPermitForComment();
    this.stringifiedDataCurrentUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataCurrentUserProfile);
    
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('AllCurrentUserRoles')));
    this.AllCurrentUserRoles = JSON.parse(this.stringifiedData);
    for (var i = 0; i < this.AllCurrentUserRoles.length; i++) {
      if (this.AllCurrentUserRoles[i].roleName == "Issue Permit") {
        this.CanIssuePermit = true;
      }
      else {
        this.CanIssuePermit = false;
      }
    }
    this.checkIfCanConsolidate();
  }

  @Input() ApplicationID;
  @Input() ApplicantID;
  @Input() OriginatorID;

  openPermitModal(content:any) {

    this.modalService.open(content, { size: 'lg' });
  }

  getAllPermitForComment() {
    this.PTCList.splice(0, this.PTCList.length);
    this.permitService.getPermitSubForCommentByApplicationID(this.ApplicationID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        debugger;

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempPTCList = {} as PTCList;
          const current = data.dateSet[i];
          tempPTCList.PermitSubForCommentID = current.permitSubForCommentID;
          tempPTCList.ApplicationID = current.applicationID;
          tempPTCList.SubDepartmentID = current.subDepartmentID;
          tempPTCList.SubDepartmentName = current.subDepartmentName;
          tempPTCList.UserAssaignedToComment = current.userAssaignedToComment;
          if (current.permitComment == null) {
            tempPTCList.PermitComment = "Awaiting Comment...";
          }
          else {
            tempPTCList.PermitComment = current.permitComment;
          }
          
          tempPTCList.PermitCommentStatus = current.permitCommentStatus;
          tempPTCList.ZoneID = current.zoneID;
          tempPTCList.ZoneName = current.zoneName;
          tempPTCList.PermitDocName = current.permitDocName;
          tempPTCList.DocumentLocalPath = current.documentLocalPath;
         

          this.PTCList.push(tempPTCList);

        }
        this.PTCListTable?.renderRows();
        this.updateApplicationStatus();
      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);
      }
      this.PTCListTable?.renderRows();
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  checkIfCanConsolidate() {
    let x = 0;
    debugger;
    for (var i = 0; i < this.PTCList.length; i++) {
      debugger;
      if (this.PTCList[i].PermitDocName != null) {
        x++;
      }
    }
    if (x === this.PTCList.length) {
      this.CanConsolidate = true;
    } else {
      this.CanConsolidate = false;
    }
  }

  updateApplicationStatus() {
    let x = 0;
    debugger;
    for (var i = 0; i < this.PTCList.length; i++) {
      debugger;
      if (this.PTCList[i].PermitDocName != null) {
        x++; debugger;
      }
     
    }

    if (x === this.PTCList.length) {
      this.applicationsService.getApplicationsByApplicationID(this.ApplicationID).subscribe((data: any) => {
        if (data.responseCode == 1) {
          const current = data.dateSet[0];

          this.applicationsService.updateApplicationStage(this.ApplicationID, current.previousStageName, current.previousStageNumber, current.currentStageName, current.currentStageNumber, current.nextStageName, current.nextStageNumber, "PTW Genaration").subscribe((data: any) => {
            if (data.responseCode == 1) {
              const current = data.dateSet[0];




            }
            else {

              alert(data.responseMessage);
            }
            console.log("reponseGetSubDepartmentForComment", data);


          }, error => {
            console.log("Error: ", error);
          })
          console.log("reponseGetSubDepartmentForCommentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrent", current);


        }
        else {

          alert(data.responseMessage);
        }
        console.log("reponseGetSubDepartmentForComment", data);


      }, error => {
        console.log("Error: ", error);
      })
    }


  }



  private readonly apiUrl: string = this.shared.getApiUrl() + '/api/';
  async CombinePTW() {
    

    for (var i = 0; i < this.PTCList.length; i++) {

      const currentDocName = this.PTCList[i].PermitDocName;
      if (currentDocName != null) {
        const blob = await fetch(this.apiUrl + `documentUpload/GetDocument?filename=${currentDocName}`)
          .then(response => {
            if (response.ok) {
              // The response status is in the 200 range

              return response.blob(); // Extract the response body as a Blob

            } else {
              throw new Error('Error fetching the document');
            }
          })
          .then(blob => {
            this.pdfBlobs.push(blob);
            console.log("this.pdfBlobsthis.pdfBlobsthis.pdfBlobsthis.pdfBlobsthis.pdfBlobs", this.pdfBlobs);
          })
          .catch(error => {
            console.log(error);
            // Handle the error appropriately
          });
      }


    }

    this.combinePDFs(this.pdfBlobs)

      .then(combinedPdfBlob => {
        // Do something with the combined PDF blob, like downloading it
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(combinedPdfBlob);
        link.download = 'combined.pdf';
        link.click();
      })
      .catch(error => {
        
        console.error('Error combining PDFs:', error);
      });

  }

  private async combinePDFs(pdfBlobs: Blob[]): Promise<Blob> {
    
    const combinedPdfDoc = await PDFDocument.create();

    for (const pdfBlob of pdfBlobs) {
      const blobAsArrayBuffer = await pdfBlob.arrayBuffer();
      const pdfDoc = await PDFDocument.load(blobAsArrayBuffer);
     
      const copiedPages = await combinedPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach(page => {
        
        combinedPdfDoc.addPage(page);
      });
    }
    
    const combinedPdfBytes = await combinedPdfDoc.save();
    
    return new Blob([combinedPdfBytes], { type: 'application/pdf' });
  }

}
