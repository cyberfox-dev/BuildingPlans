import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectSizeCheckListService } from '../service/ProjectSizeCheckList/project-size-check-list.service';
import { MatTable } from '@angular/material/table';

export interface ProjectSizeCheckList {

  projectSizeCheckListID: number;
  projectSizeCheckListRowNumber: string;
  projectSizeCheckListActivity: string;
  mandatoryDocumentCategory: string;
  projectSizeCheckListActivityType: string;
}
@Component({
  selector: 'app-project-size-config',
  templateUrl: './project-size-config.component.html',
  styleUrls: ['./project-size-config.component.css']
})


export class ProjectSizeConfigComponent implements OnInit {

  ProjectSizeCheckList: ProjectSizeCheckList[] = [];
  stringifiedData: any;
  CurrentUser: any;
  forEditIndex: any;
  psItemSelected: any;
  psItemSelected2: any;
  forViewIndex: any;
  psSelectedView: any;

  public addProjectCheckListItem = this.formBuilder.group({
    newActivityType: ['', Validators.required],
    newActivity: ['', Validators.required],
    newMandatoryDocument: ['', Validators.required]
  })
  public editingProjectCheckListItem = this.formBuilder.group({
    editActivityType: ['', Validators.required],
    editActivity: ['', Validators.required],
    editMandatoryDocument: ['', Validators.required]
  })

  constructor(private formBuilder: FormBuilder, private modalService: NgbModal, private psCheckListService : ProjectSizeCheckListService) { }

  ngOnInit(): void {
    this.getAllProjectSizeCheckList();
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData); this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
  }

  @ViewChild(MatTable) PSCheckListTable: MatTable<ProjectSizeCheckList> | undefined;
  displayedColumns: string[] = ['projectSizeCheckListActivity', 'projectSizeCheckListActivityType', 'mandatoryDocumentCategory', 'actions'];
  dataSource = this.ProjectSizeCheckList;

  onAddCheckListItem() {
    let newActivity = this.addProjectCheckListItem.controls["newActivity"].value;
    let newActivityType = this.addProjectCheckListItem.controls["newActivityType"].value;
    let newMandatoryDocument = this.addProjectCheckListItem.controls["newMandatoryDocument"].value;
    this.psCheckListService.addUpdatedProjectSizeCheckList(this.CurrentUser.appUserId, newMandatoryDocument, newActivityType, newActivity,  null).subscribe((data: any) => {
      if (data.responseCode == 1) {

        alert(data.responseMessage);

        this.getAllProjectSizeCheckList();

      }
      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }
  onPSCheckListDelete(index: any) {
    if (confirm("Are you sure you want to delete " + this.ProjectSizeCheckList[index].projectSizeCheckListActivity + "?")) {
      this.psCheckListService.deleteProjectSizeCheckListByID(this.ProjectSizeCheckList[index].projectSizeCheckListID).subscribe((data: any) => {

        if (data.responseCode == 1) {

          alert(data.responseMessage);
          this.getAllProjectSizeCheckList();
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
  openCreateNewCheckListItem(createNewCheckListItem: any) {
    this.modalService.open(createNewCheckListItem, { size: 'xl' });
  }

  openEditCheckListItem(editProjectCheckListItem: any, index: any) {
    debugger;
    this.modalService.dismissAll();
    this.editingProjectCheckListItem.controls["editActivity"].setValue(this.ProjectSizeCheckList[index].projectSizeCheckListActivity);
    this.editingProjectCheckListItem.controls["editActivityType"].setValue(this.ProjectSizeCheckList[index].projectSizeCheckListActivityType);
    this.editingProjectCheckListItem.controls["editMandatoryDocument"].setValue(this.ProjectSizeCheckList[index].mandatoryDocumentCategory);
    this.forEditIndex = index;
    this.psItemSelected = this.ProjectSizeCheckList[index].projectSizeCheckListID;
    this.modalService.open(editProjectCheckListItem, { size: 'xl' });
  }
  onPSCheckListEdit() {

    let editActivity = this.editingProjectCheckListItem.controls["editActivity"].value;
    let editActivityType = this.editingProjectCheckListItem.controls["editActivityType"].value;
    let editMandatoryDocument = this.editingProjectCheckListItem.controls["editMandatoryDocument"].value;
    this.psCheckListService.addUpdatedProjectSizeCheckList(this.CurrentUser.appUserId, editMandatoryDocument, editActivityType, editActivity, this.ProjectSizeCheckList[this.forEditIndex].projectSizeCheckListID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        alert(data.responseMessage);
        this.getAllProjectSizeCheckList();
      }
      else {
        alert(data.responseMessage);
      }
      console.log("response", data);
    }, error => {
      console.log("Error", error);
    })
  }

  getAllProjectSizeCheckList() {
    //debugger;
    this.ProjectSizeCheckList.splice(0, this.ProjectSizeCheckList.length);
    this.psCheckListService.getAllProjectSizeCheckList().subscribe((data: any) => {

      if (data.responseCode == 1) {
        //debugger;
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempProjectSizeCheckList = {} as ProjectSizeCheckList;
          const current = data.dateSet[i];
          tempProjectSizeCheckList.projectSizeCheckListID = current.projectSizeCheckListID;
          tempProjectSizeCheckList.projectSizeCheckListActivity = current.projectSizeCheckListActivity;
          tempProjectSizeCheckList.projectSizeCheckListActivityType = current.projectSizeCheckListActivityType;
          tempProjectSizeCheckList.projectSizeCheckListRowNumber = current.projectSizeCheckListRowNumber;
          tempProjectSizeCheckList.mandatoryDocumentCategory = current.mandatoryDocumentCategory;
          this.ProjectSizeCheckList.push(tempProjectSizeCheckList);
        }
        this.PSCheckListTable?.renderRows();
        console.log("Got ALL project size checklist items", this.ProjectSizeCheckList);

      }
      else {
        alert(data.responseMessage);

      }
      console.log("response", data);


    }, error => {
      console.log("Error: ", error);
    })
  }
}