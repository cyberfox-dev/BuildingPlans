import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef, } from '@angular/core';
import { MatTable,MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BPStagesService } from 'src/app/service/BPStages/bpstages.service';
import { BPFunctionalAreasService } from 'src/app/service/BPFunctionalAreas/bpfunctional-areas.service';
import { BPStagesChecklistsService } from 'src/app/service/BPStagesChecklists/bpstages-checklists.service';
import { BpDepartmentsService } from 'src/app/service/BPDepartments/bp-departments.service';
import { BPMandatoryStageDocumentService } from 'src/app/service/BPMandatoryStageDocuments/bpmandatory-stage-document.service';
import { BPMandatoryDepartmentDocumentService } from 'src/app/service/BPMandatoryDepartmentDocuments/bpmandatory-department-document.service';
import { BPDepartmentChecklistsService } from 'src/app/service/BPDepartmentChecklists/bpdepartment-checklists.service';
import { DocumentCategoryService } from 'src/app/service/BPDocumentCategory/document-category.service';

export interface FunctionalAreasList {
  FunctionalAreaID: number;
  FAName: string;
  FAItemCode: string;
  DateCreated: any;
  DateUpdated: any;
  CreatedById: string;
}

export interface StagesList {
  StageId: number;
  StageName: string;
  StageOrder: number;
  FunctionalArea: string;
  SkipTrigger: boolean;
  DateCreated: any;
  DateUpdated: any;
  CreatedByID: string;
  

}

export interface StageChecklistItems {
  ChecklistItemId: number;
  ChecklistItem: string;
  StageID: number;
  FunctionalAreaID: number;
  DateCreated: any;
  DateUpdated: any;
  CreatedById: string;

}

export interface DepartmentsList {
  DepartmentID: number;
  DepartmentName: string;
  hasSubDepartments: boolean;
  DateCreated: any;
  DateUpdated: any;
  CreatedById: string;
  FunctionalArea: string;
}

export interface StageManDocList {
  DocumentID: number;
  FunctionalArea: string;
  StageName: string;
  DocumentName: string;
  DateCreated: any;
  DateUpdated: any;
  CreatedById: string;
}

export interface DepartmentManDocList {
  DocumentID: number;
  FunctionalArea: string;
  StageName: string;
  DocumentName: string;
  DateCreated: any;
  DateUpdated: any;
  CreatedById: string;
}

export interface DepartmentChecklist {
  ChecklistItemId: number;
  ChecklistItem: string;
  FunctionalArea: string;
  DepartmentName: string;
  DateCreated: any;
  DateUpdated: any;
  CreatedById: string;
}

export interface DocumentCategoryList {
  CategoryId: number;
  CategoryName: string;
  FunctionalArea: string;
  DateCreated: any;
  DateUpdated: any;
  CreatedById: string;
}

@Component({
  selector: 'app-checklist-config',
  templateUrl: './checklist-config.component.html',
  styleUrls: ['./checklist-config.component.css']
})
export class ChecklistConfigComponent implements OnInit {

  constructor(private bpStageService: BPStagesService,
    private bpFunctionslAreasService: BPFunctionalAreasService,
    private modalService: NgbModal,
    private bpStageChecklistService: BPStagesChecklistsService,
    private bpDepartmentsService: BpDepartmentsService,
    private bpStageManDocService: BPMandatoryStageDocumentService,
    private bpDepartmentManDocService: BPMandatoryDepartmentDocumentService,
    private bpDepartmentChecklistService: BPDepartmentChecklistsService,
    private documentCategoryService: DocumentCategoryService,

  ) { }

  functionalAreasList: FunctionalAreasList[] = [];
  stageList: StagesList[] = [];
  stageChecklist: StageChecklistItems[] = [];
  departmentsList: DepartmentsList[] = [];
  stageManDocList: StageManDocList[] = [];
  departmentManDocList: DepartmentManDocList[] = [];
  departmentChecklist: DepartmentChecklist[] = [];
  documentCategoryList: DocumentCategoryList[] = [];

  displayedColumnsFA: string[] = ['FAName', 'DateCreated', 'DateUpdated', 'Actions'];
  displayedStageColumns: string[] = ['StageName', 'StageOrder',  'Actions'];
  displayedStageCheckColumns: string[] = ['ChecklistItem', 'DateCreated', 'DateUpdated', 'Actions'];
  displayedDepartmentColumns: string[] = ['DepartmentName', 'Actions'];
  displayedStageDocColumns: string[] = ['DocumentName', 'DateCreated', 'Actions'];
  displayedDepartmentDocColumns: string[] = ['DocumentName', 'DateCreated', 'Actions'];

  @ViewChild(MatTable) FunctionalAreasTable: MatTable<FunctionalAreasList> | undefined;
  @ViewChild(MatTable) StageTable: MatTable<StagesList> | undefined;
  @ViewChild(MatTable) StageChecklistTable: MatTable<StageChecklistItems> | undefined;
  @ViewChild(MatTable) DepartmentsTable: MatTable<DepartmentsList> | undefined;
  @ViewChild(MatTable) StageManDocTable: MatTable<StageManDocList> | undefined;
  @ViewChild(MatTable) DepartmentManDocTable: MatTable<DepartmentManDocList> | undefined;
  @ViewChild(MatTable) DepartmentChecklistsTable: MatTable<DepartmentChecklist> | undefined;

  dataSourceCheck: MatTableDataSource<StageChecklistItems> = new MatTableDataSource<StageChecklistItems>();
  dataSourceFA: MatTableDataSource<FunctionalAreasList> = new MatTableDataSource<FunctionalAreasList>();
  StagesDataSource: MatTableDataSource<StagesList> = new MatTableDataSource<StagesList>();
  departmentDataSource: MatTableDataSource<DepartmentsList> = new MatTableDataSource<DepartmentsList>();
  StageManDocDataSource: MatTableDataSource<StageManDocList> = new MatTableDataSource<StageManDocList>();
  DepartmentManDocDataSource: MatTableDataSource<DepartmentManDocList> = new MatTableDataSource<DepartmentManDocList>();
  departmentCheckDataSource: MatTableDataSource<DepartmentChecklist> = new MatTableDataSource<DepartmentChecklist>();

  functionalAreaID: number;
  functionalArea: string;
  stageName: string
  departmentName: string;

  addFunctionalArea: string;
  addStageName: string;
  addDepartmentName: string;
  stageChecklistItem: string;
  departmentChecklistItem: string;
  stageManDoc: string;
  departmentManDoc: string;

  stringifiedData: any;
  CurrentUser: any;

  ngOnInit(): void {
    this.getAllFunctionalAreas();
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
  }

  openStages(stages: any) {
    this.modalService.open(stages, { centered: true, size: 'xl' });
  }
  openCheckList(StageCheck: any) {
    this.modalService.open(StageCheck, { centered: true, size: 'xl' });
  }

  openDepartments(Departments: any) {
    this.modalService.open(Departments, { centered: true, size: 'xl' });
  }

  openStageDocuments(StageManDoc: any) {
    this.modalService.open(StageManDoc, { centered: true, size: 'xl' });
  }

  openDepartmentDocuments(DepartmentManDoc: any) {
    this.modalService.open(DepartmentManDoc, { centered: true, size: 'xl' });
  }

  openDepartmentChecklist(DepartmentChecklist: any) {
    this.modalService.open(DepartmentChecklist, { centered: true, size: 'xl' });
  }

  openAddStageDocument(AddStageDoc: any) {
    this.modalService.open(AddStageDoc, { centered: true, size: 'xl' });
  }
  openAddStageCheckItem(AddStageCheck: any) {
    this.modalService.open(AddStageCheck, { centered: true, size: 'xl' });
  }

  openAddDepartmentDocument(AddDepartmentDoc: any) {
    this.modalService.open(AddDepartmentDoc, { centered: true, size: 'xl' });
  }

  openAddDeparmentCheckItem(AddDepartmentCheck: any) {
    this.modalService.open(AddDepartmentCheck, { centered: true, size: 'xl' });
  }

  getAllStagesForFunctionalArea(index: any) {
    this.functionalArea = this.functionalAreasList[index].FAName;

    
    this.stageList.splice(0, this.stageList.length);
    this.bpStageService.getAllStagesForFunctionalArea(this.functionalArea).subscribe((data: any) => {
      if (data.responseCode == 1) {
        
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempStageList = {} as StagesList;
          const current = data.dateSet[i];
          tempStageList.FunctionalArea = current.functionalArea;
          tempStageList.StageId = current.stageID;
          tempStageList.StageName = current.stageName;
          tempStageList.StageOrder = current.stageOrder;
          tempStageList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
          tempStageList.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));
          tempStageList.SkipTrigger = current.skipTrigger;
          tempStageList.CreatedByID = current.createdById;

          this.stageList.push(tempStageList);
        }
        



        this.StagesDataSource.data = this.stageList;
        this.StageTable.renderRows();
      }
      else {
        alert(data.responseCode);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  getAllFunctionalAreas() {

    this.functionalAreasList.splice(0, this.functionalAreasList.length);
    this.bpFunctionslAreasService.getAllFunctionalAreas().subscribe((data: any) => {
      
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempFAList = {} as FunctionalAreasList;
          const current = data.dateSet[i];
          
          tempFAList.FunctionalAreaID = current.functionalAreaID;
          tempFAList.FAName = current.faName;
          tempFAList.FAItemCode = current.faItemCode;
          tempFAList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
          tempFAList.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));
          tempFAList.CreatedById = current.createdById;

          this.functionalAreasList.push(tempFAList);
        }

        this.dataSourceFA.data = this.functionalAreasList;
        this.FunctionalAreasTable.renderRows();
      }
      else {
        alert(data.responseCode);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  GetAllChecklistItemsForStage(index: any, StageCheck: any) {

    this.stageName = this.stageList[index].StageName;
    this.functionalArea = this.stageList[index].FunctionalArea
    
    this.ShowChecklistItemsForStage(StageCheck);
  }

  ShowChecklistItemsForStage(StageCheck: any) {
    this.stageChecklist.splice(0, this.stageChecklist.length);
    this.bpStageChecklistService.getAllChecklistItemsForStage(this.stageName, this.functionalArea).subscribe((data: any) => {
      
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempChecklist = {} as StageChecklistItems;
          const current = data.dateSet[i];

          tempChecklist.ChecklistItemId = current.checkListItemID;
          tempChecklist.ChecklistItem = current.checklistItem;
          tempChecklist.CreatedById = current.createdById;
          tempChecklist.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
          tempChecklist.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));
          tempChecklist.FunctionalAreaID = current.functionalAreaID;
          tempChecklist.StageID = current.stageID;

          this.stageChecklist.push(tempChecklist);
        }
        this.dataSourceCheck.data = this.stageChecklist;
        this.StageChecklistTable.renderRows();
        this.openCheckList(StageCheck);
      }
      else {
        alert(data.responseCode);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);

    })
  }

  GetAllDepartmentsForFunctionalArea(index: any, Departments: any) {
    
    this.functionalArea = this.functionalAreasList[index].FAName;
    
    this.departmentsList.splice(0, this.departmentsList.length);
    this.bpDepartmentsService.getAllDepartmentsForFunctionalArea(this.functionalArea).subscribe((data: any) => {
      
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDepartmentList = {} as DepartmentsList;
          const current = data.dateSet[i];

          tempDepartmentList.DepartmentID = current.departmentID;
          tempDepartmentList.DepartmentName = current.departmentName;
          tempDepartmentList.hasSubDepartments = current.hasSubDepartments;
          tempDepartmentList.DateCreated = current.dateCreated;
          tempDepartmentList.DateUpdated = current.dateUpdated;
          tempDepartmentList.CreatedById = current.createdById;
          tempDepartmentList.FunctionalArea = current.functionalArea;

          this.departmentsList.push(tempDepartmentList);
        }
        this.departmentDataSource.data = this.departmentsList;
        this.DepartmentsTable.renderRows();
        this.openDepartments(Departments);
      }
      else {
        alert(data.responseCode);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);

    })
  }

  GetAllMandatoryStageDocuments(index: any, StageManDoc: any) {
    this.stageName = this.stageList[index].StageName;
    this.functionalArea = this.stageList[index].FunctionalArea;
    

    this.ShowAllDocumentsForStage(StageManDoc);


  }

  GetAllMandatoryDepartmentDocs(index: any, DepartmentManDoc: any) {
    this.departmentName = this.departmentsList[index].DepartmentName;
    this.functionalArea = this.departmentsList[index].FunctionalArea;
    
    this.ShowAllDocumentsForDepartment(DepartmentManDoc);
  }

  ShowAllDocumentsForDepartment(DepartmentManDoc: any) {
    this.departmentManDocList.splice(0, this.departmentManDocList.length);
    this.bpDepartmentManDocService.getAllDocumentsForDepartment(this.departmentName, this.functionalArea).subscribe((data: any) => {
      
      if (data.responseCode == 1) {
        
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDocList = {} as DepartmentManDocList;
          const current = data.dateSet[i];

          tempDocList.DocumentID = current.documentID;
          tempDocList.DocumentName = current.documentName;
          tempDocList.FunctionalArea = current.functionalArea;
          tempDocList.StageName = current.stageName;
          tempDocList.CreatedById = current.createdById;
          tempDocList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
          tempDocList.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));

          this.departmentManDocList.push(tempDocList);
        }
        this.DepartmentManDocDataSource.data = this.departmentManDocList;
        this.DepartmentManDocTable.renderRows();
        this.openDepartmentDocuments(DepartmentManDoc);
      }
      else {
        alert(data.responseCode);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }
  GetAllChecklistItemsForDepartment(index: any, DepartmentChecklist: any) {
    this.departmentName = this.departmentsList[index].DepartmentName;
    this.functionalArea = this.departmentsList[index].FunctionalArea;

    this.ShowAllChecklistItemsForDepartment(DepartmentChecklist);

  }

  ShowAllChecklistItemsForDepartment(DepartmentChecklist: any) {
    this.departmentChecklist.splice(0, this.departmentChecklist.length);
    
    this.bpDepartmentChecklistService.getAllChecklistItemsForDepartment(this.departmentName, this.functionalArea).subscribe((data: any) => {
      if (data.responseCode == 1) {
        
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDepChecklist = {} as DepartmentChecklist;
          const current = data.dateSet[i];

          tempDepChecklist.ChecklistItemId = current.checklistItemID;
          tempDepChecklist.ChecklistItem = current.checklistItem;
          tempDepChecklist.FunctionalArea = current.functionalArea;
          tempDepChecklist.DepartmentName = current.departmentName;
          tempDepChecklist.CreatedById = current.createdById;
          tempDepChecklist.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
          tempDepChecklist.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));

          this.departmentChecklist.push(tempDepChecklist);

        }

        this.departmentCheckDataSource.data = this.departmentChecklist;
        this.DepartmentChecklistsTable.renderRows();

        this.openDepartmentChecklist(DepartmentChecklist);
      }
      else {
        alert(data.responseCode);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  getAllDocumentCategoriesForFA(index:any) {
    
    this.departmentChecklist.splice(0, this.departmentChecklist.length);
    this.documentCategoryService.getDocumentCategoryByFunctionalArea(this.functionalAreasList[index].FAName).subscribe((data: any) => {
      if (data.responseCode == 1) {
        
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDocCategoryList = {} as DocumentCategoryList;
          const current = data.dateSet[i];
          
          tempDocCategoryList.CategoryId = current.categoryId;
          tempDocCategoryList.CategoryName = current.categoryName;
          tempDocCategoryList.FunctionalArea = current.functionalArea;
          tempDocCategoryList.CreatedById = current.createdById;
          tempDocCategoryList.DateCreated = current.dateCreated;
          tempDocCategoryList.DateUpdated = current.dateUpdated;

          this.documentCategoryList.push(tempDocCategoryList);
        }
      }
      else {
        alert(data.responseCode);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  AddMandatoryDocumentToStage(StageManDoc: any) {
    
    this.bpStageManDocService.addUpdateMandatoryStageDocument(0, this.stageManDoc, this.stageName, this.functionalArea, this.CurrentUser.appUserId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        alert(data.responseMessage);

        this.modalService.dismissAll();
        this.ShowAllDocumentsForStage(StageManDoc);

      }
      else {
        alert(data.responseCode);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })

  }

  DeleteMandatoryStageDcoument(index: any, StageManDoc) {
    const documentId = this.stageManDocList[index].DocumentID;
    
    this.bpStageManDocService.deleteMandatoryStageDocByDocumentID(documentId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        alert(data.responseMessage);
        this.ShowAllDocumentsForStage(StageManDoc);
        this.modalService.dismissAll();


      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  ShowAllDocumentsForStage(StageManDoc: any) {
    this.stageManDocList.splice(0, this.stageManDocList.length);
    this.bpStageManDocService.getAllDocumentsForStage(this.stageName, this.functionalArea).subscribe((data: any) => {
      if (data.responseCode == 1) {
        
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDocList = {} as StageManDocList;
          const current = data.dateSet[i];

          tempDocList.DocumentID = current.documentID;
          tempDocList.DocumentName = current.documentName;
          tempDocList.FunctionalArea = current.functionalArea;
          tempDocList.StageName = current.stageName;
          tempDocList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
          tempDocList.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));
          tempDocList.CreatedById = current.createdById;

          this.stageManDocList.push(tempDocList);
        }
        this.StageManDocDataSource.data = this.stageManDocList;
        this.StageManDocTable.renderRows();
        this.openStageDocuments(StageManDoc)
      }
      else {
        alert(data.responseCode);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  AddstagechecklistItem(StageCheck: any) {
    
    this.bpStageChecklistService.AddUpdateChecklistItem(0, this.stageChecklistItem, this.stageName, this.functionalArea, this.CurrentUser.appUserId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        alert(data.responseMessage);
        this.modalService.dismissAll();
        this.ShowChecklistItemsForStage(StageCheck);
      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  DeleteStageChecklistItem(index: any, StageCheck: any) {
    
    const checklistitemId = this.stageChecklist[index].ChecklistItemId;
    this.bpStageChecklistService.deleteChecklistItemByChecklistItemId(checklistitemId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        alert(data.responseMessage);
        this.modalService.dismissAll();
        this.ShowChecklistItemsForStage(StageCheck);
      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  AddDepartmentMandatoryDocument(DepartmentManDoc: any) {
    this.bpDepartmentManDocService.addUpdateMandatoryDepartmentDocument(0, this.departmentManDoc, this.functionalArea, this.departmentName, this.CurrentUser.appUserId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        alert(data.responseMessage);
        this.modalService.dismissAll();
        this.ShowAllDocumentsForDepartment(DepartmentManDoc);
      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  DeleteDepartmentMandatoryDocument(index: any, DepartmentManDoc: any) {
    const documentId = this.departmentManDocList[index].DocumentID;

    this.bpDepartmentManDocService.deleteDepartmentDocumentByDocumentId(documentId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        alert(data.responseMessage);
        this.modalService.dismissAll();
        this.ShowAllDocumentsForDepartment(DepartmentManDoc);
      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  AddDepartmentChecklistItem(DepartmentChecklist: any) {
    this.bpDepartmentChecklistService.addUpdateChecklistItem(0, this.departmentChecklistItem, this.functionalArea, this.departmentName, this.CurrentUser.appUserId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        alert(data.responseMessage);
        this.modalService.dismissAll();
        this.ShowAllChecklistItemsForDepartment(DepartmentChecklist);
      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  DeleteDepartmentChecklistItem(index: any, DepartmentChecklist: any) {
    const checklistItemId = this.departmentChecklist[index].ChecklistItemId;
    
    this.bpDepartmentChecklistService.deleteDepartmentChecklistItemByChecklistItemId(checklistItemId).subscribe((data: any) => {
      if (data.responseCode == 1) {
        alert(data.responseMessage);
        this.modalService.dismissAll();
        this.ShowAllChecklistItemsForDepartment(DepartmentChecklist);
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

