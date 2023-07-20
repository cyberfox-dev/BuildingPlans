import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {MandatoryDocumentUploadService } from '../service/MandatoryDocumentUpload/mandatory-document-upload.service';
import { StagesService } from '../service/Stages/stages.service';
import { MatPaginator } from '@angular/material/paginator'
import { SelectionModel } from '@angular/cdk/collections';
import { MandatoryDocumentStageLinkService } from '../service/MandatoryDocumentStageLink/mandatory-document-stage-link.service';

export interface MandatoryDocumentUploadList {
  mandatoryDocumentID: number;
  mandatoryDocumentName: string;
  stageID: number;
  dateCreated: any;
  mandatoryDocumentCategory: string;
}

export interface StagesList {
  StageID: number;
  StageName: string;
  StageOrderNumber: number;
}

export interface MandatoryDocumentsLinkedStagesList {
  mandatoryDocumentStageLinkID: number;
  mandatoryDocumentID: number;
  stageID: number;
  stageName: string;
  dateCreated: any;
}





@Component({
  selector: 'app-mandatory-docs-config',
  templateUrl: './mandatory-docs-config.component.html',
  styleUrls: ['./mandatory-docs-config.component.css']
})
export class MandatoryDocsConfigComponent implements OnInit {
  header: any;

  public addManDoc = this.formBuilder.group({
    newManDocName: ['', Validators.required],
    mandatoryDocumentCategory: ['', ]

  })

  CurrentMandatoryDocumentID: any;
  

  CurrentUser: any;
  stringifiedData: any;

  MandatoryDocumentUploadList: MandatoryDocumentUploadList[] = [];

  StagesList: StagesList[] = [];
  MandatoryDocumentsLinkedStagesList: MandatoryDocumentsLinkedStagesList[] = [];


  openXl(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }
  openAddUserToAccessGroup(addUserToAccessGroup: any) {
    this.modalService.open(addUserToAccessGroup, { centered: true, size: 'lg' });
  }
  openViewLinkedStages(viewLinkedStages: any) {
    this.modalService.open(viewLinkedStages, { centered: true, size: 'lg' });
  }



  @ViewChild(MatTable) MandatoryDocumentUploadTable: MatTable<MandatoryDocumentUploadList> | undefined;
  @ViewChild(MatTable) StagesTable: MatTable<StagesList> | undefined;
  @ViewChild(MatTable) MandatoryDocumentsLinkedStagesTable: MatTable<MandatoryDocumentsLinkedStagesList> | undefined;

  selection = new SelectionModel<StagesList>(true, []);
 


  constructor(private modalService: NgbModal, private mandatoryUploadDocsService: MandatoryDocumentUploadService, private stagesService: StagesService, private formBuilder: FormBuilder, private mandatoryDocumentStageLink: MandatoryDocumentStageLinkService) { }

  ngOnInit(): void {
    this.getAllMandatoryDocs();
    this.getAllStages();

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData); this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

  
  }



  displayedColumns: string[] = ['mandatoryDocumentName','dateCreated', 'actions'];
  dataSource = this.MandatoryDocumentUploadList;
 

  displayedColumnsAddStage: string[] = ['StageName', 'actions'];
  dataSourceAddStage = this.StagesList;

  displayedColumnsViewLinkedStages: string[] = ['stageName', 'dateCreated','actions'];
  dataSourceViewLinkedStages = this.MandatoryDocumentsLinkedStagesList;



  //getAllByMandatoryDocumentCategory(ManDocCat:string) {

  // // this.MandatoryDocumentUploadList.splice(0, this.MandatoryDocumentUploadList.length);

  // // this.MandatoryDocumentUploadList.splice(0, this.MandatoryDocumentUploadList.length);
  //  this.mandatoryUploadDocsService.GetAllByMandatoryDocumentCategory(ManDocCat).subscribe((data: any) => {

  //    if (data.responseCode == 1) {
  //      for (let i = 0; i < data.dateSet.length; i++) {
  //        const tempMandatoryDocList = {} as MandatoryDocumentUploadList;
  //        const current = data.dateSet[i];
  //        tempMandatoryDocList.mandatoryDocumentID = current.mandatoryDocumentID;
  //        tempMandatoryDocList.mandatoryDocumentName = current.mandatoryDocumentName;
  //        tempMandatoryDocList.stageID = current.stageID;
  //        tempMandatoryDocList.mandatoryDocumentCategory = current.mandatoryDocumentCategory;
  //        tempMandatoryDocList.dateCreated = current.dateCreated;
  //        switch (tempMandatoryDocList.mandatoryDocumentCategory) {
  //          case "Small": {
  //            this.MandatoryDocumentUploadListSmall.push(tempMandatoryDocList);
  //            break;
  //          }
  //          case "Medium": {
  //            this.MandatoryDocumentUploadListMedium.push(tempMandatoryDocList);
  //            break;
  //          }
  //          case "Large": {
  //            this.MandatoryDocumentUploadListLarge.push(tempMandatoryDocList);
  //            break;
  //          }
  //          case "Emergency": {
  //            this.MandatoryDocumentUploadListEmergency.push(tempMandatoryDocList);
  //            break;
  //          }
  //          default:
  //        }
  //      }

      
  //      this.MandatoryDocumentUploadTable?.renderRows();
  //      console.log("Got ALL MANDATORY DOCS", this.MandatoryDocumentUploadList);

  //      console.log("datadatadatadata", data);
  //    }
  //    else {
  //      alert(data.responseMessage);

  //    }
  //    console.log("response", data);


  //  }, error => {
  //    console.log("Error: ", error);
  //  })
  //}

  getAllLinkedStages(index: any, viewLinkedStages: any) {

        this.MandatoryDocumentsLinkedStagesList.splice(0, this.MandatoryDocumentsLinkedStagesList.length);

    console.log("THIS IS A TEST TO SEE WHATS ",this.MandatoryDocumentUploadList[index].mandatoryDocumentID);
    this.mandatoryDocumentStageLink.getAllMandatoryDocumentStageLinkByStageID(this.MandatoryDocumentUploadList[index].mandatoryDocumentID).subscribe((data: any) => {
      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempMandatoryDocumentsLinkedStagesList = {} as MandatoryDocumentsLinkedStagesList;
          const current = data.dateSet[i];
          tempMandatoryDocumentsLinkedStagesList.stageID = current.stageID;
          tempMandatoryDocumentsLinkedStagesList.mandatoryDocumentStageLinkID = current.mandatoryDocumentStageLinkID;
          tempMandatoryDocumentsLinkedStagesList.stageName = current.stageName;
          tempMandatoryDocumentsLinkedStagesList.dateCreated = current.dateCreated;

          this.MandatoryDocumentsLinkedStagesList.push(tempMandatoryDocumentsLinkedStagesList);
          this.MandatoryDocumentsLinkedStagesTable?.renderRows();

        }

        this.openViewLinkedStages(viewLinkedStages);
        this.MandatoryDocumentsLinkedStagesTable?.renderRows();


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

  getAllMandatoryDocs() {

    this.MandatoryDocumentUploadList.splice(0, this.MandatoryDocumentUploadList.length);

    this.MandatoryDocumentUploadList.splice(0, this.MandatoryDocumentUploadList.length);
    this.mandatoryUploadDocsService.getAllMandatoryDocuments().subscribe((data: any) => {

      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempMandatoryDocList = {} as MandatoryDocumentUploadList;
          const current = data.dateSet[i];
          tempMandatoryDocList.mandatoryDocumentID = current.mandatoryDocumentID;
          tempMandatoryDocList.mandatoryDocumentName = current.mandatoryDocumentName;
          tempMandatoryDocList.stageID = current.stageID;
          tempMandatoryDocList.dateCreated = current.dateCreated;
          this.MandatoryDocumentUploadList.push(tempMandatoryDocList);
        }
        this.MandatoryDocumentUploadTable?.renderRows();
        console.log("Got ALL MANDATORY DOCS", this.MandatoryDocumentUploadList);

        console.log("datadatadatadata", data);
      }
      else {
        alert(data.responseMessage);

      }
      console.log("response", data);


    }, error => {
      console.log("Error: ", error);
    })
  }


  getAllStages() {

   

    this.stagesService.getAllStages().subscribe((data: any) => {
      if (data.responseCode == 1) {

        this.StagesList.splice(0, this.StagesList.length);
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempStageList = {} as StagesList;
          const current = data.dateSet[i];
          tempStageList.StageID = current.stageID;
          tempStageList.StageName = current.stageName;
          tempStageList.StageOrderNumber = current.stageOrderNumber;

          this.StagesList.push(tempStageList);
          this.StagesTable?.renderRows();
        }


        this.StagesTable?.renderRows();
        console.log("GetAllStages", this.StagesList);

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
  stageSelectedForLink(stage:any) {
    this.selection.toggle(stage);
  }

  onManDocCreate() {

  
    let newMandatoryDocumentName = this.addManDoc.controls["newManDocName"].value;
    let mandatoryDocumentCategory = this.addManDoc.controls["mandatoryDocumentCategory"].value;

/*    for (let i = 0; i < this.selection.selected.length; i++) {*/
/*      const current = this.selection.selected[i];
      console.log("THIS IS THE STAGE ID", current.StageID);*/
    this.mandatoryUploadDocsService.addUpdateMandatoryDocument(0, newMandatoryDocumentName, this.CurrentUser.appUserId, mandatoryDocumentCategory).subscribe((data: any) => {

        if (data.responseCode == 1) {

          alert(data.responseMessage);

         


          this.getAllMandatoryDocs();

        }
        else {

          alert(data.responseMessage);
        }
        console.log("reponse", data);

      }, error => {
        console.log("Error: ", error);
      })

  }

  getCurrentMandatoryDocID(index: any) {

    this.CurrentMandatoryDocumentID = this.MandatoryDocumentUploadList[index].mandatoryDocumentID;
    this.header = this.MandatoryDocumentUploadList[index].mandatoryDocumentName;
  }

  onStageLink() {
    for (let i = 0; i < this.selection.selected.length; i++) {
      
      const current = this.selection.selected[i];

      this.mandatoryDocumentStageLink.addUpdateMandatoryDocumentStageLink(0, this.CurrentMandatoryDocumentID, current.StageID, current.StageName, this.CurrentUser.appUserId).subscribe((data: any) => {

        if (data.responseCode == 1) {

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
  }


  onStageDelete(index: any, viewLinkedStages:any) {
    if (confirm("Are you sure you want to remove " + this.MandatoryDocumentsLinkedStagesList[index].stageName + "?")) {
      ;
      this.mandatoryDocumentStageLink.deleteMandatoryDocumentStageLink(this.MandatoryDocumentsLinkedStagesList[index].mandatoryDocumentStageLinkID).subscribe((data: any) => {

        if (data.responseCode == 1) {
          this.MandatoryDocumentsLinkedStagesList.splice(index, 1);
          this.MandatoryDocumentsLinkedStagesTable?.renderRows();
    
          alert(data.responseMessage);


          this.openViewLinkedStages(viewLinkedStages);
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


  onManDocDelete(index:any) {

    if (confirm("Are you sure to delete " + this.MandatoryDocumentUploadList[index].mandatoryDocumentName + "?")) {

      this.mandatoryUploadDocsService.deleteMandatoryDocument(this.MandatoryDocumentUploadList[index].mandatoryDocumentID).subscribe((data: any) => {

        if (data.responseCode == 1) {

          alert(data.responseMessage);
          this.getAllMandatoryDocs();
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


  }

