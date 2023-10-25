import { Component, ComponentFactoryResolver, ComponentRef, ElementRef, Injector, OnInit, ViewChild, ViewContainerRef, Injectable, Input } from '@angular/core';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApplicationsService } from 'src/app/service/Applications/applications.service';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
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
import { SelectEngineerTableComponent } from 'src/app/select-engineer-table/select-engineer-table.component';
import { SelectContractorTableComponent } from 'src/app/select-contractor-table/select-contractor-table.component';
import { StagesService } from '../../service/Stages/stages.service';
import { DocumentUploadService } from '../../service/DocumentUpload/document-upload.service';
import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { MandatoryDocumentUploadService } from 'src/app/service/MandatoryDocumentUpload/mandatory-document-upload.service';
import { MandatoryDocumentStageLinkService } from '../../service/MandatoryDocumentStageLink/mandatory-document-stage-link.service';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { SubDepartmentForCommentService } from 'src/app/service/SubDepartmentForComment/sub-department-for-comment.service';
import { NotificationsService } from 'src/app/service/Notifications/notifications.service';
import { SubDepartmentsService } from 'src/app/service/SubDepartments/sub-departments.service';
import { TypeOfExcavationService } from 'src/app/service/TypeOfExcavation/type-of-excavation.service';
import { ConfigService } from 'src/app/service/Config/config.service';
import { RefreshService } from '../../shared/refresh.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { HomeComponent } from 'src/app/home/home.component';
import { ZoneForCommentService } from 'src/app/service/ZoneForComment/zone-for-comment.service';
import { FinancialService } from 'src/app/service/Financial/financial.service';
import { ServiceItemService } from 'src/app/service/ServiceItems/service-item.service';
import {  ProjectSizeCheckListService} from 'src/app/service/ProjectSizeCheckList/project-size-check-list.service';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs';
import { ProjectSizedSelectionService } from 'src/app/service/ProjectSizedSelection/project-sized-selection.service';
import { __await } from 'tslib';
import { DraftApplicationsService } from 'src/app/service/DraftApplications/draft-applications.service';
import { ChangeDetectorRef } from '@angular/core';
import { trim } from 'jquery';



/*import { format } from 'path/win32';*/


export interface MandatoryDocumentsLinkedStagesList {
  mandatoryDocumentStageLinkID: number;
  mandatoryDocumentID: number;
  mandatoryDocumentName: string;
  stageID: number;
  stageName: string;
  dateCreated: any;
  uploads: Array<{ filename: string; /*... other properties*/ }>;
}
export interface TypeOfExcavationList {
  typeOfExcavationID: number;
  typeOfExcavationName: string;
  typeOfExcavationDescription: string;
  dateCreated: any;
}

export interface MandatoryDocumentUploadList {
  mandatoryDocumentID: number;
  mandatoryDocumentName: string;
  stageID: number;
  dateCreated: any;
  mandatoryDocumentCategory: string;
}


export interface NotificationsList {
  NotificationID: number;
  NotificationName: string;
  NotificationDescription: string;
  ApplicationID: number;
  UserID: number;
  DateCreated: string;
}

export interface ProjectSizeCheckList {
  projectSizeCheckListActivityType: any;
  ProjectSizeCheckListID: number;
  ProjectSizeCheckListRowNumber: number;
  ProjectSizeCheckListActivity: string;
  MandatoryDocumentCategory: string;
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

export interface DepartmentAdminList {
  userId: any;
  idNumber: string;
  fullName: string;
  departmentAdmin: boolean;
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

export interface SubDepartmentList {
  subDepartmentID: number;
  subDepartmentName: string;
  departmentID: number;
  dateUpdated: any;
  dateCreated: any;
  subdepartmentForCommentID: number | null;
  UserAssaignedToComment: string | null;
  commentStatus: string | null;
  GLCode: string | null;
  ProfitCenter: string | null;
}



const ELEMENT_DATA: PeriodicElement[] = [
  { fileType: "Cover letter explaning the extent of the work" },
  { fileType: "Drawing showing the proposed route and detail regarding the trench cross section, number of pipes etc." },
  { fileType: "A programme with proposed timelines" },
  { fileType: "Proof and payment" },
];

export interface PeriodicElementTest {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface ApplicationList {
  applicationID: number,
  clientName: string,
  clientEmail: string,
  clientAddress: string,
  clientRefNo: string,
  CompanyRegNo: string,
  TypeOfApplication: string,
  NotificationNumber: string,
  WBSNumber: string,
  PhysicalAddressOfProject: string,
  DescriptionOfProject: string,
  NatureOfWork: string,
  ExcavationType: string,
  ExpectedStartDate: Date,
  ExpectedEndDate: Date,
  Location: string,
  clientCellNo: string,
  CreatedById: number,
  ApplicationStatus: string,
  CurrentStageName: string,
  CurrentStageNumber: number,
  CurrentStageStartDate: Date,
  NextStageName: string,
  NextStageNumber: number,
  PreviousStageName: string,
  PreviousStageNumber: number,
  ProjectNumber: string,
  Coordinates: string
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

export interface ServiceItemList {
  serviceItemID: number;
  serviceItemCode: string;
  Description: string;
  Rate: any;
  totalVat: number;
  dateCreated: any;
}

export interface ProjectSizeSelectionList {
  userFullName: string;
  applicationID: number;
  selectedProject: string;
  projectDescription: string;
  dateCreated: any;
  createdById: string;

}

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

  public getTOEValues = this.formBuilder.group({
    TOEName: ['', Validators.required]

  })



  CurrentStageName = '';
  /*Client details*/
  clientUserID = '';
  clientName = '';
  clientSurname = '';
  clientEmail = '';
  clientCellNo = '';
  clientAddress = '';
  clientRefNo = '';//Empty njani?
  clientBPNum = '';
  clientCompanyName = '';
  clientCompanyRegNo = '';
  clientCompanyType = ''; //Empty njani?
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
  coordinates = '';

  TOENAMES ='' ;

  projectNumber = '';

  /*New Engineer information*/
  engineerIDNo = '';
  bpNoApplicant = '';
  professionalRegNo = '';
  name = '';
  surname = '';
  applicantTellNo = '';
  applicantEmail = '';

  /*    expectedStartDatetest = '';*/

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
  DepartmentAdminList: DepartmentAdminList[] = [];
  MandatoryDocumentUploadList: MandatoryDocumentUploadList[] = [];
  /*MandatoryDocumentsLinkedStagesList: MandatoryDocumentsLinkedStagesList[] = [];*/
  MandatoryDocumentsLinkedStagesList = new BehaviorSubject<MandatoryDocumentsLinkedStagesList[]>([]);

  TypeOfExcavationList: TypeOfExcavationList[] = [];
  ApplicationListForReapply: ApplicationList[] = [];
  ServiceItemList: ServiceItemList[] = [];

  //MandatoryDocumentUpload
  MandatoryDocumentUploadListSmall: MandatoryDocumentUploadList[] = [];
  MandatoryDocumentUploadListMedium: MandatoryDocumentUploadList[] = [];
  MandatoryDocumentUploadListLarge: MandatoryDocumentUploadList[] = [];
  MandatoryDocumentUploadListEmergency: MandatoryDocumentUploadList[] = [];
  MandatoryDocumentUploadListDrilling: MandatoryDocumentUploadList[] = [];
  MandatoryDocumentUploadListLUM: MandatoryDocumentUploadList[] = [];

  ProjectSizeCheckList: ProjectSizeCheckList[] = [];
  ProjectSizeSelectionList: ProjectSizeSelectionList[] = [];

  selectionProjectSizeCheck = new SelectionModel<ProjectSizeCheckList>(true, []);
  selectionSmall = new SelectionModel<MandatoryDocumentsLinkedStagesList>(true, []);
  selectionMedium = new SelectionModel<MandatoryDocumentsLinkedStagesList>(true, []);
  selectionLarge = new SelectionModel<MandatoryDocumentsLinkedStagesList>(true, []);
  selectionEmergency = new SelectionModel<MandatoryDocumentsLinkedStagesList>(true, []);
 


  SubDepartmentList: SubDepartmentList[] = [];

  professionalList: any[];

  public external: boolean = true;
  public internal: boolean = false;
  public client: boolean = false;
  public internalProxy: boolean = false;
  public map: boolean = true;
  public newClient: boolean = true;
  public disabled: boolean = false;


  // @Input() isPlanningS: boolean;

  clientSelected = false;
  option: any;
  isAllSelected: any;
  Engineer = "Engineer";
  Contractor = "Contractor";


  isLoading = false;
  public successfulUploads = 0;
  public successfulUploads2 = '';


  //Initialize the interface for ARCGIS
  ARCGISAPIData = {} as ARCGISAPIData;

  reapply: boolean;
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

  ProjectSizeCheckListColumns: string[] = ['ProjectSizeCheckListActivity', 'actions'];
  dataSourceProjectSizeCheckList = this.ProjectSizeCheckList;
  //displayedColumnsMedium: string[] = ['mandatoryDocumentName', 'actions'];
  //dataSourceMedium = this.MandatoryDocumentUploadListMedium;
  //displayedColumnsLarge: string[] = ['mandatoryDocumentName', 'actions'];
  //dataSourceLarge = this.MandatoryDocumentUploadListLarge;
  //displayedColumnsEmergency: string[] = ['mandatoryDocumentName', 'actions'];
  //dataSourceEmergency = this.MandatoryDocumentUploadListEmergency;

  @ViewChild(MatTable) MandatoryDocumentUploadListSmallTable: MatTable<MandatoryDocumentsLinkedStagesList> | undefined;
  @ViewChild(MatTable) MandatoryDocumentUploadListMediumTable: MatTable<MandatoryDocumentsLinkedStagesList> | undefined;
  @ViewChild(MatTable) MandatoryDocumentUploadListLargeTable: MatTable<MandatoryDocumentsLinkedStagesList> | undefined;
  @ViewChild(MatTable) MandatoryDocumentUploadListDrillingTable: MatTable<MandatoryDocumentsLinkedStagesList> | undefined;
  @ViewChild(MatTable) MandatoryDocumentUploadListLUMTable: MatTable<MandatoryDocumentsLinkedStagesList> | undefined;
  @ViewChild(MatTable) MandatoryDocumentUploadListEmergencyTable: MatTable<MandatoryDocumentsLinkedStagesList> | undefined;



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
  applicationID = 0;
  notiName: string;
  notiDescription: string;
  //CoverLetterFileName = "Choose file";
  private readonly apiUrl: string = this.shared.getApiUrl() + '/api/';

  additionalUploaders: any[] = [];

  fileAttrs: string[] = [];
  TOE = "";
  isPlanning = false;

  configNumberOfProject: any;
  configMonthYear: any;
  accountNumber: any;
  generatedInvoiceNumber: string;
  totalDocs: number;
  totalDocs2: string;

  Emailmessage: string;
  projects: any;
  isDraft: boolean = false;
  draftExcavationType: string = "";

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
    public shared: SharedService,
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
    private sanitizer: DomSanitizer,
    private subDepartmentForCommentService: SubDepartmentForCommentService,
    private notificationsService: NotificationsService,
    private subDepartmentsService: SubDepartmentsService,
    private typeOfExcavationService: TypeOfExcavationService,
    private route: ActivatedRoute,
    private configService: ConfigService,
    private refreshService: RefreshService,
    private selectEngineerTableComponent: SelectEngineerTableComponent,
    private selectContractorTableComponent: SelectContractorTableComponent,
    private zoneForCommentService: ZoneForCommentService,
    private serviceItemService: ServiceItemService,
    private financialService: FinancialService,
    private projectSizeCheckListService: ProjectSizeCheckListService,
    private projectSizeSelectionService: ProjectSizedSelectionService,
    private draftApplicationsService: DraftApplicationsService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.refreshService.enableRefreshNavigation('/home');

    this.route.queryParams.subscribe(params => {

      this.isPlanning = params['isPlanningS'] === 'true';

    });

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
    this.getAllTOE();

    this.getAllDepartmentAdminsForNotifications();

    this.initializeReapply();

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

    this.reciveOption();
    this.getAllSubDepartments();
    this.getServiceItem("001");
    this.getServiceItem("002");
    this.getServiceItem("003");



    //const imagePath = 'assets/cctlogoblack.png';
    //this.logoUrl = this.sanitizer.bypassSecurityTrustUrl(imagePath);
    this.getAllProjectSizeCheckList();
    this.getAllByMandatoryDocumentCategory("Small");
    this.getAllByMandatoryDocumentCategory("Medium");
    this.getAllByMandatoryDocumentCategory("Large");
    this.getAllByMandatoryDocumentCategory("Emergency");
    this.getAllByMandatoryDocumentCategory("Drilling");
    this.getAllByMandatoryDocumentCategory("LUM");
    debugger;
    this.isDraft = this.shared.isDraft;
    if (this.isDraft == true) {
      this.onPopulateDraftInfo(this.shared.applicationID);

    }

  }



  ngOnDestroy() {
    this.refreshService.disableRefreshNavigation();
  }

  handleProfessionalListChange(newProfessionalList: any) {
    this.professionalList = newProfessionalList;
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

  reciveOption() {
    this.option = this.shared.option;
    if (this.option == "client") {
      this.client = true;
      this.external = false;
      this.internal = false;
      this.map = true;
      this.populateClientInfo(this.shared.clientUserID);
      this.clientUserID = this.shared.clientUserID;


    }
    else if (this.option == "proxy") {
      debugger;
      this.external = false;
      this.internalProxy = true;//I hope this will get me the right divs

      this.clientUserID = this.shared.clientUserID;

      //this.populateClientInfo(this.clientUserID);
      this.userPofileService.getUserProfileById(this.clientUserID).subscribe((data: any) => {

        if (data.responseCode == 1) {
          debugger;

          console.log("data", data.dateSet);

          const targetUserProfile = data.dateSet[0];
          const fullname = targetUserProfile.fullName;

          this.internalName = fullname.substring(0, fullname.indexOf(' '));
          this.internalSurname = fullname.substring(fullname.indexOf(' ') + 1);
          //Welp, what happens when a person is both internal but a 'client'?
          this.clientName = fullname.substring(0, fullname.indexOf(' '));
          this.clientSurname = fullname.substring(fullname.indexOf(' ') + 1);
          this.clientEmail = targetUserProfile.email;
          this.clientCellNo = targetUserProfile.phoneNumber;
          this.clientIDNumber = targetUserProfile.idNumber;
          //I need the email
          //directorate is the department name for displaying to the user and departmentID is what we we may need to send to the db
          this.internalDepartmentName = targetUserProfile.directorate;
          //the is where the departmentID is saved
          this.internalDepartmentID = targetUserProfile.departmentID;
          this.internalBranch = targetUserProfile.branch;
          this.internalCostCenterNumber = targetUserProfile.costCenterNumber;
          this.internalCostCenterOwner = targetUserProfile.costCenterOwner;

        }

        else {

          alert(data.responseMessage);
        }
        console.log("reponse", data);

      }, error => {
        console.log("Error: ", error);
      })
    }
    else if (this.option == "internal" && this.option != 'proxy') {
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
        //this.getAllManDocsByStageID();

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

  getServiceItem(serviceItemCode: string) {



    this.serviceItemService.getServiceItemByServiceItemCode(serviceItemCode).subscribe((data: any) => {
      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempServiceItemList = {} as ServiceItemList;
          const current = data.dateSet[i];
          tempServiceItemList.serviceItemCode = current.serviceItemCode;
          tempServiceItemList.Rate = current.rate;
          tempServiceItemList.Description = current.description;

          this.ServiceItemList.push(tempServiceItemList);

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
    /*    this.shared.setApplicationID(this.notificationNumber);*/
    /*    this.shared.setCreatedByID(this.CurrentUser.appUserId)*/
  }

  onAutoLinkDepartment(subDepartmentID: any, subDepartmentName: any, zoneID: any, zoneName: any) {

    this.subDepartmentForCommentService.addUpdateDepartmentForComment(0, this.applicationID, subDepartmentID, subDepartmentName, null, null, this.CurrentUser.appUserId, zoneID, zoneName)
      .subscribe((data: any) => {
        if (data.responseCode == 1) {
          //alert(data.responseMessage);
        }
        console.log("reponseAddUpdateDepartmentForComment", data);
      },
        error => {
          console.log("Error: ", error);
        }
      );

  }


  //onLinkDepartmentForComment() {


  //  for (var i = 0; i < selectDepartments.length; i++) {
  //    this.subDepartmentForCommentService.addUpdateDepartmentForComment(0, this.applicationID, selectDepartments[i].subDepartmentID, selectDepartments[i].subDepartmentName, null, null, this.CurrentUser.appUserId).subscribe((data: any) => {

  //      if (data.responseCode == 1) {

  //        alert(data.dateSet.subDepartmentName + " assigned to this Application");

  //      }
  //      else {

  //        alert(data.responseMessage);
  //      }
  //      console.log("reponseAddUpdateDepartmentForComment", data);


  //    }, error => {
  //      console.log("Error: ", error);
  //    })
  //  }



  //}


  buildProjectNumber() {

    this.configService.getConfigsByConfigName("ProjectNumberTracker").subscribe((data: any) => {
      if (data.responseCode == 1) {

        const current = data.dateSet[0];
        this.configNumberOfProject = current.utilitySlot1;
        this.configMonthYear = current.utilitySlot2;
        this.configService.addUpdateConfig(current.configID, null, null, (Number(this.configNumberOfProject) + 1).toString(), null, null, null).subscribe((data: any) => {
          if (data.responseCode == 1) {


          }
          else {
            //alert("Invalid Email or Password");
            alert(data.responseMessage);
          }
          console.log("addUpdateConfigReponse", data);

        }, error => {
          console.log("addUpdateConfigError: ", error);
        })

        // 
        //this.applicationsService.addUpdateApplication(this.applicationID, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "WL:" + (Number(this.configNumberOfProject) + 1).toString() + this.configMonthYear, null).subscribe((data: any) => {
        //  
        //  if (data.responseCode == 1) {
        //    
        //    alert("Your project number is: " + data.dateSet[0].projectNumber);


        //  }
        //  else {
        //    alert(data.responseMessage);
        //  }
        //  console.log("responseAddapplication", data);

        //}, error => {
        //  console.log("Error", error);
        //})


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


  //12102023: EDIT THIS SO THAT IT WORKS FOR THE ... CREATE WAYLEAVE ON BEHALF OF SOMEONE INTERNAL 
  internalProxyWayleaveCreate(appUserId: string, isPlanning: boolean): void {
    /*    this.shared.setApplicationID(this.notificationNumber);*/
    debugger;
    console.log("Turtle Turtle, where are you? 3" + appUserId);

    this.physicalAddressOfProject = this.shared.getAddressData();
    this.coordinates = this.shared.getCoordinateData();
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

    this.configService.getConfigsByConfigName("ProjectNumberTracker").subscribe((data: any) => {
      if (data.responseCode == 1) {
        debugger;
        const current = data.dateSet[0];
        this.configNumberOfProject = current.utilitySlot1;
        this.configMonthYear = current.utilitySlot2;
        this.configService.addUpdateConfig(current.configID, null,null, (Number(this.configNumberOfProject) + 1).toString(), null, null, null).subscribe((data: any) => {
          if (data.responseCode == 1) {
            debugger;
            //ARGUMENTS NEED CAREFUL ALTERATIONS - OBVIOUSLY CURRENT USER IS THE ORIGINATOR, ARE THEY GOING TO GET THE EMAILS OR IS THE APPLICANT GOING TO GET AN EMAIL??

            
            this.applicationsService.addUpdateApplication(this.applicationID, appUserId, this.internalName + ' ' + this.internalSurname, this.clientEmail, this.clientCellNo, null, null,
              null, this.ProjectSizeMessage, this.notificationNumber, this.wbsNumber, this.physicalAddressOfProject, this.descriptionOfProject, this.natureOfWork, this.TOE,
              this.expectedStartDate, this.expectedEndType, null, this.CurrentUser.appUserId, previousStageNameIn, 0, CurrentStageNameIn, 2, NextStageNameIn, 3,
              "Distributed", false, "WL:" + (Number(this.configNumberOfProject) + 1).toString() + "/" + this.configMonthYear, isPlanning, null, null, null, this.coordinates).subscribe((data: any) => {
              if (data.responseCode == 1) {
                debugger;
                alert("Application Created");
                if (isPlanning == false) {
                  this.AddProfessinal(contractorData, engineerData);
                }
                // this.UploadDocuments(data.dateSet);

                this.shared.setApplicationID(0);
                this.shared.clearContractorData();
                this.shared.clearEngineerData();
              }
              else {
                alert("Failed To Create Application");
              }


                this.router.navigate(["/home"]);
                if (this.isDraft === false) {
                  this.notificationsService.sendEmail(this.CurrentUser.email, "Wayleave application submission", "check html", "Dear " + this.CurrentUser.fullName + ",<br><br><p>Your application (" + "WL:" + (Number(this.configNumberOfProject) + 1).toString() + "/" + this.configMonthYear + ") for wayleave has been captured. You will be notified once your application has reached the next stage in the process.<br><br>Regards,<br><b>Wayleave Management System<b><br><img src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png'>");
                  /*              this.addToSubDepartmentForComment();*/
                  this.notificationsService.addUpdateNotification(0, "Application Submission", "New wayleave application submission", false, this.DepartmentAdminList[0].userId, this.CurrentUser.appUserID, this.applicationID, "Your application (" + "WL:" + (Number(this.configNumberOfProject) + 1).toString() + "/" + this.configMonthYear + ") for wayleave has been captured. You will be notified once your application has reached the next stage in the process.").subscribe((data: any) => {

                    if (data.responseCode == 1) {
                      alert(data.responseMessage);

                    }
                    else {
                      alert(data.responseMessage);
                    }

                    console.log("response", data);
                  }, error => {
                    console.log("Error", error);
                  });
                }

              const projectNum = "WL:" + (Number(this.configNumberOfProject) + 1).toString() + "/" + this.configMonthYear;
              const emailContentOriginator = `
     <html>
        <head>
          <style>
            /* Define your font and styles here */
            body {
              font-family: Arial, sans-serif;
            }
            .email-content {
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            .footer {
              margin-top: 20px;
              color: #777;
            }
            .footer-logo {
              display: inline-block;
              vertical-align: middle;
            }
          </style>
        </head>
        <body>
          <div class="email-content">
            <p>Dear ${this.CurrentUser.fullName},</p>
            <p>Your application for a Wayleave from The City of Cape Town has been assigned Ticket no. ${this.applicationID}. Kindly upload proof of payment of the required non-refundable application fee. You will be notified once your application proceeds to the next stage.</p>
            <p>Should you have any queries, please contact <a href="mailto:wayleaves@capetown.gov.za">wayleaves@capetown.gov.za</a></p>
                <p >Regards,<br><a href="https://wayleave.capetown.gov.za/">Wayleave Management System</a></p>
                          <p>
              <a href="https://www.capetown.gov.za/">CCT Web</a> | <a href="https://www.capetown.gov.za/General/Contact-us">Contacts</a> | <a href="https://www.capetown.gov.za/Media-and-news">Media</a> | <a href="https://eservices1.capetown.gov.za/coct/wapl/zsreq_app/index.html">Report a fault</a> | <a href="mailto:accounts@capetown.gov.za?subject=Account query">Accounts</a>              
            </p>
             <img class="footer-logo" src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png' alt="Wayleave Management System Logo" width="100">
          </div>
        </body>
      </html>
    `;
                const emailContentApplicant = `
      <html>
        <head>
          <style>
            /* Define your font and styles here */
            body {
              font-family: Arial, sans-serif;
            }
            .email-content {
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            .footer {
              margin-top: 20px;
              color: #777;
            }
            .footer-logo {
              display: inline-block;
              vertical-align: middle;
            }
          </style>
        </head>
        <body>
          <div class="email-content">
            <p>Dear ${this.internalName + ' ' + this.internalSurname},</p>
            <p>Your application <strong>${ projectNum }</strong> for a Wayleave has been captured. Please use this reference number in all further correspondence. You will be notified once your application proceeds to the next stage. </p>
            <p>Should you have any queries, please contact <a href="mailto:wayleaves@capetown.gov.za">wayleaves@capetown.gov.za</a></p>
                <p >Regards,<br><a href="https://wayleave.capetown.gov.za/">Wayleave Management System</a></p>
                          <p>
              <a href="https://www.capetown.gov.za/">CCT Web</a> | <a href="https://www.capetown.gov.za/General/Contact-us">Contacts</a> | <a href="https://www.capetown.gov.za/Media-and-news">Media</a> | <a href="https://eservices1.capetown.gov.za/coct/wapl/zsreq_app/index.html">Report a fault</a> | <a href="mailto:accounts@capetown.gov.za?subject=Account query">Accounts</a>              
            </p>
             <img class="footer-logo" src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png' alt="Wayleave Management System Logo" width="100">
          </div>
        </body>
      </html>
    `;
                this.notificationsService.sendEmail(this.CurrentUser.email, "New wayleave application", emailContentOriginator, emailContentOriginator);
                this.notificationsService.sendEmail(this.clientEmail, "New wayleave application", emailContentApplicant, emailContentApplicant);
              /*              this.addToSubDepartmentForComment();*/
              this.Emailmessage = "A Wayleave application with ID " + this.applicationID + " and project reference number:" + projectNum + " has just been captured. You will be notified once your application has reached the next stage in the process.";
                this.onCreateNotification();
                this.onCreateNotificationApplicant();


              //Send emails to zone department admins
              this.shared.distributionList.forEach((obj) => {


                const emailContent2 = `
      <html>
        <head>
          <style>
            /* Define your font and styles here */
            body {
             font-family: 'Century Gothic';
            }
            .email-content {
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            .footer {
              margin-top: 20px;
              color: #777;
            }
            .footer-logo {
              display: inline-block;
              vertical-align: middle;
            }
          </style>
        </head>
        <body>
          <div class="email-content">
            <p>Dear ${obj.fullName},</p>
            <p>A Wayleave application with ID ${this.applicationID} has just been captured. As the zone admin of ${obj.zoneName} in ${obj.subDepartmentName}, please assign a reviewer to the application.</p>
            <p>Should you have any queries, please contact us at <a href="mailto:wayleaves@capetown.gov.za">wayleaves@capetown.gov.za</a></p>
          </div>
          <div class="footer">

            <img class="footer-logo" src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png' alt="Wayleave Management System Logo" width="100">
            <p>Regards,<br>Wayleave Management System</p>
            <p>
              <a href="#">CCT Web</a> | <a href="#">Contacts</a> | <a href="#">Media</a> | <a href="#">Report a fault</a> | <a href="#">Accounts</a>
            </p>
          </div>
        </body>
      </html>
    `;

                this.notificationsService.sendEmail(obj.email, "New wayleave application", emailContent2, emailContent2);
                this.notificationsService.addUpdateNotification(0, "Application Created", "New wayleave application", false, obj.userID, this.CurrentUser.appUserID, this.applicationID, "A Wayleave application with ID ${this.applicationID} has just been captured. As the zone admin of " + obj.zoneName + "in" + obj.subDepartmentName + " , please assign a reviewer to the application.").subscribe((data: any) => {

                  if (data.responseCode == 1) {
                    alert(data.responseMessage);

                  }
                  else {
                    alert(data.responseMessage);
                  }                                                                                                                                  

                  console.log("response", data);
                }, error => {
                  console.log("Error", error);
                })

              })

              this.addToZoneForComment();

              console.log("responseAddapplication", data);
            }, error => {
              console.log("Error", error);
            });
          }
          else {

            alert("Update Config Error");
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


  internalWayleaveCreate(appUserId: string, isPlanning: boolean): void {
    /*    this.shared.setApplicationID(this.notificationNumber);*/
    debugger;
    console.log("Turtle Turtle, where are you? 3" + appUserId);

    this.physicalAddressOfProject = this.shared.getAddressData();
    this.coordinates = this.shared.getCoordinateData();
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

    this.configService.getConfigsByConfigName("ProjectNumberTracker").subscribe((data: any) => {
      if (data.responseCode == 1) {
        debugger;
        const current = data.dateSet[0];
        const configID = current.configID;
        this.configNumberOfProject = current.utilitySlot1;
        this.configMonthYear = current.utilitySlot2;
        debugger;
        this.configService.addUpdateConfig(configID, "ProjectNumberTracker", null, (Number(this.configNumberOfProject) + 1).toString(), null, null, null).subscribe((data: any) => {
          if (data.responseCode == 1) {

            debugger;
            this.applicationsService.addUpdateApplication(this.applicationID, appUserId, this.internalName + ' ' + this.internalSurname, this.CurrentUser.email, null, null, null,
              null, this.ProjectSizeMessage, this.notificationNumber, this.wbsNumber, this.physicalAddressOfProject, this.descriptionOfProject, this.natureOfWork, this.TOE,
              this.expectedStartDate, this.expectedEndType, null, this.CurrentUser.appUserId, previousStageNameIn, 0, CurrentStageNameIn, 2, NextStageNameIn, 3,
              "Distributed", this.isDraft, "WL:" + (Number(this.configNumberOfProject) + 1).toString() + "/" + this.configMonthYear, isPlanning, null, null, null, this.coordinates).subscribe((data: any) => {
                if (data.responseCode == 1) {
                  this.SavedProjectSizeSelections();
                  if (this.isDraft == true) {
                    this.draftApplicationsService.addUpdateDraftApplication(0, this.applicationID, appUserId, this.internalName + " " + this.internalSurname, this.CurrentUser.email, null, null, null, null, this.ProjectSizeMessage, this.wbsNumber, this.physicalAddressOfProject, this.descriptionOfProject
                      , this.natureOfWork, this.TOE, this.expectedStartDate, this.expectedEndType, this.CurrentUser.appUserId, "WL:" + (Number(this.configNumberOfProject) + 1).toString() + "/" + this.configMonthYear, contractorData[0].name, engineerData[0].name).subscribe((data: any) => {
                        alert("Draft Saved")
                        console.log("response", data);


                      }, error => {
                        console.log("Error: ", error);
                      })
                  }
                  debugger;
                  alert("Application Created");
                  if (isPlanning == false) {
                    this.AddProfessinal(contractorData, engineerData);
                  }
                  // this.UploadDocuments(data.dateSet);

                  this.shared.setApplicationID(0);
                  this.shared.clearContractorData();
                  this.shared.clearEngineerData();
                }
                else {
                  alert("Failed To Create Application");
                }


                this.router.navigate(["/home"]);
                debugger;
                if (this.isDraft === false) {
                  this.notificationsService.sendEmail(this.CurrentUser.email, "Wayleave application submission", "check html", "Dear " + this.CurrentUser.fullName + ",<br><br><p>Your application (" + "WL:" + (Number(this.configNumberOfProject) + 1).toString() + "/" + this.configMonthYear + ") for wayleave has been captured. You will be notified once your application has reached the next stage in the process.<br><br>Regards,<br><b>Wayleave Management System<b><br><img src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png'>");
                  /*              this.addToSubDepartmentForComment();*/
                  this.notificationsService.addUpdateNotification(0, "Application Submission", "New wayleave application submission", false, this.DepartmentAdminList[0].userId, this.CurrentUser.appUserID, this.applicationID, "Your application (" + "WL:" + (Number(this.configNumberOfProject) + 1).toString() + "/" + this.configMonthYear + ") for wayleave has been captured. You will be notified once your application has reached the next stage in the process.").subscribe((data: any) => {

                    if (data.responseCode == 1) {
                      alert(data.responseMessage);

                    }
                    else {
                      alert(data.responseMessage);
                    }

                    console.log("response", data);
                  }, error => {
                    console.log("Error", error);
                  });
                }

                const projectNum = "WL:" + (Number(this.configNumberOfProject) + 1).toString() + "/" + this.configMonthYear;
                const emailContent = `
      <html>
        <head>
          <style>
            /* Define your font and styles here */
            body {
              font-family: Arial, sans-serif;
            }
            .email-content {
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            .footer {
              margin-top: 20px;
              color: #777;
            }
            .footer-logo {
              display: inline-block;
              vertical-align: middle;
            }
          </style>
        </head>
        <body>
          <div class="email-content">
            <p>Dear ${this.CurrentUser.fullName},</p>
            <p>A Wayleave application with ID ${this.applicationID} and project reference number: ${projectNum} has just been captured. You will be notified once your application has reached the next stage in the process.</p>
            <p>Should you have any queries, please contact us at <a href="mailto:wayleaves@capetown.gov.za">wayleaves@capetown.gov.za</a></p>
          </div>
          <div class="footer">

            <img class="footer-logo" src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png' alt="Wayleave Management System Logo" width="100">
            <p>Regards,<br>Wayleave Management System</p>
            <p>
              <a href="#">CCT Web</a> | <a href="#">Contacts</a> | <a href="#">Media</a> | <a href="#">Report a fault</a> | <a href="#">Accounts</a>
            </p>
          </div>
        </body>
      </html>
    `;

                if (this.isDraft === false) {
                  this.notificationsService.sendEmail(this.CurrentUser.email, "New wayleave application", emailContent, emailContent);
                  /*              this.addToSubDepartmentForComment();*/
                  this.Emailmessage = "A Wayleave application with ID " + this.applicationID + " and project reference number:" + projectNum + " has just been captured. You will be notified once your application has reached the next stage in the process.";
                  this.onCreateNotification();
                }
              


                //Send emails to zone department admins
                this.shared.distributionList.forEach((obj) => {


                  const emailContent2 = `
      <html>
        <head>
          <style>
            /* Define your font and styles here */
            body {
             font-family: 'Century Gothic';
            }
            .email-content {
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            .footer {
              margin-top: 20px;
              color: #777;
            }
            .footer-logo {
              display: inline-block;
              vertical-align: middle;
            }
          </style>
        </head>
        <body>
          <div class="email-content">
            <p>Dear ${obj.fullName},</p>
            <p>A Wayleave application with ID ${this.applicationID} has just been captured. As the zone admin of ${obj.zoneName} in ${obj.subDepartmentName}, please assign a reviewer to the application.</p>
            <p>Should you have any queries, please contact us at <a href="mailto:wayleaves@capetown.gov.za">wayleaves@capetown.gov.za</a></p>
          </div>
          <div class="footer">

            <img class="footer-logo" src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png' alt="Wayleave Management System Logo" width="100">
            <p>Regards,<br>Wayleave Management System</p>
            <p>
              <a href="#">CCT Web</a> | <a href="#">Contacts</a> | <a href="#">Media</a> | <a href="#">Report a fault</a> | <a href="#">Accounts</a>
            </p>
          </div>
        </body>
      </html>
    `;

                  if (this.isDraft === false) {
                    this.notificationsService.sendEmail(obj.email, "New wayleave application", emailContent2, emailContent2);
                    this.notificationsService.addUpdateNotification(0, "Application Created", "New wayleave application", false, obj.userID, this.CurrentUser.appUserID, this.applicationID, "A Wayleave application with ID ${this.applicationID} has just been captured. As the zone admin of " + obj.zoneName + "in" + obj.subDepartmentName + " , please assign a reviewer to the application.").subscribe((data: any) => {

                      if (data.responseCode == 1) {
                        alert(data.responseMessage);

                      }
                      else {
                        alert(data.responseMessage);
                      }

                      console.log("response", data);
                    }, error => {
                      console.log("Error", error);
                    })
                    this.addToZoneForComment();
                  }

                })



                console.log("responseAddapplication", data);
              }, error => {
                console.log("Error", error);
              });
          }
          else {

            alert("Update Config Error");
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

  clientWayleaveCreate(appUserId: string, isPlanning: boolean): void {
    debugger;
    /*    this.shared.setApplicationID(this.notificationNumber);*/
    console.log("Turtle Turtle, where are you? 4" + appUserId);
    this.physicalAddressOfProject = this.shared.getAddressData();
    this.coordinates = this.shared.getCoordinateData();
    const contractorData = this.shared.getContactorData();
    const engineerData = this.shared.getEngineerData();
    let previousStageName = "";
    let CurrentStageName = "";
    let NextStageName = "";

    let previousStageNameIn = "";
    let CurrentStageNameIn = "";
    let NextStageNameIn = "";

    for (var i = 0; i < this.StagesList.length; i++) {

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

    this.applicationsService.addUpdateApplication(this.applicationID, appUserId, this.clientName + ' ' + this.clientSurname, this.clientEmail, this.clientCellNo, this.clientAddress, this.clientRefNo, '0', this.ProjectSizeMessage, this.notificationNumber, this.wbsNumber, this.physicalAddressOfProject, this.descriptionOfProject, this.natureOfWork, this.TOE, this.expectedStartDate, this.expectedEndType, '10 Stella Road, Newholme, PMB, KZN', this.CurrentUser.appUserId, previousStageName, 0, CurrentStageName, 1, NextStageName, 2, "Unpaid", this.isDraft, null, isPlanning, null, null, null, this.coordinates).subscribe((data: any) => {

      if (data.responseCode == 1) {
        this.SavedProjectSizeSelections();
        debugger;
        if (this.isDraft == true) {
          this.draftApplicationsService.addUpdateDraftApplication(0, this.applicationID, appUserId, this.clientName + " " + this.clientSurname, this.clientEmail, this.clientCellNo, this.clientAddress, this.clientRefNo, this.clientCompanyRegNo, this.ProjectSizeMessage, this.wbsNumber, this.physicalAddressOfProject, this.descriptionOfProject
            , this.natureOfWork, this.TOE, this.expectedStartDate, this.expectedEndType, this.CurrentUser.appUserId, null, contractorData[0].name, engineerData[0].name ).subscribe((data: any) => {
              if (data.responseCode === 1) {
                alert("Draft Saved")

              }
              else {
                alert(data.responseMessage);

              }
              console.log("response", data);


            }, error => {
              console.log("Error: ", error);
            })
        }
        if (isPlanning == false) {
          this.AddProfessinal(contractorData, engineerData);
        }

        //this.UploadDocuments(data.dateSet);
        // this.onAutoLinkDepartment();
        this.shared.setApplicationID(0);
        this.shared.clearContractorData();
        this.shared.clearEngineerData();
        alert("Client Application Created");

        if (this.isDraft === false) {
          this.addToZoneForComment();
          this.getCurrentInvoiceNumberForGen(this.clientName + ' ' + this.clientSurname);
        }
        debugger;
      }
      else {
        alert("Failed To Create Application");
      }

      this.Emailmessage = "Your application (" + this.projectNumber + ") for wayleave has been captured. You will be notified once your application has reached the next stage in the process."
      //Sends emails to the entire EMB department, as per process flow.
      if (this.isDraft === false) {
        this.onCreateNotification();
        //Sends notification to applying user.
        this.notificationsService.sendEmail(this.CurrentUser.email, "Wayleave application submission", "check html", "Dear " + this.CurrentUser.fullName + "<br><br><p>Your application (" + this.applicationID + ") for wayleave has been captured. You will be notified once your application has reached the next stage in the process.<br><br>Thank you</p>");
        //Sends emails to the entire EMB department, as per process flow.
        this.sendEmailToDepartment("EMB");
      }
      this.router.navigate(["/home"]);
      console.log("responseAddapplication", data);
    }, error => {
      console.log("Error", error);
    })

  }

  externalWayleaveCreate(appUserId: string, isPlanning: boolean): void {
    debugger;
    /*    this.shared.setApplicationID(this.notificationNumber);*/
    debugger;
    console.log("Turtle Turtle, where are you? 5 " + appUserId);
    this.physicalAddressOfProject = this.shared.getAddressData();
    this.coordinates = this.shared.getCoordinateData();
    const contractorData = this.shared.getContactorData();
    const engineerData = this.shared.getEngineerData();
    let previousStageName = "";
    let CurrentStageName = "";
    let NextStageName = "";

    let previousStageNameIn = "";
    let CurrentStageNameIn = "";
    let NextStageNameIn = "";

    for (var i = 0; i < this.StagesList.length; i++) {

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


    this.applicationsService.addUpdateApplication(this.applicationID, this.CurrentUser.appUserId, this.externalName + ' ' + this.externalSurname, this.externalEmail, "Phone", this.externalAddress, null, null, this.ProjectSizeMessage, this.notificationNumber, this.wbsNumber, this.physicalAddressOfProject, this.descriptionOfProject, this.natureOfWork, this.TOE, this.expectedStartDate, this.expectedEndType, this.externalAddress, appUserId, previousStageName, 0, CurrentStageName, 1, NextStageName, 2, "Unpaid", this.isDraft, null, isPlanning, null, null, null, this.coordinates).subscribe((data: any) => {
      if (data.responseCode == 1) {
        debugger;
        this.SavedProjectSizeSelections();
        if (this.isDraft == true) {
          this.draftApplicationsService.addUpdateDraftApplication(0, this.applicationID, this.CurrentUser.appUserId, this.externalName + " " + this.externalSurname, this.externalEmail, "Phone", this.externalAddress, this.clientRefNo, this.clientCompanyRegNo, this.ProjectSizeMessage, this.wbsNumber, this.physicalAddressOfProject, this.descriptionOfProject, this.natureOfWork, this.TOE, this.expectedStartDate, this.expectedEndType, appUserId, null, contractorData[0].name, engineerData[0].name).subscribe((data: any) => {
            if (data.responseCode === 1) {
              debugger;
              alert("Draft Saved")

            }
            else {
              alert(data.responseMessage);

            }
            console.log("response", data);


          }, error => {
            console.log("Error: ", error);
          })
        }
        if (isPlanning == false) {
          this.AddProfessinal(contractorData, engineerData);
        }

        // this.UploadDocuments(data.dateSet);
        // this.onAutoLinkDepartment();
        this.shared.setApplicationID(0);
        this.shared.clearContractorData();
        this.shared.clearEngineerData();
        alert("Application Created");

        if (this.isDraft === false) {
          this.addToZoneForComment();
          this.getCurrentInvoiceNumberForGen(this.externalName + ' ' + this.externalSurname);
        }

      }
      else {
        alert("Failed To Create Application");
      }
      if (this.isDraft === false) {
        this.onCreateNotification();
        this.notificationsService.sendEmail(this.CurrentUser.email, "Wayleave application submission", "check html", "Dear " + this.CurrentUser.fullName + "<br><br><p>Your application (" + this.applicationID + ") for wayleave has been captured. You will be notified once your application has reached the next stage in the process.<br><br>Thank you</p>");

      }
      this.router.navigate(["/home"]);
      console.log("responseAddapplication", data);
    }, error => {
      console.log("Error", error);
    })
  }

  AddProfessinal(contractorData: any, engineerData: any): void {
    if (contractorData.length > 0) {
      for (var i = 0; i < contractorData.length; i++) {
        this.addProfessionalsLinks(this.applicationID, contractorData[i].professinalID);
      };
    } else {
      //  alert("This Application have no contractors linked");
    }


    //Add professional link for engineers when application is successfully captured
    if (engineerData.length > 0) {
      for (var i = 0; i < engineerData.length; i++) {
        this.addProfessionalsLinks(this.applicationID, engineerData[i].professinalID);
      };
    }
    else {
      //  alert("This Application have no engineers linked");
    }
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

  UploadDocuments(applicationData: any): void {
    //Pulling information from the share
    const filesForUpload = this.shared.pullFilesForUpload();
    for (var i = 0; i < filesForUpload.length; i++) {
      const formData = new FormData();
      let fileExtention = filesForUpload[i].UploadFor.substring(filesForUpload[i].UploadFor.indexOf('.'));
      let fileUploadName = filesForUpload[i].UploadFor.substring(0, filesForUpload[i].UploadFor.indexOf('.')) + "_appID" + this.applicationID;
      formData.append('file', filesForUpload[i].formData, fileUploadName + fileExtention);



      this.http.post(this.apiUrl + 'documentUpload/UploadDocument', formData, { reportProgress: true, observe: 'events' })
        .subscribe({
          next: (event) => {

            if (event.type === HttpEventType.UploadProgress && event.total)
              this.progress = Math.round(100 * event.loaded / event.total);
            else if (event.type === HttpEventType.Response) {
              this.message = 'Upload success.';
              this.uploadFinished(event.body, this.applicationID, applicationData);
            }
          },
          error: (err: HttpErrorResponse) => console.log(err)
        });
    }
  }


  CheckTOES() {

    let tempList = []; // Temporary list to collect all new entries

    for (var i = 0; i < this.TOENAMES.length; i++) {
      let current = this.TOENAMES[i].toString();
      if (current == "Drilling") {
        const newList = this.MandatoryDocumentUploadListDrilling.map(current => {
          const tempMandatoryDocumentsLinkedStagesList = {} as MandatoryDocumentsLinkedStagesList;
          tempMandatoryDocumentsLinkedStagesList.stageID = current.stageID;
          tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentStageLinkID = null;
          tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentID = current.mandatoryDocumentID;
          tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentName = current.mandatoryDocumentName;
          tempMandatoryDocumentsLinkedStagesList.stageName = null;
          tempMandatoryDocumentsLinkedStagesList.dateCreated = current.dateCreated;
          return tempMandatoryDocumentsLinkedStagesList;
        });

        tempList = tempList.concat(newList);
      }
    }

    // Assuming MandatoryDocumentsLinkedStagesList is an observable, extract its current value
    const currentList = this.MandatoryDocumentsLinkedStagesList.getValue();

    // Concatenate currentList and tempList
    const updatedList = currentList.concat(tempList);

    this.MandatoryDocumentsLinkedStagesList.next(updatedList);
    this.totalDocs = updatedList.length;
    this.totalDocs2 = Number(this.totalDocs).toString();
    console.log("this.totalDocs;this.totalDocs", this.totalDocs);
  }



  onWayleaveCreate(appUserId, isPlanning: boolean, isDraft: boolean) {
    debugger;
    console.log("Turtle Turtle, where are you? " + appUserId);

    //get ApplicationID form Shared to check if must update
    this.applicationID = this.shared.getApplicationID();
    this.isDraft = isDraft;
    console.log("What gaan an? " + this.shared.getApplicationID());
    debugger;

    if (this.applicationID === 0) {

      this.shared.clearContractorData();
      this.shared.clearEngineerData();

      this.applicationsService.addUpdateApplication(0, appUserId, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,isDraft, null, isPlanning, null, null, null).subscribe((data: any) => {
        if (data.responseCode == 1) {


          //Set ApplicationID to Update
          this.shared.setApplicationID(data.dateSet.applicationID);

          this.shared.userIDForWalkIn = appUserId;
          this.router.navigate(["/new-wayleave"], { queryParams: { isPlanningS: isPlanning } });
        }
        else {

          alert("GIS Error");
        }

        console.log("responseAddApplication", data);

      }, error => {
        console.log("Error", error);
        console.log("Turtle?!!!!!" + appUserId);
      })
    } else {
      // If this.applicationID != 0 then we do the update


      for (var i = 0; i < this.TOENAMES.length; i++) {
        let current = this.TOENAMES[i].toString();
        if (i > 0) {
          this.TOE = this.TOE + ", " + current
        } else {
          this.TOE = current;
        }

      }




      if (this.internal && this.option != "proxy") {

        this.internalWayleaveCreate(appUserId, isPlanning);
        console.log('Co-ordinates:', this.coordinates);

      }
    
      else if (this.internalProxy) {
        const appUserId = this.shared.clientUserID;
        this.internalProxyWayleaveCreate(appUserId, isPlanning);
      }
      else if (this.client || this.option == "proxy" ) {
        debugger; //the issue is - an internal person can be a client
        //this.clientWayleaveCreate(appUserId, isPlanning);
        const appUserId = this.shared.clientUserID;
        this.clientWayleaveCreate(appUserId, isPlanning);

        console.log('Co-ordinates:', this.coordinates);
      }
      else { //External
        this.externalWayleaveCreate(appUserId, isPlanning);
        console.log('Co-ordinates:', this.coordinates);

      }


    }



  }

  OLDonWayleaveCreate(appUserId, isPlanning: boolean) {

    debugger;
    console.log("Turtle Turtle, where are you? 2" + appUserId);

    //this.isPlanning = isPlanning;

    this.applicationID = this.shared.getApplicationID();
    this.projectNumber = this.shared.getProjectNumber();



    //Check if applicationid exists or not.


    if (this.applicationID != undefined || this.applicationID != null) {

    } else {
      this.applicationID = 0;
      this.shared.clearContractorData();
      this.shared.clearEngineerData();
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
    if (isPlanning === true) {

      //Code for Planning 
      if (this.internal) {


        for (var i = 0; i < this.TOENAMES.length; i++) {
          let current = this.TOENAMES[i].toString();
          if (i > 0) {
            this.TOE = this.TOE + ", " + current
          } else {
            this.TOE = current
          }


        }
        //this.buildProjectNumber();
        this.configService.getConfigsByConfigName("ProjectNumberTracker").subscribe((data: any) => {
          if (data.responseCode == 1) {

            const current = data.dateSet[0];
            this.configNumberOfProject = current.utilitySlot1;
            this.configMonthYear = current.utilitySlot2;
            this.configService.addUpdateConfig(current.configID, null, null, (Number(this.configNumberOfProject) + 1).toString(), null, null, null).subscribe((data: any) => {
              if (data.responseCode == 1) {

                this.applicationsService.addUpdateApplication(this.applicationID, appUserId, this.internalName + ' ' + this.internalSurname, this.CurrentUser.email, null, null, null, null, this.typeOfApplication, this.notificationNumber, this.wbsNumber, this.physicalAddressOfProject, this.descriptionOfProject, this.natureOfWork, this.TOE, this.expectedStartDate, this.expectedEndType, '10 Stella Road, Newholme, PMB, KZN', appUserId, previousStageNameIn, 0, CurrentStageNameIn, 2, NextStageNameIn, 3, "Distributed", false, "WL:" + (Number(this.configNumberOfProject) + 1).toString() + "/" + this.configMonthYear, true).subscribe((data: any) => {

                  if (data.responseCode == 1) {
                    alert(data.responseMessage);

                    // this.onAutoLinkDepartment();
                    console.log(data);
                    this.shared.setApplicationID(this.applicationID);
                    this.ARCGISAPIData.applicationID = this.applicationID;

                    //Add professional link for contractors when application is successfully captured


                    //Pulling information from the share
                    const filesForUpload = this.shared.pullFilesForUpload();
                    for (var i = 0; i < filesForUpload.length; i++) {
                      const formData = new FormData();
                      let fileExtention = filesForUpload[i].UploadFor.substring(filesForUpload[i].UploadFor.indexOf('.'));
                      let fileUploadName = filesForUpload[i].UploadFor.substring(0, filesForUpload[i].UploadFor.indexOf('.')) + "_appID" + this.applicationID;
                      formData.append('file', filesForUpload[i].formData, fileUploadName + fileExtention);



                      this.http.post(this.apiUrl + 'documentUpload/UploadDocument', formData, { reportProgress: true, observe: 'events' })
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

                    //Clears objects upon application update
                    this.shared.setApplicationID(0);
                    this.shared.clearContractorData();
                    this.shared.clearEngineerData();

                  }
                  else {
                    /*          alert(data.responseMessage);*/
                  }
                  this.onCreateNotification();
                  console.log("responseAddapplication", data);


                  if (this.applicationID == 0) {
                    this.router.navigate(["/new-wayleave"], { queryParams: { isPlanningS: isPlanning } });
                  } else {
                    this.router.navigate(["/home"]);
                    this.notificationsService.sendEmail("venolin@cyberfox.co.za", "test", "testing 1, 2, 3 ...", "<h1>New wayleave application</h1>");
                  };

                }, error => {
                  console.log("Error", error);
                })
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
      else if (this.client) {


        for (var i = 0; i < this.TOENAMES.length; i++) {
          let current = this.TOENAMES[i].toString();
          if (i > 0) {
            this.TOE = this.TOE + ", " + current
          } else {
            this.TOE = current
          }


        }


        console.log("lhsdhfkshdfkshdfjkshdkljfhjklsdhfjkshdfsdkjfhlhsdhfkshdfkshdfjkshdkljfhjklsdhfjkshdfsdkjfhlhsdhfkshdfkshdfjkshdkljfhjklsdhfjkshdfsdkjfh BUTTTTTONN", this.TOE);

        this.applicationsService.addUpdateApplication(this.applicationID, appUserId, this.clientName + ' ' + this.clientSurname, this.clientEmail, this.clientCellNo, this.clientAddress, this.clientRefNo, '0', this.typeOfApplication, this.notificationNumber, this.wbsNumber, this.physicalAddressOfProject, this.descriptionOfProject, this.natureOfWork, this.TOE, this.expectedStartDate, this.expectedEndType, '10 Stella Road, Newholme, PMB, KZN', appUserId, previousStageName, 0, CurrentStageName, 1, NextStageName, 2, "Unpaid", false, this.projectNumber, true).subscribe((data: any) => {

          if (data.responseCode == 1) {
            alert(data.responseMessage);
            //this.buildProjectNumber();
            this.shared.setApplicationID(data.dateSet.applicationID);
            this.ARCGISAPIData.applicationID = data.dateSet.applicationID;




            //Pulling information from the share
            const filesForUpload = this.shared.pullFilesForUpload();
            for (var i = 0; i < filesForUpload.length; i++) {
              const formData = new FormData();
              formData.append('file', filesForUpload[i].formData, filesForUpload[i].UploadFor + "_appID" + data.dateSet.applicationID);



              this.http.post(this.apiUrl + 'documentUpload/UploadDocument', formData, { reportProgress: true, observe: 'events' })
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
            this.router.navigate(["/new-wayleave"], { queryParams: { isPlanningS: isPlanning } });
          } else {
            this.router.navigate(["/home"]);
            this.notificationsService.sendEmail("venolin@cyberfox.co.za", "test", "testing 1, 2, 3 ...", "<h1>New wayleave application</h1>");
          };

        }, error => {
          console.log("Error", error);
        })
      }
      else {
        //External
        //This is also reached to create a blank application.


        for (var i = 0; i < this.TOENAMES.length; i++) {
          let current = this.TOENAMES[i].toString();
          if (i > 0) {
            this.TOE = this.TOE + ", " + current
          } else {
            this.TOE = current
          }


        }


        console.log("lhsdhfkshdfkshdfjkshdkljfhjklsdhfjkshdfsdkjfhlhsdhfkshdfkshdfjkshdkljfhjklsdhfjkshdfsdkjfhlhsdhfkshdfkshdfjkshdkljfhjklsdhfjkshdfsdkjfh BUTTTTTONN", this.TOE);

        this.applicationsService.addUpdateApplication(this.applicationID, appUserId, this.externalName + ' ' + this.externalSurname, this.externalEmail, this.externalAddress, null, null, null, this.typeOfApplication, this.notificationNumber, this.wbsNumber, this.physicalAddressOfProject, this.descriptionOfProject, this.natureOfWork, this.TOE, this.expectedStartDate, this.expectedEndType, '10 Stella Road, Newholme, PMB, KZN', appUserId, previousStageName, 0, CurrentStageName, 1, NextStageName, 2, "Unpaid", false, this.projectNumber, true).subscribe((data: any) => {

          if (data.responseCode == 1) {
            /*          alert(data.responseMessage);*/
            this.shared.setApplicationID(data.dateSet.applicationID);
            this.ARCGISAPIData.applicationID = data.dateSet.applicationID;

            //Add professional link for contractors when application is successfully captured




          }
          else {
            /*          alert(data.responseMessage);*/
          }
          console.log("responseAddapplication", data);

          /*        this.shared.setApplicationID(data.dateSet.applicationID);*/

          if (this.applicationID == 0) {
            this.router.navigate(["/new-wayleave"], { queryParams: { isPlanningS: isPlanning } });
          } else {
            this.router.navigate(["/home"]);
            this.notificationsService.sendEmail("venolin@cyberfox.co.za", "test", "testing 1, 2, 3 ...", "<h1>New wayleave application</h1>");
          };

          //        this.shared.setApplicationID(0); //sets the applicationID back to zero when a new application is created.
          /*        return this.ARCGISAPIData.applicationID;*/

        }, error => {
          console.log("Error", error);
        })

      }



    }

    else {


      if (this.client) {


        for (var i = 0; i < this.TOENAMES.length; i++) {
          let current = this.TOENAMES[i].toString();
          if (i > 0) {
            this.TOE = this.TOE + ", " + current
          } else {
            this.TOE = current
          }


        }


        console.log("lhsdhfkshdfkshdfjkshdkljfhjklsdhfjkshdfsdkjfhlhsdhfkshdfkshdfjkshdkljfhjklsdhfjkshdfsdkjfhlhsdhfkshdfkshdfjkshdkljfhjklsdhfjkshdfsdkjfh BUTTTTTONN", this.TOE);

        this.applicationsService.addUpdateApplication(this.applicationID, appUserId, this.clientName + ' ' + this.clientSurname, this.clientEmail, this.clientCellNo, this.clientAddress, this.clientRefNo, '0', this.typeOfApplication, this.notificationNumber, this.wbsNumber, this.physicalAddressOfProject, this.descriptionOfProject, this.natureOfWork, this.TOE, this.expectedStartDate, this.expectedEndType, '10 Stella Road, Newholme, PMB, KZN', appUserId, previousStageName, 0, CurrentStageName, 1, NextStageName, 2, "Unpaid", false, this.projectNumber, false).subscribe((data: any) => {

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
              formData.append('file', filesForUpload[i].formData, filesForUpload[i].UploadFor + "_appID" + data.dateSet.applicationID);



              this.http.post(this.apiUrl + 'documentUpload/UploadDocument', formData, { reportProgress: true, observe: 'events' })
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
            this.router.navigate(["/new-wayleave"], { queryParams: { isPlanningS: isPlanning } });
          } else {
            this.router.navigate(["/home"]);
            this.notificationsService.sendEmail("venolin@cyberfox.co.za", "test", "testing 1, 2, 3 ...", "<h1>New wayleave application</h1>");
          };

        }, error => {
          console.log("Error", error);
        })
      }
      else if (this.internal) {


        for (var i = 0; i < this.TOENAMES.length; i++) {
          let current = this.TOENAMES[i].toString();
          if (i > 0) {
            this.TOE = this.TOE + ", " + current
          } else {
            this.TOE = current;
          }


        }


        this.configService.getConfigsByConfigName("ProjectNumberTracker").subscribe((data: any) => {
          if (data.responseCode == 1) {

            const current = data.dateSet[0];
            this.configNumberOfProject = current.utilitySlot1;
            this.configMonthYear = current.utilitySlot2;
            this.configService.addUpdateConfig(current.configID, null, null, (Number(this.configNumberOfProject) + 1).toString(), null, null, null).subscribe((data: any) => {
              if (data.responseCode == 1) {

                this.applicationsService.addUpdateApplication(this.applicationID, appUserId, this.internalName + ' ' + this.internalSurname, this.CurrentUser.email, null, null, null, null, this.typeOfApplication, this.notificationNumber, this.wbsNumber, this.physicalAddressOfProject, this.descriptionOfProject, this.natureOfWork, this.TOE, this.expectedStartDate, this.expectedEndType, '10 Stella Road, Newholme, PMB, KZN', appUserId, previousStageNameIn, 0, CurrentStageNameIn, 2, NextStageNameIn, 3, "Distributed", false, "WL:" + (Number(this.configNumberOfProject) + 1).toString() + "/" + this.configMonthYear, false).subscribe((data: any) => {

                  if (data.responseCode == 1) {
                    alert(data.responseMessage);

                    // this.onAutoLinkDepartment();
                    console.log(data);
                    this.shared.setApplicationID(this.applicationID);
                    this.ARCGISAPIData.applicationID = this.applicationID;

                    //Add professional link for contractors when application is successfully captured
                    if (contractorData.length > 0) {
                      for (var i = 0; i < contractorData.length; i++) {
                        this.addProfessionalsLinks(this.applicationID, contractorData[i].professinalID);
                      };
                    } else {
                      //  alert("This Application have no contractors linked");
                    }


                    //Add professional link for engineers when application is successfully captured
                    if (engineerData.length > 0) {
                      for (var i = 0; i < engineerData.length; i++) {
                        this.addProfessionalsLinks(this.applicationID, engineerData[i].professinalID);
                      };
                    }
                    else {
                      //  alert("This Application have no engineers linked");
                    }

                    //Pulling information from the share
                    const filesForUpload = this.shared.pullFilesForUpload();
                    for (var i = 0; i < filesForUpload.length; i++) {
                      const formData = new FormData();
                      let fileExtention = filesForUpload[i].UploadFor.substring(filesForUpload[i].UploadFor.indexOf('.'));
                      let fileUploadName = filesForUpload[i].UploadFor.substring(0, filesForUpload[i].UploadFor.indexOf('.')) + "_appID" + this.applicationID;
                      formData.append('file', filesForUpload[i].formData, fileUploadName + fileExtention);



                      this.http.post(this.apiUrl + 'documentUpload/UploadDocument', formData, { reportProgress: true, observe: 'events' })
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

                    //Clears objects upon application update
                    this.shared.setApplicationID(0);
                    this.shared.clearContractorData();
                    this.shared.clearEngineerData();

                  }
                  else {
                    /*          alert(data.responseMessage);*/
                  }
                  this.onCreateNotification();
                  console.log("responseAddapplication", data);


                  if (this.applicationID == 0) {
                    this.router.navigate(["/new-wayleave"], { queryParams: { isPlanningS: isPlanning } });
                  } else {
                    this.router.navigate(["/home"]);
                    this.notificationsService.sendEmail("venolin@cyberfox.co.za", "test", "testing 1, 2, 3 ...", "<h1>New wayleave application</h1>");
                  };

                }, error => {
                  console.log("Error", error);
                })
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

      else {
        //External
        //This is also reached to create a blank application.


        for (var i = 0; i < this.TOENAMES.length; i++) {
          let current = this.TOENAMES[i].toString();
          if (i > 0) {
            this.TOE = this.TOE + ", " + current
          } else {
            this.TOE = current
          }


        }


        this.applicationsService.addUpdateApplication(this.applicationID, appUserId, this.externalName + ' ' + this.externalSurname, this.externalEmail, "Phone", this.externalAddress, null, null, this.typeOfApplication, this.notificationNumber, this.wbsNumber, this.physicalAddressOfProject, this.descriptionOfProject, this.natureOfWork, this.TOE, this.expectedStartDate, this.expectedEndType, '10 Stella Road, Newholme, PMB, KZN', appUserId, previousStageName, 0, CurrentStageName, 1, NextStageName, 2, "Unpaid", false, this.projectNumber, false).subscribe((data: any) => {

          if (data.responseCode == 1) {


            /*          alert(data.responseMessage);*/
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


            //Pulling information from the share
            const filesForUpload = this.shared.pullFilesForUpload();
            for (var i = 0; i < filesForUpload.length; i++) {
              const formData = new FormData();
              let fileExtention = filesForUpload[i].UploadFor.substring(filesForUpload[i].UploadFor.indexOf('.'));
              let fileUploadName = filesForUpload[i].UploadFor.substring(0, filesForUpload[i].UploadFor.indexOf('.')) + "_appID" + this.applicationID;
              formData.append('file', filesForUpload[i].formData, fileUploadName + fileExtention);




              this.http.post(this.apiUrl + 'documentUpload/UploadDocument', formData, { reportProgress: true, observe: 'events' })
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

            //Clears objects upon application update
            this.shared.setApplicationID(0);
            this.shared.clearContractorData();
            this.shared.clearEngineerData();

          }
          else {
            /*          alert(data.responseMessage);*/
          }

          console.log("responseAddapplication", data);

          /*        this.shared.setApplicationID(data.dateSet.applicationID);*/


          if (this.applicationID == 0) {


            this.router.navigate(["/new-wayleave"], { queryParams: { isPlanningS: isPlanning } });
          } else {


            this.router.navigate(["/home"]);
            this.notificationsService.sendEmail("venolin@cyberfox.co.za", "test", "testing 1, 2, 3 ...", "<h1>New wayleave application</h1>");
          };

          //        this.shared.setApplicationID(0); //sets the applicationID back to zero when a new application is created.
          /*        return this.ARCGISAPIData.applicationID;*/

        }, error => {
          console.log("Error", error);
        })

      }
      /*    this.router.navigate(["/new-wayleave"]);*/
      /*    return this.ARCGISAPIData.applicationID;*/

    }
    // this.shared.setApplicationID(0);
  }

  openXl(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }
  openViewSelection(viewSelection: any) {
    this.modalService.open(viewSelection, { size: 'xl' });
  }

  async getCurrentInvoiceNumberForGen(ClientName: string) {
    await this.configService.getConfigsByConfigName("InvoiceNumber").subscribe((data: any) => {
      if (data.responseCode == 1) {
        const current = data.dateSet[0];
        this.accountNumber = current.utilitySlot1;
        let newInvoiceForConfig = Number(current.utilitySlot1) + 1;

        this.configService.addUpdateConfig(current.configID, null, null, newInvoiceForConfig.toString(), null, null, null).subscribe((data: any) => {
          if (data.responseCode == 1) {

            this.getCDV(ClientName);

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



  getCDV(ClientName: string) {

    const accountString = this.accountNumber.toString();
    const weights = [3, 2, 1, 2, 3, 4, 5, 6];

    // Throw an error if the account number is not 8 digits long
    if (accountString.length !== 8) {
      throw new Error('Account number must be 8 digits long');
    }

    let sum = 0;

    for (let i = 0; i < 8; i++) {
      const digit = parseInt(accountString.charAt(i));
      sum += digit * weights[i];
    }

    const cdv = sum % 9;

    //alert(this.accountNumber.toString() + cdv.toString());
    this.generatedInvoiceNumber = this.accountNumber.toString() + cdv.toString();

    this.generateInvoice(ClientName);


  }


  getAllSubDepartments() {
    this.subDepartmentsService.getSubDepartmentsList().subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {

          const tempSubDepartmentLinkedList = {} as SubDepartmentList;
          const current = data.dateSet[i];

          tempSubDepartmentLinkedList.subDepartmentID = current.subDepartmentID;
          tempSubDepartmentLinkedList.UserAssaignedToComment = current.userAssaignedToComment;
          tempSubDepartmentLinkedList.subDepartmentName = current.subDepartmentName;
          tempSubDepartmentLinkedList.departmentID = current.departmentID;
          tempSubDepartmentLinkedList.dateUpdated = current.dateUpdated;
          tempSubDepartmentLinkedList.dateCreated = current.dateCreated;
          tempSubDepartmentLinkedList.subdepartmentForCommentID = current.subDepartmentForCommentID;
          tempSubDepartmentLinkedList.GLCode = current.glCode;
          tempSubDepartmentLinkedList.ProfitCenter = current.profitCenter;


          this.SubDepartmentList.push(tempSubDepartmentLinkedList);

        }


      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);


      }
      console.log("reponseGetAllLinkedSubDepartmentsForComment", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  getSubByName(subDepName: string) {
    for (let i = 0; i < this.SubDepartmentList.length; i++) {
      if (this.SubDepartmentList[i].subDepartmentName === subDepName) {
        return this.SubDepartmentList[i];
      }
    }
    return null;  // or you might want to throw an error
  }


  generateInvoice(ClientName: string) {
    if (!this.internal) {
      // Create a new PDF
      const doc = new jsPDF();

      // Add company logo
      const logo = new Image();
      logo.src = 'assets/cctlogoblack.png';
      doc.addImage(logo, 'png', 10, 10, 60, 20);

      // Add invoice title
      this.addInvoiceTitle(doc);

      // Add client details
      this.addClientDetails(doc, ClientName);

      // Add company contact details
      this.addCompanyDetails(doc);

      // Calculate payable by date
      const payableByDate = this.calculatePayableByDate();

      // Set the starting Y position for the table
      let startY = 100;

      // Generate service items table, cost details and calculate total cost
      startY = this.addServiceItemsAndCostDetails(doc, startY);

      startY += 8; // adjust this value as needed

      // Add account details
      startY = this.addAccountDetails(doc, payableByDate, startY);

      // Reduce the gap before the next section
      startY -= 28; // adjust this value as needed

      // Add payment options and consequences of non-payment
      startY = this.addPaymentDetails(doc, startY);

      // Increase the gap before the next section
      startY += 20;

      // Add pay points notice
      startY = this.addPayPointsNotice(doc, startY);

      startY -= 35; // adjust this value as needed


      // Add vendors image

      //  const vendors = new Image();
      //vendors.src = 'assets/vendors.jpg';

      //const pageWidth = doc.internal.pageSize.getWidth();
      //const aspectRatio = vendors.width / vendors.height; // assumes vendors Image object contains width and height properties
      //const imgHeightOnPage = pageWidth / aspectRatio;

      //doc.addImage(vendors, 'JPEG', 0, startY + 40, pageWidth, imgHeightOnPage);


      const vendors = new Image();
      vendors.src = 'assets/vendors.jpg';
      doc.addImage(vendors, 'JPEG', 15, startY + 25, 180, 20);

      // Save the PDF as a blob object and push it for temporary upload
      this.saveAndUploadPDF(doc);
      // this.generateInvoiceSplit(ClientName, payableByDate,);

      // Navigate to home page
      this.router.navigate(["/home"]);
      alert("Your invoice has been created. You may find the invoice in the 'Financial' tab within your application");
    }
  }

  addInvoiceTitle(doc) {
    autoTable(doc, {
      body: [['Wayleave Application Fee Invoice']],
      styles: { halign: 'right', fontSize: 20, textColor: '#000000' },
      theme: 'plain'
    });
  }

  addClientDetails(doc, ClientName) {
    autoTable(doc, {
      body: [['Invoice to:  ' + ClientName
        + '\nWayleave Reference: ' + this.applicationID
        + '\nTax invoice number: ' + this.generatedInvoiceNumber
        + '\nDate: ' + this.formattedDate
        + '\nCustomer VAT registration number: No.4500193497'
        + '\nBusiness partner number: No.4500193497']],
      styles: { halign: 'right' },
      theme: 'plain'
    });
  }

  addCompanyDetails(doc) {
    autoTable(doc, {
      body: [['Civic Centre'
        + '\n12 Hertzog Boulevard 8001'
        + '\nPO Box 655 Cape Town 8000'
        + '\nVAT registration number: 4500193497'
        + '\nEmail: wayleaves@capetown.gov.za'
        + '\nWeb address: www.capetown.gov.za']],
      styles: { halign: 'left' },
      theme: 'plain'
    });
  }

  calculatePayableByDate() {
    function addBusinessDays(date, days) {
      date = new Date(date);
      let count = 0;
      while (count < days) {
        date.setDate(date.getDate() + 1);
        if (date.getDay() !== 0 && date.getDay() !== 6) { // not a weekend, so increment count
          count++;
        }
      }
      return date;
    }

    const formattedDateObj = new Date(this.formattedDate);
    return addBusinessDays(formattedDateObj, 7);
  }

  addServiceItemsAndCostDetails(doc, startY) {
    // Generate table body based on ServiceItemList data and calculate the total cost
    let totalCost = 0;
    let tableBody = this.ServiceItemList.map(item => {
      const amount = item.Rate; // Assuming amount equals rate for each item
      totalCost += parseFloat(amount);
      return ['1', item.Description, amount, amount];
    });

    // Calculate the VAT and total amount due
    const vat = totalCost * 0.15;
    const totalAmountDue = totalCost + vat;

    // Add cost details directly to the table body
    tableBody.push(
      ['Amount Due', '', '', totalCost.toFixed(2)],
      ['VAT (15%)', '', '', vat.toFixed(2)],
      ['Total Amount Due', '', '', totalAmountDue.toFixed(2)]
    );

    // Add the combined table to the document
    autoTable(doc, {
      head: [['Quantity', 'Description', 'Unit', 'Amount']],
      body: tableBody,
      theme: 'grid',
      styles: { cellPadding: 1, lineWidth: 0.1, lineColor: [220, 220, 220], cellWidth: 'wrap', fillColor: [255, 255, 255] }, // setting cell color to white
      headStyles: { fillColor: [180, 180, 180] }, // setting header color to a darker grey
      startY: startY,
      margin: { top: 20 }
    });

    // Return the new startY value
    return startY + 40; // decreased from 60 + 20
  }

  addAccountDetails(doc, payableByDate, startY) {
    const boxContent = 'Profit Centre: ' + this.getSubByName("EMB").ProfitCenter
      + '\nGL Acc: ' + this.getSubByName("EMB").GLCode
      + '\nPayable by: ' + payableByDate.toISOString().slice(0, 10); // Format date as YYYY-MM-DD

    autoTable(doc, {
      body: [[boxContent]],
      styles: { halign: 'center', valign: 'middle', fillColor: [255, 255, 255] }, // white fill color
      theme: 'grid',
      startY: startY,
    });

    return startY + 30; // adjust this value as needed
  }



  addPaymentDetails(doc, startY) {
    autoTable(doc, {
      body: [['Please Note:\n\n'
        + '1. Payment options:\n\n'
        + '(a) Electronic payments (EFT): Select the City of Cape Town as a bank-listed beneficiary on your bank\'s website. Use the reference number provided above.\n'
        + '(b) Direct deposit at Nedbank: Please present your reference number to the bank teller.\n'
        + '(c) Cash, debit card, credit card and other: Please present your reference number to the cashier.\n\n'
        + '2. Failure to pay could result in:\n\n'
        + '(a) The lapse of your application, resulting in the need for re-application\n'
        + '(b) Necessity for re-application with no guarantee of similar conditions / requirements']],
      styles: { halign: 'left' },
      theme: 'plain',
      startY: startY + 20 // adjust this value to create space between the tables
    });
    return startY + 20 + 20; // decreased from 100 + 20
  }

  addPayPointsNotice(doc, startY) {
    autoTable(doc, {
      body: [['Pay points: City of Cape Town cash offices or the vendors below:']],
      styles: { halign: 'left' },
      theme: 'plain',
      startY: startY + 20 // adjust this value to create space between the tables
    });
    return startY + 20 + 20; // decreased from 100 + 20
  }

  saveAndUploadPDF(doc) {
    const pdfData = doc.output('blob'); // Convert the PDF document to a blob object
    const file = new File([pdfData], 'Wayleave Application Fee Invoice.pdf', { type: 'application/pdf' });

    // Prepare the form data
    const formData = new FormData();
    formData.append('file', file);

    this.shared.pushFileForTempFileUpload(file, "Wayleave Application Fee Invoice" + ".pdf");
    this.save();
  }


  save() {
    const filesForUpload = this.shared.pullFilesForUpload();
    for (let i = 0; i < filesForUpload.length; i++) {
      const formData = new FormData();
      let fileExtention = filesForUpload[i].UploadFor.substring(filesForUpload[i].UploadFor.indexOf('.'));
      let fileUploadName = filesForUpload[i].UploadFor.substring(0, filesForUpload[i].UploadFor.indexOf('.')) + "_appID" + this.applicationID;
      formData.append('file', filesForUpload[i].formData, fileUploadName + fileExtention);

      this.http.post(this.apiUrl + 'documentUpload/UploadDocument', formData, { reportProgress: true, observe: 'events' })
        .subscribe({
          next: (event) => {
            if (event.type === HttpEventType.UploadProgress && event.total) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event.type === HttpEventType.Response) {
              this.message = 'Upload success.';
              this.uploadFinishedF(event.body);
            }
          },
          error: (err: HttpErrorResponse) => console.log(err)
        });
    }

  }


  saveAndUploadPDFSplit(doc) {
    this.shared.FileDocument = [];
    doc.save("invoiceSplit.pdf");
    const pdfData = doc.output('blob'); // Convert the PDF document to a blob object
    const file = new File([pdfData], 'Wayleave Application Fee Invoice Split.pdf', { type: 'application/pdf' });

    // Prepare the form data
    const formData = new FormData();
    formData.append('file', file);

    this.shared.pushFileForTempFileUpload(file, "Wayleave Application Fee Invoice Split" + ".pdf");
    this.save();
  }


  addServiceItemsAndCostDetailsSJ(doc, startY) {
    // Generate table body based on ServiceItemList data and calculate the total cost
    let totalCost = 0;
    let tableBody = this.ServiceItemList.map(item => {
      const amount = item.Rate; // Assuming amount equals rate for each item
      totalCost += parseFloat(amount);

      let profitCenter = '';
      let glCode = '';
      if (item.Description === 'RIM Admin Fee') {
        profitCenter = this.getSubByName("Roads & Infrastructure Management").ProfitCenter;
        glCode = this.getSubByName("Roads & Infrastructure Management").GLCode;
      } else if (item.Description === 'Water & Sanitation Admin Fee') {
        profitCenter = this.getSubByName("Waste Water and Treatment").ProfitCenter;
        glCode = this.getSubByName("Waste Water and Treatment").GLCode;
      } else {
        profitCenter = this.getSubByName("EMB").ProfitCenter;
        glCode = this.getSubByName("EMB").GLCode;
      }

      return ['1', item.Description, amount, amount, profitCenter, glCode];
    });

    // Calculate the VAT and total amount due
    const vat = totalCost * 0.15;
    const totalAmountDue = totalCost + vat;

    // Add cost details directly to the table body
    tableBody.push(
      ['Amount Due', '', '', totalCost.toFixed(2), '', ''],
      ['VAT (15%)', '', '', vat.toFixed(2), '', ''],
      ['Total Amount Due', '', '', totalAmountDue.toFixed(2), '', '']
    );

    // Add the combined table to the document
    autoTable(doc, {
      head: [['Quantity', 'Description', 'Unit', 'Amount', 'Profit Center', 'GL Code']],
      body: tableBody,
      theme: 'grid',
      styles: { cellPadding: 1, lineWidth: 0.1, lineColor: [220, 220, 220], cellWidth: 'wrap', fillColor: [255, 255, 255] }, // setting cell color to white
      headStyles: { fillColor: [180, 180, 180] }, // setting header color to a darker grey
      startY: startY,
      margin: { top: 20 }
    });

    // Return the new startY value
    return startY + 40; // decreased from 60 + 20
  }



  generateInvoiceSplit(ClientName: string, payableByDate: string) {
    if (!this.internal) {
      // Create a new PDF
      const doc = new jsPDF();

      // Add company logo
      const logo = new Image();
      logo.src = 'assets/cctlogoblack.png';
      doc.addImage(logo, 'png', 10, 10, 60, 20);

      // Add invoice title
      this.addInvoiceTitle(doc);

      // Add client details
      this.addClientDetails(doc, ClientName);

      // Add company contact details
      this.addCompanyDetails(doc);


      // Set the starting Y position for the table
      let startY = 100;

      // Generate service items table, cost details and calculate total cost
      startY = this.addServiceItemsAndCostDetailsSJ(doc, startY);

      startY += 8; // adjust this value as needed

      // Add account details
      startY = this.addAccountDetails(doc, payableByDate, startY);

      // Reduce the gap before the next section
      startY -= 28; // adjust this value as needed

      // Add payment options and consequences of non-payment
      startY = this.addPaymentDetails(doc, startY);

      // Increase the gap before the next section
      startY += 20;

      // Add pay points notice
      startY = this.addPayPointsNotice(doc, startY);

      startY -= 35; // adjust this value as needed


      // Add vendors image

      //  const vendors = new Image();
      //vendors.src = 'assets/vendors.jpg';

      //const pageWidth = doc.internal.pageSize.getWidth();
      //const aspectRatio = vendors.width / vendors.height; // assumes vendors Image object contains width and height properties
      //const imgHeightOnPage = pageWidth / aspectRatio;

      //doc.addImage(vendors, 'JPEG', 0, startY + 40, pageWidth, imgHeightOnPage);


      const vendors = new Image();
      vendors.src = 'assets/vendors.jpg';
      doc.addImage(vendors, 'JPEG', 15, startY + 25, 180, 20);

      // Save the PDF as a blob object and push it for temporary upload
      this.saveAndUploadPDFSplit(doc);

      // Navigate to home page
      this.router.navigate(["/home"]);
    }
  }




  uploadFinishedF = (event: any) => {

    this.response = event;
    console.log("this.response", this.response);
    console.log("this.response?.dbPath", this.response?.dbPath);


    const documentName = this.response?.dbPath.substring(this.response?.dbPath.indexOf('d') + 2);
    console.log("documentName", documentName);

    this.financialService.addUpdateFinancial(0, documentName, "Wayleave Application Fee Invoice", documentName, this.response?.dbPath, this.applicationID, "System Generated Invoice").subscribe((data: any) => {
      /*this.financial.addUpdateFinancial(0, "Approval Pack", "Generated Pack", documentName,this.response?.dbPath, this.ApplicationID,"System Generated Pack").subscribe((data: any) => {*/
      if (data.responseCode == 1) {

      }

    }, error => {
      console.log("Error: ", error);
    })


  }

  coverLetterUpload(event: any) {
    const file = event.target.files[0];
  }


  addProfessionalsLinks(applicationID: number, professionalID: number) {



    this.professionalsLinksService.addUpdateProfessionalsLink(0, applicationID, professionalID, this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {

        /*        alert(data.responseMessage);*/
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


  populateClientProfessional(professionalType: string, userID: string) {

    if (professionalType === "Engineer") {

      this.selectEngineerTableComponent.getProfessionalsListByProfessionalType(professionalType, userID);
    } else {

      this.selectContractorTableComponent.getProfessionalsListByProfessionalType(professionalType, userID);
    }



  }

  populateClientInfo(userID: string) {
    //This doesn't include the reference number and company type as yet
    this.disabled = true;
    this.newClient = false;

    this.userPofileService.getUserProfileById(userID).subscribe((data: any) => {

      if (data.responseCode == 1) {

        this.UserListTable?.renderRows();

        const tempUserList = {} as UserList;
        const current = data.dateSet[0];
        debugger;
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
        //Will this work??
        this.clientRefNo = current.refNumber;
        this.clientCompanyType = current.companyType;

        this.getProfessionalsListByProfessionalType(this.professionalType);
        console.log(tempUserList);
        this.UserList.push(tempUserList);




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
    refreshTable.onAddEngineer(this.bpNoApplicant, this.professionalRegNo, this.name, this.surname, this.applicantEmail, this.applicantTellNo, this.engineerIDNo);
    this.router.navigate(["/home"]);
    this.router.navigate(["/new-wayleave"], { queryParams: { isPlanningS: this.isPlanning } });
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



  uploadFinished = (event: any, applicationID: any, applicationData: any) => {

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


  onPassFileName(event: { uploadFor: string; fileName: string }, index: any) {
    debugger;
    const { uploadFor, fileName } = event;
    // const index = parseInt(uploadFor.substring('CoverLetter'.length));
    this.fileAttrs[index] = this.MandatoryDocumentsLinkedStagesList[index].mandatoryDocumentName;
  }

  //onPassFileName = (CoverLetterFileName: any) => {
  //  this.CoverLetterChooseFileText = CoverLetterFileName;

  //}
  addAdditionalUploader() {
    const newUploader = { mandatoryDocumentName: 'Provide a default or unique name here' };
    this.additionalUploaders.push(newUploader);
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


  //getAllManDocsByStageID() {

  //  this.MandatoryDocumentsLinkedStagesList.splice(0, this.MandatoryDocumentsLinkedStagesList.length);

  //  this.mandatoryDocumentStageLink.getAllMandatoryDocumentsByStageID(this.StagesList[0].StageID).subscribe((data: any) => {
  //    if (data.responseCode == 1) {


  //      for (let i = 0; i < data.dateSet.length; i++) {
  //        const tempMandatoryDocumentsLinkedStagesList = {} as MandatoryDocumentsLinkedStagesList;
  //        const current = data.dateSet[i];
  //        tempMandatoryDocumentsLinkedStagesList.stageID = current.stageID;
  //        tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentStageLinkID = current.mandatoryDocumentStageLinkID;
  //        tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentID = current.mandatoryDocumentID;
  //        tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentName = current.mandatoryDocumentName;
  //        tempMandatoryDocumentsLinkedStagesList.stageName = current.stageName;
  //        tempMandatoryDocumentsLinkedStagesList.dateCreated = current.dateCreated;

  //        this.MandatoryDocumentsLinkedStagesList.push(tempMandatoryDocumentsLinkedStagesList);

  //      }
  //    }
  //    else {

  //      alert(data.responseMessage);
  //    }
  //    console.log("reponse", data);

  //  }, error => {
  //    console.log("Error: ", error);
  //  })
  //}

  getAllTOE() {

    this.TypeOfExcavationList.splice(0, this.TypeOfExcavationList.length);

    this.typeOfExcavationService.getAllTypesOfExcavation().subscribe((data: any) => {

      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempTOEList = {} as TypeOfExcavationList;
          const current = data.dateSet[i];
          tempTOEList.typeOfExcavationID = current.typeOfExcavationID;
          tempTOEList.typeOfExcavationName = current.typeOfExcavationName;
          tempTOEList.typeOfExcavationDescription = current.typeOfExcavationDescription;
          tempTOEList.dateCreated = current.dateCreated;
          this.TypeOfExcavationList.push(tempTOEList);

        }

        console.log("Got ALL Types of excavation", this.TypeOfExcavationList);

        console.log("datadatadatadata", data);
      }
      else {
        alert(data.responseMessage);

      }
      console.log("response", data);


    }, error => {
      console.log("Error: ", error);
    })
  }
  toppings = new FormControl('');
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];






  getAllDepartmentAdminsForNotifications() {

    this.userPofileService.getAllDepartmentAdmins().subscribe((data: any) => {


      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDepartmentAdminList = {} as DepartmentAdminList;
          const current = data.dateSet[i];
          tempDepartmentAdminList.userId = current.userID;
          tempDepartmentAdminList.departmentAdmin = current.idDepartmentAdmin;
          tempDepartmentAdminList.fullName = current.fullname;




          this.DepartmentAdminList.push(tempDepartmentAdminList);

        }



        console.log("Got all departmentAdmins", data.dateSet);


      }

      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })

  }

  onCreateNotification() {
    debugger;
    this.notiName = "Application Created";
    this.notiDescription = this.applicationID + " was created ";

    this.notificationsService.addUpdateNotification(0, this.notiName, this.notiDescription, false, this.DepartmentAdminList[0].userId, this.CurrentUser.appUserId, this.applicationID, this.Emailmessage).subscribe((data: any) => {

      if (data.responseCode == 1) {
        alert(data.responseMessage);

      }
      else {
        alert(data.responseMessage);
      }

      console.log("response", data);
    }, error => {
      console.log("Error", error);
    })


  }
  onCreateNotificationApplicant() {
    debugger;
    this.notiName = "Application Created";
    this.notiDescription = this.applicationID + " was created ";

    this.notificationsService.addUpdateNotification(0, this.notiName, this.notiDescription, false, this.DepartmentAdminList[0].userId, this.shared.clientUserID, this.applicationID, this.Emailmessage).subscribe((data: any) => {

      if (data.responseCode == 1) {
        alert(data.responseMessage);

      }
      else {
        alert(data.responseMessage);
      }

      console.log("response", data);
    }, error => {
      console.log("Error", error);
    })
      

  }

  //Pulls previous application data for modification during reapplication by user
  initializeReapply() {

    this.ApplicationListForReapply.push(this.shared.getViewApplicationIndex());
    this.reapply = this.shared.getReapply();

    //Checks if this application is a re-apply or normal application and if reapply, prepopulates the textboxes and selections for the end-user with data from their previous application.
    if (this.reapply == true) {
      this.typeOfApplication = this.ApplicationListForReapply[0].TypeOfApplication;
      this.notificationNumber = this.ApplicationListForReapply[0].NotificationNumber;
      this.wbsNumber = this.ApplicationListForReapply[0].WBSNumber;
      this.physicalAddressOfProject = this.ApplicationListForReapply[0].PhysicalAddressOfProject;
      this.descriptionOfProject = this.ApplicationListForReapply[0].DescriptionOfProject;
      this.natureOfWork = this.ApplicationListForReapply[0].NatureOfWork;
      this.excavationType = this.ApplicationListForReapply[0].ExcavationType;

      //Populate date selector
      ////method 1
      //const options: Intl.DateTimeFormatOptions = {
      //  year: 'numeric',
      //  month: '2-digit',
      //  day: '2-digit'
      //};

      //const formattedDate = this.expectedStartDate.toLocaleDateString('en-ZA', options);
      //console.log(formattedDate);
      //this.expectedStartDate = new Date(formattedDate);

      ////method 2
      //this.datePipe.transform(this.expectedStartDate, 'yyyy-MM-dd');
      ////method 3
      //this.formattedDate = this.datePipe.transform(this.expectedStartDate, 'yyyy-MM-dd');
      //console.log(this.expectedStartDate);
      //this.expectedStartDate = new Date(this.formattedDate);

      /*          this.expectedStartDatetest = "2023/15/15";*/
      this.expectedStartDate = this.ApplicationListForReapply[0].ExpectedStartDate;
      this.expectedEndType = this.ApplicationListForReapply[0].ExpectedEndDate;
    } else {
      this.projectNumber = '';

    }


  }


  savetypesOFexcavation() {

    // console.log("lhsdhfkshdfkshdfjkshdkljfhjklsdhfjkshdfsdkjfhlhsdhfkshdfkshdfjkshdkljfhjklsdhfjkshdfsdkjfhlhsdhfkshdfkshdfjkshdkljfhjklsdhfjkshdfsdkjfh ", "Hi");

  }

  //This function is defunct because the subdepartment table is used for assigning users. Even subepartments without subzones, have at least 1 zone, usually representing the entire city.
  public addToSubDepartmentForComment() {
    const tempList = this.shared.distributionList;

    tempList.forEach((obj) => {
      this.subDepartmentForCommentService.addUpdateDepartmentForComment(0, this.applicationID, obj.subDepartmentID, obj.subDepartmentName, obj.userID, null, "ESRI API", obj.zoneID, obj.zoneName).subscribe((data: any) => {

        if (data.responseCode == 1) {
          alert(data.responseMessage);

        }
        else {
          alert(data.responseMessage);
        }

        console.log("response", data);
      }, error => {
        console.log("Error", error);
      });
    });
  }

  public addToZoneForComment() {
    //const tempList = this.shared.distributionList;
    //Filters list so that only one link is created in the zoneforcomment table per zone.
    //const tempList = [...new Set(this.shared.distributionList)];

    // Assuming your array is named dataArray
    const tempList = this.shared.distributionList;

    const seenCombinations = {}; // To keep track of seen combinations

    const uniqueArray = tempList.filter(item => {
      const key = `${item.subDepartmentID}-${item.zoneID}`;

      if (!seenCombinations[key]) {
        seenCombinations[key] = true;
        return true;
      }

      return false;
    });

    console.log("uniqueArray:", uniqueArray);

    uniqueArray.forEach((obj) => {
      this.zoneForCommentService.addUpdateZoneForComment(0, obj.subDepartmentID, this.applicationID, obj.zoneID, obj.zoneName, obj.userID).subscribe((data: any) => {

        if (data.responseCode == 1) {
          /*          alert(data.responseMessage);*/
          this.onAutoLinkDepartment(obj.subDepartmentID, obj.subDepartmentName, obj.zoneID, obj.zoneName);

        }
        else {
          /*          alert(data.responseMessage);*/
        }

        console.log("response", data);
      }, error => {
        console.log("Error", error);
      });
    });
  }

  async openMandatoryDocumentCategory(MandatoryDocumentCategory: any) {

    this.modalService.open(MandatoryDocumentCategory, { centered: true, size: 'lg' });

  }



  selectedProjectSizeCheckList(ProjectSizeCheckList: any) {
    debugger;
    this.selectionProjectSizeCheck.toggle(ProjectSizeCheckList);
    this.StoreSelectionProjectCheckListItems();

  }

  selectedSmall(mandatoryDocumentCategory: any) {

    this.selectionSmall.toggle(mandatoryDocumentCategory);

  }
  selectedMedium(mandatoryDocumentCategory: any) {

    this.selectionMedium.toggle(mandatoryDocumentCategory);

  }
  selectedLarge(mandatoryDocumentCategory: any) {

    this.selectionLarge.toggle(mandatoryDocumentCategory);

  }
  selectedEmergency(mandatoryDocumentCategory: any) {

    this.selectionEmergency.toggle(mandatoryDocumentCategory);

  }

  getAllByMandatoryDocumentCategory(ManDocCat: string) {


    this.mandatoryUploadDocsService.GetAllByMandatoryDocumentCategory(ManDocCat).subscribe((data: any) => {

      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {

          const tempMandatoryDocList = {} as MandatoryDocumentUploadList;
          const current = data.dateSet[i];
          tempMandatoryDocList.mandatoryDocumentID = current.mandatoryDocumentID;
          tempMandatoryDocList.mandatoryDocumentName = current.mandatoryDocumentName;
          tempMandatoryDocList.stageID = current.stageID;
          tempMandatoryDocList.mandatoryDocumentCategory = current.mandatoryDocumentCategory;
          tempMandatoryDocList.dateCreated = current.dateCreated;
          switch (tempMandatoryDocList.mandatoryDocumentCategory) {
            case "Small": {

              this.MandatoryDocumentUploadListSmall.push(tempMandatoryDocList);
              this.MandatoryDocumentUploadListSmallTable?.renderRows();
              break;
            }
            case "Medium": {

              this.MandatoryDocumentUploadListMedium.push(tempMandatoryDocList);
              this.MandatoryDocumentUploadListMediumTable?.renderRows();
              break;
            }
            case "Large": {

              this.MandatoryDocumentUploadListLarge.push(tempMandatoryDocList);
              this.MandatoryDocumentUploadListLargeTable?.renderRows();
              break;
            }
            case "Emergency": {

              this.MandatoryDocumentUploadListEmergency.push(tempMandatoryDocList);
              this.MandatoryDocumentUploadListEmergencyTable?.renderRows();
              break;
            }
            case "Drilling": {

              this.MandatoryDocumentUploadListDrilling.push(tempMandatoryDocList);
              this.MandatoryDocumentUploadListDrillingTable?.renderRows();
              break;
            }
            case "LUM": {

              this.MandatoryDocumentUploadListLUM.push(tempMandatoryDocList);
              this.MandatoryDocumentUploadListLUMTable?.renderRows();
              break;
            }
            default:
          }



        }


        this.MandatoryDocumentUploadListSmallTable?.renderRows();
        this.MandatoryDocumentUploadListMediumTable?.renderRows();
        this.MandatoryDocumentUploadListLargeTable?.renderRows();
        this.MandatoryDocumentUploadListEmergencyTable?.renderRows();
        console.log("Got ALL MANDATORY DOCS", this.MandatoryDocumentUploadList);

        console.log("datadatadatadata", data);
      }
      else {
        alert(data.responseMessage);

      }
      console.log("response", data);


    }, error => {
      console.log("Error: ", error);
    })
  }

  // Define a new property to store categorized data
  categorizedProjectSizeCheckList: { [key: string]: ProjectSizeCheckList[] } = {};

  getAllProjectSizeCheckList() {
    this.ProjectSizeCheckList.splice(0, this.ProjectSizeCheckList.length);

    this.projectSizeCheckListService.getAllProjectSizeCheckList().subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempProjectSizeCheckList = {} as ProjectSizeCheckList;
          const current = data.dateSet[i];

          tempProjectSizeCheckList.ProjectSizeCheckListID = current.projectSizeCheckListID;
          tempProjectSizeCheckList.ProjectSizeCheckListRowNumber = current.projectSizeCheckListRowNumber;
          tempProjectSizeCheckList.ProjectSizeCheckListActivity = current.projectSizeCheckListActivity;
          tempProjectSizeCheckList.MandatoryDocumentCategory = current.mandatoryDocumentCategory;
          tempProjectSizeCheckList.projectSizeCheckListActivityType = current.projectSizeCheckListActivityType;

          this.ProjectSizeCheckList.push(tempProjectSizeCheckList);

          // Organize data based on activity type
          if (!this.categorizedProjectSizeCheckList[current.projectSizeCheckListActivityType]) {
            this.categorizedProjectSizeCheckList[current.projectSizeCheckListActivityType] = [];
          }

          this.categorizedProjectSizeCheckList[current.projectSizeCheckListActivityType].push(tempProjectSizeCheckList);
        }
      }
      else {
        alert(data.responseMessage);
      }
      console.log("response", data);
    }, error => {
      console.log("Error: ", error);
    });
  }

  //getAllProjectSizeCheckList() {
  //  this.ProjectSizeCheckList.splice(0, this.ProjectSizeCheckList.length);

  //  this.projectSizeCheckListService.getAllProjectSizeCheckList().subscribe((data: any) => {
  //    if (data.responseCode == 1) {
  //      for (let i = 0; i < data.dateSet.length; i++) {
  //        const tempProjectSizeCheckList = {} as ProjectSizeCheckList;
  //        const current = data.dateSet[i];
  //        tempProjectSizeCheckList.ProjectSizeCheckListID = current.projectSizeCheckListID;
  //        tempProjectSizeCheckList.ProjectSizeCheckListRowNumber = current.projectSizeCheckListRowNumber;
  //        tempProjectSizeCheckList.ProjectSizeCheckListActivity = current.projectSizeCheckListActivity;
  //        tempProjectSizeCheckList.MandatoryDocumentCategory = current.mandatoryDocumentCategory;
  //        tempProjectSizeCheckList.projectSizeCheckListActivityType = current.projectSizeCheckListActivityType;

  //        this.ProjectSizeCheckList.push(tempProjectSizeCheckList);

  //      }

  //      //for (let i = this.ProjectSizeCheckList.length - 1; i > 0; i--) {
  //      //  const j = Math.floor(Math.random() * (i + 1));
  //      //  [this.ProjectSizeCheckList[i], this.ProjectSizeCheckList[j]] = [this.ProjectSizeCheckList[j], this.ProjectSizeCheckList[i]];
  //      //}
  //    }
  //    else {

  //      alert(data.responseMessage);
  //    }
  //    console.log("reponse", data);

  //  }, error => {
  //    console.log("Error: ", error);
  //  })
  //}

  trackByFn(index, item) {
    return item.mandatoryDocumentID; // or any unique id from the object
  }

  isLastCharacterNotNumber(str: string): boolean {
    if (!str) return false;

    const lastChar = str.slice(-1);
    return isNaN(Number(lastChar));
  }

  deleteUploader(index: number) {
    debugger;
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







  //addUploader(index: any) {
  //  // Get the current value of the BehaviorSubject
  //  let currentList = this.MandatoryDocumentsLinkedStagesList.getValue();

  //  // Get the current object
  //  let current = currentList[index];

  //  // Create a copy of the current object
  //  let newObject = { ...current };

  //  // Extract base name without number at the end
  //  let baseName = newObject.mandatoryDocumentName.replace(/(\d+)$/, "");

  //  // Find the highest appended number for this base name in the current list
  //  let maxNumber = 0;
  //  for (let doc of currentList) {
  //    if (doc.mandatoryDocumentName.startsWith(baseName)) {
  //      let matches = doc.mandatoryDocumentName.match(/(\d+)$/);
  //      if (matches) {
  //        let number = parseInt(matches[1]);
  //        if (number > maxNumber) {
  //          maxNumber = number;
  //        }
  //      }
  //    }
  //  }

  //  // If the original name had no number appended, then the next number to append will be 1.
  //  // Otherwise, append the next number after the max number found.
  //  newObject.mandatoryDocumentName = baseName + (maxNumber > 0 ? maxNumber + 1 : 1).toString();

  //  // Insert newObject right after current in the list
  //  currentList.splice(index + 1, 0, newObject);

  //  // Update the BehaviorSubject with the modified list
  //  this.MandatoryDocumentsLinkedStagesList.next(currentList);

  //  // Call updateMandatoryDocumentsLinkedStagesList function with the updated list
  //  this.updateMandatoryDocumentsLinkedStagesList(currentList);
  //}





  updateMandatoryDocumentsLinkedStagesList(list: any[]) {
    debugger;
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

  public sendEmailToDepartment(subDepartmentName: string) {


    this.userPofileService.getUsersBySubDepartmentName(subDepartmentName).subscribe((data: any) => {

      if (data.responseCode == 1) {

        data.forEach((obj) => {
          this.notificationsService.sendEmail(obj.email, "New wayleave application submission", "check html", "Dear " + subDepartmentName + "User" + "<br><br>An application with ID " + this.applicationID + " for wayleave has just been captured.<br><br>Regards,<br><b>Wayleave Management System<b><br><img src='https://resource.capetown.gov.za/Style%20Library/Images/coct-logo@2x.png'>");
          this.notificationsService.addUpdateNotification(0, "Wayleave Created", "New wayleave application submission", false, this.CurrentUser.appUserID, obj.userID, this.applicationID, "An application with ID " + this.applicationID + " for wayleave has just been captured.").subscribe((data: any) => {

            if (data.responseCode == 1) {
              alert(data.responseMessage);

            }
            else {
              alert(data.responseMessage);
            }

            console.log("response", data);
          }, error => {
            console.log("Error", error);
          })

        })



        alert(data.responseMessage);

      }
      else {
        alert(data.responseMessage);
      }

      console.log("response", data);
    }, error => {
      console.log("Error", error);
    });
  }

  projectSizeAlert = false;
  ProjectSizeMessage = "";
  PSM = "";

  //2.0 CheckToPopulateManDoc needs work

  //CheckToPopulateManDoc() {
  //  const countMap = {
  //    'Small': 0,
  //    'Medium': 0,
  //    'Large': 0,
  //    'Emergency': 0,
  //    'LUM': 0
  //  };

  //  // Counting categories
  //  for (let current of this.ProjectSizeCheckList) {
  //    if (this.selectionProjectSizeCheck.isSelected(current)) {
  //      countMap[current.MandatoryDocumentCategory]++;
  //    }
  //  }

  //  const setProjectDetails = (type, applicationName, listName) => {
  //    this.updateMandatoryDocumentsLinkedStagesList(this[listName]);
  //    this.projectSizeAlert = true;
  //    this.ProjectSizeMessage = type;
  //    this.PSM = `${type} Application`;
  //  }

  //  const populateList = (listName) => {
  //    let tempList = [];

  //    const newList = this[listName].map(current => {
  //      return {
  //        stageID: current.stageID,
  //        mandatoryDocumentStageLinkID: null,
  //        mandatoryDocumentID: current.mandatoryDocumentID,
  //        mandatoryDocumentName: current.mandatoryDocumentName,
  //        stageName: null,
  //        dateCreated: current.dateCreated
  //      };
  //    });

  //    tempList = tempList.concat(newList);
  //    const currentList = this.MandatoryDocumentsLinkedStagesList.getValue();
  //    const updatedList = currentList.concat(tempList);
  //    this.MandatoryDocumentsLinkedStagesList.next(updatedList);
  //    this.totalDocs = updatedList.length;
  //    console.log("this.totalDocs", this.totalDocs);
  //  }

  //  // Update logic
  //  if (countMap['Small'] > 0) {
  //    if (countMap['Medium'] > 0 || countMap['Large'] > 0) {
  //      setProjectDetails('Large', 'Large Application', 'MandatoryDocumentUploadListLarge');
  //    } else {
  //      setProjectDetails('Small', 'Small Application', 'MandatoryDocumentUploadListSmall');
  //    }
  //  } else if (countMap['Medium'] > 0 || countMap['Large'] > 0) {
  //    setProjectDetails('Large', 'Large Application', 'MandatoryDocumentUploadListLarge');
  //  }

  //  if (countMap['Emergency'] > 0) {
  //    setProjectDetails('Emergency', 'Emergency Application', 'MandatoryDocumentUploadListEmergency');
  //    populateList('MandatoryDocumentUploadListEmergency');
  //  }

  //  if (countMap['LUM'] > 0) {
  //    populateList('MandatoryDocumentUploadListLUM');
  //  }
  //}


  //1.2
  CheckToPopulateManDoc() {
    let smallCount = 0;
    let mediumCount = 0;
    let largeCount = 0;
    let emergencyCount = 0;
    let LUMCount = 0;

    for (var i = 0; i < this.ProjectSizeCheckList.length; i++) {
      const current = this.ProjectSizeCheckList[i];
      if (this.selectionProjectSizeCheck.isSelected(current)) {
        if (current.MandatoryDocumentCategory == "Small") {
          smallCount++;
        }
        else if (current.MandatoryDocumentCategory == "Medium") {
          mediumCount++;
        }
        else if (current.MandatoryDocumentCategory == "Large") {
          largeCount++;
        }
        else if (current.MandatoryDocumentCategory == "LUM") {
          LUMCount++;
        }
        else {
          emergencyCount++;
        }
      }

    }


    if (smallCount > 0) {
      if (mediumCount > 0 || largeCount > 0) {
        if (largeCount > 0) {

          this.updateMandatoryDocumentsLinkedStagesList(this.MandatoryDocumentUploadListLarge);
          this.projectSizeAlert = true;
          this.ProjectSizeMessage = "Large";
          this.PSM = "Large Application";

        } else {
          this.updateMandatoryDocumentsLinkedStagesList(this.MandatoryDocumentUploadListMedium);
          this.projectSizeAlert = true;
          this.ProjectSizeMessage = "Medium";
          this.PSM = "Medium Application";
        }
      } else {
        this.updateMandatoryDocumentsLinkedStagesList(this.MandatoryDocumentUploadListSmall);
        this.projectSizeAlert = true;
        this.ProjectSizeMessage = "Small";
        this.PSM = "Small Application";
      }
    } else if (mediumCount > 0 || largeCount > 0 || emergencyCount > 0) {
      if (largeCount > 0) {

        this.updateMandatoryDocumentsLinkedStagesList(this.MandatoryDocumentUploadListLarge);
        this.projectSizeAlert = true;
        this.ProjectSizeMessage = "Large";
        this.PSM = "Large Application";

      } else {
        this.updateMandatoryDocumentsLinkedStagesList(this.MandatoryDocumentUploadListMedium);
        this.projectSizeAlert = true;
        this.ProjectSizeMessage = "Medium";
        this.PSM = "Medium Application";
      }
    } else if (largeCount > 0) {

      this.updateMandatoryDocumentsLinkedStagesList(this.MandatoryDocumentUploadListLarge);
      this.projectSizeAlert = true;
      this.ProjectSizeMessage = "Large";
      this.PSM = "Large Application";

    }



    if (emergencyCount > 0) {
      let tempList = []; // Temporary list to collect all new entries

      const newList = this.MandatoryDocumentUploadListEmergency.map(current => {
        debugger;
        const tempMandatoryDocumentsLinkedStagesList = {} as MandatoryDocumentsLinkedStagesList;
        tempMandatoryDocumentsLinkedStagesList.stageID = current.stageID;
        tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentStageLinkID = null;
        tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentID = current.mandatoryDocumentID;
        tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentName = current.mandatoryDocumentName;
        tempMandatoryDocumentsLinkedStagesList.stageName = null;
        tempMandatoryDocumentsLinkedStagesList.dateCreated = current.dateCreated;
        return tempMandatoryDocumentsLinkedStagesList;
      });

      tempList = tempList.concat(newList);

      // Assuming MandatoryDocumentsLinkedStagesList is an observable, extract its current value
      const currentList = this.MandatoryDocumentsLinkedStagesList.getValue();

      // Concatenate currentList and tempList
      const updatedList = currentList.concat(tempList);
      debugger;
      this.MandatoryDocumentsLinkedStagesList.next(updatedList);
      this.projectSizeAlert = true;
      this.ProjectSizeMessage = "Emergency";
      this.PSM = "Emergency Application";
      this.totalDocs = updatedList.length;
      this.totalDocs2 = Number(this.totalDocs).toString();
      console.log("this.totalDocs;this.totalDocs", this.totalDocs);
    }

    debugger;
    if (LUMCount > 0) {
      let tempList = []; // Temporary list to collect all new entries

      const newList = this.MandatoryDocumentUploadListLUM.map(current => {
        debugger;
        const tempMandatoryDocumentsLinkedStagesList = {} as MandatoryDocumentsLinkedStagesList;
        tempMandatoryDocumentsLinkedStagesList.stageID = current.stageID;
        tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentStageLinkID = null;
        tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentID = current.mandatoryDocumentID;
        tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentName = current.mandatoryDocumentName;
        tempMandatoryDocumentsLinkedStagesList.stageName = null;
        tempMandatoryDocumentsLinkedStagesList.dateCreated = current.dateCreated;
        return tempMandatoryDocumentsLinkedStagesList;
      });

      tempList = tempList.concat(newList);

      // Assuming MandatoryDocumentsLinkedStagesList is an observable, extract its current value
      const currentList = this.MandatoryDocumentsLinkedStagesList.getValue();

      // Concatenate currentList and tempList
      const updatedList = currentList.concat(tempList);
      debugger;
      this.MandatoryDocumentsLinkedStagesList.next(updatedList);
      this.totalDocs = updatedList.length;
      this.totalDocs2 = Number(this.totalDocs).toString();
      console.log("this.totalDocs;this.totalDocs", this.totalDocs);
    }


  }







  //1.1CheckToPopulateManDoc() {
  //  let smallCount = 0;
  //  let mediumCount = 0;
  //  let largeCount = 0;
  //  let emergencyCount = 0;
  //  let LUMCount = 0;

  //  for (var i = 0; i < this.ProjectSizeCheckList.length; i++) {
  //    const current = this.ProjectSizeCheckList[i];
  //    if (this.selectionProjectSizeCheck.isSelected(current)) {
  //      if (current.MandatoryDocumentCategory == "Small") {
  //        smallCount++;
  //      }
  //      else if (current.MandatoryDocumentCategory == "Medium") {
  //        mediumCount++;
  //      }
  //      else if (current.MandatoryDocumentCategory == "Large") {
  //        largeCount++;
  //      }
  //      else if (current.MandatoryDocumentCategory == "LUM") {
  //        LUMCount++;
  //      }
  //      else {
  //        emergencyCount++;
  //      }
  //    }

  //  }


  //  if (smallCount > 0) {
  //    if (mediumCount > 0 || largeCount > 0 || emergencyCount > 0) {
  //      if (largeCount > 0 || emergencyCount > 0) {
  //        if (emergencyCount > 0 ) {
  //          this.updateMandatoryDocumentsLinkedStagesList(this.MandatoryDocumentUploadListEmergency);
  //          this.projectSizeAlert = true;
  //          this.ProjectSizeMessage = "Emergency";
  //          this.PSM = "Emergency Application";
  //        } else {
  //          this.updateMandatoryDocumentsLinkedStagesList(this.MandatoryDocumentUploadListLarge);
  //          this.projectSizeAlert = true;
  //          this.ProjectSizeMessage = "Large";
  //          this.PSM = "Large Application";
  //        }
  //      } else {
  //        this.updateMandatoryDocumentsLinkedStagesList(this.MandatoryDocumentUploadListMedium);
  //        this.projectSizeAlert = true;
  //        this.ProjectSizeMessage = "Medium";
  //        this.PSM = "Medium Application";
  //      }
  //    } else {
  //      this.updateMandatoryDocumentsLinkedStagesList(this.MandatoryDocumentUploadListSmall);
  //      this.projectSizeAlert = true;
  //      this.ProjectSizeMessage = "Small";
  //      this.PSM = "Small Application";
  //    }
  //  } else if (mediumCount > 0 || largeCount > 0 || emergencyCount > 0) {
  //    if (largeCount > 0 || emergencyCount > 0) {
  //      if (emergencyCount > 0) {
  //        this.updateMandatoryDocumentsLinkedStagesList(this.MandatoryDocumentUploadListEmergency);
  //        this.projectSizeAlert = true;
  //        this.ProjectSizeMessage = "Emergency";
  //        this.PSM = "Emergency Application";
  //      } else {
  //        this.updateMandatoryDocumentsLinkedStagesList(this.MandatoryDocumentUploadListLarge);
  //        this.projectSizeAlert = true;
  //        this.ProjectSizeMessage = "Large";
  //        this.PSM = "Large Application";
  //      }
  //    } else {
  //      this.updateMandatoryDocumentsLinkedStagesList(this.MandatoryDocumentUploadListMedium);
  //      this.projectSizeAlert = true;
  //      this.ProjectSizeMessage = "Medium";
  //      this.PSM = "Medium Application";
  //    }
  //  } else if (largeCount > 0 || emergencyCount > 0) {
  //    if (emergencyCount > 0) {
  //      this.updateMandatoryDocumentsLinkedStagesList(this.MandatoryDocumentUploadListEmergency);
  //      this.projectSizeAlert = true;
  //      this.ProjectSizeMessage = "Emergency";
  //      this.PSM = "Emergency Application";
  //    } else {
  //      this.updateMandatoryDocumentsLinkedStagesList(this.MandatoryDocumentUploadListLarge);
  //      this.projectSizeAlert = true;
  //      this.ProjectSizeMessage = "Large";
  //      this.PSM = "Large Application";
  //    }
  //  } else {
  //    this.updateMandatoryDocumentsLinkedStagesList(this.MandatoryDocumentUploadListEmergency);
  //    this.projectSizeAlert = true;
  //    this.ProjectSizeMessage = "Emergency";
  //    this.PSM = "Emergency Application";
  //  }


  //  debugger;
  //  if (LUMCount > 0) {
  //    let tempList = []; // Temporary list to collect all new entries

  //    const newList = this.MandatoryDocumentUploadListLUM.map(current => {
  //      debugger;
  //      const tempMandatoryDocumentsLinkedStagesList = {} as MandatoryDocumentsLinkedStagesList;
  //      tempMandatoryDocumentsLinkedStagesList.stageID = current.stageID;
  //      tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentStageLinkID = null;
  //      tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentID = current.mandatoryDocumentID;
  //      tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentName = current.mandatoryDocumentName;
  //      tempMandatoryDocumentsLinkedStagesList.stageName = null;
  //      tempMandatoryDocumentsLinkedStagesList.dateCreated = current.dateCreated;
  //      return tempMandatoryDocumentsLinkedStagesList;
  //    });

  //    tempList = tempList.concat(newList);

  //    // Assuming MandatoryDocumentsLinkedStagesList is an observable, extract its current value
  //    const currentList = this.MandatoryDocumentsLinkedStagesList.getValue();

  //    // Concatenate currentList and tempList
  //    const updatedList = currentList.concat(tempList);
  //    debugger;
  //    this.MandatoryDocumentsLinkedStagesList.next(updatedList);
  //    this.totalDocs = updatedList.length;
  //    console.log("this.totalDocs;this.totalDocs", this.totalDocs);
  //  }

  //}


  getCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  selectedItemIndex: number = -1;

  addUploader2(index: number) {
    // Handle the logic for adding a new upload here
    this.selectedItemIndex = index;
  }
  StoreSelectionProjectCheckListItems() {
    debugger;

    this.ProjectSizeSelectionList.splice(0, this.ProjectSizeSelectionList.length);
    debugger;
    for (var i = 0; i < this.selectionProjectSizeCheck.selected.length; i++) {
      const checkList = this.selectionProjectSizeCheck.selected[i]
      const tempSelectionList = {} as ProjectSizeSelectionList;

      tempSelectionList.selectedProject = checkList.projectSizeCheckListActivityType;
      tempSelectionList.projectDescription = checkList.ProjectSizeCheckListActivity;
      tempSelectionList.userFullName = this.CurrentUser.fullName;
      tempSelectionList.createdById = this.CurrentUser.appUserId;
      debugger;
      this.ProjectSizeSelectionList.push(tempSelectionList);
    }

  }
  SavedProjectSizeSelections() {
    debugger;
    for (var i = 0; i < this.ProjectSizeSelectionList.length; i++) {
      const current = this.ProjectSizeSelectionList[i];
      debugger;
      this.projectSizeSelectionService.AddUpdateProjectSizeSelection(0, this.applicationID, this.CurrentUser.fullName, current.selectedProject, current.projectDescription, current.createdById).subscribe((data: any) => {
        if (data.responseCode == 1) {
          /*alert(data.responseMessage);*/
        }
        console.log("Success", data);
      },
        error => {
          console.log("Error: ", error);
        }
      );
    }


  }
  DraftOption() {
    this.isDraft = true;
  }

  onPopulateDraftInfo(applicationId: number) {
    this.draftApplicationsService.getDraftedApplicationsByApplicationID(applicationId).subscribe((data: any) => {
      debugger;
      if (data.responseCode === 1) {
        const current = data.dateSet[0];
        debugger;
        // Assign data to component properties
        this.applicationID = applicationId;
        this.PSM = current.typeOfApplication + " Application";
        this.TOENAMES = current.excavationType;
        this.natureOfWork = current.natureOfWork;
        this.expectedStartDate = current.expectedStartDate.substring(0, current.dateCreated.indexOf('T'));
        this.expectedEndType = current.expectedEndDate.substring(0, current.dateCreated.indexOf('T'));
        this.router.navigate(["/new-wayleave"], { queryParams: { isPlanningS: false } });
        console.log("draftPSM", this.PSM)
        this.CheckProjectSizeChecklistForDraft();
       

      } else {
        alert(data.response);
      }
    }, error => {
      console.log("Error", error);

    });


  }

  CheckProjectSizeChecklistForDraft() {
    this.projectSizeSelectionService.getProjectSizedSelectionForApplication(this.applicationID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempSelectionList = {} as ProjectSizeSelectionList
          tempSelectionList.selectedProject = current.selectedProject;
          tempSelectionList.projectDescription = current.projectDescription;

          // Find the item in this.ProjectSizeCheckList that matches the selectionList
          const matchedItem = this.ProjectSizeCheckList.find(item => item.ProjectSizeCheckListActivity === tempSelectionList.projectDescription);
          this.ProjectSizeSelectionList.push(tempSelectionList)
          if (matchedItem) {
            // Use the SelectionModel to select the item
            this.selectionProjectSizeCheck.select(matchedItem);
          }
        }
        this.cdr.detectChanges();
        this.CheckToPopulateManDoc();

      } else {
        alert(data.response);
      }
    }, error => {
      console.log("Error", error);
    });

  }

  AddUpdateDraftWayleave() {
    this.draftApplicationsService.addUpdateDraftApplication(0, this.applicationID, this.CurrentUserProfile.appUserId, this.internalName + " " + this.internalSurname, this.CurrentUser.email, null, null, null, null, this.ProjectSizeMessage, this.wbsNumber, this.physicalAddressOfProject, this.descriptionOfProject
      , this.natureOfWork, this.TOE, this.expectedStartDate, this.expectedEndType, this.CurrentUser.appUserId, "WL:" + (Number(this.configNumberOfProject) + 1).toString() + "/" + this.configMonthYear, null,null).subscribe((data: any) => {
        alert("Draft Saved")
        console.log("response", data);


      }, error => {
        console.log("Error: ", error);
      })
  
  }


  onDraftSave() {
    this.router.navigate(["/home"]);
  }
}


  //CheckToPopulateManDoc() {
  //  if (this.selectionSmall.hasValue()) {
  //    if (this.selectionMedium.hasValue()) {
  //      if (this.selectionLarge.hasValue()) {
  //        if (this.selectionEmergency.hasValue()) {
  //          this.updateMandatoryDocumentsLinkedStagesList(this.MandatoryDocumentUploadListEmergency);
  //        } else {
  //          this.updateMandatoryDocumentsLinkedStagesList(this.MandatoryDocumentUploadListLarge);
  //        }
  //      } else {
  //        this.updateMandatoryDocumentsLinkedStagesList(this.MandatoryDocumentUploadListMedium);
  //      }
  //    } else {
  //      this.updateMandatoryDocumentsLinkedStagesList(this.MandatoryDocumentUploadListSmall);
  //    }
  //  } else if (this.selectionMedium.hasValue()) {
  //    if (this.selectionLarge.hasValue()) {
  //      if (this.selectionEmergency.hasValue()) {
  //        this.updateMandatoryDocumentsLinkedStagesList(this.MandatoryDocumentUploadListEmergency);
  //      } else {
  //        this.updateMandatoryDocumentsLinkedStagesList(this.MandatoryDocumentUploadListLarge);
  //      }
  //    } else {
  //      this.updateMandatoryDocumentsLinkedStagesList(this.MandatoryDocumentUploadListMedium);
  //    }
  //  } else if (this.selectionLarge.hasValue()) {
  //    if (this.selectionEmergency.hasValue()) {
  //      this.updateMandatoryDocumentsLinkedStagesList(this.MandatoryDocumentUploadListEmergency);
  //    } else {
  //      this.updateMandatoryDocumentsLinkedStagesList(this.MandatoryDocumentUploadListLarge);
  //    }
  //  } else {
  //    this.updateMandatoryDocumentsLinkedStagesList(this.MandatoryDocumentUploadListEmergency);
  //  }
  //}


  //CheckToPopulateManDoc() {
  //  if (this.selectionSmall.hasValue()) {
  //    if (this.selectionMedium.hasValue()) {
  //      if (this.selectionLarge.hasValue()) {
  //        if (this.selectionEmergency.hasValue()) {
  //          for (var i = 0; i < this.MandatoryDocumentUploadListEmergency.length; i++) {
  //            const tempMandatoryDocumentsLinkedStagesList = {} as MandatoryDocumentsLinkedStagesList;
  //            const current = this.MandatoryDocumentUploadListEmergency[i];
  //            tempMandatoryDocumentsLinkedStagesList.stageID = current.stageID;
  //            tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentStageLinkID = null;
  //            tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentID = current.mandatoryDocumentID;
  //            tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentName = current.mandatoryDocumentName;
  //            tempMandatoryDocumentsLinkedStagesList.stageName = null;
  //            tempMandatoryDocumentsLinkedStagesList.dateCreated = current.dateCreated;

  //            this.MandatoryDocumentsLinkedStagesList.push(tempMandatoryDocumentsLinkedStagesList);
  //          }


  //        }
  //        else {
  //          for (var i = 0; i < this.MandatoryDocumentUploadListLarge.length; i++) {
  //            const tempMandatoryDocumentsLinkedStagesList = {} as MandatoryDocumentsLinkedStagesList;
  //            const current = this.MandatoryDocumentUploadListLarge[i];
  //            tempMandatoryDocumentsLinkedStagesList.stageID = current.stageID;
  //            tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentStageLinkID = null;
  //            tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentID = current.mandatoryDocumentID;
  //            tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentName = current.mandatoryDocumentName;
  //            tempMandatoryDocumentsLinkedStagesList.stageName = null;
  //            tempMandatoryDocumentsLinkedStagesList.dateCreated = current.dateCreated;

  //            this.MandatoryDocumentsLinkedStagesList.push(tempMandatoryDocumentsLinkedStagesList);
  //          }

           
  //        }


  //      }
  //      else {
  //        for (var i = 0; i < this.MandatoryDocumentUploadListMedium.length; i++) {
  //          const tempMandatoryDocumentsLinkedStagesList = {} as MandatoryDocumentsLinkedStagesList;
  //          const current = this.MandatoryDocumentUploadListMedium[i];
  //          tempMandatoryDocumentsLinkedStagesList.stageID = current.stageID;
  //          tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentStageLinkID = null;
  //          tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentID = current.mandatoryDocumentID;
  //          tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentName = current.mandatoryDocumentName;
  //          tempMandatoryDocumentsLinkedStagesList.stageName = null;
  //          tempMandatoryDocumentsLinkedStagesList.dateCreated = current.dateCreated;

  //          this.MandatoryDocumentsLinkedStagesList.push(tempMandatoryDocumentsLinkedStagesList);
  //        }
  //      }

  //    }
  //    else {
  //      for (var i = 0; i < this.MandatoryDocumentUploadListSmall.length; i++) {
  //        const tempMandatoryDocumentsLinkedStagesList = {} as MandatoryDocumentsLinkedStagesList;
  //        const current = this.MandatoryDocumentUploadListSmall[i];
  //        tempMandatoryDocumentsLinkedStagesList.stageID = current.stageID;
  //        tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentStageLinkID = null;
  //        tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentID = current.mandatoryDocumentID;
  //        tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentName = current.mandatoryDocumentName;
  //        tempMandatoryDocumentsLinkedStagesList.stageName = null;
  //        tempMandatoryDocumentsLinkedStagesList.dateCreated = current.dateCreated;

  //        this.MandatoryDocumentsLinkedStagesList.push(tempMandatoryDocumentsLinkedStagesList);
  //      }
  //    }

  //  }
  //  else if (this.selectionMedium.hasValue()) {
  //    if (this.selectionLarge.hasValue()) {
  //      if (this.selectionEmergency.hasValue()) {
  //        for (var i = 0; i < this.MandatoryDocumentUploadListEmergency.length; i++) {
  //          const tempMandatoryDocumentsLinkedStagesList = {} as MandatoryDocumentsLinkedStagesList;
  //          const current = this.MandatoryDocumentUploadListEmergency[i];
  //          tempMandatoryDocumentsLinkedStagesList.stageID = current.stageID;
  //          tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentStageLinkID = null;
  //          tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentID = current.mandatoryDocumentID;
  //          tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentName = current.mandatoryDocumentName;
  //          tempMandatoryDocumentsLinkedStagesList.stageName = null;
  //          tempMandatoryDocumentsLinkedStagesList.dateCreated = current.dateCreated;

  //          this.MandatoryDocumentsLinkedStagesList.push(tempMandatoryDocumentsLinkedStagesList);
  //        }


  //      }
  //      else {
  //        for (var i = 0; i < this.MandatoryDocumentUploadListLarge.length; i++) {
  //          const tempMandatoryDocumentsLinkedStagesList = {} as MandatoryDocumentsLinkedStagesList;
  //          const current = this.MandatoryDocumentUploadListLarge[i];
  //          tempMandatoryDocumentsLinkedStagesList.stageID = current.stageID;
  //          tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentStageLinkID = null;
  //          tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentID = current.mandatoryDocumentID;
  //          tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentName = current.mandatoryDocumentName;
  //          tempMandatoryDocumentsLinkedStagesList.stageName = null;
  //          tempMandatoryDocumentsLinkedStagesList.dateCreated = current.dateCreated;

  //          this.MandatoryDocumentsLinkedStagesList.push(tempMandatoryDocumentsLinkedStagesList);
  //        }


  //      }


  //    }
  //    else {
  //      for (var i = 0; i < this.MandatoryDocumentUploadListMedium.length; i++) {
  //        const tempMandatoryDocumentsLinkedStagesList = {} as MandatoryDocumentsLinkedStagesList;
  //        const current = this.MandatoryDocumentUploadListMedium[i];
  //        tempMandatoryDocumentsLinkedStagesList.stageID = current.stageID;
  //        tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentStageLinkID = null;
  //        tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentID = current.mandatoryDocumentID;
  //        tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentName = current.mandatoryDocumentName;
  //        tempMandatoryDocumentsLinkedStagesList.stageName = null;
  //        tempMandatoryDocumentsLinkedStagesList.dateCreated = current.dateCreated;

  //        this.MandatoryDocumentsLinkedStagesList.push(tempMandatoryDocumentsLinkedStagesList);
  //      }
  //    }

  //  }
  //  else if (this.selectionLarge.hasValue()) {
  //    if (this.selectionEmergency.hasValue()) {
  //      for (var i = 0; i < this.MandatoryDocumentUploadListEmergency.length; i++) {
  //        const tempMandatoryDocumentsLinkedStagesList = {} as MandatoryDocumentsLinkedStagesList;
  //        const current = this.MandatoryDocumentUploadListEmergency[i];
  //        tempMandatoryDocumentsLinkedStagesList.stageID = current.stageID;
  //        tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentStageLinkID = null;
  //        tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentID = current.mandatoryDocumentID;
  //        tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentName = current.mandatoryDocumentName;
  //        tempMandatoryDocumentsLinkedStagesList.stageName = null;
  //        tempMandatoryDocumentsLinkedStagesList.dateCreated = current.dateCreated;

  //        this.MandatoryDocumentsLinkedStagesList.push(tempMandatoryDocumentsLinkedStagesList);
  //      }


  //    }
  //    else {
  //      for (var i = 0; i < this.MandatoryDocumentUploadListLarge.length; i++) {
  //        const tempMandatoryDocumentsLinkedStagesList = {} as MandatoryDocumentsLinkedStagesList;
  //        const current = this.MandatoryDocumentUploadListLarge[i];
  //        tempMandatoryDocumentsLinkedStagesList.stageID = current.stageID;
  //        tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentStageLinkID = null;
  //        tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentID = current.mandatoryDocumentID;
  //        tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentName = current.mandatoryDocumentName;
  //        tempMandatoryDocumentsLinkedStagesList.stageName = null;
  //        tempMandatoryDocumentsLinkedStagesList.dateCreated = current.dateCreated;

  //        this.MandatoryDocumentsLinkedStagesList.push(tempMandatoryDocumentsLinkedStagesList);
  //      }


  //    }
  //  }
  //  else {
  //    //Emergency
  //    for (var i = 0; i < this.MandatoryDocumentUploadListEmergency.length; i++) {
  //      const tempMandatoryDocumentsLinkedStagesList = {} as MandatoryDocumentsLinkedStagesList;
  //      const current = this.MandatoryDocumentUploadListEmergency[i];
  //      tempMandatoryDocumentsLinkedStagesList.stageID = current.stageID;
  //      tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentStageLinkID = null;
  //      tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentID = current.mandatoryDocumentID;
  //      tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentName = current.mandatoryDocumentName;
  //      tempMandatoryDocumentsLinkedStagesList.stageName = null;
  //      tempMandatoryDocumentsLinkedStagesList.dateCreated = current.dateCreated;

  //      this.MandatoryDocumentsLinkedStagesList.push(tempMandatoryDocumentsLinkedStagesList);
  //    }
  //  }

  //}

 





