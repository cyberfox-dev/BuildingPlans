import { Component, OnInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { UntypedFormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubDepartmentsService } from '../service/SubDepartments/sub-departments.service';
import { MatTable } from '@angular/material/table';
import { CommentBuilderService } from '../service/CommentBuilder/comment-builder.service';
import { ServiceItemService } from 'src/app/service/ServiceItems/service-item.service';
import { SelectionModel } from '@angular/cdk/collections';
import { SubDepartmentForCommentService } from 'src/app/service/SubDepartmentForComment/sub-department-for-comment.service';
import { ZonesService } from '../service/Zones/zones.service';
import { ZoneForCommentService} from '../service/ZoneForComment/zone-for-comment.service';

export interface SubDepartmentList {
  subDepartmentID: number;
  subDepartmentName: string;
  departmentID: number;
  dateUpdated: any;
  dateCreated: any;
  subdepartmentForCommentID: number | null;
}

export interface ServiceItemList {
  serviceItemID: number;
  serviceItemCode: string;
  Description: string;
  Rate: any;
  totalVat: number;
  dateCreated: any;
}

export interface ZoneList {
  zoneID: number;
  zoneName: string;
  departmentID: number;
  subDepartmentID: number;
  zoneForCommentID: number | null;
}

export interface CommentList {
  CommentID: number;
  Comment: string;
  DateCreated: string;
  createdBy: any;
}

export interface CommentDropDown {
  commentID: number;
  commentName: string;
}
export interface ServiceItemCodeDropdown {
  serviceItemID: number;
  serviceItemCode: string;
}

export interface ZoneList {
  zoneID: number;
  zoneName: string;
  departmentID: number;
  subDepartmentID: number;
}




@Component({
  selector: 'app-action-center',
  templateUrl: './action-center.component.html',
  styleUrls: ['./action-center.component.css']

})
export class ActionCenterComponent implements OnInit {




  @Input() ApplicationID: any;
  /*textfields*/

  public depositRequired = this.formBuilder.group({
    /*viewSelectedSubDep: ['', Validators.required],*/
    selectServiceItemCode: ['', Validators.required],
    description: ['', Validators.required],
    rate: ['', Validators.required],
    quantity: ['', Validators.required],
    total: ['', Validators.required],


  })

  checked: boolean = false;



  SubDepartmentList: SubDepartmentList[] = [];
  SubDepartmentLinkedList: SubDepartmentList[] = [];
  CommentList: CommentList[] = [];
  CommentDropDown: CommentDropDown[] = [];
  ServiceItemCodeDropdown: ServiceItemCodeDropdown[] = [];
  ServiceItemList: ServiceItemList[] = [];

  ZoneList: ZoneList[] = [];
  ZoneLinkedList: ZoneList[] = [];

  selection = new SelectionModel<SubDepartmentList>(true, []);
  zoneSelection = new SelectionModel<ZoneList>(true, []);

  displayedColumnsSubDepartment: string[] = ['subDepartmentName', 'actions'];
  dataSourceSubDepartment = this.SubDepartmentList;

  displayedColumnsLinkedSubDepartment: string[] = ['subDepartmentName', 'actions'];
  dataSourceLinkedSubDepartment = this.SubDepartmentLinkedList;

  displayedColumnsViewLinkedSubZones: string[] = ['zoneName', 'actions'];
  dataSourceViewLinkedSubZones = this.ZoneList;

  displayedColumnsViewLinkedZones: string[] = ['zoneName', 'actions'];
  dataSourceViewLinkedZones = this.ZoneLinkedList;

  @ViewChild(MatTable) SubDepartmentListTable: MatTable<SubDepartmentList> | undefined;
  @ViewChild(MatTable) SubDepartmentLinkedListTable: MatTable<SubDepartmentList> | undefined;
  @ViewChild(MatTable) ZoneListTable: MatTable<ZoneList> | undefined;



  closeResult!: string;
    stringifiedDataUserProfile: any;
    CurrentUserProfile: any;
    loggedInUsersIsAdmin: any;
    loggedInUsersDepartment: void;
    loggedInUsersSubDepartmentID: any;
    AssignProjectToZone: boolean;
  constructor(
    private offcanvasService: NgbOffcanvas,
    private modalService: NgbModal,
    private _snackBar: MatSnackBar,
    private subDepartment: SubDepartmentsService,
    private commentService: CommentBuilderService,
    private formBuilder: FormBuilder,
    private serviceItemService: ServiceItemService,
    private subDepartmentForCommentService: SubDepartmentForCommentService,
    private zoneService: ZonesService,
    private zoneForCommentService: ZoneForCommentService
  ) { }
  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  stringifiedData: any;
  CurrentUser: any;

  leaveAComment = "";
  ngOnInit(): void {
    this.getAllSubDepartments();
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    if (this.CurrentUser == null) {
      console.log("Not");
    }
    else {
      console.log(this.CurrentUser);
    }
    /*  this.getAllServiceItmes();*/
    this.getAllServiceItmesForDropdown();
    
    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);
    this.loggedInUsersIsAdmin = this.CurrentUserProfile[0].isDepartmentAdmin;
    this.loggedInUsersSubDepartmentID = this.CurrentUserProfile[0].subDepartmentID;
    this.getAllUsersLinkedToZone(this.loggedInUsersSubDepartmentID);
    this.getLinkedZones();

  }

  setRoles() {
   
    for (var i = 0; i < this.SubDepartmentLinkedList.length; i++) {
      if (this.SubDepartmentLinkedList[i].subDepartmentID == this.loggedInUsersSubDepartmentID && this.loggedInUsersIsAdmin == true) {
        this.AssignProjectToZone = true;
        

      }
    }
  }

  getAllUsersLinkedToZone(SubDepartmentID: any) {
    this.ZoneList.splice(0, this.ZoneList.length);
  
    this.zoneService.getZonesBySubDepartmentsID(SubDepartmentID).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempZoneList = {} as ZoneList;
          const current = data.dateSet[i];
          tempZoneList.zoneID = current.zoneID;
          tempZoneList.zoneName = current.zoneName;
          tempZoneList.subDepartmentID = current.subDepartmentID;
          tempZoneList.departmentID = current.departmentID;
     

          this.ZoneList.push(tempZoneList);
          this.ZoneListTable?.renderRows();

        }
        console.log("this.ZoneListthis.ZoneListthis.ZoneListthis.ZoneList", this.ZoneList);
        this.ZoneListTable?.renderRows();
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

  openXl(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }
  depositReqModal(deposit: any) {
    this.modalService.open(deposit, { backdrop: 'static', size: 'xl' });
  }

  openAssignToZone(assignProjectToZone: any) {
    //this.getAllSubDepartments();
    
    this.modalService.open(assignProjectToZone, { backdrop: 'static', size: 'xl' });
  }
  openAssignDepartment(assign: any) {
    this.modalService.open(assign, { backdrop: 'static', size: 'xl' });
  }

  uncheck() {
    this.checked = false;
  }
  check() {
    this.checked = true;
  }
  panelOpenState = false;


  getAllSubDepartments() {

    this.SubDepartmentList.splice(0, this.SubDepartmentList.length);
    this.SubDepartmentLinkedList.splice(0, this.SubDepartmentLinkedList.length);

    this.subDepartment.getAllNotLinkedSubDepartmentsForComment(this.ApplicationID).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempSubDepartmentList = {} as SubDepartmentList;
          const current = data.dateSet[i];
          tempSubDepartmentList.subDepartmentID = current.subDepartmentID;
          tempSubDepartmentList.subDepartmentName = current.subDepartmentName;
          tempSubDepartmentList.departmentID = current.departmentID;
          tempSubDepartmentList.dateUpdated = current.dateUpdated;
          tempSubDepartmentList.dateCreated = current.dateCreated;
          this.SubDepartmentList.push(tempSubDepartmentList);
          this.SubDepartmentListTable?.renderRows();
        }
       
        this.SubDepartmentListTable?.renderRows();
       // this.modalService.open(assign, { size: 'xl' });
      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);
        this.SubDepartmentListTable?.renderRows();

      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })


    this.subDepartment.getAllLinkedSubDepartmentsForComment(this.ApplicationID).subscribe((data: any) => {

      if (data.responseCode == 1) {


     

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempSubDepartmentLinkedList = {} as SubDepartmentList;
          const current = data.dateSet[i];
          tempSubDepartmentLinkedList.subDepartmentID = current.subDepartmentID;
          tempSubDepartmentLinkedList.subDepartmentName = current.subDepartmentName;
          tempSubDepartmentLinkedList.departmentID = current.departmentID;
          tempSubDepartmentLinkedList.dateUpdated = current.dateUpdated;
          tempSubDepartmentLinkedList.dateCreated = current.dateCreated;
          tempSubDepartmentLinkedList.subdepartmentForCommentID = current.subDepartmentForCommentID;

          this.SubDepartmentLinkedList.push(tempSubDepartmentLinkedList);
          this.SubDepartmentListTable?.renderRows();
        }
        this.setRoles();
        this.SubDepartmentListTable?.renderRows();
        this.SubDepartmentLinkedListTable?.renderRows();
       // this.modalService.open(assign, { size: 'xl' });
      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);
        this.SubDepartmentListTable?.renderRows();
        this.SubDepartmentLinkedListTable?.renderRows();

      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })

  }

  deleteLinkedDepartmentForComment(index: number) {
    debugger;
   
    if (confirm("Are you sure to delete " + this.SubDepartmentLinkedList[index].subDepartmentName + "?")) {
     
      this.subDepartmentForCommentService.deleteDepartmentForComment(this.SubDepartmentLinkedList[index].subdepartmentForCommentID).subscribe((data: any) => {

        if (data.responseCode == 1) {

          alert(data.responseMessage);
         
        }
        else {
          alert(data.responseMessage);
          
        }
        console.log("reponse", data);

      }, error => {
        console.log("Error: ", error);
      })


    }
  }

  populateComment(commentName: any) {
    let currnetComment = this.leaveAComment;
    console.log("commentName", commentName);
    this.leaveAComment = currnetComment+" "+commentName;
  }

  getAllCommentsByUserID() {

    this.CommentDropDown.splice(0, this.CommentDropDown.length);

    this.commentService.getCommentByUserID(this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempCommentDropDown = {} as CommentDropDown;
          const current = data.dateSet[i];
          tempCommentDropDown.commentID = current.commentID;
          tempCommentDropDown.commentName = current.commentName;



          this.CommentDropDown.push(tempCommentDropDown);

        }
        console.log("Got all comments", data.dateSet);
      }
      else {
        alert(data.responseMessage);
      }

      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  selectServiceItemCode(event: any, deposit: any) {

  }

  getAllServiceItmesForDropdown() {


    this.serviceItemService.getAllServiceItem().subscribe((data: any) => {
      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempServiceItemList = {} as ServiceItemCodeDropdown;
          const current = data.dateSet[i];
          tempServiceItemList.serviceItemID = current.serviceItemID;
          tempServiceItemList.serviceItemCode = current.serviceItemCode;

          this.ServiceItemCodeDropdown.push(tempServiceItemList);
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

  //getAllServiceItmes() {
  //  this.ServiceItemList.splice(0, this.ServiceItemList.length);

  //  this.serviceItemService.getAllServiceItem().subscribe((data: any) => {
  //    if (data.responseCode == 1) {


  //      for (let i = 0; i < data.dateSet.length; i++) {
  //        const tempServiceItemList = {} as ServiceItemList;
  //        const current = data.dateSet[i];
  //        tempServiceItemList.serviceItemID = current.serviceItemID;
  //        tempServiceItemList.serviceItemCode = current.serviceItemCode;
  //        tempServiceItemList.Description = current.description;
  //        tempServiceItemList.Rate = current.rate;
  //        tempServiceItemList.totalVat = current.totalVat;
  //        tempServiceItemList.dateCreated = current.dateCreated;
  //        this.ServiceItemList.push(tempServiceItemList);
  //      }

  //    }
  //    else {
  //      //alert("Invalid Email or Password");
  //      alert(data.responseMessage);
  //    }
  //    console.log("reponse", data);

  //  }, error => {
  //    console.log("Error: ", error);
  //  })
  // 

  //}

  onPopulateDeposit(event: any) {
    let selectedServiceItem = Number(this.depositRequired.controls["selectServiceItemCode"].value);

    console.log("THIS IS THE SERVICE ITEM CODE", selectedServiceItem);

    this.serviceItemService.getServiceItemByServiceItemID(selectedServiceItem).subscribe((data: any) => {
      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempServiceItemList = {} as ServiceItemList;
          const current = data.dateSet[i];
          tempServiceItemList.serviceItemID = current.serviceItemID;
          tempServiceItemList.serviceItemCode = current.serviceItemCode;

          this.depositRequired.controls["description"].setValue(current.description);
          this.depositRequired.controls["rate"].setValue(current.rate);
          this.depositRequired.controls["total"].setValue(current.totalVat);

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

  departmentSelectedForLink(department: any) {
    
    this.selection.toggle(department);

  }

  zoneSelectedForLink(zone: any) {

    this.zoneSelection.toggle(zone);

  }

  onLinkDepartmentForComment() {

    debugger;

    const selectDepartments = this.selection.selected;




    for (var i = 0; i < selectDepartments.length; i++) {
      this.subDepartmentForCommentService.addUpdateDepartmentForComment(0, this.ApplicationID, selectDepartments[i].subDepartmentID, selectDepartments[i].subDepartmentName, null, null, this.CurrentUser.appUserId).subscribe((data: any) => {

        if (data.responseCode == 1) {

          alert(data.dateSet.subDepartmentName + " assigned to this Application");

        }
        else {

          alert(data.responseMessage);
        }
        console.log("reponseAddUpdateDepartmentForComment", data);


      }, error => {
        console.log("Error: ", error);
      })
    }



  }


  onLinkZoneForComment() {

    debugger;

    const selectZones = this.zoneSelection.selected;




    for (var i = 0; i < selectZones.length; i++) {
      this.zoneForCommentService.addUpdateZoneForComment(0, selectZones[i].subDepartmentID, this.ApplicationID, selectZones[i].zoneID, selectZones[i].zoneName ,this.CurrentUser.appUserId).subscribe((data: any) => {

        if (data.responseCode == 1) {

          alert(data.dateSet.zoneName + " assigned to this Application");
         this.getLinkedZones();
        }
        else {

          alert(data.responseMessage);
        }
        console.log("reponseAddUpdateZoneForComment", data);


      }, error => {
        console.log("Error: ", error);
      })
    }



  }


  getLinkedZones() {
    this.ZoneLinkedList.splice(0, this.ZoneLinkedList.length);
    debugger;
    this.zoneForCommentService.getZonesForComment(this.ApplicationID, this.loggedInUsersSubDepartmentID).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempZoneList = {} as ZoneList;
          const current = data.dateSet[i];
          tempZoneList.zoneID = current.zoneID;
          tempZoneList.zoneName = current.zoneName;
          tempZoneList.subDepartmentID = current.subDepartmentID;
          tempZoneList.departmentID = current.departmentID;
          tempZoneList.zoneForCommentID = current.zoneForCommentID;


          this.ZoneLinkedList.push(tempZoneList);
          this.ZoneListTable?.renderRows();

        }
       
        this.ZoneListTable?.renderRows();
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

  getLinkedDepartments() {


    this.subDepartmentForCommentService.getSubDepartmentForComment(this.ApplicationID).subscribe((data: any) => {

      if (data.responseCode == 1) {


        for (var i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempSubDepartmentList = {} as SubDepartmentList;
          tempSubDepartmentList.subDepartmentID = current.subDepartmentID;
          tempSubDepartmentList.subDepartmentName = current.subDepartmentName;
          tempSubDepartmentList.departmentID = current.departmentID;
          tempSubDepartmentList.dateUpdated = current.dateUpdated;
          tempSubDepartmentList.dateCreated = current.dateCreated;
          this.selection.toggle(tempSubDepartmentList);
          this.selection.isSelected(tempSubDepartmentList);

        }

      }
      else {

        alert(data.responseMessage);
      }
      console.log("reponseGetSubDepartmentForComment", data);


    }, error => {
      console.log("Error: ", error);
    })

  }


  deleteLinkedZoneForComment(index: number) {
    debugger;

    if (confirm("Are you sure to delete " + this.ZoneLinkedList[index].zoneName + "?")) {

      this.zoneForCommentService.deleteZoneForComment(this.ZoneLinkedList[index].zoneForCommentID).subscribe((data: any) => {

        if (data.responseCode == 1) {

          alert(data.responseMessage);
          this.getLinkedZones();
        }
        else {
          alert(data.responseMessage);

        }
        console.log("reponse", data);

      }, error => {
        console.log("Error: ", error);
      })


    }
  }

}





