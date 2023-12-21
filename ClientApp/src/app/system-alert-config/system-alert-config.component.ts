import { Component, OnInit, ViewChild } from '@angular/core';
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
  baseUrl: string;
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

  bannerMessage: string = "Testing";
  alertType: string;

  CurrentUser: any;
  stringifiedData: any;

  @ViewChild(MatTable) alertsTable: MatTable<AlertList> | undefined;
  displayedColumns: string[] = ['Message', 'StartDate', 'EndDate', 'DateCreated', 'actions'];
  dataSource = this.Alerts;

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
        this.modalService.dismissAll(); 
      }
  }

  alertCreate() {
    this.config.addUpdateConfig(0, "Alert", "A user has created a banner alert via config", this.startDate + " " + this.endDate, this.alertBaseUrl, this.bannerMessage, this.CurrentUser.appUserId ).subscribe((data: any) => {

    })
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  findLiveAlert() {
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

          tempAlertList.baseUrl = current.utilitySlot2;
          tempAlertList.message = current.utilitySlot3;

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

  deleteAlert(index: number, element: AlertList ){
    const configId = element.configAlertId;
    this.config.deleteConfig(configId).subscribe((data: any) => {

    })
  }


}
