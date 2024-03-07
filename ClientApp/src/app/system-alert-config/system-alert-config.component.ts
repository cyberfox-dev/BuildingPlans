import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/shared/shared.service';
import { ConfigService } from 'src/app/service/Config/config.service';
import { DatePipe } from '@angular/common';
import { MatTable } from '@angular/material/table';


export interface AlertList {
  configAlertId: number;
  startDate: string;
  endDate: string;
  message: string;
  status: string;
  disabledCreate: boolean;
  dateCreated: string;
  createdById: string;
}

@Component({
  selector: 'app-system-alert-config',
  templateUrl: './system-alert-config.component.html',
  styleUrls: ['./system-alert-config.component.css']
})
export class SystemAlertConfigComponent implements OnInit {
  Alerts: AlertList[] = [];

  //alertBaseUrl: string = '';
  private readonly alertBaseUrl: string = this.sharedService.getApiUrl()

  bannerColor: string = "white"; //default

  canCreateApp: boolean = true; //default - imagine it's a simple announcement
  startDate: Date = new Date();
  endDate: Date = new Date();
  currentDate: string;
  //Banner Kyle 26-01-24
  editBannerMessage: string;
  editStartDate: string;
  editEndDate: string;
  configId: number;

  canUpdate: boolean;
  bannerMessage: string = "Testing";
  alertType: string;
   //Banner Kyle 26-01-24
  CurrentUser: any;
  stringifiedData: any;

  @ViewChild(MatTable) alertsTable: MatTable<AlertList> | undefined;
  displayedColumns: string[] = ['Message', 'Status','StartDate', 'EndDate', 'DateCreated', 'isDisabled','actions'];
  dataSource = this.Alerts;
  disableCreate: boolean = false;
  createValue: number = 0;
  constructor(private modalService: NgbModal, private sharedService: SharedService, private config: ConfigService) { }

  ngOnInit(): void {

    setTimeout(() => {
      this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
      this.CurrentUser = JSON.parse(this.stringifiedData); 
      this.findLiveAlert();

    }, 100);
  }

  openCreateModal(newAlert:any) {
    this.modalService.open(newAlert, { backdrop: 'static', centered: true, size: 'xl' });
  }

  createNewAlert() {
    const isConfirmed = window.confirm('Are you sure you want to create this system alert?');
      if(isConfirmed) { 
        this.alertCreate();
        
      }
  }

  alertCreate() {
     //Banner Kyle 26-01-24
    
    const start = this.startDate.toString();
    const end = this.endDate.toString();
    const match = this.Alerts.map(x => (start >= x.startDate && end <= x.endDate) || (start <= x.startDate && end <= x.endDate) || (end >= x.startDate && end <= x.endDate));

    if (match.includes(true)) {
      alert("There is already an alert for this day");

    }
    else {
      this.config.addUpdateConfig(0, "Alert", "A user has created a banner alert via config", this.startDate + " " + this.endDate, this.createValue.toString(), this.bannerMessage, this.CurrentUser.appUserId).subscribe((data: any) => {
        if (data.responseCode == 1) {
          alert(data.responseMessage);
          this.findLiveAlert();
          this.modalService.dismissAll(); 
        }
        else {
          alert(data.responseMessage);
        }


      }, error => {
        console.log("Error: ", error);
      })
    }
   
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
   
    return `${year}-${month}-${day}`;
  }

  findLiveAlert() {
    this.Alerts.splice(0, this.Alerts.length);
    this.config.getConfigsByConfigName("Alert").subscribe((data: any) => {
      console.log("These are my alerts", data);

      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempAlertList = {} as AlertList;
          const current = data.dateSet[i];
          tempAlertList.configAlertId = current.configID;
          tempAlertList.createdById = current.createdById;
          tempAlertList.dateCreated = current.dateCreated;

          let dateValues = current.utilitySlot1.split(' ');
          tempAlertList.startDate = dateValues[0];
          tempAlertList.endDate = dateValues[1];

          if (current.utilitySlot2 == "0") {
            tempAlertList.disabledCreate = false;
          }
          else if (current.utilitySlot2 == "1") {
            tempAlertList.disabledCreate = true;
          }
          tempAlertList.message = current.utilitySlot3;
          
          //Banner Kyle 26-01-24
          this.currentDate = this.getCurrentDate();
          if (this.currentDate >= dateValues[0] && this.currentDate <= dateValues[1]) {
            
            tempAlertList.status = "Active";
          }

          if (this.currentDate > dateValues[0] && this.currentDate > dateValues[1]) {
            
            tempAlertList.status = "Completed";
          }

          if (this.currentDate < dateValues[0] && this.currentDate < dateValues[1]) {
            
            tempAlertList.status = "Pending";
          }
           //Banner Kyle 26-01-24
          this.Alerts.push(tempAlertList);
          this.alertsTable?.renderRows();
        }
        this.alertsTable?.renderRows();
      } else {
        alert(data.responseMessage);
      }
      console.log("Seeking alerts response", data);
      this.alertsTable?.renderRows();
      
    }, error => {
      console.log("Error: ", error);
    })
  }
   //Banner Kyle 26-01-24
  deleteAlert(index: number, element: AlertList ){
    const configId = element.configAlertId;
    this.config.deleteConfig(configId).subscribe((data: any) => {
      this.findLiveAlert();
    })
  }

  openEditAlert(editAlert:any) {
    this.modalService.open(editAlert, { backdrop: 'static', centered: true, size: 'xl' });
  }

  //11 January 2024, As I create this I see it like so: system alert === builder's break. The Create Wayleave button WILL be disabled.
   //Banner Kyle 26-01-24
  onOpenEditAlert(index: any ,editAlert :any) {
    const current = this.Alerts[index];
    this.configId = current.configAlertId;
    this.editBannerMessage = current.message;
    this.editStartDate = current.startDate;
    this.editEndDate = current.endDate;
    this.disableCreate = current.disabledCreate;
    this.openEditAlert(editAlert);
  }

  onSaveEdittedAlert() {
    
    const start = this.editStartDate.toString();
    const end = this.editEndDate.toString();
    const match = this.Alerts.map(x => x.configAlertId != this.configId && ((start >= x.startDate && end <= x.endDate) || (start <= x.startDate && end <= x.endDate) || (end >= x.startDate && end <= x.endDate)));

    if (match.includes(true)) {
      alert("There is already an alert for this day");

    }
    else {
      this.config.addUpdateConfig(this.configId, "Alert", "A user has created a banner alert via config", this.editStartDate + " " + this.editEndDate, this.createValue.toString(), this.editBannerMessage, this.CurrentUser.appUserId).subscribe((data: any) => {
        if (data.responseCode == 1) {
          alert(data.responseMessage);
          this.findLiveAlert();
          this.modalService.dismissAll();
        }
        else {
          alert(data.responseMessage);
        }


      }, error => {
        console.log("Error: ", error);
      })
    }

   
   
     //Banner Kyle 26-01-24
  }
  onDisableCreate() {
    if (this.disableCreate == false) {
      this.disableCreate = true
    }
    else {
      this.disableCreate = false;
    }


    if (this.disableCreate == true) {
      this.createValue = 1
    }
    else if(this.disableCreate == false) {
      this.createValue = 0;
    }
    
  }

}
