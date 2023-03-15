import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GlCodeService } from '../service/GLCode/gl-code.service';
import { DepartmentsService } from '../service/Departments/departments.service';


export interface GLCodeList {
  glCodeID: number;
  glCodeName: string;
  dateCreated: any;
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

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private glCodeService: GlCodeService, private departmentService: DepartmentsService) { }

  CurrentUser: any;
  stringifiedData: any;

  ngOnInit(): void {
    this.getAllGLCodes();
    this.getAllDepartments();
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData); this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
  }

  displayedColumns: string[] = ['glCodeName', 'dateCreated', 'actions'];
  dataSource = this.GLCodeList;

  displayedColumnsDepartments: string[] = ['departmentName', 'actions'];
  dataSourceDepartments = this.DepartmentList;

  openCreateNewGLCode(createNewGLCode:any) {
    this.modalService.open(createNewGLCode, { size: 'xl' });
  }

  openLnkDepToGLCode(linkDepToGLCode: any) {
    this.modalService.open(linkDepToGLCode, { size: 'xl' });
  }

  openEditGLCode(editGLCode: any, index: any) {
    this.editGlCode.controls["editGlCode"].setValue(this.GLCodeList[index].glCodeName);
    this.forEditIndex = index;
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

    this.glCodeService.addUpdateGLCode(0, newGLCode, this.CurrentUser.appUserId).subscribe((data: any) => {

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
    this.glCodeService.addUpdateGLCode(this.GLCodeList[this.forEditIndex].glCodeID, editGLCodeName, null).subscribe((data: any) => {
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


        console.log("DepartmentListh", this.DepartmentList);
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


}
