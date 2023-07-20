import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ServiceItemService  } from 'src/app/service/ServiceItems/service-item.service';
import { SubDepartmentsService } from '../service/SubDepartments/sub-departments.service';
import {
  MatSlideToggleModule,
  _MatSlideToggleRequiredValidatorModule,
} from '@angular/material/slide-toggle';
import { ConfigService } from '../service/Config/config.service';
import { DepartmentsService } from '../service/Departments/departments.service';

export interface ServiceItemList {
  serviceItemID: number;
  serviceItemCode: string;
  Description: string;
  Rate: any;
  totalVat: number;
  dateCreated: any;
}

export interface DepartmentList {
  departmentID: number;
  departmentName: string;
  dateUpdated: any;
  dateCreated: any;
  hasSubDepartment: boolean;
}

@Component({
  selector: 'app-service-items-config',
  templateUrl: './service-items-config.component.html',
  styleUrls: ['./service-items-config.component.css']
})



export class ServiceItemsConfigComponent implements OnInit {

  serviceItemCodeName = '';
  description = '';
  rate = '';
  category = '';
  total = '';
  serviceItemCodeNameV = '';
  descriptionV = '';
  rateV = '';
  categoryV = '';
  totalV = '';
  subDep = 0;
  selectedDep = 0;
  checked: boolean = false;
  selectDep = 0;
  isChecked: boolean;

  ServiceItemList: ServiceItemList[] = [];
  DepartmentList: DepartmentList[] = [];


  CurrentUser: any;
  stringifiedData: any;
  constructor(private modalService: NgbModal, private configService: ConfigService, private serviceItemService: ServiceItemService, private subDepartment: SubDepartmentsService, private departmentService: DepartmentsService) { }





  ngOnInit(): void {

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData); this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    this.getAllServiceItmes();
    this.getAllSubDepartments();
    this.subDep = 0;
    this.getServiceItemCodeName();
  }

  @ViewChild(MatTable) ServiceItemTable: MatTable<ServiceItemList> | undefined;

  displayedColumnsServiceItems: string[] = ['serviceItemCode', 'dateCreated', 'actions'];
  dataSourceServiceItems = this.ServiceItemList;


  createNewServiceModal(addServiceItem: any) {
    this.modalService.open(addServiceItem, { size: 'xl' });
  }


  getAllServiceItmes() {
    this.ServiceItemList.splice(0, this.ServiceItemList.length);

    this.serviceItemService.getAllServiceItem().subscribe((data: any) => {
      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempServiceItemList = {} as ServiceItemList;
          const current = data.dateSet[i];
          tempServiceItemList.serviceItemID = current.serviceItemID;
          tempServiceItemList.serviceItemCode = current.serviceItemCode;
          tempServiceItemList.Description = current.description;
          tempServiceItemList.Rate = current.rate;
          tempServiceItemList.totalVat = current.totalVat;
          tempServiceItemList.dateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf('T'));;
          this.ServiceItemList.push(tempServiceItemList);
        }
        this.ServiceItemTable?.renderRows();
      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
    this.ServiceItemTable?.renderRows();
  }
  
  onServiceItemCreate() {
    this.serviceItemService.addUpdateServiceItem(0, this.serviceItemCodeName, this.description, Number(this.rate), Number(this.total), this.CurrentUser.appUserId, this.category, this.hasVatt, this.selectDep).subscribe((data: any) => {

      if (data.responseCode == 1) {
        alert(data.responseMessage);

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempServiceItemList = {} as ServiceItemList;
          const current = data.dateSet[i];
          tempServiceItemList.serviceItemID = current.ServiceItemCode;
          tempServiceItemList.serviceItemCode = current.serviceItemCodeName;
          tempServiceItemList.Description = current.Description;
          tempServiceItemList.Rate = current.Rate;
          tempServiceItemList.totalVat = current.TotalVat;

          this.ServiceItemList.push(tempServiceItemList);
        
        

        }

        this.configService.addUpdateConfig(this.configID, null, null, (Number(this.configSICNumber) + 1).toString(), null, null, null).subscribe((data: any) => {
          if (data.responseCode == 1) {
            this.getServiceItemCodeName();
            this.resetServiceItem();
          }
          else {
            //alert("Invalid Email or Password");
            alert(data.responseMessage);
          }
          console.log("addUpdateConfigReponse", data);

        }, error => {
          console.log("addUpdateConfigError: ", error);
        })
      }
      else {
        alert(data.responseMessage);
      }
      console.log("responseAddapplication", data);
    }, error => {
      console.log("Error", error);
    })

    
  }
  openViewServiceItem(viewServiceItem:any, index:any) {
    this.modalService.open(viewServiceItem, { size: 'xl' });
    this.viewServiceItem(index);
  }

  public hasVatt: boolean = false;
  public addVatOption: boolean = true;
  public removeVatOption: boolean = false;

  hasVat() {
    this.hasVatt = true;
    this.addVatOption = false;
    this.removeVatOption = true;

  }
  hasNoVat() {
    this.hasVatt = false;
    this.addVatOption = true;
    this.removeVatOption = false;

  }
  resetHasVat() {
    this.hasVatt = false;
    this.addVatOption = true;
    this.removeVatOption = false;
  }


  getAllSubDepartments() {
    this.DepartmentList.splice(0, this.DepartmentList.length);
    this.departmentService.getDepartmentsList().subscribe((data: any) => {

      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDepartmentList = {} as DepartmentList;
          const current = data.dateSet[i];
          tempDepartmentList.departmentID = current.departmentID;
          tempDepartmentList.departmentName = current.departmentName;
          tempDepartmentList.dateUpdated = current.dateUpdated;
          tempDepartmentList.dateCreated = current.dateCreated;
          tempDepartmentList.hasSubDepartment = current.hasSubDepartment;
          this.DepartmentList.push(tempDepartmentList);

        }

        //this.DepartmentList = data.dateSet;


        console.log("DepartmentListh", this.DepartmentList);
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

  configSICNumber: any;
  configMonthYear: any;
  configID : number;
  getServiceItemCodeName() {
    this.configService.getConfigsByConfigName("ServiceItemCode").subscribe((data: any) => {
      if (data.responseCode == 1) {

        const current = data.dateSet[0];
        this.configSICNumber = current.utilitySlot1;
        this.configMonthYear = current.utilitySlot2;
        this.serviceItemCodeName = "SI:" + this.configSICNumber;
        this.configID = current.configID;


      }
      else {

        alert(data.responseMessage);
      }
      console.log("getConfigsByConfigNameReponse", data);

    }, error => {
      console.log("getConfigsByConfigNameError: ", error);
    })
  }

  resetServiceItem() {
    this.selectDep = undefined;
    this.description = "";
    this.rate = "";
    this.category = "";
    this.hasVatt = false;
    this.removeVatOption = false;
    this.addVatOption = true;
    this.total = "";
  }

  vatApp: boolean = false;
  vatApp2: boolean = false;
  depNameV = "";
  viewServiceItem(index: any) {
    this.serviceItemService.getServiceItemByServiceItemID(this.ServiceItemList[index].serviceItemID).subscribe((data: any) => {


      if (data.responseCode == 1) {

        const current = data.dateSet[0];
        this.serviceItemCodeNameV = current.serviceItemCode;
        this.selectedDep = current.departmentID;
        this.descriptionV = current.description;
        this.rateV = current.rate;
        this.categoryV = current.category;
        if (current.vatApplicable === true) {
          this.vatApp = true;
          this.vatApp2 = false;
          this.totalV = current.totalVat;
        }
        else {
          this.vatApp = false;
          this.vatApp2 = true;
        }
        console.log(current);

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
