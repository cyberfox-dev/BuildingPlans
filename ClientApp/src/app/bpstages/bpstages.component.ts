import { Component, OnInit,ViewChild } from '@angular/core';
import { BPStagesService } from 'src/app/service/BPStages/bpstages.service';
import { BPFunctionalAreasService } from '../service/BPFunctionalAreas/bpfunctional-areas.service';
import { MatTable } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
export interface BPStagesList {
  StageID: number;
  StageName: string;
  StageOrderNumber: string;
  FunctionalArea: string;
  DateCreated: any;
  DateUpdated: any;
}

export interface FunctionalAreas {
  FunctionalAreaID: number;
  FAName: string;
  DateCreated: any;
  DateUpdated: any;

}
@Component({
  selector: 'app-bpstages',
  templateUrl: './bpstages.component.html',
  styleUrls: ['./bpstages.component.css']
})
export class BPStagesComponent implements OnInit {

  functionalArea: string;
  stagesList: BPStagesList[] = [];
  functionalAreaList: FunctionalAreas[] = [];

  stageID: number = 0;
  stageName: string;
  orderNumber: string;
  dataSource = this.stagesList;

  @ViewChild(MatTable) stageTable: MatTable<BPStagesList> | undefined;
  displayedColumns: string[] = ['StageName', 'StageOrderNumber', 'DateCreated', 'DateUpdated', 'actions'];
  stringifiedData: any;
  CurrentUser: any;
  constructor(private bpStagesService: BPStagesService, private functionalAreaService: BPFunctionalAreasService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.functionalArea = "Building Plan";
    this.getAllFunctionalAreas();
    this.getAllBPStages();

  }

  openNewStage(newStage: any) {
    this.stageName = "";
    this.orderNumber = "";
    this.modalService.open(newStage, { centered: true, size: 'xl' });
  }

  getAllFunctionalAreas() {
    this.functionalAreaService.getAllFunctionalAreas().subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempFunctionalArea = {} as FunctionalAreas;

          tempFunctionalArea.FunctionalAreaID = current.functionalAreaID;
          tempFunctionalArea.FAName = current.faName;
          tempFunctionalArea.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
          tempFunctionalArea.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));

          this.functionalAreaList.push(tempFunctionalArea);
        }

        
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Error", error);
    }
    )
  }
  getAllBPStages() {
    debugger;
    this.stagesList.splice(0, this.stagesList.length);
    this.bpStagesService.getAllStagesForFunctionalArea(this.functionalArea).subscribe((data: any) => {
      if (data.responseCode == 1) {
        debugger;
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempStage = {} as BPStagesList;
          
          tempStage.StageID = current.stageID;
          tempStage.StageName = current.stageName;
          tempStage.StageOrderNumber = current.stageOrder;
          tempStage.FunctionalArea = current.functionalArea;
          tempStage.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
          tempStage.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));

          this.stagesList.push(tempStage);
        }
        debugger;
        this.dataSource = this.stagesList;
        this.stageTable?.renderRows();
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Error", error);
    
    })
  }


  addUpdateStage() {
    debugger;
    this.bpStagesService.addUpdateStage(this.stageID, this.stageName, this.orderNumber, this.functionalArea, this.CurrentUser.appUserId).subscribe((data: any) => {
      debugger;
      if (data.responseCode == 1) {
        debugger;
        this.stageID = 0;
        this.stageName = "";
        this.orderNumber = "";
        this.getAllBPStages();
        this.modalService.dismissAll();
        alert(data.responseMessage);
      }
      else {

      }
    }, error => {
      console.log("Error", error);
    
    })
  }

  onPopulateStage(index: any, editStage: any) {

    const current = this.stagesList[index];

    this.stageID = current.StageID;
    this.stageName = current.StageName;
    this.orderNumber = current.StageOrderNumber;

    this.modalService.open(editStage, { centered: true, size: 'xl' });
  }

  deleteStage(index: any) {
    const stageID = this.stagesList[index].StageID;

    this.bpStagesService.deleteStagebyStageID(stageID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        alert(data.responseMessage);
        this.getAllBPStages();
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Error", error);
    })
  }
}
