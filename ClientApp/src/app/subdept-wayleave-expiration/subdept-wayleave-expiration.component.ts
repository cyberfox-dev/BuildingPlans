import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { SubDepartmentsService } from '../service/SubDepartments/sub-departments.service'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from '../service/Config/config.service';
import { data } from 'jquery';

export interface SubdepartmentsList {
  SubdepartmentID: number;
  SubdepartmentName: string;
  DaysBeforeExpiry: any; // number;
}
@Component({
  selector: 'app-subdept-wayleave-expiration',
  templateUrl: './subdept-wayleave-expiration.component.html',
  styleUrls: ['./subdept-wayleave-expiration.component.css']
})
export class SubdeptWayleaveExpirationComponent implements OnInit {
  CurrentUser: any;
  stringifiedData: any;

  SubdepartmentsList: SubdepartmentsList[] = [];

  displayedColumns: string[] = ['name', 'days', 'actions'];
  dataSource = this.SubdepartmentsList;
  @ViewChild(MatTable) subDepartmentsTable: MatTable<SubdepartmentsList> | undefined;
  constructor(private subdepartmentsService: SubDepartmentsService, private modalService: NgbModal, private configService: ConfigService ) { }

  ngOnInit(): void {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.getExpirationConfig();
    this.getAllSubDepartments();
  }

  expiryDays: number = 999; // an impossibly large number it can never be
  baseExpirySubdepartmentName: string;

  getAllSubDepartments() {
    this.SubdepartmentsList.splice(0, this.SubdepartmentsList.length);

    this.subdepartmentsService.getSubDepartmentsList().subscribe((data: any) => {
      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {


          const tempSubDptList = {} as SubdepartmentsList;
          const current = data.dateSet[i];
          tempSubDptList.SubdepartmentID = current.subDepartmentID;
          tempSubDptList.SubdepartmentName = current.subDepartmentName;

          if (current.wayleaveExpiration === null) {
            tempSubDptList.DaysBeforeExpiry = "DAYS NOT SET";
          } else {
            tempSubDptList.DaysBeforeExpiry = current.wayleaveExpiration;
          }

          this.SubdepartmentsList.push(tempSubDptList);

          if (current.wayleaveExpiration !== null) {

            if (current.wayleaveExpiration < this.expiryDays) {
              this.expiryDays = current.wayleaveExpiration;
              this.baseExpirySubdepartmentName = current.subDepartmentName;
            }
          }
        }
        this.subDepartmentsTable.renderRows();
      } else {
        alert(data.responseMessage);
      }
      console.log("Getting subdepartments data for expiry config", data);
      console.log("Smallest non-null wayleaveExpiration:", this.expiryDays);
      console.log("Corresponding subdepartment name:", this.baseExpirySubdepartmentName);
    }, error => {
      console.log("Error: ", error);
    })
  }

  selectedSubDepartmentName: string;
  selectedSubDepartmentID: number;
  selectedDays: number;

  modalRef: NgbModalRef;
  openEditDays(editExpiry: any, subdepartmentID: number, subdepartmentName: string, days: number) {
    this.selectedDays = days;
    this.selectedSubDepartmentID = subdepartmentID;
    this.selectedSubDepartmentName = subdepartmentName;

    console.log("Selected Days:", this.selectedDays);
    console.log("Selected Subdepartment ID:", this.selectedSubDepartmentID);
    console.log("Selected Subdepartment Name:", this.selectedSubDepartmentName);


    this.modalRef = this.modalService.open(editExpiry, { centered: true, size: 'lg', backdrop: 'static' });
  }
  newDaysBeforeExpiry: number;

  onInputChange(event:any) {
    const value = parseInt(event.target.value, 10); // Parse input value as number
    if (value < 11) {
      this.newDaysBeforeExpiry = 11; // Reset to minimum value
    } else if (value > 100) {
      this.newDaysBeforeExpiry = 100; // Reset to maximum value
    }
    else {
      this.newDaysBeforeExpiry = value;
    }
  }

  saveChanges() {
    if (this.newDaysBeforeExpiry == null) {
      alert("Expiry date won't be changed if the value is not set.");
      return;
    }
    else if (this.selectedDays == this.newDaysBeforeExpiry) {
      alert("The selected number of days is the same as that which is already set.");
      return;
    }
    const confirm = window.confirm("Are you sure you want to save these changes?");
    if (confirm) {
      this.subdepartmentsService.addUpdateSubDepartment(this.selectedSubDepartmentID, this.selectedSubDepartmentName, null, null, null, null, null, this.newDaysBeforeExpiry, null).subscribe((data: any) => {

        if (data.responseCode == 1) {
          console.log("Wat gaan ann? EXPIRY", data);

          this.getAllSubDepartments(); 
          this.modalRef.close();

          this.selectedDays = null;
          this.selectedSubDepartmentID = null;
          this.selectedSubDepartmentName = null;

          alert(data.responseMessage);
        } else {
          alert(data.responseMessage);
        }
        console.log("Subdepartment expiry has been updated", data);
      }, error => {
        console.log("Error: ", error);
      })
    }
  }

  initializeWLExpiry() {

    this.configService.addUpdateConfig(0, "ExpiryDate", "Set according to the shortest set expiry date given by any subdepartment, this will determine when applicants must renew their applications.", this.expiryDays.toString(), this.baseExpirySubdepartmentName, null, this.CurrentUser.appUserId).subscribe((data: any) => {
      if (data.responseCode == 1) { 
        this.getExpirationConfig();
        alert(data.responseMessage);
      } else {
        alert(data.responseMessage);
      }
      console.log("Adding ExpiryDate config:", data);
    }, error => {
      console.log("Error: ", error);
    })
  }

  editWLEpriry() {

  }
  viewExpiryDays: any;
  viewBaseSubdepartment: any;
  isInitialized: boolean = false;
  getExpirationConfig() {
    this.configService.getConfigsByConfigName("ExpiryDate").subscribe((data: any) => {
      if (data.responseCode == 1 && data.dateSet && data.dateSet.length > 0) {

        const current = data.dateSet[0];
        this.viewExpiryDays = current.utilitySlot1;
        this.viewBaseSubdepartment = current.utilitySlot2;

        if (current.utilitySlot1 !== null && current.utilitySlot2 !== null) {
          this.isInitialized = true;
        }
      }
      else {
        console.log("Error while trying to fetch EXPIRYDATE config details. There's probably no such config.");
      }
      console.log("response fetching expiry config details", data);
    }, error => {
      console.log("Error while fetching expiry config details?", error);
    })
  }
}
