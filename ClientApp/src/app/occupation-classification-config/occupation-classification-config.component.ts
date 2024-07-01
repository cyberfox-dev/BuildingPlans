import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OccupationClassificationService } from 'src/app/service/OccupationClassification/occupation-classification.service';

export interface ClassificationsList {
  OccupationID: number;
  OccupationName: string;
  OccupationCode: string;
  ItemTypeID: number;
  Occupancy: string;
  OccupancyDescription: string;
  CreatedById: string;
  DateCreated: any;
  DateUpdated: any;
}
@Component({
  selector: 'app-occupation-classification-config',
  templateUrl: './occupation-classification-config.component.html',
  styleUrls: ['./occupation-classification-config.component.css']
})
export class OccupationClassificationConfigComponent implements OnInit {

  constructor(private modalService: NgbModal, private occupationClassificationService: OccupationClassificationService) { }
  OccupationClassificationsList: ClassificationsList[] = [];

  @ViewChild(MatTable) ClassificationsTable: MatTable<ClassificationsList> | undefined;
  displayedColumns: string[] = ['OccupationName', 'OccupationCode', 'Occupancy', 'OccupancyDescription','DateCreated','DateUpdated', 'actions'];
  dataSource = this.OccupationClassificationsList;

  @ViewChild("newClass", { static: true }) addClass!: ElementRef;
  @ViewChild("editClass", { static: true }) editClass!: ElementRef;


  occupationID: number;
  occupationName: string;
  occupationCode: string;
  itemTypeID: number;
  occupancy: string;
  occupancyDescription: string;

 
  //newOccupationName: string;
  //newOccupationCode: string;
  //newItemTypeID: number;
  //newOccupancy: string;
  //newOccupancyDescription: string;

  stringifiedData: any;
  CurrentUser: any;

  ngOnInit(): void {
    this.getAllOccupationClassifications();
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
  }
  OpenNewClass() {
    this.modalService.open(this.addClass, { centered: true, size: 'xl' });
  }

  OpenEditClass() {
    this.modalService.open(this.editClass, { centered: true, size:'xl' });
  }

  getAllOccupationClassifications() {
    this.OccupationClassificationsList.splice(0, this.OccupationClassificationsList.length);
    this.occupationClassificationService.getAllOccupationClassifications().subscribe((data: any) => {
      if (data.responseCode == 1) {
        
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempClassificationList = {} as ClassificationsList;
          const current = data.dateSet[i];
         
          tempClassificationList.OccupationID = current.occupationID;
          tempClassificationList.OccupationCode = current.occupationCode;
          tempClassificationList.Occupancy = current.occupancy;
          tempClassificationList.OccupancyDescription = current.occupancyDescription;
          tempClassificationList.OccupationName = current.occupationName;
          tempClassificationList.DateCreated = current.dateCreated.substring(0, current.dateCreated. indexOf("T"));
          tempClassificationList.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated. indexOf("T"));
          this.OccupationClassificationsList.push(tempClassificationList);
        }

       
        this.dataSource = this.OccupationClassificationsList;
        this.ClassificationsTable.renderRows();
      }
      else {
        alert(data.responseCode);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  ValidateInfo() {
    let occupationName = this.occupationName;
    let occupationCode = this.occupationCode;
    let itemTypeID = this.itemTypeID;
    
    if (occupationCode == undefined || occupationName == undefined || itemTypeID == undefined
      || occupationName.trim() == "" || occupationCode.trim() == "" ) {

      alert("Please fill in all required fields");
    }
    else {
      this.AddUpdateClassification();
    }
  }

  AddUpdateClassification() {
    
    this.occupationClassificationService.addUpdateOccupationClassfication(this.occupationID, this.occupationName, this.occupationCode, this.occupancy, this.occupancyDescription, this.itemTypeID, this.CurrentUser.appUserId).subscribe((data: any) => {
      
      if (data.responseCode == 1) {
        
        alert(data.responseMessage);
        this.getAllOccupationClassifications();
        this.CLearData();
        this.modalService.dismissAll();
      }
      else {

        alert(data.responseMessage);
      }
    }, error => {
      console.log("Error: ", error);
    })
  }

  EditClassfication(index: any) {
    
    const current = this.OccupationClassificationsList[index];
    this.occupationID = current.OccupationID;
    this.occupationName = current.OccupationName;
    this.occupationCode = current.OccupationCode;
    this.occupancy = current.Occupancy;
    this.occupancyDescription = current.OccupancyDescription;
    this.itemTypeID = current.ItemTypeID;
    this.OpenEditClass();
  }

  CLearData() {
    this.occupationID = 0;
    this.occupationName = "";
    this.occupationCode = "";
    this.occupancy = "";
    this.itemTypeID = null;
    this.occupancyDescription = "";
  }

  onDeleteClassification(index: any) {
    
    let occupationID = this.OccupationClassificationsList[index].OccupationID;

    this.occupationClassificationService.deleteOccupationClassificationByOccupationID(occupationID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        
        alert(data.responseMessage);
        this.getAllOccupationClassifications();
       
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Error: ", error);
    })
  }
}
