import { Component, OnInit, ViewChild, ElementRef, } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from "src/app/shared/shared.service";
import { AuditTrailService } from '../service/AuditTrail/audit-trail.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { SubDepartmentsService } from '../service/SubDepartments/sub-departments.service';
import { ZonesService } from '../service/Zones/zones.service';
import { UserProfileService } from '../service/UserProfile/user-profile.service';
import { ReviewerforcommentService } from '../service/ReviewerForComment/reviewerforcomment.service';
import { MatTable,MatTableDataSource } from '@angular/material/table';
 //Audit Trail Kyle 
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
  //CreatedById: number,
  CreatedById: any,
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
  Coordinates: string;
  UserID: any;
}

export interface AuditTrailList {
 
  ApplicationID: number;
  AssignedTo: string;
  Description: string;
  Comment: string;
  isInternal: boolean;
  SubDepartmentName: string;
  ZoneName: string;
  CreatedBy: any;
  DateCreated: any;
  DateUpdated: any;
}

export interface SubDepartmentsList {
  SubDepartmentID: number;
  SubDepartmentName: string;
  DepartmentID: number;

}

export interface ZonesList {
  ZoneID: number;
  ZoneName: string;
  
}

export interface InternalUserList {
  userID: any;
  fullName: any;
}

@Component({
  selector: 'app-audit-trail',
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.css']
})


export class AuditTrailComponent implements OnInit {
  stringifiedData: any;
  CurrentUser: any;

  stringifiedDataUserProfile: any;
  CurrentUserProfile: any;

  applicationData: ApplicationList[] = [];
  AuditTrailList: AuditTrailList[] = [];
  SubDepartmentList: SubDepartmentsList[] = [];
  ZonesList: ZonesList[] = [];
  InternalUserList: InternalUserList[] = [];
 
  newInternalList = [];


  selectionType: string = '';
  zoneName: string;
  createdByName: string;
  fileName: string = "Testing";

  expectedStartDate: any;
  expectedEndType: any;
  expectedStartDateSub: any;
  expectedEndTypeSub: any;
  selectedSubDepartment: any;

  selectedRowIndex: number;

  showDate: boolean = false;
  showSub: boolean = false;
  showZone: boolean = false;
  showSubDate: boolean = false;
  showInternalUsers: boolean = false;
  endDateEnabled: boolean = false;

  showButton: boolean = false;
  getReport: boolean = false;


  @ViewChild(MatTable) AuditTrailTable: MatTable<AuditTrailList> | undefined;
  dataSource: MatTableDataSource<AuditTrailList> = new MatTableDataSource < AuditTrailList> ();
  displayedColumns: string[] = ['AssignedTo', 'Description', 'Comment', 'isInternal', 'SubDepartmentName', 'ZoneName', 'CreatedBy', 'DateCreated'];

  @ViewChild(MatTable) UserTable: MatTable<InternalUserList> | undefined;
  dataSourceUsers: MatTableDataSource<InternalUserList> = new MatTableDataSource<InternalUserList>();
  displayedColumnsUsers: string[] = ['fullName', 'actions'];

  @ViewChild("downloadReports", { static: true }) downloadReports!: ElementRef;


  constructor(private modalService: NgbModal, private sharedService: SharedService, private auditTrailService: AuditTrailService, private subDepartmentService: SubDepartmentsService, private zoneService: ZonesService, private userProfileService: UserProfileService, private reviewerForCommentService: ReviewerforcommentService) { }


  ngOnInit(): void {


    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);
    this.getReport = this.sharedService.isViewReport;
    this.showButton = this.sharedService.isReports;
    this.getAllSubdepartments();
    this.getAllInternalUsers();
    if (this.getReport == true) {
      this.applicationData.push(this.sharedService.getViewApplicationIndex());

     
      this.getAuditTrailDataForApplication();
    }
    if (this.showButton == true) {
      this.openDownloadReport()

    }
  }

  
  openDownloadReport() {
    this.modalService.open(this.downloadReports, { centered: true, size: 'xl' });
  }

  openInternalUser(internalUsers: any) {
    this.modalService.dismissAll();
   
    this.modalService.open(internalUsers, { centered: true, size: 'xl' });
    
  }
  
  onDateChange() {
    this.endDateEnabled = true;
  }

  clearAll() {
    this.selectionType = "";
    this.selectedSubDepartment = null;
    this.zoneName = null;
    this.expectedStartDate = null;
    this.expectedEndType = null;

    this.showDate = false;
    this.showSub = false;
    this.showZone = false;
    this.showSubDate = false;
    
    this.sharedService.isReports = false;
    this.showButton = false;
    this.modalService.dismissAll();
  }
  getAuditTrailDataForApplication() {

    this.fileName = "Report for " + this.applicationData[0].applicationID;
    this.AuditTrailList.splice(0, this.AuditTrailList.length);
    

    this.auditTrailService.getAllAuditTrailItemsForApplication(this.applicationData[0].applicationID).subscribe(async (data: any) => {

      if (data.responseCode == 1) {

        

        for (let i = 0; i < data.dateSet.length; i++) {

          const tempAuditTrail = {} as AuditTrailList;
          const current = data.dateSet[i];


          tempAuditTrail.ApplicationID = current.applicationID;
          tempAuditTrail.AssignedTo = "Null";
          tempAuditTrail.Comment = "Null";
          tempAuditTrail.Description = current.description;
          tempAuditTrail.isInternal = current.isInternal;
          tempAuditTrail.SubDepartmentName = current.subDepartmentName;
          tempAuditTrail.ZoneName = current.zoneName;
          tempAuditTrail.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
          tempAuditTrail.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf('T'));

          const userName: string = await this.getUserNameById(current.createdById);
          tempAuditTrail.CreatedBy = userName;

          if (tempAuditTrail.isInternal == false ) {
           
            tempAuditTrail.SubDepartmentName = "Null";
            tempAuditTrail.ZoneName = "Null";
          }

          this.AuditTrailList.push(tempAuditTrail);
        }

       
      }
      else {
        alert(data.responseMessage);
      }

      
      
    }, error => {
      console.log("getAllAuditTrailItems: ", error);


    })

    this.reviewerForCommentService.getAllReviewerForCommentForApplication(this.applicationData[0].applicationID).subscribe(async (data: any) => {
      if (data.responseCode == 1) {
        
        debugger;
        for (let i = 0; i < data.dateSet.length; i++) {

          const tempAuditTrail = {} as AuditTrailList;
          const current = data.dateSet[i];

          tempAuditTrail.ApplicationID = current.applicationID;
          tempAuditTrail.AssignedTo = await this.getUserNameById(current.reviewerAssignedToComment);
          tempAuditTrail.Comment = current.comment;
          tempAuditTrail.Description = current.commentStatus;
          tempAuditTrail.isInternal = true;
          tempAuditTrail.SubDepartmentName = current.subDepartmentName;
          tempAuditTrail.ZoneName = current.zoneName;
          tempAuditTrail.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
          tempAuditTrail.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf('T'));
          tempAuditTrail.CreatedBy = await this.getUserNameById(current.createdById);

          this.AuditTrailList.push(tempAuditTrail)
        }

        this.dataSource.data = this.AuditTrailList;
        await this.AuditTrailTable?.renderRows();

     
      }
      else {
        alert(data.responseMessage);
      }

      console.log("Got Audit for application", this.AuditTrailList);
     
    }, error => {
      console.log("getAllAuditTrailItems: ", error);

    })

   
  
  }
  sortDataRange() {
    debugger;

    let sortedArray = [...this.AuditTrailList].sort((a, b) => {
      const dateA = this.parseDate(a.DateCreated);
      const dateB = this.parseDate(b.DateCreated);

      return dateA.getTime() - dateB.getTime();
    });

    if (sortedArray.length !== 0) {
      debugger;
      this.generateExcelFile(sortedArray, this.fileName);
    }
  }

  private parseDate(dateString: any): Date {
   
    return new Date(dateString);
  }


  getAuditTrailDataByDateRange() {
    this.fileName = "Audit Trail From " + this.expectedStartDate + " To " + this.expectedEndType;
    this.AuditTrailList.splice(0, this.AuditTrailList.length);
    this.auditTrailService.getAllAuditTrailItems().subscribe(async (data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {

          const tempAuditTrail = {} as AuditTrailList;
          const current = data.dateSet[i];

          const dateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));

          if (dateCreated <= this.expectedEndType && dateCreated >= this.expectedStartDate) {

            
            tempAuditTrail.ApplicationID = current.applicationID;
            tempAuditTrail.AssignedTo = "Null";
            tempAuditTrail.Comment = "Null";
            tempAuditTrail.Description = current.description;
            tempAuditTrail.isInternal = current.isInternal;
            tempAuditTrail.SubDepartmentName = current.subDepartmentName;
            tempAuditTrail.ZoneName = current.zoneName;
            tempAuditTrail.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
            tempAuditTrail.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf('T'));

            const userName: string = await this.getUserNameById(current.createdById);
            tempAuditTrail.CreatedBy = userName;

            if (tempAuditTrail.isInternal == false) {

              tempAuditTrail.SubDepartmentName = "Null";
              tempAuditTrail.ZoneName = "Null";
            }

            this.AuditTrailList.push(tempAuditTrail);
          }

        }

        

      }
      else {
        alert(data.responseMessage);
      }


    }, error => {
      console.log("getAllAuditTrailItems: ", error);
    })

    this.reviewerForCommentService.getAllReviewerForCommentItems().subscribe(async (data: any) => {
      if (data.responseCode == 1) {

        
        debugger;
        for (let i = 0; i < data.dateSet.length; i++) {

          const tempAuditTrail = {} as AuditTrailList;
          const current = data.dateSet[i];

          const dateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));

          if (dateCreated <= this.expectedEndType && dateCreated >= this.expectedStartDate) {

            tempAuditTrail.ApplicationID = current.applicationID;
            tempAuditTrail.AssignedTo = await this.getUserNameById(current.reviewerAssignedToComment);
            tempAuditTrail.Comment = current.comment;
            tempAuditTrail.Description = current.commentStatus;
            tempAuditTrail.isInternal = true;
            tempAuditTrail.SubDepartmentName = current.subDepartmentName;
            tempAuditTrail.ZoneName = current.zoneName;
            tempAuditTrail.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
            tempAuditTrail.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf('T'));
            tempAuditTrail.CreatedBy = await this.getUserNameById(current.createdById);

            this.AuditTrailList.push(tempAuditTrail)
          }
        }
      }
      else {
        alert(data.responseMessage);
      }


    }, error => {
      console.log("getAllAuditTrailItems: ", error);

    })
    
  
  }
  generateExcelFile = (data: AuditTrailList[], fileName: string): void => {
    debugger;
    // Create a worksheet from JSON data with left-aligned cells
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data, {
      header: Object.keys(data[0]), // Assuming all objects have the same keys
      cellStyles: true,
    });

    // Set sheet protection options to disable editing
    ws['!protect'] = {
      selectLockedCells: false,
      selectUnlockedCells: false,
      formatCells: true,
      formatColumns: true,
      formatRows: true,
      insertRows: true,
      insertColumns: true,
      insertHyperlinks: true,
      deleteRows: true,
      deleteColumns: true,
      sort: true,
      autoFilter: true,
      pivotTables: true,
      password: this.CurrentUser.email, //Setting the password for protection , *discuss with kyle on what he wants this to be 
    };

    // Auto-size columns
    const columnLengths = data.reduce((acc, row) => {
      Object.keys(row).forEach(key => {
        const cellLength = String(row[key]).length;
        const headerLength = String(key).length;

        acc[key] = Math.max(acc[key] || 0, cellLength, headerLength);
      });


      return acc;
    }, {});

    Object.keys(columnLengths).forEach(key => {
      ws['!cols'] = ws['!cols'] || [];
      ws['!cols'].push({ wch: columnLengths[key] + 1 });
    });

    // Create the second worksheet from the second set of data
    //const ws2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data2, {
    //  header: Object.keys(data2[0]), // Assuming all objects have the same keys
    //  cellStyles: true,
    //});

    //// Set sheet protection options for the second sheet
    //ws2['!protect'] = {
    //  selectLockedCells: true,
    //  selectUnlockedCells: true,
    //  formatCells: true,
    //  formatColumns: true,
    //  formatRows: true,
    //  insertRows: true,
    //  insertColumns: true,
    //  insertHyperlinks: true,
    //  deleteRows: true,
    //  deleteColumns: true,
    //  sort: true,
    //  autoFilter: true,
    //  pivotTables: true,
    //  password: this.CurrentUser.email, // Set the password for protection
    //};

    //// Auto-size columns for the second sheet
    //const columnLengths2 = data2.reduce((acc, row) => {
    //  Object.keys(row).forEach(key => {
    //    const cellLength = String(row[key]).length;
    //    const headerLength = String(key).length;

    //    acc[key] = Math.max(acc[key] || 0, cellLength, headerLength);
    //  });
    //  return acc;
    //}, {});

    //Object.keys(columnLengths2).forEach(key => {
    //  ws2['!cols'] = ws2['!cols'] || [];
    //  ws2['!cols'].push({ wch: columnLengths2[key] + 1 });
    //});


    // Create a workbook and add both the worksheet to it
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
   /* XLSX.utils.book_append_sheet(wb, ws2, 'Sheet2');*/

    

   
    // Generate binary data from the workbook
    const binaryData: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Create a Blob from the binary data
    const blob = new Blob([binaryData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' } );
    debugger;
    // Save the file using file-saver
    FileSaver.saveAs(blob, `${fileName}.xlsx`);
  };

  getCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onCheckSelection() {
    debugger;
   
    if (this.selectionType == "byDate") {
      debugger;
      this.showDate = true;
      this.showSub = false;
      this.showZone = false;
      this.showInternalUsers = false;
    
    }
   

    if (this.selectionType == "subZone") {
      this.showSub = true;
      this.showDate = false;
      this.showInternalUsers = false;
    
    }

    if (this.selectionType == "subZoneTime") {
      this.showSubDate = true;
      this.showDate = false;
      this.showSub = false;
      this.showInternalUsers = false;
    }

    if (this.selectionType == "internalUser") {
      this.showInternalUsers = true;
      this.showSub = false;
      this.showZone = false;
      this.showSubDate = false;
    }
  }

  getAllSubdepartments() {
    this.subDepartmentService.getSubDepartmentsList().subscribe((data: any) => {
      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempSubDepartment = {} as SubDepartmentsList;
          const current = data.dateSet[i];

          tempSubDepartment.DepartmentID = current.departmentID;
          tempSubDepartment.SubDepartmentID = current.subDepartmentID;
          tempSubDepartment.SubDepartmentName = current.subDepartmentName;

          this.SubDepartmentList.push(tempSubDepartment);

        }
      }
      else {
        alert(data.responseMessage);
      }


    }, error => {
      console.log("Error: ", error);
    })
  }

  getZonesForSubDepartment() {
    this.zoneService.getZonesBySubDepartmentsID(this.selectedSubDepartment.SubDepartmentID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempZone = {} as ZonesList;
          const current = data.dateSet[i];

          tempZone.ZoneName = current.zoneName;
          tempZone.ZoneID = current.zoneID;

          this.ZonesList.push(tempZone);
        }
        this.showZone = true;
      }

      else {
        alert(data.responseMessage);
      }


    }, error => {
      console.log("Error: ", error);
    })
  }

  async getUserNameById(userId: any): Promise<string> {
    try {
      const data: any = await this.userProfileService.getUserProfileById(userId).toPromise();
      if (data.responseCode == 1) {
        const current = data.dateSet[0];
        return current.fullName;
      }
      else {
        throw new Error(data.responseMessage);
      }
    }
    catch (error: any) {
      console.log("Error:", error);
      throw error;
    }
  }

  getAuditTrailForDepartmentAndZone() {
    this.fileName = "Audit Trail For Zone " + this.zoneName + " in Sub Department " + this.selectedSubDepartment.SubDepartmentName; 
    this.AuditTrailList.splice(0, this.AuditTrailList.length);

    debugger;
    this.auditTrailService.getAllAuditTrailsItemsForSubDepartmentAndZone(this.selectedSubDepartment.SubDepartmentName, this.zoneName).subscribe(async (data: any) => {

      if (data.responseCode == 1) {



        for (let i = 0; i < data.dateSet.length; i++) {

          const tempAuditTrail = {} as AuditTrailList;
          const current = data.dateSet[i];


          tempAuditTrail.ApplicationID = current.applicationID;
          tempAuditTrail.AssignedTo = "Null";
          tempAuditTrail.Comment = "Null";
          tempAuditTrail.Description = current.description;
          tempAuditTrail.isInternal = current.isInternal;
          tempAuditTrail.SubDepartmentName = current.subDepartmentName;
          tempAuditTrail.ZoneName = current.zoneName;
          tempAuditTrail.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
          tempAuditTrail.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf('T'));

          const userName: string = await this.getUserNameById(current.createdById);
          tempAuditTrail.CreatedBy = userName;

        

          this.AuditTrailList.push(tempAuditTrail);
        }


      }
      else {
        alert(data.responseMessage);
      }


    }, error => {
      console.log("getAllAuditTrailItems: ", error);


    })

    this.reviewerForCommentService.getAllReviewersForSubDepartmentAndZone(this.selectedSubDepartment.SubDepartmentName, this.zoneName).subscribe(async (data: any) => {
      if (data.responseCode == 1) {

        debugger;
        for (let i = 0; i < data.dateSet.length; i++) {

          const tempAuditTrail = {} as AuditTrailList;
          const current = data.dateSet[i];

          tempAuditTrail.ApplicationID = current.applicationID;
          tempAuditTrail.AssignedTo = await this.getUserNameById(current.reviewerAssignedToComment);
          tempAuditTrail.Comment = current.comment;
          tempAuditTrail.Description = current.commentStatus;
          tempAuditTrail.isInternal = true;
          tempAuditTrail.SubDepartmentName = current.subDepartmentName;
          tempAuditTrail.ZoneName = current.zoneName;
          tempAuditTrail.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
          tempAuditTrail.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf('T'));
          tempAuditTrail.CreatedBy = await this.getUserNameById(current.createdById);

          this.AuditTrailList.push(tempAuditTrail)
        }

      }
      else {
        alert(data.responseMessage);
      }


    }, error => {
      console.log("getAllAuditTrailItems: ", error);

    })

  }

  getAuditTrailForDepartmentAndZoneWithinRange() {
    this.fileName = "Audit Trail For Zone " + this.zoneName + " in Sub Department " + this.selectedSubDepartment.SubDepartmentName + " From " + this.expectedStartDateSub + " To " + this.expectedEndTypeSub;
    this.AuditTrailList.splice(0, this.AuditTrailList.length);

    debugger;
    this.auditTrailService.getAllAuditTrailsItemsForSubDepartmentAndZone(this.selectedSubDepartment.SubDepartmentName, this.zoneName).subscribe(async (data: any) => {

      if (data.responseCode == 1) {



        for (let i = 0; i < data.dateSet.length; i++) {

          const tempAuditTrail = {} as AuditTrailList;
          const current = data.dateSet[i];

          const dateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
          debugger;
          if (dateCreated >= this.expectedStartDateSub && dateCreated <= this.expectedEndTypeSub)
           
          {
            debugger;
            tempAuditTrail.ApplicationID = current.applicationID;
            tempAuditTrail.AssignedTo = "Null";
            tempAuditTrail.Comment = "Null";
            tempAuditTrail.Description = current.description;
            tempAuditTrail.isInternal = current.isInternal;
            tempAuditTrail.SubDepartmentName = current.subDepartmentName;
            tempAuditTrail.ZoneName = current.zoneName;
            tempAuditTrail.DateCreated = dateCreated;
            tempAuditTrail.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf('T'));

            const userName: string = await this.getUserNameById(current.createdById);
            tempAuditTrail.CreatedBy = userName;



            this.AuditTrailList.push(tempAuditTrail);
          }
        }

      }
      else {
        alert(data.responseMessage);
      }


    }, error => {
      console.log("getAllAuditTrailItems: ", error);


    })

    this.reviewerForCommentService.getAllReviewersForSubDepartmentAndZone(this.selectedSubDepartment.SubDepartmentName, this.zoneName).subscribe(async (data: any) => {
      if (data.responseCode == 1) {

        debugger;
        for (let i = 0; i < data.dateSet.length; i++) {

          const tempAuditTrail = {} as AuditTrailList;
          const current = data.dateSet[i];
          const dateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
          debugger;
          if (dateCreated >= this.expectedStartDateSub && dateCreated <= this.expectedEndTypeSub) {
            tempAuditTrail.ApplicationID = current.applicationID;
            tempAuditTrail.AssignedTo = await this.getUserNameById(current.reviewerAssignedToComment);
            tempAuditTrail.Comment = current.comment;
            tempAuditTrail.Description = current.commentStatus;
            tempAuditTrail.isInternal = true;
            tempAuditTrail.SubDepartmentName = current.subDepartmentName;
            tempAuditTrail.ZoneName = current.zoneName;
            tempAuditTrail.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
            tempAuditTrail.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf('T'));
            tempAuditTrail.CreatedBy = await this.getUserNameById(current.createdById);

            this.AuditTrailList.push(tempAuditTrail)
          }
        }
      }
      else {
        alert(data.responseMessage);
      }


    }, error => {
      console.log("getAllAuditTrailItems: ", error);

    })

  }

  async getAllInternalUsers() {


    this.InternalUserList.splice(0, this.InternalUserList.length);

    const data: any = await this.userProfileService.getInternalUsers().toPromise();

    if (data.responseCode == 1) {
      for (let i = 0; i < data.dateSet.length; i++) {
        const current = data.dateSet[i];
        const tempAllInternalUserProfileList: InternalUserList = {
          userID: current.userID,
          fullName: current.fullName,

  
        };
        
        this.InternalUserList.push(tempAllInternalUserProfileList);

      }

      this.dataSourceUsers.data = this.InternalUserList;
      this.UserTable?.renderRows();
      this.selectedRowIndex = null;


      console.log("InternalUserProfileList", this.InternalUserList);
    } else {
      alert(data.responseMessage);
    }
    console.log("Response", data);
  } catch(error) {
    console.log("Error:", error);
  }

  getAllAuditTrailItemsForInternalUser(index: any) {
    debugger;
    const User = this.InternalUserList[index];
    this.selectedRowIndex = 0;
    this.fileName = "Reports For " + User.fullName; 
    this.AuditTrailList.splice(0, this.AuditTrailList.length);

    debugger;
    this.auditTrailService.getAllAuditTrailItemsForInternalUser(User.userID).subscribe(async (data: any) => {

      if (data.responseCode == 1) {



        for (let i = 0; i < data.dateSet.length; i++) {

          const tempAuditTrail = {} as AuditTrailList;
          const current = data.dateSet[i];


          tempAuditTrail.ApplicationID = current.applicationID;
          tempAuditTrail.AssignedTo = "Null";
          tempAuditTrail.Comment = "Null";
          tempAuditTrail.Description = current.description;
          tempAuditTrail.isInternal = current.isInternal;
          tempAuditTrail.SubDepartmentName = current.subDepartmentName;
          tempAuditTrail.ZoneName = current.zoneName;
          tempAuditTrail.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
          tempAuditTrail.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf('T'));

          const userName: string = await this.getUserNameById(current.createdById);
          tempAuditTrail.CreatedBy = userName;



          this.AuditTrailList.push(tempAuditTrail);
        }


      }
      else {
        alert(data.responseMessage);
      }


    }, error => {
      console.log("getAllAuditTrailItemsForInternalUser: ", error);


    })

    this.reviewerForCommentService.getAllReviewersForCommentsByUser(User.userID).subscribe(async (data: any) => {
      if (data.responseCode == 1) {

        debugger;
        for (let i = 0; i < data.dateSet.length; i++) {

          const tempAuditTrail = {} as AuditTrailList;
          const current = data.dateSet[i];

          tempAuditTrail.ApplicationID = current.applicationID;
          tempAuditTrail.AssignedTo = await this.getUserNameById(current.reviewerAssignedToComment);
          tempAuditTrail.Comment = current.comment;
          tempAuditTrail.Description = current.commentStatus;
          tempAuditTrail.isInternal = true;
          tempAuditTrail.SubDepartmentName = current.subDepartmentName;
          tempAuditTrail.ZoneName = current.zoneName;
          tempAuditTrail.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
          tempAuditTrail.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf('T'));
          tempAuditTrail.CreatedBy = await this.getUserNameById(current.createdById);

          this.AuditTrailList.push(tempAuditTrail)
        }

      }
      else {
        alert(data.responseMessage);
      }


    }, error => {
      console.log("getAllAuditTrailItems: ", error);

    })
    this.InternalUserList.splice(0, this.InternalUserList.length);
    this.InternalUserList.push(User);
  }

  applyInternalClientFilter(event: Event): void {

    //this.ClientUserList.splice(0, this.ClientUserList.length);

    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    console.log('Filtering with:', filterValue);

    if (filterValue === '') {
      // If the filter is empty, reset the dataSource to the original data
      this.dataSourceUsers.data = [...this.InternalUserList];
      this.newInternalList = [];
    } else {
      // Apply the filter to the dataSource based on columns 'idNumber' and 'fullName'
      this.dataSourceUsers.data = this.InternalUserList.filter((user: any) => {
        return (
          (user.idNumber?.toLowerCase() || '').includes(filterValue) ||
          (user.fullName?.toLowerCase() || '').includes(filterValue)
        );
      });

      this.newInternalList = [...this.dataSourceUsers.data];
    }
    console.log('Filtered Data:', this.newInternalList);
    // Render the rows after applying the filter
    this.UserTable?.renderRows();
  }
  
}

//Audit Trail Kyle          
