import { Component, OnInit, ViewChild } from '@angular/core';
import { ApplicationsService } from '../service/Applications/applications.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ApplicationsList } from '../notification-center/notification-center.component';
import { SharedService } from '../shared/shared.service';
import { BugsService } from '../service/Bugs/bugs.service';
import { Router } from "@angular/router";

export interface BugsList {
  BugID: number;
  Description: string;
  isFixed: boolean;
  FixedBy: string;
  DateCreated: any;
  DateUpdated: any;
  Category: string;
  Component: string;
}
@Component({
  selector: 'app-bugs-config',
  templateUrl: './bugs-config.component.html',
  styleUrls: ['./bugs-config.component.css']
})
export class BugsConfigComponent implements OnInit {

  bugsList: BugsList[] = [];

  dataSource: any;
  displayedColumns: string[] = ['Component', 'Description', 'Category', 'isFixed', 'FixedBy', 'DateCreated', 'DateUpdated','actions'];
  @ViewChild(MatTable) BugsTable: MatTable<BugsList> | undefined;

  stringifiedData: any;
  CurrentUser: any;

  constructor(private bugsService : BugsService) { }

  ngOnInit(): void {

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    this.getAllBugs();
  }


  getAllBugs() {

    this.bugsList.splice(0, this.bugsList.length);
    this.bugsService.getAllBugs().subscribe((data: any) => {
      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {

          const current = data.dateSet[i];
          const tempBugs = {} as BugsList;
           
          tempBugs.BugID = current.bugID;
          tempBugs.Description = current.description;
          tempBugs.isFixed = current.isFixed;
          tempBugs.FixedBy = current.fixedBy;
          tempBugs.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
          tempBugs.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));
          tempBugs.Category = current.category;
          tempBugs.Component = current.component;

          this.bugsList.push(tempBugs); 
        }

        this.dataSource = this.bugsList;
        this.BugsTable?.renderRows();
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Bugs Error", error);
    })
  }

  changeBugStatues(index: any) {

    const current = this.bugsList[index];

    this.bugsService.addUpdateBug(current.BugID, null, true, this.CurrentUser.fullName, null, null, null).subscribe((data: any) => {
      if (data.responseCode == 1) {
        alert(data.responseMessage);
        this.getAllBugs();
      }
      else {
        alert(data.responseMessage);

      }
    }, error => {
      console.log("Bug Error", error);
    })
  }
}
