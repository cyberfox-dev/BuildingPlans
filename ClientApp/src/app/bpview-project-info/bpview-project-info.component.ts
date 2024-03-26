import { Component, OnInit,ViewChild } from '@angular/core';
import { BuildingApplicationsService } from 'src/app/service/BuildingApplications/building-applications.service';
import { SharedService } from 'src/app/shared/shared.service';
import { RefreshService } from '../shared/refresh.service';
import { Router } from "@angular/router";
import { DocumentUploadService } from '../service/DocumentUpload/document-upload.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { BPDocumentsUploadsService } from '../service/BPDocumentsUploads/bpdocuments-uploads.service';

export interface DocumentsList {
  DocumentID: number;
  DocumentName: string;
  ApplicationId: number;
  DateCreated: any;
  DateUpdated: any;
  DescriptionForRepoDoc: string;
}





@Component({
  selector: 'app-bpview-project-info',
  templateUrl: './bpview-project-info.component.html',
  styleUrls: ['./bpview-project-info.component.css']
})

export class BPViewProjectInfoComponent implements OnInit {

  constructor(private bpService: BuildingApplicationsService, private sharedService: SharedService, private refreshService: RefreshService, private router: Router, private documentUploadService: DocumentUploadService, private bpDocumentUploadService: BPDocumentsUploadsService,) { }

  DocumentList: DocumentsList[] = [];
  displayedColumns: string[] = ['DocumentName', 'actions'];
  @ViewChild(MatTable) DocumentsTable: MatTable<DocumentsList> | undefined;
  documentsDataSource: MatTableDataSource<DocumentsList> = new MatTableDataSource<DocumentsList>();

  stringifiedData: any;
  CurrentUser: any;

  stringifiedDataUserProfile: any;
  CurrentUserProfile: any;

  //Application Details
  applicationId: any;
  lsNumber: string;
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

  functionalArea: string;
  currentStage: string;

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

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  
  ngOnInit(): void {
    this.refreshService.enableRefreshNavigation('/home');

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);
    debugger;

    this.applicationId = this.sharedService.getApplicationID();
    this.getApplicationInfo();
    this.getAllDocumentForApplication();
  }
  getApplicationInfo() {
    debugger;
    this.bpService.getBuildingApplicationByApplicationID(this.applicationId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        const current = data.dateSet[0];
        debugger;
        this.lsNumber = current.lsNumber;
        this.typeOfDev = current.typeOfDevelopment;
        this.typeOfAddress = current.addressType;
        this.noOfUnits = current.noOfUnits;
        this.unitNumber = current.unitNumber;
        this.propertyValue = current.propertyValue;
        this.erfNumber = current.erfNumber;
        this.portionNumber = current.portionNumber;
        this.premisesName = current.premisesName;
        this.propertyDescription = current.propertyDescription;
        this.occupationClassification = current.occupationClassification;
        this.buildingPlanFor = current.buildingPlanFor;
        this.latitude = current.latitude;
        this.longitude = current.longitude;
        this.sGCode = current.sgCode;
        this.physicalAddress = current.physicalAddress;
        this.functionalArea = "Building Plan";
        this.currentStage = current.stage;

        //owner details
        this.firstName = current.firstName;
        this.surname = current.surname;
        this.cellNo = current.cellNumber;
        this.altCellNo = current.altCellNumber;
        this.email = current.emailAddress;
        this.altEmail = current.altEmail;
        this.idNumber = current.idNumber;
      }
      else {
        alert(data.responseMessage);
      }
      console.log("response", data);
    }, error => {
      console.log("Error: ", error);
    })
  }
  getAllDocumentForApplication() {
    debugger;
    this.bpDocumentUploadService.getAllDocumentsForApplication(this.applicationId).subscribe((data: any) => {
      debugger;
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDocList = {} as DocumentsList;
          const current = data.dateSet[i];

          tempDocList.DocumentID = current.documentID;
          tempDocList.DocumentName = current.documentName;
          tempDocList.ApplicationId = current.applicationID;
          tempDocList.DescriptionForRepoDoc = current.description;
          tempDocList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
          tempDocList.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));

          this.DocumentList.push(tempDocList);
        }
        this.documentsDataSource.data = this.DocumentList;
        
      }
      else {
        alert(data.responseMessage);
      }
      console.log("response", data);
    }, error => {
      console.log("Error: ", error);
    })
   
  }
  viewDocument(index: any) {

    // Make an HTTP GET request to fetch the document
    debugger;
    fetch(this.apiUrl + `bPDocumentUploads/GetDocument?filename=${this.DocumentList[index].DocumentName}`)
    
      .then(response => {
        debugger;
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
        link.download = this.DocumentList[index].DocumentName; // Set the downloaded file name
        link.click();
      })
      .catch(error => {
        console.log(error);
        // Handle the error appropriately
      });

  }

 

  }

