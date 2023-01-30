import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubDepartmentsService } from '../service/SubDepartments/sub-departments.service';
import { MatTable } from '@angular/material/table';
import { CommentBuilderService } from '../service/CommentBuilder/comment-builder.service';

export interface SubDepartmentList {
  subDepartmentID: number;
  subDepartmentName: string;
  departmentID: number;
  dateUpdated: any;
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


@Component({
  selector: 'app-action-center',
  templateUrl: './action-center.component.html',
  styleUrls: ['./action-center.component.css']

})
export class ActionCenterComponent implements OnInit {

  /*textfields*/
  serviceItemName = '';
  description = '';
  rate = '';
  quantity = '';
  total = '';
  checked: boolean = false;



  SubDepartmentList: SubDepartmentList[] = [];
  CommentList: CommentList[] = [];
  CommentDropDown: CommentDropDown[] = [];

  displayedColumnsSubDepartment: string[] = [ 'subDepartmentName', 'actions'];
  dataSourceSubDepartment = this.SubDepartmentList;

  @ViewChild(MatTable) SubDepartmentListTable: MatTable<SubDepartmentList> | undefined;


  closeResult!: string;
  constructor(private offcanvasService: NgbOffcanvas, private modalService: NgbModal, private _snackBar: MatSnackBar, private subDepartment: SubDepartmentsService, private commentService: CommentBuilderService) { }
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




}





