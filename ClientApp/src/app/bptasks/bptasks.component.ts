import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { SharedService } from '../shared/shared.service';
import { BpTasksService } from 'src/app/service/BPTasks/bp-tasks.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SnackBarAlertsComponent } from '../snack-bar-alerts/snack-bar-alerts.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BpDepartmentsService } from '../service/BPDepartments/bp-departments.service'; 
export interface Taskslist {
  TaskID: any;
  Task: any;
  isChecked: boolean;
  CheckedBy: string;
  TaskCreatedFor: string;
  ApplicationId: number;
  DateCreated: any;
  DateUpdated: any;
  Department: string;
}

export interface DepartmentsList {
  DepartmentID: number;
  FunctionalArea: string;
  DepartmentName: string; 
}

@Component({
  selector: 'app-bptasks',
  templateUrl: './bptasks.component.html',
  styleUrls: ['./bptasks.component.css']
})


export class BPTasksComponent implements OnInit {
  applicationId: any;
  taskFor: string;
  taskName: string;
    stringifiedData: any;
  CurrentUser: any;
  departmentName: string;
  constructor(private BpTasksService: BpTasksService, private sharedService: SharedService, private router: Router, private modalService: NgbModal, private _snackBar: MatSnackBar, private bpDepartmentsService: BpDepartmentsService) { }
  Taskslist: Taskslist[] = [];
  DepartmentsList: DepartmentsList[] = [];

  ngOnInit(): void {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.applicationId = this.sharedService.getApplicationID();
    this.getAllBPTasks();
    this.getAllDepartments();
  }

  displayedColumnsTasks: string[] = ['Tasks','Department','actions'];
  dataSourceTasks = this.Taskslist;
  selectedDepartment: string; 
  @ViewChild(MatTable) TaskListTable: MatTable<Taskslist> | undefined;
  getAllBPTasks() {
    debugger;
    this.Taskslist.splice(0, this.Taskslist.length);
    this.BpTasksService.getTasksForApplication(this.applicationId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        debugger;
        console.log("This is the tasks list", data.dateSet);
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempStage = {} as Taskslist;
          debugger;
          tempStage.TaskID = current.taskID;
          tempStage.Task = current.taskName;
          tempStage.CheckedBy = current.checkedBy;
          tempStage.isChecked = current.isChecked;
          tempStage.Department = current.departmentName;

          this.Taskslist.push(tempStage);
        }
        this.dataSourceTasks = this.Taskslist;
        this.TaskListTable?.renderRows();
        console.log("SKJFSKDJFHJKSDF", this.Taskslist);

      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Error", error);

    })
  }

  openNewTask(newTask: any) {
    this.taskName = "";
    this.taskFor = "";
    this.modalService.open(newTask, { centered: true, size: 'xl' });
  }
  addNewTask() {
    this.BpTasksService.addUpdateTask(0, this.taskName, this.applicationId, "Building Plan", this.CurrentUser.appUserId, this.taskFor,this.departmentName).subscribe((data: any) => {
      if (data.responseCode == 1) {
        this.modalService.dismissAll();
        this.openSnackBar("Task Created");
        this.getAllBPTasks();
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Error", error);

    })
  }

  openSnackBar(message: string) {
    this._snackBar.openFromComponent(SnackBarAlertsComponent, {
      data: { message }, // Pass the message as data to the component
      duration: 3 * 1000,
      panelClass: ['green-snackbar'],
      verticalPosition: 'top',
    });
  }

  checkTask(index: any) {
    debugger;
    this.BpTasksService.taskCompleted(this.Taskslist[index].TaskID, this.CurrentUser.fullName).subscribe((data: any) => {
      if (data.responseCode == 1) {
        this.openSnackBar("Task Completed");
        this.getAllBPTasks();
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Error", error);

    })
  }

  getAllDepartments() {
    this.bpDepartmentsService.getAllDepartmentsForFunctionalArea("Building Plan").subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempDepartment = {} as DepartmentsList;

          tempDepartment.DepartmentID = current.departmentID;
          tempDepartment.DepartmentName = current.departmentName;
          tempDepartment.FunctionalArea = current.functionalArea;

          this.DepartmentsList.push(tempDepartment);
          
        }
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Departments Error", error);
    })
  }
}
