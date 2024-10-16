import { Component, Input, OnInit ,ViewChild} from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BPFinancialService } from '../service/BPfinancial/bpfinancial.service';
import { SharedService } from '../shared/shared.service';
import { FinancialService } from '../service/Financial/financial.service';
import { BuildingApplicationsService } from '../service/BuildingApplications/building-applications.service';
export interface FinancialDocumentList {
  FinancialID: number;
  FinancialDocumentName: string;
  FinancialName: string;
  FinancialType: string;
  FinancialDocumentLocalPath: string;
  ApplicationID: number;
  CreatedById: string;
}
@Component({
  selector: 'app-bpfinancials',
  templateUrl: './bpfinancials.component.html',
  styleUrls: ['./bpfinancials.component.css']
})
export class BPFinancialsComponent implements OnInit {

  /**/
  lsNumber: string;
  BPApplicationProjectNumber: string;
  typeOfDev: string;

  typeOfAddress: string;
  noOfUnits: string;
  unitNumber: string;
  propertyValue: string;
  erfNumber: string;
  portionNumber: string;
  premisesName: string;
  propertyDescription: string;
  occupationClassification: string;
  buildingPlanFor: string;
  physicalAddress: string;
  latitude: string;
  longitude: string;
  sGCode: string;
  OmnibusServitude: boolean = false;
  functionalArea: string;
  currentStage: string;
  currentStageNumber: number;
  ActionCenter: boolean = false;

  //Owner Details
  firstName: string;
  surname: string;
  cellNo: string;
  altCellNo: string;
  email: string;
  altEmail: string;
  address: string;
  idNumber: string;



  //Architect Detail
  architectName: string;
  architectSurname;
  architectId: string;
  architectReg: string;
  architectEmail: string;
  architectCell: string;
/**/
  ApplicationID: number;

  hasRelaxationInvoice: boolean = false;
  isFinancial: boolean;
  hasFile: boolean;
  popBtn: boolean = false;

  fileCount: number = 0;
  fileAttrs = '';

  @Input() isWayleave: boolean = false;

  financialDocumentList: FinancialDocumentList[] = [];
  @ViewChild(MatTable) financialsTable: MatTable<FinancialDocumentList> | null;
  displayedColumns: string[] = ['FinancialName', 'FinancialDocumentName', 'actions'];
  dataSource = this.financialDocumentList;
  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
    bpApplicationType: any;
    currentStatus: any;
  constructor(private bpFinancialService: BPFinancialService, private sharedService: SharedService, private modalService: NgbModal, private financialService: FinancialService, private bpService: BuildingApplicationsService,) { }

  ngOnInit(): void {
    this.ApplicationID = this.sharedService.getApplicationID();
    this.getAllFinancialDocuments();
    this.getApplicationInfo();
  }

  onPassFileName(event: { uploadFor: string; fileName: string }) {

    const { uploadFor, fileName } = event;


    this.hasFile = true;
    this.fileCount = this.fileCount + 1;
  }

  onFileDelete(event: any, index: number) {
    this.hasFile = false;


    //this.getAllDocsForApplication();
    this.fileCount = this.fileCount - 1;

  }




  getApplicationInfo() {

    this.bpService.getBuildingApplicationByApplicationID(this.ApplicationID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        debugger;
        const current = data.dateSet[0];
        console.log("THIS IS APPLICATION DATATHIS IS APPLICATION DATATHIS IS APPLICATION DATATHIS IS APPLICATION DATATHIS IS APPLICATION DATA", data.dateSet[0]);
        this.lsNumber = current.lsNumber;
        this.bpApplicationType = current.bpApplicationType;
        this.currentStage = current.stage;
        this.currentStatus = current.status;
        this.OmnibusServitude = current.omnibusServitude;


      
      }
      else {
        alert(data.responseMessage);
      }
      console.log("responseKyle", data);
    }, error => {
      console.log("Error: ", error);
    })
  }


  onFileUpload(event: any) {



  }

  openUpload(UploadProof: any) {
    this.isFinancial = true;
    if (this.currentStatus == "Unpaid") {
      this.fileAttrs = "Application POP";
    }
    else if (this.currentStatus == "Relaxation Pending") {
      this.fileAttrs = "Relaxation POP";
    }
    else {

    }
    this.fileAttrs = "Application POP";
    this.modalService.open(UploadProof, { centered: true, size: 'xl' });
  }

  isPopDocumentInList(): boolean {
    const expectedDocName = `Application POP_appID${this.ApplicationID}.pdf`;
    return this.financialDocumentList.some(doc => doc.FinancialDocumentName === expectedDocName);
  }
  getAllFinancialDocuments() {
    if (this.isWayleave) {
      this.financialService.getFinancialByApplicationID(this.ApplicationID).subscribe((data: any) => {

        if (data.responseCode == 1) {
          for (let i = 0; i < data.dateSet.length; i++) {
            const current = data.dateSet[i];
            const tempDoc = {} as FinancialDocumentList;

            tempDoc.FinancialID = current.financialID;
            tempDoc.FinancialName = current.financialName;
            tempDoc.FinancialDocumentName = current.documentName;
            tempDoc.FinancialDocumentLocalPath = current.documentLocalPath;
            tempDoc.FinancialType = current.financialType;
            tempDoc.ApplicationID = current.applicationID;
            tempDoc.CreatedById = current.createdById;

            this.financialDocumentList.push(tempDoc);
          }
          this.dataSource = this.financialDocumentList;
          this.financialsTable?.renderRows();

        }
        else {
          alert(data.responseMessage);
        }
        console.log("BPFinancials ", this.dataSource);
      }, error => {
        console.log(error);
      })
    }
    
    else {
      this.bpFinancialService.getFinancialByApplicationID(this.ApplicationID).subscribe((data: any) => {

        if (data.responseCode == 1) {
          for (let i = 0; i < data.dateSet.length; i++) {
            const current = data.dateSet[i];
            const tempDoc = {} as FinancialDocumentList;

            tempDoc.FinancialID = current.financialID;
            tempDoc.FinancialName = current.financialName;
            tempDoc.FinancialDocumentName = current.documentName;
            tempDoc.FinancialDocumentLocalPath = current.documentLocalPath;
            tempDoc.FinancialType = current.financialType;
            tempDoc.ApplicationID = current.applicationID;
            tempDoc.CreatedById = current.createdById;

            this.financialDocumentList.push(tempDoc);
          }
          this.dataSource = this.financialDocumentList;
          this.financialsTable?.renderRows();

        }
        else {
          alert(data.responseMessage);
        }
        console.log("BPFinancials ", this.dataSource);
      }, error => {
        console.log(error);
      })
    }
    
  }

  viewDocument(index: any) {
    const filename = this.financialDocumentList[index].FinancialDocumentName;
    const extension = filename.split('.').pop().toLowerCase();

    if (extension === 'png') {
      // If the document is a PNG image, initiate download
      fetch(this.apiUrl + `documentUpload/GetDocument?filename=${filename}`)
        .then(response => {
          if (response.ok) {
            return response.blob();
          } else {
            throw new Error('Error fetching the document');
          }
        })
        .then(blob => {
          // Create a temporary link element to trigger the download
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch(error => {
          console.log(error);
          // Handle the error appropriately
        });
    } else {
      // For other document types, such as PDF, continue to use an iframe
      fetch(this.apiUrl + `documentUpload/GetDocument?filename=${filename}`)
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
          link.download = this.financialDocumentList[index].FinancialDocumentName; // Set the downloaded file name
          link.click();
        })
        .catch(error => {
          console.log(error);
          // Handle the error appropriately
        });
    }
  }
}
