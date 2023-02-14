import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {MandatoryDocumentUploadService } from '../service/MandatoryDocumentUpload/mandatory-document-upload.service';
import { StagesService } from '../service/Stages/stages.service';
import { MatPaginator } from '@angular/material/paginator'


export interface MandatoryDocumentUploadList {
  mandatoryDocumentID: number;
  mandatoryDocumentName: string;
  stageID: number;
  dateCreated: any;
}

export interface StagesList {
  StageID: number;
  StageName: string;
  StageOrderNumber: number;

}





@Component({
  selector: 'app-mandatory-docs-config',
  templateUrl: './mandatory-docs-config.component.html',
  styleUrls: ['./mandatory-docs-config.component.css']
})
export class MandatoryDocsConfigComponent implements OnInit {


  public addManDoc = this.formBuilder.group({
    newManDocName: ['', Validators.required]

  })

  CurrentUser: any;
  stringifiedData: any;

  MandatoryDocumentUploadList: MandatoryDocumentUploadList[] = [];
  StagesList: StagesList[] = [];

  openXl(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }
  openAddUserToAccessGroup(addUserToAccessGroup: any) {
    //this.getAllStages();
    this.modalService.open(addUserToAccessGroup, { centered: true, size: 'lg' });
    
  }


  @ViewChild(MatTable) MandatoryDocumentUploadTable: MatTable<MandatoryDocumentUploadList> | undefined;
  @ViewChild(MatTable) StagesTable: MatTable<StagesList> | undefined;


  constructor(private modalService: NgbModal, private mandatoryUploadDocsService: MandatoryDocumentUploadService, private stagesService: StagesService, private formBuilder: FormBuilder) { }

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

  

  getAllMandatoryDocs() {
   
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

  onManDocCreate(index:any) {

  
    let newMandatoryDocumentName = this.addManDoc.controls["newManDocName"].value;

    

    this.mandatoryUploadDocsService.addUpdateMandatoryDocument(0, newMandatoryDocumentName,0,this.CurrentUser.appUserId).subscribe((data: any) => {

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
