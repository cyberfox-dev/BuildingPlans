import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from "src/app/shared/shared.service";
import { UserProfileService } from 'src/app/service/UserProfile/user-profile.service';
import { StagesService } from '../../service/Stages/stages.service';
import { ApplicationsService } from '../../service/Applications/applications.service';

export interface PeriodicElement {
  name: string;

}

export interface StagesList {
  StageID: number;
  StageName: string;
  StageOrderNumber: number;
  CurrentUser: any

}

export interface ApplicationList {
  applicationID: number,
  clientName: string,
  clientEmail: string,
  clientAddress: string,
  clientRefNo: string,
  CompanyRegNo: string,
  TypeOfApplication: string,
  NotificationNumber: string,
  WBSNumber: string,
  PhysicalAddressOfProject: string,
  DescriptionOfProject: string,
  NatureOfWork: string,
  ExcavationType: string,
  ExpectedStartDate: Date,
  ExpectedEndDate: Date,
  Location: string,
  clientCellNo: string,
  CreatedById: number,
  ApplicationStatus: string,
  CurrentStageName: string,
  CurrentStageNumber: number,
  CurrentStageStartDate: Date,
  NextStageName: string,
  NextStageNumber: number,
  PreviousStageName: string,
  PreviousStageNumber: number,

}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Proof of payment'},
  {  name: 'Invoice' },
  {  name: 'deposit DS456'},
];

export interface Documents {
  name: string;

}

const Document_DATA: Documents[] = [
  { name: 'doc1' },
  { name: 'doc2'  },
  { name: 'doc3' },
];

@Component({
  selector: 'app-view-project-info',
  templateUrl: './view-project-info.component.html',
  styleUrls: ['./view-project-info.component.css']
})
export class ViewProjectInfoComponent implements OnInit {

  public isInternalUser: boolean = false;

  createdByID: any | undefined; 

  /*type of applicant*/
  isInternal = true;
  toa = '';
  /*external*/
  extApplicantBpNoApplicant = '';
  extApplicantCompanyName = '';
  extApplicantCompanyRegNo = '';
  extApplicantCompanyType = '';
  extApplicantName = '';
  extApplicantSurname = '';
  extApplicantTellNo = '';
  extApplicantEmail = '';
  extApplicantPhyscialAddress = '';
  extApplicantIDNumber = '';

  /*internal*/
  internalApplicantName = '';
  internalApplicantSurname = '';
  internalApplicantDirectorate = '';
  internalApplicantDepartment = '';
  internalApplicantTellNo = '';
  internalApplicantBranch = '';
  internalApplicantCostCenterNo = '';
  internalApplicantCostCenterOwner = '';


  applicationDataForView: ApplicationList[] = [];
  StagesList: StagesList[] = [];

  CurrentApplicationBeingViewed: ApplicationList[] = [];

  ApplicationID: number | undefined;

  CurrentUser: any;
  //Convert the local storage JSON data to an array object
  stringifiedData: any;


  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  fileAttr = 'Choose File';
  uploadFileEvt(imgFile: any) {
    if (imgFile.target.files && imgFile.target.files[0]) {
      this.fileAttr = '';
      Array.from(imgFile.target.files).forEach((file: any) => {
        this.fileAttr += file.name + ' - ';
      });
      // HTML5 FileReader API
      let reader = new FileReader();
      reader.onload = (e: any) => {
        let image = new Image();
        image.src = e.target.result;
        image.onload = (rs) => {
          let imgBase64Path = e.target.result;
        //  console.log("e.target.result", e.target.result); 
        };
      };
      reader.readAsDataURL(imgFile.target.files[0]);
      // Reset if duplicate image uploaded again

    } else {
      this.fileAttr = 'Choose File';
    }
  }

  openDocUpload(newSub: any) {
    this.modalService.open(newSub, { backdrop: 'static', centered: true, size: 'lg' });
  }


  panelOpenState = false;
  displayedColumns: string[] = [ 'name','actions'];
  dataSource = ELEMENT_DATA;

  displayedColumnsDocs: string[] = ['name','actions'];
  dataSourceDoc = Document_DATA;

  constructor(private modalService: NgbModal, private sharedService: SharedService, private userPofileService: UserProfileService, private stagesService: StagesService, private applicationsService: ApplicationsService) { }

  ngOnInit(): void {
   
    this.applicationDataForView.push(this.sharedService.getViewApplicationIndex())
    this.CurrentApplicationBeingViewed.push(this.applicationDataForView[0]);

   
    const setValues = this.applicationDataForView[0];
    this.ApplicationID = setValues.applicationID;


    console.log("this is the created by ID", setValues);
    this.createdByID = setValues.CreatedById;

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);


    this.getUserProfileByUserID();
    this.getAllStages();
    this.setInterface();
  }

  getAllStages() {

    this.StagesList.splice(0, this.StagesList.length);

    this.stagesService.getAllStages().subscribe((data: any) => {
      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempStageList = {} as StagesList;
          const current = data.dateSet[i];
          tempStageList.StageID = current.stageID;
          tempStageList.StageName = current.stageName;
          tempStageList.StageOrderNumber = current.stageOrderNumber;

          this.StagesList.push(tempStageList);
          // this.sharedService.setStageData(this.StagesList);
        }

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


  getUserProfileByUserID() {
   
    this.userPofileService.getUserProfileById(this.createdByID).subscribe((data: any) => {
    
      if (data.responseCode == 1) {


        console.log("data", data.dateSet);

        const currentUserProfile = data.dateSet[0];
        const fullname = currentUserProfile.fullName;

        if (currentUserProfile.isInternal == true) {

          this.toa = 'Internal User';
          this.internalApplicantName = fullname.substring(0, fullname.indexOf(' '));
          this.internalApplicantSurname = fullname.substring(fullname.indexOf(' ') + 1);
          this.internalApplicantDirectorate = currentUserProfile.directorate;
          this.internalApplicantDepartment = currentUserProfile.departmentName;
          this.internalApplicantTellNo = currentUserProfile.phoneNumber;
          this.internalApplicantBranch = currentUserProfile.branch;
          this.internalApplicantCostCenterNo = currentUserProfile.costCenterNumber;
          this.internalApplicantCostCenterOwner = currentUserProfile.costCenterOwner;
          this.isInternal = true;
         

        }
        else {
          this.toa = 'External User';
          this.extApplicantBpNoApplicant = currentUserProfile.bP_Number;
          this.extApplicantCompanyName = currentUserProfile.companyName;
          this.extApplicantCompanyRegNo = currentUserProfile.companyRegNo;
          //this.extApplicantCompanyType = '';
          this.extApplicantName = fullname.substring(0, fullname.indexOf(' '));
          this.extApplicantSurname = fullname.substring(fullname.indexOf(' ') + 1);
          this.extApplicantTellNo = currentUserProfile.phoneNumber;
          this.extApplicantEmail = currentUserProfile.email;
          this.extApplicantPhyscialAddress = currentUserProfile.physcialAddress;
          // this.extApplicantIDNumber = ''; todo chage the dto to include the id number
          this.isInternal = false;
         
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


  openXl(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }

  viewPDF() {
    var pdf = 'http://197.242.150.226/Files/SampleInvoice.pdf';
    window.open(pdf, '_blank');
  }


  ChangeApplicationStatusToPaid() {

    debugger;
    //alert("ChangeApplicationStatusToPaid");

    if (this.CurrentApplicationBeingViewed[0].CurrentStageName == this.StagesList[1].StageName && this.CurrentApplicationBeingViewed[0].ApplicationStatus == "Unpaided") {
      this.applicationsService.updateApplicationStage(this.CurrentApplicationBeingViewed[0].applicationID, this.CurrentApplicationBeingViewed[0].PreviousStageName, this.CurrentApplicationBeingViewed[0].PreviousStageNumber, this.CurrentApplicationBeingViewed[0].CurrentStageName, this.CurrentApplicationBeingViewed[0].CurrentStageNumber, this.CurrentApplicationBeingViewed[0].NextStageName, this.CurrentApplicationBeingViewed[0].NextStageNumber, "Paid").subscribe((data: any) => {

        if (data.responseCode == 1) {
          alert("Application Status Updated to Paid");

        }
        else {
          alert(data.responseMessage);
        }
        console.log("responseAddapplication", data);
      }, error => {
        console.log("Error", error);
      })

    }
    else {
      alert("Application Status Is Not Unpaided");
    }


  }

  MoveToNextStage() {

    debugger;
    //alert("ChangeApplicationStatusToPaid");

    if (this.CurrentApplicationBeingViewed[0].CurrentStageName == this.StagesList[1].StageName && this.CurrentApplicationBeingViewed[0].ApplicationStatus == "Paid") {
      this.applicationsService.updateApplicationStage(this.CurrentApplicationBeingViewed[0].applicationID, this.CurrentApplicationBeingViewed[0].CurrentStageName, this.CurrentApplicationBeingViewed[0].CurrentStageNumber, this.StagesList[2].StageName, this.StagesList[2].StageOrderNumber, this.StagesList[3].StageName, this.StagesList[3].StageOrderNumber, "Distributing").subscribe((data: any) => {

        if (data.responseCode == 1) {
          alert("Application Moved to ${this.CurrentApplicationBeingViewed[0].CurrentStageName}");

        }
        else {
          alert(data.responseMessage);
        }
        console.log("responseAddapplication", data);
      }, error => {
        console.log("Error", error);
      })

    }

    else if (this.CurrentApplicationBeingViewed[0].CurrentStageName == this.StagesList[2].StageName && this.CurrentApplicationBeingViewed[0].ApplicationStatus == "Distributing") {
      
    }
    else {
      alert("Application Status Is Not Paid");
    }


  }
  setInterface() {
   

    this.userPofileService.getUserProfileById(this.CurrentUser.appUserId).subscribe((data: any) => {


      if (data.responseCode == 1) {


        console.log("data", data.dateSet);

        const currentUserProfile = data.dateSet[0];
        const fullname = currentUserProfile.fullName;

        if (currentUserProfile.isInternal == true) {

          this.isInternalUser = true;

        }
        else {
          this.isInternalUser = false;

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
