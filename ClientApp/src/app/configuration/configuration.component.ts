import { Component, OnInit,Input, ViewChild } from '@angular/core';
import { NavMenuComponent } from 'src/app/nav-menu/nav-menu.component';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { SharedService } from '../shared/shared.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DepartmentsService } from '../service/Departments/departments.service';
import { MatTable } from '@angular/material/table';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FrequentlyAskedQuestionsService } from '../service/FAQ/frequently-asked-questions.service';
export interface DepartmentList {
  departmentID: number;
  departmentName: string;
  dateUpdated: any;
  dateCreated: any;
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


  FAQList: FAQList[] = [];
  constructor(private router: Router, private shared: SharedService, private departmentService: DepartmentsService, private modalService: NgbModal, private faq: FrequentlyAskedQuestionsService) { }

  ngOnInit() {

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    this.getAllDepartments();
    this.getAllFAQ();
  }

  displayedColumns: string[] = ['departmentName', 'actions'];
  dataSource = this.DepartmentList;

  @ViewChild(MatTable) DepartmentListTable: MatTable<DepartmentList> | undefined;


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



  onFAQDelete(index:any) {
    if (confirm("Are you sure to delete this question?" + this.FAQList[index].FAQID)) {
      debugger;
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

}
