import { Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { SharedService } from "src/app/shared/shared.service"
import { DraftApplicationsService } from '../service/DraftApplications/draft-applications.service';
import { NewWayleaveComponent } from 'src/app/create-new-wayleave/new-wayleave/new-wayleave.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { ApplicationsService } from '../service/Applications/applications.service';
import { UserProfileService } from 'src/app/service/UserProfile/user-profile.service';

export interface DraftsList {
  DraftId: number;
  ApplicationID: number;
  TypeOfApplication: string;
  UserID: string;
  FullName: string;
  Email: string;
  PhoneNumber: string;
  PhysicalAddress: string;
  ReferenceNumber: string;
  WBSNumber: string;
  PhysicalAddressOfProject: string;
  DescriptionOfProject: string;
  NatureOfWork: string;
  ExcavationType: string;
  ExpectedStartdate: any;
  ExpectedEndDate: any;
  DateCreated: any;
  DateUpdated: any;
  CreatedByID: string;
  CompanyRegNumber: string;
  ProjectNumber: string;


}
@Component({
  selector: 'app-drafts',
  templateUrl: './drafts.component.html',
  styleUrls: ['./drafts.component.css']
})

export class DraftsComponent implements OnInit {
  DraftsList: DraftsList[] = [];

  @ViewChild(MatTable) DraftsTable: MatTable<DraftsList> | undefined;
  draftTableColumns: string[] = ['ApplicationID', 'FullName', 'TypeOfApplication', 'PhysicalAddressOfProject', 'NatureOfWork', 'DateCreated', 'actions'];


  draftDataSource = this.DraftsList;
  stringifiedData: any;
  CurrentUser: any;
  CurrentUserInfo: any;
  draftsLength: string;
  CurrentUserProfile: any;

  constructor(private router: Router, private sharedService: SharedService, private draftApplicationService: DraftApplicationsService, private NewWayleaveComponent: NewWayleaveComponent, private modalService: NgbModal, private applicationService: ApplicationsService, private userPofileService: UserProfileService,) { }

  ngOnInit(): void {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
   
    this.getLoggedInUser();
   
  }
  getAllDraftsForUser() {
    debugger;
    this.DraftsList.splice(0, this.DraftsList.length);

      this.draftApplicationService.getDraftedApplicationsListForExternal(this.CurrentUser.appUserId).subscribe((data: any) => {
        debugger;
        if (data.responseCode == 1) {
          debugger;
          for (let i = 0; i < data.dateSet.length; i++) {
            debugger;
            const tempDraftsList = {} as DraftsList;
            const current = data.dateSet[i];
            const date = current.dateCreated;
            tempDraftsList.DraftId = current.draftID;
            tempDraftsList.ApplicationID = current.applicationID;
            tempDraftsList.CompanyRegNumber = current.companyregNo;
            tempDraftsList.CreatedByID = current.createdById;
            tempDraftsList.DateCreated = current.dateCreated.substring(0, date.indexOf('T'));
            tempDraftsList.DateUpdated = current.dateUpdated;
            tempDraftsList.DescriptionOfProject = current.descriptionOfProject;
            tempDraftsList.Email = current.email;
            tempDraftsList.ExcavationType = current.excavationType;
            tempDraftsList.FullName = current.fullName;
            tempDraftsList.NatureOfWork = current.natureOfWork;
            tempDraftsList.PhysicalAddressOfProject = current.physicalAddressOfProject;
            tempDraftsList.ReferenceNumber = current.referenceNumber;
            tempDraftsList.TypeOfApplication = current.typeOfApplication;
            tempDraftsList.ProjectNumber = current.projectNumber;
            tempDraftsList.UserID = current.userID;
            tempDraftsList.ExpectedStartdate = current.expectedStartDate;
            tempDraftsList.ExpectedEndDate = current.expectedEndDate;

            this.DraftsList.push(tempDraftsList);

          }

          this.draftDataSource = this.DraftsList
            .filter(df => df.DateCreated)
            .sort((a, b) => new Date(b.DateCreated).getTime() - new Date(a.DateCreated).getTime());

          this.DraftsTable.renderRows();
        }
        else {
          alert(data.responseMessage);
        }
      },
        (error) => {
          console.log("Error: ", error);
        }
      );
    
   
  }

  onSelectDraft(index: number) {
    this.sharedService.applicationID = this.DraftsList[index].ApplicationID;
    this.sharedService.isDraft = true;
    this.sharedService.clientUserID = this.DraftsList[index].UserID;
    this.modalService.dismissAll();
    debugger;
    this.userPofileService.getUserProfileById(this.DraftsList[index].UserID).subscribe((data: any) => {
      debugger;
      if (data.responseCode == 1) {
        this.CurrentUserProfile = data.dateSet[0];

        if (this.CurrentUserInfo.isInternal == true && this.CurrentUser.appUserId == this.DraftsList[index].UserID) {

          debugger;
          this.sharedService.option = "internal";
          this.NewWayleaveComponent.internal = true;
        }

        else if (this.CurrentUserInfo.isInternal == true && this.CurrentUser.appUserId != this.DraftsList[index].UserID && this.CurrentUserProfile.isInternal == false) {
          debugger;

          this.sharedService.option = "client"
          this.NewWayleaveComponent.client = true;

        }
        else if (this.CurrentUserInfo.isInternal == true && this.CurrentUser.appUserId != this.DraftsList[index].UserID && this.CurrentUserProfile.isInternal == true) {
          this.sharedService.option = "proxy"
          this.NewWayleaveComponent.internalProxy = true;

        }
        debugger;
        this.router.navigate(["/new-wayleave"], { queryParams: { isPlanningS: false } });
      }
      else {
        alert(data.responseMessage);
      }
      debugger;

    },

      (error) => {
        console.log("Error: ", error);
      }
    );
    debugger;



  }
  getLoggedInUser() {
    this.userPofileService.getUserProfileById(this.CurrentUser.appUserId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        debugger;
        this.CurrentUserInfo = data.dateSet[0];
        this.getAllDraftsForUser();
      }
      else {
        alert(data.responseMessage);
      }
      debugger;

    },

      (error) => {
        console.log("Error: ", error);
      }
    );
  }
}

