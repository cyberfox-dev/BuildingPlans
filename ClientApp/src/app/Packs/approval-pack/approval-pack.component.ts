import { Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { SharedService } from "src/app/shared/shared.service"
import { DraftApplicationsService } from 'src/app/service/DraftApplications/draft-applications.service';
import { NewWayleaveComponent } from 'src/app/create-new-wayleave/new-wayleave/new-wayleave.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { ApplicationsService } from 'src/app/service/Applications/applications.service';
import { UserProfileService } from 'src/app/service/UserProfile/user-profile.service';
import { PdfGenerationService } from 'src/app/service/PDFGeneration/pdf-generation.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-approval-pack',
  templateUrl: './approval-pack.component.html',
  styleUrls: ['./approval-pack.component.css'],

})
export class ApprovalPackComponent implements OnInit {
  stringifiedData: any;
  CurrentUser: any;
  CurrentUserInfo: any;
  draftsLength: string;
  CurrentUserProfile: any;
  stringifiedDataUserProfile: any;



  constructor(private router: Router, private sharedService: SharedService, private PdfGenerationService: PdfGenerationService, private draftApplicationService: DraftApplicationsService, private NewWayleaveComponent: NewWayleaveComponent, private modalService: NgbModal, private applicationService: ApplicationsService, private userPofileService: UserProfileService,) { }



  ngOnInit(): void {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);
    this.getLoggedInUser();

  }
  name = "";
  getLoggedInUser() {
    this.userPofileService.getUserProfileById(this.CurrentUser.appUserId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        debugger;
        this.CurrentUserInfo = data.dateSet[0];
        this.name = this.CurrentUserProfile[0].fullName;
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

  generatePdfFromHtml() {
    debugger;
    const element = document.getElementById("ApprovalPackComponent");

    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save('approval_pack.pdf');
    });
  }


}
