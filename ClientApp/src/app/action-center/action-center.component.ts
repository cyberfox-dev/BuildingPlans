import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubDepartmentsService } from '../service/SubDepartments/sub-departments.service';
import { MatTable } from '@angular/material/table';
import { CommentBuilderService } from '../service/CommentBuilder/comment-builder.service';
import { ServiceItemService } from 'src/app/service/ServiceItems/service-item.service';

export interface SubDepartmentList {
  subDepartmentID: number;
  subDepartmentName: string;
  departmentID: number;
  dateUpdated: any;
  dateCreated: any;
}

export interface ServiceItemList {
  serviceItemID: number;
  serviceItemCode: string;
  Description: string;
  Rate: any;
  totalVat: number;
  dateCreated: any;
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

@Component({
  selector: 'app-action-center',
  templateUrl: './action-center.component.html',
  styleUrls: ['./action-center.component.css']

})
export class ActionCenterComponent implements OnInit {

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
  CommentList: CommentList[] = [];
  CommentDropDown: CommentDropDown[] = [];
  ServiceItemCodeDropdown: ServiceItemCodeDropdown[] = [];
  ServiceItemList: ServiceItemList[] = [];

  displayedColumnsSubDepartment: string[] = [ 'subDepartmentName', 'actions'];
  dataSourceSubDepartment = this.SubDepartmentList;

  @ViewChild(MatTable) SubDepartmentListTable: MatTable<SubDepartmentList> | undefined;


  closeResult!: string;
  constructor(private offcanvasService: NgbOffcanvas, private modalService: NgbModal, private _snackBar: MatSnackBar, private subDepartment: SubDepartmentsService, private commentService: CommentBuilderService, private formBuilder: FormBuilder, private serviceItemService: ServiceItemService) { }
  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  stringifiedData: any;
  CurrentUser: any;

  leaveAComment = "";
  ngOnInit(): void {

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
 

  }
  openXl(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }
  depositReqModal(deposit: any) {
    this.modalService.open(deposit, { backdrop: 'static',size: 'xl' });


  }
  uncheck() {
    this.checked = false;
  }
  check() {
    this.checked = true;
  }
  panelOpenState = false;


  getAllSubDepartments(assign: any) {

    this.SubDepartmentList.splice(0, this.SubDepartmentList.length);
    
  this.subDepartment.getSubDepartmentsList().subscribe((data: any) => {

    if (data.responseCode == 1) {

      for (let i = 0; i < data.dateSet.length; i++) {
        const tempSubDepartmentList = {} as SubDepartmentList;
        const current = data.dateSet[i];
        tempSubDepartmentList.subDepartmentID = current.SubDepartmentID;
        tempSubDepartmentList.subDepartmentName = current.subDepartmentName;
        tempSubDepartmentList.departmentID = current.departmentID;
        tempSubDepartmentList.dateUpdated = current.dateUpdated;
        tempSubDepartmentList.dateCreated = current.dateCreated;
        this.SubDepartmentList.push(tempSubDepartmentList);
        this.SubDepartmentListTable?.renderRows();
      }

      this.SubDepartmentListTable?.renderRows();
      this.modalService.open(assign, { size: 'xl' });
    }
    else {
      //alert("Invalid Email or Password");
      alert(data.responseMessage);
      this.SubDepartmentListTable?.renderRows();
      this.modalService.open(assign, { size: 'xl' });
    }
    console.log("reponse", data);

  }, error => {
    console.log("Error: ", error);
  })
  }

  populateComment(commentName:any) {
    console.log("commentName", commentName);
    this.leaveAComment = commentName;
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

  onPopulateDeposit(event:any) {
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
}





