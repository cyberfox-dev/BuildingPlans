import { Component, OnInit ,ViewChild} from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { BPServiceItemsService } from '../service/BPServiceItems/bpservice-items.service';
import { ConfigService } from '../service/Config/config.service';
import { BPFunctionalAreasService } from '../service/BPFunctionalAreas/bpfunctional-areas.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { BpAlertModalComponent } from '../bp-alert-modal/bp-alert-modal.component'; //BPDialogBoxes Sindiswa 24062024
import { MatDialog } from '@angular/material/dialog';
export interface ServiceItemsList {
  ServiceItemID: number;
  ServiceItemCode: string;
  Description: string;
  Rate: number;
  TotalVat: number;
  Category: string;
  FunctionalArea: string;
  VatApplicable: boolean;
  Remarks: string;
  
}

export interface FunctionalAreaList {
  FunctionalAreaID: number;
  FAName: string;
}
@Component({
  selector: 'app-bpservice-items',
  templateUrl: './bpservice-items.component.html',
  styleUrls: ['./bpservice-items.component.css']
})
export class BPServiceItemsComponent implements OnInit {

  constructor(private bpServiceItemService: BPServiceItemsService, private configService: ConfigService, private functionalAreaService: BPFunctionalAreasService, private modalService: NgbModal, private dialog: MatDialog) { }

  serviceItemsList: ServiceItemsList[] = [];
  functionalAreaList: FunctionalAreaList[] = [];

  @ViewChild(MatTable) serviceItemsTable: MatTable<ServiceItemsList> | null;
  displayedColumns: string[] = ['ServiceItemCode','Description', 'Rate', 'actions'];
  dataSource = this.serviceItemsList;

  serviceItemID: number = 0;
  serviceItemCode: string;
  functionalArea: string;
  description: string;
  remarks: string;
  rate: number;
  category: string;
  total: number;
  hasVat: boolean = false;

  configID: number;
  oldConfigSINumber: number;
  newConfigSINumber: number;
  yearMonth = '06/25';

  selectedServiceItem: any;

  isEdit: boolean = false;
  ngOnInit(): void {
    this.getAllServiceItems();
    this.getAllFunctionalAreas();
  }

  openAddServiceItem(addService: any) {
    this.modalService.open(addService, { centered: true, size: 'xl' });
  }
  getAllServiceItems() {
    this.serviceItemsList.splice(0, this.serviceItemsList.length);
    this.bpServiceItemService.getAllServiceItems().subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempServiceItem = {} as ServiceItemsList;

          tempServiceItem.ServiceItemID = current.serviceItemID;
          tempServiceItem.ServiceItemCode = current.serviceItemCode;
          tempServiceItem.Description = current.description;
          tempServiceItem.Rate = current.rate;
          tempServiceItem.TotalVat = current.totalVat;
          tempServiceItem.Category = current.category;
          tempServiceItem.FunctionalArea = current.functionalArea;
          tempServiceItem.VatApplicable = current.vatApplicable;
          tempServiceItem.Remarks = current.remarks;

          this.serviceItemsList.push(tempServiceItem);
        }
        this.dataSource = this.serviceItemsList;
        this.serviceItemsTable?.renderRows();

      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log(error);

    })
  }

  getAllFunctionalAreas() {
    this.functionalAreaService.getAllFunctionalAreas().subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempFunctionalArea = {} as FunctionalAreaList;

          tempFunctionalArea.FunctionalAreaID = current.functionalAreaID;
          tempFunctionalArea.FAName = current.faName;

          this.functionalAreaList.push(tempFunctionalArea);
        }
      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log(error);
    })
  }

  onGetServiceItemCode(addService: any) {
    this.configService.getConfigsByConfigName("ServiceItemCodeBP").subscribe((data: any) => {
      if (data.responseCode == 1) {

        const current = data.dateSet[0];
        this.oldConfigSINumber = current.utilitySlot1;
        this.newConfigSINumber = Number(this.oldConfigSINumber)+ 1;
        this.serviceItemCode = "SI : " + this.newConfigSINumber;
        this.configID = current.configID;
        this.openAddServiceItem(addService);
      }
      else {

      }
    }, error => {
      console.log(error);
    })
  }

  onAddUpdateServiceItem() {
    debugger;
    if (this.functionalArea == undefined || this.rate == 0) {
      alert("Please fill in all requured areas");
    }
    else {
      if (this.total == 0) {
        this.total = this.rate;
      }
      debugger;
      this.bpServiceItemService.addUpdateServiceItem(this.serviceItemID, this.serviceItemCode, this.description, this.rate, this.total, this.category, this.functionalArea, "New DB", this.hasVat,this.remarks).subscribe((data: any) => {
        if (data.responseCode == 1) {
          if (this.isEdit == true) {
            this.modalService.dismissAll();
            alert(data.responseMessage);
          }
          else {
            this.onUpdateConfig();
          }
        }
        else {
          const dialogRef = this.dialog.open(BpAlertModalComponent, {
            data: {
              message: data.responseMessage
            }
          });
        }
      }, error => {
        console.log(error);
      })
    }

  }

  onHasVatChange() {
    debugger;
    if (this.hasVat == false) {
      this.hasVat = true;

     
    }
    else {
      this.hasVat = false;
      
    }
  }

  onUpdateConfig() {
    this.configService.addUpdateConfig(this.configID, null, null, this.newConfigSINumber.toString(), null, null, null).subscribe((data: any) => {
      if (data.responseCode == 1) {
        this.modalService.dismissAll();
        this.getAllServiceItems();
        alert("Service Item added successfully");

      }
      else {
        alert(data.responseMessage);
      }

    }, error => {
      console.log(error);
    })
  }

  onEditServiceItem(index: any,addService:any) {
    const serviceItemID = this.serviceItemsList[index].ServiceItemID;
    this.isEdit = true;


    this.bpServiceItemService.getServiceItemByServiceItemID(serviceItemID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        const current = data.dateSet[0];
        debugger;
        this.serviceItemID = current.serviceItemID;
        this.serviceItemCode = current.serviceItemCode;
        this.description = current.description;
        this.rate = current.rate;
        this.total = current.totalVat;
        this.category = current.category;
        this.functionalArea = current.functionalArea;
        this.hasVat = current.vatApplicable;

        this.openAddServiceItem(addService);
      }
      else {
        alert(data.responseCode);

      }
    }, error => {
      console.log(error);
    })
  }

  onRateChange(event: Event) {
    this.total = this.rate * 1.15;
  }

  DeleteServiceItem(index: any) {
    const serviceItemID = this.serviceItemsList[index].ServiceItemID;
    if (confirm("Are you sure you want to delete this service item?")) {
      this.bpServiceItemService.deleteServiceItemByServiceItemID(serviceItemID).subscribe((data: any) => {
        if (data.responsCode == 1) {
          const dialogRef = this.dialog.open(BpAlertModalComponent, {
            data: {
              message: data.responseMessage
            }
          });
          this.getAllServiceItems();
        }
        else {
          const dialogRef = this.dialog.open(BpAlertModalComponent, {
            data: {
              message: data.responseMessage
            }
          });
        }
      }, error => {
        console.log(error);
      })
    }
    else {
      return;
    }
  }
}
