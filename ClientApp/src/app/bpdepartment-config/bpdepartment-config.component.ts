

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BpDepartmentsService } from '../service/BPDepartments/bp-departments.service';
import { MatTable } from '@angular/material/table';
import { BPFunctionalAreasService } from '../service/BPFunctionalAreas/bpfunctional-areas.service';
import { MatSelectModule } from '@angular/material/select';

export interface DepartmentList {
  departmentID: number;
  departmentName: string;
  dateUpdated: any;
  dateCreated: any;
  hasSubDepartment: boolean;
  functionalArea: string;
}

export interface FunctionalAreasList {
  FunctionalAreaId: number;
  FAName: string;
  FAItemCode: string;
  DateCreated: any;
  DateUpdated: any;

}

@Component({
  selector: 'app-bpdepartment-config',
  templateUrl: './bpdepartment-config.component.html',
  styleUrls: ['./bpdepartment-config.component.css']
})
export class BPDepartmentConfigComponent implements OnInit {

  public hasSub: boolean = false;
  DepartmentList: DepartmentList[] = [];
  FunctionalAreasList: FunctionalAreasList[] = [];

  selectedDepartmentID: any;
  selectedDepartmentName: any;
  selectedFunctionalArea: string;

  public addDepartment = this.formBuilder.group({
    newDeptName: ['', Validators.required]

  })
  @ViewChild(MatTable) DepartmentListTable: MatTable<DepartmentList> | undefined;

  displayedColumns: string[] = ['departmentName', 'functionalArea','actions'];
  dataSource = this.DepartmentList;
  originalSelectedDepartmentName: any;
  constructor(private formBuilder: FormBuilder, private modalService: NgbModal, private bpDepartService: BpDepartmentsService, private bpFunctionalAreasService: BPFunctionalAreasService ) { }

  ngOnInit(): void {
    this.GetAllFunctionalAreas() ;
    this.getAllBPDepartments();
  }

  getAllBPDepartments() {
    this.DepartmentList.splice(0, this.DepartmentList.length);
    debugger;
    this.bpDepartService.getDepartmentsList().subscribe((data: any) => {

      if (data.responseCode == 1) {
        debugger;

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDepartmentList = {} as DepartmentList;
          const current = data.dateSet[i];
          tempDepartmentList.departmentID = current.departmentID;
          tempDepartmentList.departmentName = current.departmentName;
          tempDepartmentList.dateUpdated = current.dateUpdated;
          tempDepartmentList.dateCreated = current.dateCreated;
          tempDepartmentList.hasSubDepartment = current.hasSubDepartment;
          tempDepartmentList.functionalArea = current.functionalArea;
          this.DepartmentList.push(tempDepartmentList);

        }
        this.DepartmentListTable?.renderRows();
        //this.DepartmentList = data.dateSet;

        console.log("This is the Building Plans department list: ", this.DepartmentList);
      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  openXl(content: any) {
    this.modalService.open(content, { backdrop: 'static', size: 'lg' });
  }

  onDepartmentCreate() {
    let newDeptName = this.addDepartment.controls["newDeptName"].value;
    debugger;
    this.bpDepartService.addUpdateDepartment(0, newDeptName, false, "Testing Create", this.selectedFunctionalArea).subscribe((data: any) => {

      if (data.responseCode == 1) {

        alert(data.responseMessage);
        console.log("This shpuld pop up if you were able to successfully add a department", data.responseMessage);
        this.getAllBPDepartments();
        this.addDepartment.get('newDeptName').setValue('');
      }
      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);
    }, error => {
      console.log("Error: ", error);
    })
  }

  setCurrentDepartmentID(index: any) {
  
  }
  onDeleteDepartment(index: any) {
    if (confirm("Are you sure to delete '" + this.DepartmentList[index].departmentName + "' ?")) {

      this.bpDepartService.deleteDepartment(this.DepartmentList[index].departmentID).subscribe((data: any) => {

        if (data.responseCode == 1) {

          alert(data.responseMessage);
          this.getAllBPDepartments();
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
  onUpdateDepartment(index: any, editDepartment: any) {

    let selectedDepartID = this.DepartmentList[index].departmentID;
    console.log("The user has selected this department ID:", selectedDepartID)
    this.bpDepartService.getDepartmentByDepartmentID(selectedDepartID).subscribe((data: any) => {

      if (data.responseCode == 1) {
        alert(data.responseMessage);
        debugger;

        this.selectedDepartmentID = data.dateSet[0].departmentID;
        this.selectedDepartmentName = data.dateSet[0].departmentName;
        this.originalSelectedDepartmentName = data.dateSet[0].departmentName;
        this.modalService.open(editDepartment, { backdrop: 'static', size: 'lg' });
      }
      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  updateDepartment() {

    if (this.originalSelectedDepartmentName == this.selectedDepartmentName) {
      alert('The name is the same as original, no need to update.')
    }
    else { 
    this.bpDepartService.addUpdateDepartment(this.selectedDepartmentID, this.selectedDepartmentName, false, "Testing Update").subscribe((data: any) => {

      if (data.responseCode == 1) {

        alert(data.responseMessage);
        console.log("This shpuld pop up if you were able to successfully update a department", data.responseMessage);
        this.getAllBPDepartments();
        this.selectedDepartmentName = '';
        this.selectedDepartmentID = '';
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

  GetAllFunctionalAreas() {
    debugger;
    this.bpFunctionalAreasService.getAllFunctionalAreas().subscribe((data: any) => {
      if (data.responseCode == 1) {
        debugger;
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempFunctionalAreasList = {} as FunctionalAreasList;
          const current = data.dateSet[i];

          tempFunctionalAreasList.FunctionalAreaId = current.functionalAreaID;
          tempFunctionalAreasList.FAName = current.faName;
          tempFunctionalAreasList.FAItemCode = current.faItemCode;
          tempFunctionalAreasList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
          tempFunctionalAreasList.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));

          this.FunctionalAreasList.push(tempFunctionalAreasList);
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
