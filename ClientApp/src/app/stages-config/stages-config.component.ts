import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StagesService } from '../service/Stages/stages.service';
import { SharedService } from '../shared/shared.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';

export interface StagesList {
  StageID: number;
  StageName: string;
  StageOrderNumber: number;
  CurrentUser: any
  stringifiedData: any;
}

export interface StagesOrderList {
  StageNo: number;

}



@Component({
  selector: 'app-stages-config',
  templateUrl: './stages-config.component.html',
  styleUrls: ['./stages-config.component.css']
})
export class StagesConfigComponent implements OnInit {


  drop(event: CdkDragDrop<StagesList[]>) {
    moveItemInArray(this.StagesList, event.previousIndex , event.currentIndex);

    
    
    //let stagePre = this.StagesList[event.previousIndex];
    for (var i = 0; i < event.previousIndex + 1; i++) {
      let stage = this.StagesList[i];
     


      this.stagesService.addUpdateStage(stage.StageID, stage.StageName, i, this.CurrentUser.appUserId).subscribe((data: any) => {

        if (data.responseCode == 1) {

          alert(data.dateSet.stageName+ " " + data.responseMessage  );
        
        }
        else {
          alert(data.responseMessage);
        }
        console.log("response", data);
      }, error => {
        console.log("Error", error);
      })

      
    }

    console.log("event.currentIndex", event.currentIndex);

  }
  orderNo:any
  stringifiedData: any;
  CurrentUser: any;
  StagesList: StagesList[] = [];
  StagesOrderList: StagesOrderList[] = [];
  forEditIndex: any;

  public addStage = this.formBuilder.group({
    newStageName: ['', Validators.required]
  })

  public editStage = this.formBuilder.group({
    editStageName: ['', Validators.required],
    editStageOrder: ['', Validators.required]
  })


  openXl(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }
 
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private shared: SharedService, private stagesService: StagesService) { }

  ngOnInit(): void {

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData); this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.getAllStages();
   
  }

  displayedColumns: string[] = ['StageName', 'StageOrderNumber', 'actions'];
  dataSource = this.StagesList;
  @ViewChild(MatTable) stagesTable: MatTable<StagesList> | undefined;

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

        }

      
        this.stagesTable?.renderRows();
        console.log("GetAllStages", data.dateSet);
        
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

  onStageCreate() {
    let newStageName = this.addStage.controls["newStageName"].value;
    let newStageOrder = this.StagesList.length;

   

    this.stagesService.addUpdateStage(0, newStageName, newStageOrder, this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {
        alert(data.responseMessage);
        this.getAllStages();
        this.StagesList.splice(0, this.StagesList.length);
      }
      else {
        alert(data.responseMessage);

      }
      console.log("response", data);
    }, error => {
      console.log("Error", error);
    })
  }


  onStageDelete(index: any) {
    console.log(this.StagesList[index].StageName);
    
    if (confirm("Are you sure to delete " + this.StagesList[index].StageName + "?")) {

      this.stagesService.deleteStage(this.StagesList[index].StageID).subscribe((data: any) => {
        this.StagesList.splice(0, this.StagesList.length);

        if (data.responseCode == 1) {


          alert(data.responseMessage);

          this.getAllStages();
        }
        else {
          alert(data.responseMessage);
        }
        console.log("reponse", data);

      }, error => {
        console.log("Error: ", error);
      })


      for (var i = 0; i < this.StagesList.length; i++) {
        let stage = this.StagesList[i];



        this.stagesService.addUpdateStage(stage.StageID, stage.StageName, i, this.CurrentUser.appUserId).subscribe((data: any) => {

          if (data.responseCode == 1) {

            alert(data.dateSet.stageName + " " + data.responseMessage);

          }
          else {
            alert(data.responseMessage);
          }
          console.log("response", data);
        }, error => {
          console.log("Error", error);
        })

      }
    }


  }



  onStageEdit(event: any, index: any, changeOrderNumber: any) {

    this.editStage.controls["editStageName"].setValue(this.StagesList[index].StageName);

    this.forEditIndex = index;
    this.modalService.open(changeOrderNumber, { size: 'lg' });
  }

  saveStageEdit() {
    
    let editStageName = this.editStage.controls["editStageName"].value;
    console.log(this.orderNo);

    this.stagesService.addUpdateStage(this.StagesList[this.forEditIndex].StageID, editStageName, this.StagesList[this.forEditIndex].StageOrderNumber, this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {
        alert(data.responseMessage);
        this.getAllStages();
      }
      else {
        alert(data.responseMessage);
      }
      console.log("response", data);
    }, error => {
      console.log("Error", error);
    })
  
  }



  populateStageOrder() {

    let currentNo = 1;
    for (var i = 0; i < this.StagesList.length; i++) {
      const tempStageOrderList = {} as StagesOrderList;
      tempStageOrderList.StageNo = currentNo++;
      this.StagesOrderList.push(tempStageOrderList);

    }
  }
}
