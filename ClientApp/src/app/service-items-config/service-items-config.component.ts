import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


export interface ServiceItemList {
  serviceItemID: number;
  serviceItemCode: string;
  Description: string;
  Rate: any;
  totalVat: number;
}

@Component({
  selector: 'app-service-items-config',
  templateUrl: './service-items-config.component.html',
  styleUrls: ['./service-items-config.component.css']
})



export class ServiceItemsConfigComponent implements OnInit {

  ServiceItemList: ServiceItemList[] = [];

  CurrentUser: any;
  stringifiedData: any;
  constructor(private modalService: NgbModal,) { }

  serviceItemCode = '';
  description = '';
  rate = '';
  quantity = '';
  total = '';
  checked: boolean = false;



  ngOnInit(): void {

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData); this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
  }

  @ViewChild(MatTable) ServiceItemTable: MatTable<ServiceItemList> | undefined;

  displayedColumnsServiceItems: string[] = ['serviceItemCode', 'dateCreated', 'actions'];
  dataSourceServiceItems = this.ServiceItemList;


  createNewServiceModal(addServiceItem: any) {
    this.modalService.open(addServiceItem, { size: 'xl' });
  }

}
