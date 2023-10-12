import { Component,AfterViewInit, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { DocumentRepositoryConfigService } from 'src/app/service/DocumentRepositoryConfig/document-repository-config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DepartmentsService } from 'src/app/service/Departments/departments.service';
import { forkJoin } from 'rxjs';

export interface DocumentsCategoryList {
  documentCategoryId: number;
  documentCategoryName: string;
  departmentID: any;
  departmentName: string;
  dateCreated: any;
  dateUpdated: any;
 
}

export interface DepartmentsList {
  departmentID: number;
  departmentName: string;
}
@Component({
  selector: 'app-document-repository-config',
  templateUrl: './document-repository-config.component.html',
  styleUrls: ['./document-repository-config.component.css'],
 
})



export class DocumentRepositoryConfigComponent implements OnInit {
  stringifiedData: any;
  CurrentUser: any;
  newDocumentCategory: string;
  DepartmentID: any;
  displayedColumns: string[] = ['CategoryName', 'DepartmentName', 'DateCreated', 'Actions']
  constructor(private documentRepositoryService: DocumentRepositoryConfigService, private modalService: NgbModal, private departmentsService: DepartmentsService) { }
  documentRepositoryID: number = 0;
  documentsCategoryList: DocumentsCategoryList[] = [];
  DepartmentsList: DepartmentsList[] = [];
  index: number;
  dataSource = new MatTableDataSource<DocumentsCategoryList>(this.documentsCategoryList);

  @ViewChild('departmentDropDown') departmentDropDown: ElementRef;
  @ViewChild('documentCategory') documentCategory: ElementRef;
  
  ngOnInit(): void {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    this.getAllDocumentCategories();
    this.getAllDepartments();
  }
  openCreateCategory(createCategory: any) {
    this.modalService.open(createCategory, { size: 'xl' });
  }
  onSaveClick() {
    this.AddUpdateDocumentCategory(this.documentRepositoryID, this.DepartmentID, this.newDocumentCategory);

  }

  getAllDocumentCategories() {
    debugger;
   
    this.documentsCategoryList.splice(0, this.documentsCategoryList.length);
    this.documentRepositoryService.getAllDocumentCategories().subscribe((data: any) => {
      debugger;
      if (data.responseCode === 1) {
        debugger;
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempCategoryList = {} as DocumentsCategoryList;
          const current = data.dateSet[i];
          tempCategoryList.documentCategoryId = current.documentsRepositoryID;
          tempCategoryList.documentCategoryName = current.documentsCategory;
          tempCategoryList.departmentID = current.departmentID;
          tempCategoryList.dateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));
          tempCategoryList.dateUpdated = current.dateUpdated.substring(0, current.dateCreated.indexOf('T'));

          this.departmentsService.getDepartmentByDepartmentID(current.departmentID).subscribe((data: any) => {
            if (data.responseCode === 1) {
              debugger;
              tempCategoryList.departmentName = data.dateSet[0].departmentName;
            } else {
              debugger;
              
            }

            console.log("response", data);
          }, error => {
            debugger;
            console.log("Error", error);
          });
          this.documentsCategoryList.push(tempCategoryList);
        }

        
        this.dataSource.data = this.documentsCategoryList;
      } else {
        debugger;
        alert(data.responseMessage);
      }

      console.log("response", data);
    }, error => {
      debugger;
      console.log("Error", error);
    });
  }


    





   AddUpdateDocumentCategory(documentRepositoryID: number, DepartmentID: any, newDocumentCategory: string) {
    debugger;

    if (DepartmentID == "All") {
      debugger;
      for (let i = 0; i < this.DepartmentsList.length; i++) {
        this.documentRepositoryService.addUpdateDocumentCategory(documentRepositoryID, newDocumentCategory, this.DepartmentsList[i].departmentID, this.CurrentUser.appUserID)
          .subscribe((data: any) => {
            if (data.responseCode === 1) {
              debugger;
              

              /*alert(data.responseMessage);*/
            } else {
              debugger;
              alert(data.responseMessage);
            }
           
            console.log("response", data);
          }, error => {
            debugger;
            console.log("Error", error);
          });
          
      }
      this.getAllDocumentCategories();
      this.dataSource.data = this.documentsCategoryList;

    }
    else {
      this.documentRepositoryService.addUpdateDocumentCategory(documentRepositoryID, newDocumentCategory, DepartmentID, this.CurrentUser.appUserID)
        .subscribe((data: any) => {
          if (data.responseCode === 1) {
            debugger;

            this.getAllDocumentCategories();
            /*alert(data.responseMessage)*/;
          } else {
            debugger;
            alert(data.responseMessage);
          }

          console.log("response", data);
        }, error => {
          debugger;
          console.log("Error", error);
        });
    }
    
  }


  
  
  getAllDepartments() {
    debugger;
 
    this.DepartmentsList.splice(0, this.DepartmentsList.length);
    this.departmentsService.getDepartmentsList().subscribe((data: any) => {
      if (data.responseCode === 1) {
        debugger;

        for (let i = 0; i < data.dateSet.length; i++)
        {
          debugger;

          const tempDepartmentsList = {} as DepartmentsList;
          const current = data.dateSet[i];

          tempDepartmentsList.departmentID = current.departmentID;
          tempDepartmentsList.departmentName = current.departmentName;

          this.DepartmentsList.push(tempDepartmentsList);
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

  onDeleteCategoryByCategoryID(index:number) {
    debugger;
    if (confirm("Are you sure to delete " + this.documentsCategoryList[index].documentCategoryName + "?")) {
      this.documentRepositoryService.deleteDocumentCategoryByID(this.documentsCategoryList[index].documentCategoryId).subscribe((data: any) => {
        if (data.responseCode === 1) {
          debugger;
          alert(data.responseMessage)
          this.getAllDocumentCategories();
        }
        else {
          debugger;
          alert(data.responseMessage);
        }

        console.log("response", data);
      }, error => {
        debugger;
        console.log("Error", error);

      })
    }
    }
 
  
  clearInputAndDropdown() {
   
    this.newDocumentCategory = ''; 
    this.DepartmentID = 'All'; 
    this.departmentDropDown.nativeElement.selectedIndex = 0; 
    this.documentCategory.nativeElement.textContent = '';
  }
  
}

  

