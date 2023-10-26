import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, TemplateRef, HostListener, QueryList } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DepartmentConfigComponent } from 'src/app/department-config/department-config.component';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SharedService } from '../shared/shared.service';
import { RolesService } from '../service/Roles/roles.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CommentBuilderService } from '../service/CommentBuilder/comment-builder.service';
import { UserProfileService } from '../service/UserProfile/user-profile.service';
import { NotificationsService } from '../service/Notifications/notifications.service';
import { AccessGroupsService } from '../service/AccessGroups/access-groups.service';
import { ApplicationsService } from '../service/Applications/applications.service';
import { DocumentUploadService } from '../service/DocumentUpload/document-upload.service';
import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { MatSelectChange } from '@angular/material/select';
import { DepartmentsService } from 'src/app/service/Departments/departments.service';
import { SubDepartmentsService } from '../service/SubDepartments/sub-departments.service';
import { FrequentlyAskedQuestionsService } from '../service/FAQ/frequently-asked-questions.service';
import { NGB_DATEPICKER_TIME_ADAPTER_FACTORY } from '@ng-bootstrap/ng-bootstrap/timepicker/ngb-time-adapter';
import { NgbDatepickerModule, NgbOffcanvas, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Input } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ChangeDetectorRef } from '@angular/core';
import { ViewChildren } from '@angular/core';
import { DocumentRepositoryConfigService } from '../service/DocumentRepositoryConfig/document-repository-config.service';
export interface DocumentsList {
  DocumentID: number;
  DocumentName: string;
  DocumentLocalPath: string;
  ApplicationID: number;
  AssignedUserID: string;
  DateCreated: any;
  GroupName: string;
  SubDepartmentID: number;
  Description: string;
}
export interface SubDepartmentList {
  subDepartmentID: number;
  subDepartmentName: string;
  departmentID: number;
  dateUpdated: any;
  dateCreated: any;
}
export interface SubDepartmentListFORDOCUMENTS {
  subDepartmentID: number;
  subDepartmentName: string;
  departmentID: number;
  dateUpdated: any;
  dateCreated: any;
}
export interface RolesList {
  RoleID: number;
  RoleName: string;
  AccessGroupID: number;
  AccessGroupName: string;
}
export interface FileDocument {
  fileName: string;
  file: any;
}
export interface UserList {
  DepartmentID: number;
  SubDepID: number;
}
export interface FilterList {
  CategoryName: string;
  CategoryID: number;
}
@Component({
  selector: 'app-document-repository',
  templateUrl: './document-repository.component.html',
  styleUrls: ['./document-repository.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DocumentRepositoryComponent implements OnInit {
  DocumentsList: DocumentsList[] = [];
  RolesList: RolesList[] = [];
  SubDepartmentList: SubDepartmentList[] = [];
  UserList: UserList[] = [];
  FilterList: FilterList[] = [];
  SubDepartmentListFORDOCUMENTS: SubDepartmentListFORDOCUMENTS[] = [];
  selected = 'none';
  select = 1;

  uploadRepoDoc: boolean = false;
  deleteRepoDoc: boolean = false;
  groupName: boolean = true;
  depSelect: boolean = true;
  selectDepartmentForUpload: boolean = false;
  selectDepForUpload = 0;
  stringifiedData: any;
  CurrentUser: any;
  constructor(private accessGroupsService: AccessGroupsService, private http: HttpClient, private documentUploadService: DocumentUploadService, private router: Router, private shared: SharedService, private formBuilder: FormBuilder, private commentService: CommentBuilderService, private userPofileService: UserProfileService, private notificationsService: NotificationsService, private subDepartment: SubDepartmentsService, private applicationsService: ApplicationsService, private faq: FrequentlyAskedQuestionsService, private cdr: ChangeDetectorRef, private dialog: MatDialog, private modalService: NgbModal, private documentRepositoryConfigService: DocumentRepositoryConfigService) { }
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatTable) DocumentsListTable: MatTable<DocumentsList> | undefined;
  displayedColumns: string[] = ['DocumentName'];
  dataSource = new MatTableDataSource<DocumentsList>([]);
    columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
expandedElement = this.DocumentsList;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  length: any;
  departmentID: number;
  

  ngOnInit(): void {
    debugger;
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.getAllDocsForRepository();
    this.getRolesLinkedToUser();
    this.lockViewAccordingToRoles();
    this.getCurrentUserInfo();
    this.getAllDepartments();
    this.select = 1;
    this.groupName = false;


  }
  ngAfterViewInit() {
    this.dataSource.data = this.DocumentsList;
    this.length = this.DocumentsList.length;

    if (this.paginator) {
      this.paginator.page.subscribe((pageEvent: PageEvent) => {
        this.pageSize = pageEvent.pageSize;
        // Reload data based on the new page size if needed
        this.getAllDocsForRepository();// Call the function to load the data with the updated page size

      });
    }

  }
  getAllDocsForRepository() {
   
    this.DocumentsList.splice(0, this.DocumentsList.length);
    this.documentUploadService.getAllDocumentsForRepository().subscribe((data: any) => {

      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDocList = {} as DocumentsList;
          const current = data.dateSet[i];
          console.log("current1", current);
      
          tempDocList.DocumentID = current.documentID;
          tempDocList.DocumentName = current.documentName;
          tempDocList.DocumentLocalPath = current.documentLocalPath;
          tempDocList.ApplicationID = current.applicationID;
          tempDocList.AssignedUserID = current.assignedUserID;
          tempDocList.DateCreated = current.dateCreated;
          tempDocList.GroupName = current.groupName;
          tempDocList.Description = current.description;
          debugger;
          if (current.groupName == "GeneralNonDep") {
            tempDocList.GroupName = "Document Repository General Document";
          }
          if (current.Description == " " || current.Description == null) {
            tempDocList.Description = "No Description";
          }

  
          tempDocList.SubDepartmentID = current.subDepartmentID;

          console.log("THIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGS", current);
          this.DocumentsList.push(tempDocList);

        }

        // Update the length and data source
        debugger;
        this.length = this.DocumentsList.length;
        this.dataSource.data = this.DocumentsList;
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        const endIndex = startIndex + this.paginator.pageSize;
        const displayedData = this.DocumentsList.slice(startIndex, endIndex);
        this.dataSource.data = displayedData;


        // Trigger change detection
        this.cdr.detectChanges();

        // Ensure that renderRows is called (optional)
        if (this.DocumentsListTable) {
          this.DocumentsListTable.renderRows();
        }


        // console.log("GOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCS", this.DocumentsList[0]);
      }
      else {
        alert(data.responseMessage);

      }
      console.log("reponseGetAllDocsForApplication", data);

    }, error => {
      console.log("ErrorGetAllDocsForApplication: ", error);
    })

  }
  lockViewAccordingToRoles() {


    debugger;
    for (var i = 0; i < this.RolesList.length; i++) {

      if ( this.RolesList[i].RoleName == "EMB" || this.RolesList[i].RoleName == "Developer Config") {
        this.uploadRepoDoc = true;

      }
    }


  }

  onUploadFile(fileUpload: any) {
    this.modalService.open(fileUpload, { centered: true, size: 'lg', backdrop: 'static' });
  }
  selectedOptionText: string;
  onOptionSelected(event: MatSelectChange) {
    this.selectedOptionText = event.source.triggerValue;
    console.log(this.selectedOptionText);
    this.getCurrentUserInfo();
  }
  getCurrentUserInfo() {
    this.UserList.splice(0, this.UserList.length);
    this.userPofileService.getUserProfileById(this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {
        const tempuserList = {} as UserList;
        const current = data.dateSet[0];
        tempuserList.DepartmentID = current.departmentID;
        tempuserList.SubDepID = current.subDepartmentID;
        this.UserList.push(tempuserList);
        console.log("jjioegjiogjkljkljklfgjklfgjkljkljkljklfgjklfgjkldfgjklfgkjlfg", current);
      }
      else {
        alert(data.responseMessage);
      }

    }, error => {
      console.log("Error: ", error);
    })
  }
  GroupName: boolean = false;
  selectDepartment() {
    if (this.SelectedDepForRepUpload != "GeneralDocument" && this.SelectedDepForRepUpload != "All Departments") {
      this.GroupName = true;
    }
    else {
      this.GroupName = false
    }
    this.subDepartment.getSubDepartmentBySubDepartmentID(this.selectDepForUpload).subscribe((data: any) => {
      const tempSubDocList = {} as SubDepartmentListFORDOCUMENTS;
      const current = data.dateSet[0];
      console.log("flkgdokfjgldkfjglkdfjglkdfjglkdfjglkjdfgkljdklfgjfg", current);
      console.log("flkgdokfjgldkfjglkdfjglkdfjglkdfjglkjdfgkljdklfgjfg", this.selectDepForUpload);
      if (data.responseCode == 1) {
        tempSubDocList.subDepartmentName = current.subDepartmentName
        this.SubDepartmentListFORDOCUMENTS.push(tempSubDocList);
        console.log("flkgdokfjgldkfjglkdfjglkdfjglkdfjglkjdfgkljdklfgjfg", this.SubDepartmentListFORDOCUMENTS);

      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Error: ", error);
    })
  }
  descriptionForDocRepo = '';
  fileAttrs: string[] = [];
  isRep = "isRep";
  fileAttrsName = "Doc";
  onPassFileName(event: { uploadFor: string; fileName: string }) {
    debugger;
    const { uploadFor, fileName } = event;
    const index = parseInt(uploadFor.substring('CoverLetter'.length));
    this.fileAttrsName = "Doc";
    debugger;

    this.shared.RepFileUploadCat = this.selected;

    for (var i = 0; i < this.SubDepartmentList.length; i++) {
      const current = this.SubDepartmentList[i];
      if (current.subDepartmentID == this.selectDepForUpload) {
        this.shared.RepFileUploadSubID = current.subDepartmentID;
        this.shared.RepFileUploadSubName = current.subDepartmentName;
      }

    }




  }

  getAllDepartments() {
    this.SubDepartmentList.splice(0, this.SubDepartmentList.length);
    this.subDepartment.getSubDepartmentsList().subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempSubDepartmentList = {} as SubDepartmentList;
          const current = data.dateSet[i];
          console.log("DepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListh", current);
          tempSubDepartmentList.subDepartmentID = current.subDepartmentID;
          tempSubDepartmentList.subDepartmentName = current.subDepartmentName;
          tempSubDepartmentList.departmentID = current.departmentID;
          tempSubDepartmentList.dateUpdated = current.dateUpdated;
          tempSubDepartmentList.dateCreated = current.dateCreated;
          this.SubDepartmentList.push(tempSubDepartmentList);

        }

        //this.DepartmentList = data.dateSet;


        console.log("DepartmentListh", this.SubDepartmentList);
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

  onFileDelete(event: any, index: number) {

    this.fileAttrsName = "Doc";

  }
  onFileUpload(event: any) {


  }

  progress: number = 0;
  message = '';
  save() {
    this.modalService.dismissAll();
    this.getAllDocsForRepository();

    //if (this.selectDepartmentForUpload == undefined) {
    //  alert("Please Select a department");
    //}
    //else if (this.selected == "") {
    //  alert("Please Select A Group For Your Document");
    //}
    //else {

    //  //const filesForUpload = this.shared.pullFilesForUpload();
    //  //for (var i = 0; i < filesForUpload.length; i++) {
    //  //  const formData = new FormData();
    //  //  let fileExtention = filesForUpload[i].UploadFor.substring(filesForUpload[i].UploadFor.indexOf('.'));
    //  //  let fileUploadName = filesForUpload[i].UploadFor.substring(0, filesForUpload[i].UploadFor.indexOf('.')) + "-appID-" + null;
    //  //  formData.append('file', filesForUpload[i].formData, fileUploadName + fileExtention);




    //  //  this.http.post(this.apiUrl + 'documentUpload/UploadDocument', formData, { reportProgress: true, observe: 'events' })
    //  //    .subscribe({
    //  //      next: (event) => {


    //  //        if (event.type === HttpEventType.UploadProgress && event.total)
    //  //          this.progress = Math.round(100 * event.loaded / event.total);
    //  //        else if (event.type === HttpEventType.Response) {
    //  //          this.message = 'Upload success.';
    //  //          this.uploadFinished(event.body, repositoryModal);

    //  //        }
    //  //      },
    //  //      error: (err: HttpErrorResponse) => console.log(err)
    //  //    });

    //}
  }
  response: { dbPath: ''; } | undefined

  uploadFinished = (event: any, repositoryModal) => {
    debugger;
    this.response = event;
    console.log("this.response", this.response);
    console.log(this.descriptionForDocRepo);
    console.log("this.response?.dbPath", this.response?.dbPath);


    const documentName = this.response?.dbPath.substring(this.response?.dbPath.indexOf('d') + 2);
    console.log("documentName", documentName);

    this.documentUploadService.addUpdateDocument(0, documentName, this.response?.dbPath, null, this.CurrentUser.appUserId, this.CurrentUser.appUserId, this.selectedOptionText, this.selectDepForUpload, this.SubDepartmentListFORDOCUMENTS[0].subDepartmentName, null, true, this.descriptionForDocRepo).subscribe((data: any) => {

      if (data.responseCode == 1) {

        this.modalService.dismissAll(repositoryModal);
        this.getAllDocsForRepository();
      }





    }, error => {
      console.log("Error: ", error);
    })


  }

  onDeleteRepositoryDocument(element: any) {
    const confirmation = confirm("Are you sure you want to delete this document?");

    if (confirmation) {
      this.documentUploadService.deleteDocument(element.DocumentID).subscribe((data: any) => {

        if (data.responseCode == 1) {

        
          this.getAllDocsForRepository();
        }
      }, error => {
        console.log("Error: ", error);
      })
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

  selectDepFilterName: string = 'All';
  isDepartmentSelected: boolean = false;
  SelectedDepForRepUpload = '';
  filterDepartment() {
    debugger;
    let string = this.select.toString();
    console.log('Selected department:', this.select);
    console.log('Data:', this.DocumentsList);

    if (this.selectDepFilterName === "All") {
      debugger;
      this.DocumentsList.splice(0, this.DocumentsList.length);
      this.documentUploadService.getAllDocumentsForRepository().subscribe((data: any) => {

        if (data.responseCode == 1) {
          for (let i = 0; i < data.dateSet.length; i++) {
            const tempDocList = {} as DocumentsList;
            const current = data.dateSet[i];
            console.log(current);
            tempDocList.DocumentID = current.documentID;
            tempDocList.DocumentName = current.documentName;
            tempDocList.DocumentLocalPath = current.documentLocalPath;
            tempDocList.ApplicationID = current.applicationID;
            tempDocList.AssignedUserID = current.assignedUserID;
            tempDocList.DateCreated = current.dateCreated;
            tempDocList.GroupName = current.groupName;
            tempDocList.SubDepartmentID = current.subDepartmentID;
            tempDocList.Description = current.description;
            console.log("THIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGS", current);
            this.DocumentsList.push(tempDocList);

          }

          // Update the length and data source
          debugger;
          this.length = this.DocumentsList.length;
          this.dataSource.data = this.DocumentsList;
          const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
          const endIndex = startIndex + this.paginator.pageSize;
          const displayedData = this.DocumentsList.slice(startIndex, endIndex);
          this.dataSource.data = displayedData;


          // Trigger change detection
          this.cdr.detectChanges();

          // Ensure that renderRows is called (optional)
          if (this.DocumentsListTable) {
            this.DocumentsListTable.renderRows();
          }


          // console.log("GOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCS", this.DocumentsList[0]);
        }
        else {
          alert(data.responseMessage);

        }
        console.log("reponseGetAllDocsForApplication", data);

      }, error => {
        console.log("ErrorGetAllDocsForApplication: ", error);
      })
      this.isDepartmentSelected = false; // No department selected
      this.groupName = false; // No department selected
    }
    else if (this.selectDepFilterName === "AllGeneralDocuments") {
      // Filter documents based on the selected department.
      this.DocumentsList.splice(0, this.DocumentsList.length);
      this.documentUploadService.getAllDocumentsForRepository().subscribe((data: any) => {

        if (data.responseCode == 1) {
          for (let i = 0; i < data.dateSet.length; i++) {
            const tempDocList = {} as DocumentsList;
            const current = data.dateSet[i];
            console.log(current);
            tempDocList.DocumentID = current.documentID;
            tempDocList.DocumentName = current.documentName;
            tempDocList.DocumentLocalPath = current.documentLocalPath;
            tempDocList.ApplicationID = current.applicationID;
            tempDocList.AssignedUserID = current.assignedUserID;
            tempDocList.DateCreated = current.dateCreated;
            tempDocList.GroupName = current.groupName;
            tempDocList.SubDepartmentID = current.subDepartmentID;
            tempDocList.Description = current.description;
            console.log("THIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGSTHIS IS THE REPOSITY THINGS", current);
            this.DocumentsList.push(tempDocList);

          }

          // Update the length and data source
          debugger;
          this.length = this.DocumentsList.length;
          this.dataSource.data = this.DocumentsList;
          const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
          const endIndex = startIndex + this.paginator.pageSize;
          const displayedData = this.DocumentsList.slice(startIndex, endIndex);
          this.dataSource.data = displayedData;
          this.groupName = false;
          this.isDepartmentSelected = true; // Department selected
          this.dataSource.data = this.DocumentsList.filter(df => df.DateCreated && df.GroupName === "GeneralNonDep");

          // Trigger change detection
          this.cdr.detectChanges();

          // Ensure that renderRows is called (optional)
          if (this.DocumentsListTable) {
            this.DocumentsListTable.renderRows();
          }


          // console.log("GOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCSGOTALLDOCS", this.DocumentsList[0]);
        }
        else {
          alert(data.responseMessage);

        }
        console.log("reponseGetAllDocsForApplication", data);

      }, error => {
        console.log("ErrorGetAllDocsForApplication: ", error);
      })
    
/*      let filteredData = this.DocumentsList.filter(df => df.GroupName === "GeneralNonDep");*/
      debugger;
/*      this.dataSource.data = filteredData;
      console.log(filteredData);*/

    }
    else {
      // Filter documents based on the selected department.
      let filteredData = this.DocumentsList.filter(df => df.SubDepartmentID === this.select);
      this.dataSource.data = filteredData;
      this.groupName = true;
      this.isDepartmentSelected = true; // Department selected
      this.selectedOptionText = "All"; // Set it to "All"
      this.selected = "All"; // Set it to "All"
      if (this.selected == "All" || this.selected == "All Departments") {
        this.dataSource.data = this.DocumentsList.filter(df => df.DateCreated && df.SubDepartmentID == this.select);
      }
      else {
        
        console.log(this.selectedOptionText);
        this.dataSource.data = this.DocumentsList.filter(df => df.GroupName == this.selectedOptionText && df.SubDepartmentID == this.select);
        console.log("FilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterubDepartmentID == this.select))", this.DocumentsList.filter(df => df.SubDepartmentID == this.select))
      }
      for (let i = 0; i < this.SubDepartmentList.length; i++) {
        if (this.SubDepartmentList[i].subDepartmentID.toString() === this.selectDepFilterName) {
          this.departmentID = this.SubDepartmentList[i].departmentID;
          this.getDocumentFilterList(this.departmentID);
        }
      }
    }

    // Reset other properties if needed
   
    this.DocumentsListTable?.renderRows();
  }




  resetFilter() {
        this.select = undefined;
        this.selected = undefined;
        this.groupName = false;
        this.selectedOptionText = "";
        this.dataSource.data = this.DocumentsList.filter(df => df.DateCreated);
  }

  filerGroupName() {
    debugger;
        if (this.selectedOptionText == "All" || this.selectedOptionText == "All Departments") {
          this.dataSource.data = this.DocumentsList.filter(df => df.DateCreated && df.SubDepartmentID == this.select);
        }
        else {
          console.log(this.selectedOptionText);
          this.dataSource.data = this.DocumentsList.filter(df => df.GroupName == this.selectedOptionText && df.SubDepartmentID == this.select );
          console.log("FilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilterFilter", this.DocumentsList.filter(df => df.SubDepartmentID == this.select))
        }
  }
  selectedDocumentIndex: number | null = null; // Initialize as null

    toggleExpandRow(element: any) {
    // Check if the selected element is the same as the currently expanded element
      debugger;
    if (this.expandedElement === element) {
      this.expandedElement = null; // Collapse the row
      this.selectedDocumentIndex = null; // Reset the selected document index
    } else {
      this.expandedElement = element; // Expand the row
      // Find the index of the selected element in your dataSource array
      this.selectedDocumentIndex = this.dataSource.data.indexOf(element);
    }
    }
  private readonly apiUrl: string = this.shared.getApiUrl() + '/api/';

  viewDocument(element: any) {

    debugger;
    // Make an HTTP GET request to fetch the document
    fetch(this.apiUrl + `documentUpload/GetDocument?filename=${element.DocumentName}`)
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

        // Download the document
        const link = document.createElement('a');
        link.href = documentURL;
        link.download = element.DocumentName; // Set the downloaded file name
        link.click();
      })
      .catch(error => {
        console.log(error);
        // Handle the error appropriately
      });

  }
  @ViewChild('fileInput')
  fileInput!: ElementRef;

  getDocumentFilterList(departmentID: number) {
    debugger;
    this.FilterList.splice(0, this.FilterList.length);
    this.documentRepositoryConfigService.GetDocumentCategoryByDepartmentID(departmentID).subscribe((data: any) => {
      if (data.responseCode === 1)
      {
        debugger;
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempFilterList = {} as FilterList;
          const current = data.dateSet[i];

          tempFilterList.CategoryName = current.documentsCategory;

          this.FilterList.push(tempFilterList);
          debugger;
        }

      }
      else {
        alert(data.responseMessage);

      }
      console.log("reponseGetAllDocsForApplication", data);

    }, error => {
      console.log("ErrorGetAllDocsForApplication: ", error);
    })
  }
}
