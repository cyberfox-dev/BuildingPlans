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
  NoOfUnits: string;
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

  servitudeBox: boolean = false;

  @ViewChild("selectClassification", { static: true }) content!: ElementRef;
  @ViewChild(MatTable) classificationTable: MatTable<OccupationClassifications> | undefined;
  displayedColumn:string[]=['OccupationName','Desription',"actions"]
  dataSource = this.occupationClassificationList;

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
    private bpNotificationService: BPNotificationsService,
    private modalService: NgbModal
  ) {
    this.BPMandatoryDocumentList = this.getBPDocumentsList();

    this.BPMandatoryDocumentList.subscribe(data => console.log(data));
    console.log("BPMandatory Documents", this, this.BPMandatoryDocumentList);
}

  ngOnInit(): void {
    this.refreshService.enableRefreshNavigation('/home');
    this.isArchivePlan = this.sharedService.isPlanArchive;
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);
    
   
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

    
  getBPDocumentsList(): Observable<BPMandatoryDocumentUploadList[]> {
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
      console.log("AddUpdateBuildingApplicationError: ", error)

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
      this.NoOfUnits.trim() == "" || this.streetAddress == undefined || this.streetAddress.trim() == "" ||
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
        this.userService.getUserProfileById(this.architectUserID).subscribe((data: any) => {
          if (data.responseCode == 1) {
            const tempUser = data.dateSet[0];
            this.architectName = tempUser.fullName;
            this.architectEmail = tempUser.email;
            this.architectCell = tempUser.phoneNumber;
            this.architectID = tempUser.idNumber;

            const current = this.CurrentUserProfile[0];
            
            this.clientName = current.fullName.substring(0, current.fullName.indexOf(" "));
            this.clientSurname = current.fullName.substring(current.fullName.indexOf(" "));
            this.clientEmail = current.email;
            this.clientAltEmail = current.alternateEmail;
            this.clientCell = current.phoneNumber;
            this.clientIDNo = current.idNumber;
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

  
  AddUpdateBuildingApplication() {
    this.mapAddress = this.sharedService.mapAddress;
    this.latitude = this.sharedService.latitude;
    this.longitude = this.sharedService.longitude;

    if (this.isArchivePlan) {
      this.router.navigate(["/home"]);
    }

    else {
     
      
      if (this.option == "client" || this.isInternal == true) {
        
        this.applicationService.addUpdateBuildingApplication(this.applicationID, this.lSNumber, this.clientUserID, this.clientName, this.clientSurname,
          this.clientEmail, this.clientCell, this.clientAltEmail, this.clientAltCell, this.clientIDNo, this.propertyDescription, this.premisesName,
          this.addressType, this.erfNo, this.portionNo, this.NoOfUnits, this.unitNo, this.mapAddress, this.latitude, this.longitude, this.architectName,
          this.architectUserID, this.buildingPlansFor, this.typeOfDevelopment, this.totalArea, this.Classification, this.planFees, this.propertyValue,
          this.streetAddress, this.suburb, this.city, this.postalCode, this.sGCode, this.CurrentUser.appUserId, "Submission Plan","LS Review",1, this.servitudeBox).subscribe((data: any) => {
          if (data.responseCode == 1) {
            
            this.CreateNotification(this.CurrentUser.appUserId);
            this.CreateNotification(this.clientUserID);
            alert("Application Created");
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
        
        this.applicationService.addUpdateBuildingApplication(this.applicationID, this.lSNumber, this.clientUserID, this.clientName, this.clientSurname,
          this.clientEmail, this.clientCell, this.clientAltEmail, this.clientAltCell, this.clientIDNo, this.propertyDescription, this.premisesName,
          this.addressType, this.erfNo, this.portionNo, this.NoOfUnits, this.unitNo, this.mapAddress, this.latitude, this.longitude, this.architectName,
          this.architectUserID, this.buildingPlansFor, this.typeOfDevelopment, this.totalArea, this.Classification, this.planFees, this.propertyValue,
          this.streetAddress, this.suburb, this.city, this.postalCode, this.sGCode, this.CurrentUser.appUserId, "Submission Plan", "LS Review", 1, this.servitudeBox).subscribe((data: any) => {
          if (data.responseCode == 1) {
            
            this.CreateNotification(this.CurrentUser.appUserId);
            alert("Application Created");
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

  CreateNotification(UserId: string) {
    
    this.bpNotificationService.addUpdateNotification(0, this.applicationID, "Land Survey", "Application Created", false, UserId, this.CurrentUser.appUserId).subscribe((data: any) => {
      if (data.reponseCode == 1) {
        
        alert("Notification Created");
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
}

