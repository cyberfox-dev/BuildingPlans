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
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectEngineerTableComponent } from 'src/app/select-engineer-table/select-engineer-table.component';
import { SelectContractorTableComponent } from 'src/app/select-contractor-table/select-contractor-table.component';
import { ProfessionalService } from 'src/app/service/Professionals/professional.service';
import { LoginComponent } from 'src/app/login/login.component';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ZoneForCommentService } from '../service/ZoneForComment/zone-for-comment.service';
import { ZoneLinkService } from '../service/ZoneLink/zone-link.service';
import { SubDepartmentsService } from '../service/SubDepartments/sub-departments.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ChangeDetectorRef } from '@angular/core';



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
  Coordinates: string
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

}

export interface ConfigList {
  ConfigID: number,
  ConfigName: string,
  ConfigDescription: string,
  DateCreated: Date,
  DateUpdated: Date,
  CreatedById: string,
  isActive: boolean,
  UtilitySlot1: string,
  UtilitySlot2: string,
  UtilitySlot3: string,
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

  isLoading: boolean = false;

  /*paginator stuff*/

  /*  @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: MatTableDataSource<any>;
    initializeTableData() {
      // Assuming you have an array called 'applications' with the table data
      this.dataSource = new MatTableDataSource(this.Applications);
      this.dataSource.paginator = this.paginator;
      this.function();
    }*/

  AllSubDepartmentList: AllSubDepartmentList[] = [];
  Applications: ApplicationsList[] = [];
  applicationDataForView: ApplicationList[] = [];
  applicationDataForViewToShared: ApplicationList[] = [];
  StagesList: StagesList[] = [];
  relatedApplications: ApplicationList[] = [];
  RolesList: RolesList[] = [];
  UserList: UserList[] = [];
  ClientUserList: ClientUserList[] = [];
  ZoneLinkedList: ZoneList[] = [];
  AllConfig: ConfigList[] = [];
  ServerType: string;

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
  clientIDNumber = '';
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

  displayedColumnsLinkUsers: string[] = ['idNumber', 'fullName', 'actions'];
  dataSourceLinkUsers = this.ClientUserList;
  isDarkTheme: boolean = true;

  private subscriptions: Subscription[] = [];

  createNewWayleaveBtn: boolean = true;
  createNewPlanningWayleaveBtn: boolean = true;
  date: any;

  applicationType: boolean;
  isPlanning: boolean;
  userID: any;

  viewEscalateDate = 0;


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
  ) {
    this.currentDate = new Date();
    this.previousMonth = this.currentDate.getMonth();
    this.previousYear = this.currentDate.getFullYear();
  }




  currentDate: Date;
  previousMonth: number;
  @ViewChild(MatTable) applicationsTable: MatTable<ApplicationsList> | undefined;
  displayedColumns: string[] = ['ProjectNumber', 'FullName', 'Stage', 'Status', 'TypeOfApplication', 'AplicationAge', 'StageAge', 'DateCreated', 'actions'];
  dataSource = this.Applications;


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toUpperCase();
    if (filterValue == "") {
      // If the filter is empty, reset the dataSource to the original data
      this.dataSource = [...this.Applications];
    } else {
      const sanitizedFilterValue = filterValue.replace(/[^\w\s]/g, '');
      const regex = new RegExp(sanitizedFilterValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

      // Apply the filter to the dataSource based on the ProjectNumber property
      this.dataSource = this.Applications.filter(user => {
        const sanitizedProjectNumber = (user.ProjectNumber || '').replace(/[^\w\s]/g, '');
        return regex.test(sanitizedProjectNumber.toUpperCase());
      });
    }

    // Render the rows after applying the filter
    this.applicationsTable?.renderRows();
  }





  ngOnInit(): void {



    setTimeout(() => {

      this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
      this.CurrentUser = JSON.parse(this.stringifiedData);
      this.getAllStages();
      this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
      this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);
      this.UpdateProjectNumberConfig();
      this.getAllApplicationsByUserID();
       this.select = "option3";

      this.getRolesLinkedToUser();
      this.onCheckIfUserHasAccess();
      this.getAllExternalUsers();
      this.getAllSubDepartments();
      this.getAllUserLinks();
      this.getAllConfigData();

      //this.function();
    }, 100);
    //this.dataSource.paginator = this.paginator;
    //this.defaultPageSize = 10;
  }

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
    //this.defaultPageSize = 10;
  }

  function() {
    this.isLoading = true;
  }




  cardchange(ids: any) {
    this.option = ids;
    this.sharedService.option = this.option;
  }


  getAllUserLinks() {
    debugger;
    this.zoneLinkService.getAllUserLinks(this.CurrentUser.appUserId).subscribe((data: any) => {
      debugger;
      if (data.responseCode == 1) {
        debugger;
        // const current = 
        for (let i = 0; i < data.dateSet.length; i++) {
          debugger;
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
  openUser(user: any) {
    if (confirm("Are you sure you what to apply for a existing client?")) {
      this.modalService.open(user, {
        centered: true,
        size: 'lg',
        backdrop: 'static', // Prevent clicking outside the modal to close it
        keyboard: false // Prevent pressing the ESC key to close the modal
      });
    }
    else {

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


    this.userPofileService.getExternalUsers().subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempZoneList = {} as ClientUserList;
          const current = data.dateSet[i];
          tempZoneList.userId = current.userID;
          tempZoneList.idNumber = current.idNumber;
          tempZoneList.fullName = current.fullName;


          this.sharedService.clientUserID = current.userID;
          this.ClientUserList.push(tempZoneList);
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

  getUserID(index: any) {
    console.log("Turtle Speed is too fast for me");
    debugger;
    this.userID = this.ClientUserList[index].userId;
    console.log("You selected: " + this.userID);
    //The right UserID is acquired - then what?!
  }


  populateClientInfo() {
    if (confirm("Are you sure you are done?")) {
      this.createWayleave(this.applicationType, this.isPlanning);
    }



  }

  UpdateProjectNumberConfig() {

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




   getAllApplicationsByUserID() {



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

          this.applicationsTable?.renderRows();
          this.cardFilters = false;

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


    this.applicationDataForViewToShared.push(this.applicationDataForView[index])
    console.log("this.applicationDataForView[index]this.applicationDataForView[index]this.applicationDataForView[index]this.applicationDataForView[index]this.applicationDataForView[index]", this.applicationDataForView[index]);
    this.sharedService.setViewApplicationIndex(this.applicationDataForViewToShared);
    /*    this.CheckIfCanReapply();*/
    this.viewContainerRef.clear();
    this.router.navigate(["/view-project-info"]);
  }

  goToNewWayleave(applicationType: boolean, isPlanning: boolean) { //application type refers to whether it is a brand new application or if it is a reapply.

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


    if (this.option == "client") {

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
    // Filter your data by the "Unpaid" status.
    this.dataSource = this.dataSource.filter(item => item.ApplicationStatus === 'Distributed' && item.FullName == this.CurrentUser.fullName);

    // Update the count variable.

  }

  filterByDistribution() {
    // Filter your data by the "Distribution" status.
    this.dataSource = this.dataSource.filter(item => item.ApplicationStatus === 'Distributed');

    // Update the count variable.

  }

  filterByApproved() {
    // Filter your data by the "Approved" status.
    this.dataSource = this.dataSource.filter(item => item.ApplicationStatus === 'Approved');

    // Update the count variable.

  }

  filterByRejected() {
    // Filter your data by the "Rejected" status.
    this.dataSource = this.dataSource.filter(item => item.ApplicationStatus === 'Rejected');

    // Update the count variable.

  }

  filterByWIP() {
    // Filter your data by the "WIP" status.
    this.dataSource = this.dataSource.filter(item => item.ApplicationStatus === 'WIP');

    // Update the count variable.

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
  async CheckIfCanReapply(index:any) {
    this.relatedApplications.splice(0, this.relatedApplications.length);

    //this.sharedService.getProjectNumber() i removed this
    this.sharedService.setProjectNumber(this.applicationDataForView[index].ProjectNumber);
    await this.applicationService.getApplicationsByProjectNumber(this.applicationDataForView[index].ProjectNumber).subscribe((data: any) => {
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
    debugger;
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
    debugger;
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









  select = '';
  cardFilters: boolean = true;



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
      this.cardFilters = true;
      this.applicationDataForView = [];
      this.Applications = [];
      let number = 21;
      debugger;
      this.applicationService.getApplicationsForReviewer(21, this.CurrentUser.appUserId).subscribe((data: any) => {


        if (data.responseCode == 1) {
          debugger;

          for (let i = 0; i < data.dateSet.length; i++) {
            const tempApplicationList = {} as ApplicationsList;
            const tempApplicationListShared = {} as ApplicationList;
            const current = data.dateSet[i];

            debugger;



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
    else{

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

  //Method is duplicated in the login.component.ts
  getAllConfigData() {
    this.AllConfig.splice(0, this.AllConfig.length);


    this.configService.getAllConfigs().subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempConfigList = {} as ConfigList;
          const current = data.dateSet[i];

          tempConfigList.ConfigID = current.configID;
          tempConfigList.ConfigName = current.configName;
          tempConfigList.ConfigDescription = current.configDescription;
          tempConfigList.DateCreated = current.dateCreated;
          tempConfigList.DateUpdated = current.dateUpdated;
          tempConfigList.CreatedById = current.createdById;
          tempConfigList.isActive = current.isActive;
          tempConfigList.UtilitySlot1 = current.utilitySlot1;
          tempConfigList.UtilitySlot2 = current.utilitySlot2;
          tempConfigList.UtilitySlot3 = current.utilitySlot3;

          console.log("MapConfig:", tempConfigList);

          this.AllConfig.push(tempConfigList);

          //    this.sharedService.MapConfig(tempConfigList);
        }
        this.sharedService.setAllConfig(this.AllConfig);
          this.ServerType = this.AllConfig.find((config) => config.ConfigName === 'ServerType').UtilitySlot1;
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


  getAllApplicationsForReviewer() {
  
  }

  }


