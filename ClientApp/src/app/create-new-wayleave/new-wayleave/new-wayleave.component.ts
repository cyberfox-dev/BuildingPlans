import { Component, ComponentFactoryResolver, ComponentRef, ElementRef, Injector, OnInit, ViewChild, ViewContainerRef, Injectable } from '@angular/core';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApplicationsService } from 'src/app/service/Applications/applications.service';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { FormBuilder, Validators } from '@angular/forms';
import { empty } from 'rxjs';
import { ZonesService } from 'src/app/service/Zones/zones.service';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { InternalOptionComponent } from 'src/app/create-new-wayleave/internal-option/internal-option.component';
import { SharedService } from "../../shared/shared.service";
import { ProfessionalService } from 'src/app/service/Professionals/professional.service';
import { UserProfileService } from 'src/app/service/UserProfile/user-profile.service';
import { ProfessionalsLinksService } from 'src/app/service/ProfessionalsLinks/professionals-links.service';
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { SelectEngineerTableComponent} from 'src/app/select-engineer-table/select-engineer-table.component'
import { StagesService } from '../../service/Stages/stages.service';
import { DocumentUploadService } from '../../service/DocumentUpload/document-upload.service';
import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http'; 
import { MandatoryDocumentUploadService } from 'src/app/service/MandatoryDocumentUpload/mandatory-document-upload.service';
import { MandatoryDocumentStageLinkService } from '../../service/MandatoryDocumentStageLink/mandatory-document-stage-link.service';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'


export interface MandatoryDocumentsLinkedStagesList {
  mandatoryDocumentStageLinkID: number;
  mandatoryDocumentID: number;
  mandatoryDocumentName: string;
  stageID: number;
  stageName: string;
  dateCreated: any;
}

export interface EngineerList {
  professinalID: number;
  ProfessinalType: string;
  professionalRegNo: string;
  bpNumber: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  idNumber?: string;
}

export interface ContractorList {
  professinalID: number;
  ProfessinalType: string;
  professionalRegNo: string;
  bpNumber: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: number;
  idNumber?: string;
  CIBRating: string;
}

export interface PeriodicElement {

  fileType: string;

}

export interface FileDocument {

  fileName: string;
  file: any;

}
export interface UserList {
  userId: any;
  idNumber: string;
  fullName: string;

}

export interface StagesList {
  StageID: number;
  StageName: string;
  StageOrderNumber: number;
  CurrentUser: any

}

export interface MandatoryDocumentUploadList {
  mandatoryDocumentID: number;
  mandatoryDocumentName: string;
  stageID: number;
  dateCreated: any;
}

export interface ARCGISAPIData {
  createdByID: string;
  isActive: string;
  applicationID: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { fileType: "Cover letter explaning the extent of the work" },
  { fileType: "Drawing showing the proposed route and detail regarding the trench cross section, number of pipes etc." },
  { fileType: "A programme with proposed timelines" },
  { fileType: "Proof and payment"},
];

export interface PeriodicElementTest {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATATEst: PeriodicElementTest[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];



@Component({
  selector: 'app-new-wayleave',
  templateUrl: './new-wayleave.component.html',
  styleUrls: ['./new-wayleave.component.css']
})

@Injectable({
  providedIn: 'root'
})

export class NewWayleaveComponent implements OnInit {
  @ViewChild("placesRef")
  placesRef: GooglePlaceDirective | undefined;
  options = {
    types: [],
    componentRestrictions: { country: 'ZA' }
  } as unknown as Options
  professionalType!: string;
  userID = '';

  CurrentStageName = '';
  /*Client details*/
  clientUserID = '';
  clientName = '';
  clientSurname = '';
  clientEmail = '';
  clientCellNo = '';
  clientAddress = '';
  clientRefNo = '';
  clientBPNum = '';
  clientCompanyName = '';
  clientCompanyRegNo = '';
  clientCompanyType = '';
  clientIDNumber = '';
  clientPhysicalAddress = '';


  internalName = '';
  internalSurname = '';
  internalDepartmentName = '';
  internalDepartmentID = '';
  internalBranch = '';
  internalCostCenterNumber = '';
  internalCostCenterOwner = '';

  /*External details*/
  externalBPNumber = '';
  externalName = '';
  externalSurname = '';
  externalAddress = '';
  externalEmail = '';

  /*project details*/
  typeOfApplication = '';
  notificationNumber = '';
  wbsNumber = '';
  physicalAddressOfProject = '';
  descriptionOfProject = '';
  natureOfWork = '';
  excavationType = '';
  expectedStartDate: Date = new Date();
  expectedEndType: Date = new Date();

  /*New Engineer information*/
  engineerIDNo = '';
  bpNoApplicant = '';
  professionalRegNo = '';
  name = '';
  surname = '';
  applicantTellNo = '';
  applicantEmail = '';

  //public addApplicationProject = this.formBuilder.group({
  //  typeOfApplication: ['', Validators.required],
  //  notificationNumber: ['', Validators.required],
  //  wbsNumber: ['', Validators.required],
  //  physicalAddressOfProject: ['', Validators.required],
  //  descriptionOfProject: ['', Validators.required],
  //  natureOfWork: ['', Validators.required],
  //  excavationType: ['', Validators.required],
  //  expectedStartDate: ['', Validators.required],
  //  expectedEndType: ['', Validators.required]
  //})

  EngineerList: EngineerList[] = [];
  UserList: UserList[] = [];
  FileDocument: FileDocument[] = [];
  ContractorList: ContractorList[] = [];
  StagesList: StagesList[] = [];
  MandatoryDocumentUploadList: MandatoryDocumentUploadList[] = [];
  MandatoryDocumentsLinkedStagesList: MandatoryDocumentsLinkedStagesList[] = [];

  public external: boolean = true;
  public internal: boolean = false;
  public client: boolean = false;
  public map: boolean = true;
  public newClient: boolean = true;
  public disabled: boolean = false;

  clientSelected = false;
  option: any;
  isAllSelected: any;
  Engineer = "Engineer";
  Contractor = "Contractor";

  //Initialize the interface for ARCGIS
  ARCGISAPIData = {} as ARCGISAPIData;

  //public addApplication = this.formBuilder.group({
  //  newApplicationName: ['', Validators.required]

  //})

  //Local storage userID
  CurrentUser: any;
  //Convert the local storage JSON data to an array object
  stringifiedData: any;
  venstringifiedData: any;
  venContractorData: any;

  progress: number = 0;
  message: string | undefined;


  //Store message for file upload
  CoverLetter = "CoverLetter";
  response: { dbPath: ''; } | undefined

  CurrentUserProfile: any;
  stringifiedDataUserProfile: any;
  //Columns for both the engineer and contractor lists
  displayedColumns: string[] = ['ProfessinalType', 'professionalRegNo', 'bpNumber', 'name', 'surname', 'email', 'phoneNumber', 'idNumber'];
  displayedColumnsContractors: string[] = ['ProfessinalType', 'professionalRegNo', 'bpNumber', 'name', 'surname', 'email', 'phoneNumber', 'idNumber'];
  dataSourceEngineers = this.EngineerList;
  dataSourceContractors = this.ContractorList;
  @ViewChild(MatTable) EngineerTable: MatTable<EngineerList> | undefined;
  @ViewChild(MatTable) ContractorTable: MatTable<ContractorList> | undefined;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ompanyName = 'ABC Corporation';
  logoUrl = 'assets/cctlogoblack.png';
  currentDate = new Date();
  datePipe = new DatePipe('en-ZA');
  formattedDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');

  displayedColumnsCUpload: string[] = ['fileType', 'actions'];
  dataSource = ELEMENT_DATA;

  displayedColumnsLinkUsers: string[] = ['idNumber', 'fullName', 'actions'];
  dataSourceLinkUsers = this.UserList;
    applicationID: any;
  //CoverLetterFileName = "Choose file";


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceLinkUsers.filter(user => user.fullName.toLowerCase().includes(filterValue.trim().toLowerCase()));
    this.UserListTable?.renderRows();

    // console.log("this is what it is filtering", this.dataSourceLinkUsers.filter(user => user.fullName.toLowerCase().includes(filterValue.trim().toLowerCase())));
  }

  @ViewChild(MatTable) UserListTable: MatTable<UserList> | undefined;
  @ViewChild(MatTable) MandatoryDocumentUploadTable: MatTable<MandatoryDocumentUploadList> | undefined;


  constructor(
    private modalService: NgbModal,
    private applicationsService: ApplicationsService,
    private professionalsLinksService: ProfessionalsLinksService,
    private shared: SharedService,
    private formBuilder: FormBuilder,
    private professionalService: ProfessionalService,
    private userPofileService: UserProfileService,
    private router: Router,
    private zoneService: ZonesService,
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef,
    private injector: Injector,
    private stagesService: StagesService,
    private documentUploadService: DocumentUploadService,
    private mandatoryUploadDocsService: MandatoryDocumentUploadService,
    private http: HttpClient,
    private mandatoryDocumentStageLink: MandatoryDocumentStageLinkService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {

    this.getAllExternalUsers();

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    //Assigns the below values to the variable that will be passed to the map component.
    this.ARCGISAPIData.createdByID = this.CurrentUser.appUserId;
    this.ARCGISAPIData.isActive = "1";
    this.ARCGISAPIData.applicationID = 0;

    this.typeOfApplication = "TOA";


    this.getProfessionalsListByProfessionalType("Engineer");
    this.getProfessionalsListByProfessionalType("Contractor");

    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);

    // this.StagesList = this.shared.getStageData();

    this.getAllStages();







    console.log("this.CurrentUserProfile ", this.CurrentUserProfile);

    if (this.CurrentUserProfile[0].isInternal == false) {

      this.external = true;
      this.internal = false;
      this.client = false;



      this.userPofileService.getUserProfileById(this.CurrentUser.appUserId).subscribe((data: any) => {

        if (data.responseCode == 1) {


          console.log("data Ex", data.dateSet);

          const currentUserProfile = data.dateSet[0];
          const fullname = currentUserProfile.fullName;

          this.externalBPNumber = currentUserProfile.bP_Number;
          this.externalName = fullname.substring(0, fullname.indexOf(' '));
          this.externalSurname = fullname.substring(fullname.indexOf(' ') + 1);
          this.externalAddress = currentUserProfile.physcialAddress;
          this.externalEmail = currentUserProfile.email;


        }

        else {

          alert(data.responseMessage);
        }
        /* console.log("reponse", data);*/

      }, error => {
        console.log("Error: ", error);
      })







    }
    else {
      this.internal = true;
      this.external = false;
      this.client = false;
    }



    //const imagePath = 'assets/cctlogoblack.png';
    //this.logoUrl = this.sanitizer.bypassSecurityTrustUrl(imagePath);

  }

  //Unused code
  public handleAddressChange(address: Address) {
    // Do some stuff
    this.clientAddress = address.formatted_address;
    console.log(this.clientAddress);

  }
  ngAfterViewInit() {
    //  this.getProfessionalsListByProfessionalType("Contractor");
    this.dataSourceTest.paginator = this.paginator;

  }

  clickedRowsEngineers = new Set<EngineerList>();
  clickedRowsContractors = new Set<ContractorList>();

  clearAllEngineers() {
    this.clickedRowsEngineers.clear();
  }

  clearAllContractors() {
    this.clickedRowsContractors.clear();
  }

  reciveOption($event: any) {
    this.option = $event
    if (this.option == "client") {
      this.client = true;
      this.external = false;
      this.internal = false;
      this.map = false;
    }
    else if (this.option == "internal") {
      this.internal = true;
      this.external = false;




      this.userPofileService.getUserProfileById(this.CurrentUser.appUserId).subscribe((data: any) => {

        if (data.responseCode == 1) {


          console.log("data", data.dateSet);

          const currentUserProfile = data.dateSet[0];
          const fullname = currentUserProfile.fullName;

          this.internalName = fullname.substring(0, fullname.indexOf(' '));
          this.internalSurname = fullname.substring(fullname.indexOf(' ') + 1);
          //directorate is the department name for displaying to the user and departmentID is what we we may need to send to the db
          this.internalDepartmentName = currentUserProfile.directorate;
          //the is where the departmentID is saved
          this.internalDepartmentID = currentUserProfile.departmentID;
          this.internalBranch = currentUserProfile.branch;
          this.internalCostCenterNumber = currentUserProfile.costCenterNumber;
          this.internalCostCenterOwner = currentUserProfile.costCenterOwner;

        }

        else {

          alert(data.responseMessage);
        }
        console.log("reponse", data);

      }, error => {
        console.log("Error: ", error);
      })


    }

    this.getMandatoryDocsForCaptureStage();

  }

  getAllStages() {

    this.StagesList.splice(0, this.StagesList.length);

    this.stagesService.getAllStages().subscribe((data: any) => {
      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempStageList = {} as StagesList;
          const current = data.dateSet[i];
          tempStageList.StageID = current.stageID;
          tempStageList.StageName = current.stageName;
          tempStageList.StageOrderNumber = current.stageOrderNumber;

          this.StagesList.push(tempStageList);
          // this.sharedService.setStageData(this.StagesList);
        }
        this.getAllManDocsByStageID();

      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }


  getProfessionalsListByProfessionalType(professionalType: string) {
    /*    this.EngineerList.splice(0, this.EngineerList.length);*/

    this.professionalService.getProfessionalsListByProfessionalType(this.CurrentUser.appUserId, professionalType).subscribe((data: any) => {

      if (data.responseCode == 1) {
        console.log("data.dateSet get", data.dateSet);

        for (let i = 0; i < data.dateSet.length; i++) {
          //Check if Engineer or Contractor
          if (professionalType == "Engineer") {
            const tempProfessionalList = {} as EngineerList;
            const current = data.dateSet[i];
            tempProfessionalList.bpNumber = current.bP_Number;
            tempProfessionalList.email = current.email;
            tempProfessionalList.idNumber = current.idNumber;
            tempProfessionalList.name = current.fullName.substring(0, current.fullName.indexOf(' '));
            tempProfessionalList.surname = current.fullName.substring(current.fullName.indexOf(' ') + 1);
            tempProfessionalList.phoneNumber = current.phoneNumber;
            tempProfessionalList.ProfessinalType = current.professinalType;
            tempProfessionalList.professionalRegNo = current.professionalRegNo;
            tempProfessionalList.professinalID = current.professinalID;
            this.EngineerList.push(tempProfessionalList);
            console.log("this.EngineerList", this.EngineerList);
          } else {
            const tempProfessionalList = {} as ContractorList;
            const current = data.dateSet[i];
            tempProfessionalList.bpNumber = current.bP_Number;
            tempProfessionalList.email = current.email;
            tempProfessionalList.idNumber = current.idNumber;
            tempProfessionalList.name = current.fullName.substring(0, current.fullName.indexOf(' '));
            tempProfessionalList.surname = current.fullName.substring(current.fullName.indexOf(' ') + 1);
            tempProfessionalList.phoneNumber = current.phoneNumber;
            tempProfessionalList.ProfessinalType = current.professinalType;
            tempProfessionalList.professionalRegNo = current.professionalRegNo;
            tempProfessionalList.professinalID = current.professinalID;
            tempProfessionalList.CIBRating = current.cibRating;
            this.ContractorList.push(tempProfessionalList);
            console.log("this.ContractorList", this.ContractorList);
          }
          //this.EngineerTable?.renderRows();
          //this.ContractorTable?.renderRows();
        }
        this.ContractorTable?.renderRows();
        this.EngineerTable?.renderRows();

      }

      else {

        alert(data.responseMessage);
      }

      console.log("reponse", data);
      this.ContractorTable?.renderRows();
      this.EngineerTable?.renderRows();
    }, error => {
      console.log("Error: ", error);
    })
  }


  onModelChange() {
    this.shared.setApplicationID(this.notificationNumber);
    /*    this.shared.setCreatedByID(this.CurrentUser.appUserId)*/
  }

onWayleaveCreate(appUserId) {

    //Check if applicationid exists or not.
    this.applicationID = this.shared.getApplicationID();

    if (this.applicationID != undefined || this.applicationID != null) {

    } else {
      this.applicationID = 0;
    };



/*    this.shared.setApplicationID(this.notificationNumber);*/
    this.clientAddress = this.shared.getAddressData();
    const contractorData = this.shared.getContactorData();
    const engineerData = this.shared.getEngineerData();
    let previousStageName = "";
    let CurrentStageName = "";
    let NextStageName = "";

    let previousStageNameIn = "";
    let CurrentStageNameIn = "";
    let NextStageNameIn = "";


    for (var i = 0; i < this.StagesList.length; i++) {
      ;
      if (this.StagesList[i].StageOrderNumber == 1) {
        previousStageName = this.StagesList[i - 1].StageName
        CurrentStageName = this.StagesList[i].StageName;
        NextStageName = this.StagesList[i + 1].StageName
      }
      else if (this.StagesList[i].StageOrderNumber == 2) {
        previousStageNameIn = this.StagesList[i - 2].StageName
        CurrentStageNameIn = this.StagesList[i].StageName;
        NextStageNameIn = this.StagesList[i + 1].StageName
      }

    }

    if (this.client) {
      this.applicationsService.addUpdateApplication(this.applicationID, appUserId, this.clientName + ' ' + this.clientSurname, this.clientEmail, this.clientCellNo, this.clientAddress, this.clientRefNo, '0', this.typeOfApplication, this.notificationNumber, this.wbsNumber, this.physicalAddressOfProject, this.descriptionOfProject, this.natureOfWork, this.excavationType, this.expectedStartDate, this.expectedEndType, '10 Stella Road, Newholme, PMB, KZN', appUserId,previousStageName,0,CurrentStageName,1,NextStageName,2,"Unpaided").subscribe((data: any) => {

        if (data.responseCode == 1) {
          alert(data.responseMessage);
          this.shared.setApplicationID(data.dateSet.applicationID);
          this.ARCGISAPIData.applicationID = data.dateSet.applicationID;

          //Add professional link for contractors when application is successfully captured
          if (contractorData.length > 0) {
            for (var i = 0; i < contractorData.length; i++) {
              this.addProfessionalsLinks(this.applicationID, contractorData[i].professinalID);
            };
          } else {
            alert("This Application have no contractors linked");
          }


          //Add professional link for engineers when application is successfully captured
          if (engineerData.length > 0) {
            for (var i = 0; i < engineerData.length; i++) {
              this.addProfessionalsLinks(this.applicationID, engineerData[i].professinalID);
            };
          }
          else {
            alert("This Application have no engineers linked");
          }


          //Pulling information from the share
          const filesForUpload = this.shared.pullFilesForUpload();
          for (var i = 0; i < filesForUpload.length; i++) {
            const formData = new FormData();
            formData.append('file', filesForUpload[i].formData, filesForUpload[i].UploadFor + "-appID-" + data.dateSet.applicationID);



            this.http.post('https://localhost:7123/api/documentUpload/UploadDocument', formData, { reportProgress: true, observe: 'events' })
              .subscribe({
                next: (event) => {

                  if (event.type === HttpEventType.UploadProgress && event.total)
                    this.progress = Math.round(100 * event.loaded / event.total);
                  else if (event.type === HttpEventType.Response) {
                    this.message = 'Upload success.';
                    // this.onUploadFinished.emit(event.body);
                  }
                },
                error: (err: HttpErrorResponse) => console.log(err)
              });
          }

          //this.shared.pullFilesForUpload();

          this.shared.setApplicationID(0);
        }
        else {
          alert(data.responseMessage);
        }
        console.log("responseAddapplication", data);

        if (this.applicationID == 0) {
          this.router.navigate(["/new-wayleave"]);
        } else {
          this.router.navigate(["/home"]);
        };

      }, error => {
        console.log("Error", error);
      })
    }
    else if (this.internal) {
      ;
      this.applicationsService.addUpdateApplication(this.applicationID, appUserId, this.internalName + ' ' + this.internalSurname, this.CurrentUser.email, null, null, null, null, this.typeOfApplication, this.notificationNumber, this.wbsNumber, this.physicalAddressOfProject, this.descriptionOfProject, this.natureOfWork, this.excavationType, this.expectedStartDate, this.expectedEndType, '10 Stella Road, Newholme, PMB, KZN', appUserId, previousStageNameIn, 0, CurrentStageNameIn, 2, NextStageNameIn, 3, "Distributing").subscribe((data: any) => {

        if (data.responseCode == 1) {
          alert(data.responseMessage);
          console.log(data);
          this.shared.setApplicationID(this.applicationID);
          this.ARCGISAPIData.applicationID = this.applicationID;

          //Add professional link for contractors when application is successfully captured
          if (contractorData.length > 0) {
            for (var i = 0; i < contractorData.length; i++) {
              this.addProfessionalsLinks(this.applicationID, contractorData[i].professinalID);
            };
          } else {
            alert("This Application have no contractors linked");
          }


          //Add professional link for engineers when application is successfully captured
          if (engineerData.length > 0) {
            for (var i = 0; i < engineerData.length; i++) {
              this.addProfessionalsLinks(this.applicationID, engineerData[i].professinalID);
            };
          }
          else {
            alert("This Application have no engineers linked");
          }

          //Pulling information from the share
          const filesForUpload = this.shared.pullFilesForUpload();
          for (var i = 0; i < filesForUpload.length; i++) {
            const formData = new FormData();
            let fileExtention = filesForUpload[i].UploadFor.substring(filesForUpload[i].UploadFor.indexOf('.'));
            let fileUploadName = filesForUpload[i].UploadFor.substring(0, filesForUpload[i].UploadFor.indexOf('.')) + "-appID-" + this.applicationID;
            formData.append('file', filesForUpload[i].formData, fileUploadName + fileExtention );



            this.http.post('https://localhost:7123/api/documentUpload/UploadDocument', formData, { reportProgress: true, observe: 'events' })
              .subscribe({
                next: (event) => {

                  if (event.type === HttpEventType.UploadProgress && event.total)
                    this.progress = Math.round(100 * event.loaded / event.total);
                  else if (event.type === HttpEventType.Response) {
                    this.message = 'Upload success.';
                    this.uploadFinished(event.body, this.applicationID, data.dateSet);
                  }
                },
                error: (err: HttpErrorResponse) => console.log(err)
              });
          }



          this.shared.setApplicationID(0);
        }
        else {
          alert(data.responseMessage);
        }
        console.log("responseAddapplication", data);

        if (this.applicationID == 0) {
          this.router.navigate(["/new-wayleave"]);
        } else {
          this.router.navigate(["/home"]);
        };

      }, error => {
        console.log("Error", error);
      })
    }

    else {
      //External
      //This is also reached to create a blank application.


      this.applicationsService.addUpdateApplication(this.applicationID, appUserId, this.externalName + ' ' + this.externalSurname, this.externalEmail, this.externalAddress, null, null, null, this.typeOfApplication, this.notificationNumber, this.wbsNumber, this.physicalAddressOfProject, this.descriptionOfProject, this.natureOfWork, this.excavationType, this.expectedStartDate, this.expectedEndType, '10 Stella Road, Newholme, PMB, KZN', appUserId, previousStageName, 0, CurrentStageName, 1, NextStageName, 2, "Unpaided").subscribe((data: any) => {
        
        if (data.responseCode == 1) {
          alert(data.responseMessage);
          this.shared.setApplicationID(data.dateSet.applicationID);
          this.ARCGISAPIData.applicationID = data.dateSet.applicationID;

          //Add professional link for contractors when application is successfully captured
          if (contractorData.length > 0) {
            for (var i = 0; i < contractorData.length; i++) {
              this.addProfessionalsLinks(data.dateSet.applicationID, contractorData[i].professinalID);
            };
          } else {
/*            alert("This Application have no contractors linked");*/
          }


          //Add professional link for engineers when application is successfully captured
          if (engineerData.length > 0) {
            for (var i = 0; i < engineerData.length; i++) {
              this.addProfessionalsLinks(data.dateSet.applicationID, engineerData[i].professinalID);
            };
          }
          else {
/*            alert("This Application have no engineers linked");*/
          }

        }
        else {
          alert(data.responseMessage);
        }
        console.log("responseAddapplication", data);

        /*        this.shared.setApplicationID(data.dateSet.applicationID);*/

        if (this.applicationID == 0) {
          this.router.navigate(["/new-wayleave"]);
        } else {
          this.router.navigate(["/home"]);
        };

//        this.shared.setApplicationID(0); //sets the applicationID back to zero when a new application is created.
/*        return this.ARCGISAPIData.applicationID;*/

      }, error => {
        console.log("Error", error);
      })

    }
/*    this.router.navigate(["/new-wayleave"]);*/
  /*    return this.ARCGISAPIData.applicationID;*/
  this.shared.setApplicationID(0);
  }

  openXl(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }


  generateInvoice() {
    if (this.internal = false) {
      //var pdf = 'http://197.242.150.226/Files/SampleInvoice.pdf';
      //window.open(pdf, '_blank');


      console.log("downloadInvoice");
      // Create a new instance of jsPDF
      const doc = new jsPDF();


      const image = new Image();
      image.src = this.logoUrl;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');


        autoTable(doc, {
          body: [
            [
              {
                content: "Logo goes here",


                styles: {
                  halign: 'left',
                  fontSize: 20,
                  textColor: '#ffffff',
                }
              },
              {
                content: 'Wayleave Application Fee Invoice',
                styles: {
                  halign: 'right',
                  fontSize: 15,
                  textColor: '#ffffff',
                }
              }
            ],
          ],
          theme: 'plain',
          styles: {
            fillColor: '#3366ff',
          }
        });

        autoTable(doc, {
          body: [
            [
              {
                content: 'Wayleave Ref No.:  1/23'
                  + '\nBTW Reg. Nr./VAT Reg. No.4500193497'
                  + '\nDate: ' + this.formattedDate
                  + '\nInvoice Number: ' + "845396789",

                styles: {
                  halign: 'right',
                }
              }
            ],
          ],
          theme: 'plain',
        });


        autoTable(doc, {
          body: [
            [
              {
                content: 'City of Cape Town'
                  + '\nPost Box / Posbus / iShokisi 655'
                  + '\nCAPE TOWN'
                  + '\n8001',

                styles: {
                  halign: 'left',
                }
              }
            ],
          ],
          theme: 'plain',
        });
        const startY = 100; // set the starting Y position for the table

        autoTable(doc, {
          head: [['Service Item Code', 'Description', 'Rate', 'Quantity', 'Amount']],
          body: [
            ['001', 'Wayleave Application Fees', 'R100 000.00', '1', 'R100 000.00'],

          ],
          theme: 'grid',
          startY: startY,
          margin: { top: 20 }
        });

        autoTable(doc, {
          body: [
            [
              {
                content: 'USE THIS REF NO: 845396789'
                  + '\nTO MAKE EFT PAYMENTS FOR THIS INVOICE ONLY',

                styles: {
                  halign: 'center',
                }
              }
            ],
          ],
          theme: 'grid',
        });

        autoTable(doc, {
          body: [
            [
              {
                content: 'Profit Centre: ' + 'P19070051'
                  + '\nGL Acc: ' + "845180",
                styles: {
                  halign: 'left',
                }
              }
            ],
          ],
          theme: 'plain',
          startY: startY + 30, // add 30 units of Y position to create space between the tables
        });

        doc.save("invoice.pdf");
        const pdf = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdf);
        window.open(pdfUrl, '_blank')
      }

    }
    this.router.navigate(["/home"]);
  }

  coverLetterUpload(event: any) {
    const file = event.target.files[0];
  }


  addProfessionalsLinks(applicationID: number, professionalID: number) {



    this.professionalsLinksService.addUpdateProfessionalsLink(0, applicationID, professionalID, this.ARCGISAPIData.createdByID).subscribe((data: any) => {

      if (data.responseCode == 1) {
        alert(data.responseMessage);
      }
      else {
        /*        alert(data.responseMessage);*/
      }
      console.log("response", data);
    }, error => {
      console.log("Error", error);
    })
  }




  @ViewChild('fileInput')
  fileInput!: ElementRef;
  CoverLetterChooseFileText = 'Choose File';


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
  displayedColumnsTest: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSourceTest = new MatTableDataSource(ELEMENT_DATATEst);







  uploadFileEvt(File: any) {

    const tempFileDocumentList = {} as FileDocument;

    tempFileDocumentList.fileName = File.target.files[0].name;
    tempFileDocumentList.file = File.target.files[0];
    this.CoverLetterChooseFileText += File.target.files[0].name + ' - ';

    this.FileDocument.push(tempFileDocumentList);
    console.log("this.FileDocument", this.FileDocument);
    

    //// Check if one or more files were selected
    //if (File.target.files.length > 0) {
    //  // Reset the fileAttr property
    //  this.fileAttr = '';
    //  // Iterate over the selected files
    //  Array.from(File.target.files).forEach((file: any) => {
    //    // Create a new File object
    //    let fileObject = new File([file], file.name);
    //    // Concatenate the file names and add a separator
    //    this.fileAttr += file.name + ' - ';
    //    // Create a new FileReader object
    //    let reader = new FileReader();
    //    // Set the onload event handler 
    //    reader.onload = (e: any) => {
    //      // Create a Byte[] array from the file contents
    //      let fileBytes = new Uint8Array(e.target.result);

    //    };
    //    // Start reading the file as an ArrayBuffer
    //    reader.readAsArrayBuffer(fileObject);

    //    console.log("fileObject", fileObject);
    //    console.log("reader.readAsArrayBuffer(fileObject)", reader.readAsArrayBuffer(fileObject));

    //  });
    //  // Reset the value of the file input element
    //  this.fileInput.nativeElement.value = '';
    //} else {
    //  // If no file was selected, set fileAttr to the default value
    //  this.fileAttr = 'Choose File';
    //}
  }


  getAllExternalUsers() {

    this.UserList.splice(0, this.UserList.length);


    this.userPofileService.getExternalUsers().subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempZoneList = {} as UserList;
          const current = data.dateSet[i];
          tempZoneList.userId = current.userID;
          tempZoneList.idNumber = current.idNumber;
          tempZoneList.fullName = current.fullName;



          this.UserList.push(tempZoneList);
        }

      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })

  }


  openExsistingClientModal(content: any) {
    this.modalService.open(content, { backdrop: 'static', size: 'lg' });
  }
  getUserID(index: any) {
    this.userID = this.UserList[index].userId;
  }

  populateClientInfo() {

    this.disabled = true;
    this.newClient = false;
    this.userPofileService.getUserProfileById(this.userID).subscribe((data: any) => {

      if (data.responseCode == 1) {

        this.UserListTable?.renderRows();
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempUserList = {} as UserList;
          const current = data.dateSet[i];
      
          const fullname = current.fullName;
          this.clientUserID = current.userID;
          this.clientName = fullname.substring(0, fullname.indexOf(' '));
          this.clientSurname = fullname.substring(fullname.indexOf(' ') + 1);
          this.clientEmail = current.email;
          this.clientCellNo = current.phoneNumber;
          this.clientIDNumber = current.idNumber;
          this.clientBPNum = current.bP_Number;
          this.clientCompanyRegNo = current.companyRegNo;
          this.clientCompanyName = current.companyName;
          this.clientPhysicalAddress = current.physcialAddress;
         
          this.getProfessionalsListByProfessionalType(this.professionalType);
          console.log(tempUserList);
          this.UserList.push(tempUserList);

        }
        this.UserListTable?.renderRows();
      }
      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);
    }, error => {
      console.log("Error: ", error);
    })
  }
  tempEngineerList: EngineerList[] = [];
  myDataSource = this.tempEngineerList;


  recallMyComponent() {

    //  this.componentRef.destroy();
    //  this.container.clear();


    //const factory = this.resolver.resolveComponentFactory(selectProfessionals.SelectEngineerTableComponent);
    //const componentRef = factory.create(this.injector);
    //this.container.insert(componentRef.hostView);

    let refreshTable = new SelectEngineerTableComponent(this.professionalService, this.shared);
    refreshTable.ngOnInit();
  }

  onAddEngineer() {

    let refreshTable = new SelectEngineerTableComponent(this.professionalService, this.shared);
    

    const newEnineer = {} as EngineerList;
    newEnineer.ProfessinalType = "Engineer";
    newEnineer.bpNumber = this.bpNoApplicant;
    newEnineer.professionalRegNo = this.professionalRegNo;
    newEnineer.name = this.name;
    newEnineer.surname = this.surname;
    newEnineer.email = this.applicantEmail;
    newEnineer.phoneNumber = this.applicantTellNo;
    refreshTable.onAddEngineer(this.bpNoApplicant, this.professionalRegNo, this.name, this.surname, this.applicantEmail, this.applicantTellNo, this.engineerIDNo)
    //refreshTable.getProfessionalsListByProfessionalType('Engineer');
    //refreshTable.refreshTable();
   
  }


  getProfessionalsListForExsitingUser(professionalType: string) {
    /*    this.EngineerList.splice(0, this.EngineerList.length);*/

    this.professionalService.getProfessionalsListByProfessionalType(this.userID, professionalType).subscribe((data: any) => {

      if (data.responseCode == 1) {
        console.log("data.dateSet get", data.dateSet);

        for (let i = 0; i < data.dateSet.length; i++) {
          //Check if Engineer or Contractor
          if (professionalType == "Engineer") {
            const tempProfessionalList = {} as EngineerList;
            const current = data.dateSet[i];
            tempProfessionalList.bpNumber = current.bP_Number;
            tempProfessionalList.email = current.email;
            tempProfessionalList.idNumber = current.idNumber;
            tempProfessionalList.name = current.fullName.substring(0, current.fullName.indexOf(' '));
            tempProfessionalList.surname = current.fullName.substring(current.fullName.indexOf(' ') + 1);
            tempProfessionalList.phoneNumber = current.phoneNumber;
            tempProfessionalList.ProfessinalType = current.professinalType;
            tempProfessionalList.professionalRegNo = current.professionalRegNo;
            tempProfessionalList.professinalID = current.professinalID;
            this.EngineerList.push(tempProfessionalList);
            console.log("this.EngineerList", this.EngineerList);
          } else {
            const tempProfessionalList = {} as ContractorList;
            const current = data.dateSet[i];
            tempProfessionalList.bpNumber = current.bP_Number;
            tempProfessionalList.email = current.email;
            tempProfessionalList.idNumber = current.idNumber;
            tempProfessionalList.name = current.fullName.substring(0, current.fullName.indexOf(' '));
            tempProfessionalList.surname = current.fullName.substring(current.fullName.indexOf(' ') + 1);
            tempProfessionalList.phoneNumber = current.phoneNumber;
            tempProfessionalList.ProfessinalType = current.professinalType;
            tempProfessionalList.professionalRegNo = current.professionalRegNo;
            tempProfessionalList.professinalID = current.professinalID;
            tempProfessionalList.CIBRating = current.cibRating;
            this.ContractorList.push(tempProfessionalList);
            console.log("this.ContractorList", this.ContractorList);
          }
          //this.EngineerTable?.renderRows();
          //this.ContractorTable?.renderRows();
        }
        this.ContractorTable?.renderRows();
        this.EngineerTable?.renderRows();

      }

      else {

        alert(data.responseMessage);
      }

      console.log("reponse", data);
      this.ContractorTable?.renderRows();
      this.EngineerTable?.renderRows();
    }, error => {
      console.log("Error: ", error);
    })
  }



  uploadFinished = (event: any, applicationID: any, applicationData:any) => {
    ;
    this.response = event;
    console.log("this.response", this.response);
    console.log("this.response?.dbPath", this.response?.dbPath);
    console.log("applicationData", applicationData);

    const documentName = this.response?.dbPath.substring(this.response?.dbPath.indexOf('d') + 2);
    console.log("documentName", documentName);
    this.documentUploadService.addUpdateDocument(0, documentName, this.response?.dbPath, applicationID, applicationData.userID, this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {

      }

  

     

    }, error => {
      console.log("Error: ", error);
    })
    
    
  }


  onPassFileName = (CoverLetterFileName: any) => {
    this.CoverLetterChooseFileText = CoverLetterFileName;

  }

  getMandatoryDocsForCaptureStage() {
  
    let CaptureSageID = 0;

    for (var i = 0; i < this.StagesList.length; i++) {

      if (this.StagesList[i].StageOrderNumber == 0) {
        CaptureSageID = this.StagesList[i].StageID;

      }


    }


    this.MandatoryDocumentUploadList.splice(0, this.MandatoryDocumentUploadList.length);
/*    this.mandatoryUploadDocsService.getAllMandatoryDocumentsByStageID(CaptureSageID).subscribe((data: any) => {

      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempMandatoryDocList = {} as MandatoryDocumentUploadList;
          const current = data.dateSet[i];
          tempMandatoryDocList.mandatoryDocumentID = current.mandatoryDocumentID;
          tempMandatoryDocList.mandatoryDocumentName = current.mandatoryDocumentName;
          tempMandatoryDocList.stageID = current.stageID;
          tempMandatoryDocList.dateCreated = current.dateCreated;
          this.MandatoryDocumentUploadList.push(tempMandatoryDocList);
        }
        this.MandatoryDocumentUploadTable?.renderRows();
        console.log("Got MANDATORY DOCS BY STAGE ID", this.MandatoryDocumentUploadList);

        console.log("datadatadatadata", data);
      }
      else {
        alert(data.responseMessage);

      }
      console.log("response", data);


    }, error => {
      console.log("Error: ", error);
    })*/
  }


  getAllManDocsByStageID() {

      this.MandatoryDocumentsLinkedStagesList.splice(0, this.MandatoryDocumentsLinkedStagesList.length);

    this.mandatoryDocumentStageLink.getAllMandatoryDocumentsByStageID(this.StagesList[0].StageID).subscribe((data: any) => {
        if (data.responseCode == 1) {


          for (let i = 0; i < data.dateSet.length; i++) {
            const tempMandatoryDocumentsLinkedStagesList = {} as MandatoryDocumentsLinkedStagesList;
            const current = data.dateSet[i];
            tempMandatoryDocumentsLinkedStagesList.stageID = current.stageID;
            tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentStageLinkID = current.mandatoryDocumentStageLinkID;
            tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentID = current.mandatoryDocumentID;
            tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentName = current.mandatoryDocumentName;
            tempMandatoryDocumentsLinkedStagesList.stageName = current.stageName;
            tempMandatoryDocumentsLinkedStagesList.dateCreated = current.dateCreated;

            this.MandatoryDocumentsLinkedStagesList.push(tempMandatoryDocumentsLinkedStagesList);

          }
        }
        else {

          alert(data.responseMessage);
        }
        console.log("reponse", data);

      }, error => {
        console.log("Error: ", error);
      })
  }

  saveProjectAsDraft() {

  }
  }
  


