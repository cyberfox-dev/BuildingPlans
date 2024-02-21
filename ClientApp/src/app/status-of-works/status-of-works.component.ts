import { Component, OnInit ,Input, Sanitizer, ViewChild} from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { MobileFieldTrackingService } from '../service/MFT/mobile-field-tracking.service';
import { MatTable } from '@angular/material/table';
import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { SubDepartmentForCommentService } from '../service/SubDepartmentForComment/sub-department-for-comment.service';
import { ServiceItemService } from '../service/ServiceItems/service-item.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

export interface MFTList {
  MFTID: number;
  MFTNote: string;
  DocumentName: string;
  DocumentLocalPath: string;
  DateCreated: Date;
  ApplicationNumber: number;
  FullName: string;
  DocURL: any;
}

export interface SubDepartmentForCommentList {
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
  zoneName: string;
}

export interface ServiceItemsList {
  ServiceItemID: number;
  ServiceItemCode: string;
  Rate: number;
  RateIncVat: number;
  isChecked: boolean;
}
@Component({
  selector: 'app-status-of-works',
  templateUrl: './status-of-works.component.html',
  styleUrls: ['./status-of-works.component.css']
})
export class StatusOfWorksComponent implements OnInit {

  constructor(private sharedService: SharedService, private MFTService: MobileFieldTrackingService, private sanitizer: DomSanitizer, private subDepartmentForCommentService: SubDepartmentForCommentService, private serviceItemsService: ServiceItemService, private modalSerive: NgbModal) { }

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';

  MFTList: MFTList[] = [];
  serviceItemList: ServiceItemsList[] = [];
  SubDepartmentForCommentList: SubDepartmentForCommentList[] = [];

  @ViewChild(MatTable) mftTable: MatTable<MFTList> | undefined;
  @ViewChild(MatTable) serviceItemsTable: MatTable<ServiceItemService> | undefined;

  @Input() ApplicationID: number | null;

  displayedColumns: string[] = ['CreatedBy', 'MFTNote',  'DateCreated', 'DocPreview','actions'];
  dataSource = this.MFTList;

  displayedColumnsServiceItem: string[] = ['ServiceItemCode', 'Rate', 'Total', 'actions'];
  dataSourceServiceItems = this.serviceItemList;

  stringifiedData: any;
  CurrentUser: any;

  stringifiedDataRoles: any;
  AllCurrentUserRoles: any;

  stringifiedDataUserProfile: any;
  CurrentUserProfile: any;

  canCreateNote: boolean = false;
  MFTUser: boolean = false;

  ngOnInit(): void {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);

    this.stringifiedDataRoles = JSON.parse(JSON.stringify(localStorage.getItem('AllCurrentUserRoles')));
    this.AllCurrentUserRoles = JSON.parse(this.stringifiedDataRoles);

    this.getMFTForApplication();
    this.checkUserRole(); 
  }

  getMFTForApplication() {
    /*@ViewChild('imageDiv') imageDiv: ElementRef;*/ // Get the existing <div> element by ID
    this.MFTList.splice(0, this.MFTList.length);
    this.MFTService.getMFTByApplicationID(this.ApplicationID).subscribe(async(data: any) => {
     
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
         
        
         

          await fetch(this.apiUrl + `documentUpload/GetDocument?filename=${current.documentName}`)
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
              const sanitizedURL: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imageURL);

              tempMFTList.DocURL = sanitizedURL;


              

              this.MFTList.push(tempMFTList);

            })
            .catch(error => {
              console.log(error);
              // Handle the error appropriately
            });

          
        }
        debugger;
        this.dataSource = this.MFTList;
        this.mftTable?.renderRows();
        console.log("this datasource", this.dataSource);
        console.log("this.mftTable", this.mftTable);

        //console.log("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT", this.DocumentsList[0]);

      }
      else {
        alert(data.responseMessage);

      }
      console.log("reponseGetAllDocsForApplication", data);

    }, error => {
      console.log("ErrorGetAllDocsForApplication: ", error);
    })
  }


  viewFullImage(index: any) {
    const documentName = this.MFTList[index].DocumentName;

    fetch(this.apiUrl + `documentUpload/GetDocument?filename=${documentName}`)
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

         //Download the document
        const link = document.createElement('a');
        link.href = documentURL;
        link.download = documentName; // Set the downloaded file name
        link.click();
      })
      .catch(error => {
        console.log(error);
        // Handle the error appropriately
      });
  }

  getAllSubDepartmentsForComment() {
    this.subDepartmentForCommentService.getSubDepartmentForComment(this.ApplicationID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempSubDepartment = {} as SubDepartmentForCommentList;
          const current = data.dateSet[i];

          tempSubDepartment.subDepartmentID = current.subDepartmentID;
          tempSubDepartment.subDepartmentName = current.subDepartmentName;
          tempSubDepartment.zoneName = current.zoneName;


          if (this.CurrentUserProfile[0].subDepartmentName == current.subDepartmentName && this.CurrentUserProfile[0].zoneName == current.zoneName) {
            this.canCreateNote = true;
          }
          this.SubDepartmentForCommentList.push(tempSubDepartment)
        }
      } else {
        alert(data.responseMessage);

      }
      console.log("reponseGetAllSubDepartmentsForComment", data);

    }, error => {
      console.log("ErrorGetAllSubDepartmentsForComment: ", error);
    })
  }

  getAllServiceItems(infringement:any) {
    this.serviceItemsService.getAllServiceItem().subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempServiceItem = {} as ServiceItemsList;
          const current = data.dateSet[i];

          tempServiceItem.ServiceItemID = current.serviceItemID;
          tempServiceItem.ServiceItemCode = current.serviceItemCode;
          tempServiceItem.Rate = current.rate;
          tempServiceItem.RateIncVat = current.totalVat;
          tempServiceItem.isChecked = false;

          this.serviceItemList.push(tempServiceItem);
        }
        this.dataSourceServiceItems = this.serviceItemList;
        this, this.serviceItemsTable?.renderRows();
        this.modalSerive.open(infringement, { centered: true, size: 'l' });
        
      }
      else {
        alert(data.responseMessage);

      }

    }, error => {
      console.log("ErrorGetAllSubDepartmentsForComment: ", error);

    })
  }

  checkUserRole() {
    for (let i = 0; i < this.AllCurrentUserRoles.length; i++) {
      const userRole = this.AllCurrentUserRoles[i].roleName;

      if (userRole == "MFT") {
        this.MFTUser = true;
      }
    }

    console.log("this MFTUSer & CanCreateNote", this.MFTUser, this.canCreateNote);
  }

  onCheckInfringement(index: any) {
    let isCheck = this.serviceItemList[index].isChecked;
    if (isCheck == false) {
      isCheck = true;
    }

    else {
      isCheck = false;
    }

  }
}
