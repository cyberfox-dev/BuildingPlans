import { Component, OnInit ,ViewChild} from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { BPServiceItemsService } from '../service/BPServiceItems/bpservice-items.service';
import { ConfigService } from '../service/Config/config.service';
import { BPFunctionalAreasService } from '../service/BPFunctionalAreas/bpfunctional-areas.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(private bpServiceItemService: BPServiceItemsService, private configService: ConfigService, private functionalAreaService: BPFunctionalAreasService, private modalService: NgbModal) { }

  serviceItemsList: ServiceItemsList[] = [];
  functionalAreaList: FunctionalAreaList[] = [];

  @ViewChild(MatTable) serviceItemsTable: MatTable<ServiceItemsList> | null;
  displayedColumns: string[] = ['ServiceItemCode','Rate','VatApplicable','actions'];
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
  ngOnInit(): void {
    this.getAllServiceItems();
    this.getAllFunctionalAreas();
  }

  openAddServiceItem(addService: any) {
    this.modalService.open(addService, { centered: true, size: 'xl' });
  }
  getAllServiceItems() {
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

  onGetServiceItemCode(addService:any) {
    this.configService.getConfigsByConfigName("ServiceItemCodeBP").subscribe((data: any) => {
      if (data.responseCode == 1) {

        const current = data.dateSet[0];
        this.oldConfigSINumber = current.utilitySlot1;
        this.newConfigSINumber = this.oldConfigSINumber + 1;
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
    if (this.total == 0) {
      this.total = this.rate;
    }
    this.bpServiceItemService.addUpdateServiceItem(this.serviceItemID, this.serviceItemCode, this.description, this.rate, this.total, this.category, this.functionalArea, "New DB", this.hasVat).subscribe((data: any) => {
      if (data.responseCode == 1) {

      }
      else {

      }
    }, error => {
      console.log(error);
    })
  }

  onHasVatChange() {
    debugger;
    if (this.hasVat == false) {
      this.hasVat = true;
      
      this.total = this.rate & 1.15;
      debugger;
    }
    else {
      this.hasVat = false;
      this.total = this.rate;
    }
  }
}
