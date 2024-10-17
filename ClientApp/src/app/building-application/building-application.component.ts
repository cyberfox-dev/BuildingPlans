import { Component, ComponentFactoryResolver, ComponentRef, ElementRef, Injector, OnInit, ViewChild, ViewContainerRef, Injectable, Input } from '@angular/core';
import { BuildingApplicationsService } from 'src/app/service/BuildingApplications/building-applications.service';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { SharedService } from "src/app/shared/shared.service"
import { UserProfileService } from 'src/app/service/UserProfile/user-profile.service';
import { Subscription, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from 'src/app/login/login.component';
import { MatSelect } from '@angular/material/select';
import { UserService } from '../service/User/user.service';
import { NewProfileComponent } from '../new-user/new-profile/new-profile.component';
import { LatLngBoundsLiteral } from 'ngx-google-places-autocomplete/objects/latLng';
import { FormsModule } from '@angular/forms'; 
import { post } from 'jquery';
import { ConfigService } from 'src/app/service/Config/config.service';
import { BPManDocService } from 'src/app/service/BPManDoc/bpman-doc.service';
import { Observable, empty, map } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
//import { valid } from 'esri/widgets/FeatureForm/InputField';
import { BPAddressTypesService } from '../service/BpAddressTypes/bpaddress-types.service';
import { OccupationClassificationService } from '../service/OccupationClassification/occupation-classification.service';
import { MatSelectChange } from '@angular/material/select';
import { GoogleMapsComponentComponent } from '../create-new-wayleave/google-maps-component/google-maps-component.component';
import { RefreshService } from '../shared/refresh.service';
import { BPNotificationsService } from '../service/BPNotifications/bpnotifications.service';
import { MatTable } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarAlertsComponent } from '../snack-bar-alerts/snack-bar-alerts.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { BPFinancialService } from '../service/BPfinancial/bpfinancial.service';
import { BPApplicationChecklistService } from '../service/BPApplicationChecklists/bpapplication-checklist.service';
import { BPStagesChecklistsService } from '../service/BPStagesChecklists/bpstages-checklists.service'
export interface ApplicaitionList {
  ApplicationID: number;
  LSNumber: string;
  OwnerFullName: string;
  TypeOfDevelopment: string;
  PropertyDescription: string;
  StreetAddress: string;
  CellNumber: string;
  TypeOfDevelopmentDescription: string;
  EmailAddress: string;
}
export interface ARCGISAPIData {
  createdByID: string;
  isActive: string;
  applicationID: number;
}

export interface BPMandatoryDocumentUploadList {
  mandatoryDocumentID: number;
  mandatoryDocumentName: string;
  stageID: number;
  dateCreated: any;
}

export interface MandatoryDocumentsLinkedStagesList {
  mandatoryDocumentStageLinkID: number;
  mandatoryDocumentID: number;
  mandatoryDocumentName: string;
  stageID: number;
  stageName: string;
  dateCreated: any;
  uploads: Array<{ filename: string; /*... other properties*/ }>;
}

export interface AddressTypesList {
  AddressTypeID: number;
  TypeName: string;
  DateCreated: any;
  DateUpdated: any;
  CreatedById: string;

}

export interface OccupationClassifications {
  ClassificationID: number;
  ClassificationName: string;
  DateCreated: any;
  DateUpdated: any;
  CreatedById: string;
  Occupancy: string;
  OccupancyDescription: string;
  FunctionalArea: string;

}
export interface FileDocument {

  fileName: string;
  file: any;

}

@Component({
  selector: 'app-building-application',
  templateUrl: './building-application.component.html',
  styleUrls: ['./building-application.component.css']
})
export class BuildingApplicationComponent implements OnInit {

  applicationsList: ApplicaitionList[] = [];
  ARCGISAPIData = {} as ARCGISAPIData;
  stringifiedData: any;
  value: string;
  CurrentUser: any;
  CurrentUserProfile: any;
  clientInfo: any
  stringifiedDataUserProfile: any;
  option: string;
  applicationID: number ;
  lSNumber: string ="";
  
  ownerFullName: string;
  typeOfDevelopment: string;
  typeOfDevelopmentDescription: string;
  streetAddress: string;
  suburb: string;
  city: string;
  postalCode: string;
  
  mapAddress: string;
  latitude: string;
  longitude: string;

  clientUserID: string;
  UserID: string;

  

  //Property Details
  premisesName: string;
  propertyDescription: string;
  addressType: string;
  unitNo: string;
  shopNo: string;
  flatNo: string;
  hotelNo: string;
  gpsFarm: string;


  erfNo: string;
  portionNo: string;
  NoOfUnits=1;
  sGCode: string;

  configNumberOfProject: any;
  configMonthYear: any;
  
  totalDocs: number;
  totalDocs2: string;

  //client information
  clientName: string;
  clientSurname: string;
  clientEmail: string;
  clientCell: string;
  clientAltEmail: string;
  clientAltCell: string;
  clientIDNo: string;

  //plan details
  buildingPlansFor: string;
  Classification: string; //DropDown
  totalArea: string;
  planFees: string;
  propertyValue: string;

  //Architect Details
  architectUserID: string;
  architectName: string;
  architectEmail: string;
  architectCell: string;
  architectID: string;
  regNo: string;

  public map: boolean = true;
  isInputDisabled: boolean = false;
 
  currentClient: boolean = false;
 
 
  validPropertyDetails: boolean = false;
  
  validPlan: boolean = false;

  validName: boolean = false;
  validEmail: boolean = false;
  validCell: boolean = false;
  validID: boolean = false;
  validClientInfo: boolean = false;

  validArchitect: boolean = false;
  validArchitectName: boolean = false;
  validArchitectCell: boolean = false;
  validArchitectemail: boolean = false;
  validArchitectId: boolean = false;
  validArchitectReg: boolean = false;

  TPTOA = '';

  BPMandatoryDocumentList: Observable<BPMandatoryDocumentUploadList[]>;

  MandatoryDocumentsLinkedStagesList = new BehaviorSubject<MandatoryDocumentsLinkedStagesList[]>([]);
  
  FileDocument: FileDocument[] = [];
  fileAttrs: string[] = [];
  addressTypesList: AddressTypesList[] = [];
  occupationClassificationList: OccupationClassifications[] = [];

  
  isLoading = false;
  public successfulUploads = 0;
  public successfulUploads2 = '';
  selectedItemIndex: number = -1;

  isInternal: boolean = false;
  isExternal: boolean = false;
  isArchitect: boolean = false;
  isOwner: boolean = false;
  isArchivePlan: boolean;
  applicationBeingCreatedType: string;
  applicationBeingCreatedTypeNextStage: string;
  servitudeBox: boolean = false;

  @ViewChild("selectClassification", { static: true }) content!: ElementRef;
  @ViewChild(MatTable) classificationTable: MatTable<OccupationClassifications> | undefined;
  displayedColumn:string[]=['OccupationName','Desription',"actions"]
  dataSource = this.occupationClassificationList;
    TPTOA2: string;
  indi: boolean = false;
    company: boolean = false;

  constructor(
    private applicationService: BuildingApplicationsService,
    private router: Router,
    private forms: FormsModule,
    private configService: ConfigService,
    private userService: UserProfileService,
    private sharedService: SharedService,
    private bpManDocService: BPManDocService,
    private bpAddressTypesService: BPAddressTypesService,
    private classificationService: OccupationClassificationService,
    private mapComponent: GoogleMapsComponentComponent,
    private refreshService: RefreshService,
    private _snackBar: MatSnackBar,
    private financialService: BPFinancialService,
    private bpNotificationService: BPNotificationsService,
    private modalService: NgbModal, private http: HttpClient,
    private bpApplicationChecklistService: BPApplicationChecklistService,
    private bpChecklistService: BPStagesChecklistsService
  ) {
    
}

  ngOnInit(): void {
    this.refreshService.enableRefreshNavigation('/home');
    this.isArchivePlan = this.sharedService.isPlanArchive;
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);

    this.applicationBeingCreatedType = this.sharedService.getApplicationBeingCreatedType();

    this.option = this.sharedService.option;
    this.clientUserID = this.sharedService.clientUserID;
    this.architectUserID = this.sharedService.architectUserID;
    this.getBPDocumentsList();
    this.ARCGISAPIData.createdByID = this.CurrentUser.appUserId;
    this.ARCGISAPIData.isActive = "1";
    this.ARCGISAPIData.applicationID = 0;
    this.isArchitect = this.sharedService.getIsArchitect();
    this.GetAllAddressTypes();
    this.GetAllOccupationClassificationsForBuildingPlan();
    this.applicationID = this.sharedService.getApplicationID();
    this.GetClientInfo();
    
  }

  openClassification() {
    this.modalService.open(this.content, { centered: true, size: 'xl' });
  }
  
  trackByFn(index, item) {
    return item.mandatoryDocumentID; // or any unique id from the object
  }

  onPassFileName(event: { uploadFor: string; fileName: string }, index: any) {
    
    const { uploadFor, fileName } = event;
    // const index = parseInt(uploadFor.substring('CoverLetter'.length));
    
   
    this.fileAttrs[index] = this.BPMandatoryDocumentList[index].mandatoryDocumentName;
    
  }

  onFileDelete(event: any, index: number) {
    this.successfulUploads--;
    this.successfulUploads2 = Number(this.successfulUploads).toString();
    this.fileAttrs[index] = this.MandatoryDocumentsLinkedStagesList[index].mandatoryDocumentName;


  }
  
  onFileUpload(event: any) {

    this.successfulUploads++;
    this.successfulUploads2 = Number(this.successfulUploads).toString();
    console.log("this.successfulUploads;this.successfulUploads", this.successfulUploads);
  }

  addUploader2(index: number) {
    // Handle the logic for adding a new upload here
    this.selectedItemIndex = index;
  }

  @ViewChild('fileInput')
  fileInput!: ElementRef;
  CoverLetterChooseFileText = 'Choose File';


  uploadFileEvt(File: any) {

    const tempFileDocumentList = {} as FileDocument;

    tempFileDocumentList.fileName = File.target.files[0].name;
    tempFileDocumentList.file = File.target.files[0];
    this.CoverLetterChooseFileText += File.target.files[0].name + ' - ';

    this.FileDocument.push(tempFileDocumentList);
    console.log("this.FileDocument", this.FileDocument);
  }
  text: string = '';
  checked = false;
  maxLength: number = 250;
  DescriptionofApplicaitonTP = '';
  updateCharacterCount() {
    return this.text.length;
  }
  uploadFileEvtCoverLetter(File: any) {

    const tempFileDocumentList = {} as FileDocument;

    tempFileDocumentList.fileName = File.target.files[0].name;
    tempFileDocumentList.file = File.target.files[0];


    this.FileDocument.push(tempFileDocumentList);
    console.log("this.FileDocument", this.FileDocument);


    // Check if one or more files were selected
    if (File.target.files.length > 0) {
      // Reset the fileAttr property
      this.CoverLetterChooseFileText = '';
      // Iterate over the selected files
      Array.from(File.target.files).forEach((file: any) => {
        // Create a new File object
        let fileObject = new File([file], file.name);
        // Concatenate the file names and add a separator
        this.CoverLetterChooseFileText += file.name + ' - ';
        // Create a new FileReader object
        let reader = new FileReader();
        // Set the onload event handler 
        reader.onload = (e: any) => {
          // Create a Byte[] array from the file contents
          let fileBytes = new Uint8Array(e.target.result);
          console.log("fileBytes", fileBytes);
        };
        // Start reading the file as an ArrayBuffer
        reader.readAsArrayBuffer(fileObject);

        console.log("fileObject", fileObject);
        console.log("reader.readAsArrayBuffer(fileObject)", reader.readAsArrayBuffer(fileObject));

      });
      // Reset the value of the file input element
      this.fileInput.nativeElement.value = '';
    } else {
      // If no file was selected, set fileAttr to the default value
      this.CoverLetterChooseFileText = 'Choose File';
    }
  }

  addUploader(index: any) {
    let currentList = this.MandatoryDocumentsLinkedStagesList.getValue();
    let current = currentList[index];
    
    // Extract base name without number at the end
    let baseName = current.mandatoryDocumentName.replace(/(\d+)$/, "");

    let currentNumber = 1; // Start with appending 1
    let newName = baseName + currentNumber;
    
    while (currentList.some(doc => doc.mandatoryDocumentName === newName)) {
      currentNumber++;
      newName = baseName + currentNumber;
    }

    let newObject = { ...current, mandatoryDocumentName: newName };

    // Insert newObject directly after the current one
    currentList.splice(index + 1, 0, newObject);

    // Update the BehaviorSubject with the modified list
    this.MandatoryDocumentsLinkedStagesList.next(currentList);

    // Call updateMandatoryDocumentsLinkedStagesList function with the updated list
    this.updateMandatoryDocumentsLinkedStagesList(currentList);
  }

  CheckOwnerInfo() {
    this.validClientInfo = false;
    const nameRegex = /^[a-zA-Z]+$/;
    const cellRegex = /^[0-9]+$/;
    const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (this.clientName == undefined || this.clientName.trim() == "" ||
      this.clientSurname == undefined || this.clientSurname.trim() == "" ||
      this.clientEmail == undefined || this.clientEmail.trim() == "" ||
      this.clientCell == undefined || this.clientCell.trim() == "" ||
      this.clientIDNo == undefined || this.clientIDNo.trim() == "") {

      alert("Please fill in all required fields")
    }
    else {
      let name = this.clientName;
      let surname = this.clientSurname;
      let email = this.clientEmail;
      let cellNo = this.clientCell;
      let ID = this.clientIDNo;

      if (nameRegex.test(name)) {
        if (nameRegex.test(surname)) {
          this.validName = true;
        }

        else {
          alert("Invalid Surname. Please enter a single Surname with letters only");
          this.validName = false;
        }

      } else {
        alert("Invalid Name. Please enter a single name with letters only");
        this.validName = false;
      }

      if (emailRegex.test(email)) {
        this.validEmail = true;
      }
      else {
        alert("Invalid Email. Please enter a valid email address");
        this.validEmail = false;

      }

      if (cellRegex.test(cellNo) && cellNo.length == 10) {
        this.validCell = true
      }
      else {
        alert("Invalid Cell Number. Please enter a 10 digit cellphone number");
        this.validCell = false;
      }
      if (cellRegex.test(ID) && ID.length == 13) {
        this.validID = true;
      }
      else {
        alert("Invalid ID Number. Please enter a 13 digit ID Number");
        this.validID = false;
      }

      if (this.clientAltCell != undefined && this.clientAltCell.trim() != "") {
        if (cellRegex.test(this.clientAltCell) == false && this.clientAltCell.length != 10) {
          alert("Invalid altername Cell number. Please enter a valid alternate cellphone number ");
          this.validCell = false;
        }
      }

      if (this.clientAltEmail != undefined && this.clientAltEmail.trim() != "") {
        if (emailRegex.test(this.clientAltEmail) == false) {
          alert("Invalid altername email address. Please enter a valid alternate email address");
          this.validEmail = false;
        }
      }

      if (this.validName && this.validCell && this.validID && this.validEmail) {
        this.validClientInfo = true;
      }
      else {
        alert("Please fill in all information correctly");
        this.validClientInfo = false;
      }
    }
  }

  

  
  buildProjectNumber() {
    
    

    
    if (this.lSNumber == "") {
      
      this.configService.getConfigsByConfigName("ProjectNumberTracker").subscribe((data: any) => {
        if (data.responseCode == 1) {


          const current = data.dateSet[0];
          this.configNumberOfProject = current.utilitySlot1;
          const configId = current.configID;

          this.getMonthYear();

          this.configService.addUpdateConfig(configId, "ProjectNumberTracker", null, (Number(this.configNumberOfProject) + 1).toString(), this.configMonthYear, null, null).subscribe((data: any) => {
            if (data.responseCode == 1) {
              this.lSNumber = "LS:" + (Number(this.configNumberOfProject) + 1).toString() + "/" + this.configMonthYear;
              
              this.AddUpdateBuildingApplication();
            }
            else {
              //alert("Invalid Email or Password");
              alert(data.responseMessage);
            }
            console.log("addUpdateConfigReponse", data);

          }, error => {
            console.log("addUpdateConfigError: ", error);
          })



        }
        else {
          //alert("Invalid Email or Password");
          alert(data.responseMessage);
        }
        console.log("getConfigsByConfigNameReponse", data);

      }, error => {
        console.log("getConfigsByConfigNameError: ", error);
      })
    }
  }
  getMonthYear() {
    const currentDate = new Date();


    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();


    this.configMonthYear = (currentMonth + 1).toString().padStart(2, '0') + '/' + currentYear.toString().slice(-2);


    console.log(this.configMonthYear);
  }
  getDocsForApplication() {
    this.BPMandatoryDocumentList = this.getBPDocumentsList();

    this.BPMandatoryDocumentList.subscribe(data => console.log(data));
    console.log("BPMandatory Documents",  this.BPMandatoryDocumentList);
  }
    
  getBPDocumentsList(): Observable<BPMandatoryDocumentUploadList[]> {
    debugger;
    if (this.typeOfDevelopment == "Commercial") {
      return this.bpManDocService.getAllMandatoryDocuments()
        .pipe(
          map((data: any) => {

            if (data.responseCode === 1) {

              const tempList: BPMandatoryDocumentUploadList[] = [];
              for (let i = 0; i < data.dateSet.length; i++) {

                const current = data.dateSet[i];
                const tempRequiredDocuments: BPMandatoryDocumentUploadList = {
                  mandatoryDocumentID: current.mandatoryDocumentID,
                  mandatoryDocumentName: current.mandatoryDocumentName,
                  stageID: null,
                  dateCreated: current.dateCreated
                };
                tempList.push(tempRequiredDocuments);
                this.totalDocs = tempList.length;
              }

              return tempList;
            } else {
              // Handle the error case here if needed
              throw new Error(data.responseMessage);
            }
          })
        );
    }
    else if (this.typeOfDevelopment == "Domestic") {
      return this.bpManDocService.getAllMandatoryDocuments()
        .pipe(
          map((data: any) => {

            if (data.responseCode === 1) {

              const tempList: BPMandatoryDocumentUploadList[] = [];
              for (let i = 0; i < data.dateSet.length; i++) {

                const current = data.dateSet[i];
                const tempRequiredDocuments: BPMandatoryDocumentUploadList = {
                  mandatoryDocumentID: current.mandatoryDocumentID,
                  mandatoryDocumentName: current.mandatoryDocumentName,
                  stageID: null,
                  dateCreated: current.dateCreated
                };
                if (tempRequiredDocuments.mandatoryDocumentName != "Occupation Certificate") {
                  tempList.push(tempRequiredDocuments);
                }
                
                this.totalDocs = tempList.length;
              }

              return tempList;
            } else {
              // Handle the error case here if needed
              throw new Error(data.responseMessage);
            }
          })
        );
    }
    else{
      return null
    }
    
  }

  updateMandatoryDocumentsLinkedStagesList(list: any[]) {
    
    const newList = list.map(current => {
      const tempMandatoryDocumentsLinkedStagesList = {} as MandatoryDocumentsLinkedStagesList;
      tempMandatoryDocumentsLinkedStagesList.stageID = current.stageID;
      tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentStageLinkID = null;
      tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentID = current.mandatoryDocumentID;
      tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentName = current.mandatoryDocumentName;
      tempMandatoryDocumentsLinkedStagesList.stageName = null;
      tempMandatoryDocumentsLinkedStagesList.dateCreated = current.dateCreated;
      return tempMandatoryDocumentsLinkedStagesList;
    });

    this.MandatoryDocumentsLinkedStagesList.next(newList);
    // set totalDocs to the length of the list
    
    this.totalDocs = newList.length;
    this.totalDocs2 = Number(this.totalDocs).toString();
  }

  deleteUploader(index: number) {
    
    let currentList2 = this.MandatoryDocumentsLinkedStagesList.getValue();
    let current = currentList2[index];

    // Check if there's an uploaded file for the current document
    if (current.mandatoryDocumentName || current.mandatoryDocumentName != undefined || current.mandatoryDocumentName != null) {
      // If a file has been uploaded for this document, show an alert to inform the user
      alert('A file has been uploaded for this document. Please remove the file first before removing.');

    }
    else {
      let currentList = this.MandatoryDocumentsLinkedStagesList.getValue();

      // Remove the item at the given index
      currentList.splice(index, 1);

      // Update the BehaviorSubject with the modified list
      this.MandatoryDocumentsLinkedStagesList.next(currentList);

      // If you're updating some UI or state based on the list change, call the appropriate function
      this.updateMandatoryDocumentsLinkedStagesList(currentList);
    }


  }

  GetAllAddressTypes() {
    
    this.bpAddressTypesService.getAllAddressTypes().subscribe((data: any) => {
      if (data.responseCode == 1) {
        
        for (let i = 0; i < data.dateSet.length; i++) {
          
          const tempAddressType = {} as AddressTypesList;
          const current = data.dateSet[i];

          tempAddressType.AddressTypeID = current.addressTypeID;
          tempAddressType.TypeName = current.typeName;

          this.addressTypesList.push(tempAddressType);
        }

      }
      else {
        alert(data.responseMessage)
      }
    }, error => {
      console.log("AddressTypeError: ", error)

    })
  }
  onCheckAddressType() {
    
    if (this.addressType == "GPS/Farm") {
      
      this.isInputDisabled = true;
    }

    else {
      this.isInputDisabled = false;
    }
  }

  GetAllOccupationClassificationsForBuildingPlan() {
    
    const functionalArea = "Building Plan";

    this.classificationService.getAllClassificationForFunctionalArea(functionalArea).subscribe((data: any) => {
      
      if (data.responseCode == 1) {
        
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempClassification = {} as OccupationClassifications;
          const current = data.dateSet[i];

          tempClassification.ClassificationID = current.OccupationID;
          tempClassification.ClassificationName = current.occupationName;
          tempClassification.Occupancy = current.occupancy;
          tempClassification.OccupancyDescription = current.occupancyDescription;
          tempClassification.DateCreated = current.dateCreated;
          tempClassification.DateUpdated = current.dateUpdated;
          tempClassification.FunctionalArea = current.functionalArea;

          this.occupationClassificationList.push(tempClassification);
        }
     /*   this.classificationTable.renderRows();*/
      }
      else {
        alert(data.responseMessage)
      }
    }, error => {
      console.log("OccupationClassficationError: ", error)
    })
  }

  CheckPropertyDetails() {
    this.mapAddress = this.sharedService.mapAddress;
    this.latitude = this.sharedService.latitude;
    this.longitude = this.sharedService.longitude;
 
    if (this.propertyDescription == undefined || this.propertyDescription.trim() == "" ||
      this.premisesName == undefined || this.premisesName.trim() == "" ||
      this.addressType == undefined || this.erfNo == undefined || this.erfNo.trim() == "" ||
      this.portionNo == undefined || this.portionNo.trim() == "" || this.NoOfUnits == undefined ||
      this.NoOfUnits==0 || this.streetAddress == undefined || this.streetAddress.trim() == "" ||
      this.suburb == undefined || this.suburb.trim() == "" || this.city == undefined || this.city.trim() == ""
      || this.postalCode == undefined || this.postalCode.trim() == "" || this.sGCode == undefined ||
      this.sGCode.trim() == "" || this.mapAddress == undefined || this.latitude == undefined
      || this.longitude == undefined) {


      alert("Please fill in all required fields")
    }
    else {
      let streetAddress = this.streetAddress;
      if (this.sGCode.length != 21) {
        alert("Invalid SG Code . SG Code length must be 21 ");
      }
      else {
        this.validPropertyDetails = true;
      }
     

    }
  }

  CheckArchitectDetails() {
    const nameRegex = /^[a-zA-Z]+$/;
    const cellRegex = /^[0-9]+$/;
    const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (this.architectName == undefined || this.architectName.trim() == "" ||
      this.architectEmail == undefined || this.architectEmail.trim() == "" ||
      this.architectCell == undefined || this.architectCell.trim() == "" ||
      this.architectID == undefined || this.architectID.trim() == "" ||
      this.regNo == undefined || this.regNo.trim() == "") {

      alert("Please fill in all required fields")
    }
    else {
      const nameCheck:string[] = this.architectName.split(" ");

      if (nameRegex.test(this.architectName) == false && nameCheck.length !== 2) {
        alert("Invalid Architect Name. Please ensure that you have entered name and surname containing letters only")
      }
      else {
        this.validArchitectName = true;
      }

      if (emailRegex.test(this.architectEmail) == false) {
        alert("Invalid email entered");
      }
      else {
        this.validArchitectemail = true;
      }

      if (cellRegex.test(this.architectCell) == false) {
        alert("Invalid Cellphone number. Please ensure you enter a 10 digit cellphone number");
      }
      else {
        this.validArchitectCell = true;
      }
      if (cellRegex.test(this.architectID) == false && this.architectID.length !== 13) {
        alert("Invalid ID number. Enter a 13 digit ID Number");
      }
      else {
        this.validArchitectId = true;
      }
      //Architect reg number to be validated
      if (this.validArchitectName && this.validArchitectemail && this.validArchitectCell && this.validArchitectId && this.validArchitectReg) {
        this.validArchitect = true;
      }
      else {
        alert("Please check that information is entered correctly");
      }
      
    }
  }
  CheckPlanDetails() {
    if (this.buildingPlansFor == undefined || this.buildingPlansFor.trim() == "" ||
      this.typeOfDevelopment == undefined || this.typeOfDevelopment.trim() == "" ||
      this.totalArea == undefined || this.totalArea.trim() == "" ||
      this.Classification == undefined || this.propertyValue == undefined ||
      this.propertyValue.trim() == "") {

      alert("Please fill in all required fields");
    }
    else{

    }
  }

  GetClientInfo() {
    
    if (this.CurrentUserProfile[0].isInternal == true) {
      
      this.isInternal = true;
      this.clientUserID = this.sharedService.clientUserID;
      this.userService.getUserProfileById(this.clientUserID).subscribe((data: any) => {
        if (data.responseCode == 1) {
          
          const current = data.dateSet[0];
         
          if (current.isArchitect == true) {
            this.architectName = current.fullName;
            this.architectEmail = current.email;
            this.architectCell = current.phoneNumber;
            this.architectID = current.idNumber;
          }
          else {
            this.clientName = current.fullName.substring(0, current.fullName.indexOf(" "));
            this.clientSurname = current.fullName.substring(current.fullName.indexOf(" "));
            this.clientEmail = current.email;
            this.clientAltEmail = current.alternateEmail;
            this.clientCell = current.phoneNumber;
            this.clientIDNo = current.idNumber;
          }

        }
        else {
          alert(data.responseMessage)
        }
      }, error => {
        console.log("ClientInfoError: ", error)
      })
    }
    else {
      this.isExternal = true;
      
     

      if (this.isArchitect == true && this.option == "client") {
       
        this.userService.getUserProfileById(this.clientUserID).subscribe((data: any) => {
          if (data.responseCode == 1) {
            
            const current = data.dateSet[0];
            const currentUser = this.CurrentUserProfile[0];

            this.clientName = current.fullName.substring(0, current.fullName.indexOf(" "));
            this.clientSurname = current.fullName.substring(current.fullName.indexOf(" "));
            this.clientEmail = current.email;
            this.clientAltEmail = current.alternateEmail;
            this.clientCell = current.phoneNumber;
            this.clientIDNo = current.idNumber;

            this.architectName = currentUser.fullName;
            this.architectEmail = currentUser.email;
            this.architectCell = currentUser.phoneNumber;
            this.architectID = currentUser.idNumber;
            
          }
          else {
            alert(data.responseMessage)
          }
        }, error => {
          console.log("ClientInfoError: ", error)
        })

      }
    
      else if (this.isArchitect == true && this.option != "client") {
        const current = this.CurrentUserProfile[0];
        
        this.clientName = current.fullName.substring(0, current.fullName.indexOf(" "));
        this.clientSurname = current.fullName.substring(current.fullName.indexOf(" "));
        this.clientEmail = current.email;
        this.clientAltEmail = current.alternateEmail;
        this.clientCell = current.phoneNumber;
        this.clientIDNo = current.idNumber;

        this.architectName = current.fullName;
        this.architectEmail = current.email;
        this.architectCell = current.phoneNumber;
        this.architectID = current.idNumber;
       
        
      }
      else {
        
        const current = this.CurrentUserProfile[0];

        this.clientName = current.fullName.substring(0, current.fullName.indexOf(" "));
        this.clientSurname = current.fullName.substring(current.fullName.indexOf(" "));
        this.clientEmail = current.email;
        this.clientAltEmail = current.alternateEmail;
        this.clientCell = current.phoneNumber;
        this.clientIDNo = current.idNumber;


        /*THIS IS FOR THE ARCHITECT SELECTION*/
        this.userService.getUserProfileById(this.architectUserID).subscribe((data: any) => {
          if (data.responseCode == 1) {
            const tempUser = data.dateSet[0];
            this.architectName = tempUser.fullName;
            this.architectEmail = tempUser.email;
            this.architectCell = tempUser.phoneNumber;
            this.architectID = tempUser.idNumber;

          }
          else {
            alert(data.responseMessage)
          }
        }, error => {
          console.log("ClientInfoError: ", error)

        }) 
       
      }
    }
  }

  TPTOAOther: any;
  isCombinedApplication: any;
  isCombined: boolean;
  NameOfCompany: any;
  RegNoOfCompany: any;
  AgentName: any;
  AgentAddress: any;
  AgentCell: any;
  AgentEmail: any;
/*  TPSupportingDocs: any;*/
  AddUpdateBuildingApplication() {
    this.mapAddress = this.sharedService.mapAddress;
    this.latitude = this.sharedService.latitude.toString();
    this.longitude = this.sharedService.longitude.toString();
    debugger;

    if (this.TPTOA == "other") {
      this.TPTOA = "Other: " + this.TPTOAOther;
    }
    if (this.isCombinedApplication == 'true') {
      this.isCombined = true;
    }
    else if (this.isCombinedApplication == 'false') {
      this.isCombined = false;
    }
   

    if (this.isArchivePlan) {
      this.router.navigate(["/home"]);
    }
    else {
      debugger;
      if (this.applicationBeingCreatedType == "Town Planning") {
        this.applicationService.addUpdateBuildingApplication(this.applicationID, this.lSNumber, this.clientUserID, this.clientName, this.clientSurname,
          this.clientEmail, this.clientCell, this.architectEmail, this.architectCell, this.clientIDNo, this.propertyDescription, this.premisesName,
          this.addressType, this.erfNo, this.portionNo, this.NoOfUnits.toString(), this.unitNo, this.mapAddress, this.latitude, this.longitude, this.architectName,
          this.architectUserID, this.buildingPlansFor, this.typeOfDevelopment, this.totalArea, this.Classification, this.planFees, this.propertyValue,
          this.streetAddress, this.suburb, this.city, this.postalCode, this.sGCode, this.CurrentUser.appUserId, "Unpaid(Pending)", "TP Review", 1, this.servitudeBox, null, this.applicationBeingCreatedType, this.TPTOA, this.isCombined, this.NameOfCompany, this.RegNoOfCompany, this.AgentName, this.AgentCell, this.AgentEmail, this.AgentAddress, this.DescriptionofApplicaitonTP, "").subscribe((data: any) => {
            if (data.responseCode == 1) {
              this.generateTPApplicationFeeInvoice();
              this.AddChecklistForApplication("TP Review");
              this.modalService.dismissAll();
              this.openSnackBar("Application Created");
              this.router.navigate(["/home"]);
            }
            else {
              alert(data.responseMessage)
            }
          }, error => {
            console.log("BuildingApplicationError: ", error)
          })
      }
      else if (this.applicationBeingCreatedType == "Building Plan") {


        this.configService.getConfigsByConfigName("BPApplicationIDTracker").subscribe((data: any) => {
          if (data.responseCode == 1) {

            const current = data.dateSet[0];
            this.configNumberOfProject = current.utilitySlot1;
            this.configMonthYear = current.utilitySlot2;
            this.configService.addUpdateConfig(current.configID, null, null, (Number(this.configNumberOfProject) + 1).toString(), null, null, null).subscribe((data: any) => {
              if (data.responseCode == 1) {
                this.applicationService.addUpdateBuildingApplication(this.applicationID, this.lSNumber, this.clientUserID, this.clientName, this.clientSurname,
                  this.clientEmail, this.clientCell, this.architectEmail, this.architectCell, this.clientIDNo, this.propertyDescription, this.premisesName,
                  this.addressType, this.erfNo, this.portionNo, this.NoOfUnits.toString(), this.unitNo, this.mapAddress, this.latitude, this.longitude, this.architectName,
                  this.architectUserID, this.buildingPlansFor, this.typeOfDevelopment, this.totalArea, this.Classification, this.planFees, this.propertyValue,
                  this.streetAddress, this.suburb, this.city, this.postalCode, this.sGCode, this.CurrentUser.appUserId, "BCO Distribution", "BCO Distribution", 3, null, "BP:" + (Number(this.configNumberOfProject) + 1).toString() + "/" + this.configMonthYear, this.applicationBeingCreatedType, this.TPTOA, this.isCombined, this.NameOfCompany, this.RegNoOfCompany, this.AgentName, this.AgentCell, this.AgentEmail, this.AgentAddress, this.DescriptionofApplicaitonTP, "").subscribe((data: any) => {
                    if (data.responseCode == 1) {
                      this.modalService.dismissAll();
                      this.openSnackBar("Application Created");
                      this.router.navigate(["/home"]);
                    }
                    else {
                      alert(data.responseMessage)
                    }
                  }, error => {
                    console.log("BuildingApplicationError: ", error)
                  })
              }
              else {

                alert(data.responseMessage);
              }
              console.log("addUpdateConfigReponse", data);

            }, error => {
              console.log("addUpdateConfigError: ", error);
            })

          }
          else {
            alert(data.responseMessage);
          }
          console.log("getConfigsByConfigNameReponse", data);

        }, error => {
          console.log("getConfigsByConfigNameError: ", error);
        })
      }
      else if (this.applicationBeingCreatedType == "Land Survey") {
        debugger;
        this.applicationService.addUpdateBuildingApplication(this.applicationID, this.lSNumber, this.clientUserID, this.clientName, this.clientSurname,
          this.clientEmail, this.clientCell, this.architectEmail, this.architectCell, this.clientIDNo, this.propertyDescription, this.premisesName,
          this.addressType, this.erfNo, this.portionNo, this.NoOfUnits.toString(), this.unitNo, this.mapAddress, this.latitude, this.longitude, this.architectName,
          this.architectUserID, this.buildingPlansFor, this.typeOfDevelopment, this.totalArea, this.Classification, this.planFees, this.propertyValue,
          this.streetAddress, this.suburb, this.city, this.postalCode, this.sGCode, this.CurrentUser.appUserId, "Unpaid(Pending)", "LS Review", 1, this.servitudeBox, null, this.applicationBeingCreatedType, this.TPTOA, this.isCombined, this.NameOfCompany, this.RegNoOfCompany, this.AgentName, this.AgentCell, this.AgentEmail, this.AgentAddress, this.DescriptionofApplicaitonTP, "").subscribe((data: any) => {
            if (data.responseCode == 1) {
              this.modalService.dismissAll();
              this.generateLSApplicationFeeInvoice();
              this.AddChecklistForApplication("LS Review");
              this.openSnackBar("Application Created");
              this.router.navigate(["/home"]);
            }
            else {
              alert(data.responseMessage)
            }
          }, error => {
            console.log("BuildingApplicationError: ", error)
          })
      }
     
      }
  }

  generateTPApplicationFeeInvoice() {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Load the logo image (adjusted size)
    const img = new Image();
    img.src = 'assets/Msunduzi_CoA.png'; // Adjust this path to the correct location of your logo
    doc.addImage(img, 'png', 10, 10, 25, 40); // Adjusted size of the logo (40x30 mm)

    // Set font configuration
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    // Add static header information
    doc.text('Msunduzi Municipality', 200, 20, { align: 'right' });
    doc.text('341 Church Street', 200, 26, { align: 'right' });
    doc.text('Pietermaritzburg, 3201', 200, 32, { align: 'right' });
    doc.text('Phone: (033) 392-3000', 200, 38, { align: 'right' });

    // Add a static website link
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 88, 112);
    doc.textWithLink('https://www.msunduzi.gov.za', 200, 45, { align: 'right' });

    // Add static reference number and date
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text('Reference Number: TP:00/09/24', 200, 55, { align: 'right' });
    doc.text('DATE: 15/09/2024', 10, 60, { align: 'left' });

    // Add a project description
    doc.text('INVOICE FOR TOWN PLANNING APPLICATION FEE', 10, 70, { align: 'left' });

    // Greeting (static)
    doc.text('Dear Applicant,', 10, 80, { align: 'left' });

    // Invoice description
    doc.text('Below are the details of the Town Planning Application fees:', 10, 90, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });

    // Add static table data (dummy services and costs)
    const data = [
      ['TP001', 'Rezoning Application Fee', 'R10 000.00'],
      ['TP002', 'Site Development Plan Fee', 'R5 000.00'],
      ['TP003', 'Environmental Impact Assessment', 'R5 000.00'],
    ];

    // Render the table in the PDF document
    autoTable(doc, {
      head: [['Item Code', 'Description', 'Amount']],
      body: data,
      startY: 100, // Adjusted position of the table
      headStyles: { fillColor: '#005870' },
      styles: {
        fontSize: 10, // Adjusted font size for better readability
        halign: 'left',
        valign: 'middle',
      },
      columnStyles: {
        0: { cellWidth: 40, fontStyle: 'bold' },
        1: { cellWidth: 90 },
        2: { cellWidth: 40, halign: 'right' }, // Align the amounts to the right
      },
    });

    // Add a total section below the table
    doc.text('TOTAL: R20 000.00', 200, 150, { align: 'right' });

    // Disclaimer
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.text(
      "Disclaimer: This invoice is for application fees and is due within 30 days. For any queries, please contact us at (033) 392-3000.",
      10, 160, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' }
    );

    // Footer with company name
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Msunduzi Municipality', 10, 270, { align: 'left' });
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for your application!', 10, 280, { align: 'left' });

    // Convert the PDF document to a blob object and prepare it for upload
    const pdfData = doc.output('blob');
    const file = new File([pdfData], 'Town_Planning_Application_Fee_Invoice.pdf', { type: 'application/pdf' });

    // Prepare the form data and push the file for temporary upload
    const formData = new FormData();
    formData.append('file', file);
    this.sharedService.pushFileForTempFileUpload(file, "Town Planning Application Fee Invoice" + ".pdf");

    this.saveBP(); // Call the save method for any additional operations

    // window.open(pdfUrl, '_blank')

    // this.router.navigate(["/home"]);

  }
  generateLSApplicationFeeInvoice() {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Load the logo image (adjusted size)
    const img = new Image();
    img.src = 'assets/Msunduzi_CoA.png'; // Adjust this path to the correct location of your logo
    doc.addImage(img, 'png', 10, 10, 25, 40); // Adjusted size of the logo (40x30 mm)

    // Set font configuration
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    // Add static header information
    doc.text('Msunduzi Municipality', 200, 20, { align: 'right' });
    doc.text('341 Church Street', 200, 26, { align: 'right' });
    doc.text('Pietermaritzburg, 3201', 200, 32, { align: 'right' });
    doc.text('Phone: (033) 392-3000', 200, 38, { align: 'right' });

    // Add a static website link
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 88, 112);
    doc.textWithLink('https://www.msunduzi.gov.za', 200, 45, { align: 'right' });

    // Add static reference number and date
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text('Reference Number: LS:00/09/24', 200, 55, { align: 'right' });
    doc.text('DATE: 15/09/2024', 10, 60, { align: 'left' });

    // Add a project description
    doc.text('INVOICE FOR APPLICATION FEE', 10, 70, { align: 'left' });

    // Greeting (static)
    doc.text('Dear Applicant,', 10, 80, { align: 'left' });

    // Invoice description
    doc.text('Below are the details of the Application fees:', 10, 90, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });

    // Add static table data (dummy services and costs)
    const data = [
      ['TP001', 'Rezoning Application Fee', 'R10 000.00'],
      ['TP002', 'Site Development Plan Fee', 'R5 000.00'],
      ['TP003', 'Environmental Impact Assessment', 'R5 000.00'],
    ];

    // Render the table in the PDF document
    autoTable(doc, {
      head: [['Item Code', 'Description', 'Amount']],
      body: data,
      startY: 100, // Adjusted position of the table
      headStyles: { fillColor: '#005870' },
      styles: {
        fontSize: 10, // Adjusted font size for better readability
        halign: 'left',
        valign: 'middle',
      },
      columnStyles: {
        0: { cellWidth: 40, fontStyle: 'bold' },
        1: { cellWidth: 90 },
        2: { cellWidth: 40, halign: 'right' }, // Align the amounts to the right
      },
    });

    // Add a total section below the table
    doc.text('TOTAL: R20 000.00', 200, 150, { align: 'right' });

    // Disclaimer
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.text(
      "Disclaimer: This invoice is for application fees and is due within 30 days. For any queries, please contact us at (033) 000-0000.",
      10, 160, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' }
    );

    // Footer with company name
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Msunduzi Municipality', 10, 270, { align: 'left' });
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for your application!', 10, 280, { align: 'left' });

    // Convert the PDF document to a blob object and prepare it for upload
    const pdfData = doc.output('blob');
    const file = new File([pdfData], 'Land_Survey_Application_Fee_Invoice.pdf', { type: 'application/pdf' });

    // Prepare the form data and push the file for temporary upload
    const formData = new FormData();
    formData.append('file', file);
    this.sharedService.pushFileForTempFileUpload(file, "Land Survey Application Fee Invoice" + ".pdf");

    this.saveBP(); // Call the save method for any additional operations

    // window.open(pdfUrl, '_blank')

    // this.router.navigate(["/home"]);

  }


  typeOfApplicationOtherDes: boolean = false;
  TypeOfApplicationDropDown() {
    debugger;

    if (this.TPTOA == "other") {

      this.typeOfApplicationOtherDes = true;
    }
    else {
      this.typeOfApplicationOtherDes = false;
    }
        
  }

  TypeOfApplicationDropDown2() {
    debugger;

    if (this.TPTOA2 == "indi") {
      this.company = false;
      this.indi = true;
    }
    else if (this.TPTOA2 == "company") {
      this.company = true;
      this.indi = false;
    }

  }

  generateNewApplicationInvoice() {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const img = new Image();
    img.src = 'assets/Msunduzi_CoA.png';

    doc.addFont('assets/century-gothic/CenturyGothic.ttf', 'CustomFont', 'normal');
    doc.addFont('assets/century-gothic/GOTHICB0.TTF', 'CustomFontBold', 'bold');
    doc.setFont('CustomFont', 'normal');
    let currentPage = 1;
    // Add logo
    doc.addImage(img, 'png', 6, 10, 50, 40);

    // Set font for header
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('Msunduzi Municipality', 200, 17, { align: 'right' });
    doc.text('341 Church Street', 200, 22, { align: 'right' });
    doc.text('Pietermaritzburg 3201', 200, 27, { align: 'right' });

    // Website and Portal links
    doc.setFont('CustomFontBold', 'bold');

    doc.setTextColor(0, 88, 112);
    doc.textWithLink('http://www.msunduzi.gov.za/site/home/index.html', 200, 35, { align: 'right' });

    // Reference number
    doc.setTextColor(0, 0, 0);
    doc.text('Reference Number: ' + this.lSNumber, 200, 50, { align: 'right' });

    // Date and project description
    doc.setFontSize(10);
    doc.setFont('CustomFont', 'normal');
/*    doc.text('DATE : ' + this.formattedDate, 10, 60, { align: 'left' });*/
    doc.text('BUILDING PLANS APPLICATION: ', 10, 70, { maxWidth: 190, lineHeightFactor: 1.5, align: 'left' });

    // Greeting
    doc.text('Dear ' + this.ownerFullName, 10, 80, { align: 'left' });

    // Application summary
    doc.text('Please find below service items', 10, 90, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });

    // Status summary title
    doc.setFont('CustomFontBold', 'bold');
    doc.text('Status Summary:', 10, 110, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });
    doc.setFont('CustomFont', 'normal');

/*    const data = this.ServiceItemListBPRelaxationLS.map(deposit => [deposit.serviceItemCode, deposit.Description, deposit.totalVat]);
    // Render the table in the PDF document
    autoTable(doc, {
      head: [['Service Item', 'Description', 'Total']], // Define table headers
      body: data, // Populate table body with data
      startY: 120, // Start position of the table on the Y axis
      headStyles: { fillColor: '#005870' }, // Header styles
      styles: {
        fontSize: 8, // Font size for table content
        halign: 'left', // Horizontal alignment for table content
        valign: 'middle', // Vertical alignment for table content
      },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold' }, // Style for the first column
        1: { cellWidth: 50 }, // Style for the second column
        2: { cellWidth: 30 }, // Style for the second column
      },
    });*/
    // Rejection summary
    doc.setFontSize(10);
    doc.setFont('CustomFont', 'italic');
    doc.text("Disclaimer:\n This Pack and all associated attachments are intended for the named recipient / s only, and are not transferrable to a third party.The City reserves the right to revoke this permit in the event of infringements, change in scope, methodology or site - specific conditions and / or discovery of new or additional information.Expiry of the Permit validity for one or more departments will render the entire Pack invalid.It is the responsibility of the named recipient to apply timeously for renewals as applicable. Note that it is the recipient’s sole responsibility to ascertain the exact location and depth of existing services infrastructure.The City will not be held liable for consequences resulting from decisions based on any information provided in good faith.", 10, 190, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });
    doc.setFont('CustomFont', 'normal');
    // Signature
    doc.setFontSize(12);
    doc.setFont('CustomFontBold', 'bold');
    doc.text('CITY OF PIETERMARITZBURG', 10, 260, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });
    doc.setFont('CustomFont', 'italic');

    // Save PDF document

    const pdfData = doc.output('blob'); // Convert the PDF document to a blob object
    const file = new File([pdfData], 'Building Plans Land Survey Relaxation Invoice', { type: 'application/pdf' });


    // Prepare the form data
    const formData = new FormData();
    formData.append('file', file);
    this.sharedService.pushFileForTempFileUpload(file, "Building Plans Land Survey Relaxation Invoice" + ".pdf");
    this.saveBP();

    // window.open(pdfUrl, '_blank')

    // this.router.navigate(["/home"]);

  }
  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  saveBP() {




    const filesForUpload = this.sharedService.pullFilesForUpload();
    for (var i = 0; i < filesForUpload.length; i++) {
      const formData = new FormData();
      let fileExtention = filesForUpload[i].UploadFor.substring(filesForUpload[i].UploadFor.indexOf('.'));
      let fileUploadName = filesForUpload[i].UploadFor.substring(0, filesForUpload[i].UploadFor.indexOf('.')) + "-appID-" + this.applicationID;
      formData.append('file', filesForUpload[i].formData, fileUploadName + fileExtention);




      this.http.post(this.apiUrl + 'documentUpload/UploadDocument', formData, { reportProgress: true, observe: 'events' })
        .subscribe({
          next: (event) => {


            if (event.type === HttpEventType.UploadProgress && event.total)
              this.progress = Math.round(100 * event.loaded / event.total);
            else if (event.type === HttpEventType.Response) {
              this.message = 'Upload success.';
              this.uploadFinishedBP(event.body);

            }
          },
          error: (err: HttpErrorResponse) => console.log(err)
        });
    }

  }

  progress: number = 0;
  message = '';
  response: { dbPath: ''; } | undefined
  uploadFinishedBP = (event: any) => {
    const currentApplication = this.sharedService.getViewApplicationIndex();

    this.response = event;
    console.log("this.response", this.response);
    console.log("this.response?.dbPath", this.response?.dbPath);


    const documentName = this.response?.dbPath.substring(this.response?.dbPath.indexOf('d') + 2);
    console.log("documentName", documentName);
    //JJS Commit Permit Cover 30 May 24
    /*    this.documentUploadService.addUpdateDocument(0, documentName, this.response?.dbPath, this.ApplicationID, this.CurrentUser.appUserId, this.CurrentUser.appUserId,"PTW").subscribe((data: any) => {*/
    this.financialService.addUpdateFinancial(0, "Building Plans Land Survey Relaxation Invoice", "Generated Pack", documentName, this.response?.dbPath, this.applicationID, "System Generated Pack").subscribe((data: any) => {
      if (data.responseCode == 1) {
        this.router.navigate(["/home"]);
      }

    }, error => {
      console.log("Error: ", error);
    })
    /* this.permitService.addUpdatePermitSubForComment(0, this.ApplicationID, null, null, null, null, null, "System Generated", null, null, this.response?.dbPath, documentName).subscribe((data: any) => {
       if (data.responseCode == 1) {
 
 
 
       }*/
    /*
        }, error => {
          console.log("Error: ", error);
        })*/


  }

/*  uploadFinishedBP = (event: any) => {
    const currentApplication = this.sharedService.getViewApplicationIndex();

    this.response = event;
    console.log("this.response", this.response);
    console.log("this.response?.dbPath", this.response?.dbPath);


    const documentName = this.response?.dbPath.substring(this.response?.dbPath.indexOf('d') + 2);
    console.log("documentName", documentName);
    //JJS Commit Permit Cover 30 May 24
    *//*    this.documentUploadService.addUpdateDocument(0, documentName, this.response?.dbPath, this.ApplicationID, this.CurrentUser.appUserId, this.CurrentUser.appUserId,"PTW").subscribe((data: any) => {*//*
    this.financialService.addUpdateFinancial(0, "Building Plans Land Survey Relaxation Invoice", "Generated Pack", documentName, this.response?.dbPath, this.ApplicationID, "System Generated Pack").subscribe((data: any) => {
      if (data.responseCode == 1) {
        this.router.navigate(["/home"]);
      }

    }, error => {
      console.log("Error: ", error);
    })
    *//* this.permitService.addUpdatePermitSubForComment(0, this.ApplicationID, null, null, null, null, null, "System Generated", null, null, this.response?.dbPath, documentName).subscribe((data: any) => {
       if (data.responseCode == 1) {
 
 
 
       }*//*
    *//*
        }, error => {
          console.log("Error: ", error);
        })*//*


  }*/
  CreateNotification(UserId: string) {
    
    this.bpNotificationService.addUpdateNotification(0, this.applicationID, "Land Survey", "Application Created", false, UserId, this.CurrentUser.appUserId).subscribe((data: any) => {
      if (data.reponseCode == 1) {
        

      }
      else {
        alert(data.responseMessage)
      }
    }, error => {
      console.log("BuildingApplicationError: ", error)
    })
  }
  occupation: string;
  occupancy: string;
  SetOccupationClassification(index: any) {
    this.occupation = this.occupationClassificationList[index].ClassificationName;
    this.occupancy = this.occupationClassificationList[index].Occupancy;

    this.Classification = this.occupation + " : " + this.occupancy;
  }

  onServitudeCheck() {
    if (this.servitudeBox = false) {
      this.servitudeBox = true;
    }
    else {
      this.servitudeBox = false;
    }
  }

  openSnackBar(message: string) {
    this._snackBar.openFromComponent(SnackBarAlertsComponent, {
      data: { message }, // Pass the message as data to the component
      duration: 4 * 1000,
      panelClass: ['green-snackbar'],
      verticalPosition: 'top',
    });
  }

  AddChecklistForApplication(currentStage: string) {
    debugger;
    this.bpChecklistService.getAllChecklistItemsForStage(currentStage, this.applicationBeingCreatedType).subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          debugger;
          this.bpApplicationChecklistService.addUpdateApplicationChecklist(0, this.applicationID, current.checklistItem, this.applicationBeingCreatedType, currentStage, false, null, this.CurrentUser.appUserId).subscribe((data: any) => {
            if (data.responseCode == 1) {

            }
            else {
              alert(data.reponseMessage);
              return;
            }
          })

        }
      }
      else {
        alert(data.responseMessage);
      }
    })
  }
}

