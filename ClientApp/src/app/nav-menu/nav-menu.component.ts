import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DepartmentConfigComponent } from 'src/app/department-config/department-config.component';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SharedService } from '../shared/shared.service';
import { RolesService } from '../service/Roles/roles.service';
import { MatTable } from '@angular/material/table';
import { CommentBuilderService } from '../service/CommentBuilder/comment-builder.service';


export interface CommentList {
  CommentID: number;
  Comment: string;
  DateCreated: string;
  createdBy:any;
}

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;
  configShow: number | undefined;

  CommentList: CommentList[] = [];
  forEditIndex: any;
  public addComment = this.formBuilder.group({
    newCommentName: ['', Validators.required],

  })

  public editComments = this.formBuilder.group({
    editCommentName: ['', Validators.required],
  })

  constructor(private modalService: NgbModal, private router: Router, private shared: SharedService, private formBuilder: FormBuilder, private commentService: CommentBuilderService) { }

  displayedColumns: string[] = ['Comment', 'actions'];
  dataSource = this.CommentList;
  @ViewChild(MatTable) commentTable: MatTable<CommentList> | undefined;

  stringifiedData: any;
  CurrentUser: any;

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


  onCommentCreate(commentBuilder: any) {
    let newCommentName = this.addComment.controls["newCommentName"].value;
   

    this.CommentList.splice(0, this.CommentList.length);
 
    this.commentService.addUpdateComment(null, newCommentName,this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {
        this.addComment.controls["newCommentName"].setValue(null);
        this.getAllCommentsByUserID(commentBuilder);
      }
      else {
        alert("Please type a comment");
      }
 
      console.log("response", data);
    }, error => {
      console.log("Error", error);
    })
  }

  getAllCommentsByUserID(commentBuilder: any) {
   
   


      this.CommentList.splice(0, this.CommentList.length);

      this.commentService.getCommentByUserID(this.CurrentUser.appUserId).subscribe((data: any) => {

        if (data.responseCode == 1) {


          for (let i = 0; i < data.dateSet.length; i++) {
            const tempCommentList = {} as CommentList;
            const current = data.dateSet[i];
            tempCommentList.CommentID = current.commentID;
            tempCommentList.Comment = current.commentName;
            tempCommentList.DateCreated = current.dateCreated;


            this.CommentList.push(tempCommentList);

          }

          this.commentTable?.renderRows();
          this.closeCommentBuilder(commentBuilder);
          this.openCommentBuilder(commentBuilder);

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

  

  onCommentDelete(index: any, commentBuilder: any) {
    console.log(this.CommentList[index].Comment);
    if (confirm("Are you sure to delete " + this.CommentList[index].Comment + "?")) {

      this.commentService.deleteComment(Number(this.CommentList[index].CommentID)).subscribe((data: any) => {
        this.CommentList.splice(0, this.CommentList.length);

        if (data.responseCode == 1) {

          alert(data.responseMessage);
          this.getAllCommentsByUserID(commentBuilder);
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

  onCommentEdit(index: any, commentBuilder: any, editComment: any) {
    

    
   
    
  }
  onEditCommentSave(commentBuilder: any) {
    let editCommentName = this.editComments.controls["editCommentName"].value;
    this.commentService.addUpdateComment(this.CommentList[this.forEditIndex].CommentID.toString(), editCommentName, null).subscribe((data: any) => {
      if (data.responseCode == 1) {
        alert(data.responseMessage);
        this.getAllCommentsByUserID(commentBuilder);
      }
      else {
        alert(data.responseMessage);
      }
      console.log("response", data);
    }, error => {
      console.log("Error", error);
    })
  }




/*routes for nav buttons*/
  goToConfig() {
    this.router.navigate(["/configuration"]);
  }

  goToSettings() {
    this.router.navigate(["/user-settings"]);
  }
  goToCyberfoxCofig() {
    this.router.navigate(["/cyberfox-config"]);
  }

  openCommentBuilder(commentBuilder:any) {
    this.modalService.open(commentBuilder, { centered:true,size: 'xl' });
  }

  closeCommentBuilder(commentBuilder: any) {
    this.modalService.dismissAll(commentBuilder);
  }

  openCreateNewComment(createNewComment : any) {
    this.modalService.open(createNewComment, { centered: true, size: 'lg' });
  }
  viewEditComment(editComment: any, index: any) {
    this.editComments.controls["editCommentName"].setValue(this.CommentList[index].Comment);
    this.forEditIndex = index;
    this.modalService.open(editComment, { centered: true, size: 'lg' });
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  openModal() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;

    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.modalService.open(DepartmentConfigComponent);
  }

  openXl(content: any) {
		this.modalService.open(content, { size: 'xl' });
  }


  goHome() {
    this.router.navigate(["/home"]);
  }


  

}
