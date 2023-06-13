import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from "src/app/shared/shared.service";
import { UserProfileService } from 'src/app/service/UserProfile/user-profile.service';
import { StagesService } from '../../service/Stages/stages.service';
import { ApplicationsService } from '../../service/Applications/applications.service';
import { CommentsService } from '../../service/Comments/comments.service';
import { DepositRequiredService } from 'src/app/service/DepositRequired/deposit-required.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { NewWayleaveComponent } from 'src/app/create-new-wayleave/new-wayleave/new-wayleave.component'
import { ConfigService } from 'src/app/service/Config/config.service';
import { DocumentUploadService } from 'src/app/service/DocumentUpload/document-upload.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";




export interface ARCGISAPIData {
  createdByID: string;
  isActive: string;
  applicationID: string;
}

export interface PeriodicElement {
  name: string;

}

export interface StagesList {
  StageID: number;
  StageName: string;
  StageOrderNumber: number;
  CurrentUser: any
}

export interface SubDepConditionalApproveList {
  SubDepID: number;
  SubDepName: string;
  ApplicationID: number;
  Comment: string;
  CommentStatus: string;
  DateCreated: any;
}

export interface CommentsList {
  CommentID: number;
  ApplicationID: number;
  Comment: string;
  CommentStatus: string;
  SubDepartmentForCommentID: number;
  SubDepartmentName?: string;

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
  ProjectNumber: string,
  isPlanning?: boolean,
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Proof of payment'},
  {  name: 'Invoice' },
  {  name: 'deposit DS456'},
];






export interface DepositRequired {
  DepositRequiredID: number;
  ApplicationID: number;
  Desciption: string;
  SubDepartmentID: number;
  SubDepartmentForCommentID: number;
  Rate: number;
  Quantity: number;
  ServiceItemCodeserviceItemCode?: string | null;
  SubDepartmentName?: string | null;
  WBS?: string;
}


var img = new Image();
img.src = 'assets/cctlogoblack.png';

@Component({
  selector: 'app-view-project-info',
  templateUrl: './view-project-info.component.html',
  styleUrls: ['./view-project-info.component.css']
})



export class ViewProjectInfoComponent implements OnInit {

  public addWBSNumber = this.formBuilder.group({
    wbsnumber: ['', Validators.required],
   

  })

  //Initialize the interface for ARCGIS
  ARCGISAPIData = {} as ARCGISAPIData;

  public isInternalUser: boolean = false;
  canReapply = false;
  public projectNo = "";
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


  wbsNumberRequested = '';

  applicationDataForView: ApplicationList[] = [];
  StagesList: StagesList[] = [];
  CommentsList: CommentsList[] = [];
  SubDepConditionalApproveList: SubDepConditionalApproveList[] = [];

  CurrentApplicationBeingViewed: ApplicationList[] = [];
  DepositRequired: DepositRequired[] = [];
  relatedApplications: ApplicationList[] = [];

 

  ApplicationID: number | undefined;

  CurrentUser: any;
  //Convert the local storage JSON data to an array object
  stringifiedData: any;



 /* @ViewChild('fileInput') fileInput: ElementRef | undefined;*/
  fileAttr = 'Choose File';
    currentApplication: number;
    configNumberOfProject: any;
    configMonthYear: any;
    wbs: any;
    WBS: string;
    wbsButton: boolean;
    CurrentApplicant: number;
    wbsRequired: boolean;
    typeOfApp: string;
    NotificationNumber: string;
    WBSNumber: string;
    PhysicalAddressOfProject: string;
    DescriptionOfProject: string;
    NatureOfWork: string;
    ExcavationType: string;
    ProjectNum: string;
    clientName: string;
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



  constructor(private modalService: NgbModal,
    private sharedService: SharedService,
    private userPofileService: UserProfileService,
    private stagesService: StagesService,
    private applicationsService: ApplicationsService,
    private commentsService: CommentsService,
    private depositRequiredService: DepositRequiredService,
    private NewWayleaveComponent: NewWayleaveComponent,
    private viewContainerRef: ViewContainerRef,
    private configService: ConfigService,
    private formBuilder: FormBuilder,
    private router: Router,
 
  ) { }

  ngOnInit(): void {

    this.getAllSubDepFroConditionalApprove();

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    this.applicationDataForView.push(this.sharedService.getViewApplicationIndex())
    this.CurrentApplicationBeingViewed.push(this.applicationDataForView[0]);

   
    const setValues = this.applicationDataForView[0];

    if (setValues != null || setValues != undefined) {
 
      this.ApplicationID = setValues.applicationID;
    }
    else {
 
      this.router.navigate(["/home"]);
    }
   

    this.CurrentApplicant = setValues.CreatedById;

    this.currentApplication = this.applicationDataForView.push(this.sharedService.getViewApplicationIndex())
    console.log("this is the created by ID", setValues);
    this.createdByID = setValues.CreatedById;
    this.getApplicationDetailsForDocs();
  


    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    //Assigns the below values to the variable that will be passed to the map component.
    this.ARCGISAPIData.createdByID = this.CurrentUser.appUserId;
    this.ARCGISAPIData.isActive = "1";
    /*    this.ARCGISAPIData.applicationID = this.notificationNumber;*/
    this.getAllComments();
    //this.getAllDocsForApplication();
    this.getUserProfileByUserID();
    this.getAllStages();
    this.setInterface();
    this.getAllRequiredDeposits();
/*    this.getAllSubDepFroConditionalApprove();*/
    this.getAllSubDepForReject();
    this.canReapply = this.sharedService.getCanReapply();
    console.log("canReapplyVen: ", this.canReapply);
    this.setProjectNumber();

  }

  setProjectNumber() {
    this.projectNo = this.CurrentApplicationBeingViewed[0].ProjectNumber;
    
  }

  getCurrentApplication(): any{
    return this.CurrentApplicationBeingViewed[0];
  }


  refreshComponent(): void {
    const currentApplication = this.CurrentApplicationBeingViewed[0];
    this.router.navigateByUrl('/view-project-info', { skipLocationChange: true })
      .then(() => {
        this.router.navigate(['/view-project-info'], { queryParams: { application: currentApplication } });
      });
  }
  refreshButtonClicked(): void {
    this.refreshComponent();
  }

  getAllComments() {
    this.CommentsList.splice(0, this.CommentsList.length);
    this.commentsService.getCommentByApplicationID(this.ApplicationID).subscribe((data: any) => {

      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempCommentList = {} as CommentsList;
          const current = data.dateSet[i];
          
          tempCommentList.ApplicationID = current.applicationID;
          tempCommentList.Comment = current.comment;
          tempCommentList.CommentID = current.commentID;
          tempCommentList.CommentStatus = current.commentStatus;
          tempCommentList.SubDepartmentForCommentID = current.subDepartmentForCommentID;
          tempCommentList.SubDepartmentName = current.subDepartmentName;
 

          this.CommentsList.push(tempCommentList);
          // this.sharedService.setStageData(this.StagesList);
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

  getAllRequiredDeposits() {
  

    this.depositRequiredService.getDepositRequiredByApplicationID(this.ApplicationID).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDepositRequired = {} as DepositRequired;
          const current = data.dateSet[i];
          tempDepositRequired.ApplicationID = current.applicationID;
          tempDepositRequired.DepositRequiredID = current.depositRequiredID;
          tempDepositRequired.Desciption = current.desciption;
          tempDepositRequired.Quantity = current.quantity;
          tempDepositRequired.Rate = current.rate;
          tempDepositRequired.SubDepartmentForCommentID = current.subDepartmentForCommentID;
          tempDepositRequired.SubDepartmentID = current.subDepartmentID;
          tempDepositRequired.SubDepartmentName = current.subDepartmentName;



          this.DepositRequired.push(tempDepositRequired);

        }

        console.log(" this.DepositRequiredList this.DepositRequiredList this.DepositRequiredList this.DepositRequiredList", this.DepositRequired);
      
      }
      else {
        alert(data.responseMessage);

      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  generateConsolidatedDepositInvoice() {
    // Retrieve deposit information
    //await this.getAllRequiredDeposits();
    
    // Create PDF document
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Set up table
    const startY = 50; // set the starting Y position for the table
    const headers = [
      [
        'Department',
        'Service Item Code',
        'Description',
        'Rate',
        'Quantity',
        'Amount'
      ]
    ];
    const data: any[] = [];

    // Logo
    const img = new Image();
    img.src = 'assets/cctlogoblack.png';

    // Add logo to PDF document
    doc.addImage(img, 'png', 10, 10, 60, 20);


    // Add title to PDF document
    doc.setFontSize(24);
    doc.text('Consolidated Deposit Invoice', 150, 40, { align: 'center' });

    // Add table with Wayleave Ref No., Date, and Invoice Number
    autoTable(doc, {
      body: [
        [
          {
            content: 'Wayleave Ref No.: BW/041/22'
              + '\nDate: ' + this.formattedDate
              + '\nInvoice Number: ' + "198091735",

            styles: {
              halign: 'right',
            }
          }
        ],
      ],

      theme: 'plain',
    });

    doc.setFontSize(10);
    doc.text('BTW Reg. Nr./VAT Reg. No.4500193497', 10, 50, { align: 'left' });
    doc.setFontSize(10);
    doc.text('City of Cape Town'+
    '\nPost Box / Posbus / iShokisi 655'+
    '\nCAPE TOWN'+
      '\n8001', 10, 60, { align: 'left' });

    doc.setFontSize(10);
    doc.text('BTW Reg. Nr./VAT Reg. No.4500193497', 10, 50, { align: 'left' });
    doc.setFontSize(10);
    doc.text('City of Cape Town' +
      '\nPost Box / Posbus / iShokisi 655' +
      '\nCAPE TOWN' +
      '\n8001', 10, 60, { align: 'left' });
    
    //autoTable(doc, {
    //  body: [
    //    [
    //      {
    //        content: 'BTW Reg. Nr./VAT Reg. No.4500193497',

    //        styles: {

    //          halign: 'left',
    //        }
    //      }
    //    ],
    //  ],


    //  theme: 'plain',


    //});

    //doc.setFontSize(10);
  

    // Add sub-department to table
    //const subDepartment = this.DepositRequiredList[0].SubDepartmentName;
    //data.push([{ content: `Sub-department: ${subDepartment}`, colSpan: 6, styles: { fontStyle: 'bold' } }, '', '', '', '', '']);

    // Initialize total variable
    let total = 0;

    // Populate table data with DepositRequiredList
    this.DepositRequired.forEach((deposit) => {
      const row = [
        deposit.SubDepartmentName,
        deposit.DepositRequiredID,
        deposit.Desciption,
        deposit.Rate,
        deposit.Quantity,
        deposit.Rate * deposit.Quantity // calculate amount based on rate and quantity
      ];
      total += Number(row[5]);
      data.push(row);
    });

    // Add total row to table
    const totalRow = [
      { content: 'Total:', colSpan: 5, styles: { fontStyle: 'bold' } },
      //'',
      //'',
      //'',
      //'',
      total// round total to 2 decimal places and add it to the total row data
    ];
    data.push(totalRow);


    // Add table to PDF document
    doc.setFontSize(12); // add this line to set the font size
    autoTable(doc, {
      head: headers,
      body: data,
      startY: 80,
      styles: {
        overflow: 'linebreak',
        halign: 'center',
        fontSize: 14
      },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold' },
        1: { cellWidth: 50 },
        2: { cellWidth: 80 },
        3: { cellWidth: 25, halign: 'right' },
        4: { cellWidth: 25, halign: 'right' },
        5: { cellWidth: 25, halign: 'right' }
      }
    });



    doc.text('Profit Centre: P19070051', 280, 140, { align: 'right' });
    doc.text('GL Acc: 845180', 10, 140, { align: 'left' });


    doc.setFontSize(20);
    doc.text('USE THIS REF NO: 198091735 TO MAKE EFT PAYMENTS' + '\nFOR THIS INVOICE ONLY', 150, 160, { align: 'center' });


    // Save PDF document
    doc.save('Deposit_Invoice_ApplicationID_' + this.DepositRequired[0].ApplicationID);
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


  buildProjectNumber() {
    this.configService.getConfigsByConfigName("ProjectNumberTracker").subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          this.configNumberOfProject = current.utilitySlot1; 
          this.configMonthYear = current.utilitySlot2;
          this.configService.addUpdateConfig(current.configID, null, null, (Number(this.configNumberOfProject) + 1).toString(), null, null, null).subscribe((data: any) => {
            if (data.responseCode == 1) {
              this.applicationsService.addUpdateApplication(this.ApplicationID, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "WL:" + (Number(this.configNumberOfProject) + 1).toString() +this.configMonthYear).subscribe((data: any) => {

                if (data.responseCode == 1) {
                 
                  alert("Your project number is: " +data.dateSet[0].projectNumber);

                
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
              //alert("Invalid Email or Password");
              alert(data.responseMessage);
            }
            console.log("addUpdateConfigReponse", data);

          }, error => {
            console.log("addUpdateConfigError: ", error);
          })
        }



      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);
      }
      console.log("getConfigsByConfigNameReponse", data);

    }, error => {
      console.log("getConfigsByConfigNameError: ", error);
    })
  }
  

  ChangeApplicationStatusToPaid() {

    if (this.CurrentApplicationBeingViewed[0].CurrentStageName == this.StagesList[1].StageName && this.CurrentApplicationBeingViewed[0].ApplicationStatus == "Unpaid") {
      this.applicationsService.updateApplicationStage(this.CurrentApplicationBeingViewed[0].applicationID, this.CurrentApplicationBeingViewed[0].PreviousStageName, this.CurrentApplicationBeingViewed[0].PreviousStageNumber, this.CurrentApplicationBeingViewed[0].CurrentStageName, this.CurrentApplicationBeingViewed[0].CurrentStageNumber, this.CurrentApplicationBeingViewed[0].NextStageName, this.CurrentApplicationBeingViewed[0].NextStageNumber, "Paid").subscribe((data: any) => {

        if (data.responseCode == 1) {
          alert("Application Status Updated to Paid");
          this.buildProjectNumber();
          //this.applicationsService.updateApplicationStage(null, null, null, null, null, null, null, null, " ").subscribe((data: any) => {
          //  if (data.responseCode == 1) {
          //   // const current = data.dateSet[0];
             



          //  }
          //  else {

          //    alert(data.responseMessage);
          //  }
          //  console.log("reponseGetSubDepartmentForComment", data);


          //}, error => {
          //  console.log("Error: ", error);
          //})



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
      alert("Application Status Is Not Unpaid");
    }


  }

  MoveToNextStage() {

  
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
  @ViewChild('pdfTable', { static: false }) pdfTable: ElementRef;

  /*CREATING THE APPROVAL PACK*/


  getAllSubDepFroConditionalApprove() {
    let commentS = "Approved(Conditional)";

    this.commentsService.getSubDepByCommentStatus(commentS, this.ApplicationID).subscribe((data: any) => {


      if (data.responseCode == 1) {

        for (var i = 0; i < data.dateSet.length; i++) {
          const tempSubDepCommentStatusList = {} as SubDepConditionalApproveList;

          const current = data.dateSet[i];
          tempSubDepCommentStatusList.SubDepID = current.subDepartmentID;
          tempSubDepCommentStatusList.SubDepName = current.subDepartmentName;
          tempSubDepCommentStatusList.ApplicationID = current.applicationID;
          tempSubDepCommentStatusList.Comment = current.comment;
          tempSubDepCommentStatusList.DateCreated = current.dateCreated;
          tempSubDepCommentStatusList.CommentStatus = current.commentStatus;

          this.SubDepConditionalApproveList.push(tempSubDepCommentStatusList);
         
        
        }

        console.log("THIS IS THE CUB DEP THAT HAS APPROVED THE APPLICATION CONDITIONALLY", data.dateSet);
      }

      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })

  }

  getAllSubDepForReject() {
    let commentS = "Rejected";

    this.commentsService.getSubDepByCommentStatus(commentS, this.ApplicationID).subscribe((data: any) => {


      if (data.responseCode == 1) {

        for (var i = 0; i < data.dateSet.length; i++) {
          const tempSubDepCommentStatusList = {} as SubDepConditionalApproveList;

          const current = data.dateSet[i];
          tempSubDepCommentStatusList.SubDepID = current.subDepartmentID;
          tempSubDepCommentStatusList.SubDepName = current.subDepartmentName;
          tempSubDepCommentStatusList.ApplicationID = current.applicationID;
          tempSubDepCommentStatusList.Comment = current.comment;
          tempSubDepCommentStatusList.DateCreated = current.dateCreated;
          tempSubDepCommentStatusList.CommentStatus = current.commentStatus;

          this.SubDepConditionalApproveList.push(tempSubDepCommentStatusList);


        }

        console.log("THIS IS THE CUB DEP THAT HAS APPROVED THE APPLICATION CONDITIONALLY", data.dateSet);
      }

      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })

  }
  getApplicationDetailsForDocs() {
    this.applicationDataForView.push(this.sharedService.getViewApplicationIndex())
    const setValues = this.applicationDataForView[0];

    this.typeOfApp = (setValues.TypeOfApplication);
    this.NotificationNumber =(setValues.NotificationNumber);
    this.WBSNumber =(setValues.WBSNumber);
    this.PhysicalAddressOfProject = (setValues.PhysicalAddressOfProject);
    this.DescriptionOfProject = (setValues.NatureOfWork);
    this.NatureOfWork =(setValues.NatureOfWork);
    this.ExcavationType = (setValues.ExcavationType);
    this.ProjectNum = (setValues.ProjectNumber);
    this.clientName = (setValues.clientName);
  }





  logoUrl: any;
  try: any;
  currentDate = new Date();
  datePipe = new DatePipe('en-ZA');
  formattedDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');


  onCreateApprovalPack() {

    /*this.getAllSubDepFroConditionalApprove();*/
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set up table
    const startY = 50; // set the starting Y position for the table
    const headers = [
      [
        'Department',
        'Comment',
        'Status'
      ]
    ];
    const data: any[] = [];

    const img = new Image();
    const footer = new Image();
    const page1 = new Image();
    const page2 = new Image();
    const page3 = new Image();
    const page4 = new Image();
    const page5 = new Image();
    const page6 = new Image();
    const page7 = new Image();
    const page8 = new Image();
    const page9 = new Image();
    const page10 = new Image();
    const page11 = new Image();
    const page12 = new Image();
    const page13 = new Image();
    const page14 = new Image();
    const page15 = new Image();
    const page16 = new Image();
    const page17 = new Image();
    const page18 = new Image();
    const page19 = new Image();
    const page20 = new Image();
    const page21 = new Image();
    const page22 = new Image();
    const page23 = new Image();
    const page24 = new Image();
    const page25 = new Image();
    const page26 = new Image();
    const page27 = new Image();
    const page28 = new Image();
    img.src = 'assets/cctlogoblack.png';
    footer.src ='assets/Packs/footer.PNG';
    page1.src ='assets/Packs/page1.PNG';
    page2.src ='assets/Packs/page2.PNG';
    page3.src ='assets/Packs/page3.PNG';
    page4.src ='assets/Packs/page4.PNG';
    page5.src ='assets/Packs/page5.PNG';
    page6.src ='assets/Packs/page6.PNG';
    page7.src ='assets/Packs/page7.PNG';
    page8.src ='assets/Packs/page8.PNG';
    page9.src ='assets/Packs/page9.PNG';
    page10.src ='assets/Packs/page10.PNG';
    page11.src ='assets/Packs/page11.PNG';
    page12.src ='assets/Packs/page12.PNG';
    page13.src ='assets/Packs/page13.PNG';
    page14.src ='assets/Packs/page14.PNG';
    page15.src ='assets/Packs/page15.PNG';
    page16.src ='assets/Packs/page16.PNG';
    page17.src ='assets/Packs/page17.PNG';
    page18.src ='assets/Packs/page18.PNG';
    page19.src ='assets/Packs/page19.PNG';
    page20.src ='assets/Packs/page20.PNG';
    page21.src ='assets/Packs/page21.PNG';
    page22.src ='assets/Packs/page22.PNG';
    page23.src ='assets/Packs/page23.PNG';
    page24.src ='assets/Packs/page24.PNG';
    page25.src ='assets/Packs/page25.PNG';
    page26.src ='assets/Packs/page26.PNG';
    page27.src ='assets/Packs/page27.PNG';
    page28.src ='assets/Packs/page28.PNG';
  

    // Add logo to PDF document

    // Add logo to PDF document
    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });
    //adding information underneath the logo

    doc.text('DATE : ' + this.formattedDate , 10, 45, { align: 'left' });

    doc.text('WAYLEAVE APPLICATION : ' + this.DescriptionOfProject, 10, 55, { maxWidth: 190, lineHeightFactor: 1.5, align: 'left' });

    doc.text('Dear ' + this.clientName, 10, 70, { align: 'left' });

  //this is for the project details

    //paragraph 
    doc.setFontSize(10);
    doc.text('Kindly find a summary on the outcome of this wayleave application below as well as departmental specific wayleave approval or rejection letters attached. In the case of a wayleave rejection, please make contact with the relevant Line Department as soon as possible. ', 10, 80, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });
    doc.text('Status Summary:', 10, 105, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });
 

    this.SubDepConditionalApproveList.forEach((deposit) => {
      const row = [
        deposit.SubDepName,
        deposit.Comment,
        deposit.CommentStatus,

      ];
 
      data.push(row);
    });
    doc.setLineHeightFactor(60);
    doc.setFontSize(10); // add this line to set the font size

    doc.text("Based on the summary above, the wayleave application is approved. Kindly proceed to apply for a permit to work before commencement of any work on site.", 10, 190, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });
    doc.setFontSize(12);
    doc.text("CITY OF CAPE TOWN, Future Planning and Resilience Directorate", 10, 220, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });
    doc.addImage(footer, 'png', 7, 255, 205, 45);


    autoTable(doc, {
      head: headers,
      
   startY: 120,
      body: data,
      styles: {
        overflow: 'visible',
        halign: 'justify',
        fontSize: 10,
        valign: 'middle',
        
      },
     
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold' },
        1: { cellWidth: 80 },
        2: { cellWidth: 40 },
      }

    
    });

    //PAGE 1
    doc.addPage();
    
    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });

 
    doc.addImage(page1, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 2
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page2, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);


    //PAGE 3
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page3, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 4
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page4, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 5
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page5, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 6
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page6, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 7
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page7, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 8
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page8, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 9
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page9, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 10
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page10, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 11
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page11, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 12
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page12, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 13
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page13, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 14
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page14, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 15
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page15, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 16
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page16, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 17
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page17, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 18
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page18, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 19
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page19, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 20
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page20, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 21
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page21, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 22
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page22, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 23
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page23, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 24
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page24, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 25
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page25, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);


    //PAGE 26
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page26, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 27
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page27, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 28
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page28, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    // Save PDF document
    doc.save('Approval Pack:' + this.CurrentUser.userProfileID);


  }




  onCrreateRejectionPack() {

    /*this.getAllSubDepFroConditionalApprove();*/
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set up table
    const startY = 50; // set the starting Y position for the table
    const headers = [
      [
        'Department',
        'Comment',
        'Status'
      ]
    ];
    const data: any[] = [];

    const img = new Image();
    const footer = new Image();

    img.src = 'assets/cctlogoblack.png';
    footer.src = 'assets/Packs/footer.PNG';



    // Add logo to PDF document

    // Add logo to PDF document
    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });
    //adding information underneath the logo

    doc.text('DATE : ' + this.formattedDate, 10, 45, { align: 'left' });

    doc.text('WAYLEAVE APPLICATION : ' + this.DescriptionOfProject, 10, 55, { maxWidth: 190, lineHeightFactor: 1.5, align: 'left' });

    doc.text('Dear ' + this.clientName, 10, 70, { align: 'left' });

    //this is for the project details

    //paragraph 
    doc.setFontSize(10);
    doc.text('Kindly find a summary on the outcome of this wayleave application below as well as departmental specific wayleave approval or rejection letters attached. In the case of a wayleave rejection, please make contact with the relevant Line Department as soon as possible. ', 10, 80, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });
    doc.text('Status Summary:', 10, 105, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });


    this.SubDepConditionalApproveList.forEach((deposit) => {
      const row = [
        deposit.SubDepName,
        deposit.Comment,
        deposit.CommentStatus,

      ];

      data.push(row);
    });
    doc.setLineHeightFactor(60);
    doc.setFontSize(10); // add this line to set the font size

    doc.text("Based on the summary above, the wayleave application is rejected. Please contact the relevant department for guidance on the way forward.", 10, 190, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });
    doc.setFontSize(12);
    doc.text("CITY OF CAPE TOWN, Future Planning and Resilience Directorate", 10, 220, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });
    doc.addImage(footer, 'png', 7, 255, 205, 45);


    autoTable(doc, {
      head: headers,

      startY: 120,
      body: data,
      styles: {
        overflow: 'visible',
        halign: 'justify',
        fontSize: 10,
        valign: 'middle',

      },

      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold' },
        1: { cellWidth: 80 },
        2: { cellWidth: 40 },
      }


    });

   

    // Save PDF document
    doc.save('Rejection Pack:' + this.CurrentUser.userProfileID);

  }


  goToNewWayleave(applicationType: boolean) { //application type refers to whether it is a brand new application or if it is a reapply.
    this.sharedService.setReapply(applicationType);
    this.NewWayleaveComponent.onWayleaveCreate(this.CurrentUser.appUserId, false);
    //console.log("Test: " + this.sharedService.getApplicationID())
    /*        this.router.navigate(["/new-wayleave"]);*/
    this.viewContainerRef.clear();

  }






  /*WBS Number*/
  enterWBSNumberModal(wbsNumberModal: any) {
    this.modalService.open(wbsNumberModal, { backdrop: 'static', size: 'xl' });
  }


  onCreateWBSNumber() {

    let WBS = this.addWBSNumber.controls["wbsnumber"].value;
    
    this.depositRequiredService.addUpdateWBSNUmber(this.DepositRequired[0].DepositRequiredID,this.CurrentUser.appUserId,WBS).subscribe((data: any) => {

      if (data.responseCode == 1) {

        alert(data.responseMessage);
        this.wbsRequired = true;

        this.depositRequiredService.getDepositRequiredByApplicationID(this.ApplicationID).subscribe((data: any) => {

          if (data.responseCode == 1) {
            const tempDepositReq = {} as DepositRequired;
            const current = data.dateSet[0];
            tempDepositReq.WBS = current.wbs;
            this.wbsNumberRequested=current.wbs;

            this.DepositRequired.push(tempDepositReq);

            alert(data.responseMessage);


          }
          else {
            alert(data.responseMessage);
        
          }
          console.log("reponse", data);

        }, error => {
          console.log("Error: ", error);
        })
      }
      else {
        alert(data.responseMessage);
        this.wbsRequired = false;
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })

  }

  option: any;

  reciveOption($event: any) {
    
    this.option = $event
    if (this.option == "True") {
      this.wbsButton = true;
    }
    else if (this.option == "False") {
      this.wbsButton = false;
    }
  }

}
