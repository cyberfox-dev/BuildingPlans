import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  SubDepartmentForCommentID: number

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

}

const Document_DATA: Documents[] = [
  { name: 'doc1' },
  { name: 'doc2'  },
  { name: 'doc3' },
];

var img = new Image();
img.src = 'assets/cctlogoblack.png';

@Component({
  selector: 'app-view-project-info',
  templateUrl: './view-project-info.component.html',
  styleUrls: ['./view-project-info.component.css']
})



export class ViewProjectInfoComponent implements OnInit {

  //Initialize the interface for ARCGIS
  ARCGISAPIData = {} as ARCGISAPIData;

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
  CommentsList: CommentsList[] = [];
  SubDepConditionalApproveList: SubDepConditionalApproveList[] = [];

  CurrentApplicationBeingViewed: ApplicationList[] = [];
  DepositRequiredList: DepositRequired[] = [];

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

  constructor(private modalService: NgbModal,
    private sharedService: SharedService,
    private userPofileService: UserProfileService,
    private stagesService: StagesService,
    private applicationsService: ApplicationsService,
    private commentsService: CommentsService,
    private depositRequiredService: DepositRequiredService,

  ) { }

  ngOnInit(): void {



    this.applicationDataForView.push(this.sharedService.getViewApplicationIndex())
    this.CurrentApplicationBeingViewed.push(this.applicationDataForView[0]);

   
    const setValues = this.applicationDataForView[0];
    this.ApplicationID = setValues.applicationID;


    console.log("this is the created by ID", setValues);
    this.createdByID = setValues.CreatedById;

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    //Assigns the below values to the variable that will be passed to the map component.
    this.ARCGISAPIData.createdByID = this.CurrentUser.appUserId;
    this.ARCGISAPIData.isActive = "1";
    /*    this.ARCGISAPIData.applicationID = this.notificationNumber;*/
    this.getAllComments();
    this.getUserProfileByUserID();
    this.getAllStages();
    this.setInterface();
    this.getAllRequiredDeposits();
    this.getAllSubDepFroConditionalApprove();
  }

  getAllComments() {
    this.commentsService.getCommentByApplicationID(this.ApplicationID).subscribe((data: any) => {

      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempCommentList = {} as CommentsList;
          const current = data.dateSet[i];
          debugger;
          tempCommentList.ApplicationID = current.applicationID;
          tempCommentList.Comment = current.comment;
          tempCommentList.CommentID = current.commentID;
          tempCommentList.CommentStatus = current.commentStatus;
          tempCommentList.SubDepartmentForCommentID = current.subDepartmentForCommentID;
 

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



          this.DepositRequiredList.push(tempDepositRequired);

        }

        console.log(" this.DepositRequiredList this.DepositRequiredList this.DepositRequiredList this.DepositRequiredList", this.DepositRequiredList);
      
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
    debugger;
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

  

    // Add sub-department to table
    //const subDepartment = this.DepositRequiredList[0].SubDepartmentName;
    //data.push([{ content: `Sub-department: ${subDepartment}`, colSpan: 6, styles: { fontStyle: 'bold' } }, '', '', '', '', '']);

    // Initialize total variable
    let total = 0;

    // Populate table data with DepositRequiredList
    this.DepositRequiredList.forEach((deposit) => {
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
    doc.save('Deposit Invoice');
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

    ;
    //alert("ChangeApplicationStatusToPaid");

    if (this.CurrentApplicationBeingViewed[0].CurrentStageName == this.StagesList[1].StageName && this.CurrentApplicationBeingViewed[0].ApplicationStatus == "Unpaid") {
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
      alert("Application Status Is Not Unpaid");
    }


  }

  MoveToNextStage() {

    ;
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

    this.commentsService.getSubDepByCommentStatus(commentS).subscribe((data: any) => {


      if (data.responseCode == 1) {
        const tempSubDepCommentStatusList = {} as SubDepConditionalApproveList;
        for (var i = 0; i < data.dateSet.length; i++) {


          const current = data.dateSet[i];
          tempSubDepCommentStatusList.SubDepID = current.SubDepID;
          tempSubDepCommentStatusList.SubDepName = current.SubDepName;
          tempSubDepCommentStatusList.ApplicationID = current.ApplicationID;
          tempSubDepCommentStatusList.Comment = current.Comment;
          tempSubDepCommentStatusList.DateCreated = current.DateCreated;


          this.SubDepConditionalApproveList.push(tempSubDepCommentStatusList);
        
        }
        console.log("data", data.dateSet);
      }

      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })

  }





  logoUrl: any;
  try: any;
  currentDate = new Date();
  datePipe = new DatePipe('en-ZA');
  formattedDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
  onCreateApprovalPack() {

    /*this.getAllSubDepFroConditionalApprove();*/
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
        'Department Comment',
        'Comment',
      ]
    ];
    const data: any[] = [];

    const img = new Image();
    img.src = 'assets/cctlogoblack.png';

    // Add logo to PDF document
    doc.addImage(img, 'png', 10, 10, 60, 20);

    // Add title to PDF document
    doc.setFontSize(24);
    doc.text('Wayleave Approval Pack', 150, 40, { align: 'center' });
    doc.setLineHeightFactor(10);


    doc.setFontSize(15);
    doc.text('Dear ' + this.CurrentUser.appUserID + ', Your application has been approved by all departments. But on condition by the following departments:',10,50);

    this.SubDepConditionalApproveList.forEach((deposit) => {
      const row = [
        deposit.SubDepName,
        deposit.Comment,
        deposit.CommentStatus

      ];
 
      data.push(row);
    });

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
      }
    });

    // Save PDF document
    doc.save('Approval Pack');




/*
   this.try = 1;

    this.logoUrl = img.src;
    const doc = new jsPDF();

    autoTable(doc, {
      body: [
        [
          {
            content: this.logoUrl,

            styles: {
              halign: 'left',
              fontSize: 20,
              textColor: '#ffffff',
            }
          },
          {
            content: 'Wayleave Application Fee Invoice',
            styles: {
              halign: 'right',
              fontSize: 15,
              textColor: '#ffffff',
            }
          }
        ],
      ],

      theme: 'plain',
      styles: {
        fillColor: '#3366ff',
      }
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Wayleave Ref No.: '
              + '\nDate: ' + this.formattedDate
              + '\nInvoice Number: ' + "12345678",

            styles: {
              halign: 'right',
            }
          }
        ],
      ],

      theme: 'plain',
    });

    const startY = 100; // set the starting Y position for the table

    autoTable(doc, {
      head: [['Service Item Code', 'Description', 'Rate', 'Quantity', 'Amount']],
      body: [
        ['001', this.try, '$100.00', '2', '$200.00'],
        ['002', 'Site Survey', '$200.00', '1', '$200.00'],
        ['003', 'Permitting Services', '$300.00', '3', '$900.00'],
      ],

      theme: 'plain',
      startY: startY,
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Wayleave Ref No.: '
              + '\nDate: ' + this.currentDate
              + '\nInvoice Number: ' + "12345678",

            styles: {
              halign: 'left',

            }
          }
        ],
      ],

      theme: 'plain',
      startY: startY + 30, // add 30 units of Y position to create space between the tables
    });

    return doc.save("Approval Pack");*/
  }


}
