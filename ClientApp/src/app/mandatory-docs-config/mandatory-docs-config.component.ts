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
  public editManDoc = this.formBuilder.group({
    editManDocName: ['', Validators.required],
    editManDocCategory: ['', ]

  })

  CurrentMandatoryDocumentID: any;
  

  CurrentUser: any;
  stringifiedData: any;

  MandatoryDocumentUploadList: MandatoryDocumentUploadList[] = [];

  StagesList: StagesList[] = [];
  MandatoryDocumentsLinkedStagesList: MandatoryDocumentsLinkedStagesList[] = [];
    manDocCategory: string;


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



  displayedColumns: string[] = ['mandatoryDocumentName', 'mandatoryDocumentCategory','dateCreated', 'actions'];
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



  setFilterManDocCategory() {
    debugger;
    this.dataSource = this.MandatoryDocumentUploadList.filter(df => df.mandatoryDocumentCategory == this.manDocCategory);
    this.MandatoryDocumentUploadTable?.renderRows();
    //This is what will be used for methods that need the index...
    return this.dataSource;
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
          tempMandatoryDocList.mandatoryDocumentCategory = current.mandatoryDocumentCategory;
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

  /*getCurrentMandatoryDocID(index: any) {
    this.selectedManDocIndex = index;
    this.CurrentMandatoryDocumentID = this.MandatoryDocumentUploadList[index].mandatoryDocumentID;
    this.header = this.MandatoryDocumentUploadList[index].mandatoryDocumentName;
  }*/
  getCurrentMandatoryDocID(index: any) {
    this.selectedManDocIndex = index;

    // Use this.dataSource instead of this.MandatoryDocumentUploadList
    const selectedDocument = this.dataSource[index];

    this.CurrentMandatoryDocumentID = selectedDocument?.mandatoryDocumentID || null;
    this.header = selectedDocument?.mandatoryDocumentName || '';
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


  /*onManDocDelete(index:any) {

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

  }*/
  onManDocDelete(index: number) {
    if (index !== null && this.dataSource[index]) {
      const documentToDelete = this.dataSource[index];

      if (confirm("Are you sure to delete " + documentToDelete.mandatoryDocumentName + "?")) {
        this.mandatoryUploadDocsService.deleteMandatoryDocument(documentToDelete.mandatoryDocumentID)
          .subscribe((data: any) => {
            if (data.responseCode == 1) {
              alert(data.responseMessage);
              //Delete now refreshes
              this.MandatoryDocumentUploadList = this.MandatoryDocumentUploadList.filter(item => item.mandatoryDocumentID !== documentToDelete.mandatoryDocumentID);
              this.dataSource = [...this.MandatoryDocumentUploadList];
              this.MandatoryDocumentUploadTable?.renderRows();
            } else {
              alert(data.responseMessage);
            }
            console.log("response", data);
          }, error => {
            console.log("Error: ", error);
          });
      }
    }
  }
  /*onManDocEdit() {
    if (this.selectedManDocIndex !== null) {
      const editedMandatoryDocumentName = this.editManDoc.controls['editManDocName'].value;
      const editedMandatoryDocumentCategory = this.editManDoc.controls['editManDocCategory'].value;

      this.mandatoryUploadDocsService
        .addUpdateMandatoryDocument(
          this.MandatoryDocumentUploadList[this.selectedManDocIndex].mandatoryDocumentID,
          editedMandatoryDocumentName,
          this.CurrentUser.appUserId,
          editedMandatoryDocumentCategory
        )
        .subscribe((data: any) => {
          if (data.responseCode == 1) {
            alert(data.responseMessage);
            this.getAllMandatoryDocs();
            this.MandatoryDocumentUploadTable?.renderRows();
            // Reset the selectedManDocIndex after successful update
            this.selectedManDocIndex = null;
          } else {
            alert(data.responseMessage);
          }
          console.log('reponse', data);
        }, error => {
          console.log('Error: ', error);
        });
    }
  }*/
  selectedManDocIndex: number | null = null;
  /*onManDocEdit() {
    if (this.selectedManDocIndex !== null) {
      // Check if the form is valid
      if (this.editManDoc.valid) {
        const editedMandatoryDocumentName = this.editManDoc.controls['editManDocName'].value;
        const editedMandatoryDocumentCategory = this.editManDoc.controls['editManDocCategory'].value;

        // Get the original document values
        const originalDocument = this.MandatoryDocumentUploadList[this.selectedManDocIndex];

        // Check if the user made changes
        if (
          editedMandatoryDocumentName === originalDocument.mandatoryDocumentName &&
          editedMandatoryDocumentCategory === originalDocument.mandatoryDocumentCategory
        ) {
          // No changes were made
          alert('You have made no changes.');
          return; // Exit the function without making the API request
        }

        // If changes were made, proceed with the API request
        this.mandatoryUploadDocsService
          .addUpdateMandatoryDocument(
            originalDocument.mandatoryDocumentID,
            editedMandatoryDocumentName,
            this.CurrentUser.appUserId,
            editedMandatoryDocumentCategory
          )
          .subscribe((data: any) => {
            if (data.responseCode == 1) {
              alert(data.responseMessage);
              this.getAllMandatoryDocs();
              this.MandatoryDocumentUploadTable?.renderRows();
              // Reset the selectedManDocIndex after successful update
              this.selectedManDocIndex = null;
            } else {
              alert(data.responseMessage);
            }
            console.log('response', data);
          }, error => {
            console.log('Error: ', error);
          });
      } else {
        // Handle form validation errors, e.g., show an error message or prevent submission
        alert('Please fill in all required fields.');
      }
    }
  }


 


openEdit(editingManDoc: any, index: number) {
    if (index !== null && this.MandatoryDocumentUploadList[index]) {
      const selectedDocument = this.MandatoryDocumentUploadList[index];
      this.selectedManDocIndex = index;

      // Set form control values based on the selected document
      this.editManDoc.setValue({
        editManDocName: selectedDocument.mandatoryDocumentName,
        editManDocCategory: selectedDocument.mandatoryDocumentCategory,
      });

      this.modalService.open(editingManDoc, { centered: true, size: 'lg' });
    }
  }*/
  //NB: THIS DATASOURCE ++ THIS DATASOURCE ++ THIS DATASOURCE ++ THIS DATASOURCE ++ THIS DATASOURCE intead of this.MandatoryDocumentUploadList
  onManDocEdit() {
    if (this.selectedManDocIndex !== null) {
      // Check if the form is valid
      if (this.editManDoc.valid) {
        const editedMandatoryDocumentName = this.editManDoc.controls['editManDocName'].value;
        const editedMandatoryDocumentCategory = this.editManDoc.controls['editManDocCategory'].value;

        // Get the original document values from this.dataSource
        const originalDocument = this.dataSource[this.selectedManDocIndex];

        // Check if the user made changes
        if (
          editedMandatoryDocumentName === originalDocument.mandatoryDocumentName &&
          editedMandatoryDocumentCategory === originalDocument.mandatoryDocumentCategory
        ) {
          // No changes were made
          alert('You have made no changes.');
          return; // Exit the function without making the API request
        }

        // If changes were made, proceed with the API request
        this.mandatoryUploadDocsService
          .addUpdateMandatoryDocument(
            originalDocument.mandatoryDocumentID,
            editedMandatoryDocumentName,
            this.CurrentUser.appUserId,
            editedMandatoryDocumentCategory
          )
          .subscribe((data: any) => {
            if (data.responseCode == 1) {
              alert(data.responseMessage);
              //this.getAllMandatoryDocs();
              
              //I'd like to "refresh" the table
              this.dataSource = [...this.MandatoryDocumentUploadList];
           
              this.MandatoryDocumentUploadTable?.renderRows();
             
              this.selectedManDocIndex = null;   // Reseting the selectedManDocIndex after a successful update
            } else {
              alert(data.responseMessage);
            }
            console.log('response', data);
          }, error => {
            console.log('Error: ', error);
          });
      } else {
        // Handle form validation errors, e.g., show an error message or prevent submission
        alert('Please fill in all required fields.');
      }
    }
  }

  openEdit(editingManDoc: any, index: number) {
    if (index !== null && this.dataSource[index]) {
      const selectedDocument = this.dataSource[index];
      this.selectedManDocIndex = index;

      // Set form control values based on the selected document from this.dataSource
      this.editManDoc.setValue({
        editManDocName: selectedDocument.mandatoryDocumentName,
        editManDocCategory: selectedDocument.mandatoryDocumentCategory,
      });

      this.modalService.open(editingManDoc, { centered: true, size: 'lg' });
    }
  }
}

