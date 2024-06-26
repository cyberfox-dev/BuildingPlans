import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentCategoryService } from 'src/app/service/BPDocumentCategory/document-category.service';
import { BPStagesService } from 'src/app/service/BPStages/bpstages.service';
import { BPFunctionalAreasService } from '../service/BPFunctionalAreas/bpfunctional-areas.service';
export interface DocumentCategoryList {
  CategoryID: number;
  CategoryName: string;
  FunctionalArea: string;
  DateCreated: any;
  DateUpdated: any;
  CreatedByID: string;
}

export interface FunctionalAreas {
  FunctionalAreaName: string;
  FunctionalAreaID: number;
}
@Component({
  selector: 'app-bp-mandory-documents',
  templateUrl: './bp-mandory-documents.component.html',
  styleUrls: ['./bp-mandory-documents.component.css']
})
export class BpMandoryDocumentsComponent implements OnInit {

  constructor(private modalService: NgbModal, private documentCategoryService: DocumentCategoryService, private bpStageService: BPStagesService, private bpFunctionalAreaService: BPFunctionalAreasService) { }

  DocumentCategoryList: DocumentCategoryList[] = [];
  FunctionalAreaList: FunctionalAreas[] = [];

  @ViewChild(MatTable) CategoryTable: MatTable<DocumentCategoryList> | undefined;
  displayedColumns: string[] = ['CategoryName', 'FunctionalArea', 'DateCreated', 'DateUpdated', 'actions'];
  dataSource = this.DocumentCategoryList;

  @ViewChild("addNewCategory", { static: true }) addCategory!: ElementRef;
  @ViewChild("editCategory", { static: true }) editCategory!: ElementRef;

  categoryID: number;
  categoryName: string;
  functionalArea: string;
  dateCreated: any;
  dateUpdated: any;
  createdByID: string;

  stringifiedData: any;
  CurrentUser: any;



  ngOnInit(): void {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.getAllDocumentCategory();
    this.GetAllFunctionalArea();

  }


  openAddCategory() {
    this.modalService.open(this.addCategory, { centered: true, size: 'xl' });
  }
  openEditCategory(index: any) {
    let current = this.DocumentCategoryList[index];
    this.categoryName = current.CategoryName;
    this.categoryID = current.CategoryID;
    this.functionalArea = current.FunctionalArea;

    this.modalService.open(this.editCategory, { centered: true, size: 'xl' });
  }

  getAllDocumentCategory() {

    this.DocumentCategoryList.splice(0, this.DocumentCategoryList.length);
    this.documentCategoryService.getAllDocumentCategories().subscribe((data: any) => {
      if (data.responseCode == 1) {
        debugger;
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempCategoryList = {} as DocumentCategoryList;
          const current = data.dateSet[i];

          tempCategoryList.CategoryID = current.categoryId;
          tempCategoryList.CategoryName = current.categoryName;
          tempCategoryList.FunctionalArea = current.functionalArea;
          tempCategoryList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
          tempCategoryList.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));

          this.DocumentCategoryList.push(tempCategoryList);
        }

        this.dataSource = this.DocumentCategoryList;
        this.CategoryTable.renderRows();
      }
      else {
        alert(data.responseCode);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  AddUpdateDocumentCategory() {
    if (this.categoryName == undefined || this.categoryName.trim() == "" || this.functionalArea == undefined || this.functionalArea.trim() == "") {
      alert("Please fill in all required fields")
    }
    else {
      this.documentCategoryService.addUpdateDocumentCategory(this.categoryID, this.categoryName, this.functionalArea, this.CurrentUser.appUserId).subscribe((data: any) => {
        if (data.responseCode == 1) {
          this.getAllDocumentCategory();
          this.modalService.dismissAll();
          this.ClearData();


          alert(data.responseMessage);
        }
        else {
          alert(data.responseMessage);
        }
      }, error => {
        console.log("Error: ", error);
      })
    }
  }
  ClearData() {
    this.categoryID = 0;
    this.categoryName = "";
    this.functionalArea = "";
  }

  DeleteDocumentCategory(index: any) {
    let categoryId = this.DocumentCategoryList[index].CategoryID;

    this.documentCategoryService.deleteDocumentCategoryByCategoryId(categoryId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        alert(data.responseMessage);
        this.getAllDocumentCategory();
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Error: ", error);
    })


  }
  GetAllFunctionalArea() {
    debugger;
    this.bpFunctionalAreaService.getAllFunctionalAreas().subscribe((data: any) => {
      if (data.responseCode == 1) {
        debugger;
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempFunctionalArea = {} as FunctionalAreas;
          const current = data.dateSet[i];

          tempFunctionalArea.FunctionalAreaName = current.faName;
          tempFunctionalArea.FunctionalAreaID = current.functionalAreaID;

          this.FunctionalAreaList.push(tempFunctionalArea)
        }
      }
    })
  }

  filterValue = "";
  newList: any;
  searchByName(event: Event): string[] {
    //This will filter the document category list:
    const filterValue = (event.target as HTMLInputElement).value.toUpperCase();
    if (filterValue === "") {

      // If the filter is empty, reset the dataSource to the original data
      this.dataSource = [...this.DocumentCategoryList];
      this.newList = [];
      this.CategoryTable?.renderRows();
      return this.dataSource.map(user => user.CategoryName || "");


      ;
    } else {

      const sanitizedFilterValue = filterValue.replace(/[^\w\s]/g, '');
      const regex = new RegExp(sanitizedFilterValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));


      this.dataSource = this.DocumentCategoryList.filter(user => {

        const sanitizedCategoryName = (user.CategoryName || '').replace(/[^\w\s]/g, '');
        return regex.test(sanitizedCategoryName.toUpperCase());
      });

      this.CategoryTable?.renderRows();
      this.newList = [...this.dataSource];
      console.log(this.newList);

      return this.newList.map(user => user.CategoryName || "");
    }
  }
}
