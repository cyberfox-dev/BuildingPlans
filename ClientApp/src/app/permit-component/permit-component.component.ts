import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {PermitService } from  'src/app/service/Permit/permit.service'


//PTC = Permit To Comment
export interface PTCList {
  ZoneName: any;
  ZoneID: any;
  PermitSubForCommentID: number;
  ApplicationID: number;
  SubDepartmentID: number;
  UserAssaignedToComment: string;
  SubDepartmentName: string;
  PermitComment: string;
  PermitCommentStatus: string;

}

@Component({
  selector: 'app-permit-component',
  templateUrl: './permit-component.component.html',
  styleUrls: ['./permit-component.component.css']
})

export class PermitComponentComponent implements OnInit {

  PTCList: PTCList[] = [];
  displayedColumns: string[] = ['subDepartmentName','zoneName' ,'comment' ,'indication'];
  dataSource = this.PTCList;
  MeetOnSite = "MeetOnSite";
  Approved = "Approved";
  Rejected = "Rejected";
  null = null;
  @ViewChild(MatTable) PTCListTable: MatTable<PTCList> | undefined;
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private permitService: PermitService) { }

  ngOnInit(): void {
    this.getAllPermitForComment();
  }

  @Input() ApplicationID;

  openPermitModal(content:any) {

    this.modalService.open(content, { size: 'lg' });
  }

  getAllPermitForComment() {

    this.permitService.getPermitSubForCommentByApplicationID(this.ApplicationID).subscribe((data: any) => {
      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempPTCList = {} as PTCList;
          const current = data.dateSet[i];
          tempPTCList.PermitSubForCommentID = current.permitSubForCommentID;
          tempPTCList.ApplicationID = current.applicationID;
          tempPTCList.SubDepartmentID = current.subDepartmentID;
          tempPTCList.SubDepartmentName = current.subDepartmentName;
          tempPTCList.UserAssaignedToComment = current.userAssaignedToComment;
          if (current.permitComment == null) {
            tempPTCList.PermitComment = "Awaiting Comment...";
          }
          else {
            tempPTCList.PermitComment = current.permitComment;
          }
          
          tempPTCList.PermitCommentStatus = current.permitCommentStatus;
          tempPTCList.ZoneID = current.zoneID;
          tempPTCList.ZoneName = current.zoneName;


          this.PTCList.push(tempPTCList);

        }
        this.PTCListTable?.renderRows();

      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);
      }
      this.PTCListTable?.renderRows();
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }


}
