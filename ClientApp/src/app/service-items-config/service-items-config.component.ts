import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ServiceItemService  } from 'src/app/service/ServiceItems/service-item.service';


export interface ServiceItemList {
  serviceItemID: number;
  serviceItemCode: string;
  Description: string;
  Rate: any;
  totalVat: number;
  dateCreated: any;
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
  quantity = '';
  total = '';
  checked: boolean = false;


  ServiceItemList: ServiceItemList[] = [];
  
  CurrentUser: any;
  stringifiedData: any;
  constructor(private modalService: NgbModal,private serviceItemService: ServiceItemService) { }





  ngOnInit(): void {

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData); this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    this.getAllServiceItmes();
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
    ;
    this.serviceItemService.addUpdateServiceItem(0, this.serviceItemCodeName, this.description, Number(this.rate), Number(this.total),this.CurrentUser.appUserId).subscribe((data: any) => {

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

      }
      else {
        alert(data.responseMessage);
      }
      console.log("responseAddapplication", data);
    }, error => {
      console.log("Error", error);
    })
    
  }





}
