import { Component, OnInit,Input, ViewChild } from '@angular/core';
import { NavMenuComponent } from 'src/app/nav-menu/nav-menu.component';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { SharedService } from '../shared/shared.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DepartmentsService } from '../service/Departments/departments.service';
import { MatTable } from '@angular/material/table';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FrequentlyAskedQuestionsService } from '../service/FAQ/frequently-asked-questions.service';
import { AccessGroupsService } from '../service/AccessGroups/access-groups.service';
export interface DepartmentList {
  departmentID: number;
  departmentName: string;
  dateUpdated: any;
  dateCreated: any;
}
export interface RolesList {
  RoleID: number;
  RoleName: string;
  AccessGroupID: number;
  AccessGroupName: string;
}
export interface FAQList {
  FAQID: number;
  Question: string;
  Answer: string;
  DateCreated: Date;
  DateUpdated: any;
}

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  CurrentDepartmentID: any;
  DepartmentList: DepartmentList[] = [];
  question = '';
  answer = '';
  CurrentUser: any;
  stringifiedData: any;

  RolesList: RolesList[] = [];
  FAQList: FAQList[] = [];
  constructor(private router: Router, private shared: SharedService, private departmentService: DepartmentsService, private modalService: NgbModal, private faq: FrequentlyAskedQuestionsService, private accessGroupsService: AccessGroupsService) { }

  ngOnInit() {

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    this.getAllDepartments();
    this.getAllFAQ();
    this.getRolesLinkedToUser();
  }

  displayedColumns: string[] = ['departmentName', 'actions'];
  dataSource = this.DepartmentList;

  @ViewChild(MatTable) DepartmentListTable: MatTable<DepartmentList> | undefined;

  isCSVVisible: boolean = false;
  isAccessGroupsVisible: boolean = false;

  getAllDepartments() {
    this.departmentService.getDepartmentsList().subscribe((data: any) => {

      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDepartmentList = {} as DepartmentList;
          const current = data.dateSet[i];
          tempDepartmentList.departmentID = current.departmentID;
          tempDepartmentList.departmentName = current.departmentName;
          tempDepartmentList.dateUpdated = current.dateUpdated;
          tempDepartmentList.dateCreated = current.dateCreated;
          this.DepartmentList.push(tempDepartmentList);

        }
        this.DepartmentListTable?.renderRows();
        //this.DepartmentList = data.dateSet;


        console.log("DepartmentList", this.DepartmentList);
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

  openFAQModal(FAQModal: any) {
    this.modalService.open(FAQModal, { centered: true, size: 'xl' })
  }


  addFAQ() {
    this.faq.addUpdateFAQ(0, this.question, this.answer, this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {
        alert(data.responseMessage);

        this.getAllFAQ();

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

  getAllFAQ() {
    this.faq.getAllFAQ().subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempfaqList = {} as FAQList;
          const current = data.dateSet[i];
          tempfaqList.FAQID = current.faqID;
          tempfaqList.Question = current.question;
          tempfaqList.Answer = current.answer;
          tempfaqList.DateCreated = current.dateCreated;
          tempfaqList.DateUpdated = current.dateUpdated;
          this.FAQList.push(tempfaqList);
        }

        console.log("FAQLIST", this.FAQList);
      }
      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }



  onFAQDelete(index: any) {
    if (confirm("Are you sure to delete this question?" + this.FAQList[index].Question)) {
      
      this.faq.deleteFAQ(this.FAQList[index].FAQID).subscribe((data: any) => {
        

        if (data.responseCode == 1) {


          alert(data.responseMessage);

          this.getAllFAQ();
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

  lockViewAccordingToRoles() {



    for (var i = 0; i < this.RolesList.length; i++) {

      if (this.RolesList[i].RoleName == "Developer Config") {
 
      }
      if (this.RolesList[i].RoleName == "Developer Config" || this.RolesList[i].RoleName == "Configuration") {
      
      }

      if (this.RolesList[i].RoleName == "Department Admin" || this.RolesList[i].RoleName == "EMB" || this.RolesList[i].RoleName == "Developer Config") {

      }
    }


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
          this.lockViewAccordingToRoles();


        }

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

}
