import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GlCodeService } from '../service/GLCode/gl-code.service';
import { DepartmentsService } from '../service/Departments/departments.service';
import { SelectionModel } from '@angular/cdk/collections';


export interface GLCodeList {
  glCodeID: number;
  glCodeName: string;
  dateCreated: any;
  profitCenter: string;
  departmentID: number;
  departmentName: string;
}

export interface GLCodeLinkedList {
  glCodeID: number;
  glCodeName: string;
  dateCreated: any;
  profitCenter: string;
  departmentID: number;
  departmentName: string;
}

export interface DepartmentList {
  departmentID: number;
  departmentName: string;
  dateUpdated: any;
  dateCreated: any;
  hasSubDepartment: boolean;
}

@Component({
  selector: 'app-gl-code-config',
  templateUrl: './gl-code-config.component.html',
  styleUrls: ['./gl-code-config.component.css']
})
export class GlCodeConfigComponent implements OnInit {
  forEditIndex: any;
  GLCodeList: GLCodeList[]=[];
  DepartmentList: DepartmentList[] = [];
  GLCodeLinkedList: GLCodeLinkedList[] = [];

  public addGlCode = this.formBuilder.group({
    newGlCode: ['', Validators.required],
    newProfitCenter: ['', Validators.required]

  })

  public editGlCode = this.formBuilder.group({
    editGlCode: ['', Validators.required],
    profitCenter: ['', Validators.required]

  })

  @ViewChild(MatTable) GLCodeTable: MatTable<GLCodeList> | undefined;
  @ViewChild(MatTable) DepartmentListTable: MatTable<DepartmentList> | undefined;
  @ViewChild(MatTable) DepartmentsLinkedListTable: MatTable<GLCodeLinkedList> | undefined;
  selectionDepartmentGLCodeList = new SelectionModel<DepartmentList>(true, []);

    departmentName: string;
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private glCodeService: GlCodeService, private departmentService: DepartmentsService) { }

  CurrentUser: any;
  stringifiedData: any;
  departmentID: any;
  glCodeSelected: any;
  glCodeSelected2: any;
  hasDepartmentLinked = false;

  ngOnInit(): void {
    this.getAllGLCodes();
    this.getAllDepartments();
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData); this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
  }

  displayedColumns: string[] = ['glCodeName', 'profitCenter', 'actions'];
  dataSource = this.GLCodeList;

  displayedColumnsLinkedDepartments: string[] = ['departmentName', 'actions'];
  dataSourceLinkedDepartments = this.GLCodeLinkedList;

  displayedColumnsDepartments: string[] = ['departmentName', 'actions'];
  dataSourceDepartments = this.DepartmentList;

  openCreateNewGLCode(createNewGLCode:any) {
    this.modalService.open(createNewGLCode, { size: 'xl' });
  }

  openLnkDepToGLCode(linkDepToGLCode: any,index:any) {
    this.modalService.open(linkDepToGLCode, { size: 'xl' });
    this.glCodeSelected = this.GLCodeList[index].glCodeID;
    console.log("THIS IS THE GL CODE FOR THE BUTTON CLICK", this.glCodeSelected);
  }

  openViewLnkDepToGLCode(unlinkDepToGLCode:any, index:any) {

    this.glCodeSelected2 = this.GLCodeList[index].glCodeID;
    console.log("SELECTED GL", this.glCodeSelected2);
    this.modalService.open(unlinkDepToGLCode, { size: 'xl' });
  }

  openEditGLCode(editGLCode: any, index: any) {
    this.modalService.dismissAll();
    this.editGlCode.controls["editGlCode"].setValue(this.GLCodeList[index].glCodeName);
    this.editGlCode.controls["profitCenter"].setValue(this.GLCodeList[index].profitCenter);
    this.forEditIndex = index;
    this.glCodeSelected2 = this.GLCodeList[index].glCodeID;
    this.modalService.open(editGLCode, { size: 'xl' });
  }

  getAllGLCodes() {

    this.GLCodeList.splice(0, this.GLCodeList.length);

    this.glCodeService.getAllGLCodes().subscribe((data: any) => {

      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempGLCodeList = {} as GLCodeList;
          const current = data.dateSet[i];
          tempGLCodeList.glCodeID = current.glCodeID;
          tempGLCodeList.glCodeName = current.glCodeName;
          tempGLCodeList.dateCreated = current.dateCreated;
          tempGLCodeList.profitCenter = current.profitCenter;
          this.GLCodeList.push(tempGLCodeList);
        }
        this.GLCodeTable?.renderRows();
        console.log("Got ALL GLCodes", this.GLCodeList);

      }
      else {
        alert(data.responseMessage);

      }
      console.log("response", data);


    }, error => {
      console.log("Error: ", error);
    })
  }

  onAddGLCode() {

    let newGLCode = this.addGlCode.controls["newGlCode"].value;
    let newProfitCenter = this.addGlCode.controls["newProfitCenter"].value;
    this.glCodeService.addUpdateGLCode(0, newGLCode, this.CurrentUser.appUserId, newProfitCenter).subscribe((data: any) => {

      if (data.responseCode == 1) {

        alert(data.responseMessage);




        this.getAllGLCodes();

      }
      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })

  }

  onGLCodeEdit() {
    let editGLCodeName = this.editGlCode.controls["editGlCode"].value;
    let editProfitCenter = this.editGlCode.controls["profitCenter"].value;
    this.glCodeService.addUpdateGLCode(this.GLCodeList[this.forEditIndex].glCodeID, editGLCodeName, null, editProfitCenter).subscribe((data: any) => {
      if (data.responseCode == 1) {
        alert(data.responseMessage);
        this.getAllGLCodes();
      }
      else {
        alert(data.responseMessage);
      }
      console.log("response", data);
    }, error => {
      console.log("Error", error);
    })
  }

  onGLCodeDelete(index: any) {
    if (confirm("Are you sure you want to delete " + this.GLCodeList[index].glCodeName + "?")) {
      this.glCodeService.deleteGLCode(this.GLCodeList[index].glCodeID).subscribe((data: any) => {

        if (data.responseCode == 1) {

          alert(data.responseMessage);
          this.getAllGLCodes();
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

  getAllDepartmentsLinked(editGLCode: any, index: any) {

    console.log(this.glCodeSelected2);
    
    this.glCodeService.getGLCodeByID(this.glCodeSelected2).subscribe((data: any) => {
      
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempGLLinkedCodeList = {} as GLCodeLinkedList;
          const current = data.dateSet[i];
          console.log("CURRENT", current);
          tempGLLinkedCodeList.glCodeID = current.glCodeID;
          tempGLLinkedCodeList.glCodeName = current.glCodeName;
          tempGLLinkedCodeList.dateCreated = current.dateCreated;
          tempGLLinkedCodeList.profitCenter = current.profitCenter;
          tempGLLinkedCodeList.departmentID = current.departmentID;
          tempGLLinkedCodeList.departmentName = current.departmentName;
          console.log(tempGLLinkedCodeList.departmentName);
          
          this.hasDepartmentLinked = true;
/*          if (tempGLLinkedCodeList.departmentName != null) {
            this.hasDepartmentLinked = true;
          }
          else{
            this.hasDepartmentLinked = false;
          }*/

        }

        this.DepartmentsLinkedListTable?.renderRows();
        this.openEditGLCode(editGLCode, index);
        console.log("Got ALL linked Departments", this.GLCodeLinkedList);
        
      }
      else {
        alert(data.responseMessage);

      }
      console.log("response", data);


    }, error => {
      console.log("Error: ", error);
    })
  }

  getAllDepartments() {
    this.DepartmentList.splice(0, this.DepartmentList.length);
    this.departmentService.getDepartmentsList().subscribe((data: any) => {

      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDepartmentList = {} as DepartmentList;
          const current = data.dateSet[i];
          tempDepartmentList.departmentID = current.departmentID;
          tempDepartmentList.departmentName = current.departmentName;
          tempDepartmentList.dateUpdated = current.dateUpdated;
          tempDepartmentList.dateCreated = current.dateCreated;
          tempDepartmentList.hasSubDepartment = current.hasSubDepartment;
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

   onLinkDepToGLCode() {

     this.glCodeService.setLinkDepartmentToGLCode(this.glCodeSelected,this.departmentID,this.departmentName).subscribe((data: any) => {

      if (data.responseCode == 1) {

        alert(data.responseMessage);
        this.getAllGLCodes();
      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })


  }

  departmentSelectedForGLCodelink(depID: any) {
    this.selectionDepartmentGLCodeList.clear();
    this.selectionDepartmentGLCodeList.select(depID);
    
    this.departmentID = this.DepartmentList[depID].departmentID;
    this.departmentName = this.DepartmentList[depID].departmentName;
    
    console.log("THIS IS THE DEPARTMENT ID FOR THE RADIO BUTTON", this.departmentID);
  }

  onGLCodeUnlinkDep(index:any) {

  }

}
