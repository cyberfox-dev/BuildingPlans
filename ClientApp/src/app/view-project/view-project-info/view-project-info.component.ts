import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from "src/app/shared/shared.service";
import { UserProfileService } from 'src/app/service/UserProfile/user-profile.service';
import { StagesService } from '../../service/Stages/stages.service';
import { ApplicationsService } from '../../service/Applications/applications.service';
import { CommentsService } from '../../service/Comments/comments.service';
import { DepositRequiredService } from 'src/app/service/DepositRequired/deposit-required.service';
import jsPDF from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { NewWayleaveComponent } from 'src/app/create-new-wayleave/new-wayleave/new-wayleave.component';
import { ConfigService } from 'src/app/service/Config/config.service';
import { DocumentUploadService } from 'src/app/service/DocumentUpload/document-upload.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { SubDepartmentForCommentService } from 'src/app/service/SubDepartmentForComment/sub-department-for-comment.service';
import { SubDepartmentsService } from 'src/app/service/SubDepartments/sub-departments.service';
import { AccessGroupsService } from '../../service/AccessGroups/access-groups.service';
import { BusinessPartnerService } from '../../service/BusinessPartner/business-partner.service';
import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { FinancialService } from '../../service/Financial/financial.service';
import { PermitService } from '../../service/Permit/permit.service';
import { MobileFieldTrackingService } from 'src/app/service/MFT/mobile-field-tracking.service';
import { FileUploadComponent } from 'src/app/file-upload/file-upload.component';
import { ServiceItemService } from 'src/app/service/ServiceItems/service-item.service';

import 'jspdf-autotable';


export interface RolesList {
  RoleID: number;
  RoleName: string;
  AccessGroupID: number;
  AccessGroupName: string;
}
export interface MFTList {
  MFTID: number;
  MFTNote: string;
  DocumentName: string;
  DocumentLocalPath: string;
  DateCreated: Date;
  ApplicationNumber: number;
  FullName: string;
}

export interface SubDepartmentList {
  IsRefered: any;
  isAwaitingClarity: any;
  subDepartmentID: number;
  subDepartmentName: string;
  departmentID: number;
  dateUpdated: any;
  dateCreated: any;
  subdepartmentForCommentID: number | null;
  UserAssaignedToComment: string | null;
  commentStatus: string | null;
}

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
  UserName: string;
}
export interface SubDepSubDepRejectList {
  SubDepID: number;
  SubDepName: string;
  ApplicationID: number;
  Comment: string;
  CommentStatus: string;
  DateCreated: any;
}

export interface SubDepFinalApproveList {
  SubDepID: number;
  SubDepName: string;
  ApplicationID: number;
  Comment: string;
  CommentStatus: string;
  DateCreated: any;
  UserName: string;
}

export interface DocumentsList {
  DocumentID: number;
  DocumentName: string;
  DocumentLocalPath: string;
  ApplicationID: number;
  AssignedUserID: string;
}

export interface FinancialDocumentsList {
  FinancialID: number;
  FinancialDocumentName: string;
  FinancialName: string;
  FinancialType: string;
  FinancialDocumentLocalPath: string;
  ApplicationID: number;
  CreatedById: string;
}

export interface CommentsList {
  CommentID: number;
  ApplicationID: number;
  Comment: string;
  CommentStatus: string;
  SubDepartmentForCommentID: number;
  SubDepartmentName?: string;
  isClarifyCommentID?: number; 
  isApplicantReplay?: string; 


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
  permitStartDate: Date,
  DatePaid: Date;
}



const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Proof of payment' },
  { name: 'Invoice' },
  { name: 'deposit DS456' },
];

export interface ServiceItemList {
  serviceItemID: number;
  serviceItemCode: string;
  Description: string;
  Rate: any;
  totalVat: number;
  dateCreated: any;
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
  WBS?: string;
}


export interface AllSubDepartmentList {
  subDepartmentID: number;
  subDepartmentName: string;
  departmentID: number;
  dateUpdated: any;
  dateCreated: any;
  subdepartmentForCommentID: number | null;
  UserAssaignedToComment: string | null;
  commentStatus: string | null;
  GLCode: string | null;
  ProfitCenter: string | null;
}

var img = new Image();
img.src = 'assets/cctlogoblack.png';

interface jsPDFWithPlugin extends jsPDF {
  autotable: (options: UserOptions) => jsPDF;
}

@Component({
  selector: 'app-view-project-info',
  templateUrl: './view-project-info.component.html',
  styleUrls: ['./view-project-info.component.css']
})



export class ViewProjectInfoComponent implements OnInit {

  minDate: string;

  public addWBSNumber = this.formBuilder.group({
    wbsnumber: ['', Validators.required],


  })

  //Initialize the interface for ARCGIS
  ARCGISAPIData = {} as ARCGISAPIData;
  auditTrail: boolean = false;
  public isInternalUser: boolean = false;
  canReapply = false;
  public projectNo = "";
  createdByID: any | undefined;

  rejected: boolean = false;
  approved: boolean = false;
 
  canClarify: boolean;
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

  permitDate = '';

  ExternalPaid: boolean = false;

  option: any;

  wbsNumberRequested = '';


  logoUrl: any;
  try: any;
  currentDate = new Date();
  datePipe = new DatePipe('en-ZA');
  formattedDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');


  applicationDataForView: ApplicationList[] = [];
  StagesList: StagesList[] = [];
  CommentsList: CommentsList[] = [];
  SubDepConditionalApproveList: SubDepConditionalApproveList[] = [];
  SubDepFinalApproveList: SubDepFinalApproveList[] = [];
  SubDepSubDepRejectList: SubDepSubDepRejectList[] = [];
  RolesList: RolesList[] = [];
  SubDepartmentList: SubDepartmentList[] = [];
  SubDepartmentsList: SubDepartmentList[] = [];

  CurrentApplicationBeingViewed: ApplicationList[] = [];
  DepositRequired: DepositRequired[] = [];
  relatedApplications: ApplicationList[] = [];
  MFTList: MFTList[] = [];

  DocumentsList: DocumentsList[] = [];
  FinancialDocumentsList: FinancialDocumentsList[] = [];

  ServiceItemList: ServiceItemList[] = [];
  AllSubDepartmentList: AllSubDepartmentList[] = [];

  @ViewChild('pdfTable', { static: false }) pdfTable: ElementRef;

  ApplicationID: number | undefined;

  CurrentUser: any;
  //Convert the local storage JSON data to an array object
  stringifiedData: any;
  clarifyBtn: boolean = false;
  replyCreated: boolean = false;
  editComment: boolean = true;
  ApplicantReply = '';
  reply = ''
  /* @ViewChild('fileInput') fileInput: ElementRef | undefined;*/
  fileAttr = 'Choose File';
  commentEdit: any;
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
  ApprovalPackBtn: boolean = false;
  RejectionPackBtn: boolean = false;
  depID: any;
  subDepNameForClarify: any;
  currentIndex: any;
  subDepartmentForComment: any;
    permitStartDate: Date;
  permitBtn: boolean;
  permitTextBox: boolean = false;
  startDate: string;
  selectPaidDate: Date;


  fileAttrs = "Upload File:";
  fileAttrsName = "Doc";

    ApForUpload: string;
    showPermitTab: boolean;
    hasFile: boolean;
    EMBUsers: any;
    loggedInUsersSubDepartmentID: number;
    CurrentUserProfile: any;
    stringifiedDataUserProfile: any;
    isEMBUser: boolean;
    datePaid: string;
  Paid: string;
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

  isFinancial = true;

  openEditCommentModal(commentEditorModal: any, index: any) {
    

    this.currentIndex = index;

    this.commentEdit = this.CommentsList[index].Comment;


    this.subDepartmentForComment = this.CommentsList[index].SubDepartmentForCommentID;
    this.modalService.open(commentEditorModal, { centered: true, size: 'lg' });

  }

  @ViewChild(MatTable) FinancialListTable: MatTable<DocumentsList> | undefined;


  displayedColumns: string[] = ['FinancialName','FinancialDocumentName' ,'actions'];
  dataSourceDoc = this.FinancialDocumentsList;


  panelOpenState = false;

  fileCount = 0;


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
    private accessGroupsService: AccessGroupsService,
    private formBuilder: FormBuilder,
    private subDepartmentForCommentService: SubDepartmentForCommentService,
    private router: Router,
    private subDepartmentService: SubDepartmentsService,
    private businessPartnerService: BusinessPartnerService,
    private documentUploadService: DocumentUploadService,
    private http: HttpClient,
    private financial: FinancialService,
    private permitService: PermitService,
    private MFTService: MobileFieldTrackingService,
    private fileUploadComponent: FileUploadComponent,
    private serviceItemService: ServiceItemService,
    
  ) { }



  ngOnInit(): void {

    this.getAllSubDepFroConditionalApprove();

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    this.applicationDataForView.push(this.sharedService.getViewApplicationIndex())
    this.CurrentApplicationBeingViewed.push(this.applicationDataForView[0]);

 
    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);
    console.log("000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", this.applicationDataForView[0]);
    this.loggedInUsersSubDepartmentID = this.CurrentUserProfile[0].subDepartmentID;
    this.loggedInUsersSubDepartmentID = this.CurrentUserProfile[0].subDepartmentID;


    const today = new Date();
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(today.getDate() + 14); // Add 14 days to the current date

    this.minDate = twoWeeksFromNow.toISOString().split('T')[0];








    const setValues = this.applicationDataForView[0];

    if (setValues != null || setValues != undefined) {

      this.ApplicationID = setValues.applicationID;
    }
    else {

      this.router.navigate(["/home"]);
    }

    if (setValues.CurrentStageName == "PTW") {
      this.showPermitTab = true;
    } else {
      this.showPermitTab = false;
    }

    this.getRolesLinkedToUser();
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
    this.getAllSubDepFroConditionalApprove();

/*    this.getAllSubDepForReject();*/
/*    this.getAllSubDepForReject();*/
    this.canReapply = this.sharedService.getCanReapply();
    console.log("canReapplyVen: ", this.canReapply);
    this.setProjectNumber();
 
    this.getLinkedDepartments();
    this.checkIfCanReply();
    this.checkIfPermitExsist();
    this.getFinancial();
    this.getMFTForApplication();
    this.getEMBUsers();
    this.getServiceItem("001");
    this.getServiceItem("002");
    this.getServiceItem("003");
    this.getAllSubDepartments();

  }
  receivedata: string;

  receiveData(data: string) {
    
    this.receivedata = data;
    console.log(this.receivedata);
    if (this.receivedata == "Final Approved") {
      this.approved = true;
      this.onCreateApprovalPack();
    }
    else if (this.receivedata == "Rejected") {
      this.rejected = true;
      this.onCrreateRejectionPack();
    }
    else {

    }

  }

  onCloseFile() {
    if (this.hasFile) {
      if (confirm("The file will be uploaded if you proceed. Click 'OK' to upload or 'Cancel' to delete the file before proceeding.")) {
        this.modalService.dismissAll();
      }
      else {

      }

    } else {
      this.modalService.dismissAll();
    }


  }

  getAllSubDepartments() {
    this.subDepartmentService.getSubDepartmentsList().subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {

          const tempSubDepartmentLinkedList = {} as AllSubDepartmentList;
          const current = data.dateSet[i];

          tempSubDepartmentLinkedList.subDepartmentID = current.subDepartmentID;
          tempSubDepartmentLinkedList.UserAssaignedToComment = current.userAssaignedToComment;
          tempSubDepartmentLinkedList.subDepartmentName = current.subDepartmentName;
          tempSubDepartmentLinkedList.departmentID = current.departmentID;
          tempSubDepartmentLinkedList.dateUpdated = current.dateUpdated;
          tempSubDepartmentLinkedList.dateCreated = current.dateCreated;
          tempSubDepartmentLinkedList.subdepartmentForCommentID = current.subDepartmentForCommentID;
          tempSubDepartmentLinkedList.GLCode = current.glCode;
          tempSubDepartmentLinkedList.ProfitCenter = current.profitCenter;


          this.AllSubDepartmentList.push(tempSubDepartmentLinkedList);

        }


      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);


      }
      console.log("reponseGetAllLinkedSubDepartmentsForComment", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  getSubByName(subDepName: string) {
    for (let i = 0; i < this.AllSubDepartmentList.length; i++) {
      if (this.AllSubDepartmentList[i].subDepartmentName === subDepName) {
        return this.AllSubDepartmentList[i];
      }
    }
    return null;  // or you might want to throw an error
  }

  getServiceItem(serviceItemCode: string) {



    this.serviceItemService.getServiceItemByServiceItemCode(serviceItemCode).subscribe((data: any) => {
      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempServiceItemList = {} as ServiceItemList;
          const current = data.dateSet[i];
          tempServiceItemList.serviceItemCode = current.serviceItemCode;
          tempServiceItemList.Rate = current.rate;
          tempServiceItemList.Description = current.description;

          this.ServiceItemList.push(tempServiceItemList);

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

  addInvoiceTitle(doc) {
    autoTable(doc, {
      body: [['Wayleave Application Fee Invoice']],
      styles: { halign: 'right', fontSize: 20, textColor: '#000000' },
      theme: 'plain'
    });
  }

  addClientDetails(doc) {
    autoTable(doc, {
      body: [['Wayleave Reference: ' + this.ApplicationID
        + '\nCustomer VAT registration number: No.4500193497'
        + '\nBusiness partner number: No.4500193497']],
      styles: { halign: 'right' },
      theme: 'plain'
    });
  }

  addCompanyDetails(doc) {
    autoTable(doc, {
      body: [['Civic Centre'
        + '\n12 Hertzog Boulevard 8001'
        + '\nPO Box 655 Cape Town 8000'
        + '\nVAT registration number: 4500193497'
        + '\nEmail: wayleaves@capetown.gov.za'
        + '\nWeb address: www.capetown.gov.za']],
      styles: { halign: 'left' },
      theme: 'plain'
    });
  }

  addServiceItemsAndCostDetailsSJ(doc, startY) {
    // Generate table body based on ServiceItemList data and calculate the total cost
    let totalCost = 0;
    let tableBody = this.ServiceItemList.map(item => {
      const amount = item.Rate; // Assuming amount equals rate for each item
      totalCost += parseFloat(amount);

      let profitCenter = '';
      let glCode = '';
      if (item.Description === 'RIM Admin Fee') {
        profitCenter = this.getSubByName("Roads & Infrastructure Management").ProfitCenter;
        glCode = this.getSubByName("Roads & Infrastructure Management").GLCode;
      } else if (item.Description === 'Water & Sanitation Admin Fee') {
        profitCenter = this.getSubByName("Waste Water and Treatment").ProfitCenter;
        glCode = this.getSubByName("Waste Water and Treatment").GLCode;
      } else {
        profitCenter = this.getSubByName("EMB").ProfitCenter;
        glCode = this.getSubByName("EMB").GLCode;
      }

      return ['1', item.Description, amount, amount, profitCenter, glCode];
    });

    // Calculate the VAT and total amount due
    const vat = totalCost * 0.15;
    const totalAmountDue = totalCost + vat;

    // Add cost details directly to the table body
    tableBody.push(
      ['Amount Due', '', '', totalCost.toFixed(2), '', ''],
      ['VAT (15%)', '', '', vat.toFixed(2), '', ''],
      ['Total Amount Due', '', '', totalAmountDue.toFixed(2), '', '']
    );

    // Add the combined table to the document
    autoTable(doc, {
      head: [['Quantity', 'Description', 'Unit', 'Amount', 'Profit Center', 'GL Code']],
      body: tableBody,
      theme: 'grid',
      styles: { cellPadding: 1, lineWidth: 0.1, lineColor: [220, 220, 220], cellWidth: 'wrap', fillColor: [255, 255, 255] }, // setting cell color to white
      headStyles: { fillColor: [180, 180, 180] }, // setting header color to a darker grey
      startY: startY,
      margin: { top: 20 }
    });

    // Return the new startY value
    return startY + 40; // decreased from 60 + 20
  }

  addAccountDetails(doc, startY) {
    const boxContent = 'Profit Centre: ' + this.getSubByName("EMB").ProfitCenter
      + '\nGL Acc: ' + this.getSubByName("EMB").GLCode
    

    autoTable(doc, {
      body: [[boxContent]],
      styles: { halign: 'center', valign: 'middle', fillColor: [255, 255, 255] }, // white fill color
      theme: 'grid',
      startY: startY,
    });

    return startY + 30; // adjust this value as needed
  }

  addPayPointsNotice(doc, startY) {
    autoTable(doc, {
      body: [['Pay points: City of Cape Town cash offices or the vendors below:']],
      styles: { halign: 'left' },
      theme: 'plain',
      startY: startY + 20 // adjust this value to create space between the tables
    });
    return startY + 20 + 20; // decreased from 100 + 20
  }

  addPaymentDetails(doc, startY) {
    autoTable(doc, {
      body: [['Please Note:\n\n'
        + '1. Payment options:\n\n'
        + '(a) Electronic payments (EFT): Select the City of Cape Town as a bank-listed beneficiary on your bank\'s website. Use the reference number provided above.\n'
        + '(b) Direct deposit at Nedbank: Please present your reference number to the bank teller.\n'
        + '(c) Cash, debit card, credit card and other: Please present your reference number to the cashier.\n\n'
        + '2. Failure to pay could result in:\n\n'
        + '(a) The lapse of your application, resulting in the need for re-application\n'
        + '(b) Necessity for re-application with no guarantee of similar conditions / requirements']],
      styles: { halign: 'left' },
      theme: 'plain',
      startY: startY + 20 // adjust this value to create space between the tables
    });
    return startY + 20 + 20; // decreased from 100 + 20
  }

  generateInvoiceSplit() {

      // Create a new PDF
      const doc = new jsPDF();

      // Add company logo
      const logo = new Image();
      logo.src = 'assets/cctlogoblack.png';
      doc.addImage(logo, 'png', 10, 10, 60, 20);

      // Add invoice title
      this.addInvoiceTitle(doc);

      // Add client details
      this.addClientDetails(doc);

      // Add company contact details
      this.addCompanyDetails(doc);


      // Set the starting Y position for the table
      let startY = 100;

      // Generate service items table, cost details and calculate total cost
      startY = this.addServiceItemsAndCostDetailsSJ(doc, startY);

      startY += 8; // adjust this value as needed

      // Add account details
      startY = this.addAccountDetails(doc, startY);

      // Reduce the gap before the next section
      startY -= 28; // adjust this value as needed

      // Add payment options and consequences of non-payment
      startY = this.addPaymentDetails(doc, startY);

      // Increase the gap before the next section
      startY += 20;

      // Add pay points notice
      startY = this.addPayPointsNotice(doc, startY);

      startY -= 35; // adjust this value as needed


      // Add vendors image

      //  const vendors = new Image();
      //vendors.src = 'assets/vendors.jpg';

      //const pageWidth = doc.internal.pageSize.getWidth();
      //const aspectRatio = vendors.width / vendors.height; // assumes vendors Image object contains width and height properties
      //const imgHeightOnPage = pageWidth / aspectRatio;

      //doc.addImage(vendors, 'JPEG', 0, startY + 40, pageWidth, imgHeightOnPage);


      const vendors = new Image();
      vendors.src = 'assets/vendors.jpg';
      doc.addImage(vendors, 'JPEG', 15, startY + 25, 180, 20);

      // Save the PDF as a blob object and push it for temporary upload
      this.saveAndUploadPDFSplit(doc);

      // Navigate to home page
     // this.router.navigate(["/home"]);
    
  }

  saveAndUploadPDFSplit(doc) {
    this.sharedService.FileDocument = [];
    doc.save("invoiceSplit.pdf");
   // const pdfData = doc.output('blob'); // Convert the PDF document to a blob object
  //  const file = new File([pdfData], 'Wayleave Application Fee Invoice Split.pdf', { type: 'application/pdf' });

    // Prepare the form data
 //   const formData = new FormData();
 //   formData.append('file', file);

   // this.sharedService.pushFileForTempFileUpload(file, "Wayleave Application Fee Invoice Split" + ".pdf");
   // this.save();
  }

   getEMBUsers() {
     this.accessGroupsService.getUserBasedOnRoleName("EMB", this.loggedInUsersSubDepartmentID).subscribe((data: any) => {

    if (data.responseCode == 1) {
      this.EMBUsers = data.dateSet;
      debugger;
      for (var i = 0; i < this.EMBUsers.length; i++) {
        const currentEMBUser = this.EMBUsers[i].userID;
        if (currentEMBUser == this.CurrentUser.appUserId) {
          this.isEMBUser = true;
        } else {
          this.isEMBUser = false;
        }
      }
    
    }
    else {
      alert(data.responseMessage);
    }
    console.log("getAllLinkedRolesReponse", data);

  }, error => {
    console.log("getAllLinkedRolesReponseError: ", error);
  })
}

  //validate(): void {
  //  //this.businessPartnerService.validateBP().subscribe(
  //  //  (response: boolean) => {
  //  //    // Handle the API response
  //  //    console.log('API response:', response);

  //  //    // Update SQL database accordingly
  //  //    // ...
  //  //  },
  //  //  (error: any) => {
  //  //    alert('API error: '+ error);
  //  //    console.error('API error:', error);
  //  //  }
  //  //);


  //  this.businessPartnerService.validateBP(123).subscribe(
  //    (response: boolean) => {
  //      // Handle the API response
  //      console.log('API response:', response);

  //      // Update SQL database accordingly
  //      // ...
  //    },
  //    (error: any) => {
  //      // Handle API errorerror
  //      console.error('API error:', error);
  //    }
  //  );
  //}

  validate(): void {
    this.businessPartnerService.validateBP(1000110197).subscribe(
      (response: any) => {
        // Handle the API response
        console.log('API response:', response);

        // Access the "Response" property
        const apiResponse = response.Response;
        // Update SQL database accordingly
        // ...
        alert(apiResponse);
      },
      (error: any) => {
        // Handle API error
        console.error('API error:', error);
      }
    );
  }



  checkIfCanReply() {
    if (this.CurrentApplicant == this.CurrentUser.appUserId) {
      this.canClarify = true;
    }
    else {
      this.canClarify = false;
    }
  }

  onFileDelete(event: any, index: number) {
    this.hasFile = false;
    this.fileAttrsName = "Doc";

    //this.getAllDocsForApplication();
    this.fileCount = this.fileCount - 1;

  }
  changeHasFile() {
    if (this.hasFile) {
      this.hasFile = false;
    } else {
      this.hasFile = true;
    }
  }
  onFileUpload(event: any) {
    

  }


  onAutoLinkForPermit() {
    
    this.subDepartmentForCommentService.getSubDepartmentForComment(this.ApplicationID).subscribe((data: any) => {

      if (data.responseCode == 1) {
        
        for (var i = 0; i < data.dateSet.length; i++) {
          this.permitService.addUpdatePermitSubForComment(0, this.ApplicationID, data.dateSet[i].subDepartmentID, data.dateSet[i].subDepartmentName, null, null,null ,this.CurrentUser.appUserId).subscribe((data: any) => {
            
            if (data.responseCode == 1) {
              
              // alert(data.dateSet.subDepartmentName + " assigned to this Application");

            }
            else {

              alert(data.responseMessage);
            }
            console.log("reponseAddUpdateDepartmentForComment", data);


          }, error => {
            console.log("Error: ", error);
          })
        }
      }
      else {

        alert(data.responseMessage);
      }
      console.log("reponseAddUpdateDepartmentForComment", data);


    }, error => {
      console.log("Error: ", error);
    })
  }



  setProjectNumber() {
    
    if (this.CurrentApplicationBeingViewed[0].ProjectNumber == null) {
      

      this.projectNo = this.CurrentApplicationBeingViewed[0].applicationID.toString();
    }
    else {
      
      this.projectNo = this.CurrentApplicationBeingViewed[0].ProjectNumber;
    }
   

  }

  getCurrentApplication(): any {
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
          tempCommentList.isClarifyCommentID = current.isClarifyCommentID;
          tempCommentList.isApplicantReplay = current.isApplicantReplay;
          this.CommentsList.push(tempCommentList);
          console.log("THISISTHECOMMENTSLISTTHISISTHECOMMENTSLIST", current);

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

  openReplyModal(replyModal: any, index: any) {
    this.modalService.open(replyModal, { centered: true, size: 'lg' })
    this.currentIndex = index;
    if (this.CommentsList[index].isApplicantReplay != null) {
      this.reply = this.CommentsList[index].isApplicantReplay;
    }

    this.subDepartmentForComment = this.CommentsList[index].SubDepartmentForCommentID;

  }


  //async getSelectedDepartment(subDepID:number) {


  //   //this.LinkedUserToSub.splice(0, this.LinkedUserToSub.length);
  // await  this.subDepartmentForCommentService.getSubDepartmentForCommentBySubID(this.ApplicationID, subDepID ).subscribe((data: any) => {
  //     if (data.responseCode == 1) {
  //       const current = data.dateSet[0];
  //       

  //       this.subDepartmentForComment = current.subDepartmentForCommentID;


  //     }
  //     else {

  //       alert(data.responseMessage);
  //     }
  //     console.log("reponseGetSubDepartmentForComment", data);


  //   }, error => {
  //     console.log("Error: ", error);
  //   })

  // }




  updateComment() {
    let CurrentComment = this.commentEdit;

    const currentComment = this.CommentsList[this.currentIndex];
    //let numberOfComments = 0;
    //for (var i = 0; i < this.CommentsList.length; i++) {
    //  if (this.CommentsList[i].SubDepartmentForCommentID == currentComment.SubDepartmentForCommentID) {
    //    numberOfComments++;
    //  }
    //}


    if (confirm("Are you sure you want update this comment?")) {
      this.commentsService.addUpdateComment(currentComment.CommentID, null, null, null, null, CurrentComment, null, null, null, null).subscribe((data: any) => {

        if (data.responseCode == 1) {
          this.getAllComments();

          alert("Update Comment Successful");

        }
        else {
          alert("Update Comment Unsuccessful");

        }
        console.log("reponse", data);

      }, error => {
        console.log("Error: ", error);
      })
    }

    //else {
    //  alert("You cannot update this reply.");
    //}



    //if (currentComment.isClarifyCommentID == numberOfComments || currentComment.isClarifyCommentID == null) {
    //  this.commentsService.addUpdateComment(currentComment.CommentID, null, null, null, null, null, "Clarified", null, numberOfComments, Currentreply).subscribe((data: any) => {

    //    if (data.responseCode == 1) {
    //      this.getAllComments();

    //      
    //      this.subDepartmentForCommentService.updateCommentStatus(this.subDepartmentForComment, null, false, null, null, null).subscribe((data: any) => {

    //        if (data.responseCode == 1) {




    //        }
    //        else {
    //          alert(data.responseMessage);

    //        }
    //        console.log("reponse", data);


    //      }, error => {
    //        console.log("Error: ", error);
    //      })


    //      alert("Reply Successful");

    //    }
    //    else {
    //      alert("Reply Unsuccessful");

    //    }
    //    console.log("reponse", data);

    //  }, error => {
    //    console.log("Error: ", error);
    //  })
    //}
    //else {
    //  alert("You cannot edit this comment");
    //}






  }

  createReply() {
    let Currentreply = this.reply;
    //this.ApplicantReply = Currentreply;
    // this.replyCreated = true;

    const currentComment = this.CommentsList[this.currentIndex];
    let numberOfComments = 0;
    for (var i = 0; i < this.CommentsList.length; i++) {
      if (this.CommentsList[i].SubDepartmentForCommentID == currentComment.SubDepartmentForCommentID) {
        numberOfComments++;
      }
    }

    if (currentComment.isClarifyCommentID == null) {
      if (confirm("Are you sure you want to add this reply?")) {
        this.commentsService.addUpdateComment(currentComment.CommentID, null, null, null, null, null, "Clarified", null, numberOfComments, Currentreply).subscribe((data: any) => {

          if (data.responseCode == 1) {
            this.getAllComments();
            this.subDepartmentForCommentService.updateCommentStatus(this.subDepartmentForComment, null, false, null, null, null).subscribe((data: any) => {

              if (data.responseCode == 1) {




              }
              else {
                alert(data.responseMessage);

              }
              console.log("reponse", data);


            }, error => {
              console.log("Error: ", error);
            })


            alert("Reply Successful");

          }
          else {
            alert("Reply Unsuccessful");

          }
          console.log("reponse", data);

        }, error => {
          console.log("Error: ", error);
        })
      }
    }
    else if (currentComment.isClarifyCommentID != null && currentComment.isClarifyCommentID == numberOfComments) {
      if (confirm("Are you sure you want to update this replay? You will not be able to update the reply again.")) {
        this.commentsService.addUpdateComment(currentComment.CommentID, null, null, null, null, null, "Clarified", null, 1, Currentreply).subscribe((data: any) => {

          if (data.responseCode == 1) {
            this.getAllComments();

            
            this.subDepartmentForCommentService.updateCommentStatus(this.subDepartmentForComment, null, false, null, null, null).subscribe((data: any) => {

              if (data.responseCode == 1) {




              }
              else {
                alert(data.responseMessage);

              }
              console.log("reponse", data);


            }, error => {
              console.log("Error: ", error);
            })


            alert("Update Reply Successful");

          }
          else {
            alert("Update Reply Unsuccessful");

          }
          console.log("reponse", data);

        }, error => {
          console.log("Error: ", error);
        })
      }
    }
    else {
      alert("You cannot update this reply.");
    }



    //if (currentComment.isClarifyCommentID == numberOfComments || currentComment.isClarifyCommentID == null) {
    //  this.commentsService.addUpdateComment(currentComment.CommentID, null, null, null, null, null, "Clarified", null, numberOfComments, Currentreply).subscribe((data: any) => {

    //    if (data.responseCode == 1) {
    //      this.getAllComments();

    //      
    //      this.subDepartmentForCommentService.updateCommentStatus(this.subDepartmentForComment, null, false, null, null, null).subscribe((data: any) => {

    //        if (data.responseCode == 1) {




    //        }
    //        else {
    //          alert(data.responseMessage);

    //        }
    //        console.log("reponse", data);


    //      }, error => {
    //        console.log("Error: ", error);
    //      })


    //      alert("Reply Successful");

    //    }
    //    else {
    //      alert("Reply Unsuccessful");

    //    }
    //    console.log("reponse", data);

    //  }, error => {
    //    console.log("Error: ", error);
    //  })
    //}
    //else {
    //  alert("You cannot edit this comment");
    //}






  }

  checkIfApplicationIsNotApproved() {
    if (this.CurrentApplicationBeingViewed[0].CurrentStageName == "Final Approval") {

    }
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
    doc.text('City of Cape Town' +
      '\nPost Box / Posbus / iShokisi 655' +
      '\nCAPE TOWN' +
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


  openXl(MFTModal: any) {
    this.modalService.open(MFTModal, { size: 'lg' });
  }

  viewPDF() {
    var pdf = 'http://197.242.150.226/Files/SampleInvoice.pdf';
    window.open(pdf, '_blank');
  }


  buildProjectNumber() {

    this.configService.getConfigsByConfigName("ProjectNumberTracker").subscribe((data: any) => {
      if (data.responseCode == 1) {

        const current = data.dateSet[0];
        this.configNumberOfProject = current.utilitySlot1;
        this.configMonthYear = current.utilitySlot2;
        this.configService.addUpdateConfig(current.configID, null, null, (Number(this.configNumberOfProject) + 1).toString(), null, null, null).subscribe((data: any) => {
          if (data.responseCode == 1) {


            this.ChangeApplicationStatusToPaid();
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
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);
      }
      console.log("getConfigsByConfigNameReponse", data);

    }, error => {
      console.log("getConfigsByConfigNameError: ", error);
    })
  }

  onAutoLinkDepartment() {
    
    this.subDepartmentService.getAllSubDepartmentsForAutoDistribution().subscribe((data: any) => {
      
      if (data.responseCode == 1) {
        
        for (var i = 0; i < data.dateSet.length; i++) {
          this.subDepartmentForCommentService.addUpdateDepartmentForComment(0, this.ApplicationID, data.dateSet[i].subDepartmentID, data.dateSet[i].subDepartmentName, null, null, this.CurrentUser.appUserId, null, null).subscribe((data: any) => {

            if (data.responseCode == 1) {
              
              //alert(data.dateSet.subDepartmentName + " assigned to this Application");

            }
            else {

              alert(data.responseMessage);
            }
            console.log("reponseAddUpdateDepartmentForComment", data);


          }, error => {
            console.log("Error: ", error);
          })
        }
      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponseAddUpdateDepartmentForComment", data);


    }, error => {
      console.log("Error: ", error);
    })
  }

  ChangeApplicationStatusToPaid() {
    debugger;
    if (this.CurrentApplicationBeingViewed[0].CurrentStageName == this.StagesList[1].StageName && this.CurrentApplicationBeingViewed[0].ApplicationStatus == "Unpaid") {
   
      this.configService.getConfigsByConfigName("ProjectNumberTracker").subscribe((data: any) => {
        if (data.responseCode == 1) {

          const current = data.dateSet[0];
          this.configNumberOfProject = current.utilitySlot1;
          this.configMonthYear = current.utilitySlot2;
          this.configService.addUpdateConfig(current.configID, null, null, (Number(this.configNumberOfProject) + 1).toString(), null, null, null).subscribe((data: any) => {
            if (data.responseCode == 1) {

              this.applicationsService.addUpdateApplication(this.ApplicationID, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "Distributed", null, "WL:" + (Number(this.configNumberOfProject) + 1).toString() + "/" + this.configMonthYear, false,null,this.selectPaidDate).subscribe((data: any) => {

                if (data.responseCode == 1) {
                  alert(data.responseMessage);

                  }
                else {
                  /*          alert(data.responseMessage);*/
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
          this.MoveToNextStage();
          this.router.navigate(["/home"]);
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

    else {
      alert("Application Status Needs to Be Unpaid");
    }

  }

  checkIfPermitExsist() {
    
    if (this.applicationDataForView[0].CreatedById == this.CurrentUser.appUserId) {
      this.permitBtn = true;
      this.permitTextBox = false;
    }
   if (this.applicationDataForView[0].permitStartDate != null) {
      this.permitBtn = false;
      this.permitTextBox = true;
      this.startDate = this.applicationDataForView[0].permitStartDate.toString();
      this.permitDate = "Permit has been applied, with a start date of: " + this.startDate.substring(0, this.startDate.indexOf('T'));

    }
    
    
  }

  updateStartDateForPermit() {
    this.applicationsService.addUpdateApplication(this.CurrentApplicationBeingViewed[0].applicationID, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, this.permitStartDate).subscribe((data: any) => {
      if (data.responseCode == 1) {
        this.onAutoLinkForPermit();

      }
      else {
        alert(data.responseMessage);
      }
      alert(data.responseMessage);
      console.log("IT HAS SAVED THE START DATE DIJFNSJKFNKLSDNFKSDJFNLKSDJFNLKDJFNLKSDJNFLKSJDFNLKJSDFNLKJDFBKLN MNLZXCZXNLZKXNCLKJDNLIFNDSLJIFND FUISDHFISDUFHSID UFHISDUFHSDJFHNSDJKFNSLD FJNS DKF", data);
      this.applicationDataForView.push(this.sharedService.getViewApplicationIndex())
      this.CurrentApplicationBeingViewed.push(this.applicationDataForView[0]);
      this.checkIfPermitExsist();
    }, error => {
      console.log("Error: ", error);
    })
  }

  openPermitModal(permitModal: any) {

    this.modalService.open(permitModal, { size: 'lg' });
  }

  openPaidDate(paidDateModal: any) {

    this.modalService.open(paidDateModal, { size: 'lg' });
  }

  MoveToNextStage() {


    //alert("ChangeApplicationStatusToPaid");

   /* if (this.CurrentApplicationBeingViewed[0].CurrentStageName == this.StagesList[1].StageName && this.CurrentApplicationBeingViewed[0].ApplicationStatus == "Paid") {*/
      this.applicationsService.updateApplicationStage(this.CurrentApplicationBeingViewed[0].applicationID, this.CurrentApplicationBeingViewed[0].CurrentStageName, this.CurrentApplicationBeingViewed[0].CurrentStageNumber, this.StagesList[2].StageName, this.StagesList[2].StageOrderNumber, this.StagesList[3].StageName, this.StagesList[3].StageOrderNumber, "Distributed").subscribe((data: any) => {

        if (data.responseCode == 1) {
         // this.onAutoLinkDepartment();
          alert("Application Moved to Distributed");
         // this.router.navigate(["/home"]);

        }
        else {
          alert(data.responseMessage);
        }
        console.log("responseAddapplication", data);
      }, error => {
        console.log("Error", error);
      })

    //}

    //else if (this.CurrentApplicationBeingViewed[0].CurrentStageName == this.StagesList[2].StageName && this.CurrentApplicationBeingViewed[0].ApplicationStatus == "Distributing") {

    //}
    //else {
    //  alert("Application Status Is Not Paid");
    //}


  }
  setInterface() {


    this.userPofileService.getUserProfileById(this.CurrentUser.appUserId).subscribe((data: any) => {


      if (data.responseCode == 1) {


        console.log("data", data.dateSet);

        const currentUserProfile = data.dateSet[0];
        this.depID = currentUserProfile.departmentID;
        this.getUserDep();
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

  /*CREATING THE APPROVAL PACK*/

  getUserDep() {
    
    if (this.depID != null) {


    this.subDepartmentService.getSubDepartmentsByDepartmentID(this.depID).subscribe((data: any) => {


      if (data.responseCode == 1) {

        for (var i = 0; i < data.dateSet.length; i++) {
          const tempSubDepartmentList = {} as SubDepartmentList;

          const current = data.dateSet[i];
          this.subDepNameForClarify = current.subDepartmentName;
          tempSubDepartmentList.subDepartmentID = current.subDepartmentID;


          this.SubDepartmentsList.push(tempSubDepartmentList);


        }

        console.log("THIS IS THE CUB DEP THAT HAS APPROVED THE APPLICATION CONDITIONALLY", this.subDepNameForClarify);
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
  getAllSubDepFroConditionalApprove() {

    let commentS = "Approved";
    
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
          tempSubDepCommentStatusList.UserName = current.userName;
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

  getAllSubDepForFinalApprove() {
    debugger;
    let commentS = "Final Approved";
    
    this.commentsService.getSubDepByCommentStatus(commentS, this.ApplicationID).subscribe((data: any) => {


      if (data.responseCode == 1) {

        for (var i = 0; i < data.dateSet.length; i++) {
          const tempSubDepCommentStatusList = {} as SubDepFinalApproveList;
          debugger;
          const current = data.dateSet[i];
          console.log("FINAL APPROVED THE APPLICATION ", current);
          tempSubDepCommentStatusList.SubDepID = current.subDepartmentID;
          tempSubDepCommentStatusList.SubDepName = current.subDepartmentName;
          tempSubDepCommentStatusList.ApplicationID = current.applicationID;
          tempSubDepCommentStatusList.Comment = current.comment;
          tempSubDepCommentStatusList.DateCreated = current.dateCreated;
          tempSubDepCommentStatusList.CommentStatus = current.commentStatus;
          tempSubDepCommentStatusList.UserName = current.userName;

          this.SubDepFinalApproveList.push(tempSubDepCommentStatusList);


        }
        this.onCreateApprovalPack();
        console.log("THIS IS THE CUB DEP THAT HAS Final APPROVED THE APPLICATION ", this.SubDepFinalApproveList);
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

    this.commentsService.getCommentByApplicationID(this.ApplicationID).subscribe((data: any) => {


      if (data.responseCode == 1) {

        for (var i = 0; i < data.dateSet.length; i++) {
          const tempSubDepCommentStatusList = {} as SubDepSubDepRejectList;
          
          const current = data.dateSet[i];
          tempSubDepCommentStatusList.SubDepID = current.subDepartmentID;
          tempSubDepCommentStatusList.SubDepName = current.subDepartmentName;
          tempSubDepCommentStatusList.ApplicationID = current.applicationID;
          tempSubDepCommentStatusList.Comment = current.comment;
          tempSubDepCommentStatusList.DateCreated = current.dateCreated;
          tempSubDepCommentStatusList.CommentStatus = current.commentStatus;

          this.SubDepSubDepRejectList.push(tempSubDepCommentStatusList);


        }

        console.log("THIS IS THE CUB DEP THAT HAS REJECTED THE APPLICATION ", data.dateSet);
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
    this.NotificationNumber = (setValues.NotificationNumber);
    this.WBSNumber = (setValues.WBSNumber);
    this.PhysicalAddressOfProject = (setValues.PhysicalAddressOfProject);
    this.DescriptionOfProject = (setValues.NatureOfWork);
    this.NatureOfWork = (setValues.NatureOfWork);
    this.ExcavationType = (setValues.ExcavationType);
    this.ProjectNum = (setValues.ProjectNumber);
    this.clientName = (setValues.clientName);
    if (setValues.DatePaid != null) {
      this.datePaid = (setValues.DatePaid).toString();
      this.Paid = this.datePaid.substring(0, this.datePaid.indexOf('T'));
      if (this.Paid != null) {
        this.ExternalPaid = true;
      }
      else {
        this.ExternalPaid = false;
      }
    }
    else {

    }
   
  }





 
  onCreateApprovalPack() {

    this.getAllSubDepFroConditionalApprove();


    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

/*    const doc = new jsPDF('portrait', 'px', 'a4') as jsPDFWithPlugin;*/

    // Set up table
    const startY = 50; // set the starting Y position for the table
    const headers = [
      [
        'Department',
        'Status',
        'Approved By:',
      ]
    ];

    const headers1 = [
      [
        'Department',
        'Comment',
      ]
    ];

    const data: any[] = [];
    const data2: any[] = [];

    const sig = new Image();
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
    const page29 = new Image();
    const page30 = new Image();
    const page31 = new Image();
    const page32 = new Image();
    const page33 = new Image();
    const page34 = new Image();
    const page35 = new Image();
    const page36 = new Image();
    const page37 = new Image();
    const page38 = new Image();
    const page39 = new Image();
    const page40 = new Image();
    const page41 = new Image();
    const page42 = new Image();
    const page43 = new Image();
    const page44 = new Image();
    const page45 = new Image();
    const table = new Image();
    img.src = 'assets/cctlogoblack.png';
    footer.src = 'assets/Packs/footer.PNG';
    page1.src = 'assets/Packs/page1.PNG';
    page2.src = 'assets/Packs/page2.PNG';
    page3.src = 'assets/Packs/page3.PNG';
    page4.src = 'assets/Packs/page4.PNG';
    page5.src = 'assets/Packs/page5.PNG';
    page6.src = 'assets/Packs/page6.PNG';
    page7.src = 'assets/Packs/page7.PNG';
    page8.src = 'assets/Packs/page8.PNG';
    page9.src = 'assets/Packs/page9.PNG';
    page10.src = 'assets/Packs/page10.PNG';
    page11.src = 'assets/Packs/page11.PNG';
    page12.src = 'assets/Packs/page12.PNG';
    page13.src = 'assets/Packs/page13.PNG';
    page14.src = 'assets/Packs/page14.PNG';
    page15.src = 'assets/Packs/page15.PNG';
    page16.src = 'assets/Packs/page16.PNG';
    page17.src = 'assets/Packs/page17.PNG';
    page18.src = 'assets/Packs/page18.PNG';
    page19.src = 'assets/Packs/page19.PNG';
    page20.src = 'assets/Packs/page20.PNG';
    page21.src = 'assets/Packs/page21.PNG';
    page22.src = 'assets/Packs/page22.PNG';
    page23.src = 'assets/Packs/page23.PNG';
    page24.src = 'assets/Packs/page24.PNG';
    page25.src = 'assets/Packs/page25.PNG';
    page26.src = 'assets/Packs/page26.PNG';
    page27.src = 'assets/Packs/page27.PNG';
    page28.src = 'assets/Packs/page28.PNG';
    page29.src = 'assets/Packs/page29.PNG';
    page30.src = 'assets/Packs/page30.PNG';
    page31.src = 'assets/Packs/page31.PNG';
    page32.src = 'assets/Packs/page32.PNG';
    page33.src = 'assets/Packs/page33.PNG';
    page34.src = 'assets/Packs/page34.PNG';
    page35.src = 'assets/Packs/page35.PNG';
    page36.src = 'assets/Packs/page36.PNG';
    page37.src = 'assets/Packs/page37.PNG';
    page38.src = 'assets/Packs/page38.PNG';
    page39.src = 'assets/Packs/page39.PNG';
    page40.src = 'assets/Packs/page40.PNG';
    page41.src = 'assets/Packs/page41.PNG';
    page42.src = 'assets/Packs/page42.PNG';
    page43.src = 'assets/Packs/page43.PNG';
    page44.src = 'assets/Packs/page44.PNG';
    page45.src = 'assets/Packs/page45.PNG';
    sig.src = 'assets/signature-stamp-signature-round-isolated-sign-signature-label-set-2C38RT2.jpg';
    table.src = 'assets/table.PNG'
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


    this.SubDepFinalApproveList.forEach((deposit) => {
      const row = [
        deposit.SubDepName,
        deposit.CommentStatus,
        deposit.UserName,

      ];
      data.push(row);
    });
    doc.setLineHeightFactor(60);
    doc.setFontSize(10); // add this line to set the font size

    doc.text("Based on the summary above, the wayleave application is approved. Kindly proceed to apply for a permit to work before commencement of any work on site.", 10, 190, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });//
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
        fontSize: 8,
        valign: 'middle',
        

      },

      columnStyles: {
        0: { cellWidth: 70, fontStyle: 'bold' },
        1: { cellWidth: 50 },
        2: { cellWidth: 60 },

        
      }


    });

    //Special conditions page
    doc.addPage();
    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });
    doc.setFontSize(16);
    doc.text('Special Conditions', 10, 45, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' ,});



    this.SubDepConditionalApproveList.forEach((deposit) => {
      const row = [
        deposit.SubDepName,
        deposit.Comment,
      ];

      data2.push(row);
    });



    let yOffset = 60; // Starting Y-coordinate for the list

    // Iterate through the SubDepConditionalApproveList and create a list
    this.SubDepConditionalApproveList.forEach((deposit) => {
      doc.setFontSize(14);
      doc.setFont('helvetica','bold'); // Set the font to Helvetica bold
      doc.text(deposit.SubDepName + ': \n', 10, yOffset, { maxWidth: 190, lineHeightFactor: 1.5, align: 'left' ,});
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal'); // Set the font to Helvetica bold
      doc.text(deposit.Comment, 10, yOffset += 10, { maxWidth: 190, lineHeightFactor: 1.5, align: 'left' });
      doc.setLineWidth(0.2); // Set line width for the separator line
      doc.line(10, yOffset + 10, 200, yOffset + 10); // Draw a line below the SubDepName
      yOffset += 20; // Increase Y-coordinate for the next item
    });
    doc.addImage(footer, 'png', 7, 255, 205, 45);


    //Contact information Page
    doc.addPage();
    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });
    doc.setFontSize(16);
    doc.text('Contact Details', 10, 45, { maxWidth: 190, lineHeightFactor: 1.5, align: 'justify' });

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(table, 'png', 10, 70, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

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

    //PAGE 29
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page29, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 30
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page30, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 31
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page31, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 32
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page32, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 33
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page33, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 34
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page34, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 35
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page35, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 36
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page36, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 37
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page37, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 38
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page38, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 39
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page39, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 40
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page40, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 41
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page41, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 42
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page42, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 43
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page43, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 44
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page44, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    //PAGE 45
    doc.addPage();

    doc.addImage(img, 'png', 6, 10, 62, img.height * 60 / img.width);
    doc.setFontSize(10);
    doc.text('Project Number : ' + this.ProjectNum, 200, 19, { align: 'right' });


    doc.addImage(page45, 'png', 10, 40, 190, 215);
    doc.addImage(footer, 'png', 7, 255, 205, 45);

    // Save PDF document
    doc.save("Approval Pack");
    const pdfData = doc.output('blob'); // Convert the PDF document to a blob object
    const file = new File([pdfData], 'approval_pack.pdf', { type: 'application/pdf' });


    // Prepare the form data
    const formData = new FormData();
    formData.append('file', file);

    this.sharedService.pushFileForTempFileUpload(file, "Approval Pack" + ".pdf");
    this.save();
    alert("Your Approval Pack Has Been Saved To The Documents Tab");
  }


  response: { dbPath: ''; } | undefined
  progress: number = 0;
  message = '';
  private readonly apiUrl: string = this.sharedService.getApiUrl();
  save() {




    const filesForUpload = this.sharedService.pullFilesForUpload();
    for (var i = 0; i < filesForUpload.length; i++) {
      const formData = new FormData();
      let fileExtention = filesForUpload[i].UploadFor.substring(filesForUpload[i].UploadFor.indexOf('.'));
      let fileUploadName = filesForUpload[i].UploadFor.substring(0, filesForUpload[i].UploadFor.indexOf('.')) + "-appID-" + this.ApplicationID;
      formData.append('file', filesForUpload[i].formData, fileUploadName + fileExtention);

    


      this.http.post(this.apiUrl + 'documentUpload/UploadDocument', formData, { reportProgress: true, observe: 'events' })
        .subscribe({
          next: (event) => {


            if (event.type === HttpEventType.UploadProgress && event.total)
              this.progress = Math.round(100 * event.loaded / event.total);
            else if (event.type === HttpEventType.Response) {
              this.message = 'Upload success.';
              this.uploadFinished(event.body);

            }
          },
          error: (err: HttpErrorResponse) => console.log(err)
        });
    }

  }


  uploadFinished = (event: any) => {
    ;
    this.response = event;
    console.log("this.response", this.response);
    console.log("this.response?.dbPath", this.response?.dbPath);


    const documentName = this.response?.dbPath.substring(this.response?.dbPath.indexOf('d') + 2);
    console.log("documentName", documentName);

    this.documentUploadService.addUpdateDocument(0, documentName, this.response?.dbPath, this.ApplicationID, "System Generated Pack", "System Generated Pack").subscribe((data: any) => {
/*this.financial.addUpdateFinancial(0, "Approval Pack", "Generated Pack", documentName,this.response?.dbPath, this.ApplicationID,"System Generated Pack").subscribe((data: any) => {*/
      if (data.responseCode == 1) {
      
      }

    }, error => {
      console.log("Error: ", error);
    })


  }
  //fileAttrs: string[] = [];











  onCrreateRejectionPack() {

    this.getAllSubDepForReject();
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


    this.SubDepSubDepRejectList.forEach((deposit) => {
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

    this.depositRequiredService.addUpdateWBSNUmber(this.DepositRequired[0].DepositRequiredID, this.CurrentUser.appUserId, WBS).subscribe((data: any) => {

      if (data.responseCode == 1) {

        alert(data.responseMessage);
        this.wbsRequired = true;

        this.depositRequiredService.getDepositRequiredByApplicationID(this.ApplicationID).subscribe((data: any) => {

          if (data.responseCode == 1) {
            const tempDepositReq = {} as DepositRequired;
            const current = data.dateSet[0];
            tempDepositReq.WBS = current.wbs;
            this.wbsNumberRequested = current.wbs;

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



  reciveOption($event: any) {

    this.option = $event
    if (this.option == "True") {
      this.wbsButton = true;
    }
    else if (this.option == "False") {
      this.wbsButton = false;
    }
  }
  countApprove = 0;
  countReject = 0;
  wbsBtn: boolean = false;

  getLinkedDepartments() {


    const currentApplication = this.sharedService.getViewApplicationIndex();


    
    this.subDepartmentForCommentService.getSubDepartmentForComment(currentApplication.applicationID).subscribe((data: any) => {

      if (data.responseCode == 1) {

        
        for (var i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          
          const tempSubDepartmentList = {} as SubDepartmentList;
          tempSubDepartmentList.subDepartmentID = current.subDepartmentID;
          tempSubDepartmentList.subDepartmentName = current.subDepartmentName;
          tempSubDepartmentList.departmentID = current.departmentID;
          tempSubDepartmentList.dateUpdated = current.dateUpdated;
          tempSubDepartmentList.dateCreated = current.dateCreated;
          tempSubDepartmentList.isAwaitingClarity = current.isAwaitingClarity;
          tempSubDepartmentList.IsRefered = current.IsRefered;
          tempSubDepartmentList.commentStatus = current.commentStatus;

          if (tempSubDepartmentList.commentStatus == "Approved(Conditional)") {
            this.countApprove++;
            this.wbsBtn = true;
          }
          if (tempSubDepartmentList.commentStatus == "Rejected") {
            this.countReject++;
          }
          
          this.SubDepartmentList.push(tempSubDepartmentList);
        }

        this.checkIfApprovedOrRejected();
      }
      else {

        alert(data.responseMessage);
      }
      console.log("reponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForCommentreponseGetSubDepartmentForComment", data);


    }, error => {
      console.log("Error: ", error);
    })

  }

  checkIfApprovedOrRejected() {
    if (this.countApprove == this.SubDepartmentList.length) {
     // alert("ALL FINAL APPROVED");
    }
    if (this.countReject > 0 ) {
      
    }
  }

  showApproveOrReject() {
    for (var i = 0; i < this.SubDepartmentList.length; i++) {
      if (this.SubDepartmentList[i].commentStatus == "Approved(Conditional)" || this.SubDepartmentList[i].commentStatus == "Approved") {
        this.ApprovalPackBtn = true;
      }
      else {
        this.RejectionPackBtn = true;
      }
    }

  }

  getRolesLinkedToUser() {

    this.RolesList.splice(0, this.RolesList.length);

    this.accessGroupsService.getAllRolesForUser(this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempRolesList = {} as RolesList;
          const current = data.dateSet[i];
          tempRolesList.AccessGroupName = current.accessGroupName;
          tempRolesList.AccessGroupID = current.accessGroupID;
          tempRolesList.RoleID = current.roleID;
          tempRolesList.RoleName = current.roleName;

          this.RolesList.push(tempRolesList);
          this.lockViewAccordingToRoles();


        }

        // this.rolesTable?.renderRows();
        console.log("getAllLinkedRolesReponse", data.dateSet);
      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);
      }
      console.log("getAllLinkedRolesReponse", data);

    }, error => {
      console.log("getAllLinkedRolesReponseError: ", error);
    })

  }

  lockViewAccordingToRoles() {
    console.log("werwerwerrwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwerwererwer", this.RolesList);

    for (var i = 0; i < this.RolesList.length; i++) {

      if (this.RolesList[i].RoleName == "Department Admin") {
        this.auditTrail = true;
      }
    
      if (this.RolesList[i].RoleName == "Developer Config") {
        this.ApprovalPackBtn = true;
        this.RejectionPackBtn = true;
      }

    }


  }

/*  UploadDocuments(applicationData: any): void {
    //Pulling information from the share
    const filesForUpload = this.sharedService.pullFilesForUpload();
    for (var i = 0; i < filesForUpload.length; i++) {
      const formData = new FormData();
      let fileExtention = filesForUpload[i].UploadFor.substring(filesForUpload[i].UploadFor.indexOf('.'));
      let fileUploadName = filesForUpload[i].UploadFor.substring(0, filesForUpload[i].UploadFor.indexOf('.')) + "-appID-" + this.ApplicationID;
      formData.append('file', filesForUpload[i].formData, fileUploadName + fileExtention);



      this.http.post(this.apiUrl + 'documentUpload/UploadDocument', formData, { reportProgress: true, observe: 'events' })
        .subscribe({
          next: (event) => {

            if (event.type === HttpEventType.UploadProgress && event.total)
              this.progress = Math.round(100 * event.loaded / event.total);
            else if (event.type === HttpEventType.Response) {
              this.message = 'Upload success.';
              this.uploadFinished(event.body, this.ApplicationID, applicationData);
            }
          },
          error: (err: HttpErrorResponse) => console.log(err)
        });
    }
  }

  uploadFinished = (event: any, applicationID: any, applicationData: any) => {
    ;
    this.response = event;
    console.log("this.response", this.response);
    console.log("this.response?.dbPath", this.response?.dbPath);
    console.log("applicationData", applicationData);

    const documentName = this.response?.dbPath.substring(this.response?.dbPath.indexOf('d') + 2);
    console.log("documentName", documentName);
    this.documentUploadService.addUpdateDocument(0, documentName, this.response?.dbPath, applicationID, applicationData.userID, this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {

      }





    }, error => {
      console.log("Error: ", error);
    })


  }*/

  getAllDocsForApplication() {

    this.documentUploadService.getAllDocumentsForApplication(this.ApplicationID).subscribe((data: any) => {

      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDocList = {} as DocumentsList;
          const current = data.dateSet[i];
          tempDocList.DocumentID = current.documentID;
          tempDocList.DocumentName = current.documentName;
          tempDocList.DocumentLocalPath = current.documentLocalPath;
          tempDocList.ApplicationID = current.applicationID;
          tempDocList.AssignedUserID = current.assignedUserID;



          this.DocumentsList.push(tempDocList);


        }

        this.FinancialListTable?.renderRows();
        console.log("GOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCS", this.DocumentsList[0]);
      }
      else {
        alert(data.responseMessage);

      }
      console.log("reponseGetAllDocsForApplication", data);

    }, error => {
      console.log("ErrorGetAllDocsForApplication: ", error);
    })

  }

  viewDocument(index: any) {

    // Make an HTTP GET request to fetch the document
    fetch(this.apiUrl + `documentUpload/GetDocument?filename=${this.FinancialDocumentsList[index].FinancialDocumentName}`)
      .then(response => {
        if (response.ok) {
          // The response status is in the 200 range
          return response.blob(); // Extract the response body as a Blob
        } else {
          throw new Error('Error fetching the document');
        }
      })
      .then(blob => {
        // Create a URL for the Blob object
        const documentURL = URL.createObjectURL(blob);

        // Display the document, for example, in an <iframe>
        const iframe = document.createElement('iframe');
        iframe.src = documentURL;
        document.body.appendChild(iframe);
      })
      .catch(error => {
        console.log(error);
        // Handle the error appropriately
      });

  }

  getFinancial() {
    this.FinancialDocumentsList.splice(0, this.FinancialDocumentsList.length);
    this.financial.getFinancialByApplicationID(this.ApplicationID).subscribe((data: any) => {

      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDocList = {} as FinancialDocumentsList;
          const current = data.dateSet[i];
          
          tempDocList.FinancialID = current.financialID;
          tempDocList.ApplicationID = current.applicationID;
          tempDocList.CreatedById = current.createdById;
          tempDocList.FinancialDocumentLocalPath = current.documentLocalPath;
          tempDocList.ApplicationID = current.applicationID;
          tempDocList.FinancialDocumentName = current.documentName;
          tempDocList.FinancialType = current.financialType;
          



          this.FinancialDocumentsList.push(tempDocList);


        }
        

        this.FinancialListTable?.renderRows();
        console.log("FinancialListTablethis.FinancialDocumentsListthis.FinancialDocumentsListthis.FinancialDocumentsListthis.FinancialDocumentsListthis.FinancialDocumentsListthis.FinancialDocumentsList", this.FinancialDocumentsList);
      }
      else {
        alert(data.responseMessage);

      }
      console.log("reponseGetAllDocsForApplication", data);

    }, error => {
      console.log("ErrorGetAllDocsForApplication: ", error);
    })
    
  }



  /*Mobile Field Tracking*/
  onPassFileName(event: { uploadFor: string; fileName: string }) {
    
    const { uploadFor, fileName } = event;
    this.fileAttrsName = "Doc";

    this.hasFile = true;
    this.fileCount = this.fileCount + 1;
  }



  getMFTForApplication() {
    const imageDiv = document.getElementById('imageDiv'); // Get the existing <div> element by ID
    this.MFTList.splice(0, this.MFTList.length);
    this.MFTService.getMFTByApplicationID(this.ApplicationID).subscribe((data: any) => {

      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempMFTList = {} as MFTList;
          const current = data.dateSet[i];
          tempMFTList.MFTID = current.mftid;
          tempMFTList.MFTNote = current.mftNote;
          tempMFTList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));;
          tempMFTList.DocumentName = current.documentName;
          tempMFTList.DocumentLocalPath = current.documentLocalPath;
          tempMFTList.ApplicationNumber = current.applicationID;
          tempMFTList.FullName = current.fullName;
       
          console.log("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT", current);
          console.log("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT", this.MFTList);
          this.MFTList.push(tempMFTList);

         /* fetch(this.apiUrl + `documentUpload/GetDocument?filename=${this.MFTList[i].DocumentName}`)
            .then(response => {
              if (response.ok) {
                // The response status is in the 200 range

                return response.blob(); // Extract the response body as a Blob

              } else {
                throw new Error('Error fetching the document');
              }
            })
            .then(blob => {
              const imageURL = URL.createObjectURL(blob);

              // Display the image using an <img> element
              const imgElement = document.createElement('img');
              imgElement.src = imageURL;

              // Get a reference to the div with the ID 'myDiv'
              const myDiv = document.getElementById('card_image');

              // Append the <img> element to the 'myDiv' div
              myDiv.appendChild(imgElement);

              
            })
            .catch(error => {
              console.log(error);
              // Handle the error appropriately
            });*/

      
        }

        
       // console.log("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT", this.DocumentsList[0]);
       
      }
      else {
        alert(data.responseMessage);

      }
      console.log("reponseGetAllDocsForApplication", data);

    }, error => {
      console.log("ErrorGetAllDocsForApplication: ", error);
    })
  }

  saveNote() {

  
    const filesForUpload = this.sharedService.pullFilesForUpload();
    

    if (filesForUpload.length === 0) {

      this.MFTService.addUpdateMFT(0, this.mftNote, this.ApplicationID, null, null, this.CurrentUser.appUserId, this.CurrentUser.fullName).subscribe((data: any) => {
        /*this.financial.addUpdateFinancial(0, "Approval Pack", "Generated Pack", documentName,this.response?.dbPath, this.ApplicationID,"System Generated Pack").subscribe((data: any) => {*/
        if (data.responseCode == 1) {
          alert(data.responseMessage);
          this.getMFTForApplication();
        }

      }, error => {
        console.log("Error: ", error);
      })

    }
    else{
      for (var i = 0; i < filesForUpload.length; i++) {
        const formData = new FormData();
        let fileExtention = filesForUpload[i].UploadFor.substring(filesForUpload[i].UploadFor.indexOf('.'));
        let fileUploadName = filesForUpload[i].UploadFor.substring(0, filesForUpload[i].UploadFor.indexOf('.')) + "-appID-" + null;
        formData.append('file', filesForUpload[i].formData, fileUploadName + fileExtention);




        this.http.post(this.apiUrl + 'documentUpload/UploadDocument', formData, { reportProgress: true, observe: 'events' })
          .subscribe({
            next: (event) => {


              if (event.type === HttpEventType.UploadProgress && event.total)
                this.progress = Math.round(100 * event.loaded / event.total);
              else if (event.type === HttpEventType.Response) {
                this.message = 'Upload success.';
                this.uploadFinishedNotes(event.body);

              }
            },
            error: (err: HttpErrorResponse) => console.log(err)
          });
      }
    }

  }
  mftNote = '';

  uploadFinishedNotes(event) {

  this.response = event;
  console.log("this.response", this.response);
  console.log("this.response?.dbPath", this.response?.dbPath);


  const documentName = this.response?.dbPath.substring(this.response?.dbPath.indexOf('d') + 2);
  console.log("documentName", documentName);

    this.MFTService.addUpdateMFT(0, this.mftNote, this.ApplicationID, documentName, this.response?.dbPath, this.CurrentUser.appUserId, this.CurrentUser.fullName).subscribe((data: any) => {
    /*this.financial.addUpdateFinancial(0, "Approval Pack", "Generated Pack", documentName,this.response?.dbPath, this.ApplicationID,"System Generated Pack").subscribe((data: any) => {*/
      if (data.responseCode == 1) {
        alert(data.responseMessage);
        this.getMFTForApplication();
    }

  }, error => {
    console.log("Error: ", error);
  })
  }


  viewImage(index: any) {
    
    // Make an HTTP GET request to fetch the document
    fetch(this.apiUrl + `documentUpload/GetDocument?filename=${this.MFTList[index].DocumentName}`)
      .then(response => {
        if (response.ok) {
          // The response status is in the 200 range
          
          return response.blob(); // Extract the response body as a Blob

        } else {
          throw new Error('Error fetching the document');
        }
      })
      .then(blob => {
        
        // Create a URL for the Blob object
        const documentURL = URL.createObjectURL(blob);

        window.open(documentURL, '_blank');
        

      })
      .catch(error => {
        console.log(error);
        // Handle the error appropriately
      });

  }


  openFAQModal(FAQModal: any) {
    this.modalService.open(FAQModal, { centered: true, size: 'xl' })
  }
  
}
