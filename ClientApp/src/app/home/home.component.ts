import { Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from "@angular/router";
import { ApplicationsService } from '../service/Applications/applications.service';
//import { ApplicationList } from '../shared/shared.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ConfigActingDepartmentComponent } from 'src/app/config-acting-department/config-acting-department.component';
import { NewWayleaveComponent } from 'src/app/create-new-wayleave/new-wayleave/new-wayleave.component';
import { LoginComponent } from 'src/app/login/login.component';
import { SelectContractorTableComponent } from 'src/app/select-contractor-table/select-contractor-table.component';
import { SelectEngineerTableComponent } from 'src/app/select-engineer-table/select-engineer-table.component';
import { AccessGroupsService } from 'src/app/service/AccessGroups/access-groups.service';
import { ConfigService } from 'src/app/service/Config/config.service';
import { ProfessionalService } from 'src/app/service/Professionals/professional.service';
import { SubDepartmentForCommentService } from 'src/app/service/SubDepartmentForComment/sub-department-for-comment.service';
import { UserProfileService } from 'src/app/service/UserProfile/user-profile.service';
import { SharedService } from "src/app/shared/shared.service";
import { ContractorList } from '../edit-contractor/edit-contractor.component';
import { NewProfileComponent } from '../new-user/new-profile/new-profile.component';
import { NotificationCenterComponent } from '../notification-center/notification-center.component';
import { BusinessPartnerService } from '../service/BusinessPartner/business-partner.service';
import { DraftApplicationsService } from '../service/DraftApplications/draft-applications.service';
import { NotificationsService } from '../service/Notifications/notifications.service';
import { StagesService } from '../service/Stages/stages.service';
import { SubDepartmentsService } from '../service/SubDepartments/sub-departments.service';
import { UserService } from '../service/User/user.service';
import { ZoneForCommentService } from '../service/ZoneForComment/zone-for-comment.service';
import { ZoneLinkService } from '../service/ZoneLink/zone-link.service';
import { SnackBarAlertsComponent } from '../snack-bar-alerts/snack-bar-alerts.component';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { BuildingApplicationsService } from 'src/app/service/BuildingApplications/building-applications.service'
import { BuildingApplicationComponent } from 'src/app/building-application/building-application.component';
import { UserLinkToArchitectService } from '../service/UserLinkToArchitect/user-link-to-architect.service';
import { BPNotificationsService } from '../service/BPNotifications/bpnotifications.service';
import { BPDemolitionApplicationComponent } from 'src/app/bpdemolition-application/bpdemolition-application.component';
import { BPComplaintsService } from '../service/BPComplaints/bpcomplaints.service';
import { BPSignageApplicationService } from '../service/BPSignageApplication/bpsignage-application.service';
import { BPBannerApplicationService } from '../service/BPBannerApplication/bpbanner-application.service';
import { BPDemolitionApplicationService } from '../service/BPDemolitionApplication/bpdemolition-application.service';
import { BPFlagApplicationService } from '../service/BPFlagApplication/bpflag-application.service';
import { BPFunctionalAreasService } from '../service/BPFunctionalAreas/bpfunctional-areas.service';
import { FunctionalAreasList } from '../bpdepartment-config/bpdepartment-config.component';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {
  MatBottomSheet,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { CreateNewApplicationComponent } from 'src/app/create-new-application/create-new-application.component';

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
export interface AllSubDepartmentList {
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
  ApplicationID: number | null;
}

export interface StagesList {
  StageID: number;
  StageName: string;
  StageOrderNumber: number;
  CurrentUser: any
  DateCreated: any,
}

export interface ApplicationsList {
  DateCreatedFull: any;
  ApplicationID: number;
  FullName: string;
  /*  ReferenceNumber: string;*/
  TypeOfApplication: any;
  DateCreated: any;
  TestApplicationAge: number,
  TestApplicationStageAge: number,
  CurrentStage: string,
  ApplicationStatus: string,
  ProjectNumber: string;
  isEscalated: boolean; //escalation Sindiswa 29 January 2024
  EscalationDate: any; //escalation Sindiswa 31 January 2024
  EMBActionDate: any; //escalation Sindiswa 31 January 2024
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
  isPlanning?: boolean,
  permitStartDate: Date,
  DatePaid: Date;
  wbsrequired: boolean;
  Coordinates: string,
  userID:string,
  //Coordinates: string
  UserID: any;
  clientAlternativeEmail: string; // chekingNotifications Sindiswa 13 February 2024
  NetworkLicensees: string;
  ContractorAccountDetails: string; //zxNumberUpdate Sindiswa 01 March 2024
}


export interface RolesList {
  RoleID: number;
  RoleName: string;
  AccessGroupID: number;
  AccessGroupName: string;
  //RoleType: string;
  //RoleDescription: string;
}

export interface ZoneList {
  subDepartmentName: any;
  zoneID: number;
  zoneName: string;
  departmentID: number;
  subDepartmentID: number;
  zoneForCommentID: number | null;
}

export interface UserList {
  userID: number;
  fullName: string;
  isInternal: boolean;
  depConfirmation: boolean;
}

export interface ClientUserList {
  userId: any;
  idNumber: string;
  fullName: string;
  internalDepartment: string;

}

export interface ConfigList {
  configID: number,
  configName: string,
  configDescription: string,
  dateCreated: Date,
  dateUpdated: Date,
  createdById: string,
  isActive: boolean,
  utilitySlot1: string,
  utilitySlot2: string,
  utilitySlot3: string,
}

export interface TempContractorList {

  companyName: string;
  cidbNum: string;
  cidbGrade: string;
  name: string;
  surname: string;
  cellular: string;
  email: string;
}

export interface TempEngineerList {

  //bpNumber: string;
  profRegNum: string;
  idNum: string;
  name: string;
  surname: string;
  cellular: string;
  email: string;
}

export interface ProfListEU {
  professinalID: number;
  ProfessinalType: string;
  professionalRegNo: string;
  bpNumber: string;
  name: string;
  surname: string;
  //fullName: string;
  email: string;
  phoneNumber?: number;
  CIBRating: string;
  idNumber?: string;
}

export interface AllInternalUserProfileList {

  UserID: string;
  FullName: string;
  Email: string;
  PhoneNumber: string;
  Directorate: string;
  SubDepartmentID: string;
  DepartmentID: string;
  Branch: string;



}
export interface ArchitectsList {
  ArchitectUserId: string;
  ArchitectName: string;
  ClientFullName: string;
  ClientAddress: string;
  ClientUserID: string;
  CreatedById: string;
}

export interface ApplicationsListBP {
  bpApplicationType: any;
  applicationID: number;
  ProjectNumber: string;
  erfNumber: string;
  stage: string;
  stageAge: any;
  planAge: any;
  ownerName: string;
  propertyAddress: string;
  status: string;
  dateCreated: any;
  dateUpdated: any;
  justForFilteringByDate: any;
  BPApplicationID: string;
}

export interface ArchitectClients {
  ArchitectUserId: string;
  ArchitectName: string;
  ClientFullName: string;
  ClientAddress: string;
  ClientUserID: string;
  CreatedById: string;

}

export interface BPFunctionalAreas {
  FunctionalAreaId: number;
  FAName: string;
  FAItemCode: string;
  DateCreated: any;
  DateUpdated: any;

}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ["./home.component.scss"],
  animations: [
    trigger('swipeAnimation', [
      state('transparent', style({ transform: 'translateX(0)' })), // No translation
      state('solid', style({ transform: 'translateX(100%)' })), // Full translation (off-screen)
      transition('transparent <=> solid', animate('0.5s ease-in-out')), // Adjust duration and easing
    ]),
  ]
})




export class HomeComponent implements OnInit, OnDestroy {
  FiterValue = "";
  isLoading: boolean = false;

  pastAndCurrentReviews = false;

  AllSubDepartmentList: AllSubDepartmentList[] = [];
  Applications: ApplicationsList[] = [];
  applicationDataForView: ApplicationList[] = [];
  applicationDataForViewToShared: ApplicationList[] = [];
  filteredApplications: ApplicationList[] = [];
  StagesList: StagesList[] = [];
  relatedApplications: ApplicationList[] = [];
  RolesList: RolesList[] = [];
  UserList: UserList[] = [];
  ClientUserList: ClientUserList[] = [];
  AllInternalUserProfileList: ClientUserList[] = [];
  ZoneLinkedList: ZoneList[] = [];
  applicationsForUsersZoneList: ZoneList[] = [];
  AllConfig: ConfigList[] = [];
  ArchitectsList: ArchitectsList[] = [];
  ApplicationsBP: ApplicationsListBP[] = [];
  AllBPApplications: ApplicationsListBP[] = [];
  AllTownPlanningApplications: ApplicationsListBP[] = [];
  AllApplications: ApplicationsListBP[] = [];
  DemolitionsList: ApplicationsListBP[] = [];
  SignageList: ApplicationsListBP[] = [];
  BannerList: ApplicationsListBP[] = [];
  FlagApplicationList: ApplicationsListBP[] = [];
  ArchiveList: ApplicationsListBP[] = [];
  ArchitectClients: ArchitectClients[] = [];
  FunctionalAreasList: FunctionalAreasList[] = [];

  ServerType: string;
  BaseUrl: string;

  //Added on the 18th of September for the view tings
  TempEngList: TempEngineerList[] = [];
  TempConList: TempContractorList[] = [];

  EngineersList: ProfListEU[] = [];
  ContractorsList: ProfListEU[] = [];

  @ViewChild(MatTable) ZoneListTable: MatTable<ZoneList> | undefined;

  displayedColumnsViewLinkedZones: string[] = ['subDepartmentName', 'zoneName'];
  dataSourceViewLinkedZones = this.ZoneLinkedList;
  selectedTabIndex: number;


  filterValue = '';

  CurrentUser: any;
  stringifiedData: any;
  stringifiedDataUserProfile: any;

  CurrentUserProfile: any;
  public canReapply: boolean = false;

  unpaidcount = 0;
  distributioncount = 0;
  approveCount = 0;
  EMBcount = 0;
  rejectCount = 0;
  filter = false;
  previousYear: number;
  appAge: number;
  escalateBtn: boolean = false;

  existingClientCheck: boolean = false;
  linkedClient: boolean = false;
  exisitingArchitect: boolean = false;
  linkedArchitect: boolean = false;

  architectFullName: string;
  architectEmail: string;
  architectUserId: string;

  isArchivePlan: boolean;
  //Banner Kyle 26/01/24
  showBanner: boolean = false;
  //Banner kYLE 26/01/24

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
  clientIDNumber = ''; //This was made ready, but was ultimately not pushed into function... 
  clientPhysicalAddress :any;
  clientBpNumber = '';

  /*New Engineer information*/
  engineerIDNo = '';
  bpNoApplicant = '';
  professionalRegNo = '';
  name = '';
  surname = '';
  applicantTellNo = '';
  applicantEmail = '';


  closeResult = "";
  contractorIDNo = '';
  bpNoContractor = "";
  ProfessionalRegNo = "";
  CIBRating = "";
  Name = "";
  Surname = '';
  ContractorTell?: number;
  ContractorEmail = '';
  defaultPageSize: number;
  option = "";
  btnActiveClient: boolean = true;
  btnActiveInternal: boolean = false;
  @ViewChild("internalOpt", { static: true }) content!: ElementRef;
  @ViewChild("externalOpt", { static: true }) external!: ElementRef;
  @ViewChild("clientOption", { static: true }) clientOption!: ElementRef;
  @ViewChild("user", { static: true }) user!: ElementRef;
  @ViewChild("Prof", { static: true }) Prof!: ElementRef;
  @ViewChild("architects", { static: true }) architect!: ElementRef;
  @ViewChild("archiveOption", { static: true }) archiveOption!: ElementRef;
  @Output() optionEvent = new EventEmitter<string>();

  @ViewChild(MatTable) architectTable: MatTable<ArchitectsList> | undefined;
  dataSourceArchitects = this.ArchitectsList;
  displayedColumnsArchitects: string[] = ['fullName', 'actions'];


  displayedColumns: string[] = ['lSNumber', 'ownerName', 'propertyAddress', 'ERFNumber', 'stage', 'status', 'stageAge', 'planAge', 'dateCreated', 'actions'];
  displayedColumnsBP: string[] = ['lSNumber', 'ownerName', 'propertyAddress', 'ERFNumber', 'stage', 'status', 'stageAge', 'planAge',  'dateCreated', 'actions'];
  displayedColumnsSA: string[] = ['lSNumber', 'ownerName', 'propertyAddress', 'ERFNumber', 'stage', 'status', 'stageAge', 'planAge',  'dateCreated',  'actions'];
  dataSourceBP = this.ApplicationsBP;
  scrutinyApplications: ApplicationsListBP[] = [];
  dataSourceSA = this.scrutinyApplications;
  originalDataSourceSA: ApplicationsListBP[] = []; //BPRegister Sindiswa 20062024 to enable the filtering of the list that's selected
  isArchitect: boolean = false;
  bpApplicationId: number;

  private subscriptions: Subscription[] = [];

  createNewWayleaveBtn: boolean = true;
  createNewPlanningWayleaveBtn: boolean = true;
  date: any;

  applicationType: boolean;
  isPlanning: boolean;
  userID: any;
  FilterBtn: boolean = false;
  viewEscalateDate = 0;
  selectedDep = 0;
  SelectActingDep = '';
  selectedZone = 0;
  SelectActingDZone = ''; 
  gotDrafts: boolean;
  externalUser: boolean = false;
  ActingAsInternal: boolean = false;
  public EMB: boolean = false;
  disableButtons: boolean = false;
  stringifiedDataRoles: any;

  complainantID:string;
  complainantName: string;
  complainantEmail: string;
  complainantCell: string;
  complainantTel: string;

  //complaint address details
  complainantAddress: string;
  cadastralDescription: string;
  streetNumber: string;
  streetName: string;
  suburb: string;
  city: string;
  postalCode: string;
  lotNumber: string;
  portion: string;
  township: string;

  details: string;
  applicationTypeName: string;
  selectedFunctionalArea: string;
    bpApplicationType: any;

  constructor(
    private router: Router,
    private applicationService: ApplicationsService,
    private sharedService: SharedService,
    private viewContainerRef: ViewContainerRef,
    private stagesService: StagesService,
    private NewWayleaveComponent: NewWayleaveComponent,
    private accessGroupsService: AccessGroupsService,
    private configService: ConfigService,
    private userPofileService: UserProfileService,
    private modalService: NgbModal,
    private selectEngineerTableComponent: SelectEngineerTableComponent,
    private selectContractorTableComponent: SelectContractorTableComponent,
    private professionalService: ProfessionalService,
    private loginComponent: LoginComponent,
    private zoneForCommentService: ZoneForCommentService,
    private subDepartmentService: SubDepartmentsService,
    private zoneLinkService: ZoneLinkService,
    private changeDetectorRef: ChangeDetectorRef,
    private cdr: ChangeDetectorRef, //tables weren't showing in modal...
    private userService: UserService,
    private newProfileComponent: NewProfileComponent,
    private businessPartnerService: BusinessPartnerService,
    private dialog: MatDialog,
    private subDepartmentForCommentService: SubDepartmentForCommentService,
    private _snackBar: MatSnackBar, private renderer: Renderer2, private el: ElementRef,
    private draftApplicationService: DraftApplicationsService,
    private notificationsService: NotificationsService, // notifications Sindiswa 01 Februart 2024
    private notificationsComponent: NotificationCenterComponent, // notifications Sindiswa 09 February 2024
    private UserlinkToArchitectService: UserLinkToArchitectService,
    private bpApplicationService: BuildingApplicationsService,
    private bpNotificationService: BPNotificationsService,
    private bpDemolitionComponent: BPDemolitionApplicationComponent,
    private bpComplaintsService: BPComplaintsService,
    private bpDemolitionService: BPDemolitionApplicationService,
    private bpSignageService: BPSignageApplicationService,
    private bpBannerService: BPBannerApplicationService,
    private bpFlagService: BPFlagApplicationService,
    private bpFunctionalAreasService: BPFunctionalAreasService,
    private _bottomSheet: MatBottomSheet,
  ) {
    this.currentDate = new Date();
    this.previousMonth = this.currentDate.getMonth();
    this.previousYear = this.currentDate.getFullYear();
  }

  isTableLoading: boolean = true;
  InternalExternalUser: boolean = false;
  newList = [];
  newInternalList = [];
  currentDate: Date;
  previousMonth: number;
  @ViewChild(MatTable) applicationsTable: MatTable<ApplicationsListBP> | undefined;
 
  //displayedColumns: string[] = ['ProjectNumber', 'FullName', 'Stage', 'Status', 'TypeOfApplication', 'AplicationAge', 'StageAge', 'DateCreated', 'actions'];
  dataSource = this.Applications;
  AllCurrentUserRoles: any;
  routerSubscription: Subscription; //reapply Sindiswa 26 January 2024

  @ViewChild("placesRef") placesRef: GooglePlaceDirective | undefined;
  readonly southwest = { lat: -29.730694, lng: 30.169144 };
  readonly southeast = { lat: -29.730694, lng: 30.602760 };
  readonly northeast = { lat: -29.469492, lng: 30.602760 };
  readonly northwest = { lat: -29.469492, lng: 30.169144 };

  readonly bounds: google.maps.LatLngBounds = new google.maps.LatLngBounds(this.southwest, this.northeast); // Create a LatLngBounds object
  options = {
    types: [],
    componentRestrictions: {
      country: 'ZA',
    },
    disableDoubleClickZoom: true,
    bounds: this.bounds, // Set the bounds property - doesn't seem to be working
  } as unknown as Options;

  openAddArchitect(addArchitect: any) {
    this.modalService.open(addArchitect, {
      centered: true,
      size: 'xl',
      backdrop: 'static', // Prevent clicking outside the modal to close it
      keyboard: false // Prevent pressing the ESC key to close the modal
    });
  }

  openSnackBar(message: string) {
    this._snackBar.openFromComponent(SnackBarAlertsComponent, {
      data: { message }, // Pass the message as data to the component
      duration: 3 * 1000,
      panelClass: ['green-snackbar'],
      verticalPosition: 'top',
    });
  }

  applyFilter(event: Event): string[] {
    const filterValue = (event.target as HTMLInputElement).value.toUpperCase();
    if (filterValue === "") {

      // If the filter is empty, reset the dataSource to the original data
      this.dataSource = [...this.Applications];
      this.newList = [];
     /* this.applicationsTable?.renderRows();*/
      return this.dataSource.map(user => user.ProjectNumber || "");


      ;
    } else {
      // Filters Kyle 16/01/24
      const sanitizedFilterValue = filterValue.replace(/[^\w\s]/g, '');
      const regex = new RegExp(sanitizedFilterValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      // Render the rows after applying the filter

      // Apply the filter to the dataSource based on the ProjectNumber property
      this.dataSource = this.Applications.filter(user => {

        const sanitizedProjectNumber = (user.ProjectNumber || '').replace(/[^\w\s]/g, '');
        const sanitizedFullName = (user.FullName || '').replace(/[^\w\s]/g, '');
        const sanitizedStage = (user.CurrentStage || '').replace(/[^\w\s]/g, '');
        const sanitizedStatus = (user.ApplicationStatus || '').replace(/[^\w\s]/g, '');
        const sanitizedType = (user.TypeOfApplication || '').replace(/[^\w\s]/g, '');
        const sanitizedApplicationAge = (user.TestApplicationAge || '').toString();
        const sanitizedStageAge = (user.TestApplicationStageAge || '').toString();
        const sanitizedDateCreated = (user.DateCreated || '').replace(/[^\w\s]/g, '');

        return regex.test(sanitizedProjectNumber.toUpperCase()) ||
          regex.test(sanitizedFullName.toUpperCase()) ||
          regex.test(sanitizedStage.toUpperCase()) ||
          regex.test(sanitizedStatus.toUpperCase()) ||
          regex.test(sanitizedType.toUpperCase()) ||
          regex.test(sanitizedApplicationAge.toUpperCase()) ||
          regex.test(sanitizedStageAge.toUpperCase()) ||
          regex.test(sanitizedDateCreated.toUpperCase());
      });

    /*  this.applicationsTable?.renderRows();*/
      this.newList = [...this.dataSource];
      console.log(this.newList);
      // Extract and return newList
      return this.newList;

      // Filters Kyle 16/01/24
    }
  }

  @ViewChild(MatTable) linkUsersTable: MatTable<any> | undefined;
  displayedColumnsLinkUsers: string[] = ['idNumber', 'fullName', 'actions'];
  dataSourceLinkUsers = this.ClientUserList;

  @ViewChild(MatTable) linkAllUsersTable: MatTable<any> | undefined;
  //displayedColumnsLinkAllUsers: string[] = ['idNumber', 'fullName', 'actions'];
  displayedColumnsLinkAllUsers: string[] = ['internalDepartment', 'fullName', 'actions'];
  dataSourceLinkAllUsers = this.AllInternalUserProfileList;

  //I lost the Client list table

  applyExistingClientFilter(event: Event): void {

    //this.ClientUserList.splice(0, this.ClientUserList.length);

    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    console.log('Filtering with:', filterValue);

    if (filterValue === '') {
      // If the filter is empty, reset the dataSource to the original data
      this.dataSourceLinkUsers = [...this.ClientUserList];
      this.newList = [];
    } else {

      // Apply the filter to the dataSource based on columns 'idNumber' and 'fullName'
      this.dataSourceLinkUsers = this.ClientUserList.filter((user: any) => {
        return (
          (user.idNumber?.toLowerCase() || '').includes(filterValue) ||
          (user.fullName?.toLowerCase() || '').includes(filterValue)
        );
      });

      this.newList = [...this.dataSourceLinkUsers];
    }
    console.log('Filtered Data:', this.newList);
    // Render the rows after applying the filter
    this.linkUsersTable?.renderRows();
  }

  applyInternalClientFilter(event: Event): void {

    //this.ClientUserList.splice(0, this.ClientUserList.length);

    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    console.log('Filtering with:', filterValue);

    if (filterValue === '') {
      // If the filter is empty, reset the dataSource to the original data
      this.dataSourceLinkAllUsers = [...this.AllInternalUserProfileList];
      this.newInternalList = [];
    } else {
      // Apply the filter to the dataSource based on columns 'idNumber' and 'fullName'
      this.dataSourceLinkAllUsers = this.AllInternalUserProfileList.filter((user: any) => {
        return (
          (user.idNumber?.toLowerCase() || '').includes(filterValue) ||
          (user.fullName?.toLowerCase() || '').includes(filterValue)
        );
      });

      this.newInternalList = [...this.dataSourceLinkAllUsers];
    }
    console.log('Filtered Data:', this.newInternalList);
    // Render the rows after applying the filter
    this.linkAllUsersTable?.renderRows();
  }
  //Filtered list is duplicated sometimes??

  ngOnInit(): void {






      // #region reapply Sindiswa 26 January 2024
      /*this.routerSubscription = this.sharedService.getRoutingToOldAapp();
      if (this.routerSubscription) {
        this.routerSubscription.unsubscribe();
      }*/
    this.isLoading = true;
    this.selectedTabIndex = 8;
      this.sharedService.setShowFormerApps(true);
      this.sharedService.setFromReApplyArchive(false);
      // #endregion
    this.GetAllApplications();
      this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
      this.CurrentUser = JSON.parse(this.stringifiedData);
      this.getAllStages();
      this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
      this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);

      this.isArchitect = this.CurrentUserProfile[0].isArchitect;

      // #region escalation Sindiswa 29 January 2024 - just debugging
      console.log("These are the current user's details - I want to find out if they are EMB or nah", this.CurrentUserProfile);
      console.log("Is this the directorate?", this.CurrentUserProfile[0].directorate);
      // #endregion


      // #region escalation Sindiswa 30 Janu
      // #endregion
      //Audit Trail Kyle
      this.sharedService.isViewReport = false; 
      this.sharedService.isReports = false;
      //Audit Trail Kyle 

     /* this.getRolesLinkedToUser();*/
      this.UpdateProjectNumberConfig();

      /* this.select = "option3";*/


      this.onCheckIfUserHasAccess();

    
      this.getAllSubDepartments();
      this.getAllUserLinks();
      this.getConfig();
      this.getAllInternalUsers();
      this.getDraftsList();
      this.getAllExternalUsers(); //returns null at this point
      this.Reviews = 'Current';
      //this.ServerType = this.sharedService.getServerType();onFilterButtonClick
      this.isBannerVisible();
 
    this.GetAllApplications();
/*        this.GetAllPreInvoiceScrutinyApplications();
        this.GetAllBuildingPlansApplications();
        this.getAllPreInvoiceScurtinyApplications();*/
      
/*        this.dataSourceSA = this.AllApplications;
        this.originalDataSourceSA = [...this.AllApplications];*/

      this.stringifiedDataRoles = JSON.parse(JSON.stringify(localStorage.getItem('AllCurrentUserRoles')));
      this.AllCurrentUserRoles = JSON.parse(this.stringifiedDataRoles);

 
      this.onCheckAllRolesForUser();
      this.getAllClientsForArchitect();
      this.setSelectedVal();
      // Call the appropriate method based on the initially selected value
/*      this.onToggleChange(this.selectedVal);*/
      /*      this.initializeApp();*/
      //this.function();
  

    //this.defaultPageSize = 10;
  }
/*  dataSourceLinkUsers = new MatTableDataSource<ClientUserList>([]);*/
  ngAfterViewInit() {

  }


  //builder's break banner
  //Banner Kyle 26/01/24
  alertMessage: string;
  startDate: string;
  endDate: string;
  showDates: string;
  tagLength: number;

/*  dataSourceClients.data = this.ArchitectClients;*/
  isBannerVisible() {

    this.configService.getConfigsByConfigName("Alert").subscribe((data: any) => {

      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {

          const current = data.dateSet[i];

          const startEnd = current.utilitySlot1;
          const currentDate = new Date();
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          let start = startEnd.substring(0, startEnd.indexOf(" "));
          let end = startEnd.substring(startEnd.indexOf(" ") + 1);

          let startDate = this.parseDate(start);
          let endDate = this.parseDate(end);

          //Banner Kyle 06-03-24
          if (current.utilitySlot2 == "0") {
            this.disableButtons = false;
          }
          else if (current.utilitySlot2 == "1") {
            this.disableButtons = true;
          }
          

          console.log("Testing alerts", current, this.disableButtons);

          if (currentDate.toISOString().split('T')[0] >= startDate.toISOString().split('T')[0] && currentDate.toISOString().split('T')[0] <= endDate.toISOString().split('T')[0]) {
            const checking = currentDate.toISOString().split('T')[0];

            this.showBanner = true;
            this.alertMessage = current.configDescription.toUpperCase();

            this.startDate = `${startDate.getDate()} ${months[startDate.getMonth()]} ${startDate.getFullYear()}`;

            this.endDate = `${endDate.getDate()} ${months[endDate.getMonth()]} ${endDate.getFullYear()}`;
            if (current.utilitySlot3 == "0") {
              this.showDates = "";
            }
            else if (current.utilitySlot3 == "1") {
              this.showDates = " FROM " + this.startDate + " TO " + this.endDate;
            }
            this.tagLength = this.alertMessage.length + this.showDates.length;
            break;
          }
          else {
            this.showBanner = false;

          }
        }
      } else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);



    }, error => {
      console.log("Error: ", error);
    })
  }
  private parseDate(dateString: any): Date {


    return new Date(dateString);
  }
  //Banner Kyle 26/01/24



  cardchange(ids: any) {
    this.option = ids;
    this.sharedService.option = this.option;
  }
  openSelectArchitect(architects: any) {
    this.modalService.open(architects, { centered: true, size: 'xl' });
  }

  getAllUserLinks() {

    this.zoneLinkService.getAllUserLinks(this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {

        // const current = 
        for (let i = 0; i < data.dateSet.length; i++) {

          if (this.AllSubDepartmentList) {

          }


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

  ChangeActingDepartment() {

  }



  sendOption() {
    if (this.option == "internal") {

      

      this.sharedService.clientUserID = this.CurrentUser.appUserId;
      
      this.onCreateBuildingApplication();
      
    }
    else {
      this.getAllExternalUsers()
      this.openClientOption(this.clientOption);

    }

  }
  openSm(internalOpt: any) {
    this.modalService.open(internalOpt, {
      centered: true,
      size: 'lg',
      backdrop: 'static', // Prevent clicking outside the modal to close it
      keyboard: false // Prevent pressing the ESC key to close the modal
    });

   
  }
  openExternal(externalOpt: any) {
    this.modalService.open(externalOpt, {
      centered: true,
      size: 'lg',
      backdrop: 'static', // Prevent clicking outside the modal to close it
      keyboard: false // Prevent pressing the ESC key to close the modal
    });
  }

  openClientOption(clientOption: any) {

    this.modalService.open(clientOption, {
      centered: true,
      size: 'lg',
      backdrop: 'static', // Prevent clicking outside the modal to close it
      keyboard: false // Prevent pressing the ESC key to close the modal
    });
  }

  isModalOpen = false;
  // Function to handle modal dismissal from the modal component
  closeModalFromModal() {
    // Set the modal state to closed
    this.isModalOpen = false;

    // Clear the filter and reset the lists
    this.clearFilter();
  }

  // Function to clear the filter and reset the lists
  clearFilter() {
    this.dataSourceLinkUsers = [...this.ClientUserList];
    this.newList = [];
    this.dataSourceLinkAllUsers = [...this.AllInternalUserProfileList]
    this.newInternalList = [];
  }

  //The filter acts up sometimes - 
  openUser(user: any, architectClient: any) {

    //if (this.isModalOpen) {
    //  // Modal is already open, do nothing or handle it as needed
    //  return;
    //}

    if (confirm("Are you sure you want to apply for an existing client?")) {
      this.isModalOpen = true;

      this.clearFilter();
      if (this.CurrentUserProfile[0].isInternal) {
        const modalRef = this.modalService.open(user, {
          centered: true,
          size: 'lg',
          backdrop: 'static', // Prevent clicking outside the modal to close it
          keyboard: false // Prevent pressing the ESC key to close the modal
        });

        modalRef.result.then(
          (result) => {
            // Handle modal closure here
            this.isModalOpen = false;
            this.clearFilter();
          },
          (reason) => {
            // Handle modal dismissal here if needed
            this.isModalOpen = false;
            this.clearFilter();
          }
        );
      }
      else {
        this.getAllClientsForArchitect();
        this.modalService.open(architectClient, {
          centered: true,
          size: 'lg',
          backdrop: 'static', // Prevent clicking outside the modal to close it
          keyboard: false // Prevent pressing the ESC key to close the modal
        });
      }
    } else {
      // Handle the case when the user cancels the confirmation
    }
  }

  openXl(Prof: any) {
    //Service Conditions Kyle
    if (this.isPlanning == false) {
      this.modalService.open(Prof, {
        centered: true,
        size: 'xl',
        backdrop: 'static', // Prevent clicking outside the modal to close it
        keyboard: false // Prevent pressing the ESC key to close the modal
      });
    }
    else {
      //Service Information Kyle 31/01/24
      this.populateClientInfo();
    }
    //Service Information Kyle 31/01/24
  }

  openNewClient(newClient: any) {
    this.modalService.open(newClient, {
      centered: true,
      size: 'xl',
      backdrop: 'static', // Prevent clicking outside the modal to close it
      keyboard: false // Prevent pressing the ESC key to close the modal
    });
  }


  openProcessFlowModal(processFlow: any) {
    this.modalService.open(processFlow, { centered: true, size: 'xl' });
  }

  openUserActingDepModal() {
    this.dialog.open(ConfigActingDepartmentComponent, {
      width: '60%',
      maxHeight: 'calc(100vh - 90px)',
      height: 'auto'
    });
  }

  onAddNewClient() {


    this.loginComponent.onRegister(this.clientName + " " + this.clientSurname, this.clientEmail, this.clientCellNo, this.clientBpNumber, this.clientCompanyName, this.clientCompanyRegNo, this.clientPhysicalAddress, null, this.clientIDNumber);
    this.nextBtn = true;
  }
  nextBtn: boolean;
  nextBtn2: boolean;
  stepper: MatStepper;
  checkIfError(stepper: MatStepper) {

    if (this.sharedService.errorForRegister == true) {
      alert("Please enter an email that is not already in use")
    }
    else if (this.clientEmail == "" || this.clientName == "") {
      alert("Please fill out all information")

    }
    else {
      stepper.next();
    }
  }

  /*paginator stuff*/



  getLinkedZones(ApplicationID: any, processFlow: any) {

    this.ZoneLinkedList.splice(0, this.ZoneLinkedList.length);

    this.zoneForCommentService.getZonesForComment(ApplicationID, null).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempZoneList = {} as ZoneList;
          const current = data.dateSet[i];
          tempZoneList.zoneID = current.zoneID;
          tempZoneList.zoneName = current.zoneName;
/*          tempZoneList.subDepartmentID = current.subDepartmentID;*/
          tempZoneList.departmentID = current.departmentID;
          tempZoneList.zoneForCommentID = current.zoneForCommentID;
          tempZoneList.subDepartmentName = current.subDepartmentName;


          this.ZoneLinkedList.push(tempZoneList);
          this.ZoneListTable?.renderRows();

        }


        this.ZoneListTable?.renderRows();

        this.modalService.open(processFlow, { backdrop: 'static', centered: true, size: 'lg' });

      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);
      this.ZoneListTable?.renderRows();


    }, error => {
      console.log("Error: ", error);
    })

  }

  onAddContractor() {

    let refreshTable = new SelectEngineerTableComponent(this.professionalService, this.sharedService);


    if (this.sharedService.clientUserID != null || this.sharedService.clientUserID != "") {

      refreshTable.onAddContractor(this.bpNoContractor, this.professionalRegNo, this.Name, this.Surname, this.ContractorEmail, this.ContractorTell.toString(), this.contractorIDNo, this.CIBRating, this.sharedService.clientUserID);


      this.bpNoContractor = "";
      this.professionalRegNo = "";
      this.Name = "";
      this.Surname = "";
      this.ContractorEmail = "";
      this.ContractorTell = null;
      this.contractorIDNo = "";
      this.CIBRating = "";
      // this.populateClientInfo();
      //this.router.navigate(["/home"]);
      //this.router.navigate(["/new-wayleave"], { queryParams: { isPlanningS: this.isPlanning } });
      //refreshTable.getProfessionalsListByProfessionalType('Engineer');
      //refreshTable.refreshTable();

    }
    else {
      refreshTable.onAddContractor(this.bpNoContractor, this.professionalRegNo, this.Name, this.Surname, this.ContractorEmail, this.ContractorTell.toString(), this.contractorIDNo, this.userID);


      this.bpNoContractor = "";
      this.professionalRegNo = "";
      this.Name = "";
      this.Surname = "";
      this.ContractorEmail = "";
      this.ContractorTell = null;
      this.contractorIDNo = "";
      this.CIBRating = "";
      // this.populateClientInfo();
      //this.router.navigate(["/home"]);
      //this.router.navigate(["/new-wayleave"], { queryParams: { isPlanningS: this.isPlanning } });
      //refreshTable.getProfessionalsListByProfessionalType('Engineer');
      //refreshTable.refreshTable();

    }

  }

  onAddEngineer() {

    let refreshTable = new SelectEngineerTableComponent(this.professionalService, this.sharedService);
    if (this.sharedService.clientUserID != null || this.sharedService.clientUserID != "") {

      const newEnineer = {} as EngineerList;
      newEnineer.ProfessinalType = "Engineer";
      newEnineer.bpNumber = this.bpNoApplicant;
      newEnineer.professionalRegNo = this.professionalRegNo;
      newEnineer.name = this.name;
      newEnineer.surname = this.surname;
      newEnineer.email = this.applicantEmail;
      newEnineer.phoneNumber = this.applicantTellNo;
      refreshTable.onAddEngineer(this.bpNoApplicant, this.professionalRegNo, this.name, this.surname, this.applicantEmail, this.applicantTellNo, this.engineerIDNo, this.sharedService.clientUserID);


      this.bpNoApplicant = "";
      this.professionalRegNo = "";
      this.name = "";
      this.surname = "";
      this.applicantEmail = "";
      this.applicantTellNo = "";
      this.engineerIDNo = "";
    } else {

      const newEnineer = {} as EngineerList;
      newEnineer.ProfessinalType = "Engineer";
      newEnineer.bpNumber = this.bpNoApplicant;
      newEnineer.professionalRegNo = this.professionalRegNo;
      newEnineer.name = this.name;
      newEnineer.surname = this.surname;
      newEnineer.email = this.applicantEmail;
      newEnineer.phoneNumber = this.applicantTellNo;
      refreshTable.onAddEngineer(this.bpNoApplicant, this.professionalRegNo, this.name, this.surname, this.applicantEmail, this.applicantTellNo, this.engineerIDNo, this.userID);


      this.bpNoApplicant = "";
      this.professionalRegNo = "";
      this.name = "";
      this.surname = "";
      this.applicantEmail = "";
      this.applicantTellNo = "";
      this.engineerIDNo = "";
    }

    // this.populateClientInfo();
    //this.router.navigate(["/home"]);
    //this.router.navigate(["/new-wayleave"], { queryParams: { isPlanningS: this.isPlanning } });
    //refreshTable.getProfessionalsListByProfessionalType('Engineer');
    //refreshTable.refreshTable();

  }

  getAllExternalUsers() {

    this.UserList.splice(0, this.UserList.length);
    this.ClientUserList.splice(0, this.ClientUserList.length);


    this.userPofileService.getExternalUsers().subscribe((data: any) => {
      console.log("I entered the service");
      if (data.responseCode == 1) {
        console.log("Received data:", data);
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempUsersList = {} as ClientUserList;
          const current = data.dateSet[i];
          tempUsersList.userId = current.userID;
          tempUsersList.idNumber = current.idNumber;
          tempUsersList.fullName = current.fullName;

          this.sharedService.clientUserID = current.userID;
          this.ClientUserList.push(tempUsersList);

        }
        console.log("This is your client user list: " + JSON.stringify(this.ClientUserList));
      }
      else {
        alert(data.responseMessage);
      }
 


      console.log("reponse", data);

    }, error => {

      console.log("Error: ", error);
    })
    //console.log("Did I skip the service?");
  }

  getUserID(index: any) {
    console.log("Turtle Speed is too fast for me");
    /*ClientUserList will get messed up when there is filtering
    this.userID = this.ClientUserList[index].userId; 
    this.selectedUserName = this.ClientUserList[index].fullName;*/

    if (index >= 0 && index < this.dataSourceLinkUsers.length) {
      this.userID = this.dataSourceLinkUsers[index].userId;
      this.selectedUserName = this.dataSourceLinkUsers[index].fullName;

      this.sharedService.clientUserID = this.userID;
      this.clientUserID = this.userID;

      this.getAllProfessionalsListByProfessionalType("Engineer");
      this.getAllProfessionalsListByProfessionalType("Contractor");
      console.log("You selected: " + this.userID);
    }
  }

  getInternalUserID(index: any) {


    /*AllInternalUserProfileList will get messed up when there is filtering
    this.userID = this.AllInternalUserProfileList[index].userId;
    this.selectedUserName = this.AllInternalUserProfileList[index].fullName;*/
    if (index >= 0 && index < this.dataSourceLinkAllUsers.length) {
      this.userID = this.dataSourceLinkAllUsers[index].userId;
      this.selectedUserName = this.dataSourceLinkAllUsers[index].fullName;

      this.sharedService.clientUserID = this.userID;
      this.clientUserID = this.userID;

      this.getAllProfessionalsListByProfessionalType("Engineer");
      this.getAllProfessionalsListByProfessionalType("Contractor");
      console.log("You selected: " + this.userID);
    }

  }

  populateClientInfo() {
    //Service Information Kyle 31/01/24
    if (this.isPlanning == false) {
      if (confirm("Are you sure you are done?")) {

        this.createWayleave(this.applicationType, this.isPlanning);
      }
    }
    else {
      this.createWayleave(this.applicationType, this.isPlanning);
    }
    //Service Information Kyle 31/01/24


  }

  UpdateProjectNumberConfig() {

    /*    if (this.CurrentUserProfile[0].isInternal == false) {
          
    
          this.getAllApplicationsByUserID();
        }*/

    let currentMonth = this.currentDate.getMonth() + 1;
    let changeUtility = ("/" + this.currentDate.getFullYear() % 100).toString();
    //return currentMonth !== this.previousMonth;


    this.configService.getConfigsByConfigName("ProjectNumberTracker").subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          let dbMonth = current.utilitySlot2.substring(0, 2);
          if (dbMonth < 10) {
            this.previousMonth = dbMonth.substring(1, 2);
          } else {
            this.previousMonth = dbMonth;
          }

          if (currentMonth !== Number(this.previousMonth)) {  //this.previousMonth  currentMonth
            if (currentMonth < 10) {
              this.configService.addUpdateConfig(current.configID, null, null, "0", "0" + currentMonth + changeUtility, null, this.CurrentUser.appUserId).subscribe((data: any) => {
                if (data.responseCode == 1) {
                  //for (let i = 0; i < data.dateSet.length; i++) {
                  //  const current = data.dateSet[i];



                  //}

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
              this.configService.addUpdateConfig(current.configID, null, null, "0", currentMonth + changeUtility, null, this.CurrentUser.appUserId).subscribe((data: any) => {
                if (data.responseCode == 1) {
                  //for (let i = 0; i < data.dateSet.length; i++) {
                  //  const current = data.dateSet[i];



                  //}

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

          }
          else {
            if (currentMonth < 10) {
              this.configService.addUpdateConfig(current.configID, null, null, current.utilitySlot1, "0" + currentMonth + changeUtility, null, this.CurrentUser.appUserId).subscribe((data: any) => {
                if (data.responseCode == 1) {
                  //for (let i = 0; i < data.dateSet.length; i++) {
                  //  const current = data.dateSet[i];



                  //}

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
              this.configService.addUpdateConfig(current.configID, null, null, current.utilitySlot1, currentMonth + changeUtility, null, this.CurrentUser.appUserId).subscribe((data: any) => {
                if (data.responseCode == 1) {
                  //for (let i = 0; i < data.dateSet.length; i++) {
                  //  const current = data.dateSet[i];



                  //}

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
          }


        }


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

  //getRolesLinkedToUser() {

  //  this.RolesList.splice(0, this.RolesList.length);

  //  this.accessGroupsService.getAllRolesForUser(this.CurrentUser.appUserId).subscribe((data: any) => {

  //    if (data.responseCode == 1) {


  //      for (let i = 0; i < data.dateSet.length; i++) {
  //        const tempRolesList = {} as RolesList;
  //        const current = data.dateSet[i];
  //        tempRolesList.AccessGroupName = current.accessGroupName;
  //        tempRolesList.AccessGroupID = current.accessGroupID;
  //        tempRolesList.RoleID = current.roleID;
  //        tempRolesList.RoleName = current.roleName;

  //        this.RolesList.push(tempRolesList);
  //        /*jjs commit 23JAN24 - typoFix for Email for Sign off, Applicant filter dashbaord table fix*/
  //        if (tempRolesList.RoleName == "Applicant") {

  //          this.InternalExternalUser = true;
  //          this.FilterBtn = false;

  //          this.applicationService.getApplicationsList(this.CurrentUser.appUserId, false).subscribe((data: any) => {


  //            if (data.responseCode == 1) {


  //              for (let i = 0; i < data.dateSet.length; i++) {
  //                const tempApplicationList = {} as ApplicationsList;
  //                const tempApplicationListShared = {} as ApplicationList;
  //                const current = data.dateSet[i];





  //                console.log("current", current)
  //                tempApplicationList.ApplicationID = current.applicationID;
  //                tempApplicationList.FullName = current.fullName;
  //                tempApplicationList.TypeOfApplication = current.typeOfApplication;
  //                tempApplicationList.CurrentStage = current.currentStageName;
  //                tempApplicationList.ApplicationStatus = current.applicationStatus;
  //                tempApplicationList.isEscalated = current.isEscalated; //escalation Sindiswa 29 January 2024

  //                tempApplicationList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
  //                tempApplicationListShared.CurrentStageStartDate = current.currentStageStartDate.substring(0, current.dateCreated.indexOf('T'));

  //                /*cal application age*/

  //                const currentDate = new Date();
  //                const dateCreated = new Date(tempApplicationList.DateCreated);
  //                const timeDiff = currentDate.getTime() - dateCreated.getTime();
  //                const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  //                tempApplicationList.TestApplicationAge = daysDiff;

  //                /*cal stage age*/
  //                const stageDateCreated = new Date(tempApplicationListShared.CurrentStageStartDate);
  //                const stageDate = currentDate.getTime() - stageDateCreated.getTime();
  //                const stageDateDiff = Math.floor(stageDate / (1000 * 3600 * 24));
  //                tempApplicationList.TestApplicationStageAge = stageDateDiff;
  //                console.log("WheknfnfetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAge", tempApplicationList.TestApplicationStageAge);



  //                if (current.projectNumber != null) {
  //                  tempApplicationList.ProjectNumber = current.projectNumber;
  //                } else {
  //                  tempApplicationList.ProjectNumber = (current.applicationID).toString();
  //                }


  //                /*            do {
  //                              tempApplicationList.TestApplicationStageAge = Math.floor(Math.random() * 30) + 1;
  //                            } while (tempApplicationList.TestApplicationStageAge > tempApplicationList.TestApplicationAge);*/
  //                //save here to send to the shared

  //                //tempApplicationListShared.applicationID = current. ;
  //                tempApplicationListShared.applicationID = current.applicationID;
  //                tempApplicationListShared.clientName = current.fullName;
  //                tempApplicationListShared.clientEmail = current.email;
  //                tempApplicationListShared.clientAlternativeEmail = current.alternativeEmail; //checkingNotifications Sindiswa 15 February 2024
  //                tempApplicationListShared.clientAddress = current.physicalAddress;
  //                tempApplicationListShared.clientRefNo = current.referenceNumber;
  //                tempApplicationListShared.CompanyRegNo = current.companyRegNo;
  //                tempApplicationListShared.TypeOfApplication = current.typeOfApplication;
  //                tempApplicationListShared.NotificationNumber = current.notificationNumber;
  //                tempApplicationListShared.WBSNumber = current.wbsNumber;
  //                tempApplicationListShared.PhysicalAddressOfProject = current.physicalAddressOfProject;
  //                tempApplicationListShared.DescriptionOfProject = current.descriptionOfProject;
  //                tempApplicationListShared.NatureOfWork = current.natureOfWork;
  //                tempApplicationListShared.ExcavationType = current.excavationType;
  //                tempApplicationListShared.ExpectedStartDate = current.expectedStartDate;
  //                tempApplicationListShared.ExpectedEndDate = current.expectedEndDate;
  //                tempApplicationListShared.Location = current.location;
  //                tempApplicationListShared.clientCellNo = current.phoneNumber;
  //                tempApplicationListShared.CreatedById = current.createdById;
  //                tempApplicationListShared.UserID = current.userID;//
  //                tempApplicationListShared.ApplicationStatus = current.applicationStatus;
  //                tempApplicationListShared.CurrentStageName = current.currentStageName;
  //                tempApplicationListShared.CurrentStageNumber = current.currentStageNumber;

  //                tempApplicationListShared.NextStageName = current.nextStageName;
  //                tempApplicationListShared.NextStageNumber = current.nextStageNumber;
  //                tempApplicationListShared.PreviousStageName = current.previousStageName;
  //                tempApplicationListShared.PreviousStageNumber = current.previousStageNumber;
  //                tempApplicationListShared.DatePaid = current.datePaid;
  //                tempApplicationListShared.wbsrequired = current.wbsRequired;
  //                tempApplicationListShared.Coordinates = current.coordinates;
  //                if (current.projectNumber != null) {
  //                  tempApplicationListShared.ProjectNumber = current.projectNumber;
  //                } else {
  //                  tempApplicationListShared.ProjectNumber = (current.applicationID).toString();
  //                }

  //                tempApplicationListShared.isPlanning = current.isPlanning;
  //                tempApplicationListShared.permitStartDate = current.permitStartDate;

  //                tempApplicationListShared.ContractorAccountDetails = current.contractorAccountDetails; //zxNumberUpdate Sindiswa 01 March 2024

  //                //#region escalation Sindiswa 31 January 2024
  //                tempApplicationList.isEscalated = current.isEscalated;
  //                tempApplicationList.EscalationDate = current.escalationDate;
  //                tempApplicationList.EMBActionDate = current.embActionDate;
  //                //#endregion

  //                //Project size Kyle 27-02-24
  //                
  //                if (current.networkLicenses == true) {
  //                  tempApplicationListShared.NetworkLicensees = "Fibre Network Licensees have been contacted regarding trench sharing and existing services";
  //                }
  //                else {
  //                  tempApplicationListShared.NetworkLicensees = "Not working";
  //                }
  //                this.applicationDataForView.push(tempApplicationListShared);
  //                console.log("this.applicationDataForViewthis.applicationDataForViewthis.applicationDataForView", this.applicationDataForView);
  //                this.Applications.push(tempApplicationList);
  //                /*Cehcing the escaltion date*/
  //                this.configService.getConfigsByConfigName("EscalationDate").subscribe((data: any) => {

  //                  if (data.responseCode == 1) {

  //                    const current = data.dateSet[0];
  //                    console.log("currentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrent", current);
  //                    this.viewEscalateDate = current.configDescription;
  //                    if (this.Applications[i].TestApplicationAge >= Number(this.viewEscalateDate)) {
  //                      this.escalateBtn = true;
  //                    }

  //                  }
  //                  else {
  //                    alert("Error");
  //                  }

  //                  console.log("response", data);
  //                }, error => {
  //                  console.log("Error", error);
  //                })
  //              }

  //              this.applicationsTable?.renderRows();
  //              //for card filters
  //              /* this.select = "option3";*/
  //              this.recentUnpaidCount();
  //              this.recentDistributedCount();
  //              this.recentApprovedCount();
  //              this.recentejectedCount();
  //              this.recentWIPCount();
  //              this.isTableLoading = false;
  //              console.log("Got all applications", data.dateSet);
  //            }
  //            else {
  //              alert(data.responseMessage);
  //            }

  //          })

  //        }

  //        if (tempRolesList.RoleName == "Acting As Internal") {
  //          this.ActingAsInternal = true;
  //        }
  //        /*   if (tempRolesList.RoleID == 1008) {
  //             if (this.EMB == false) {
  //               this.EMB = true;
  //               this.onFilterApplicationsForEMB();
  //             }
  //             else {
   
  //             }
   
  //           }*/


  //        if (tempRolesList.RoleName == "Department Admin") {

  //        }
  //      }
  //      this.sharedService.setCurrentUserRole(this.RolesList);

  //      if (this.InternalExternalUser == false && this.EMB == false) {

  //        this.getAllApplicationsByUserID();
  //      }


  //      // this.rolesTable?.renderRows();
  //      console.log("getAllLinkedRolesReponseForUser", data.dateSet);



  //    }
  //    else {
  //      //alert("Invalid Email or Password");
  //      alert(data.responseMessage);
  //    }
  //    console.log("getAllLinkedRolesReponse", data);

  //  }, error => {
  //    console.log("getAllLinkedRolesReponseError: ", error);
  //  })

  //}

  @ViewChild(MatButtonToggleGroup) buttonToggleGroup: MatButtonToggleGroup;

  @ViewChild('mySelect') mySelect: MatSelect;
  getAllApplicationsByUserID() {
    /* this.pastAndCurrentReviews = false;
 
 
     this.Applications.splice(0, this.Applications.length);
 
     if (this.CurrentUserProfile[0].isInternal) {
 
 
 
 
       this.FilterBtn = true;
 *//*      this.onFilterApplicationForMyReviews();*//*
    
        }
        else {
    
    
    
          *//*this.select = "option3";*//*


    this.applicationService.getApplicationsList(this.CurrentUser.appUserId, false).subscribe((data: any) => {


      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempApplicationList = {} as ApplicationsList;
          const tempApplicationListShared = {} as ApplicationList;
          const current = data.dateSet[i];
          console.log("current", current)
          tempApplicationListShared.UserID = current.userID; // icasaDetailsDisplay Sindiswa 16 January 2024, it seems like this fixed the undefined UserID issue for external users checking on their applications
          tempApplicationList.ApplicationID = current.applicationID;
          tempApplicationList.FullName = current.fullName;
          tempApplicationList.TypeOfApplication = current.typeOfApplication;
          tempApplicationList.CurrentStage = current.currentStageName;
          tempApplicationList.ApplicationStatus = current.applicationStatus;
          this.date = current.dateCreated;
          tempApplicationList.DateCreated = this.date.substring(0, current.dateCreated.indexOf('T'));;;
          tempApplicationList.isEscalated = current.isEscalated; //escalation Sindiswa 29 January 2024

          if (current.projectNumber != null) {
            tempApplicationList.ProjectNumber = current.projectNumber;
          } else {
            tempApplicationList.ProjectNumber = (current.applicationID).toString();
          }

          tempApplicationListShared.CurrentStageStartDate = current.currentStageStartDate.substring(0, current.dateCreated.indexOf('T'));
          *//*cal application age*//*

    const currentDate = new Date();
    const dateCreated = new Date(tempApplicationList.DateCreated);
    const timeDiff = currentDate.getTime() - dateCreated.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
    tempApplicationList.TestApplicationAge = daysDiff;

    *//*cal stage age*//*
    const stageDateCreated = new Date(tempApplicationListShared.CurrentStageStartDate);
    const stageDate = currentDate.getTime() - stageDateCreated.getTime();
    const stageDateDiff = Math.floor(stageDate / (1000 * 3600 * 24));
    tempApplicationList.TestApplicationStageAge = stageDateDiff;
    //save here to send to the shared

    //tempApplicationListShared.applicationID = current. ;
    tempApplicationListShared.applicationID = current.applicationID;
    tempApplicationListShared.clientName = current.fullName;
    tempApplicationListShared.clientEmail = current.email;
    tempApplicationListShared.clientAlternativeEmail = current.alternativeEmail; //checkingNotifications Sindiswa 15 February 2024
    tempApplicationListShared.clientAddress = current.physicalAddress;
    tempApplicationListShared.clientRefNo = current.referenceNumber;
    tempApplicationListShared.CompanyRegNo = current.companyRegNo;
    tempApplicationListShared.TypeOfApplication = current.typeOfApplication;
    tempApplicationListShared.NotificationNumber = current.notificationNumber;
    tempApplicationListShared.WBSNumber = current.wbsNumber;
    tempApplicationListShared.PhysicalAddressOfProject = current.physicalAddressOfProject;
    tempApplicationListShared.DescriptionOfProject = current.descriptionOfProject;
    tempApplicationListShared.NatureOfWork = current.natureOfWork;
    tempApplicationListShared.ExcavationType = current.excavationType;
    tempApplicationListShared.ExpectedStartDate = current.expectedStartDate;
    tempApplicationListShared.ExpectedEndDate = current.expectedEndDate;
    tempApplicationListShared.Location = current.location;
    tempApplicationListShared.clientCellNo = current.phoneNumber;
    tempApplicationListShared.CreatedById = current.createdById;
    tempApplicationListShared.ApplicationStatus = current.applicationStatus;
    tempApplicationListShared.CurrentStageName = current.currentStageName;
    tempApplicationListShared.CurrentStageNumber = current.currentStageNumber;
    tempApplicationListShared.CurrentStageStartDate = current.currentStageStartDate;
    tempApplicationListShared.NextStageName = current.nextStageName;
    tempApplicationListShared.NextStageNumber = current.nextStageNumber;
    tempApplicationListShared.PreviousStageName = current.previousStageName;
    tempApplicationListShared.PreviousStageNumber = current.previousStageNumber;
    tempApplicationListShared.DatePaid = current.datePaid;
    tempApplicationListShared.wbsrequired = current.wbsRequired;
    tempApplicationListShared.Coordinates = current.coordinates;
    if (current.projectNumber != null) {
      tempApplicationListShared.ProjectNumber = current.projectNumber;
    } else {
      tempApplicationListShared.ProjectNumber = (current.applicationID).toString();
    }
    
    tempApplicationListShared.isPlanning = current.isPlanning;
    if (current.networkLicenses == true) {
      tempApplicationListShared.NetworkLicensees = "Fibre Network Licensees have been contacted regarding trench sharing and existing services";
    }
    else {
      tempApplicationListShared.NetworkLicensees = " ";
    }

    tempApplicationListShared.ContractorAccountDetails = current.contractorAccountDetails; //zxNumberUpdate Sindiswa 01 March 2024
    //#region escalation Sindiswa 31 January 2024
    tempApplicationList.isEscalated = current.isEscalated;
    tempApplicationList.EscalationDate = current.escalationDate;
    tempApplicationList.EMBActionDate = current.embActionDate;
    //#endregion

    this.applicationDataForView.push(tempApplicationListShared);
    console.log("this.applicationDataForViewthis.applicationDataForViewthis.applicationDataForView", this.applicationDataForView);
    *//*console.log("this.applicationDataForViewthis.applicationDataForViewthis.applicationDataForView", this.tempApplicationList);*//*

    this.Applications.push(tempApplicationList);

  }
  *//* this.mySelect.disabled = true;*//*
    this.applicationsTable?.renderRows();
    this.cardFilters = false;

    console.log("Got all applications", data.dateSet);

  }
  else {
    alert(data.responseMessage);
  }

  //for card filters
  *//* this.select = "option3";*//*
    this.recentUnpaidCount();
    this.recentDistributedCount();
    this.recentApprovedCount();
    this.recentejectedCount();
    this.recentWIPCount();
    this.isTableLoading = false;

  })
}

const userId = this.CurrentUser.appUserId;
const isInternal = this.CurrentUserProfile[0].isInternal;


// Store the subscription in the subscriptions array
const subscription = this.applicationService.getApplicationsList(userId, isInternal)
  .subscribe((data: any) => {
    // Handle data
  });
this.subscriptions.push(subscription);
*/

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
          tempStageList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));


          /*const stageDateCreated = new Date(this.StagesList[i].DateCreated);
          const stageDate = currentDate.getTime() - stageDateCreated.getTime();
          const stageDateDiff = Math.floor(stageDate / (1000 * 3600 * 24));
          tempApplicationList.TestApplicationStageAge = stageDateDiff;
          console.log("WheknfnfetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAge", tempApplicationList.TestApplicationStageAge);
*/

          this.StagesList.push(tempStageList);
          this.sharedService.setStageData(this.StagesList);
        }

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

  ngOnDestroy() {

    this.viewContainerRef.clear();
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });

  }



  goToNewWayleave(applicationType: boolean, isPlanning: boolean) { //application type refers to whether it is a brand new application or if it is a reapply.

    this.getAllExternalUsers();
    this.applicationType = applicationType;
    this.isPlanning = isPlanning;



    if (this.CurrentUserProfile[0].isInternal === true || this.ActingAsInternal == true) {
      this.openSm(this.content);
    } else {

      if (this.gotDrafts == true) {
        this.openExternal(this.external);
      }
      else {
        this.createWayleave(this.applicationType, this.isPlanning);
      }

    }

  }

  //JJS-15-02-2024 Fixing the delete drafts (wasn't deleting)

  openNewWayleave() {
    this.createWayleave(this.applicationType, this.isPlanning);
    this.modalService.dismissAll();
  }

  createWayleave(applicationType: boolean, isPlanning: boolean) {
    //application type refers to whether it is a brand new application or if it is a reapply.
    console.log("THIS IS THE APPLICATION TYPE", applicationType);
   /* this.sharedService.setReapply(applicationType)*/;

    
    if (this.option == "client" || this.option == 'proxy') {

      this.NewWayleaveComponent.onWayleaveCreate(this.userID, isPlanning, false);
      // this.NewWayleaveComponent.populateClientInfo(this.userID);
    }
    else {
      this.NewWayleaveComponent.onWayleaveCreate(this.CurrentUser.appUserId, isPlanning, false);
    }


    this.viewContainerRef.clear();
  }


  /*  countUnpaid() {
  
      for (var i = 0; i < this.applicationDataForView.length; i++) {
        const current = this.applicationDataForView[i];
        if (current.ApplicationStatus == "Unpaid") {
          this.unpaidcount++;
  
        }  
      }
    }
    }
  
    countDistributed() {
  
      for (var i = 0; i < this.applicationDataForView.length; i++) {
        const current = this.applicationDataForView[i];
        if (current.ApplicationStatus == "Distributing" || current.ApplicationStatus == "Distributed/Unallocated" ) {
          this.distributioncount++;
  
        }
      }
    }
  
    countApproved() {
  
      for (var i = 0; i < this.applicationDataForView.length; i++) {
        const current = this.applicationDataForView[i];
        if (current.ApplicationStatus == "PTW Pending" || current.ApplicationStatus == "APG" || current.ApplicationStatus == "Monitoring") {
          this.approveCount++;
  
        }
      }
    }
  
  
    countEMBStage() {
  
      for (var i = 0; i < this.applicationDataForView.length; i++) {
        const current = this.applicationDataForView[i];
        if (current.ApplicationStatus == "EMB") {
          this.EMBcount++;
        }
      }
    }
  
    countRejection() {
  
      for (var i = 0; i < this.applicationDataForView.length; i++) {
        const current = this.applicationDataForView[i];
        if (current.ApplicationStatus == "Rejected") {
          this.rejectCount++;
        }
      }
    }*/

  countUnpaid() {
    this.unpaidcount = this.dataSource.length;
  }

  countDistributed() {

    this.distributioncount = this.dataSource.length;
  }

  countApproved() {
    this.approveCount = this.dataSource.length;

  }


  countEMBStage() {
    this.EMBcount = this.dataSource.length;
  }

  countRejection() {
    this.rejectCount = this.dataSource.length;
  }


  /*  paid
    approved
    final approval
    EMB
    and then approved or rejected*/

  /*  unpaidcount = 0;
    distributioncount = 0;
    approveCount = 0;
    EMBcount = 0;
    rejectCount = 0;*/



  filterByUnpaid() {

    if (this.filter == false) {
      this.dataSource = this.Applications.filter(df => df.ApplicationStatus == "Unpaid");
      this.filter = true;
    }
    else {
      this.dataSource = this.Applications.filter(df => df.DateCreated);
      this.filter = false;
    }

  }

  filterByDistribution() {
    if (this.filter == false) {
      this.dataSource = this.Applications.filter(df => df.ApplicationStatus == "Distributing" || df.ApplicationStatus == "Distributed/Unallocated");
      this.filter = true;
    }
    else {
      this.dataSource = this.Applications.filter(df => df.DateCreated);
      this.filter = false;
    }
  }

  filterByApproved() {

    if (this.filter == false) {
      this.dataSource = this.Applications.filter(df => df.ApplicationStatus == "APG" || df.ApplicationStatus == "Final Approval" || df.ApplicationStatus == "PTW Pending");
      this.filter = true;
    }
    else {
      this.dataSource = this.Applications.filter(df => df.DateCreated);
      this.filter = false;
    }
  }

  filterByRejected() {
    // Filter your data by the "Rejected" status.
    this.dataSource = this.dataSource.filter(item => item.ApplicationStatus === 'Rejected');

    // Update the count variable.

  }

  filterByWIP() {
    if (this.filter == false) {
      this.dataSource = this.Applications.filter(df => df.ApplicationStatus == "Monitoring");
      this.filter = true;
    }
    else {
      this.dataSource = this.Applications.filter(df => df.DateCreated);
      this.filter = false;
    }
  }

  /*  filterByUnpaid() {
      if (this.filter == false) {
        this.dataSource = this.Applications.filter(df => df.ApplicationStatus == "Unpaid");
        this.filter = true;
      }
      else {
        this.dataSource = this.Applications.filter(df => df.DateCreated);
        this.filter = false;
      }
  
    }
  
    filterByDistribution() {
      if (this.filter == false) {
        this.dataSource = this.Applications.filter(df => df.ApplicationStatus == "Distributing" || df.ApplicationStatus == "Distributed/Unallocated");
        this.filter = true;
      }
      else {
        this.dataSource = this.Applications.filter(df => df.DateCreated);
        this.filter = false;
      }
    }
  
      filterByApproved() {
        if (this.filter == false) {
          this.dataSource = this.Applications.filter(df => df.ApplicationStatus == "Approved" || df.ApplicationStatus == "Final Approval" || df.ApplicationStatus == "PTW Pending");
          this.filter = true;
        }
        else {
          this.dataSource = this.Applications.filter(df => df.DateCreated);
          this.filter = false;
        }
    }
  
    filterByRejected() {
      if (this.filter == false) {
        this.dataSource = this.Applications.filter(df => df.ApplicationStatus == "Rejected");
        this.filter = true;
      }
      else {
        this.dataSource = this.Applications.filter(df => df.DateCreated);
        this.filter = false;
      }
    }
  
    filterByWIP() {
      if (this.filter == false) {
        this.dataSource = this.Applications.filter(df => df.ApplicationStatus == "EMB");
        this.filter = true;
      }
      else {
        this.dataSource = this.Applications.filter(df => df.DateCreated);
        this.filter = false;
      }
    }*/

  //Checks if user can re-apply
  async CheckIfCanReapply(element: any, index: any) {





    this.relatedApplications.splice(0, this.relatedApplications.length);

    //this.sharedService.getProjectNumber() i removed this
    // #region checkingNotifications Sindiswa 15 February 2024
    if (element.ProjectNumber === null || element.ProjectNumber === undefined || !element.ProjectNumber.startsWith("WL:")) {
      this.canReapply = false;
      this.sharedService.setCanReapply(false);
      console.log("You cannot reapply.");

      this.sharedService.setProjectNumber(element.ProjectNumber);

      await this.applicationService.getApplicationsByProjectNumber(element.ProjectNumber).subscribe((data: any) => {
        if (data.responseCode == 1) {
          console.log("This should be the unpaid external's project", data);

          for (let i = 0; i < data.dateSet.length; i++) {
            const tempRelatedApplications = {} as ApplicationList;
            const current = data.dateSet[i];
            tempRelatedApplications.ProjectNumber = current.projectNumber;

            this.relatedApplications.push(tempRelatedApplications);

          }

        }
        else {

          alert(data.responseMessage);
        }
        console.log("Reponse while viewing unpaid external project:", data);

       /* this.viewProject(index);*/

      }, error => {
        console.log("Error while viewing unpaid external project: ", error);
      })


    }
    // #endregion

    //if (this.newList.length <= 0) { //checkingNotifications Sindiswa 15 February 2024 - 
    else if (this.newList.length <= 0) {

      this.sharedService.setProjectNumber(element.ProjectNumber);

      await this.applicationService.getApplicationsByProjectNumber(element.ProjectNumber).subscribe((data: any) => {
        if (data.responseCode == 1) {
          console.log("These are my projects by project number", data);

          for (let i = 0; i < data.dateSet.length; i++) {
            const tempRelatedApplications = {} as ApplicationList;
            const current = data.dateSet[i];
            tempRelatedApplications.ProjectNumber = current.projectNumber;

            this.relatedApplications.push(tempRelatedApplications);
            // this.sharedService.setStageData(this.StagesList);
          }



          if (data.dateSet.length < 3) { //make it such that only the applicant and originator can re-apply || shnap, external people don't get project number until they have paid

            this.canReapply = true;
            this.sharedService.setCanReapply(true);
          } else {
            this.canReapply = false;
            this.sharedService.setCanReapply(false);
          }
        }
        else {
          //alert("Invalid Email or Password");
          alert(data.responseMessage);
        }
        console.log("reponse", data);

/*        this.viewProject(index);*/

      }, error => {
        console.log("Error: ", error);
      })
    }
    else {

      this.sharedService.setProjectNumber(this.newList[index].ProjectNumber);

      await this.applicationService.getApplicationsByProjectNumber(this.newList[index].ProjectNumber).subscribe((data: any) => {
        if (data.responseCode == 1) {


          for (let i = 0; i < data.dateSet.length; i++) {
            const tempRelatedApplications = {} as ApplicationList;
            const current = data.dateSet[i];
            tempRelatedApplications.ProjectNumber = current.projectNumber;

            this.relatedApplications.push(tempRelatedApplications);
            // this.sharedService.setStageData(this.StagesList);
          }



          if (data.dateSet.length < 3) {

            this.canReapply = true;
            this.sharedService.setCanReapply(true);
          } else {
            this.canReapply = false;
            this.sharedService.setCanReapply(false);
          }
        }
        else {
          //alert("Invalid Email or Password");
          alert(data.responseMessage);
        }
        console.log("reponse", data);

     /*   this.viewProject(index);*/

      }, error => {
        console.log("Error: ", error);
      })

    }




  }


  page = 4;
  pageSize = 10;
  pageSizeOptions: number[] = [10, 25, 50, 100];
  length: any;


  onCheckIfUserHasAccess() {

    this.userPofileService.getUserProfileById(this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {
        const tempUserList = {} as UserList
        const current = data.dateSet[0]
        tempUserList.userID = current.userID;
        tempUserList.depConfirmation = current.depConfirmation;
        tempUserList.isInternal = current.isInternal;
        this.UserList.push(tempUserList);

        if (tempUserList.depConfirmation != true && tempUserList.isInternal == true) {
          this.router.navigate(["/internal-user-unassigned-department"]);
        }
        else {

        }
        console.log("SJKBKSVBJKSJV", this.UserList);
      }

      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  myApplicaitonsUnpaidCount() {

    const unpaidApplications = this.Applications.filter((element) => {
      return element.ApplicationStatus === 'Unpaid' && element.FullName == this.CurrentUser.fullName;
    });

    // Update the unpaidcount variable with the count of "Unpaid" applications
    this.unpaidcount = unpaidApplications.length;
  }

  myApplicaitonsDistributedCount() {
    // Filter the dataSource based on the "Status" column
    const distributedApplications = this.Applications.filter((element) => {
      return element.ApplicationStatus === 'Distributed' && element.FullName == this.CurrentUser.fullName;
    });

    // Update the unpaidcount variable with the count of "Unpaid" applications
    this.distributioncount = distributedApplications.length;
  }
  myApplicaitonsApprovedCount() {
    // Filter the dataSource based on the "Status" column
    const approvedApplications = this.Applications.filter((element) => {
      return element.ApplicationStatus === 'PTW Pending' && element.FullName == this.CurrentUser.fullName;
    });

    // Update the unpaidcount variable with the count of "Unpaid" applications
    this.approveCount = approvedApplications.length;
  }

  myApplicaitonsejectedCount() {
    // Filter the dataSource based on the "Status" column
    const rejectedApplications = this.Applications.filter((element) => {
      return element.ApplicationStatus === 'Rejected' && element.FullName == this.CurrentUser.fullName;
    });

    // Update the unpaidcount variable with the count of "Unpaid" applications
    this.rejectCount = rejectedApplications.length;
  }
  myApplicaitonsWIPCount() {
    // Filter the dataSource based on the "Status" column
    const wipApplications = this.Applications.filter((element) => {
      return element.ApplicationStatus === 'Monitoring' && element.FullName == this.CurrentUser.fullName;
    });

    // Update the unpaidcount variable with the count of "Unpaid" applications
    this.EMBcount = wipApplications.length;
  }




  recentUnpaidCount() {

    const unpaidApplications = this.Applications.filter((element) => {
      return element.ApplicationStatus === 'Unpaid';
    });

    // Update the unpaidcount variable with the count of "Unpaid" applications
    this.unpaidcount = unpaidApplications.length;
  }

  recentDistributedCount() {
    // Filter the dataSource based on the "Status" column
    const distributedApplications = this.Applications.filter((element) => {
      return element.ApplicationStatus === 'Distributed';
    });

    // Update the unpaidcount variable with the count of "Unpaid" applications
    this.distributioncount = distributedApplications.length;
  }
  recentApprovedCount() {
    // Filter the dataSource based on the "Status" column
    const approvedApplications = this.Applications.filter((element) => {
      return element.ApplicationStatus === 'PTW Pending' || element.ApplicationStatus === 'APG';
    });

    // Update the unpaidcount variable with the count of "Unpaid" applications
    this.approveCount = approvedApplications.length;
  }

  recentejectedCount() {
    // Filter the dataSource based on the "Status" column
    const rejectedApplications = this.Applications.filter((element) => {
      return element.ApplicationStatus === 'Rejected';
    });

    // Update the unpaidcount variable with the count of "Unpaid" applications
    this.rejectCount = rejectedApplications.length;
  }
  recentWIPCount() {
    // Filter the dataSource based on the "Status" column
    const wipApplications = this.Applications.filter((element) => {
      return element.ApplicationStatus === 'Monitoring';
    });

    // Update the unpaidcount variable with the count of "Unpaid" applications
    this.EMBcount = wipApplications.length;
  }








  notNyProjects = false;
  MyProjects = false;
  select = '';
  cardFilters: boolean = false;

 /* filterForMyDep() {
    this.isTableLoading = true;

    this.onFilterButtonClick();
    this.notNyProjects = true;
    this.MyProjects = false;
    this.pastAndCurrentReviews = false;
    this.FiterValue = "";
    this.FiterValue = "All Applications In " + this.CurrentUserProfile[0].departmentName + ", For " + this.CurrentUserProfile[0].zoneName;
    this.cardFilters = false;
    this.applicationDataForView = [];
    this.Applications = [];
    let number = 21;
    if (this.CurrentUserProfile[0].isZoneAdmin == true) {

    }

    this.applicationService.getApplicationsForDepartment(this.CurrentUserProfile[0].zoneID, this.CurrentUserProfile[0].subDepartmentID).subscribe((data: any) => {


      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempApplicationList = {} as ApplicationsList;
          const tempApplicationListShared = {} as ApplicationList;
          const current = data.dateSet[i];





          console.log("current", current)
          tempApplicationList.ApplicationID = current.applicationID;
          tempApplicationList.FullName = current.fullName;
          tempApplicationList.TypeOfApplication = current.typeOfApplication;
          tempApplicationList.CurrentStage = current.currentStageName;
          tempApplicationList.ApplicationStatus = current.applicationStatus;
          tempApplicationList.isEscalated = current.isEscalated; //escalation Sindiswa 29 January 2024

          tempApplicationList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
          tempApplicationListShared.CurrentStageStartDate = current.currentStageStartDate.substring(0, current.dateCreated.indexOf('T'));

          *//*cal application age*//*

          const currentDate = new Date();
          const dateCreated = new Date(tempApplicationList.DateCreated);
          const timeDiff = currentDate.getTime() - dateCreated.getTime();
          const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
          tempApplicationList.TestApplicationAge = daysDiff;

          *//*cal stage age*//*
          const stageDateCreated = new Date(tempApplicationListShared.CurrentStageStartDate);
          const stageDate = currentDate.getTime() - stageDateCreated.getTime();
          const stageDateDiff = Math.floor(stageDate / (1000 * 3600 * 24));
          tempApplicationList.TestApplicationStageAge = stageDateDiff;
          console.log("WheknfnfetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAge", tempApplicationList.TestApplicationStageAge);



          if (current.projectNumber != null) {
            tempApplicationList.ProjectNumber = current.projectNumber;
          } else {
            tempApplicationList.ProjectNumber = (current.applicationID).toString();
          }


          *//*            do {
                        tempApplicationList.TestApplicationStageAge = Math.floor(Math.random() * 30) + 1;
                      } while (tempApplicationList.TestApplicationStageAge > tempApplicationList.TestApplicationAge);*//*
          //save here to send to the shared

          //tempApplicationListShared.applicationID = current. ;
          tempApplicationListShared.applicationID = current.applicationID;
          tempApplicationListShared.clientName = current.fullName;
          tempApplicationListShared.clientEmail = current.email;
          tempApplicationListShared.clientAlternativeEmail = current.alternativeEmail; //checkingNotifications Sindiswa 15 February 2024
          tempApplicationListShared.clientAddress = current.physicalAddress;
          tempApplicationListShared.clientRefNo = current.referenceNumber;
          tempApplicationListShared.CompanyRegNo = current.companyRegNo;
          tempApplicationListShared.TypeOfApplication = current.typeOfApplication;
          tempApplicationListShared.NotificationNumber = current.notificationNumber;
          tempApplicationListShared.WBSNumber = current.wbsNumber;
          tempApplicationListShared.PhysicalAddressOfProject = current.physicalAddressOfProject;
          tempApplicationListShared.DescriptionOfProject = current.descriptionOfProject;
          tempApplicationListShared.NatureOfWork = current.natureOfWork;
          tempApplicationListShared.ExcavationType = current.excavationType;
          tempApplicationListShared.ExpectedStartDate = current.expectedStartDate;
          tempApplicationListShared.ExpectedEndDate = current.expectedEndDate;
          tempApplicationListShared.Location = current.location;
          tempApplicationListShared.clientCellNo = current.phoneNumber;
          tempApplicationListShared.CreatedById = current.createdById;

          tempApplicationListShared.UserID = current.userID;//
          tempApplicationListShared.ApplicationStatus = current.applicationStatus;
          tempApplicationListShared.CurrentStageName = current.currentStageName;
          tempApplicationListShared.CurrentStageNumber = current.currentStageNumber;

          tempApplicationListShared.NextStageName = current.nextStageName;
          tempApplicationListShared.NextStageNumber = current.nextStageNumber;
          tempApplicationListShared.PreviousStageName = current.previousStageName;
          tempApplicationListShared.PreviousStageNumber = current.previousStageNumber;
          tempApplicationListShared.DatePaid = current.datePaid;
          tempApplicationListShared.wbsrequired = current.wbsRequired;
          tempApplicationListShared.Coordinates = current.coordinates;
          if (current.projectNumber != null) {
            tempApplicationListShared.ProjectNumber = current.projectNumber;
          } else {
            tempApplicationListShared.ProjectNumber = (current.applicationID).toString();
          }

          tempApplicationListShared.isPlanning = current.isPlanning;
          tempApplicationListShared.permitStartDate = current.permitStartDate;

          tempApplicationListShared.ContractorAccountDetails = current.contractorAccountDetails; //zxNumberUpdate Sindiswa 01 March 2024

          //#region escalation Sindiswa 31 January 2024
          tempApplicationList.isEscalated = current.isEscalated;
          tempApplicationList.EscalationDate = current.escalationDate;
          tempApplicationList.EMBActionDate = current.embActionDate;
          //#endregion

          this.applicationDataForView.push(tempApplicationListShared);
          console.log("this.applicationDataForViewthis.applicationDataForViewthis.applicationDataForView", this.applicationDataForView);
          this.Applications.push(tempApplicationList);
          *//*Cehcing the escaltion date*//*
          this.configService.getConfigsByConfigName("EscalationDate").subscribe((data: any) => {

            if (data.responseCode == 1) {

              const current = data.dateSet[0];
              console.log("currentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrent", current);
              this.viewEscalateDate = current.configDescription;
              if (this.Applications[i].TestApplicationAge >= Number(this.viewEscalateDate)) {
                this.escalateBtn = true;
              }

            }
            else {
              alert("Error");
            }

            console.log("response", data);
          }, error => {
            console.log("Error", error);
          })
        }
        this.changeDetectorRef.detectChanges();
        this.dataSource = this.Applications.filter(df => df.DateCreated);
        *//*this.applicationsTable?.renderRows();*//*
        //for card filters

        this.recentUnpaidCount();
        this.recentDistributedCount();
        this.recentApprovedCount();
        this.recentejectedCount();
        this.recentWIPCount();
        this.isTableLoading = false;
        console.log("Got all applications", data.dateSet);
      }
      else {
        alert(data.responseMessage);
      }

    })
  }*/

  getCurrentUserZoneID() {

  }
  ActingAs: boolean = false;




  onFilterApplicationsForEMB() {

    this.isTableLoading = true;
    this.ActingAs = true;
    this.onFilterButtonClick();
    this.notNyProjects = true;
    this.pastAndCurrentReviews = true;
    this.MyProjects = false;
    this.FiterValue = "";
    this.FiterValue = "Your Reviews";
    this.cardFilters = false;
    this.applicationDataForView = [];
    this.Applications = [];
    this.applicationDataForView = [];
    this.Applications = [];
    this.applicationService.getApplicationsForEMB(this.CurrentUser.appUserId).subscribe((data: any) => {


      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempApplicationList = {} as ApplicationsList;
          const tempApplicationListShared = {} as ApplicationList;
          const current = data.dateSet[i];





          console.log("current", current)
          tempApplicationList.ApplicationID = current.applicationID;
          tempApplicationList.FullName = current.fullName;
          tempApplicationList.TypeOfApplication = current.typeOfApplication;
          tempApplicationList.CurrentStage = current.currentStageName;
          tempApplicationList.ApplicationStatus = current.applicationStatus;
          tempApplicationList.isEscalated = current.isEscalated; //escalation Sindiswa 29 January 2024

          tempApplicationList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
          tempApplicationListShared.CurrentStageStartDate = current.currentStageStartDate.substring(0, current.dateCreated.indexOf('T'));

          /*cal application age*/

          const currentDate = new Date();
          const dateCreated = new Date(tempApplicationList.DateCreated);
          const timeDiff = currentDate.getTime() - dateCreated.getTime();
          const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
          tempApplicationList.TestApplicationAge = daysDiff;

          /*cal stage age*/
          const stageDateCreated = new Date(tempApplicationListShared.CurrentStageStartDate);
          const stageDate = currentDate.getTime() - stageDateCreated.getTime();
          const stageDateDiff = Math.floor(stageDate / (1000 * 3600 * 24));
          tempApplicationList.TestApplicationStageAge = stageDateDiff;
          console.log("WheknfnfetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAge", tempApplicationList.TestApplicationStageAge);



          if (current.projectNumber != null) {
            tempApplicationList.ProjectNumber = current.projectNumber;
          } else {
            tempApplicationList.ProjectNumber = (current.applicationID).toString();
          }


          /*            do {
                        tempApplicationList.TestApplicationStageAge = Math.floor(Math.random() * 30) + 1;
                      } while (tempApplicationList.TestApplicationStageAge > tempApplicationList.TestApplicationAge);*/
          //save here to send to the shared

          //tempApplicationListShared.applicationID = current. ;
          tempApplicationListShared.applicationID = current.applicationID;
          tempApplicationListShared.clientName = current.fullName;
          tempApplicationListShared.clientEmail = current.email;
          tempApplicationListShared.clientAlternativeEmail = current.alternativeEmail; //checkingNotifications Sindiswa 15 February 2024
          tempApplicationListShared.clientAddress = current.physicalAddress;
          tempApplicationListShared.clientRefNo = current.referenceNumber;
          tempApplicationListShared.CompanyRegNo = current.companyRegNo;
          tempApplicationListShared.TypeOfApplication = current.typeOfApplication;
          tempApplicationListShared.NotificationNumber = current.notificationNumber;
          tempApplicationListShared.WBSNumber = current.wbsNumber;
          tempApplicationListShared.PhysicalAddressOfProject = current.physicalAddressOfProject;
          tempApplicationListShared.DescriptionOfProject = current.descriptionOfProject;
          tempApplicationListShared.NatureOfWork = current.natureOfWork;
          tempApplicationListShared.ExcavationType = current.excavationType;
          tempApplicationListShared.ExpectedStartDate = current.expectedStartDate;
          tempApplicationListShared.ExpectedEndDate = current.expectedEndDate;
          tempApplicationListShared.Location = current.location;
          tempApplicationListShared.clientCellNo = current.phoneNumber;
          tempApplicationListShared.CreatedById = current.createdById;
          tempApplicationListShared.UserID = current.userID;//
          tempApplicationListShared.ApplicationStatus = current.applicationStatus;
          tempApplicationListShared.CurrentStageName = current.currentStageName;
          tempApplicationListShared.CurrentStageNumber = current.currentStageNumber;

          tempApplicationListShared.ContractorAccountDetails = current.contractorAccountDetails; //zxNumberUpdate Sindiswa 01 March 2024
          tempApplicationListShared.NextStageName = current.nextStageName;
          tempApplicationListShared.NextStageNumber = current.nextStageNumber;
          tempApplicationListShared.PreviousStageName = current.previousStageName;
          tempApplicationListShared.PreviousStageNumber = current.previousStageNumber;
          tempApplicationListShared.DatePaid = current.datePaid;
          tempApplicationListShared.wbsrequired = current.wbsRequired;
          tempApplicationListShared.Coordinates = current.coordinates;
          if (current.projectNumber != null) {
            tempApplicationListShared.ProjectNumber = current.projectNumber;
          } else {
            tempApplicationListShared.ProjectNumber = (current.applicationID).toString();
          }

          tempApplicationListShared.isPlanning = current.isPlanning;
          tempApplicationListShared.permitStartDate = current.permitStartDate;


          //#region escalation Sindiswa 31 January 2024
          tempApplicationList.isEscalated = current.isEscalated;
          tempApplicationList.EscalationDate = current.escalationDate;
          tempApplicationList.EMBActionDate = current.embActionDate;
          //#endregion
          if (current.networkLicenses == true) {
            tempApplicationListShared.NetworkLicensees = "Fibre Network Licensees have been contacted regarding trench sharing and existing services";
          }
          else {
            tempApplicationListShared.NetworkLicensees = " ";
          }

          this.applicationDataForView.push(tempApplicationListShared);
          console.log("this.applicationDataForViewthis.applicationDataForViewthis.applicationDataForView", this.applicationDataForView);
          this.Applications.push(tempApplicationList);
          /*Cehcing the escaltion date*/
          this.configService.getConfigsByConfigName("EscalationDate").subscribe((data: any) => {

            if (data.responseCode == 1) {

              const current = data.dateSet[0];
              console.log("currentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrent", current);
              this.viewEscalateDate = current.configDescription;
              if (this.Applications[i].TestApplicationAge >= Number(this.viewEscalateDate)) {
                this.escalateBtn = true;
              }

            }
            else {
              alert("Error");
            }

            console.log("response", data);
          }, error => {
            console.log("Error", error);
          })
        }

        this.dataSource = this.Applications.filter(df => df.DateCreated);
       /* this.applicationsTable?.renderRows();*/
        //for card filters

        this.recentUnpaidCount();
        this.recentDistributedCount();
        this.recentApprovedCount();
        this.recentejectedCount();
        this.recentWIPCount();
        this.isTableLoading = false;
        console.log("Got all applications", data.dateSet);
      }
      else {
        alert(data.responseMessage);
      }

    })
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;

  onFilterAPplicationsForRecentApplications() {
  //  this.isTableLoading = true;
  //  this.onFilterButtonClick();
  //  this.notNyProjects = true;
  //  this.MyProjects = false;
  //  this.pastAndCurrentReviews = false;
  //  this.FiterValue = "";
  //  this.FiterValue = "All Applications";


  //  this.applicationDataForView = [];
  //  this.Applications = [];


  //  this.Applications.splice(0, this.Applications.length);

  //  if (this.CurrentUserProfile[0].isInternal) {
      this.applicationService.getApplicationsList(this.CurrentUser.appUserId, true).subscribe((data: any) => {


        if (data.responseCode == 1) {


          for (let i = 0; i < data.dateSet.length; i++) {
            const tempApplicationList = {} as ApplicationsList;
            const tempApplicationListShared = {} as ApplicationList;
            const current = data.dateSet[i];





            console.log("current", current)
            tempApplicationList.ApplicationID = current.applicationID;
            tempApplicationList.FullName = current.fullName;
            tempApplicationList.TypeOfApplication = current.typeOfApplication;
            tempApplicationList.CurrentStage = current.currentStageName;
            tempApplicationList.ApplicationStatus = current.applicationStatus;
            tempApplicationList.isEscalated = current.isEscalated; //escalation Sindiswa 29 January 2024

            tempApplicationList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
            tempApplicationListShared.CurrentStageStartDate = current.currentStageStartDate.substring(0, current.dateCreated.indexOf('T'));

            //          /*cal application age*/

            const currentDate = new Date();
            const dateCreated = new Date(tempApplicationList.DateCreated);
            const timeDiff = currentDate.getTime() - dateCreated.getTime();
            const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
            tempApplicationList.TestApplicationAge = daysDiff;

            //          /*cal stage age*/
            const stageDateCreated = new Date(tempApplicationListShared.CurrentStageStartDate);
            const stageDate = currentDate.getTime() - stageDateCreated.getTime();
            const stageDateDiff = Math.floor(stageDate / (1000 * 3600 * 24));
            tempApplicationList.TestApplicationStageAge = stageDateDiff;
            console.log("WheknfnfetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAge", tempApplicationList.TestApplicationStageAge);



            if (current.projectNumber != null) {
              tempApplicationList.ProjectNumber = current.projectNumber;
            } else {
              tempApplicationList.ProjectNumber = (current.applicationID).toString();
            }


            do {
              tempApplicationList.TestApplicationStageAge = Math.floor(Math.random() * 30) + 1;
            } while (tempApplicationList.TestApplicationStageAge > tempApplicationList.TestApplicationAge);
            //          //save here to send to the shared

            //tempApplicationListShared.applicationID = current. ;
            tempApplicationListShared.applicationID = current.applicationID;
            tempApplicationListShared.clientName = current.fullName;
            tempApplicationListShared.clientEmail = current.email;
            tempApplicationListShared.clientAlternativeEmail = current.alternativeEmail; //checkingNotifications Sindiswa 15 February 2024
            tempApplicationListShared.clientAddress = current.physicalAddress;
            tempApplicationListShared.clientRefNo = current.referenceNumber;
            tempApplicationListShared.CompanyRegNo = current.companyRegNo;
            tempApplicationListShared.TypeOfApplication = current.typeOfApplication;
            tempApplicationListShared.NotificationNumber = current.notificationNumber;
            tempApplicationListShared.WBSNumber = current.wbsNumber;
            tempApplicationListShared.PhysicalAddressOfProject = current.physicalAddressOfProject;
            tempApplicationListShared.DescriptionOfProject = current.descriptionOfProject;
            tempApplicationListShared.NatureOfWork = current.natureOfWork;
            tempApplicationListShared.ExcavationType = current.excavationType;
            tempApplicationListShared.ExpectedStartDate = current.expectedStartDate;
            tempApplicationListShared.ExpectedEndDate = current.expectedEndDate;
            tempApplicationListShared.Location = current.location;
            tempApplicationListShared.clientCellNo = current.phoneNumber;
            tempApplicationListShared.CreatedById = current.createdById;
            tempApplicationListShared.UserID = current.userID;//
            tempApplicationListShared.ApplicationStatus = current.applicationStatus;
            tempApplicationListShared.CurrentStageName = current.currentStageName;
            tempApplicationListShared.CurrentStageNumber = current.currentStageNumber;

            tempApplicationListShared.ContractorAccountDetails = current.contractorAccountDetails; //zxNumberUpdate Sindiswa 01 March 2024
            tempApplicationListShared.NextStageName = current.nextStageName;
            tempApplicationListShared.NextStageNumber = current.nextStageNumber;
            tempApplicationListShared.PreviousStageName = current.previousStageName;
            tempApplicationListShared.PreviousStageNumber = current.previousStageNumber;
            tempApplicationListShared.DatePaid = current.datePaid;
            tempApplicationListShared.wbsrequired = current.wbsRequired;
            tempApplicationListShared.Coordinates = current.coordinates;
            if (current.projectNumber != null) {
              tempApplicationListShared.ProjectNumber = current.projectNumber;
            } else {
              tempApplicationListShared.ProjectNumber = (current.applicationID).toString();
            }

            tempApplicationListShared.isPlanning = current.isPlanning;
            tempApplicationListShared.permitStartDate = current.permitStartDate;


            //          //#region escalation Sindiswa 31 January 2024
            //          tempApplicationList.isEscalated = current.isEscalated;
            //          tempApplicationList.EscalationDate = current.escalationDate;
            //          tempApplicationList.EMBActionDate = current.embActionDate;
            //          //#endregion
            //          if (current.networkLicenses == true) {
            //            tempApplicationListShared.NetworkLicensees = "Fibre Network Licensees have been contacted regarding trench sharing and existing services";
            //          }
            //          else {
            //            tempApplicationListShared.NetworkLicensees = " ";
            //          }

            //          this.applicationDataForView.push(tempApplicationListShared);
            //          console.log("this.applicationDataForViewthis.applicationDataForViewthis.applicationDataForView", this.applicationDataForView);
            //          this.Applications.push(tempApplicationList);
            //          /*Cehcing the escaltion date*/
            //          this.configService.getConfigsByConfigName("EscalationDate").subscribe((data: any) => {

            //            if (data.responseCode == 1) {

            //              const current = data.dateSet[0];
            //              console.log("currentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrent", current);
            //              this.viewEscalateDate = current.configDescription;
            //              if (this.Applications[i].TestApplicationAge >= Number(this.viewEscalateDate)) {
            //                this.escalateBtn = true;
            //              }

            //            }
            //            else {
            //              alert("Error");
            //            }

            //            console.log("response", data);
            //          }, error => {
            //            console.log("Error", error);
            //          })
            //        }
            
            this.dataSource = this.Applications.filter(df => df.DateCreated);


                    this.applicationsTable?.renderRows();
            //        //for card filters
            //        /* this.select = "option3";*/
            //        this.recentUnpaidCount();
            //        this.recentDistributedCount();
            //        this.recentApprovedCount();
            //        this.recentejectedCount();
            //        this.recentWIPCount();
            //        this.isTableLoading = false;
            //        this.cardFilters = true;
            //        console.log("Got all applications", data.dateSet);
          }
       }
        else {
          alert(data.responseMessage);
        }

      })
    }
  //  else {
  //    this.applicationService.getApplicationsList(this.CurrentUser.appUserId, false).subscribe((data: any) => {


  //      if (data.responseCode == 1) {


  //        for (let i = 0; i < data.dateSet.length; i++) {
  //          const tempApplicationList = {} as ApplicationsList;
  //          const tempApplicationListShared = {} as ApplicationList;
  //          const current = data.dateSet[i];
  //          console.log("current", current)
  //          tempApplicationList.ApplicationID = current.applicationID;
  //          tempApplicationList.FullName = current.fullName;
  //          tempApplicationList.TypeOfApplication = current.typeOfApplication;
  //          tempApplicationList.CurrentStage = current.currentStageName;
  //          tempApplicationList.ApplicationStatus = current.applicationStatus;
  //          tempApplicationList.isEscalated = current.isEscalated; //escalation Sindiswa 29 January 2024
  //          this.date = current.dateCreated;
  //          tempApplicationList.DateCreated = this.date.substring(0, current.dateCreated.indexOf('T'));;;

  //          if (current.projectNumber != null) {
  //            tempApplicationList.ProjectNumber = current.projectNumber;
  //          } else {
  //            tempApplicationList.ProjectNumber = (current.applicationID).toString();
  //          }

  //          tempApplicationListShared.CurrentStageStartDate = current.currentStageStartDate.substring(0, current.dateCreated.indexOf('T'));
  //          /*cal application age*/

  //          const currentDate = new Date();
  //          const dateCreated = new Date(tempApplicationList.DateCreated);
  //          const timeDiff = currentDate.getTime() - dateCreated.getTime();
  //          const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  //          tempApplicationList.TestApplicationAge = daysDiff;

  //          /*cal stage age*/
  //          const stageDateCreated = new Date(tempApplicationListShared.CurrentStageStartDate);
  //          const stageDate = currentDate.getTime() - stageDateCreated.getTime();
  //          const stageDateDiff = Math.floor(stageDate / (1000 * 3600 * 24));
  //          tempApplicationList.TestApplicationStageAge = stageDateDiff;
  //          //save here to send to the shared

  //          //tempApplicationListShared.applicationID = current. ;
  //          tempApplicationListShared.applicationID = current.applicationID;
  //          tempApplicationListShared.clientName = current.fullName;
  //          tempApplicationListShared.clientEmail = current.email;
  //          tempApplicationListShared.clientAlternativeEmail = current.alternativeEmail; //checkingNotifications Sindiswa 15 February 2024
  //          tempApplicationListShared.clientAddress = current.physicalAddress;
  //          tempApplicationListShared.clientRefNo = current.referenceNumber;
  //          tempApplicationListShared.CompanyRegNo = current.companyRegNo;
  //          tempApplicationListShared.TypeOfApplication = current.typeOfApplication;
  //          tempApplicationListShared.NotificationNumber = current.notificationNumber;
  //          tempApplicationListShared.WBSNumber = current.wbsNumber;
  //          tempApplicationListShared.PhysicalAddressOfProject = current.physicalAddressOfProject;
  //          tempApplicationListShared.DescriptionOfProject = current.descriptionOfProject;
  //          tempApplicationListShared.NatureOfWork = current.natureOfWork;
  //          tempApplicationListShared.ExcavationType = current.excavationType;
  //          tempApplicationListShared.ExpectedStartDate = current.expectedStartDate;
  //          tempApplicationListShared.ExpectedEndDate = current.expectedEndDate;
  //          tempApplicationListShared.Location = current.location;
  //          tempApplicationListShared.clientCellNo = current.phoneNumber;
  //          tempApplicationListShared.CreatedById = current.createdById;
  //          tempApplicationListShared.UserID = current.userID;//
  //          tempApplicationListShared.ApplicationStatus = current.applicationStatus;
  //          tempApplicationListShared.CurrentStageName = current.currentStageName;
  //          tempApplicationListShared.CurrentStageNumber = current.currentStageNumber;
  //          tempApplicationListShared.CurrentStageStartDate = current.currentStageStartDate;
  //          tempApplicationListShared.NextStageName = current.nextStageName;
  //          tempApplicationListShared.NextStageNumber = current.nextStageNumber;
  //          tempApplicationListShared.PreviousStageName = current.previousStageName;
  //          tempApplicationListShared.PreviousStageNumber = current.previousStageNumber;
  //          tempApplicationListShared.DatePaid = current.datePaid;
  //          tempApplicationListShared.wbsrequired = current.wbsRequired;
  //          tempApplicationListShared.Coordinates = current.coordinates;
  //          if (current.projectNumber != null) {
  //            tempApplicationListShared.ProjectNumber = current.projectNumber;
  //          } else {
  //            tempApplicationListShared.ProjectNumber = (current.applicationID).toString();
  //          }

  //          tempApplicationListShared.isPlanning = current.isPlanning;

  //          tempApplicationListShared.ContractorAccountDetails = current.contractorAccountDetails; //zxNumberUpdate Sindiswa 01 March 2024

  //          //#region escalation Sindiswa 31 January 2024
  //          tempApplicationList.isEscalated = current.isEscalated;
  //          tempApplicationList.EscalationDate = current.escalationDate;
  //          tempApplicationList.EMBActionDate = current.embActionDate;
  //          //#endregion

  //          if (current.networkLicenses == true) {
  //            tempApplicationListShared.NetworkLicensees = "Fibre Network Licensees have been contacted regarding trench sharing and existing services";
  //          }
  //          else {
  //            tempApplicationListShared.NetworkLicensees = " ";
  //          }

  //          this.applicationDataForView.push(tempApplicationListShared);
  //          console.log("this.applicationDataForViewthis.applicationDataForViewthis.applicationDataForView", this.applicationDataForView);

  //          this.Applications.push(tempApplicationList);

  //        }
  //        this.dataSource = this.Applications.filter(df => df.DateCreated);
  //        this.applicationsTable?.renderRows();


  //        console.log("Got all applications", data.dateSet);

  //      }
  //      else {
  //        alert(data.responseMessage);
  //      }

  //      //for card filters
  //      this.select = "option3";
  //      this.recentUnpaidCount();
  //      this.recentDistributedCount();
  //      this.recentApprovedCount();
  //      this.recentejectedCount();
  //      this.recentWIPCount();

  //    })
  //  }

  //  const userId = this.CurrentUser.appUserId;
  //  const isInternal = this.CurrentUserProfile[0].isInternal;


  //  // Store the subscription in the subscriptions array
  //  const subscription = this.applicationService.getApplicationsList(userId, isInternal)
  //    .subscribe((data: any) => {
  //      // Handle data
  //    });
  //  this.subscriptions.push(subscription);



  //}


  //onFilterApplications() {


  //  if (this.select == "option1") {
  //    this.cardFilters = false;
  //    this.applicationDataForView = [];
  //    this.Applications = [];
  //    this.getAllApplicationsByUserID();

  //    this.applicationService.getApplicationsList(this.CurrentUser.appUserId, true).subscribe((data: any) => {


  //      if (data.responseCode == 1) {


  //        for (let i = 0; i < data.dateSet.length; i++) {
  //          const tempApplicationList = {} as ApplicationsList;
  //          const tempApplicationListShared = {} as ApplicationList;
  //          const current = data.dateSet[i];





  //          console.log("current", current)
  //          tempApplicationList.ApplicationID = current.applicationID;
  //          tempApplicationList.FullName = current.fullName;
  //          tempApplicationList.TypeOfApplication = current.typeOfApplication;
  //          tempApplicationList.CurrentStage = current.currentStageName;
  //          tempApplicationList.ApplicationStatus = current.applicationStatus;
  //          tempApplicationList.isEscalated = current.isEscalated; //escalation Sindiswa 29 January 2024

  //          tempApplicationList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
  //          tempApplicationListShared.CurrentStageStartDate = current.currentStageStartDate.substring(0, current.dateCreated.indexOf('T'));

  //          /*cal application age*/

  //          const currentDate = new Date();
  //          const dateCreated = new Date(tempApplicationList.DateCreated);
  //          const timeDiff = currentDate.getTime() - dateCreated.getTime();
  //          const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  //          tempApplicationList.TestApplicationAge = daysDiff;

  //          /*cal stage age*/
  //          const stageDateCreated = new Date(tempApplicationListShared.CurrentStageStartDate);
  //          const stageDate = currentDate.getTime() - stageDateCreated.getTime();
  //          const stageDateDiff = Math.floor(stageDate / (1000 * 3600 * 24));
  //          tempApplicationList.TestApplicationStageAge = stageDateDiff;
  //          console.log("WheknfnfetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAge", tempApplicationList.TestApplicationStageAge);



  //          if (current.projectNumber != null) {
  //            tempApplicationList.ProjectNumber = current.projectNumber;
  //          } else {
  //            tempApplicationList.ProjectNumber = (current.applicationID).toString();
  //          }


  //          /*            do {
  //                        tempApplicationList.TestApplicationStageAge = Math.floor(Math.random() * 30) + 1;
  //                      } while (tempApplicationList.TestApplicationStageAge > tempApplicationList.TestApplicationAge);*/
  //          //save here to send to the shared

  //          //tempApplicationListShared.applicationID = current. ;
  //          tempApplicationListShared.applicationID = current.applicationID;
  //          tempApplicationListShared.clientName = current.fullName;
  //          tempApplicationListShared.clientEmail = current.email;
  //          tempApplicationListShared.clientAlternativeEmail = current.alternativeEmail; //checkingNotifications Sindiswa 15 February 2024
  //          tempApplicationListShared.clientAddress = current.physicalAddress;
  //          tempApplicationListShared.clientRefNo = current.referenceNumber;
  //          tempApplicationListShared.CompanyRegNo = current.companyRegNo;
  //          tempApplicationListShared.TypeOfApplication = current.typeOfApplication;
  //          tempApplicationListShared.NotificationNumber = current.notificationNumber;
  //          tempApplicationListShared.WBSNumber = current.wbsNumber;
  //          tempApplicationListShared.PhysicalAddressOfProject = current.physicalAddressOfProject;
  //          tempApplicationListShared.DescriptionOfProject = current.descriptionOfProject;
  //          tempApplicationListShared.NatureOfWork = current.natureOfWork;
  //          tempApplicationListShared.ExcavationType = current.excavationType;
  //          tempApplicationListShared.ExpectedStartDate = current.expectedStartDate;
  //          tempApplicationListShared.ExpectedEndDate = current.expectedEndDate;
  //          tempApplicationListShared.Location = current.location;
  //          tempApplicationListShared.clientCellNo = current.phoneNumber;
  //          tempApplicationListShared.CreatedById = current.createdById;
  //          tempApplicationListShared.UserID = current.userID;//
  //          tempApplicationListShared.ApplicationStatus = current.applicationStatus;
  //          tempApplicationListShared.CurrentStageName = current.currentStageName;
  //          tempApplicationListShared.CurrentStageNumber = current.currentStageNumber;

  //          tempApplicationListShared.NextStageName = current.nextStageName;
  //          tempApplicationListShared.NextStageNumber = current.nextStageNumber;
  //          tempApplicationListShared.PreviousStageName = current.previousStageName;
  //          tempApplicationListShared.PreviousStageNumber = current.previousStageNumber;
  //          tempApplicationListShared.DatePaid = current.datePaid;
  //          tempApplicationListShared.wbsrequired = current.wbsRequired;
  //          tempApplicationListShared.Coordinates = current.coordinates;
  //          if (current.projectNumber != null) {
  //            tempApplicationListShared.ProjectNumber = current.projectNumber;
  //          } else {
  //            tempApplicationListShared.ProjectNumber = (current.applicationID).toString();
  //          }

  //          tempApplicationListShared.isPlanning = current.isPlanning;
  //          tempApplicationListShared.permitStartDate = current.permitStartDate;

  //          tempApplicationListShared.ContractorAccountDetails = current.contractorAccountDetails; //zxNumberUpdate Sindiswa 01 March 2024

  //          //#region escalation Sindiswa 31 January 2024
  //          tempApplicationList.isEscalated = current.isEscalated;
  //          tempApplicationList.EscalationDate = current.escalationDate;
  //          tempApplicationList.EMBActionDate = current.embActionDate;
  //          //#endregion
  //          if (current.networkLicenses == true) {
  //            tempApplicationListShared.NetworkLicensees = "Fibre Network Licensees have been contacted regarding trench sharing and existing services";
  //          }
  //          else {
  //            tempApplicationListShared.NetworkLicensees = " ";
  //          }

  //          this.applicationDataForView.push(tempApplicationListShared);
  //          console.log("this.applicationDataForViewthis.applicationDataForViewthis.applicationDataForView", this.applicationDataForView);
  //          this.Applications.push(tempApplicationList);
  //          /*Cehcing the escaltion date*/
  //          this.configService.getConfigsByConfigName("EscalationDate").subscribe((data: any) => {

  //            if (data.responseCode == 1) {

  //              const current = data.dateSet[0];
  //              console.log("currentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrent", current);
  //              this.viewEscalateDate = current.configDescription;
  //              if (this.Applications[i].TestApplicationAge >= Number(this.viewEscalateDate)) {
  //                this.escalateBtn = true;
  //              }

  //            }
  //            else {
  //              alert("Error");
  //            }

  //            console.log("response", data);
  //          }, error => {
  //            console.log("Error", error);
  //          })
  //        }
  //        this.dataSource = this.Applications.filter(df => df.FullName == this.CurrentUser.fullName);
  //        this.applicationsTable?.renderRows();
  //        //for card filters
  //        /* this.select = "option3";*/
  //        this.recentUnpaidCount();
  //        this.recentDistributedCount();
  //        this.recentApprovedCount();
  //        this.recentejectedCount();
  //        this.recentWIPCount();

  //        console.log("Got all applications", data.dateSet);
  //      }
  //      else {
  //        alert(data.responseMessage);
  //      }

  //    })

  //  }
  //  else if (this.select == "option2") {
  //    this.cardFilters = false;
  //    this.applicationDataForView = [];
  //    this.Applications = [];
  //    let number = 21;

  //    this.applicationService.getApplicationsForReviewer(21, this.CurrentUser.appUserId).subscribe((data: any) => {


  //      if (data.responseCode == 1) {


  //        for (let i = 0; i < data.dateSet.length; i++) {
  //          const tempApplicationList = {} as ApplicationsList;
  //          const tempApplicationListShared = {} as ApplicationList;
  //          const current = data.dateSet[i];





  //          console.log("current", current)
  //          tempApplicationList.ApplicationID = current.applicationID;
  //          tempApplicationList.FullName = current.fullName;
  //          tempApplicationList.TypeOfApplication = current.typeOfApplication;
  //          tempApplicationList.CurrentStage = current.currentStageName;
  //          tempApplicationList.ApplicationStatus = current.applicationStatus;
  //          tempApplicationList.isEscalated = current.isEscalated; //escalation Sindiswa 29 January 2024

  //          tempApplicationList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
  //          tempApplicationListShared.CurrentStageStartDate = current.currentStageStartDate.substring(0, current.dateCreated.indexOf('T'));

  //          /*cal application age*/

  //          const currentDate = new Date();
  //          const dateCreated = new Date(tempApplicationList.DateCreated);
  //          const timeDiff = currentDate.getTime() - dateCreated.getTime();
  //          const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  //          tempApplicationList.TestApplicationAge = daysDiff;

  //          /*cal stage age*/
  //          const stageDateCreated = new Date(tempApplicationListShared.CurrentStageStartDate);
  //          const stageDate = currentDate.getTime() - stageDateCreated.getTime();
  //          const stageDateDiff = Math.floor(stageDate / (1000 * 3600 * 24));
  //          tempApplicationList.TestApplicationStageAge = stageDateDiff;
  //          console.log("WheknfnfetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAge", tempApplicationList.TestApplicationStageAge);



  //          if (current.projectNumber != null) {
  //            tempApplicationList.ProjectNumber = current.projectNumber;
  //          } else {
  //            tempApplicationList.ProjectNumber = (current.applicationID).toString();
  //          }


  //          /*            do {
  //                        tempApplicationList.TestApplicationStageAge = Math.floor(Math.random() * 30) + 1;
  //                      } while (tempApplicationList.TestApplicationStageAge > tempApplicationList.TestApplicationAge);*/
  //          //save here to send to the shared

  //          //tempApplicationListShared.applicationID = current. ;
  //          tempApplicationListShared.applicationID = current.applicationID;
  //          tempApplicationListShared.clientName = current.fullName;
  //          tempApplicationListShared.clientEmail = current.email;
  //          tempApplicationListShared.clientAlternativeEmail = current.alternativeEmail; //checkingNotifications Sindiswa 15 February 2024
  //          tempApplicationListShared.clientAddress = current.physicalAddress;
  //          tempApplicationListShared.clientRefNo = current.referenceNumber;
  //          tempApplicationListShared.CompanyRegNo = current.companyRegNo;
  //          tempApplicationListShared.TypeOfApplication = current.typeOfApplication;
  //          tempApplicationListShared.NotificationNumber = current.notificationNumber;
  //          tempApplicationListShared.WBSNumber = current.wbsNumber;
  //          tempApplicationListShared.PhysicalAddressOfProject = current.physicalAddressOfProject;
  //          tempApplicationListShared.DescriptionOfProject = current.descriptionOfProject;
  //          tempApplicationListShared.NatureOfWork = current.natureOfWork;
  //          tempApplicationListShared.ExcavationType = current.excavationType;
  //          tempApplicationListShared.ExpectedStartDate = current.expectedStartDate;
  //          tempApplicationListShared.ExpectedEndDate = current.expectedEndDate;
  //          tempApplicationListShared.Location = current.location;
  //          tempApplicationListShared.clientCellNo = current.phoneNumber;
  //          tempApplicationListShared.CreatedById = current.createdById;
  //          tempApplicationListShared.UserID = current.userID;//
  //          tempApplicationListShared.ApplicationStatus = current.applicationStatus;
  //          tempApplicationListShared.CurrentStageName = current.currentStageName;
  //          tempApplicationListShared.CurrentStageNumber = current.currentStageNumber;

  //          tempApplicationListShared.ContractorAccountDetails = current.contractorAccountDetails; //zxNumberUpdate Sindiswa 01 March 2024
  //          tempApplicationListShared.NextStageName = current.nextStageName;
  //          tempApplicationListShared.NextStageNumber = current.nextStageNumber;
  //          tempApplicationListShared.PreviousStageName = current.previousStageName;
  //          tempApplicationListShared.PreviousStageNumber = current.previousStageNumber;
  //          tempApplicationListShared.DatePaid = current.datePaid;
  //          tempApplicationListShared.wbsrequired = current.wbsRequired;
  //          tempApplicationListShared.Coordinates = current.coordinates;
  //          if (current.projectNumber != null) {
  //            tempApplicationListShared.ProjectNumber = current.projectNumber;
  //          } else {
  //            tempApplicationListShared.ProjectNumber = (current.applicationID).toString();
  //          }

  //          tempApplicationListShared.isPlanning = current.isPlanning;
  //          tempApplicationListShared.permitStartDate = current.permitStartDate;


  //          //#region escalation Sindiswa 31 January 2024
  //          tempApplicationList.isEscalated = current.isEscalated;
  //          tempApplicationList.EscalationDate = current.escalationDate;
  //          tempApplicationList.EMBActionDate = current.embActionDate;
  //          //#endregion

  //          if (current.networkLicenses == true) {
  //            tempApplicationListShared.NetworkLicensees = "Fibre Network Licensees have been contacted regarding trench sharing and existing services";
  //          }
  //          else {
  //            tempApplicationListShared.NetworkLicensees = " ";
  //          }
  //          this.applicationDataForView.push(tempApplicationListShared);
  //          console.log("this.applicationDataForViewthis.applicationDataForViewthis.applicationDataForView", this.applicationDataForView);
  //          this.Applications.push(tempApplicationList);
  //          /*Cehcing the escaltion date*/
  //          this.configService.getConfigsByConfigName("EscalationDate").subscribe((data: any) => {

  //            if (data.responseCode == 1) {

  //              const current = data.dateSet[0];
  //              console.log("currentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrent", current);
  //              this.viewEscalateDate = current.configDescription;
  //              if (this.Applications[i].TestApplicationAge >= Number(this.viewEscalateDate)) {
  //                this.escalateBtn = true;
  //              }

  //            }
  //            else {
  //              alert("Error");
  //            }

  //            console.log("response", data);
  //          }, error => {
  //            console.log("Error", error);
  //          })
  //        }
  //        this.changeDetectorRef.detectChanges();
  //        this.dataSource = this.Applications.filter(df => df.DateCreated);
  //        this.applicationsTable?.renderRows();
  //        //for card filters

  //        this.recentUnpaidCount();
  //        this.recentDistributedCount();
  //        this.recentApprovedCount();
  //        this.recentejectedCount();
  //        this.recentWIPCount();

  //        console.log("Got all applications", data.dateSet);
  //      }
  //      else {
  //        alert(data.responseMessage);
  //      }

  //    })
  //  }
  //  else if (this.select == "option3") {

  //    this.cardFilters = true;

  //    this.applicationDataForView = [];
  //    this.Applications = [];


  //    this.Applications.splice(0, this.Applications.length);

  //    if (this.CurrentUserProfile[0].isInternal) {
  //      this.applicationService.getApplicationsList(this.CurrentUser.appUserId, true).subscribe((data: any) => {


  //        if (data.responseCode == 1) {


  //          for (let i = 0; i < data.dateSet.length; i++) {
  //            const tempApplicationList = {} as ApplicationsList;
  //            const tempApplicationListShared = {} as ApplicationList;
  //            const current = data.dateSet[i];





  //            console.log("current", current)
  //            tempApplicationList.ApplicationID = current.applicationID;
  //            tempApplicationList.FullName = current.fullName;
  //            tempApplicationList.TypeOfApplication = current.typeOfApplication;
  //            tempApplicationList.CurrentStage = current.currentStageName;
  //            tempApplicationList.ApplicationStatus = current.applicationStatus;
  //            tempApplicationList.isEscalated = current.isEscalated; //escalation Sindiswa 29 January 2024

  //            tempApplicationList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
  //            tempApplicationListShared.CurrentStageStartDate = current.currentStageStartDate.substring(0, current.dateCreated.indexOf('T'));

  //            /*cal application age*/

  //            const currentDate = new Date();
  //            const dateCreated = new Date(tempApplicationList.DateCreated);
  //            const timeDiff = currentDate.getTime() - dateCreated.getTime();
  //            const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  //            tempApplicationList.TestApplicationAge = daysDiff;

  //            /*cal stage age*/
  //            const stageDateCreated = new Date(tempApplicationListShared.CurrentStageStartDate);
  //            const stageDate = currentDate.getTime() - stageDateCreated.getTime();
  //            const stageDateDiff = Math.floor(stageDate / (1000 * 3600 * 24));
  //            tempApplicationList.TestApplicationStageAge = stageDateDiff;
  //            console.log("WheknfnfetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAge", tempApplicationList.TestApplicationStageAge);



  //            if (current.projectNumber != null) {
  //              tempApplicationList.ProjectNumber = current.projectNumber;
  //            } else {
  //              tempApplicationList.ProjectNumber = (current.applicationID).toString();
  //            }


  //            /*            do {
  //                          tempApplicationList.TestApplicationStageAge = Math.floor(Math.random() * 30) + 1;
  //                        } while (tempApplicationList.TestApplicationStageAge > tempApplicationList.TestApplicationAge);*/
  //            //save here to send to the shared

  //            //tempApplicationListShared.applicationID = current. ;
  //            tempApplicationListShared.applicationID = current.applicationID;
  //            tempApplicationListShared.clientName = current.fullName;
  //            tempApplicationListShared.clientEmail = current.email;
  //            tempApplicationListShared.clientAlternativeEmail = current.alternativeEmail; //checkingNotifications Sindiswa 15 February 2024
  //            tempApplicationListShared.clientAddress = current.physicalAddress;
  //            tempApplicationListShared.clientRefNo = current.referenceNumber;
  //            tempApplicationListShared.CompanyRegNo = current.companyRegNo;
  //            tempApplicationListShared.TypeOfApplication = current.typeOfApplication;
  //            tempApplicationListShared.NotificationNumber = current.notificationNumber;
  //            tempApplicationListShared.WBSNumber = current.wbsNumber;
  //            tempApplicationListShared.PhysicalAddressOfProject = current.physicalAddressOfProject;
  //            tempApplicationListShared.DescriptionOfProject = current.descriptionOfProject;
  //            tempApplicationListShared.NatureOfWork = current.natureOfWork;
  //            tempApplicationListShared.ExcavationType = current.excavationType;
  //            tempApplicationListShared.ExpectedStartDate = current.expectedStartDate;
  //            tempApplicationListShared.ExpectedEndDate = current.expectedEndDate;
  //            tempApplicationListShared.Location = current.location;
  //            tempApplicationListShared.clientCellNo = current.phoneNumber;
  //            tempApplicationListShared.CreatedById = current.createdById;
  //            tempApplicationListShared.UserID = current.userID;//
  //            tempApplicationListShared.ApplicationStatus = current.applicationStatus;
  //            tempApplicationListShared.CurrentStageName = current.currentStageName;
  //            tempApplicationListShared.CurrentStageNumber = current.currentStageNumber;

  //            tempApplicationListShared.ContractorAccountDetails = current.contractorAccountDetails; //zxNumberUpdate Sindiswa 01 March 2024
  //            tempApplicationListShared.NextStageName = current.nextStageName;
  //            tempApplicationListShared.NextStageNumber = current.nextStageNumber;
  //            tempApplicationListShared.PreviousStageName = current.previousStageName;
  //            tempApplicationListShared.PreviousStageNumber = current.previousStageNumber;
  //            tempApplicationListShared.DatePaid = current.datePaid;
  //            tempApplicationListShared.wbsrequired = current.wbsRequired;
  //            tempApplicationListShared.Coordinates = current.coordinates;
  //            if (current.projectNumber != null) {
  //              tempApplicationListShared.ProjectNumber = current.projectNumber;
  //            } else {
  //              tempApplicationListShared.ProjectNumber = (current.applicationID).toString();
  //            }

  //            tempApplicationListShared.isPlanning = current.isPlanning;
  //            tempApplicationListShared.permitStartDate = current.permitStartDate;


  //            //#region escalation Sindiswa 31 January 2024
  //            tempApplicationList.isEscalated = current.isEscalated;
  //            tempApplicationList.EscalationDate = current.escalationDate;
  //            tempApplicationList.EMBActionDate = current.embActionDate;
  //            //#endregion
  //            if (current.networkLicenses == true) {
  //              tempApplicationListShared.NetworkLicensees = "Fibre Network Licensees have been contacted regarding trench sharing and existing services";
  //            }
  //            else {
  //              tempApplicationListShared.NetworkLicensees = " ";
  //            }

  //            this.applicationDataForView.push(tempApplicationListShared);
  //            console.log("this.applicationDataForViewthis.applicationDataForViewthis.applicationDataForView", this.applicationDataForView);
  //            this.Applications.push(tempApplicationList);
  //            /*Cehcing the escaltion date*/
  //            this.configService.getConfigsByConfigName("EscalationDate").subscribe((data: any) => {

  //              if (data.responseCode == 1) {

  //                const current = data.dateSet[0];
  //                console.log("currentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrent", current);
  //                this.viewEscalateDate = current.configDescription;
  //                if (this.Applications[i].TestApplicationAge >= Number(this.viewEscalateDate)) {
  //                  this.escalateBtn = true;
  //                }

  //              }
  //              else {
  //                alert("Error");
  //              }

  //              console.log("response", data);
  //            }, error => {
  //              console.log("Error", error);
  //            })
  //          }
  //          this.dataSource = this.Applications.filter(df => df.DateCreated);
  //          this.applicationsTable?.renderRows();
  //          //for card filters
  //          /* this.select = "option3";*/
  //          this.recentUnpaidCount();
  //          this.recentDistributedCount();
  //          this.recentApprovedCount();
  //          this.recentejectedCount();
  //          this.recentWIPCount();

  //          console.log("Got all applications", data.dateSet);
  //        }
  //        else {
  //          alert(data.responseMessage);
  //        }

  //      })
  //    }
  //    else {
  //      this.applicationService.getApplicationsList(this.CurrentUser.appUserId, false).subscribe((data: any) => {


  //        if (data.responseCode == 1) {


  //          for (let i = 0; i < data.dateSet.length; i++) {
  //            const tempApplicationList = {} as ApplicationsList;
  //            const tempApplicationListShared = {} as ApplicationList;
  //            const current = data.dateSet[i];
  //            console.log("current", current)
  //            tempApplicationList.ApplicationID = current.applicationID;
  //            tempApplicationList.FullName = current.fullName;
  //            tempApplicationList.TypeOfApplication = current.typeOfApplication;
  //            tempApplicationList.CurrentStage = current.currentStageName;
  //            tempApplicationList.ApplicationStatus = current.applicationStatus;
  //            tempApplicationList.isEscalated = current.isEscalated; //escalation Sindiswa 29 January 2024
  //            this.date = current.dateCreated;
  //            tempApplicationList.DateCreated = this.date.substring(0, current.dateCreated.indexOf('T'));;;

  //            if (current.projectNumber != null) {
  //              tempApplicationList.ProjectNumber = current.projectNumber;
  //            } else {
  //              tempApplicationList.ProjectNumber = (current.applicationID).toString();
  //            }

  //            tempApplicationListShared.CurrentStageStartDate = current.currentStageStartDate.substring(0, current.dateCreated.indexOf('T'));
  //            /*cal application age*/

  //            const currentDate = new Date();
  //            const dateCreated = new Date(tempApplicationList.DateCreated);
  //            const timeDiff = currentDate.getTime() - dateCreated.getTime();
  //            const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  //            tempApplicationList.TestApplicationAge = daysDiff;

  //            /*cal stage age*/
  //            const stageDateCreated = new Date(tempApplicationListShared.CurrentStageStartDate);
  //            const stageDate = currentDate.getTime() - stageDateCreated.getTime();
  //            const stageDateDiff = Math.floor(stageDate / (1000 * 3600 * 24));
  //            tempApplicationList.TestApplicationStageAge = stageDateDiff;
  //            //save here to send to the shared

  //            //tempApplicationListShared.applicationID = current. ;
  //            tempApplicationListShared.applicationID = current.applicationID;
  //            tempApplicationListShared.clientName = current.fullName;
  //            tempApplicationListShared.clientEmail = current.email;
  //            tempApplicationListShared.clientAlternativeEmail = current.alternativeEmail; //checkingNotifications Sindiswa 15 February 2024
  //            tempApplicationListShared.clientAddress = current.physicalAddress;
  //            tempApplicationListShared.clientRefNo = current.referenceNumber;
  //            tempApplicationListShared.CompanyRegNo = current.companyRegNo;
  //            tempApplicationListShared.TypeOfApplication = current.typeOfApplication;
  //            tempApplicationListShared.NotificationNumber = current.notificationNumber;
  //            tempApplicationListShared.WBSNumber = current.wbsNumber;
  //            tempApplicationListShared.PhysicalAddressOfProject = current.physicalAddressOfProject;
  //            tempApplicationListShared.DescriptionOfProject = current.descriptionOfProject;
  //            tempApplicationListShared.NatureOfWork = current.natureOfWork;
  //            tempApplicationListShared.ExcavationType = current.excavationType;
  //            tempApplicationListShared.ExpectedStartDate = current.expectedStartDate;
  //            tempApplicationListShared.ExpectedEndDate = current.expectedEndDate;
  //            tempApplicationListShared.Location = current.location;
  //            tempApplicationListShared.clientCellNo = current.phoneNumber;
  //            tempApplicationListShared.CreatedById = current.createdById;
  //            tempApplicationListShared.UserID = current.userID;//
  //            tempApplicationListShared.ApplicationStatus = current.applicationStatus;
  //            tempApplicationListShared.CurrentStageName = current.currentStageName;
  //            tempApplicationListShared.CurrentStageNumber = current.currentStageNumber;
  //            tempApplicationListShared.CurrentStageStartDate = current.currentStageStartDate;
  //            tempApplicationListShared.NextStageName = current.nextStageName;
  //            tempApplicationListShared.NextStageNumber = current.nextStageNumber;
  //            tempApplicationListShared.PreviousStageName = current.previousStageName;
  //            tempApplicationListShared.PreviousStageNumber = current.previousStageNumber;
  //            tempApplicationListShared.DatePaid = current.datePaid;
  //            tempApplicationListShared.wbsrequired = current.wbsRequired;
  //            tempApplicationListShared.Coordinates = current.coordinates;
  //            if (current.projectNumber != null) {
  //              tempApplicationListShared.ProjectNumber = current.projectNumber;
  //            } else {
  //              tempApplicationListShared.ProjectNumber = (current.applicationID).toString();
  //            }

  //            tempApplicationListShared.isPlanning = current.isPlanning;

  //            tempApplicationListShared.ContractorAccountDetails = current.contractorAccountDetails; //zxNumberUpdate Sindiswa 01 March 2024

  //            //#region escalation Sindiswa 31 January 2024
  //            tempApplicationList.isEscalated = current.isEscalated;
  //            tempApplicationList.EscalationDate = current.escalationDate;
  //            tempApplicationList.EMBActionDate = current.embActionDate;
  //            //#endregion
  //            if (current.networkLicenses == true) {
  //              tempApplicationListShared.NetworkLicensees = "Fibre Network Licensees have been contacted regarding trench sharing and existing services";
  //            }
  //            else {
  //              tempApplicationListShared.NetworkLicensees = " ";
  //            }
  //            this.applicationDataForView.push(tempApplicationListShared);
  //            console.log("this.applicationDataForViewthis.applicationDataForViewthis.applicationDataForView", this.applicationDataForView);

  //            this.Applications.push(tempApplicationList);

  //          }
  //          this.dataSource = this.Applications.filter(df => df.DateCreated);
  //          this.applicationsTable?.renderRows();


  //          console.log("Got all applications", data.dateSet);

  //        }
  //        else {
  //          alert(data.responseMessage);
  //        }

  //        //for card filters
  //        this.select = "option3";
  //        this.recentUnpaidCount();
  //        this.recentDistributedCount();
  //        this.recentApprovedCount();
  //        this.recentejectedCount();
  //        this.recentWIPCount();

  //      })
  //    }

  //    const userId = this.CurrentUser.appUserId;
  //    const isInternal = this.CurrentUserProfile[0].isInternal;


  //    // Store the subscription in the subscriptions array
  //    const subscription = this.applicationService.getApplicationsList(userId, isInternal)
  //      .subscribe((data: any) => {
  //        // Handle data
  //      });
  //    this.subscriptions.push(subscription);



  //  }
  //  else {

  //  }



  //}



  getAllSubDepartments() {
   /* this.subDepartmentService.getSubDepartmentsList().subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {

          const tempSubDepartmentLinkedList = {} as AllSubDepartmentList;
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


          this.AllSubDepartmentList.push(tempSubDepartmentLinkedList);

        }


      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);


      }
      console.log("reponseGetAllLinkedSubDepartmentsForComment", data);

    }, error => {
      console.log("Error: ", error);
    })*/
  }

  getConfig() {
    this.AllConfig.splice(0, this.AllConfig.length);

    this.configService.getAllConfigs().subscribe((data: any) => {

      if (data) {
        this.AllConfig = data.dateSet;

        this.sharedService.setAllConfig(this.AllConfig);
        this.ServerType = this.AllConfig.find((Config) => Config.configName === 'ServerType').utilitySlot1;
        //this.sharedService.setAPIURL(this.AllConfig.find((Config) => Config.configName === 'BaseUrl').utilitySlot2);
        this.BaseUrl = this.AllConfig.find((Config) => Config.configName === 'BaseUrl').utilitySlot1;
      }
      else {
        alert("Error");
      }

      console.log("response", data);
    }, error => {
      console.log("Error", error);
    })

  }


  isTransparent: boolean = true; // Initialize as true if you want the navbar to be transparent initially

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    // Calculate the scroll position
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    // You can adjust this threshold value as needed
    const threshold = 20;

    // Update the isTransparent property based on the scroll position
    this.isTransparent = scrollPosition < threshold;
  }

  onFilterButtonClick() {
    /*    
        const table = document.querySelector('.mat-elevation-z8');
    
        // Remove the fade-out class to trigger fade-in
        table.classList.remove('fade-out');
    
        // Add the fade-in class to start the fade-in animation
        table.classList.add('fade-in');
    
        // After the animation completes, remove the fade-in class
        setTimeout(() => {
          table.classList.remove('fade-in');
        }, 3000); */// Wait for 3 seconds (3000 milliseconds) for the fade-in animation to complete
  }
  //EXISTING USER THINGS=======================================================================================================================================================================
  /*18 September 2023
 -open a modal with the added professionals
 -let the user be able to view, delete and edit professionals before proceeding
 -these should go into a temporary list
 */
  selectedUserName: string = '';

  //The aim is to show the selected user's linked professionals
  @ViewChild(MatTable) contractorTable: MatTable<ProfListEU> | undefined;
  displayedColumnsOldContractors: string[] = ['fullName', 'email', 'idNumber', 'phoneNumber'];
  dataSourceContractors = this.ContractorsList;

  @ViewChild(MatTable) engineerTable: MatTable<ProfListEU> | undefined;
  displayedColumnsOldEngineers: string[] = ['fullName', 'email', 'idNumber', 'phoneNumber'];
  dataSourceEngineers = this.EngineersList;


  @ViewChild(MatTable) TempContractorTable: MatTable<TempContractorList> | undefined;
  displayedColumnsTempContractors: string[] = ['companyName', 'cidbNum', 'cidbGrade', 'name', 'surname', 'cellular', 'email', 'actions'];
  dataSourceTempContractors = this.TempConList;

  @ViewChild(MatTable) TempEngineersTable: MatTable<TempEngineerList> | undefined;
  //displayedColumnsTempEngineers: string[] = ['bpNumber', 'profRegNum', 'idNum', 'name', 'surname', 'cellular', 'email', 'actions'];
  displayedColumnsTempEngineers: string[] = ['profRegNum', 'idNum', 'name', 'surname', 'cellular', 'email', 'actions'];
  dataSourceTempEngineers = this.TempEngList;

  openViewTheirProf(showAddedProf: any) {
    this.modalService.open(showAddedProf, { backdrop: 'static', centered: true, size: 'xl' });
  }
  openOlderProf(oldProf: any) {
    this.modalService.open(oldProf, { centered: true, size: 'xl' });
  }

  getAllProfessionalsListByProfessionalType(professionalType: string) {
    this.EngineersList.splice(0, this.EngineersList.length);
    this.ContractorsList.splice(0, this.ContractorsList.length);

    this.professionalService.getProfessionalsListByProfessionalType(this.userID, professionalType).subscribe((data: any) => {
      if (data.responseCode == 1) {
        console.log("data.dateSet get", data.dateSet);

        for (let i = 0; i < data.dateSet.length; i++) {
          //Check if Engineer or Contractor
          if (professionalType == "Engineer") {
            const tempProfessionalList = {} as ProfListEU;
            const current = data.dateSet[i];

            tempProfessionalList.name = current.fullName.split(' ')[0], // Split full name into first name and last name
              tempProfessionalList.surname = current.fullName.split(' ')[1], // Assuming space separates first and last names
              //tempProfessionalList.fullName = current.fullName;
              tempProfessionalList.email = current.email;
            tempProfessionalList.idNumber = current.idNumber;
            tempProfessionalList.phoneNumber = current.phoneNumber;

            this.EngineersList.push(tempProfessionalList);
            //this.EngineerTable?.renderRows();


          } else {
            const tempProfessionalList = {} as ProfListEU;
            const current = data.dateSet[i];
            tempProfessionalList.name = current.fullName.split(' ')[0], // Split full name into first name and last name
              tempProfessionalList.surname = current.fullName.split(' ')[1], // Assuming space separates first and last names
              //tempProfessionalList.fullName = current.fullName;
              tempProfessionalList.email = current.email;
            tempProfessionalList.idNumber = current.idNumber;
            tempProfessionalList.phoneNumber = current.phoneNumber;

            this.ContractorsList.push(tempProfessionalList);
            //this.ContractorTable?.renderRows();

          }
          //this.EngineerTable?.renderRows();
          //this.ContractorTable?.renderRows();

        }
        //this.ContractorTable?.renderRows();

        console.log("this.EngineerList", this.EngineersList);
        console.log("this.ContractorList", this.ContractorsList);

        this.contractorTable?.renderRows();
        this.engineerTable?.renderRows();

      }

      else {
        alert(data.responseMessage);
      }

      console.log("reponse", data);
      this.contractorTable?.renderRows();
      this.engineerTable?.renderRows();

    }, error => {
      console.log("Error: ", error);
    })
  }
  //The [Save] button


  onAddTheirEngineer(showAddedProf: any) {
    //So if I am creating for an existing client kufanele kume kanjani?
    //createdById: string | this.CurrentUser.appUserId
    //appUserID: string | this.userID = this.ClientUserList[index].userId;
    // Check if any of the required fields is empty
    if (

      !this.professionalRegNo ||
      !this.engineerIDNo ||
      !this.name ||
      !this.surname ||
      !this.applicantTellNo ||
      !this.applicantEmail
    ) {
      //!this.bpNoApplicant  - no bp!
      alert('Please fill in all required fields.');
      return; // Exit the function if any required field is empty
    }
    const newEngineer: TempEngineerList = {

      //bpNumber: this.bpNoApplicant,
      profRegNum: this.professionalRegNo,
      idNum: this.engineerIDNo,
      name: this.name,
      surname: this.surname,
      cellular: this.applicantTellNo.toString(),
      email: this.applicantEmail,
      //professionalID: data.professionalID, // Store professionalID here

    };

    this.TempEngList.push(newEngineer);
    this.TempEngineersTable?.renderRows(); // Explicitly trigger rendering
    this.clearCreateEngComponent();
    this.openViewTheirProf(showAddedProf);

  }
  onAddTheirContractor2(showAddedProf: any) {


    if (
      !this.contractorIDNo ||
      !this.ProfessionalRegNo ||
      !this.CIBRating ||
      !this.Name ||
      !this.Surname ||
      !this.ContractorTell ||
      !this.ContractorEmail
    ) {
      console.log(this.contractorIDNo); ////
      console.log(this.ProfessionalRegNo);
      console.log(this.CIBRating);
      console.log(this.Name);//
      console.log(this.Surname);//
      console.log(this.ContractorTell);//
      console.log(this.ContractorEmail);//
      alert('Please fill in all required fields. Is this where you stop???');
      return; // Exit the function if any required field is empty
    }

    const newContractor: TempContractorList = {

      companyName: this.contractorIDNo,
      cidbNum: this.ProfessionalRegNo,
      cidbGrade: this.CIBRating,
      name: this.Name,
      surname: this.Surname,
      cellular: this.ContractorTell.toString(),
      email: this.ContractorEmail,
      //professionalID: any;
    };

    this.TempConList.push(newContractor);
    this.TempContractorTable?.renderRows();
    this.clearCreateComponent();
    this.openViewTheirProf(showAddedProf);
  }

  openEditingEng(editEngineer: any) {
    this.modalService.open(editEngineer, { backdrop: 'static', centered: true, size: 'xl' });
  }
  openEditingCon(editContractor: any) {
    this.modalService.open(editContractor, { backdrop: 'static', centered: true, size: 'xl' });
  }

  //editEngBPNum = '';
  editEngRegNum = '';
  editEngID = '';
  editEngName = '';
  editEngSurname = '';
  editEngPhone = '';
  editEngEmail = '';
  selectedEngineer: any = null;
  openEditTempEngineer(index: any, editEngineer: any) {


    if (index >= 0 && index < this.dataSourceTempEngineers.length) {
      // Check if the index is valid
      // Update the engineer's details in the data source
      this.selectedEngineer = this.dataSourceTempEngineers[index];

      //this.editEngBPNum = this.selectedEngineer.bpNumber;
      this.editEngRegNum = this.selectedEngineer.profRegNum;
      this.editEngID = this.selectedEngineer.idNum;
      this.editEngName = this.selectedEngineer.name;
      this.editEngSurname = this.selectedEngineer.surname;
      this.editEngPhone = this.selectedEngineer.cellular;
      this.editEngEmail = this.selectedEngineer.email;

      this.openEditingEng(editEngineer);

    } else {
      console.error('Invalid index for editing engineer.');
    }
  }

  editConCompany = '';
  editConCIDBNum = '';
  editConCIDBRating = '';
  editConName = '';
  editConSurname = '';
  editConPhone = '';
  editConEmail = '';
  selectedContractor: any = null;
  openEditTempContractor(index: any, editContractor: any) {

    if (index >= 0 && index < this.dataSourceTempContractors.length) {
      this.selectedContractor = this.dataSourceTempContractors[index];

      this.editConCompany = this.selectedContractor.companyName;
      this.editConCIDBNum = this.selectedContractor.cidbNum;
      this.editConCIDBRating = this.selectedContractor.cidbGrade;
      this.editConName = this.selectedContractor.name;
      this.editConSurname = this.selectedContractor.surname;
      this.editConPhone = this.selectedContractor.cellular;
      this.editConEmail = this.selectedContractor.email;
      this.openEditingCon(editContractor);
    }
    else {
      console.error('Invalid index for editing contractor.');
    }

  }
  /*
  saveEditedEngineerDetails(showAddedProf: any) {
    // Update the engineer's details in the data source
    this.selectedEngineer.bpNumber = this.editEngBPNum;
    this.selectedEngineer.profRegNum = this.editEngRegNum;
    this.selectedEngineer.idNum = this.editEngID;
    this.selectedEngineer.name = this.editEngName;
    this.selectedEngineer.surname = this.editEngSurname;
    this.selectedEngineer.cellular = this.editEngPhone;
    this.selectedEngineer.email = this.editEngEmail;

    this.selectedEngineer = null;
    this.openViewTheirProf(showAddedProf);


  }

  saveEditedContractorDetails(showAddedProf: any) {
    // Update the engineer's details in the data source
    this.selectedContractor.companyName = this.editConCompany;
    this.selectedContractor.cidbNum = this.editConCIDBNum;
    this.selectedContractor.cidbGrade = this.editConCIDBRating;
    this.selectedContractor.name = this.editConName;
    this.selectedContractor.surname = this.editConSurname;
    this.selectedContractor.cellular = this.editConPhone;
    this.selectedContractor.email = this.editConEmail;

    this.selectedContractor = null;
    this.openViewTheirProf(showAddedProf);


  }
  */
  saveEditedEngineerDetails(showAddedProf: any) {
    // Check if the textbox values are not empty before updating
    /*if (this.editEngBPNum.trim() !== '') {
      this.selectedEngineer.bpNumber = this.editEngBPNum;
    }*/
    if (this.editEngRegNum.trim() !== '') {
      this.selectedEngineer.profRegNum = this.editEngRegNum;
    }
    if (this.editEngID.trim() !== '') {
      this.selectedEngineer.idNum = this.editEngID;
    }
    if (this.editEngName.trim() !== '') {
      this.selectedEngineer.name = this.editEngName;
    }
    if (this.editEngSurname.trim() !== '') {
      this.selectedEngineer.surname = this.editEngSurname;
    }
    if (this.editEngPhone.trim() !== '') {
      this.selectedEngineer.cellular = this.editEngPhone;
    }
    if (this.editEngEmail.trim() !== '') {
      this.selectedEngineer.email = this.editEngEmail;
    }

    this.selectedEngineer = null;
    this.openViewTheirProf(showAddedProf);
  }

  saveEditedContractorDetails(showAddedProf: any) {
    // Check if the textbox values are not empty before updating
    if (this.editConCompany.trim() !== '') {
      this.selectedContractor.companyName = this.editConCompany;
    }
    if (this.editConCIDBNum.trim() !== '') {
      this.selectedContractor.cidbNum = this.editConCIDBNum;
    }
    if (this.editConCIDBRating.trim() !== '') {
      this.selectedContractor.cidbGrade = this.editConCIDBRating;
    }
    if (this.editConName.trim() !== '') {
      this.selectedContractor.name = this.editConName;
    }
    if (this.editConSurname.trim() !== '') {
      this.selectedContractor.surname = this.editConSurname;
    }
    if (this.editConPhone.trim() !== '') {
      this.selectedContractor.cellular = this.editConPhone;
    }
    if (this.editConEmail.trim() !== '') {
      this.selectedContractor.email = this.editConEmail;
    }

    this.selectedContractor = null;
    this.openViewTheirProf(showAddedProf);
  }

  // Delete a temporarily saved engineer by index with confirmation
  deleteTemporaryEngineerWithConfirmation(index: number) {
    if (index >= 0 && index < this.TempEngList.length) {
      // Check if the index is valid

      // Show a confirmation dialog to the user
      const confirmDelete = window.confirm('Are you sure you want to delete this engineer?');

      if (confirmDelete) {
        // If the user confirms, proceed with deletion
        this.TempEngList.splice(index, 1); // Remove the engineer at the specified index
        this.dataSourceTempEngineers = this.TempEngList;
        this.TempEngineersTable?.renderRows();
      } else {
        // If the user cancels, do nothing
        console.log('Deletion canceled by the user.');
      }
    } else {
      console.error('Invalid index for deleting engineer.');
    }
  }

  deleteTemporaryContractorWithConfirmation(index: number) {
    if (index >= 0 && index < this.TempConList.length) {
      // Check if the index is valid

      // Show a confirmation dialog to the user
      const confirmDelete = window.confirm('Are you sure you want to delete this contractor?');

      if (confirmDelete) {
        // If the user confirms, proceed with deletion
        this.TempConList.splice(index, 1); // Remove the contractor at the specified index
        this.dataSourceTempContractors = this.TempConList;
        this.TempContractorTable?.renderRows();
      } else {
        // If the user cancels, do nothing
        console.log('Deletion canceled by the user.');
      }
    } else {
      console.error('Invalid index for deleting contractor.');
    }
  }

  //[Next] button
  saveAllEngineers() {

    // Use forEach to loop through TempEngList and call onPermaSaveTheirEngineer for each engineer
    this.TempEngList.forEach(engineer => {
      this.onPermaSaveTheirEngineer(engineer);
    });
  }
  saveAllContractors() {

    this.TempConList.forEach(contractor => {
      this.onPermaSaveTheirContractor(contractor);
    });
  }
  onPermaSaveTheirContractor(contractor: TempContractorList) {
    if (
      !contractor.companyName ||
      !contractor.cidbNum ||
      !contractor.cidbGrade ||
      !contractor.name ||
      !contractor.surname ||
      !contractor.cellular ||
      !contractor.email
    ) {

      alert('Please fill in all required fields for the contractor.');
      return; // Exit the function if any required field is empty for the current engineer
    }

    // Use properties of the engineer parameter to populate the database request
    this.professionalService.addUpdateProfessional(
      0, // Action identifier (e.g., 0 for adding)
      "Contractor", // Professional type
      contractor.name + " " + contractor.surname, // Name
      null, //the form doesn't request a BP number moss
      false, // Active status
      contractor.email,
      contractor.cellular,
      contractor.cidbNum,
      this.clientUserID,
      contractor.companyName, //wait, is this supposed to be the company name or ID number?/
      this.CurrentUser.appUserId,
      contractor.cidbGrade
    ).subscribe((data: any) => {
      if (data.responseCode == 1) {
        //alert(data.responseMessage);
        //this.getExtUserEngineers();
        this.contractorTable?.renderRows();
      } else {
        alert(data.responseMessage);

      }
      console.log("response", data);

    }, error => {
      console.log("Error: ", error);

    });
  }

  onPermaSaveTheirEngineer(engineer: TempEngineerList) {
    //Okay, so this should only add after the user confirms... [Next] button

    // Check if any of the required fields is empty for the current engineer
    if (
      !engineer.profRegNum ||
      !engineer.idNum ||
      !engineer.name ||
      !engineer.surname ||
      !engineer.cellular ||
      !engineer.email
    ) {
      //!engineer.bpNumber ||
      alert('Please fill in all required fields for the engineer.');
      return; // Exit the function if any required field is empty for the current engineer
    }

    /*this.professionalService.addUpdateProfessional(0, "Engineer", this.name + " " + this.surname, this.bpNoApplicant, false,
      this.applicantEmail, this.applicantTellNo?.toString(), this.professionalRegNo, this.userID, this.engineerIDNo, this.CurrentUser.appUserId,
      null).subscribe((data: any) => {
        if (data.responseCode == 1) {


          alert(data.responseMessage);
          this.getExtUserEngineers();
          this.ContractorTable?.renderRows();

        }

        else {
          alert(data.responseMessage);
        }
        console.log("reponse", data);
      }, error => {
        console.log("Error: ", error);
     })*/
    // Use properties of the engineer parameter to populate the database request
    this.professionalService.addUpdateProfessional(
      0, // Action identifier (e.g., 0 for adding)
      "Engineer", // Professional type
      engineer.name + " " + engineer.surname, // Name
      //engineer.bpNumber,
      null,
      false, // Active status
      engineer.email,
      engineer.cellular,
      engineer.profRegNum,
      this.clientUserID, //linked client?
      engineer.idNum,
      this.CurrentUser.appUserId, //createdBy
      null // Additional data, if needed
    ).subscribe((data: any) => {
      if (data.responseCode == 1) {
        //alert(data.responseMessage);
        //this.getExtUserEngineers();
        this.engineerTable?.renderRows();
      } else {
        alert(data.responseMessage);
      }
      console.log("response", data);
    }, error => {
      console.log("Error: ", error);
    });
  }

  //CREATING NEW CLIENT WAYLEAVE AND LINKING THEIR PROFESSIONALS == CREATING NEW CLIENT WAYLEAVE AND LINKING THEIR PROFESSIONALS == CREATING NEW CLIENT WAYLEAVE AND LINKING THEIR PROFESSIONALS
  // Declare and initialize editedEngineer with empty values - HEY, here's another temporary list

  NewTempEngList: EngineerList[] = [];
  @ViewChild(MatTable) NewTempEngineersTable: MatTable<EngineerList> | undefined;
  displayedColumnsNewTempEngineers: string[] = ['bpNoApplicant', 'professionalRegNo', 'engineerIDNo', 'name', 'surname', 'applicantTellNo', 'applicantEmail', 'actions'];
  dataSourceNewTempEngineers = this.NewTempEngList;

  NewTempConList: ContractorList[] = [];
  @ViewChild(MatTable) NewTempContractorsTable: MatTable<ContractorList> | undefined;
  displayedColumnsNewTempContractors: string[] = ['contractorIDNo', 'ProfessionalRegNo', 'CIBRating', 'Name', 'Surname', 'ContractorTell', 'ContractorEmail', 'actions'];
  dataSourceNewTempContractors = this.NewTempConList;

  editedNewContractor: ContractorList = {
    idNumber: '',
    professionalRegNo: '',//this is commented out on the HTML?
    CIBRating: '',
    name: '',
    surname: '',
    phoneNumber: null,
    email: '',
    bpNumber: null, //this is commented out on the HTML?
    professinalID: 0,
    ProfessinalType: 'Contractor'
  };

  editedNewEngineer: EngineerList = {
    bpNumber: '',
    professionalRegNo: '',
    idNumber: '',
    name: '',
    surname: '',
    phoneNumber: '',
    email: '',
    professinalID: 0,
    ProfessinalType: 'Engineer'
  };

  editing: boolean = false;
  selectedNewEngineer: any = null;
  selectedNewContractor: any = null;
  selectedNewIndex: number = null;

  clearCreateComponent() {
    this.bpNoContractor = "";
    this.ProfessionalRegNo = ""; //AKA CIDB Number
    this.CIBRating = "";
    this.Name = "";
    this.Surname = '';
    this.ContractorTell = undefined;
    this.ContractorEmail = '';
    this.contractorIDNo = '';
  }
  clearCreateEngComponent() {
    this.name = "";
    this.surname = '';
    this.bpNoApplicant = '';
    this.applicantEmail = '';
    this.applicantTellNo = undefined;
    this.engineerIDNo = '';
    this.professionalRegNo = "";
  }
  undoEdit() {


    this.clearCreateEngComponent();
    this.clearCreateComponent();


    this.selectedNewEngineer = null;
    this.selectedNewContractor = null;

    this.editing = false;
    this.selectedNewIndex = null;

    this.editedNewEngineer = null;
    this.editedNewContractor = null;

    this.NewTempEngineersTable?.renderRows();
    this.NewTempContractorsTable?.renderRows();
  }

  onTempAddNewEngineer() {
    if (

      !this.bpNoApplicant ||
      !this.professionalRegNo ||
      !this.engineerIDNo ||
      !this.name ||
      !this.surname ||
      !this.applicantTellNo ||
      !this.applicantEmail
    ) {
      alert('Please fill in all required fields.');
      return; // Exit the function if any required field is empty
    }
    const newEngineer: EngineerList = {
      bpNumber: this.bpNoApplicant,
      professionalRegNo: this.professionalRegNo,
      idNumber: this.engineerIDNo,
      name: this.name,
      surname: this.surname,
      phoneNumber: this.applicantTellNo.toString(),
      email: this.applicantEmail,
      //the standard for all new temporary engineer entries
      professinalID: 0,
      ProfessinalType: 'Engineer'
    };

    this.NewTempEngList.push(newEngineer);
    this.cdr.detectChanges(); // Trigger change detection
    console.log("These are the engineers you have adeded: " + JSON.stringify(this.NewTempEngList, null, 2));

    this.NewTempEngineersTable?.renderRows(); // Explicitly trigger rendering
    this.clearCreateEngComponent();

  }
  onPermaSaveNewEngineer(engineer: EngineerList) {

    // Use properties of the engineer parameter to populate the database request
    this.professionalService.addUpdateProfessional(
      0, // Action identifier (e.g., 0 for adding)
      "Engineer", // Professional type
      engineer.name + " " + engineer.surname, // Name
      engineer.bpNumber,
      false, // Active status
      engineer.email,
      engineer.phoneNumber,
      engineer.professionalRegNo,
      //this.userID, //Need to confirm this with kyle || Get new client's ID njani?
      this.sharedService.clientUserID,
      engineer.idNumber,
      this.CurrentUser.appUserId,
      null // Additional data, if needed
    ).subscribe((data: any) => {
      if (data.responseCode == 1) {

        this.NewTempEngineersTable?.renderRows();
      } else {
        alert(data.responseMessage);
      }
      console.log("response", data);
    }, error => {
      console.log("Error: ", error);
    });
  }
  saveAllNewEngineers() {
    // Use forEach to loop through TempEngList and call onPermaSaveTheirEngineer for each engineer
    this.NewTempEngList.forEach(engineer => {
      this.onPermaSaveNewEngineer(engineer);
    });
  }

  onTempAddNewContractor() {
    if (

      !this.contractorIDNo ||
      !this.ProfessionalRegNo ||
      !this.CIBRating ||
      !this.Name ||
      !this.Surname ||
      !this.ContractorTell ||
      !this.ContractorEmail
    ) {
      alert('Please fill in all required fields.');
      return; // Exit the function if any required field is empty
    }
    const newContractor: ContractorList = {
      CIBRating: this.CIBRating,
      professionalRegNo: this.ProfessionalRegNo, //This is the CIDB Number
      idNumber: this.contractorIDNo,
      name: this.Name,
      surname: this.Surname,
      phoneNumber: this.ContractorTell,
      email: this.ContractorEmail,
      bpNumber: null,
      professinalID: 0,
      ProfessinalType: 'Contractor'
    };

    this.NewTempConList.push(newContractor);
    this.cdr.detectChanges(); // Trigger change detection
    console.log("These are the contractors you have added: " + JSON.stringify(this.NewTempConList, null, 2));

    this.NewTempContractorsTable?.renderRows(); // Explicitly trigger rendering
    this.clearCreateComponent();
  }
  onPermaSaveNewContractor(contractor: ContractorList) {
    this.professionalService.addUpdateProfessional(
      0, // Action identifier (e.g., 0 for adding)
      "Contractor", // Professional type
      contractor.name + " " + contractor.surname, // Name
      contractor.bpNumber,
      false, // Active status
      contractor.email,
      contractor.phoneNumber.toString(),
      contractor.professionalRegNo,
      //this.userID, //Need to confirm this with kyle || Get new client's ID njani?
      this.sharedService.clientUserID,
      contractor.idNumber,
      this.CurrentUser.appUserId,
      contractor.CIBRating
    ).subscribe((data: any) => {
      if (data.responseCode == 1) {

        this.NewTempContractorsTable?.renderRows();
      } else {
        alert(data.responseMessage);
      }
      console.log("response", data);
    }, error => {
      console.log("Error: ", error);
    });
  }
  saveAllNewContractors() {
    this.NewTempConList.forEach(contractor => {
      this.onPermaSaveNewContractor(contractor);
    });
  }
  //DELETEENGINEER-DELETEENGINEER-DELETEENGINEER-DELETEENGINEER-DELETEENGINEER-DELETEENGINEER-DELETEENGINEER-DELETEENGINEER-DELETEENGINEER
  deleteNewTemporaryEngineerWithConfirmation(index: number) {
    if (index >= 0 && index < this.NewTempEngList.length) {
      // Check if the index is valid

      // Show a confirmation dialog to the user
      const confirmDelete = window.confirm('Are you sure you want to delete this engineer?');

      if (confirmDelete) {
        // If the user confirms, proceed with deletion
        this.NewTempEngList.splice(index, 1); // Remove the engineer at the specified index
        this.dataSourceNewTempEngineers = this.NewTempEngList;
        this.NewTempEngineersTable?.renderRows();
      } else {
        // If the user cancels, do nothing
        console.log('Deletion canceled by the user.');
      }
    } else {
      console.error('Invalid index for deleting engineer.');
    }
  }
  //DELETECONTRACTOR-DELETECONTRACTOR-DELETECONTRACTOR-DELETECONTRACTOR-DELETECONTRACTOR-DELETECONTRACTOR-DELETECONTRACTOR-DELETECONTRACTOR
  deleteNewTemporaryContractorWithConfirmation(index: number) {
    if (index >= 0 && index < this.NewTempConList.length) {
      // Check if the index is valid

      // Show a confirmation dialog to the user
      const confirmDelete = window.confirm('Are you sure you want to delete this contractor?');

      if (confirmDelete) {
        // If the user confirms, proceed with deletion
        this.NewTempConList.splice(index, 1);
        this.dataSourceNewTempContractors = this.NewTempConList;
        this.NewTempContractorsTable?.renderRows();
      } else {
        // If the user cancels, do nothing
        console.log('Deletion canceled by the user.');
      }
    } else {
      console.error('Invalid index for deleting contractor.');
    }
  }
  //EDITENGINEER-EDITENGINEER-EDITENGINEER-EDITENGINEER-EDITENGINEER-EDITENGINEER-EDITENGINEER-EDITENGINEER-EDITENGINEER-EDITENGINEER
  editNewTemporaryEngineer(index: number) {
    if (index >= 0 && index < this.NewTempEngList.length) {
      // Check if the index is valid
      this.editing = true;
      this.selectedNewIndex = index;
      this.selectedNewEngineer = this.NewTempEngList[index];

      // Populate the input fields with the selectedEngineer data
      this.bpNoApplicant = this.selectedNewEngineer.bpNumber;
      this.professionalRegNo = this.selectedNewEngineer.professionalRegNo;
      this.engineerIDNo = this.selectedNewEngineer.idNumber;
      this.name = this.selectedNewEngineer.name;
      this.surname = this.selectedNewEngineer.surname;
      this.applicantTellNo = this.selectedNewEngineer.phoneNumber;
      this.applicantEmail = this.selectedNewEngineer.email;

    } else {
      console.error('Invalid index for editing engineer.');
    }
  }
  saveEditNewTempEngineer() {

    this.editedNewEngineer = {
      bpNumber: this.bpNoApplicant,
      professionalRegNo: this.professionalRegNo,
      idNumber: this.engineerIDNo,
      name: this.name,
      surname: this.surname,
      phoneNumber: this.applicantTellNo,
      email: this.applicantEmail,
      professinalID: 0,
      ProfessinalType: 'Engineer'
    };

    if (this.editedNewEngineer.bpNumber !== '') {
      this.selectedNewEngineer.bpNumber = this.editedNewEngineer.bpNumber;
    }
    if (this.editedNewEngineer.professionalRegNo !== '') {
      this.selectedNewEngineer.professionalRegNo = this.editedNewEngineer.professionalRegNo;
    }
    if (this.editedNewEngineer.idNumber !== '') {
      this.selectedNewEngineer.idNumber = this.editedNewEngineer.idNumber;
    }
    if (this.editedNewEngineer.name !== '') {
      this.selectedNewEngineer.name = this.editedNewEngineer.name;
    }
    if (this.editedNewEngineer.surname !== '') {
      this.selectedNewEngineer.surname = this.editedNewEngineer.surname;
    }
    if (this.editedNewEngineer.phoneNumber !== '') {
      this.selectedNewEngineer.phoneNumber = this.editedNewEngineer.phoneNumber;
    }
    if (this.editedNewEngineer.email !== '') {
      this.selectedNewEngineer.email = this.editedNewEngineer.email;
    }
    this.selectedNewEngineer = this.NewTempEngList[this.selectedNewIndex];
    this.undoEdit();

  }
  //EDITCONTRACTOR-EDITCONTRACTOR-EDITCONTRACTOR-EDITCONTRACTOR-EDITCONTRACTOR-EDITCONTRACTOR-EDITCONTRACTOR-EDITCONTRACTOR-EDITCONTRACTOR
  editNewTemporaryContractor(index: number) {
    if (index >= 0 && index < this.NewTempConList.length) {
      // Check if the index is valid
      this.editing = true;
      this.selectedNewIndex = index;

      this.selectedNewContractor = this.NewTempConList[index];

      // Populate the input fields with the selectedContractor data
      this.CIBRating = this.selectedNewContractor.CIBRating;
      this.ProfessionalRegNo = this.selectedNewContractor.professionalRegNo;
      this.contractorIDNo = this.selectedNewContractor.idNumber;
      this.Name = this.selectedNewContractor.name;
      this.Surname = this.selectedNewContractor.surname;
      this.ContractorTell = this.selectedNewContractor.phoneNumber;
      this.ContractorEmail = this.selectedNewContractor.email;

    } else {
      console.error('Invalid index for editing contractor.');
    }
  }
  saveEditNewTempContractor() {

    this.editedNewContractor = {
      bpNumber: null,
      CIBRating: this.CIBRating,
      professionalRegNo: this.ProfessionalRegNo,
      idNumber: this.contractorIDNo,
      name: this.Name,
      surname: this.Surname,
      phoneNumber: this.ContractorTell,
      email: this.ContractorEmail,
      professinalID: 0,
      ProfessinalType: 'Contractor'
    };

    if (this.editedNewContractor.professionalRegNo !== '') {
      this.selectedNewContractor.professionalRegNo = this.editedNewContractor.professionalRegNo;
    }
    if (this.editedNewContractor.CIBRating !== '') {
      this.selectedNewContractor.CIBRating = this.editedNewContractor.CIBRating;
    }
    if (this.editedNewContractor.idNumber !== '') {
      this.selectedNewContractor.idNumber = this.editedNewContractor.idNumber;
    }
    if (this.editedNewContractor.name !== '') {
      this.selectedNewContractor.name = this.editedNewContractor.name;
    }
    if (this.editedNewContractor.surname !== '') {
      this.selectedNewContractor.surname = this.editedNewContractor.surname;
    }
    if (this.editedNewContractor.phoneNumber !== null) {
      this.selectedNewContractor.phoneNumber = this.editedNewContractor.phoneNumber;
    }
    if (this.editedNewContractor.email !== '') {
      this.selectedNewContractor.email = this.editedNewContractor.email;
    }

    this.selectedNewContractor = this.NewTempConList[this.selectedNewIndex];
    this.undoEdit();

  }
  validEmail: boolean;
  validFullName: boolean;
  externalWValidBP: boolean;
  noEmptyFields: boolean;
  clientFullName: string = '';
  validID: boolean;
  //SAVING NEW PROFILE BE SHADY=======================================================================================================
  testBp2(BpNo: any): Promise<boolean> {
    return this.businessPartnerService.validateBP(Number(BpNo))
      .toPromise()
      .then((response: any) => {
        const apiResponse = response.Response;
        return apiResponse === "X";
      })
      .catch((error: any) => {
        // Handle API error
        console.error('API error:', error);
        return false; // Return false in case of an error
      });
  }
  //PROPERLY VALIDATING THE ID NUMBER!
  isValidSouthAfricanIDNumber(idNumber: string): boolean {
    if (idNumber.length !== 13) {
      //alert("The ID number must be 13 digits.");
      alert("Enter a valid ID number.");
      return false;
    }

    // Check if it's a valid date
    const birthDate = idNumber.substr(0, 6);
    const year = parseInt(birthDate.substr(0, 2), 10);
    const month = parseInt(birthDate.substr(2, 2), 10);
    const day = parseInt(birthDate.substr(4, 2), 10);

    const fullYear = year < 20 ? 2000 + year : 1900 + year;

    if (month < 1 || month > 12 || day < 1 || day > 31 || !this.isDateValid(fullYear, month, day)) {
      alert("Enter a valid ID number.");
      return false;
    }

    // Check if the 11th digit is 0 or 1
    const digit11 = parseInt(idNumber[10], 10);
    if (digit11 !== 0 && digit11 !== 1) {
      alert("Enter a valid ID number.");
      return false;
    }

    // Check the last digit (checksum)
    const checksum = parseInt(idNumber[12], 10);
    const checksumCalculated = this.calculateChecksum(idNumber);

    return checksum === checksumCalculated;
  }
  calculateChecksum(idNumber: string): number {
    const idArray = idNumber.split('').map((digit) => parseInt(digit, 10));
    const weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2];
    let sum = 0;

    for (let i = 0; i < 12; i++) {
      const product = idArray[i] * weights[i];
      sum += product >= 10 ? Math.floor(product / 10) + (product % 10) : product;
    }

    const checksumCalculated = (10 - (sum % 10)) % 10;
    return checksumCalculated;
  }

  isDateValid(year: number, month: number, day: number): boolean {
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() + 1 === month &&
      date.getDate() === day
    );
  }
  async validateClientInfo() {
    debugger;
    let clientEmail = this.clientEmail;
    let phoneNumber = this.clientCellNo;
    let clientRefNo = this.clientRefNo;
    let BpNo = this.clientBpNumber;
    let companyName = this.clientCompanyName;
    let companyRegNo = this.clientCompanyRegNo;
    let clientCompanyType = this.clientCompanyType;
    let physicalAddress = this.clientPhysicalAddress;
    
    

    let clientIDNumber = this.clientIDNumber; //hide

    const nameRegex = /^[a-zA-Z]+$/;

    // Check if clientName is valid
    if (nameRegex.test(this.clientName)) {
      // Check if clientSurname is valid
      if (nameRegex.test(this.clientSurname)) {
        // Both clientName and clientSurname are valid, so concatenate them
        this.validFullName = true;
        this.clientFullName = this.clientName + ' ' + this.clientSurname;
        console.log("Full Name: " + this.clientFullName);
      } else {

        alert("Invalid surname. Please enter a single name with letters only.");
        return;
      }
    } else {
      alert("Invalid name. Please enter a single name with letters only.");
      return;
    }

    /*if (clientIDNumber.length === 13) {
      this.validID = true;
    } else {
      alert("The ID number must be 13 digits.")
      this.validID = false;
    }*/
    //this.validID = this.isValidSouthAfricanIDNumber(clientIDNumber);

    const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (clientEmail === null || !emailRegex.test(clientEmail)) {
      alert("Please enter a valid email address");
      this.validEmail = false;
    } else {
      this.validEmail = true;

      // Check if the email already exists in the wayleave system
      try {
        const exists = await this.userService.emailExists(clientEmail).toPromise();
        if (exists) {
          alert("Email already exists in wayleave system.");
          this.validEmail = false;
        } else {
          console.log("Testing BP Number");
          // Ensure bpNumber is not empty before validating it
          //if (BpNo.trim() === '') {
          //  alert("Please enter a valid BP Number");
          //  this.externalWValidBP = false;
          //} else {
          //  console.log("Testing BP number now...");
          //  const isValidBP = await this.testBp2(BpNo);
          //  if (isValidBP) {
          //    this.externalWValidBP = true;
          //  } else {
          //    // Handle invalid BP Number
          //    alert("Please enter a valid BP Number");
          //    console.log("ngathi this BP is not valid.");
          //    this.externalWValidBP = false; // Set this to false in case of an invalid BP Number
          // }
          
        }
      } catch (error) {
        console.error("An error occurred: ", error);
        this.validEmail = false;
        this.externalWValidBP = false;
      }
    }

    console.log("Email is okay?" + this.validEmail);
    console.log("User has a valid BP Num " + this.externalWValidBP);
    
    //What other validation must be done here? | || clientIDNumber === undefined || clientIDNumber.trim() === ''
    if (
      phoneNumber === undefined || phoneNumber.trim() === '' ||
     /* clientRefNo === undefined || clientRefNo.trim() === '' ||*/
    /*  companyName === undefined || companyName.trim() === '' ||*/
      //companyRegNo === undefined || companyRegNo.trim() === '' ||
      //clientCompanyType === undefined || clientCompanyType.trim() === '' ||
      physicalAddress === undefined || physicalAddress.trim() === ''
    ) {
      this.noEmptyFields = false;
      alert("Please fill out all the required fields.");
    } else {
      this.noEmptyFields = true;
    }
    //&& this.validID == true
    if (this.noEmptyFields == true && this.validFullName == true && this.validEmail == true ) {
      //if (this.noEmptyFields == true && this.validFullName == true && this.validEmail == true && this.validID == true) {
      this.sharedService.errorForRegister = false;
      this.createNewClient();
    }
    else {
      alert("Some Information may be entered incorrectly. Double check entries and try again");
      return;
    }
  }

  createNewClient() {
    try {
      
      this.userService.register(this.clientFullName, this.clientEmail, "Password@" + this.clientFullName).subscribe((data: any) => {
        if (data.responseCode == 1) {
          
         this.newProfileComponent.onNewProfileCreate(
            data.dateSet.appUserId,
            this.clientFullName,
            this.clientEmail,
            this.clientCellNo,
            this.clientBpNumber,
            this.clientCompanyName,
            this.clientCompanyRegNo,
            this.clientPhysicalAddress,
            null,
            this.clientIDNumber ,
            this.clientRefNo,
            this.clientCompanyType,
          )

          console.log("Before assignment - this.sharedService.clientUserID: " + this.sharedService.clientUserID);
          this.sharedService.clientUserID = data.dateSet.appUserId; //This assignment is sus THIS IS THE NEW PERSON
          console.log("IS this " + this.clientName + "'s USERID: " + this.sharedService.clientUserID);
          //localStorage.setItem("LoggedInUserInfo", JSON.stringify(data.dateSet)); //THIS IS WHERE YOU LOG THEM IN -MXM
          this.sharedService.newUserProfileBp = this.clientBpNumber;
          alert(this.clientFullName + " has been added as an external client.\nYou can now link their professionals and create a wayleave on their behalf.");
          console.log("Who is logged in?" + JSON.stringify(this.CurrentUser));
         
          this.CheckUserID();
          //I NEED TO STAY INSIDE THIS MAT-STEPPER
          //this.router.navigate(["/new-profile"]);
        }
      });
    }
    catch (e) {
      console.log("There has been an issue with registering new client: " + e);
    }

    //the part that is relevant is the conditional statement that has a userID of null

  }


   CheckUserID() {
  if (this.isWayleave) {
      if (this.sharedService.clientUserID == null) {
        alert("An Error has Occured");
      }
      else {
        this.modalService.open(this.Prof, { centered: true, size: 'xl' });
      }
    }
    else {
      if (this.sharedService.clientUserID == null) {
        alert("An Error has Occured");
      }
      else {
        this.onCreateBuildingApplication();
      }
    }
   
  }
  getUserProfile() {
    let stringifiedData = JSON.parse(
      JSON.stringify(localStorage.getItem("LoggedInUserInfo"))
    );
    let currentUser = JSON.parse(stringifiedData);
    this.userPofileService
      .getUserProfileById(currentUser.appUserId)
      .subscribe(
        (data: any) => {
          localStorage.setItem("userProfile", JSON.stringify(data.dateSet));
        },
        (error) => {
          console.log("Error: ", error);
        }
      );
  }

  @Output() internalUserSelected = new EventEmitter<void>();
  @Output() externalClientSelected = new EventEmitter<void>();
  isInternalUser = false;//the default MUST be external

  openExternalClient(user: any) {
    this.modalService.open(user, { backdrop: 'static', centered: true, size: 'xl' });
  }

  openInternalUserClient(internalUser: any) {

    this.modalService.open(internalUser, { backdrop: 'static', centered: true, size: 'xl' });


  }

  /*  <!--JJS 02Feb changed the external user acting as internal text for the modal and made them go straight to choose an exsisting internal client-->*/
  openChoice(choiceEC: any) {

    this.modalService.open(choiceEC, { backdrop: 'static', centered: true, size: 'xl' });
  }
  openChoiceExternalActingAsInternal(internalUser: any) {
    if (this.ActingAsInternal == true) {

      this.internalUserSelected.emit();
      this.sharedService.option = 'proxy';
      this.openInternalUserClient(internalUser);
      this.modalService.dismissAll();
      this.modalService.open(internalUser, { backdrop: 'static', centered: true, size: 'xl' });
    }
  }

  handleChoice(internalUser: any, user: any) {
    if (this.ActingAsInternal == false) {
      if (this.isInternalUser) {
        this.internalUserSelected.emit();
        this.sharedService.option = 'proxy';
        if (this.isInternalUser == true) {

        }
        else {

        }
        this.openInternalUserClient(internalUser);
      } else {
        this.externalClientSelected.emit();
        this.openExternalClient(user);
      }
    }
    else {
      this.internalUserSelected.emit();
      this.sharedService.option = 'proxy';
      this.openInternalUserClient(internalUser);
    }

  }
  openSpin(spin) {
    this.modalService.open(spin, { backdrop: 'static', centered: true, size: 'xl' });
  }

  addCard(subDeptName: string) {
    const cardContainer = this.el.nativeElement.querySelector('.cards');

    // Create a new card element
    const newCard = this.renderer.createElement('div');
    this.renderer.addClass(newCard, 'card');
    this.renderer.setProperty(newCard, 'textContent', subDeptName);

    // Append the new card to the card container
    this.renderer.appendChild(cardContainer, newCard);
  }

  addCardsForSubDepartments() {
    this.AllSubDepartmentList.forEach((subDept) => this.addCard(subDept.subDepartmentName));
  }



  async getAllInternalUsers() {


    this.AllInternalUserProfileList.splice(0, this.AllInternalUserProfileList.length);

    const data: any = await this.userPofileService.getInternalUsers().toPromise();

    if (data.responseCode == 1) {
      for (let i = 0; i < data.dateSet.length; i++) {
        const current = data.dateSet[i];
        const tempAllInternalUserProfileList: ClientUserList = {
          userId: current.userID,
          idNumber: current.idNumber,
          fullName: current.fullName,

          internalDepartment: (current.directorate !== null && current.directorate !== '') ? current.directorate : current.departmentName,
          //What happens if both are empty?

        };
        this.sharedService.clientUserID = current.userID;
        this.AllInternalUserProfileList.push(tempAllInternalUserProfileList);

      }

      console.log("InternalUserProfileList", this.AllInternalUserProfileList);
    } else {
      alert(data.responseMessage);
    }
    console.log("Response", data);
  } catch(error) {
    console.log("Error:", error);
  }

  openDrafts(drafts: any) {
    this.dialog.open(drafts, {
      width: '80%',
      maxHeight: 'calc(100vh - 100px)',
      height: 'auto'
    });
  }
  getDraftsList() {

    if (this.CurrentUserProfile[0].isInternal == true) {
      this.draftApplicationService.getDraftedApplicationsList(this.CurrentUser.appUserId).subscribe((data: any) => {
        if (data.responseCode == 1) {

          if (data.dateSet.length != 0) {
            this.gotDrafts = true;

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
    else {
      this.draftApplicationService.getDraftedApplicationsListForExternal(this.CurrentUser.appUserId).subscribe((data: any) => {
        if (data.responseCode == 1) {

          if (data.dateSet.length != 0) {
            this.gotDrafts = true;
            this.externalUser = true;

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
  }


  //filterForCurrentReviews() {

  //  this.applicationDataForView = [];
  //  this.Applications = [];
  //  this.applicationsForUsersZoneList.splice(0, this.applicationsForUsersZoneList.length);
  //  this.applicationService.getApplicationsList(this.CurrentUser.appUserId, true).subscribe((data: any) => {


  //    if (data.responseCode == 1) {


  //      for (let i = 0; i < data.dateSet.length; i++) {
  //        const tempApplicationList = {} as ApplicationsList;
  //        const tempApplicationListShared = {} as ApplicationList;
  //        const current = data.dateSet[i];





  //        console.log("current", current)
  //        tempApplicationList.ApplicationID = current.applicationID;
  //        tempApplicationList.FullName = current.fullName;
  //        tempApplicationList.TypeOfApplication = current.typeOfApplication;
  //        tempApplicationList.CurrentStage = current.currentStageName;
  //        tempApplicationList.ApplicationStatus = current.applicationStatus;
  //        tempApplicationList.isEscalated = current.isEscalated; //escalation Sindiswa 29 January 2024

  //        tempApplicationList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
  //        tempApplicationListShared.CurrentStageStartDate = current.currentStageStartDate.substring(0, current.dateCreated.indexOf('T'));

  //        /*cal application age*/

  //        const currentDate = new Date();
  //        const dateCreated = new Date(tempApplicationList.DateCreated);
  //        const timeDiff = currentDate.getTime() - dateCreated.getTime();
  //        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  //        tempApplicationList.TestApplicationAge = daysDiff;

  //        /*cal stage age*/
  //        const stageDateCreated = new Date(tempApplicationListShared.CurrentStageStartDate);
  //        const stageDate = currentDate.getTime() - stageDateCreated.getTime();
  //        const stageDateDiff = Math.floor(stageDate / (1000 * 3600 * 24));
  //        tempApplicationList.TestApplicationStageAge = stageDateDiff;
  //        console.log("WheknfnfetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAge", tempApplicationList.TestApplicationStageAge);



  //        if (current.projectNumber != null) {
  //          tempApplicationList.ProjectNumber = current.projectNumber;
  //        } else {
  //          tempApplicationList.ProjectNumber = (current.applicationID).toString();
  //        }


  //        /*            do {
  //                      tempApplicationList.TestApplicationStageAge = Math.floor(Math.random() * 30) + 1;
  //                    } while (tempApplicationList.TestApplicationStageAge > tempApplicationList.TestApplicationAge);*/
  //        //save here to send to the shared

  //        //tempApplicationListShared.applicationID = current. ;
  //        tempApplicationListShared.applicationID = current.applicationID;
  //        tempApplicationListShared.clientName = current.fullName;
  //        tempApplicationListShared.clientEmail = current.email;
  //        tempApplicationListShared.clientAlternativeEmail = current.alternativeEmail; //checkingNotifications Sindiswa 15 February 2024
  //        tempApplicationListShared.clientAddress = current.physicalAddress;
  //        tempApplicationListShared.clientRefNo = current.referenceNumber;
  //        tempApplicationListShared.CompanyRegNo = current.companyRegNo;
  //        tempApplicationListShared.TypeOfApplication = current.typeOfApplication;
  //        tempApplicationListShared.NotificationNumber = current.notificationNumber;
  //        tempApplicationListShared.WBSNumber = current.wbsNumber;
  //        tempApplicationListShared.PhysicalAddressOfProject = current.physicalAddressOfProject;
  //        tempApplicationListShared.DescriptionOfProject = current.descriptionOfProject;
  //        tempApplicationListShared.NatureOfWork = current.natureOfWork;
  //        tempApplicationListShared.ExcavationType = current.excavationType;
  //        tempApplicationListShared.ExpectedStartDate = current.expectedStartDate;
  //        tempApplicationListShared.ExpectedEndDate = current.expectedEndDate;
  //        tempApplicationListShared.Location = current.location;
  //        tempApplicationListShared.clientCellNo = current.phoneNumber;
  //        tempApplicationListShared.CreatedById = current.createdById;
  //        tempApplicationListShared.UserID = current.userID;//
  //        tempApplicationListShared.ApplicationStatus = current.applicationStatus;
  //        tempApplicationListShared.CurrentStageName = current.currentStageName;
  //        tempApplicationListShared.CurrentStageNumber = current.currentStageNumber;

  //        tempApplicationListShared.NextStageName = current.nextStageName;
  //        tempApplicationListShared.NextStageNumber = current.nextStageNumber;
  //        tempApplicationListShared.PreviousStageName = current.previousStageName;
  //        tempApplicationListShared.PreviousStageNumber = current.previousStageNumber;
  //        tempApplicationListShared.DatePaid = current.datePaid;
  //        tempApplicationListShared.wbsrequired = current.wbsRequired;
  //        tempApplicationListShared.Coordinates = current.coordinates;
  //        if (current.projectNumber != null) {
  //          tempApplicationListShared.ProjectNumber = current.projectNumber;
  //        } else {
  //          tempApplicationListShared.ProjectNumber = (current.applicationID).toString();
  //        }

  //        tempApplicationListShared.isPlanning = current.isPlanning;
  //        tempApplicationListShared.permitStartDate = current.permitStartDate;

  //        tempApplicationListShared.ContractorAccountDetails = current.contractorAccountDetails; //zxNumberUpdate Sindiswa 01 March 2024

  //        //#region escalation Sindiswa 31 January 2024
  //        tempApplicationList.isEscalated = current.isEscalated;
  //        tempApplicationList.EscalationDate = current.escalationDate;
  //        tempApplicationList.EMBActionDate = current.embActionDate;
  //        //#endregion
  //        if (current.networkLicenses == true) {
  //          tempApplicationListShared.NetworkLicensees = "Fibre Network Licensees have been contacted regarding trench sharing and existing services";
  //        }
  //        else {
  //          tempApplicationListShared.NetworkLicensees = " ";
  //        }
  //        this.subDepartmentForCommentService.getSubDepartmentForCommentBySubID(current.applicationID, this.CurrentUserProfile.subDepartmentID)
  //          .subscribe((data: any) => {
  //            if (data.responseCode == 1) {

  //              this.processApplication(data.dateSet, current.applicationID);
  //            } else {
  //              alert(data.responseMessage);
  //            }


  //          }, error => {
  //            console.log("Error: ", error);
  //          });
  //        this.applicationDataForView.push(tempApplicationListShared);
  //        console.log("this.applicationDataForViewthis.applicationDataForViewthis.applicationDataForView", this.applicationDataForView);
  //        this.Applications.push(tempApplicationList);
  //        /*Cehcing the escaltion date*/
  //        this.configService.getConfigsByConfigName("EscalationDate").subscribe((data: any) => {

  //          if (data.responseCode == 1) {

  //            const current = data.dateSet[0];
  //            console.log("currentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrent", current);
  //            this.viewEscalateDate = current.configDescription;
  //            if (this.Applications[i].TestApplicationAge >= Number(this.viewEscalateDate)) {
  //              this.escalateBtn = true;
  //            }

  //          }
  //          else {
  //            alert("Error");
  //          }

  //          console.log("response", data);
  //        }, error => {
  //          console.log("Error", error);
  //        })
  //      }
  //      this.dataSource = this.Applications.filter(df => df.DateCreated);
  //      console.log("WEWEWEWEWEWEWEWEWEWEWEWEWEWEWEWEWEWEEEEEEEWEWEWEWEWEWEWEWEWEWEWE", this.applicationsForUsersZoneList);

  //      console.log("Got all applications", data.dateSet);
  //    }
  //    else {
  //      alert(data.responseMessage);
  //    }

  //  })


  //}

  getZonesForApplication(applicationID: number) {
    this.subDepartmentForCommentService.getSubDepartmentForCommentBySubID(applicationID, this.CurrentUserProfile.subDepartmentID)
      .subscribe((data: any) => {
        if (data.responseCode == 1) {

          for (let i = 0; i < data.dateSet.length; i++) {
            const tempZoneList = {} as ZoneList;
            const current = data.dateSet[i];
            tempZoneList.zoneID = current.zoneID;
            tempZoneList.zoneName = current.zoneName;
            tempZoneList.subDepartmentID = current.subDepartmentID;
            tempZoneList.departmentID = current.departmentID;
            tempZoneList.zoneForCommentID = current.zoneForCommentID;
            tempZoneList.subDepartmentName = current.subDepartmentName;
            this.applicationsForUsersZoneList.push(tempZoneList);
          }
        } else {
          alert(data.responseMessage);
        }


      }, error => {
        console.log("Error: ", error);
      });
  }
  processApplication(subDepartmentData: any, applicationID: string) {
    // Process the application based on subdepartment information
    const isValidApplication = /* Your logic to determine if the application is valid */ true;

    if (isValidApplication) {
      // Add the application to the list
      this.addApplicationToList(applicationID);
    }
  }

  addApplicationToList(applicationID: string) {
    // Add the application to the list
    // ...
    this.applicationsForUsersZoneList.push(/* Add relevant data to applicationsForUsersZoneList */);

    // After processing all applications, filter the dataSource based on DateCreated
    this.dataSource = this.Applications.filter(df => df.DateCreated);
    // After processing all applications, filter the dataSource based on DateCreated

  }

  appID: number;
  projNum: string;
  // #region escalation Sindiswa 29 January 2024
  escalateApplication(element: any) {


    this.appID = element.ApplicationID;
    this.projNum = element.ProjectNumber;
    const confirm = window.confirm("Are you sure you want to escalate this application?");

    if (confirm) {
      this.applicationService.escalateApplication(element.ApplicationID).subscribe(async (data: any) => {

        if (data.responseCode == 1) {

          console.log(`An application with the following project number ${element.ProjectNumber} has been escalated.`);

          //Hebana, do they want an email AND a notification
          // #region notifications Sindiswa 01 February 2024

          const embUsers = await this.getUniqueEmbUsers();

          if (embUsers !== null) {
            this.sendEmailToEmb(embUsers);
          }
          else {
            console.error("Error while fetching EMB users:", embUsers.responseMessage);
          }

          // #endregion

          this.router.navigate(["/home"]); //will this refresh?
          location.reload();
        }
      })

    }
  }
  async getUniqueEmbUsers(): Promise<any> {

    /*try {
      const embUserData: any = await this.userPofileService.getUsersBySubDepartmentName("EMB").toPromise();
      //const embUserData: any = await this.accessGroupsService.getUserBasedOnRoleName("EMB", 1021).toPromise();

      if (embUserData.responseCode === 1) {
        let embUsers = embUserData.dateSet;

        const tempList = embUsers;

        const seenCombinations = {};

        embUsers = tempList.filter(item => {
          const key = `${item.subDepartmentID}-${item.zoneID}-${item.email}`;

          if (!seenCombinations[key]) {
            seenCombinations[key] = true;
            return true;
          }

          return false;
        });
        console.log("Unique EMB users identified:", embUsers);
        return embUsers;
      } else {
        console.error("Error while fetching EMB users:", embUserData.responseMessage);
        return null;
      }
    } catch (error) {
      console.error("Error fetching EMB users:", error);
      return null;
    }*/
  }
  sendEmailToEmb(embUsers: any[]): void {

    try {
      for (const obj of embUsers) {
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
          <p>A Wayleave application with Wayleave No. ${this.projNum} was escalated by the applicant/client. As an EMB user, please follow up with the relevant departments currently handling this application.</p>
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


        // Send email to EMB user
        this.notificationsService.sendEmail(obj.email, "Escalated wayleave application", emailContent2, emailContent2);
        if (obj.alternativeEmail) {
          this.notificationsService.sendEmail(obj.alternativeEmail, "Escalated wayleave application", emailContent2, emailContent2);
        }

        // Add update notification

        this.notificationsService.addUpdateNotification(
          0,
          "Application Needs Immediate Attention",
          "Escalated wayleave application",
          false,
          obj.userID,
          /*checkingNotifications Sindiswa 12 February 2024*/ this.appID,
          this.CurrentUser?.appUserId ?? null,
          `The Wayleave application with Wayleave No. ${this.projNum} was escalated by the applicant/client. As an EMB user, please follow up with the relevant departments currently handling this application.`
        ).subscribe((data: any) => {
          if (data.responseCode === 1) {
            console.log(data.responseMessage);
          } else {
            alert(data.responseMessage);
          }
        });
      }

      console.log("All EMB emails sent successfully!?");
    } catch (error) {
      console.error("Error sending EMB escalation notices", error);
    }
  }
  // #endregion

  /*New Home Dashbaord Filtering*/

  Reviews: string = "option1";
  reviewerTab: boolean = false;
  SeniorReviewerTab: boolean = false;
  FinalReviewerTab: boolean = false;
  PermitIssuerTab: boolean = false;
  PermitCoordinatorTab: boolean = false;
  EMBTab: boolean = false;
  ZoneAdminTab: boolean = false;
  GISReviewerTab: boolean = false;
  Applicant: boolean = false;
  ActingInternal: boolean = false;
  RoleSwitcher = '';
  roleStates: { [key: string]: boolean } = {};
  getToggleValue(roleName: string): string {

    return roleName === "Final Approver" ? "FR" : roleName;

  }
  onToggleChange(selectedValue: string): void {
    // Fetch applications based on the selected role
    // Call the appropriate method here based on the selected value
    
    switch (selectedValue) {
      case "Reviewer":
        this.onFilterApplicationForMyReviews();
        break;
      case "Senior Reviewer":
        this.getApplicationsForSeniorReviewer();
        break;
      case "FR":
        this.getApplicationsForFinalReviewer();
        break;
      case "Department Admin":
        this.getApplicationsForAdmin();
        break;
      case "Permit Coordinator":
        this.getApplicationsForPermitCoordinator();
        break;
      case "Issue Permit":
        this.getApplicationsForPermitIssuer();
        break;
      case "GIS Reviewer":
        this.getApplicationsForGISReviewer();
        break;
      case "EMB":
        this.getApplicationsForEMB();
        break;
      // Add cases for other roles as needed
      default:
        // Handle default case
        break;
    }
  }

  onCheckAllRolesForUser() {
    this.Reviews = 'option1';
    this.isTableLoading = true;
    this.ActingAs = true;

    this.notNyProjects = true;
    this.pastAndCurrentReviews = true;

    // Define a variable to keep track of the first toggle button
    let firstToggleSelected = false;
    
    if (this.AllCurrentUserRoles.length < 1) {
      this.pastAndCurrentReviews = false;
      /*this.onFilterApplicationsFprMyApplications()*/;
    }
    else {
      for (let i = 0; i < this.AllCurrentUserRoles.length; i++) {
        
        const roleName = this.AllCurrentUserRoles[i].roleName;
        
        if (roleName == 'Action Centre' || roleName == 'Create Wayleave' || roleName == 'Developer Config' || roleName == 'Configuration' || roleName == 'Audit Trail' || roleName == 'Generate Approval Pack and Rejection Pack' || roleName == 'Verify Payment' || roleName == 'Tracking' || roleName == 'Zone Admin') {

        }
        else if (roleName == 'Applicant' || roleName == 'ActingAsInternal') {
          /*this.onFilterApplicationsFprMyApplications();*/
          break;
        }
        else if (this.CurrentUserProfile[0].departmentName == "EMB") {
          this.notNyProjects = false;
          this.FilterBtn = true;
          this.getApplicationsForEMB();
          break;
        }
        else if (roleName == 'EMB') {

          this.getApplicationsForEMB();
          break;
        }
        else {
          this.FilterBtn = true;
          // Set role state in the map
          this.FiterValue = "My Reviews"
          this.roleStates[roleName] = true;

          // Set selected value for the first toggle button
          if (!firstToggleSelected) {
            this.selectedVal = roleName === "Final Approver" ? "FR" : roleName.substring(0, 2).toUpperCase();
            // Assuming all other roles can be abbreviated by the first two letters
            firstToggleSelected = true;
          }
        }
      }
    }
  }
  selectedVal = '';
  roleOrder = ["Reviewer", "Senior Reviewer", "Final Approver", "Department Admin", "Permit Coordinator", "Issue Permit", "EMB", "GIS Reviewer"];

  setSelectedVal(): void {
    for (const roleName of this.roleOrder) {
      if (this.roleStates[roleName]) {
        this.selectedVal = this.getToggleValue(roleName);
        return;
      }
    }
  }
  onFilterApplicationForMyReviews() {

    this.notNyProjects = true;
    this.isTableLoading = true;
    this.MyProjects = false;
    this.FiterValue = "";
    this.FiterValue = "Your Reviews";
    this.cardFilters = false;
    this.applicationDataForView = [];
    this.Applications = [];
    this.Applications.splice(0, this.Applications.length);
    this.applicationService.getApplicationsForReviewer(this.CurrentUserProfile[0].zoneID, this.CurrentUser.appUserId).subscribe((data: any) => {


      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempApplicationList = {} as ApplicationsList;
          const tempApplicationListShared = {} as ApplicationList;
          const current = data.dateSet[i];

          //JJS-15-02-2024 Fixing the delete drafts (wasn't deleting)-->
          const isDuplicate = this.Applications.some(app => app.ApplicationID === current.applicationID);


          if (!isDuplicate) {

            console.log("current", current)
            tempApplicationList.ApplicationID = current.applicationID;
            tempApplicationList.FullName = current.fullName;
            tempApplicationList.TypeOfApplication = current.typeOfApplication;
            tempApplicationList.CurrentStage = current.currentStageName;
            tempApplicationList.ApplicationStatus = current.applicationStatus;
            tempApplicationList.isEscalated = current.isEscalated; //escalation Sindiswa 29 January 2024
            tempApplicationList.DateCreatedFull = current.dateCreated;
            tempApplicationList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
            tempApplicationListShared.CurrentStageStartDate = current.currentStageStartDate.substring(0, current.dateCreated.indexOf('T'));

            /*cal application age*/

            const currentDate = new Date();
            const dateCreated = new Date(tempApplicationList.DateCreated);
            const timeDiff = currentDate.getTime() - dateCreated.getTime();
            const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
            tempApplicationList.TestApplicationAge = daysDiff;

            /*cal stage age*/
            const stageDateCreated = new Date(tempApplicationListShared.CurrentStageStartDate);
            const stageDate = currentDate.getTime() - stageDateCreated.getTime();
            const stageDateDiff = Math.floor(stageDate / (1000 * 3600 * 24));
            tempApplicationList.TestApplicationStageAge = stageDateDiff;
            console.log("WheknfnfetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAge", tempApplicationList.TestApplicationStageAge);



            if (current.projectNumber != null) {
              tempApplicationList.ProjectNumber = current.projectNumber;
            } else {
              tempApplicationList.ProjectNumber = (current.applicationID).toString();
            }


            /*            do {
                          tempApplicationList.TestApplicationStageAge = Math.floor(Math.random() * 30) + 1;
                        } while (tempApplicationList.TestApplicationStageAge > tempApplicationList.TestApplicationAge);*/
            //save here to send to the shared

            //tempApplicationListShared.applicationID = current. ;
            tempApplicationListShared.applicationID = current.applicationID;
            tempApplicationListShared.clientName = current.fullName;
            tempApplicationListShared.clientEmail = current.email;
            tempApplicationListShared.clientAlternativeEmail = current.alternativeEmail; //checkingNotifications Sindiswa 15 February 2024
            tempApplicationListShared.clientAddress = current.physicalAddress;
            tempApplicationListShared.clientRefNo = current.referenceNumber;
            tempApplicationListShared.CompanyRegNo = current.companyRegNo;
            tempApplicationListShared.TypeOfApplication = current.typeOfApplication;
            tempApplicationListShared.NotificationNumber = current.notificationNumber;
            tempApplicationListShared.WBSNumber = current.wbsNumber;
            tempApplicationListShared.PhysicalAddressOfProject = current.physicalAddressOfProject;
            tempApplicationListShared.DescriptionOfProject = current.descriptionOfProject;
            tempApplicationListShared.NatureOfWork = current.natureOfWork;
            tempApplicationListShared.ExcavationType = current.excavationType;
            tempApplicationListShared.ExpectedStartDate = current.expectedStartDate;
            tempApplicationListShared.ExpectedEndDate = current.expectedEndDate;
            tempApplicationListShared.Location = current.location;
            tempApplicationListShared.clientCellNo = current.phoneNumber;
            tempApplicationListShared.CreatedById = current.createdById;
            tempApplicationListShared.UserID = current.userID;//
            tempApplicationListShared.ApplicationStatus = current.applicationStatus;
            tempApplicationListShared.CurrentStageName = current.currentStageName;
            tempApplicationListShared.CurrentStageNumber = current.currentStageNumber;

            tempApplicationListShared.NextStageName = current.nextStageName;
            tempApplicationListShared.NextStageNumber = current.nextStageNumber;
            tempApplicationListShared.PreviousStageName = current.previousStageName;
            tempApplicationListShared.PreviousStageNumber = current.previousStageNumber;
            tempApplicationListShared.DatePaid = current.datePaid;
            tempApplicationListShared.wbsrequired = current.wbsRequired;
            tempApplicationListShared.Coordinates = current.coordinates;
            if (current.projectNumber != null) {
              tempApplicationListShared.ProjectNumber = current.projectNumber;
            } else {
              tempApplicationListShared.ProjectNumber = (current.applicationID).toString();
            }

            tempApplicationListShared.isPlanning = current.isPlanning;
            tempApplicationListShared.permitStartDate = current.permitStartDate;

            tempApplicationListShared.ContractorAccountDetails = current.contractorAccountDetails; //zxNumberUpdate Sindiswa 01 March 2024

            //#region escalation Sindiswa 31 January 2024
            tempApplicationList.isEscalated = current.isEscalated;
            tempApplicationList.EscalationDate = current.escalationDate;
            tempApplicationList.EMBActionDate = current.embActionDate;
            //#endregion


            this.applicationDataForView.push(tempApplicationListShared);
            console.log("this.applicationDataForViewthis.applicationDataForViewthis.applicationDataForView", this.applicationDataForView);
            this.Applications.push(tempApplicationList);
            /*Cehcing the escaltion date*/
          }
          this.configService.getConfigsByConfigName("EscalationDate").subscribe((data: any) => {

            if (data.responseCode == 1) {

              const current = data.dateSet[0];
              console.log("currentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrent", current);
              this.viewEscalateDate = current.configDescription;
              if (this.Applications[i].TestApplicationAge >= Number(this.viewEscalateDate)) {
                this.escalateBtn = true;
              }

            }
            else {
              alert("Error");
            }

            console.log("response", data);
          }, error => {
            console.log("Error", error);
          })
        }
        this.changeDetectorRef.detectChanges();
        this.dataSource = this.Applications.filter(df => df.DateCreatedFull);
        /*this.applicationsTable?.renderRows();*/
        //for card filters

        this.recentUnpaidCount();
        this.recentDistributedCount();
        this.recentApprovedCount();
        this.recentejectedCount();
        this.recentWIPCount();
        this.pastAndCurrentReviews = true;
        this.isTableLoading = false;
        console.log("Got all applications", data.dateSet);
      }
      else {
        alert(data.responseMessage);
      }

    })
    this.isTableLoading = false;
    this.pastAndCurrentReviews = true;
  }
  getApplicationsForAdmin() {
    this.applicationDataForView = [];
    this.Applications = [];
    this.isTableLoading = true;
    this.Applications.splice(0, this.Applications.length);
    this.applicationService.getApplicationsForDepAdmin(this.CurrentUserProfile[0].zoneID, this.CurrentUser.appUserId).subscribe((data: any) => {


      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempApplicationList = {} as ApplicationsList;
          const tempApplicationListShared = {} as ApplicationList;
          const current = data.dateSet[i];

          console.log("current", current)
          tempApplicationList.ApplicationID = current.applicationID;
          tempApplicationList.FullName = current.fullName;
          tempApplicationList.TypeOfApplication = current.typeOfApplication;
          tempApplicationList.CurrentStage = current.currentStageName;
          tempApplicationList.ApplicationStatus = current.applicationStatus;
          tempApplicationList.isEscalated = current.isEscalated; //escalation Sindiswa 29 January 2024

          tempApplicationList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
          tempApplicationListShared.CurrentStageStartDate = current.currentStageStartDate.substring(0, current.dateCreated.indexOf('T'));

          /*cal application age*/

          const currentDate = new Date();
          const dateCreated = new Date(tempApplicationList.DateCreated);
          const timeDiff = currentDate.getTime() - dateCreated.getTime();
          const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
          tempApplicationList.TestApplicationAge = daysDiff;
          /*cal stage age*/
          const stageDateCreated = new Date(tempApplicationListShared.CurrentStageStartDate);
          const stageDate = currentDate.getTime() - stageDateCreated.getTime();
          const stageDateDiff = Math.floor(stageDate / (1000 * 3600 * 24));
          tempApplicationList.TestApplicationStageAge = stageDateDiff;
          console.log("WheknfnfetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAge", tempApplicationList.TestApplicationStageAge);

          if (current.projectNumber != null) {
            tempApplicationList.ProjectNumber = current.projectNumber;
          } else {
            tempApplicationList.ProjectNumber = (current.applicationID).toString();
          }
          /*            do {
                        tempApplicationList.TestApplicationStageAge = Math.floor(Math.random() * 30) + 1;
                      } while (tempApplicationList.TestApplicationStageAge > tempApplicationList.TestApplicationAge);*/
          //save here to send to the shared

          //tempApplicationListShared.applicationID = current. ;
          tempApplicationListShared.applicationID = current.applicationID;
          tempApplicationListShared.clientName = current.fullName;
          tempApplicationListShared.clientEmail = current.email;
          tempApplicationListShared.clientAlternativeEmail = current.alternativeEmail; //checkingNotifications Sindiswa 15 February 2024
          tempApplicationListShared.clientAddress = current.physicalAddress;
          tempApplicationListShared.clientRefNo = current.referenceNumber;
          tempApplicationListShared.CompanyRegNo = current.companyRegNo;
          tempApplicationListShared.TypeOfApplication = current.typeOfApplication;
          tempApplicationListShared.NotificationNumber = current.notificationNumber;
          tempApplicationListShared.WBSNumber = current.wbsNumber;
          tempApplicationListShared.PhysicalAddressOfProject = current.physicalAddressOfProject;
          tempApplicationListShared.DescriptionOfProject = current.descriptionOfProject;
          tempApplicationListShared.NatureOfWork = current.natureOfWork;
          tempApplicationListShared.ExcavationType = current.excavationType;
          tempApplicationListShared.ExpectedStartDate = current.expectedStartDate;
          tempApplicationListShared.ExpectedEndDate = current.expectedEndDate;
          tempApplicationListShared.Location = current.location;
          tempApplicationListShared.clientCellNo = current.phoneNumber;
          tempApplicationListShared.CreatedById = current.createdById;
          tempApplicationListShared.UserID = current.userID;//
          tempApplicationListShared.ApplicationStatus = current.applicationStatus;
          tempApplicationListShared.CurrentStageName = current.currentStageName;
          tempApplicationListShared.CurrentStageNumber = current.currentStageNumber;

          tempApplicationListShared.NextStageName = current.nextStageName;
          tempApplicationListShared.NextStageNumber = current.nextStageNumber;
          tempApplicationListShared.PreviousStageName = current.previousStageName;
          tempApplicationListShared.PreviousStageNumber = current.previousStageNumber;
          tempApplicationListShared.DatePaid = current.datePaid;
          tempApplicationListShared.wbsrequired = current.wbsRequired;
          tempApplicationListShared.Coordinates = current.coordinates;
          if (current.projectNumber != null) {
            tempApplicationListShared.ProjectNumber = current.projectNumber;
          } else {
            tempApplicationListShared.ProjectNumber = (current.applicationID).toString();
          }

          tempApplicationListShared.isPlanning = current.isPlanning;
          tempApplicationListShared.permitStartDate = current.permitStartDate;

          tempApplicationListShared.ContractorAccountDetails = current.contractorAccountDetails; //zxNumberUpdate Sindiswa 01 March 2024

          this.applicationDataForView.push(tempApplicationListShared);
          console.log("this.applicationDataForViewthis.applicationDataForViewthis.applicationDataForView", this.applicationDataForView);
          this.Applications.push(tempApplicationList);
          /*Cehcing the escaltion date*/
          this.configService.getConfigsByConfigName("EscalationDate").subscribe((data: any) => {

            if (data.responseCode == 1) {

              const current = data.dateSet[0];
              console.log("currentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrent", current);
              this.viewEscalateDate = current.configDescription;
              if (this.Applications[i].TestApplicationAge >= Number(this.viewEscalateDate)) {
                this.escalateBtn = true;
              }

            }
            else {
              alert("Error");
            }

            console.log("response", data);
          }, error => {
            console.log("Error", error);
          })
        }
        this.changeDetectorRef.detectChanges();
        this.dataSource = this.Applications.filter(df => df.DateCreatedFull);
        /*this.applicationsTable?.renderRows();*/
        //for card filters

        this.recentUnpaidCount();
        this.recentDistributedCount();
        this.recentApprovedCount();
        this.recentejectedCount();
        this.recentWIPCount();
        this.isTableLoading = false;
        console.log("Got all applications", data.dateSet);
      }
      else {
        alert(data.responseMessage);
      }

    })
  }
  getApplicationsForSeniorReviewer() {
    this.applicationDataForView = [];
    this.Applications = [];
    this.isTableLoading = true;
    this.Applications.splice(0, this.Applications.length);
    this.applicationService.getApplicationsForSeniorReviewer(this.CurrentUserProfile[0].zoneID, this.CurrentUser.appUserId).subscribe((data: any) => {


      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempApplicationList = {} as ApplicationsList;
          const tempApplicationListShared = {} as ApplicationList;
          const current = data.dateSet[i];
          //JJS-15-02-2024 Fixing the delete drafts (wasn't deleting)-->
          const isDuplicate = this.Applications.some(app => app.ApplicationID === current.applicationID);


          if (!isDuplicate) {


            console.log("current", current)
            tempApplicationList.ApplicationID = current.applicationID;
            tempApplicationList.FullName = current.fullName;
            tempApplicationList.TypeOfApplication = current.typeOfApplication;
            tempApplicationList.CurrentStage = current.currentStageName;
            tempApplicationList.ApplicationStatus = current.applicationStatus;
            tempApplicationList.isEscalated = current.isEscalated; //escalation Sindiswa 29 January 2024

            tempApplicationList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
            tempApplicationListShared.CurrentStageStartDate = current.currentStageStartDate.substring(0, current.dateCreated.indexOf('T'));

            /*cal application age*/

            const currentDate = new Date();
            const dateCreated = new Date(tempApplicationList.DateCreated);
            const timeDiff = currentDate.getTime() - dateCreated.getTime();
            const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
            tempApplicationList.TestApplicationAge = daysDiff;

            /*cal stage age*/
            const stageDateCreated = new Date(tempApplicationListShared.CurrentStageStartDate);
            const stageDate = currentDate.getTime() - stageDateCreated.getTime();
            const stageDateDiff = Math.floor(stageDate / (1000 * 3600 * 24));
            tempApplicationList.TestApplicationStageAge = stageDateDiff;
            console.log("WheknfnfetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAge", tempApplicationList.TestApplicationStageAge);



            if (current.projectNumber != null) {
              tempApplicationList.ProjectNumber = current.projectNumber;
            } else {
              tempApplicationList.ProjectNumber = (current.applicationID).toString();
            }


            /*            do {
                          tempApplicationList.TestApplicationStageAge = Math.floor(Math.random() * 30) + 1;
                        } while (tempApplicationList.TestApplicationStageAge > tempApplicationList.TestApplicationAge);*/
            //save here to send to the shared

            //tempApplicationListShared.applicationID = current. ;
            tempApplicationListShared.applicationID = current.applicationID;
            tempApplicationListShared.clientName = current.fullName;
            tempApplicationListShared.clientEmail = current.email;
            tempApplicationListShared.clientAlternativeEmail = current.alternativeEmail; //checkingNotifications Sindiswa 15 February 2024
            tempApplicationListShared.clientAddress = current.physicalAddress;
            tempApplicationListShared.clientRefNo = current.referenceNumber;
            tempApplicationListShared.CompanyRegNo = current.companyRegNo;
            tempApplicationListShared.TypeOfApplication = current.typeOfApplication;
            tempApplicationListShared.NotificationNumber = current.notificationNumber;
            tempApplicationListShared.WBSNumber = current.wbsNumber;
            tempApplicationListShared.PhysicalAddressOfProject = current.physicalAddressOfProject;
            tempApplicationListShared.DescriptionOfProject = current.descriptionOfProject;
            tempApplicationListShared.NatureOfWork = current.natureOfWork;
            tempApplicationListShared.ExcavationType = current.excavationType;
            tempApplicationListShared.ExpectedStartDate = current.expectedStartDate;
            tempApplicationListShared.ExpectedEndDate = current.expectedEndDate;
            tempApplicationListShared.Location = current.location;
            tempApplicationListShared.clientCellNo = current.phoneNumber;
            tempApplicationListShared.CreatedById = current.createdById;
            tempApplicationListShared.UserID = current.userID;//
            tempApplicationListShared.ApplicationStatus = current.applicationStatus;
            tempApplicationListShared.CurrentStageName = current.currentStageName;
            tempApplicationListShared.CurrentStageNumber = current.currentStageNumber;

            tempApplicationListShared.NextStageName = current.nextStageName;
            tempApplicationListShared.NextStageNumber = current.nextStageNumber;
            tempApplicationListShared.PreviousStageName = current.previousStageName;
            tempApplicationListShared.PreviousStageNumber = current.previousStageNumber;
            tempApplicationListShared.DatePaid = current.datePaid;
            tempApplicationListShared.wbsrequired = current.wbsRequired;
            tempApplicationListShared.Coordinates = current.coordinates;
            if (current.projectNumber != null) {
              tempApplicationListShared.ProjectNumber = current.projectNumber;
            } else {
              tempApplicationListShared.ProjectNumber = (current.applicationID).toString();
            }

            tempApplicationListShared.isPlanning = current.isPlanning;
            tempApplicationListShared.permitStartDate = current.permitStartDate;

            tempApplicationListShared.ContractorAccountDetails = current.contractorAccountDetails; //zxNumberUpdate Sindiswa 01 March 2024

            this.applicationDataForView.push(tempApplicationListShared);
            console.log("this.applicationDataForViewthis.applicationDataForViewthis.applicationDataForView", this.applicationDataForView);
            this.Applications.push(tempApplicationList);
          }
          /*Cehcing the escaltion date*/
          this.configService.getConfigsByConfigName("EscalationDate").subscribe((data: any) => {

            if (data.responseCode == 1) {

              const current = data.dateSet[0];
              console.log("currentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrent", current);
              this.viewEscalateDate = current.configDescription;
              if (this.Applications[i].TestApplicationAge >= Number(this.viewEscalateDate)) {
                this.escalateBtn = true;
              }

            }
            else {
              alert("Error");
            }

            console.log("response", data);
          }, error => {
            console.log("Error", error);
          })
        }
        this.changeDetectorRef.detectChanges();
        this.dataSource = this.Applications.filter(df => df.DateCreatedFull);
        /*this.applicationsTable?.renderRows();*/
        //for card filters

        this.recentUnpaidCount();
        this.recentDistributedCount();
        this.recentApprovedCount();
        this.recentejectedCount();
        this.recentWIPCount();
        this.isTableLoading = false;
        console.log("Got all applications", data.dateSet);
      }
      else {
        alert(data.responseMessage);
      }

    })
  }
  getApplicationsForFinalReviewer() {
    this.applicationDataForView = [];
    this.Applications = [];
    this.isTableLoading = true;
    
    this.Applications.splice(0, this.Applications.length);
    this.applicationService.getApplicationsForFinalReview(this.CurrentUserProfile[0].zoneID, this.CurrentUser.appUserId).subscribe((data: any) => {


      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempApplicationList = {} as ApplicationsList;
          const tempApplicationListShared = {} as ApplicationList;
          const current = data.dateSet[i];
          //JJS-15-02-2024 Fixing the delete drafts (wasn't deleting)-->
          const isDuplicate = this.Applications.some(app => app.ApplicationID === current.applicationID);


          if (!isDuplicate) {


            console.log("current", current)
            tempApplicationList.ApplicationID = current.applicationID;
            tempApplicationList.FullName = current.fullName;
            tempApplicationList.TypeOfApplication = current.typeOfApplication;
            tempApplicationList.CurrentStage = current.currentStageName;
            tempApplicationList.ApplicationStatus = current.applicationStatus;
            tempApplicationList.isEscalated = current.isEscalated; //escalation Sindiswa 29 January 2024

            tempApplicationList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
            tempApplicationListShared.CurrentStageStartDate = current.currentStageStartDate.substring(0, current.dateCreated.indexOf('T'));

            /*cal application age*/

            const currentDate = new Date();
            const dateCreated = new Date(tempApplicationList.DateCreated);
            const timeDiff = currentDate.getTime() - dateCreated.getTime();
            const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
            tempApplicationList.TestApplicationAge = daysDiff;

            /*cal stage age*/
            const stageDateCreated = new Date(tempApplicationListShared.CurrentStageStartDate);
            const stageDate = currentDate.getTime() - stageDateCreated.getTime();
            const stageDateDiff = Math.floor(stageDate / (1000 * 3600 * 24));
            tempApplicationList.TestApplicationStageAge = stageDateDiff;
            console.log("WheknfnfetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAge", tempApplicationList.TestApplicationStageAge);



            if (current.projectNumber != null) {
              tempApplicationList.ProjectNumber = current.projectNumber;
            } else {
              tempApplicationList.ProjectNumber = (current.applicationID).toString();
            }


            /*            do {
                          tempApplicationList.TestApplicationStageAge = Math.floor(Math.random() * 30) + 1;
                        } while (tempApplicationList.TestApplicationStageAge > tempApplicationList.TestApplicationAge);*/
            //save here to send to the shared

            //tempApplicationListShared.applicationID = current. ;
            tempApplicationListShared.applicationID = current.applicationID;
            tempApplicationListShared.clientName = current.fullName;
            tempApplicationListShared.clientEmail = current.email;
            tempApplicationListShared.clientAlternativeEmail = current.alternativeEmail; //checkingNotifications Sindiswa 15 February 2024
            tempApplicationListShared.clientAddress = current.physicalAddress;
            tempApplicationListShared.clientRefNo = current.referenceNumber;
            tempApplicationListShared.CompanyRegNo = current.companyRegNo;
            tempApplicationListShared.TypeOfApplication = current.typeOfApplication;
            tempApplicationListShared.NotificationNumber = current.notificationNumber;
            tempApplicationListShared.WBSNumber = current.wbsNumber;
            tempApplicationListShared.PhysicalAddressOfProject = current.physicalAddressOfProject;
            tempApplicationListShared.DescriptionOfProject = current.descriptionOfProject;
            tempApplicationListShared.NatureOfWork = current.natureOfWork;
            tempApplicationListShared.ExcavationType = current.excavationType;
            tempApplicationListShared.ExpectedStartDate = current.expectedStartDate;
            tempApplicationListShared.ExpectedEndDate = current.expectedEndDate;
            tempApplicationListShared.Location = current.location;
            tempApplicationListShared.clientCellNo = current.phoneNumber;
            tempApplicationListShared.CreatedById = current.createdById;
            tempApplicationListShared.UserID = current.userID;//
            tempApplicationListShared.ApplicationStatus = current.applicationStatus;
            tempApplicationListShared.CurrentStageName = current.currentStageName;
            tempApplicationListShared.CurrentStageNumber = current.currentStageNumber;

            tempApplicationListShared.NextStageName = current.nextStageName;
            tempApplicationListShared.NextStageNumber = current.nextStageNumber;
            tempApplicationListShared.PreviousStageName = current.previousStageName;
            tempApplicationListShared.PreviousStageNumber = current.previousStageNumber;
            tempApplicationListShared.DatePaid = current.datePaid;
            tempApplicationListShared.wbsrequired = current.wbsRequired;
            tempApplicationListShared.Coordinates = current.coordinates;
            if (current.projectNumber != null) {
              tempApplicationListShared.ProjectNumber = current.projectNumber;
            } else {
              tempApplicationListShared.ProjectNumber = (current.applicationID).toString();
            }

            tempApplicationListShared.isPlanning = current.isPlanning;
            tempApplicationListShared.permitStartDate = current.permitStartDate;

            tempApplicationListShared.ContractorAccountDetails = current.contractorAccountDetails; //zxNumberUpdate Sindiswa 01 March 2024

            this.applicationDataForView.push(tempApplicationListShared);
            console.log("this.applicationDataForViewthis.applicationDataForViewthis.applicationDataForView", this.applicationDataForView);
            this.Applications.push(tempApplicationList);
          }
          /*Cehcing the escaltion date*/
          this.configService.getConfigsByConfigName("EscalationDate").subscribe((data: any) => {

            if (data.responseCode == 1) {

              const current = data.dateSet[0];
              console.log("currentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrent", current);
              this.viewEscalateDate = current.configDescription;
              if (this.Applications[i].TestApplicationAge >= Number(this.viewEscalateDate)) {
                this.escalateBtn = true;
              }

            }
            else {
              alert("Error");
            }

            console.log("response", data);
          }, error => {
            console.log("Error", error);
          })
        }
        this.changeDetectorRef.detectChanges();
        this.dataSource = this.Applications.filter(df => df.DateCreatedFull);
       /* this.applicationsTable?.renderRows();*/
        //for card filters

        this.recentUnpaidCount();
        this.recentDistributedCount();
        this.recentApprovedCount();
        this.recentejectedCount();
        this.recentWIPCount();
        this.isTableLoading = false;
        console.log("Got all applications", data.dateSet);
      }
      else {
        alert(data.responseMessage);
      }

    })
  }
  getApplicationsForPermitCoordinator() {
    this.applicationDataForView = [];
    this.Applications = [];
    this.isTableLoading = true;
    this.Applications.splice(0, this.Applications.length);
    this.applicationService.getApplicationsForPermitCoordinator(this.CurrentUserProfile[0].zoneID, this.CurrentUser.appUserId).subscribe((data: any) => {


      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempApplicationList = {} as ApplicationsList;
          const tempApplicationListShared = {} as ApplicationList;
          const current = data.dateSet[i];
          //JJS-15-02-2024 Fixing the delete drafts (wasn't deleting)-->
          const isDuplicate = this.Applications.some(app => app.ApplicationID === current.applicationID);


          if (!isDuplicate) {


            console.log("current", current)
            tempApplicationList.ApplicationID = current.applicationID;
            tempApplicationList.FullName = current.fullName;
            tempApplicationList.TypeOfApplication = current.typeOfApplication;
            tempApplicationList.CurrentStage = current.currentStageName;
            tempApplicationList.ApplicationStatus = current.applicationStatus;
            tempApplicationList.isEscalated = current.isEscalated; //escalation Sindiswa 29 January 2024

            tempApplicationList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
            tempApplicationListShared.CurrentStageStartDate = current.currentStageStartDate.substring(0, current.dateCreated.indexOf('T'));

            /*cal application age*/

            const currentDate = new Date();
            const dateCreated = new Date(tempApplicationList.DateCreated);
            const timeDiff = currentDate.getTime() - dateCreated.getTime();
            const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
            tempApplicationList.TestApplicationAge = daysDiff;

            /*cal stage age*/
            const stageDateCreated = new Date(tempApplicationListShared.CurrentStageStartDate);
            const stageDate = currentDate.getTime() - stageDateCreated.getTime();
            const stageDateDiff = Math.floor(stageDate / (1000 * 3600 * 24));
            tempApplicationList.TestApplicationStageAge = stageDateDiff;
            console.log("WheknfnfetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAge", tempApplicationList.TestApplicationStageAge);



            if (current.projectNumber != null) {
              tempApplicationList.ProjectNumber = current.projectNumber;
            } else {
              tempApplicationList.ProjectNumber = (current.applicationID).toString();
            }


            /*            do {
                          tempApplicationList.TestApplicationStageAge = Math.floor(Math.random() * 30) + 1;
                        } while (tempApplicationList.TestApplicationStageAge > tempApplicationList.TestApplicationAge);*/
            //save here to send to the shared

            //tempApplicationListShared.applicationID = current. ;
            tempApplicationListShared.applicationID = current.applicationID;
            tempApplicationListShared.clientName = current.fullName;
            tempApplicationListShared.clientEmail = current.email;
            tempApplicationListShared.clientAlternativeEmail = current.alternativeEmail; //checkingNotifications Sindiswa 15 February 2024
            tempApplicationListShared.clientAddress = current.physicalAddress;
            tempApplicationListShared.clientRefNo = current.referenceNumber;
            tempApplicationListShared.CompanyRegNo = current.companyRegNo;
            tempApplicationListShared.TypeOfApplication = current.typeOfApplication;
            tempApplicationListShared.NotificationNumber = current.notificationNumber;
            tempApplicationListShared.WBSNumber = current.wbsNumber;
            tempApplicationListShared.PhysicalAddressOfProject = current.physicalAddressOfProject;
            tempApplicationListShared.DescriptionOfProject = current.descriptionOfProject;
            tempApplicationListShared.NatureOfWork = current.natureOfWork;
            tempApplicationListShared.ExcavationType = current.excavationType;
            tempApplicationListShared.ExpectedStartDate = current.expectedStartDate;
            tempApplicationListShared.ExpectedEndDate = current.expectedEndDate;
            tempApplicationListShared.Location = current.location;
            tempApplicationListShared.clientCellNo = current.phoneNumber;
            tempApplicationListShared.CreatedById = current.createdById;
            tempApplicationListShared.UserID = current.userID;//
            tempApplicationListShared.ApplicationStatus = current.applicationStatus;
            tempApplicationListShared.CurrentStageName = current.currentStageName;
            tempApplicationListShared.CurrentStageNumber = current.currentStageNumber;

            tempApplicationListShared.NextStageName = current.nextStageName;
            tempApplicationListShared.NextStageNumber = current.nextStageNumber;
            tempApplicationListShared.PreviousStageName = current.previousStageName;
            tempApplicationListShared.PreviousStageNumber = current.previousStageNumber;
            tempApplicationListShared.DatePaid = current.datePaid;
            tempApplicationListShared.wbsrequired = current.wbsRequired;
            tempApplicationListShared.Coordinates = current.coordinates;
            if (current.projectNumber != null) {
              tempApplicationListShared.ProjectNumber = current.projectNumber;
            } else {
              tempApplicationListShared.ProjectNumber = (current.applicationID).toString();
            }

            tempApplicationListShared.isPlanning = current.isPlanning;
            tempApplicationListShared.permitStartDate = current.permitStartDate;

            tempApplicationListShared.ContractorAccountDetails = current.contractorAccountDetails; //zxNumberUpdate Sindiswa 01 March 2024

            this.applicationDataForView.push(tempApplicationListShared);
            console.log("this.applicationDataForViewthis.applicationDataForViewthis.applicationDataForView", this.applicationDataForView);
            this.Applications.push(tempApplicationList);
          }
          /*Cehcing the escaltion date*/
          this.configService.getConfigsByConfigName("EscalationDate").subscribe((data: any) => {

            if (data.responseCode == 1) {

              const current = data.dateSet[0];
              console.log("currentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrent", current);
              this.viewEscalateDate = current.configDescription;
              if (this.Applications[i].TestApplicationAge >= Number(this.viewEscalateDate)) {
                this.escalateBtn = true;
              }

            }
            else {
              alert("Error");
            }

            console.log("response", data);
          }, error => {
            console.log("Error", error);
          })
        }
        this.changeDetectorRef.detectChanges();
        this.dataSource = this.Applications.filter(df => df.DateCreatedFull);
        /*this.applicationsTable?.renderRows();*/
        //for card filters

        this.recentUnpaidCount();
        this.recentDistributedCount();
        this.recentApprovedCount();
        this.recentejectedCount();
        this.recentWIPCount();
        this.isTableLoading = false;
        console.log("Got all applications", data.dateSet);
      }
      else {
        alert(data.responseMessage);
      }

    })
  }
  getApplicationsForPermitIssuer() {
    this.applicationDataForView = [];
    this.Applications = [];
    this.isTableLoading = true;
    this.Applications.splice(0, this.Applications.length);
    this.applicationService.getApplicationsForPermitIssuer(this.CurrentUserProfile[0].zoneID, this.CurrentUser.appUserId).subscribe((data: any) => {


      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempApplicationList = {} as ApplicationsList;
          const tempApplicationListShared = {} as ApplicationList;
          const current = data.dateSet[i];
          //JJS-15-02-2024 Fixing the delete drafts (wasn't deleting)-->
          const isDuplicate = this.Applications.some(app => app.ApplicationID === current.applicationID);


          if (!isDuplicate) {


            console.log("current", current)
            tempApplicationList.ApplicationID = current.applicationID;
            tempApplicationList.FullName = current.fullName;
            tempApplicationList.TypeOfApplication = current.typeOfApplication;
            tempApplicationList.CurrentStage = current.currentStageName;
            tempApplicationList.ApplicationStatus = current.applicationStatus;
            tempApplicationList.isEscalated = current.isEscalated; //escalation Sindiswa 29 January 2024

            tempApplicationList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
            tempApplicationListShared.CurrentStageStartDate = current.currentStageStartDate.substring(0, current.dateCreated.indexOf('T'));

            /*cal application age*/

            const currentDate = new Date();
            const dateCreated = new Date(tempApplicationList.DateCreated);
            const timeDiff = currentDate.getTime() - dateCreated.getTime();
            const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
            tempApplicationList.TestApplicationAge = daysDiff;

            /*cal stage age*/
            const stageDateCreated = new Date(tempApplicationListShared.CurrentStageStartDate);
            const stageDate = currentDate.getTime() - stageDateCreated.getTime();
            const stageDateDiff = Math.floor(stageDate / (1000 * 3600 * 24));
            tempApplicationList.TestApplicationStageAge = stageDateDiff;
            console.log("WheknfnfetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAge", tempApplicationList.TestApplicationStageAge);



            if (current.projectNumber != null) {
              tempApplicationList.ProjectNumber = current.projectNumber;
            } else {
              tempApplicationList.ProjectNumber = (current.applicationID).toString();
            }


            /*            do {
                          tempApplicationList.TestApplicationStageAge = Math.floor(Math.random() * 30) + 1;
                        } while (tempApplicationList.TestApplicationStageAge > tempApplicationList.TestApplicationAge);*/
            //save here to send to the shared

            //tempApplicationListShared.applicationID = current. ;
            tempApplicationListShared.applicationID = current.applicationID;
            tempApplicationListShared.clientName = current.fullName;
            tempApplicationListShared.clientEmail = current.email;
            tempApplicationListShared.clientAlternativeEmail = current.alternativeEmail; //checkingNotifications Sindiswa 15 February 2024
            tempApplicationListShared.clientAddress = current.physicalAddress;
            tempApplicationListShared.clientRefNo = current.referenceNumber;
            tempApplicationListShared.CompanyRegNo = current.companyRegNo;
            tempApplicationListShared.TypeOfApplication = current.typeOfApplication;
            tempApplicationListShared.NotificationNumber = current.notificationNumber;
            tempApplicationListShared.WBSNumber = current.wbsNumber;
            tempApplicationListShared.PhysicalAddressOfProject = current.physicalAddressOfProject;
            tempApplicationListShared.DescriptionOfProject = current.descriptionOfProject;
            tempApplicationListShared.NatureOfWork = current.natureOfWork;
            tempApplicationListShared.ExcavationType = current.excavationType;
            tempApplicationListShared.ExpectedStartDate = current.expectedStartDate;
            tempApplicationListShared.ExpectedEndDate = current.expectedEndDate;
            tempApplicationListShared.Location = current.location;
            tempApplicationListShared.clientCellNo = current.phoneNumber;
            tempApplicationListShared.CreatedById = current.createdById;
            tempApplicationListShared.UserID = current.userID;//
            tempApplicationListShared.ApplicationStatus = current.applicationStatus;
            tempApplicationListShared.CurrentStageName = current.currentStageName;
            tempApplicationListShared.CurrentStageNumber = current.currentStageNumber;

            tempApplicationListShared.NextStageName = current.nextStageName;
            tempApplicationListShared.NextStageNumber = current.nextStageNumber;
            tempApplicationListShared.PreviousStageName = current.previousStageName;
            tempApplicationListShared.PreviousStageNumber = current.previousStageNumber;
            tempApplicationListShared.DatePaid = current.datePaid;
            tempApplicationListShared.wbsrequired = current.wbsRequired;
            tempApplicationListShared.Coordinates = current.coordinates;
            if (current.projectNumber != null) {
              tempApplicationListShared.ProjectNumber = current.projectNumber;
            } else {
              tempApplicationListShared.ProjectNumber = (current.applicationID).toString();
            }

            tempApplicationListShared.isPlanning = current.isPlanning;
            tempApplicationListShared.permitStartDate = current.permitStartDate;

            tempApplicationListShared.ContractorAccountDetails = current.contractorAccountDetails; //zxNumberUpdate Sindiswa 01 March 2024

            this.applicationDataForView.push(tempApplicationListShared);
            console.log("this.applicationDataForViewthis.applicationDataForViewthis.applicationDataForView", this.applicationDataForView);
            this.Applications.push(tempApplicationList);
          }
          /*Cehcing the escaltion date*/
          this.configService.getConfigsByConfigName("EscalationDate").subscribe((data: any) => {

            if (data.responseCode == 1) {

              const current = data.dateSet[0];
              console.log("currentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrent", current);
              this.viewEscalateDate = current.configDescription;
              if (this.Applications[i].TestApplicationAge >= Number(this.viewEscalateDate)) {
                this.escalateBtn = true;
              }

            }
            else {
              alert("Error");
            }

            console.log("response", data);
          }, error => {
            console.log("Error", error);
          })
        }
        this.changeDetectorRef.detectChanges();
        this.dataSource = this.Applications.filter(df => df.DateCreatedFull);
       /* this.applicationsTable?.renderRows();*/
        //for card filters

        this.recentUnpaidCount();
        this.recentDistributedCount();
        this.recentApprovedCount();
        this.recentejectedCount();
        this.recentWIPCount();
        this.isTableLoading = false;
        console.log("Got all applications", data.dateSet);
      }
      else {
        alert(data.responseMessage);
      }

    })
  }
  getApplicationsForGISReviewer() {
    this.applicationDataForView = [];
    this.Applications = [];
    this.isTableLoading = true;
    this.Applications.splice(0, this.Applications.length);
    this.applicationService.getApplicationsForGISReviewer(this.CurrentUserProfile[0].zoneID, this.CurrentUser.appUserId).subscribe((data: any) => {


      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempApplicationList = {} as ApplicationsList;
          const tempApplicationListShared = {} as ApplicationList;
          const current = data.dateSet[i];
          //JJS-15-02-2024 Fixing the delete drafts (wasn't deleting)-->
          const isDuplicate = this.Applications.some(app => app.ApplicationID === current.applicationID);


          if (!isDuplicate) {


            console.log("current", current)
            tempApplicationList.ApplicationID = current.applicationID;
            tempApplicationList.FullName = current.fullName;
            tempApplicationList.TypeOfApplication = current.typeOfApplication;
            tempApplicationList.CurrentStage = current.currentStageName;
            tempApplicationList.ApplicationStatus = current.applicationStatus;
            tempApplicationList.isEscalated = current.isEscalated; //escalation Sindiswa 29 January 2024

            tempApplicationList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
            tempApplicationListShared.CurrentStageStartDate = current.currentStageStartDate.substring(0, current.dateCreated.indexOf('T'));

            /*cal application age*/

            const currentDate = new Date();
            const dateCreated = new Date(tempApplicationList.DateCreated);
            const timeDiff = currentDate.getTime() - dateCreated.getTime();
            const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
            tempApplicationList.TestApplicationAge = daysDiff;

            /*cal stage age*/
            const stageDateCreated = new Date(tempApplicationListShared.CurrentStageStartDate);
            const stageDate = currentDate.getTime() - stageDateCreated.getTime();
            const stageDateDiff = Math.floor(stageDate / (1000 * 3600 * 24));
            tempApplicationList.TestApplicationStageAge = stageDateDiff;
            console.log("WheknfnfetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAge", tempApplicationList.TestApplicationStageAge);



            if (current.projectNumber != null) {
              tempApplicationList.ProjectNumber = current.projectNumber;
            } else {
              tempApplicationList.ProjectNumber = (current.applicationID).toString();
            }


            /*            do {
                          tempApplicationList.TestApplicationStageAge = Math.floor(Math.random() * 30) + 1;
                        } while (tempApplicationList.TestApplicationStageAge > tempApplicationList.TestApplicationAge);*/
            //save here to send to the shared

            //tempApplicationListShared.applicationID = current. ;
            tempApplicationListShared.applicationID = current.applicationID;
            tempApplicationListShared.clientName = current.fullName;
            tempApplicationListShared.clientEmail = current.email;
            tempApplicationListShared.clientAlternativeEmail = current.alternativeEmail; //checkingNotifications Sindiswa 15 February 2024
            tempApplicationListShared.clientAddress = current.physicalAddress;
            tempApplicationListShared.clientRefNo = current.referenceNumber;
            tempApplicationListShared.CompanyRegNo = current.companyRegNo;
            tempApplicationListShared.TypeOfApplication = current.typeOfApplication;
            tempApplicationListShared.NotificationNumber = current.notificationNumber;
            tempApplicationListShared.WBSNumber = current.wbsNumber;
            tempApplicationListShared.PhysicalAddressOfProject = current.physicalAddressOfProject;
            tempApplicationListShared.DescriptionOfProject = current.descriptionOfProject;
            tempApplicationListShared.NatureOfWork = current.natureOfWork;
            tempApplicationListShared.ExcavationType = current.excavationType;
            tempApplicationListShared.ExpectedStartDate = current.expectedStartDate;
            tempApplicationListShared.ExpectedEndDate = current.expectedEndDate;
            tempApplicationListShared.Location = current.location;
            tempApplicationListShared.clientCellNo = current.phoneNumber;
            tempApplicationListShared.CreatedById = current.createdById;
            tempApplicationListShared.UserID = current.userID;//
            tempApplicationListShared.ApplicationStatus = current.applicationStatus;
            tempApplicationListShared.CurrentStageName = current.currentStageName;
            tempApplicationListShared.CurrentStageNumber = current.currentStageNumber;

            tempApplicationListShared.NextStageName = current.nextStageName;
            tempApplicationListShared.NextStageNumber = current.nextStageNumber;
            tempApplicationListShared.PreviousStageName = current.previousStageName;
            tempApplicationListShared.PreviousStageNumber = current.previousStageNumber;
            tempApplicationListShared.DatePaid = current.datePaid;
            tempApplicationListShared.wbsrequired = current.wbsRequired;
            tempApplicationListShared.Coordinates = current.coordinates;
            if (current.projectNumber != null) {
              tempApplicationListShared.ProjectNumber = current.projectNumber;
            } else {
              tempApplicationListShared.ProjectNumber = (current.applicationID).toString();
            }

            tempApplicationListShared.isPlanning = current.isPlanning;
            tempApplicationListShared.permitStartDate = current.permitStartDate;

            tempApplicationListShared.ContractorAccountDetails = current.contractorAccountDetails; //zxNumberUpdate Sindiswa 01 March 2024

            this.applicationDataForView.push(tempApplicationListShared);
            console.log("this.applicationDataForViewthis.applicationDataForViewthis.applicationDataForView", this.applicationDataForView);
            this.Applications.push(tempApplicationList);
          }
          /*Cehcing the escaltion date*/
          this.configService.getConfigsByConfigName("EscalationDate").subscribe((data: any) => {

            if (data.responseCode == 1) {

              const current = data.dateSet[0];
              console.log("currentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrent", current);
              this.viewEscalateDate = current.configDescription;
              if (this.Applications[i].TestApplicationAge >= Number(this.viewEscalateDate)) {
                this.escalateBtn = true;
              }

            }
            else {
              alert("Error");
            }

            console.log("response", data);
          }, error => {
            console.log("Error", error);
          })
        }
        this.changeDetectorRef.detectChanges();
        this.dataSource = this.Applications.filter(df => df.DateCreatedFull);
        /*this.applicationsTable?.renderRows();*/
        //for card filters

        this.recentUnpaidCount();
        this.recentDistributedCount();
        this.recentApprovedCount();
        this.recentejectedCount();
        this.recentWIPCount();
        this.isTableLoading = false;
        console.log("Got all applications", data.dateSet);
      }
      else {
        alert(data.responseMessage);
      }

    })
  }
  getApplicationsForEMB() {
    this.applicationDataForView = [];
    this.Applications = [];
    this.isTableLoading = true;
    this.Applications.splice(0, this.Applications.length);
    this.applicationService.getApplicationsForEMB(this.CurrentUser.appUserId).subscribe((data: any) => {


      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempApplicationList = {} as ApplicationsList;
          const tempApplicationListShared = {} as ApplicationList;
          const current = data.dateSet[i];
          //JJS-15-02-2024 Fixing the delete drafts (wasn't deleting)-->
          const isDuplicate = this.Applications.some(app => app.ApplicationID === current.applicationID);


          if (!isDuplicate) {


            console.log("current", current)
            tempApplicationList.ApplicationID = current.applicationID;
            tempApplicationList.FullName = current.fullName;
            tempApplicationList.TypeOfApplication = current.typeOfApplication;
            tempApplicationList.CurrentStage = current.currentStageName;
            tempApplicationList.ApplicationStatus = current.applicationStatus;
            tempApplicationList.isEscalated = current.isEscalated; //escalation Sindiswa 29 January 2024

            tempApplicationList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
            tempApplicationListShared.CurrentStageStartDate = current.currentStageStartDate.substring(0, current.dateCreated.indexOf('T'));

            /*cal application age*/

            const currentDate = new Date();
            const dateCreated = new Date(tempApplicationList.DateCreated);
            const timeDiff = currentDate.getTime() - dateCreated.getTime();
            const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
            tempApplicationList.TestApplicationAge = daysDiff;

            /*cal stage age*/
            const stageDateCreated = new Date(tempApplicationListShared.CurrentStageStartDate);
            const stageDate = currentDate.getTime() - stageDateCreated.getTime();
            const stageDateDiff = Math.floor(stageDate / (1000 * 3600 * 24));
            tempApplicationList.TestApplicationStageAge = stageDateDiff;
            console.log("WheknfnfetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAge", tempApplicationList.TestApplicationStageAge);



            if (current.projectNumber != null) {
              tempApplicationList.ProjectNumber = current.projectNumber;
            } else {
              tempApplicationList.ProjectNumber = (current.applicationID).toString();
            }


            /*            do {
                          tempApplicationList.TestApplicationStageAge = Math.floor(Math.random() * 30) + 1;
                        } while (tempApplicationList.TestApplicationStageAge > tempApplicationList.TestApplicationAge);*/
            //save here to send to the shared

            //tempApplicationListShared.applicationID = current. ;
            tempApplicationListShared.applicationID = current.applicationID;
            tempApplicationListShared.clientName = current.fullName;
            tempApplicationListShared.clientEmail = current.email;
            tempApplicationListShared.clientAlternativeEmail = current.alternativeEmail; //checkingNotifications Sindiswa 15 February 2024
            tempApplicationListShared.clientAddress = current.physicalAddress;
            tempApplicationListShared.clientRefNo = current.referenceNumber;
            tempApplicationListShared.CompanyRegNo = current.companyRegNo;
            tempApplicationListShared.TypeOfApplication = current.typeOfApplication;
            tempApplicationListShared.NotificationNumber = current.notificationNumber;
            tempApplicationListShared.WBSNumber = current.wbsNumber;
            tempApplicationListShared.PhysicalAddressOfProject = current.physicalAddressOfProject;
            tempApplicationListShared.DescriptionOfProject = current.descriptionOfProject;
            tempApplicationListShared.NatureOfWork = current.natureOfWork;
            tempApplicationListShared.ExcavationType = current.excavationType;
            tempApplicationListShared.ExpectedStartDate = current.expectedStartDate;
            tempApplicationListShared.ExpectedEndDate = current.expectedEndDate;
            tempApplicationListShared.Location = current.location;
            tempApplicationListShared.clientCellNo = current.phoneNumber;
            tempApplicationListShared.CreatedById = current.createdById;
            tempApplicationListShared.UserID = current.userID;//
            tempApplicationListShared.ApplicationStatus = current.applicationStatus;
            tempApplicationListShared.CurrentStageName = current.currentStageName;
            tempApplicationListShared.CurrentStageNumber = current.currentStageNumber;

            tempApplicationListShared.NextStageName = current.nextStageName;
            tempApplicationListShared.NextStageNumber = current.nextStageNumber;
            tempApplicationListShared.PreviousStageName = current.previousStageName;
            tempApplicationListShared.PreviousStageNumber = current.previousStageNumber;
            tempApplicationListShared.DatePaid = current.datePaid;
            tempApplicationListShared.wbsrequired = current.wbsRequired;
            tempApplicationListShared.Coordinates = current.coordinates;
            if (current.projectNumber != null) {
              tempApplicationListShared.ProjectNumber = current.projectNumber;
            } else {
              tempApplicationListShared.ProjectNumber = (current.applicationID).toString();
            }

            tempApplicationListShared.isPlanning = current.isPlanning;
            tempApplicationListShared.permitStartDate = current.permitStartDate;

            tempApplicationListShared.ContractorAccountDetails = current.contractorAccountDetails; //zxNumberUpdate Sindiswa 01 March 2024

            this.applicationDataForView.push(tempApplicationListShared);
            console.log("this.applicationDataForViewthis.applicationDataForViewthis.applicationDataForView", this.applicationDataForView);
            this.Applications.push(tempApplicationList);
          }
          /*Cehcing the escaltion date*/
          this.configService.getConfigsByConfigName("EscalationDate").subscribe((data: any) => {

            if (data.responseCode == 1) {

              const current = data.dateSet[0];
              console.log("currentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrent", current);
              this.viewEscalateDate = current.configDescription;
              if (this.Applications[i].TestApplicationAge >= Number(this.viewEscalateDate)) {
                this.escalateBtn = true;
              }

            }
            else {
              alert("Error");
            }

            console.log("response", data);
          }, error => {
            console.log("Error", error);
          })
        }
        this.changeDetectorRef.detectChanges();
        this.dataSource = this.Applications.filter(df => df.DateCreated);
        /*this.applicationsTable?.renderRows();*/
        //for card filters

        this.recentUnpaidCount();
        this.recentDistributedCount();
        this.recentApprovedCount();
        this.recentejectedCount();
        this.recentWIPCount();
        this.isTableLoading = false;
        console.log("Got all applications", data.dateSet);
      }
      else {
        alert(data.responseMessage);
      }

    })
  }


  //onFilterApplicationsFprMyApplications() {
  //  this.applicationDataForView = [];
  //  this.Applications = [];
  //  this.isTableLoading = true;
  //  this.onFilterButtonClick();
  //  this.notNyProjects = false;
  //  this.pastAndCurrentReviews = false;
  //  this.MyProjects = true;

  //  this.FiterValue = "";
  //  this.FiterValue = "Your Applications";
  //  this.cardFilters = false;
  //  this.applicationDataForView = [];
  //  this.Applications = [];
  //  /*    this.getAllApplicationsByUserID();*/

  //  this.applicationService.getApplicationsList(this.CurrentUser.appUserId, false).subscribe((data: any) => {


  //    if (data.responseCode == 1) {


  //      for (let i = 0; i < data.dateSet.length; i++) {
  //        const tempApplicationList = {} as ApplicationsList;
  //        const tempApplicationListShared = {} as ApplicationList;
  //        const current = data.dateSet[i];





  //        console.log("current", current)
  //        tempApplicationList.ApplicationID = current.applicationID;
  //        tempApplicationList.FullName = current.fullName;
  //        tempApplicationList.TypeOfApplication = current.typeOfApplication;
  //        tempApplicationList.CurrentStage = current.currentStageName;
  //        tempApplicationList.ApplicationStatus = current.applicationStatus;
  //        tempApplicationList.isEscalated = current.isEscalated; //escalation Sindiswa 29 January 2024

  //        tempApplicationList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
  //        tempApplicationListShared.CurrentStageStartDate = current.currentStageStartDate.substring(0, current.dateCreated.indexOf('T'));

  //        /*cal application age*/

  //        const currentDate = new Date();
  //        const dateCreated = new Date(tempApplicationList.DateCreated);
  //        const timeDiff = currentDate.getTime() - dateCreated.getTime();
  //        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  //        tempApplicationList.TestApplicationAge = daysDiff;

  //        /*cal stage age*/
  //        const stageDateCreated = new Date(tempApplicationListShared.CurrentStageStartDate);
  //        const stageDate = currentDate.getTime() - stageDateCreated.getTime();
  //        const stageDateDiff = Math.floor(stageDate / (1000 * 3600 * 24));
  //        tempApplicationList.TestApplicationStageAge = stageDateDiff;
  //        console.log("WheknfnfetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAgetempApplicationList.TestApplicationStageAge", tempApplicationList.TestApplicationStageAge);



  //        if (current.projectNumber != null) {
  //          tempApplicationList.ProjectNumber = current.projectNumber;
  //        } else {
  //          tempApplicationList.ProjectNumber = (current.applicationID).toString();
  //        }


  //        /*            do {
  //                      tempApplicationList.TestApplicationStageAge = Math.floor(Math.random() * 30) + 1;
  //                    } while (tempApplicationList.TestApplicationStageAge > tempApplicationList.TestApplicationAge);*/
  //        //save here to send to the shared

  //        //tempApplicationListShared.applicationID = current. ;
  //        tempApplicationListShared.applicationID = current.applicationID;
  //        tempApplicationListShared.clientName = current.fullName;
  //        tempApplicationListShared.clientEmail = current.email;
  //        tempApplicationListShared.clientAlternativeEmail = current.alternativeEmail; //checkingNotifications Sindiswa 15 February 2024
  //        tempApplicationListShared.clientAddress = current.physicalAddress;
  //        tempApplicationListShared.clientRefNo = current.referenceNumber;
  //        tempApplicationListShared.CompanyRegNo = current.companyRegNo;
  //        tempApplicationListShared.TypeOfApplication = current.typeOfApplication;
  //        tempApplicationListShared.NotificationNumber = current.notificationNumber;
  //        tempApplicationListShared.WBSNumber = current.wbsNumber;
  //        tempApplicationListShared.PhysicalAddressOfProject = current.physicalAddressOfProject;
  //        tempApplicationListShared.DescriptionOfProject = current.descriptionOfProject;
  //        tempApplicationListShared.NatureOfWork = current.natureOfWork;
  //        tempApplicationListShared.ExcavationType = current.excavationType;
  //        tempApplicationListShared.ExpectedStartDate = current.expectedStartDate;
  //        tempApplicationListShared.ExpectedEndDate = current.expectedEndDate;
  //        tempApplicationListShared.Location = current.location;
  //        tempApplicationListShared.clientCellNo = current.phoneNumber;
  //        tempApplicationListShared.CreatedById = current.createdById;
  //        tempApplicationListShared.UserID = current.userID;//
  //        tempApplicationListShared.ApplicationStatus = current.applicationStatus;
  //        tempApplicationListShared.CurrentStageName = current.currentStageName;
  //        tempApplicationListShared.CurrentStageNumber = current.currentStageNumber;

  //        tempApplicationListShared.ContractorAccountDetails = current.contractorAccountDetails; //zxNumberUpdate Sindiswa 01 March 2024
  //        tempApplicationListShared.NextStageName = current.nextStageName;
  //        tempApplicationListShared.NextStageNumber = current.nextStageNumber;
  //        tempApplicationListShared.PreviousStageName = current.previousStageName;
  //        tempApplicationListShared.PreviousStageNumber = current.previousStageNumber;
  //        tempApplicationListShared.DatePaid = current.datePaid;
  //        tempApplicationListShared.wbsrequired = current.wbsRequired;
  //        tempApplicationListShared.Coordinates = current.coordinates;
  //        if (current.projectNumber != null) {
  //          tempApplicationListShared.ProjectNumber = current.projectNumber;
  //        } else {
  //          tempApplicationListShared.ProjectNumber = (current.applicationID).toString();
  //        }

  //        tempApplicationListShared.isPlanning = current.isPlanning;
  //        tempApplicationListShared.permitStartDate = current.permitStartDate;


  //        //#region escalation Sindiswa 31 January 2024
  //        tempApplicationList.isEscalated = current.isEscalated;
  //        tempApplicationList.EscalationDate = current.escalationDate;
  //        tempApplicationList.EMBActionDate = current.embActionDate;
  //        //#endregion

  //        if (current.networkLicenses == true) {
  //          tempApplicationListShared.NetworkLicensees = "Fibre Network Licensees have been contacted regarding trench sharing and existing services";
  //        }
  //        else {
  //          tempApplicationListShared.NetworkLicensees = " ";
  //        }
  //        this.applicationDataForView.push(tempApplicationListShared);
  //        console.log("this.applicationDataForViewthis.applicationDataForViewthis.applicationDataForView", this.applicationDataForView);
  //        this.Applications.push(tempApplicationList);
  //        /*Cehcing the escaltion date*/
  //        this.configService.getConfigsByConfigName("EscalationDate").subscribe((data: any) => {

  //          if (data.responseCode == 1) {

  //            const current = data.dateSet[0];
  //            console.log("currentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrentcurrent", current);
  //            this.viewEscalateDate = current.configDescription;
  //            if (this.Applications[i].TestApplicationAge >= Number(this.viewEscalateDate)) {
  //              this.escalateBtn = true;
  //            }

  //          }
  //          else {
  //            alert("Error");
  //          }

  //          console.log("response", data);
  //        }, error => {
  //          console.log("Error", error);
  //        })
  //      }
  //      this.dataSource = this.Applications.filter(df => df.FullName == this.CurrentUser.fullName);
  //      this.applicationsTable?.renderRows();
  //      //for card filters
  //      /* this.select = "option3";*/
  //      this.recentUnpaidCount();
  //      this.recentDistributedCount();
  //      this.recentApprovedCount();
  //      this.recentejectedCount();
  //      this.recentWIPCount();
  //      this.isTableLoading = false;
  //      console.log("Got all applications", data.dateSet);
  //    }
  //    else {
  //      alert(data.responseMessage);
  //    }

  //  })
  //}

  ApplicationBeginCreatedType: string;
  GoToBuildingApplication(isPlanArchive, CreateApplicationType: any, isWayleave) {
    debugger;
    if (CreateApplicationType == "ls") {
      this.ApplicationBeginCreatedType = "Land Survey";
    }
    else if (CreateApplicationType == "tp") {
      this.ApplicationBeginCreatedType = "Town Planning";
    }
    else if (CreateApplicationType == "bp") {
      this.ApplicationBeginCreatedType = "Building Plans";
    }
    else {

    }
    this.isWayleave = isWayleave;
    debugger;
    this.sharedService.setApplicationBeingCreatedType(this.ApplicationBeginCreatedType);
    this.isArchivePlan = isPlanArchive;

    if (this.isArchitect == false || this.isArchitect == null && this.CurrentUserProfile[0].isInternal == true) {
     
      this.openClientOption(this.clientOption);
    }

    else if (this.CurrentUserProfile[0].isInternal == true) {
      this.openClientOption(this.clientOption);
    }
    else {
      this.onCreateBuildingApplication();

      this.sharedService.External = true;
    }


  }

      getAllArchitectsForUser() {

    this.ArchitectsList.splice(0, this.ArchitectsList.length);
    this.UserlinkToArchitectService.getArchitectsForUser(this.CurrentUser.appUserId).subscribe((data: any) => {
      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempArchitectList = {} as ArchitectsList;
          const current = data.dateSet[i];

          tempArchitectList.ArchitectName = current.architectName;
          tempArchitectList.ArchitectUserId = current.architectUserID;

          this.ArchitectsList.push(tempArchitectList);
        }


        this.architectTable.renderRows();
        this.modalService.open(this.architect, {
          centered: true,
          size: 'xl',
          backdrop: 'static', // Prevent clicking outside the modal to close it
          keyboard: false // Prevent pressing the ESC key to close the modal
        });
      }
      else {
        alert(data.responseMessage)
      }
    }, error => {
      console.log("Error: ", error)
    })
  }

  isWayleave: boolean;
    onCreateBuildingApplication() {
      if (this.isWayleave) {
        this.createWayleave(false, false);
      }
      else {
        /* NEEDED FOR FILE UPLOAD TO WORK CORRECTLY*/
        this.bpApplicationService.addUpdateBuildingApplication(0, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, this.CurrentUser.appUserId, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null).subscribe((data: any) => {
          if (data.responseCode == 1) {

            const current = data.dateSet;
            this.bpApplicationId = current.applicationID;

            this.sharedService.applicationID = this.bpApplicationId;
            this.sharedService.isPlanArchive = this.isArchivePlan;
            this.router.navigate(['/building-application']);
          }
          else {
            alert(data.responseMessage)
          }
        }, error => {
          console.log("BuildingApplicationError: ", error)
        })
      }
  }
  GetAllPreInvoiceScrutinyApplications() {
    
    this.ApplicationsBP.splice(0, this.ApplicationsBP.length);
    this.bpApplicationService.getAllLSApplications().subscribe((data: any) => {
      if (data.responseCode == 1) {
        
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempApplication = {} as ApplicationsListBP;
          const current = data.dateSet[i];
          
          if (current.lsNumber != null) {
            if (current.physicalAddress == undefined) {
              tempApplication.propertyAddress = current.physicalAddress;
            }
            else {
              
              var address = current.physicalAddress.split(',');
              tempApplication.propertyAddress = address[0] + " " + address[1];
            }
            
            tempApplication.applicationID = current.applicationID;
            tempApplication.ProjectNumber = current.lsNumber;
            tempApplication.erfNumber = current.erfNumber;
            tempApplication.stage = current.stage;
            tempApplication.ownerName = current.firstName + " " + current.surname;

            tempApplication.dateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
            tempApplication.dateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));
            const currentDate = new Date();
            const dateCreated = new Date(tempApplication.dateCreated);
            const timeDiff = currentDate.getTime() - dateCreated.getTime();
            const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
            tempApplication.planAge = daysDiff;
            tempApplication.bpApplicationType = current.bpApplicationType;
            /*cal stage age*/
            const stageDateCreated = new Date(tempApplication.dateCreated);
            const stageDate = currentDate.getTime() - stageDateCreated.getTime();
            const stageDateDiff = Math.floor(stageDate / (1000 * 3600 * 24));
            tempApplication.stageAge = stageDateDiff;
            tempApplication.status = current.status;
            tempApplication.justForFilteringByDate = current.dateCreated;
            this.ApplicationsBP.push(tempApplication);
          }


         

        }
        this.dataSourceBP = this.ApplicationsBP.sort((a, b) => new Date(b.justForFilteringByDate).getTime() - new Date(a.justForFilteringByDate).getTime());;

        this.applicationTypeName = "Build Plan";
        this.dataSourceSA = this.ApplicationsBP.sort((a, b) => new Date(b.justForFilteringByDate).getTime() - new Date(a.justForFilteringByDate).getTime());
        this.originalDataSourceSA = [...this.ApplicationsBP];
      }
      else {
        alert(data.responseMessage);
      }
      console.log("Pre-scrutiny Applications", this.dataSourceBP);
      console.log("Pre-scrutiny Applications", data);
    }, error => {
      console.log("Error: ", error);
    })
  }



  GetAllBuildingPlansApplications() {
    this.AllBPApplications.splice(0, this.AllBPApplications.length);
    
    this.bpApplicationService.getAllBuildingPlansApplications().subscribe((data: any) => {
      if (data.responseCode == 1) {
        
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempApplication = {} as ApplicationsListBP;
          const current = data.dateSet[i];
          

            if (current.physicalAddress == undefined) {
              tempApplication.propertyAddress = current.physicalAddress;
            }
            else {
              
              var address = current.physicalAddress.split(',');
              tempApplication.propertyAddress = address[0] + " " + address[1];
            }
            
            tempApplication.applicationID = current.applicationID;
            tempApplication.ProjectNumber = current.lsNumber;
            tempApplication.erfNumber = current.erfNumber;
            tempApplication.stage = current.stage;
            tempApplication.ownerName = current.firstName + " " + current.surname;

            tempApplication.dateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
            tempApplication.dateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));
            const currentDate = new Date();
            const dateCreated = new Date(tempApplication.dateCreated);
            const timeDiff = currentDate.getTime() - dateCreated.getTime();
            const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
            tempApplication.planAge = daysDiff;
          tempApplication.bpApplicationType = current.bpApplicationType;
            /*cal stage age*/
            const stageDateCreated = new Date(tempApplication.dateCreated);
            const stageDate = currentDate.getTime() - stageDateCreated.getTime();
            const stageDateDiff = Math.floor(stageDate / (1000 * 3600 * 24));
            tempApplication.stageAge = stageDateDiff;
          tempApplication.status = current.status;
          tempApplication.justForFilteringByDate = current.dateCreated;
            tempApplication.BPApplicationID = current.bpApplicationID;
            this.AllBPApplications.push(tempApplication);
          }




        
        this.dataSourceBP = this.AllBPApplications.sort((a, b) => new Date(b.justForFilteringByDate).getTime() - new Date(a.justForFilteringByDate).getTime());

        this.applicationTypeName = "Build Plan";
        this.dataSourceSA = this.AllBPApplications.sort((a, b) => new Date(b.justForFilteringByDate).getTime() - new Date(a.justForFilteringByDate).getTime());
        this.originalDataSourceSA = [...this.AllBPApplications];
      }
      else {
        alert(data.responseMessage);
      }
      console.log("Building Applications", this.dataSourceBP);
      console.log("Building Applications", data);
    }, error => {
      console.log("Error: ", error);
    })
  }

  GetAllTownPlanningApplications() {
    this.AllTownPlanningApplications.splice(0, this.AllTownPlanningApplications.length);

    this.bpApplicationService.getAllTPApplications().subscribe((data: any) => {
      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempApplication = {} as ApplicationsListBP;
          const current = data.dateSet[i];
          debugger;




            if (current.physicalAddress == undefined) {
              tempApplication.propertyAddress = current.physicalAddress;
            }
            else {

              var address = current.physicalAddress.split(',');
              tempApplication.propertyAddress = address[0] + " " + address[1];
            }

            tempApplication.applicationID = current.applicationID;
            tempApplication.ProjectNumber = current.lsNumber;
            tempApplication.erfNumber = current.erfNumber;
            tempApplication.stage = current.stage;
            tempApplication.ownerName = current.firstName + " " + current.surname;

            tempApplication.dateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
            tempApplication.dateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));
            const currentDate = new Date();
            const dateCreated = new Date(tempApplication.dateCreated);
            const timeDiff = currentDate.getTime() - dateCreated.getTime();
            const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
            tempApplication.planAge = daysDiff;

            /*cal stage age*/
            const stageDateCreated = new Date(tempApplication.dateCreated);
            const stageDate = currentDate.getTime() - stageDateCreated.getTime();
            const stageDateDiff = Math.floor(stageDate / (1000 * 3600 * 24));
            tempApplication.stageAge = stageDateDiff;
          tempApplication.status = current.status;
          tempApplication.bpApplicationType = current.bpApplicationType;
          tempApplication.justForFilteringByDate = current.dateCreated;
          this.AllTownPlanningApplications.push(tempApplication);
          }





        this.dataSourceBP = this.AllTownPlanningApplications.sort((a, b) => new Date(b.justForFilteringByDate).getTime() - new Date(a.justForFilteringByDate).getTime());

        this.applicationTypeName = "Town Planning";
        this.dataSourceSA = this.AllTownPlanningApplications.sort((a, b) => new Date(b.justForFilteringByDate).getTime() - new Date(a.justForFilteringByDate).getTime());
        this.originalDataSourceSA = [...this.AllTownPlanningApplications];
        
      }
      else {
        alert(data.responseMessage);
      }
      console.log("Town Planning Applications", this.dataSourceBP);
      console.log("Town Planning Applications", data);
    }, error => {
      console.log("Error: ", error);
    })
  }


  GetAllApplications() {
    this.AllApplications.splice(0, this.AllApplications.length);
    debugger;
    this.bpApplicationService.getAllApplications().subscribe((data: any) => {
      if (data.responseCode == 1) {
        debugger;
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempApplication = {} as ApplicationsListBP;
          const current = data.dateSet[i];
          debugger;

            if (current.physicalAddress == undefined) {
              tempApplication.propertyAddress = current.physicalAddress;
            }
            else {
              debugger;
              var address = current.physicalAddress.split(',');
              tempApplication.propertyAddress = address[0] + " " + address[1];
            }
          if (current.bpApplicationID != null) {
            tempApplication.ProjectNumber = current.bpApplicationID;
          }
          else{
            tempApplication.ProjectNumber = current.lsNumber;
          }
            tempApplication.applicationID = current.applicationID;

            tempApplication.erfNumber = current.erfNumber;
            tempApplication.stage = current.stage;
            tempApplication.ownerName = current.firstName + " " + current.surname;
          debugger;
            tempApplication.dateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
            tempApplication.dateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));
            const currentDate = new Date();
            const dateCreated2 = new Date(tempApplication.dateCreated);
            const timeDiff = currentDate.getTime() - dateCreated2.getTime();
            const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
            tempApplication.planAge = daysDiff;
          tempApplication.bpApplicationType = current.bpApplicationType;
            /*cal stage age*/
            const stageDateCreated = new Date(tempApplication.dateCreated);
            const stageDate = currentDate.getTime() - stageDateCreated.getTime();
            const stageDateDiff = Math.floor(stageDate / (1000 * 3600 * 24));
            tempApplication.stageAge = stageDateDiff;
          tempApplication.status = current.status;
          tempApplication.justForFilteringByDate = current.dateCreated;
            this.AllApplications.push(tempApplication);
          }

        this.dataSourceBP = this.AllApplications;
        this.dataSourceSA = this.AllApplications;

        this.isLoading = false;
        
       
      }
      else {
        alert(data.responseMessage);
      }
      console.log("Building Applications", this.dataSourceBP);
      console.log("Building Applications", data);
    }, error => {
      console.log("Error: ", error);
    })
  }

  getAllClientsForArchitect() {

    this.ArchitectClients.splice(0, this.ArchitectClients.length);
    this.UserlinkToArchitectService.getAllClientsForArchitect(this.CurrentUser.appUserId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempUserList = {} as ArchitectClients;
          const current = data.dateSet[i];

          tempUserList.ArchitectName = current.architectName;
          tempUserList.ArchitectUserId = current.architectUserID;
          tempUserList.ClientAddress = current.address;
          tempUserList.ClientFullName = current.cLientFullName;
          tempUserList.ClientUserID = current.clientUserId;

          this.ArchitectClients.push(tempUserList);
        }


      }
      else {
        alert(data.responseMessage)
      }
    }, error => {
      console.log("Error: ", error)
    })
  }
  saveDisabled: boolean = true;
  SelectArchitect(index: any) {
    
    const UserID = this.ArchitectsList[index].ArchitectUserId;
    this.sharedService.setArchitectID(UserID);
    this.sharedService.architectUserID;
    this.saveDisabled = false;
  }

  GetAllApplicationsForExternalUser() {
    
    this.bpApplicationService.getApplicationsByExternalUserID(this.CurrentUser.appUserId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < 30; i++) {
          const tempApplication = {} as ApplicationsListBP;
          const current = data.dateSet[i];
          
          if (current.lsNumber != null) {
            if (current.physicalAddress == undefined) {
              tempApplication.propertyAddress = current.physicalAddress;
            }
            else {
              
              var address = current.physicalAddress.split(',');
              tempApplication.propertyAddress = address[0] + " " + address[1];
            }
            
            tempApplication.applicationID = current.applicationID;
            tempApplication.ProjectNumber = current.lsNumber;
            tempApplication.erfNumber = current.erfNumber;
            tempApplication.stage = current.stage;
            tempApplication.ownerName = current.firstName + " " + current.surname;

            tempApplication.dateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
            tempApplication.dateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));
            const currentDate = new Date();
            const dateCreated = new Date(tempApplication.dateCreated);
            const timeDiff = currentDate.getTime() - dateCreated.getTime();
            const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
            tempApplication.planAge = daysDiff;
            
            /*cal stage age*/
            const stageDateCreated = new Date(tempApplication.dateCreated);
            const stageDate = currentDate.getTime() - stageDateCreated.getTime();
            const stageDateDiff = Math.floor(stageDate / (1000 * 3600 * 24));
            tempApplication.stageAge = stageDateDiff;
            tempApplication.status = current.status;

            this.ApplicationsBP.push(tempApplication);
          }
        }
        this.applicationsTable.renderRows();
      }
      else {
        alert(data.responseMessage);
      }
      console.log("response", data);
    }, error => {
      console.log("Error: ", error);
    })
  }

  CheckArchitectLink() {

    if (this.exisitingArchitect) {
    
      for (let i = 0; i < this.ArchitectsList.length; i++) {
        const current = this.ArchitectsList[i];
       
        if (this.architectFullName == current.ArchitectName && this.architectUserId == current.ArchitectUserId) {
          this.linkedArchitect = true;
          alert("This architect is already listed under your architects");
          this.modalService.dismissAll();
        }
      }

      if (this.linkedArchitect == false) {
        
        this.UserlinkToArchitectService.addUpdateLinkedUser(0, this.architectUserId, this.architectFullName, this.CurrentUser.appUserId, this.CurrentUser.fullName, this.CurrentUser.appUserId, this.CurrentUserProfile[0].physicalAddress).subscribe((data: any) => {
          if (data.reponseCode == 1) {
            
            alert(data.responseMessage);
            this.getAllArchitectsForUser();
            this.modalService.dismissAll();
          }
          else {
            alert(data.responseMessage);
          }
          console.log("response", data);
        }, error => {
          console.log("Error: ", error);
        })
      }
    }
  }
  CheckForArchitectUser() {
    
    this.userPofileService.getAllArchitects().subscribe((data: any) => {
      
      if (data.responseCode == 1) {
        
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          
          if (this.architectFullName == current.fullName && this.architectEmail == current.email) {
            
            this.exisitingArchitect = true;
            this.architectUserId = current.userID;
            this.CheckArchitectLink();
          }

        }
      } else {
        alert(data.responseMessage);
      }
      console.log("response", data);
    }, error => {
      console.log("Error: ", error);
    })


  }
  ValidateArchitectInfo() {
    const nameRegex = /^[a-zA-Z]+$/;
    const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let name = this.architectFullName;
    let email = this.architectEmail;
    
    if (this.architectFullName == undefined || this.architectFullName.trim() == "" || this.architectEmail == undefined || this.architectEmail.trim() == "") {
      alert("Please enter architects and full name ");
    }
    else {
      
      const name = this.architectFullName.substring(0, this.architectFullName.indexOf(" "));
      const surname = this.architectFullName.substring(this.architectFullName.indexOf(" ") + 1);
      if (name.trim() == "" || surname.trim() == "") {
        alert("Please enter architects Name and surname");
      }
      else if (emailRegex.test(this.architectEmail) == false) {
        alert("Please enter a valid email address");
      }
      else {
        this.CheckForArchitectUser();
      }
    }

  }

  checkingClientLink() {
    
    for (let i = 0; i < this.ArchitectClients.length; i++) {
      
      const tempArchitectClient = this.ArchitectClients[i];
      if (this.clientFullName == tempArchitectClient.ClientFullName && this.CurrentUser.fullName == tempArchitectClient.ArchitectName) {
        
        this.linkedClient = true;
        alert("This User is already listed as one of your clients");
        this.modalService.dismissAll();
      }


    }

    if (this.linkedClient == false) {
      
      this.userPofileService.checkForExistingUser(this.clientFullName, this.clientEmail).subscribe((data: any) => {
        if (data.responseCode == 1) {
          
          const current = data.dateSet[0];
          this.UserlinkToArchitectService.addUpdateLinkedUser(0, this.CurrentUser.appUserId, this.CurrentUser.fullName, current.userID, this.clientFullName, this.CurrentUser.appUserId, current.physcialAddress).subscribe((data: any) => {
            if (data.responseCode == 1) {
              alert(data.responseMessage);
              this.modalService.dismissAll();
            }
            else {
              alert(data.responseMessage);
            }
            console.log("response", data);
          }, error => {
            console.log("Error: ", error);
          })
        }
        else {
          alert(data.responseMessage);
        }
        console.log("response", data);
      }, error => {
        console.log("Error: ", error);
      })
    }
  }

  searchInput: any;

  // #region BPRegister Sindiswa 20 June 2024
  SearchForApplication() {
    
    const query = this.searchInput.toLowerCase();

    //const results = this.ApplicationsBP.filter(item => item.ownerName.toLowerCase().startsWith(query));
    const results = this.ApplicationsBP.filter(item => item.ProjectNumber?.toLowerCase().includes(query) || item.applicationID.toString().includes(query) || item.ownerName?.toLowerCase().includes(query) || item.status?.toLowerCase().startsWith(query)); //The goal is to search By Project Number Or Application Number
    this.dataSourceBP = results;

    if (query) {
      const results2 = this.originalDataSourceSA.filter(item => item.ProjectNumber?.toLowerCase().includes(query) || item.applicationID.toString().includes(query) || item.ownerName?.toLowerCase().includes(query) || item.status?.toLowerCase().startsWith(query)); //The goal is to search By Project Number Or Application Number
      this.dataSourceSA = results2;
    }
    else {
      this.dataSourceSA = [...this.originalDataSourceSA];
    }


  }
  // #endregion BPRegister Sindiswa 20 June 2024
  ViewProject(index) {
    let applicationId: any;
    debugger;
    applicationId = this.dataSourceSA;
    switch (this.selectedTabIndex) {
      case 0:
        applicationId = this.ApplicationsBP[index].applicationID;
        this.sharedService.setApplicationID(applicationId);
       
        this.router.navigate(['bpview-project-info']);
        //BPRegister Sindiswa 20062024
        break;
      case 1:
        applicationId = this.AllTownPlanningApplications[index].applicationID;
       
        this.sharedService.setApplicationID(applicationId);
        this.router.navigate(['bpview-project-info']);
        break;

      case 2:
        applicationId = this.AllBPApplications[index].applicationID;
       
        this.sharedService.setApplicationID(applicationId);
        this.router.navigate(['bpview-project-info']);
        break;

      case 3:
        break;
      case 4:
        break;
      case 5:
        break;
      case 6:
        break;
      case 7:
        break;
      case 8:
        debugger;
        applicationId = this.AllApplications[index].applicationID;
        this.sharedService.setCurrentStage(this.AllApplications[index].stage);
        this.sharedService.setApplicationID(applicationId);
        this.router.navigate(['bpview-project-info']);
        break;
    }
  
  }
  DeleteBuildingApplication(index: any) {
    if (confirm("Are you sure you want to delete this Application")) {
      let applicationId = this.ApplicationsBP[index].applicationID;
      this.bpApplicationService.deleteApplicationByApplicationID(applicationId).subscribe((data: any) => {
        if (data.responseCode == 1) {
          alert("Application deleted Successfully");
          this.GetAllPreInvoiceScrutinyApplications();
          this.GetAllNotificationsForApplication(applicationId);
        }
        else {
          alert(data.responseMessage)
        }
      }, error => {
        console.log("BuildingApplicationError: ", error)
      })
    }
    else {
      return;
    }
  }
  GetAllNotificationsForApplication(applicationId: number) {
    
    this.bpNotificationService.getNotificationByApplicationID(applicationId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const notificationID = data.dateSet[i].notificationID;
          this.DeleteNotificationByNotificationID(notificationID);
        }
      }
      else {
        alert(data.responseMessage);
      }
      console.log("response", data);
    }, error => {
      console.log("Error: ", error);
    })




  }
  DeleteNotificationByNotificationID(notificationID: number) {
    this.bpNotificationService.deleteNotificationByNotificationID(notificationID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        console.log(data.responseMessage);
      }
      else {
        alert(data.responseMessage);
      }
      console.log("response", data);
    }, error => {
      console.log("Error: ", error);
    })
  }
  CheckExistingClient() {
    if (this.existingClientCheck == false) {
      this.existingClientCheck = true;
    }
    else {
      this.existingClientCheck = false;

    }
  }

  openComplaints(complaint:any) {
    this.modalService.open(complaint, { centered: true, size: 'xl' });
  }

  goToDemolition(isDemoArchive: boolean) {
    this.sharedService.isDemolitionArchive = isDemoArchive;
    this.router.navigate(["/bpdemolition-application"]);

  }

  goToSignageApplication() {
    this.router.navigate(["/bpsignage-application"]);
  }

  goToBannerApplication(isFlagApplication: boolean) {
    this.sharedService.isFlagApplication = isFlagApplication;
    this.router.navigate(["/bpbanner-application"]);
  }

  addComplaint() {
    this.complainantAddress = this.streetNumber + "," + this.streetNumber + "," + this.suburb + "," + this.city + "," + this.postalCode;
    this.bpComplaintsService.addUpdateComplaint(0, this.complainantID, this.complainantName, this.complainantEmail, this.complainantCell, this.complainantTel, this.complainantAddress, this.cadastralDescription, this.lotNumber, this.portion, this.township, this.details, this.CurrentUser.appUserId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        alert(data.responseMessage);
        this.modalService.dismissAll();
      }
      else {
        alert(data.responseMessage);
      }
      
    }, error => {
      console.log("Error: ", error);
    })
  }
  onFilterBPApplications(applicationType: string) {
    if (applicationType == "Building Plan") {
      this.dataSourceBP = this.ApplicationsBP;
      this.applicationTypeName = "Building Plan";
    }

    if (applicationType == "Demolition") {
      this.dataSourceBP = this.DemolitionsList;
      this.applicationTypeName = "Demolition";
    }

    if (applicationType == "Signage") {
      this.dataSourceBP = this.SignageList;
      this.applicationTypeName = "Signage";
    }

    if (applicationType == "Banner") {
      this.dataSourceBP = this.BannerList;
      this.applicationTypeName = "Banner";
    }

    if (applicationType == "Flag") {
      this.dataSourceBP = this.FlagApplicationList;
      this.applicationTypeName = "Flag";
    }
  }

  getAllDemolitionApplications() {
    this.bpDemolitionService.getAllDemolitionApplications().subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < 30; i++) {
          const current = data.dateSet[i];
          const tempApplication = {} as ApplicationsListBP;
        
          tempApplication.applicationID = current.demolitionID;
          tempApplication.erfNumber = current.siteERFNumber;
          tempApplication.stage = current.currentStage;
          tempApplication.ownerName = current.ownerName + " " + current.ownerSurname;
          tempApplication.propertyAddress = current.siteAddress;
          tempApplication.dateCreated = current.dateCreated.substring(0,current.dateCreated.indexOf("T"));
          tempApplication.dateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));

          this.DemolitionsList.push(tempApplication);
        }
      }
      else {
        alert(data.responseMessage);
      }

    }, error => {
      console.log("Error: ", error);
    })
  }

  getAllSignageApplications() {
    this.bpSignageService.getAllSignageApplications().subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < 30; i++) {
          const current = data.dateSet[i];
          const tempApplication = {} as ApplicationsListBP;

          tempApplication.applicationID = current.applicationID;
          tempApplication.stage = current.currentStage;
          tempApplication.ownerName = current.applicantName + " " + current.applicantSurname;
          tempApplication.propertyAddress = current.address;
          tempApplication.dateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
          tempApplication.dateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));

          this.SignageList.push(tempApplication);
        }
      }
      else {
        alert(data.responseMessage);
      }

    }, error => {
      console.log("Error: ", error);
    })
  }

  getAllBannerApplications() {
    this.bpBannerService.getAllBannerApplications().subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < 3 ; i++) {
          const current = data.dateSet[i];
          const tempApplication = {} as ApplicationsListBP;

          tempApplication.applicationID = current.applicationID;
          tempApplication.stage = current.currentStage;
          tempApplication.ownerName = current.applicantName + " " + current.applicantSurname;
          tempApplication.propertyAddress = current.address;
          tempApplication.dateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
          tempApplication.dateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));

          this.BannerList.push(tempApplication);
          
        }
      }
      else {
        alert(data.responseMessage);
      }

    }, error => {
      console.log("Error: ", error);
    })
  }

  getAllFlagApplications() {
    this.bpFlagService.getAllFlagApplications().subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < 30; i++) {
          const current = data.dateSet[i];
          const tempApplication = {} as ApplicationsListBP;

          tempApplication.applicationID = current.applicationID;
          tempApplication.stage = current.currentStage;
          tempApplication.ownerName = current.applicantName + " " + current.applicantSurname;
          tempApplication.propertyAddress = current.address;
          tempApplication.dateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
          tempApplication.dateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));
        }
      }
      else {
        alert(data.responseMessage);
      }

    }, error => {
      console.log("Error: ", error);
     
    })
  }

  getAllFunctionalAreas(complaint:any) {
    this.bpFunctionalAreasService.getAllFunctionalAreas().subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
         const tempFunctionArea = {} as BPFunctionalAreas;

          tempFunctionArea.FunctionalAreaId = current.functionalAreaID;
          tempFunctionArea.FAName = current.faName;

          this.FunctionalAreasList.push(tempFunctionArea);
          
        }
        this.openComplaints(complaint);
      }
      else {
        alert(data.responseMessage);
      }

    }, error => {
      console.log("Error: ", error);
    })
  }

  onAddressSelect(address: any) {
    
    this.clientPhysicalAddress = address.formatted_address;
   
  }
 
  openArchiveOption() {
    this.modalService.open(this.archiveOption, { centered: true, size: 'xl' });
  }
  //Home Tabs Kyle 27-05 - 24
  onChangeDataSource(event: any) {
    debugger;
    this.selectedTabIndex = event.options[0].value;
    switch (this.selectedTabIndex) {
      case 0:
/*        this.GetAllPreInvoiceScrutinyApplications();*/
        this.GetAllPreInvoiceScrutinyApplications();


        //BPRegister Sindiswa 20062024
        break;
      case 1:
        this.GetAllTownPlanningApplications();

        break;
      case 2:
        this.GetAllBuildingPlansApplications();
        break;

      case 3:
        break;
      case 4:
        break;
      case 5:
        break;
      case 6:
        break;
      case 7:
        break;
      case 8:
        
        this.GetAllApplications();

        break;
    }
  }

  getAllApplications() {



  }
 
  getAllPreInvoiceScurtinyApplications() {

    this.bpApplicationService.getAllPreInvoiceScrutinyApplications().subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          
          const current = data.dateSet[i];
          const tempApplication = {} as ApplicationsListBP;
          if (current.stage == "Land Survey" || current.stage == "Town Planning") {
            tempApplication.applicationID = current.applicationID;
            tempApplication.ProjectNumber = current.lsNumber;
            tempApplication.erfNumber = current.erfNumber;
            tempApplication.stage = current.stage;
            tempApplication.ownerName = current.ownerName;
            tempApplication.propertyAddress = current.propertyAddress;
            tempApplication.status = current.status;
            tempApplication.dateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
            tempApplication.dateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));

           
            this.scrutinyApplications.push(tempApplication);
          }
         
        }
        console.log("Scrutiny Application", this.scrutinyApplications);
        this.dataSourceSA = this.scrutinyApplications;
        this.applicationsTable?.renderRows();
          }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Error",error);
   
    })
  }
  //Home Tabs Kyle 27-05 - 24
  openCreateNewApplicationBar() {
    this._bottomSheet.open(CreateNewApplicationComponent);
  }
}
