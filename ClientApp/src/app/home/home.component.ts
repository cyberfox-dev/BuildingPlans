import { Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { ApplicationsService } from '../service/Applications/applications.service';
import { MatTable } from '@angular/material/table';
import { CommentList } from '../nav-menu/nav-menu.component';
//import { ApplicationList } from '../shared/shared.service';
import { SharedService } from "src/app/shared/shared.service"
import { StagesService } from '../service/Stages/stages.service';
import { NewWayleaveComponent } from 'src/app/create-new-wayleave/new-wayleave/new-wayleave.component';
import { AccessGroupsService } from 'src/app/service/AccessGroups/access-groups.service';
import { UserProfileService } from 'src/app/service/UserProfile/user-profile.service';
import { ConfigService } from 'src/app/service/Config/config.service';
import { Subscription, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectEngineerTableComponent } from 'src/app/select-engineer-table/select-engineer-table.component';
import { SelectContractorTableComponent } from 'src/app/select-contractor-table/select-contractor-table.component';
import { ProfessionalService } from 'src/app/service/Professionals/professional.service';
import { LoginComponent } from 'src/app/login/login.component';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginator } from '@angular/material/paginator';
import { ZoneForCommentService } from '../service/ZoneForComment/zone-for-comment.service';
import { ZoneLinkService } from '../service/ZoneLink/zone-link.service';
import { SubDepartmentsService } from '../service/SubDepartments/sub-departments.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ChangeDetectorRef } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../service/User/user.service';
import { NewProfileComponent } from '../new-user/new-profile/new-profile.component';
import { BusinessPartnerService } from '../service/BusinessPartner/business-partner.service';
import { ContractorList } from '../edit-contractor/edit-contractor.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfigActingDepartmentComponent } from 'src/app/config-acting-department/config-acting-department.component';

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
  AllConfig: ConfigList[] = [];
  ServerType: string;

  //Added on the 18th of September for the view tings
  TempEngList: TempEngineerList[] = [];
  TempConList: TempContractorList[] = [];

  EngineersList: ProfListEU[] = [];
  ContractorsList: ProfListEU[] = [];

  @ViewChild(MatTable) ZoneListTable: MatTable<ZoneList> | undefined;

  displayedColumnsViewLinkedZones: string[] = ['subDepartmentName', 'zoneName'];
  dataSourceViewLinkedZones = this.ZoneLinkedList;

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
  clientPhysicalAddress = '';
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
  @ViewChild("clientOption", { static: true }) clientOption!: ElementRef;
  @ViewChild("user", { static: true }) user!: ElementRef;
  @ViewChild("Prof", { static: true }) Prof!: ElementRef;
  @Output() optionEvent = new EventEmitter<string>();


  isDarkTheme: boolean = true;

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
  ) {
    this.currentDate = new Date();
    this.previousMonth = this.currentDate.getMonth();
    this.previousYear = this.currentDate.getFullYear();
  }

  isTableLoading: boolean = true;

  newList = [];
  newInternalList = [];
  currentDate: Date;
  previousMonth: number;
  @ViewChild(MatTable) applicationsTable: MatTable<ApplicationsList> | undefined;
  displayedColumns: string[] = ['ProjectNumber', 'FullName', 'Stage', 'Status', 'TypeOfApplication', 'AplicationAge', 'StageAge', 'DateCreated', 'actions'];
  dataSource = this.Applications;


  applyFilter(event: Event): string[] {
    const filterValue = (event.target as HTMLInputElement).value.toUpperCase();
    if (filterValue === "") {

      // If the filter is empty, reset the dataSource to the original data
      this.dataSource = [...this.Applications];
      this.newList = [];
      this.applicationsTable?.renderRows();
      return this.dataSource.map(user => user.ProjectNumber || "");


      ;
    } else {

      const sanitizedFilterValue = filterValue.replace(/[^\w\s]/g, '');
      const regex = new RegExp(sanitizedFilterValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      // Render the rows after applying the filter

      // Apply the filter to the dataSource based on the ProjectNumber property
      this.dataSource = this.Applications.filter(user => {

        const sanitizedProjectNumber = (user.ProjectNumber || '').replace(/[^\w\s]/g, '');
        return regex.test(sanitizedProjectNumber.toUpperCase());
      });

      this.applicationsTable?.renderRows();
      this.newList = [...this.dataSource];
      console.log(this.newList);
      // Extract and return the filtered project numbers
      return this.newList.map(user => user.ProjectNumber || "");
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
    debugger;
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
    debugger;
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



    setTimeout(() => {
      debugger;
      this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
      this.CurrentUser = JSON.parse(this.stringifiedData);
      this.getAllStages();
      this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
      this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);
      this.UpdateProjectNumberConfig();
      this.getAllApplicationsByUserID();
      /* this.select = "option3";*/

      this.getRolesLinkedToUser();
      this.onCheckIfUserHasAccess();
    

      this.getAllSubDepartments();
      this.getAllUserLinks();
      this.getConfig();
      this.getAllInternalUsers();

      //this.getAllExternalUsers(); //returns null at this point

      //this.ServerType = this.sharedService.getServerType();

      /*      this.initializeApp();*/
      //this.function();
    }, 100);

    //this.defaultPageSize = 10;
  }

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
    //this.defaultPageSize = 10;

    /*          const myDropdown = document.getElementById("myDropdown") as HTMLSelectElement;
              this.select = "option1";
              myDropdown.disabled = true;*/
  }







  cardchange(ids: any) {
    this.option = ids;
    this.sharedService.option = this.option;
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
    //  this.optionEvent.emit(this.option);
    if (this.option == "internal") {
      /* this.optionEvent.emit(this.option);*/

      this.createWayleave(this.applicationType, this.isPlanning);
      //this.NewWayleaveComponent.reciveOption(this.option);

    }
    else {
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
  openUser(user: any) {
    
    if (this.isModalOpen) {
      // Modal is already open, do nothing or handle it as needed
      return;
    }

    if (confirm("Are you sure you want to apply for an existing client?")) {
      this.isModalOpen = true;
      this.clearFilter();

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
    } else {
      // Handle the case when the user cancels the confirmation
    }
  }

  openXl(Prof: any) {
    this.modalService.open(Prof, {
      centered: true,
      size: 'xl',
      backdrop: 'static', // Prevent clicking outside the modal to close it
      keyboard: false // Prevent pressing the ESC key to close the modal
    });

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

    debugger;
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
          tempZoneList.subDepartmentID = current.subDepartmentID;
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
    debugger;

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
      debugger;
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

    debugger;
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
    if (confirm("Are you sure you are done?")) {
      debugger;
      this.createWayleave(this.applicationType, this.isPlanning);
    }



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

  getRolesLinkedToUser() {

    this.RolesList.splice(0, this.RolesList.length);

    this.accessGroupsService.getAllRolesForUser(this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempRolesList = {} as RolesList;
          const current = data.dateSet[i];
          tempRolesList.AccessGroupName = current.accessGroupName;
          tempRolesList.AccessGroupID = current.accessGroupID;
          tempRolesList.RoleID = current.roleID;
          tempRolesList.RoleName = current.roleName;

          this.RolesList.push(tempRolesList);



        }
        this.sharedService.setCurrentUserRole(this.RolesList);
        // this.rolesTable?.renderRows();
        console.log("getAllLinkedRolesReponse", data.dateSet);
      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);
      }
      console.log("getAllLinkedRolesReponse", data);

    }, error => {
      console.log("getAllLinkedRolesReponseError: ", error);
    })

  }



  @ViewChild('mySelect') mySelect: MatSelect;
  getAllApplicationsByUserID() {



    this.Applications.splice(0, this.Applications.length);

    if (this.CurrentUserProfile[0].isInternal) {

      /* this.applicationService.getApplicationsList(this.CurrentUser.appUserId, true).subscribe((data: any) => {


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

    this.applicationsTable?.renderRows();
    //for card filters
   *//* this.select = "option3";*//*
       this.recentUnpaidCount();
       this.recentDistributedCount();
       this.recentApprovedCount();
       this.recentejectedCount();
       this.recentWIPCount();

       console.log("Got all applications", data.dateSet);
     }
     else {
       alert(data.responseMessage);
     }

   })*/


      this.FilterBtn = true;
      this.onFilterApplicationForMyReviews();

    }
    else {



      /*this.select = "option3";*/


      this.applicationService.getApplicationsList(this.CurrentUser.appUserId, false).subscribe((data: any) => {


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
            this.date = current.dateCreated;
            tempApplicationList.DateCreated = this.date.substring(0, current.dateCreated.indexOf('T'));;;

            if (current.projectNumber != null) {
              tempApplicationList.ProjectNumber = current.projectNumber;
            } else {
              tempApplicationList.ProjectNumber = (current.applicationID).toString();
            }

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
            //save here to send to the shared

            //tempApplicationListShared.applicationID = current. ;
            tempApplicationListShared.applicationID = current.applicationID;
            tempApplicationListShared.clientName = current.fullName;
            tempApplicationListShared.clientEmail = current.email;
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



            this.applicationDataForView.push(tempApplicationListShared);
            console.log("this.applicationDataForViewthis.applicationDataForViewthis.applicationDataForView", this.applicationDataForView);

            this.Applications.push(tempApplicationList);

          }
          /* this.mySelect.disabled = true;*/
          this.applicationsTable?.renderRows();
          this.cardFilters = false;

          console.log("Got all applications", data.dateSet);

        }
        else {
          alert(data.responseMessage);
        }

        //for card filters
        /* this.select = "option3";*/
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



  viewProject(index: any) {

    console.log("FIND", this.applicationDataForView[index]);
    if (this.newList.length > 0) {

      for (var i = 0; i < this.newList.length; i++) {
        // Assuming this.applicationDataForView and newList are your arrays

        const desiredApplicationID = this.newList[i].ApplicationID; // Replace [0] with the specific index you want to match

        const foundRow = this.applicationDataForView.find(item => item.applicationID === desiredApplicationID);

        if (foundRow) {
          this.applicationDataForViewToShared.push(foundRow);
          break;
          // Do something with the found row
          console.log(foundRow);
        } else {
          console.log("No matching row found.");
        }

      }


    } else {

      this.applicationDataForViewToShared.push(this.applicationDataForView[index]);
    }


    console.log("this.applicationDataForView[index]this.applicationDataForView[index]this.applicationDataForView[index]this.applicationDataForView[index]this.applicationDataForView[index]", this.applicationDataForView[index]);
    this.sharedService.setViewApplicationIndex(this.applicationDataForViewToShared);
    /*    this.CheckIfCanReapply();*/

    this.viewContainerRef.clear();
    this.router.navigate(["/view-project-info"]);

  }

  goToNewWayleave(applicationType: boolean, isPlanning: boolean) { //application type refers to whether it is a brand new application or if it is a reapply.
    debugger;
    this.getAllExternalUsers();
    this.applicationType = applicationType;
    this.isPlanning = isPlanning;
    if (this.CurrentUserProfile[0].isInternal === true) {
      this.openSm(this.content);
    } else {
      this.createWayleave(this.applicationType, this.isPlanning);
    } 


  }

  createWayleave(applicationType: boolean, isPlanning: boolean) {
    //application type refers to whether it is a brand new application or if it is a reapply.
    console.log("THIS IS THE APPLICATION TYPE", applicationType);
    this.sharedService.setReapply(applicationType);
    debugger;

    if (this.option == "client" || this.option == 'proxy') {

      this.NewWayleaveComponent.onWayleaveCreate(this.userID, isPlanning);
      // this.NewWayleaveComponent.populateClientInfo(this.userID);
    }
    else {
      this.NewWayleaveComponent.onWayleaveCreate(this.CurrentUser.appUserId, isPlanning);
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
        if (current.ApplicationStatus == "PTW Pending" || current.ApplicationStatus == "Approval Pack Generation" || current.ApplicationStatus == "Monitoring") {
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
    debugger;
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
    debugger;
    if (this.filter == false) {
      this.dataSource = this.Applications.filter(df => df.ApplicationStatus == "Approval Pack Generation" || df.ApplicationStatus == "Final Approval" || df.ApplicationStatus == "PTW Pending");
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


    debugger;


    this.relatedApplications.splice(0, this.relatedApplications.length);

    //this.sharedService.getProjectNumber() i removed this


    if (this.newList.length <= 0) {
      this.sharedService.setProjectNumber(element.ProjectNumber);

      await this.applicationService.getApplicationsByProjectNumber(element.ProjectNumber).subscribe((data: any) => {
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

        this.viewProject(index);

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

        this.viewProject(index);

      }, error => {
        console.log("Error: ", error);
      })

    }




  }


  page = 4;


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
      return element.ApplicationStatus === 'PTW Pending';
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

  getCurrentUserZoneID() {

  }

  onFilterApplicationForMyReviews() {
    this.isTableLoading = true;
    this.onFilterButtonClick();
    this.notNyProjects = true;
    this.MyProjects = false;
    this.FiterValue = "";
    this.FiterValue = "Your Reviews";
    this.cardFilters = false;
    this.applicationDataForView = [];
    this.Applications = [];
    let number = 21;

    this.applicationService.getApplicationsForReviewer(21, this.CurrentUser.appUserId).subscribe((data: any) => {


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

          debugger;
          /*            do {
                        tempApplicationList.TestApplicationStageAge = Math.floor(Math.random() * 30) + 1;
                      } while (tempApplicationList.TestApplicationStageAge > tempApplicationList.TestApplicationAge);*/
          //save here to send to the shared

          //tempApplicationListShared.applicationID = current. ;
          tempApplicationListShared.applicationID = current.applicationID;
          tempApplicationListShared.clientName = current.fullName;
          tempApplicationListShared.clientEmail = current.email;
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
        this.dataSource = this.Applications.filter(df => df.DateCreated);
        this.applicationsTable?.renderRows();
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

  onFilterApplicationsFprMyApplications() {
    this.isTableLoading = true;
    this.onFilterButtonClick();
    this.notNyProjects = false;
    this.MyProjects = true;

    this.FiterValue = "";
    this.FiterValue = "Your Applications";
    this.cardFilters = false;
    this.applicationDataForView = [];
    this.Applications = [];
    /*    this.getAllApplicationsByUserID();*/

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
        this.dataSource = this.Applications.filter(df => df.FullName == this.CurrentUser.fullName);
        this.applicationsTable?.renderRows();
        //for card filters
        /* this.select = "option3";*/
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
    this.isTableLoading = true;
    this.onFilterButtonClick();
    this.notNyProjects = true;
    this.MyProjects = false;
    this.FiterValue = "";
    this.FiterValue = "All Applications";


    this.applicationDataForView = [];
    this.Applications = [];


    this.Applications.splice(0, this.Applications.length);

    if (this.CurrentUserProfile[0].isInternal) {
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


          this.applicationsTable?.renderRows();
          //for card filters
          /* this.select = "option3";*/
          this.recentUnpaidCount();
          this.recentDistributedCount();
          this.recentApprovedCount();
          this.recentejectedCount();
          this.recentWIPCount();
          this.isTableLoading = false;
          this.cardFilters = true;
          console.log("Got all applications", data.dateSet);
        }
        else {
          alert(data.responseMessage);
        }

      })
    }
    else {
      this.applicationService.getApplicationsList(this.CurrentUser.appUserId, false).subscribe((data: any) => {


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
            this.date = current.dateCreated;
            tempApplicationList.DateCreated = this.date.substring(0, current.dateCreated.indexOf('T'));;;

            if (current.projectNumber != null) {
              tempApplicationList.ProjectNumber = current.projectNumber;
            } else {
              tempApplicationList.ProjectNumber = (current.applicationID).toString();
            }

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
            //save here to send to the shared

            //tempApplicationListShared.applicationID = current. ;
            tempApplicationListShared.applicationID = current.applicationID;
            tempApplicationListShared.clientName = current.fullName;
            tempApplicationListShared.clientEmail = current.email;
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



            this.applicationDataForView.push(tempApplicationListShared);
            console.log("this.applicationDataForViewthis.applicationDataForViewthis.applicationDataForView", this.applicationDataForView);

            this.Applications.push(tempApplicationList);

          }
          this.dataSource = this.Applications.filter(df => df.DateCreated);
          this.applicationsTable?.renderRows();


          console.log("Got all applications", data.dateSet);

        }
        else {
          alert(data.responseMessage);
        }

        //for card filters
        this.select = "option3";
        this.recentUnpaidCount();
        this.recentDistributedCount();
        this.recentApprovedCount();
        this.recentejectedCount();
        this.recentWIPCount();

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



  }


  onFilterApplications() {


    if (this.select == "option1") {
      this.cardFilters = false;
      this.applicationDataForView = [];
      this.Applications = [];
      this.getAllApplicationsByUserID();

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
          this.dataSource = this.Applications.filter(df => df.FullName == this.CurrentUser.fullName);
          this.applicationsTable?.renderRows();
          //for card filters
          /* this.select = "option3";*/
          this.recentUnpaidCount();
          this.recentDistributedCount();
          this.recentApprovedCount();
          this.recentejectedCount();
          this.recentWIPCount();

          console.log("Got all applications", data.dateSet);
        }
        else {
          alert(data.responseMessage);
        }

      })

    }
    else if (this.select == "option2") {
      this.cardFilters = false;
      this.applicationDataForView = [];
      this.Applications = [];
      let number = 21;

      this.applicationService.getApplicationsForReviewer(21, this.CurrentUser.appUserId).subscribe((data: any) => {


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
          this.dataSource = this.Applications.filter(df => df.DateCreated);
          this.applicationsTable?.renderRows();
          //for card filters

          this.recentUnpaidCount();
          this.recentDistributedCount();
          this.recentApprovedCount();
          this.recentejectedCount();
          this.recentWIPCount();

          console.log("Got all applications", data.dateSet);
        }
        else {
          alert(data.responseMessage);
        }

      })
    }
    else if (this.select == "option3") {

      this.cardFilters = true;

      this.applicationDataForView = [];
      this.Applications = [];


      this.Applications.splice(0, this.Applications.length);

      if (this.CurrentUserProfile[0].isInternal) {
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
            this.applicationsTable?.renderRows();
            //for card filters
            /* this.select = "option3";*/
            this.recentUnpaidCount();
            this.recentDistributedCount();
            this.recentApprovedCount();
            this.recentejectedCount();
            this.recentWIPCount();

            console.log("Got all applications", data.dateSet);
          }
          else {
            alert(data.responseMessage);
          }

        })
      }
      else {
        this.applicationService.getApplicationsList(this.CurrentUser.appUserId, false).subscribe((data: any) => {


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
              this.date = current.dateCreated;
              tempApplicationList.DateCreated = this.date.substring(0, current.dateCreated.indexOf('T'));;;

              if (current.projectNumber != null) {
                tempApplicationList.ProjectNumber = current.projectNumber;
              } else {
                tempApplicationList.ProjectNumber = (current.applicationID).toString();
              }

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
              //save here to send to the shared

              //tempApplicationListShared.applicationID = current. ;
              tempApplicationListShared.applicationID = current.applicationID;
              tempApplicationListShared.clientName = current.fullName;
              tempApplicationListShared.clientEmail = current.email;
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



              this.applicationDataForView.push(tempApplicationListShared);
              console.log("this.applicationDataForViewthis.applicationDataForViewthis.applicationDataForView", this.applicationDataForView);

              this.Applications.push(tempApplicationList);

            }
            this.dataSource = this.Applications.filter(df => df.DateCreated);
            this.applicationsTable?.renderRows();


            console.log("Got all applications", data.dateSet);

          }
          else {
            alert(data.responseMessage);
          }

          //for card filters
          this.select = "option3";
          this.recentUnpaidCount();
          this.recentDistributedCount();
          this.recentApprovedCount();
          this.recentejectedCount();
          this.recentWIPCount();

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



    }
    else {

    }



  }



  getAllSubDepartments() {
    this.subDepartmentService.getSubDepartmentsList().subscribe((data: any) => {

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
    })
  }

  getConfig() {
    this.AllConfig.splice(0, this.AllConfig.length);

    this.configService.getAllConfigs().subscribe((data: any) => {

      if (data) {
        this.AllConfig = data.dateSet;

        this.sharedService.setAllConfig(this.AllConfig);
        this.ServerType = this.AllConfig.find((Config) => Config.configName === 'ServerType').utilitySlot1;
        //this.sharedService.setAPIURL(this.AllConfig.find((Config) => Config.configName === 'BaseUrl').utilitySlot2);
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
    debugger;
    this.professionalService.getProfessionalsListByProfessionalType(this.userID, professionalType).subscribe((data: any) => {
      if (data.responseCode == 1) {
        console.log("data.dateSet get", data.dateSet);
        debugger;
        for (let i = 0; i < data.dateSet.length; i++) {
          //Check if Engineer or Contractor
          if (professionalType == "Engineer") {
            const tempProfessionalList = {} as ProfListEU;
            const current = data.dateSet[i];
            debugger;
            tempProfessionalList.name = current.fullName.split(' ')[0], // Split full name into first name and last name
              tempProfessionalList.surname = current.fullName.split(' ')[1], // Assuming space separates first and last names
              //tempProfessionalList.fullName = current.fullName;
              tempProfessionalList.email = current.email;
            tempProfessionalList.idNumber = current.idNumber;
            tempProfessionalList.phoneNumber = current.phoneNumber;
            debugger;
            this.EngineersList.push(tempProfessionalList);
            //this.EngineerTable?.renderRows();

            debugger;
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
          debugger;
        }
        //this.ContractorTable?.renderRows();

        console.log("this.EngineerList", this.EngineersList);
        console.log("this.ContractorList", this.ContractorsList);

        this.contractorTable?.renderRows();
        this.engineerTable?.renderRows();
        debugger;
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
    debugger;
    // Use forEach to loop through TempEngList and call onPermaSaveTheirEngineer for each engineer
    this.TempEngList.forEach(engineer => {
      this.onPermaSaveTheirEngineer(engineer);
    });
  }
  saveAllContractors() {
    debugger;
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
      debugger;
      alert('Please fill in all required fields for the contractor.');
      return; // Exit the function if any required field is empty for the current engineer
    }
    debugger;
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
        debugger;
      }
      console.log("response", data);
      debugger;
    }, error => {
      console.log("Error: ", error);
      debugger;
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

    debugger;
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
    debugger;
    this.NewTempEngineersTable?.renderRows(); // Explicitly trigger rendering
    this.clearCreateEngComponent();

  }
  onPermaSaveNewEngineer(engineer: EngineerList) {
    debugger;
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
    debugger;
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
      debugger;
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
  async validateClientInfo(stepper: MatStepper) {
   
    let clientEmail = this.clientEmail;
    let phoneNumber = this.clientCellNo;
    let clientRefNo = this.clientRefNo;
    let BpNo = this.clientBpNumber;
    let companyName = this.clientCompanyName;
    let companyRegNo = this.clientCompanyRegNo;
    let clientCompanyType = this.clientCompanyType;
    let physicalAddress = this.clientPhysicalAddress;

    let clientIDNumber = this.clientIDNumber;

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
      }
    } else {
      alert("Invalid name. Please enter a single name with letters only.");
    }

    if (clientIDNumber.length === 13) {
      this.validID = true;
    } else {
      alert("The ID number must be 13 digits.")
      this.validID = false;
    }

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
          if (BpNo.trim() === '') {
            alert("Please enter a valid BP Number");
            this.externalWValidBP = false;
          } else {
            console.log("Testing BP number now...");
            const isValidBP = await this.testBp2(BpNo);
            if (isValidBP) {
              this.externalWValidBP = true;
            } else {
              // Handle invalid BP Number
              alert("Please enter a valid BP Number");
              console.log("ngathi this BP is not valid.");
              this.externalWValidBP = false; // Set this to false in case of an invalid BP Number
            }
          }
        }
      } catch (error) {
        console.error("An error occurred: ", error);
        this.validEmail = false;
        this.externalWValidBP = false;
      }
    }

    console.log("Email is okay?" + this.validEmail);
    console.log("User has a valid BP Num " + this.externalWValidBP);

    //What other validation must be done here?
    if (
      phoneNumber === undefined || phoneNumber.trim() === '' ||
      clientRefNo === undefined || clientRefNo.trim() === '' ||
      companyName === undefined || companyName.trim() === '' ||
      companyRegNo === undefined || companyRegNo.trim() === '' ||
      clientCompanyType === undefined || clientCompanyType.trim() === '' ||
      physicalAddress === undefined || physicalAddress.trim() === '' ||
      clientIDNumber === undefined || clientIDNumber.trim() === ''
    ) {
      this.noEmptyFields = false;
      alert("Please fill out all the required fields.");
    } else {
      this.noEmptyFields = true;
    }
    //(this.noEmptyFields == true && this.validFullName == true && this.validEmail == true && this.externalWValidBP == true && this.validID == true)
    if (this.noEmptyFields == true && this.validFullName == true && this.validEmail == true && this.validID == true) {
      this.sharedService.errorForRegister = false;
      this.createNewClient(stepper);
    }
    else {
      return;
    }
  }

  createNewClient(stepper: MatStepper) {
    try {

      this.userService.register(this.clientFullName, this.clientEmail, "Password@" + this.clientFullName).subscribe((data: any) => {
        if (data.responseCode == 1) {
          debugger;
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
            this.clientIDNumber,
            this.clientRefNo,
            this.clientCompanyType,
          )
          debugger;
          console.log("Before assignment - this.sharedService.clientUserID: " + this.sharedService.clientUserID);
          this.sharedService.clientUserID = data.dateSet.appUserId; //This assignment is sus THIS IS THE NEW PERSON
          console.log("IS this " + this.clientName + "'s USERID: " + this.sharedService.clientUserID);
          //localStorage.setItem("LoggedInUserInfo", JSON.stringify(data.dateSet)); //THIS IS WHERE YOU LOG THEM IN -MXM
          this.sharedService.newUserProfileBp = this.clientBpNumber;
          alert(this.clientFullName + " has been added as an external client.\nYou can now link their professionals and create a wayleave on their behalf.");
          console.log("Who is logged in?" + JSON.stringify(this.CurrentUser));
          stepper.next();
          
          //I NEED TO STAY INSIDE THIS MAT-STEPPER
          //this.router.navigate(["/new-profile"]);
        }
      });
  }
    catch (e) {
      console.log("There has been an issue with registering new client: " + e);
    }

   //the part that is relevant is the conditional statement that has a userID of null

    this.getUserProfile();
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

  openChoice(choiceEC: any) {
    this.modalService.open(choiceEC, { backdrop: 'static', centered: true, size: 'xl' });
  }
  

  handleChoice(internalUser: any, user:any) {
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

  async getAllInternalUsers() {
    debugger;

    this.AllInternalUserProfileList.splice(0, this.AllInternalUserProfileList.length);

    const data: any = await this.userPofileService.getInternalUsers().toPromise();

    if (data.responseCode == 1) {
      for (let i = 0; i < data.dateSet.length; i++) {
        const current = data.dateSet[i];
        const tempAllInternalUserProfileList: ClientUserList = {
          userId: current.userID,
          idNumber: current.idNumber,
          fullName: current.fullName,
          internalDepartment: current.directorate,
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
}

