import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApplicationsService } from 'src/app/service/Applications/applications.service';
import { FormBuilder, Validators } from '@angular/forms';
import { empty } from 'rxjs';
import { InternalOptionComponent } from 'src/app/create-new-wayleave/internal-option/internal-option.component';
import { SharedService } from "../../shared/shared.service";

export interface PeriodicElement {
  name: string;
  bp: string;
  surname: string;
  professionalRegNumber: string;


}



const ELEMENT_DATA: PeriodicElement[] = [
  { bp: 'fdf', name: 'FullName', surname: "", professionalRegNumber: 'H' },
  { bp: 'fdf', name: 'FullName', surname: "", professionalRegNumber: 'H' },
];

export interface PeriodicElements {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATAS: PeriodicElements[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },

];

@Component({
  selector: 'app-new-wayleave',
  templateUrl: './new-wayleave.component.html',
  styleUrls: ['./new-wayleave.component.css']
})
export class NewWayleaveComponent implements OnInit {

  /*Client details*/
  clientName = '';
  clientSurname = '';
  clientEmail = '';
  clientCellNo = '';
  clientAddress = '';
  clientRefNo = '';

  /*project details*/
  typeOfApplication = '';
  notificationNumber = '';
  wbsNumber = '';
  physicalAddressOfProject = '';
  descriptionOfProject = '';
  natureOfWork = '';
  excavationType = '';
  expectedStartDate: Date = new Date();
  expectedEndType: Date = new Date();

  //public addApplicationProject = this.formBuilder.group({
  //  typeOfApplication: ['', Validators.required],
  //  notificationNumber: ['', Validators.required],
  //  wbsNumber: ['', Validators.required],
  //  physicalAddressOfProject: ['', Validators.required],
  //  descriptionOfProject: ['', Validators.required],
  //  natureOfWork: ['', Validators.required],
  //  excavationType: ['', Validators.required],
  //  expectedStartDate: ['', Validators.required],
  //  expectedEndType: ['', Validators.required]
  //})


  public external: boolean = true;
  public internal: boolean = false;
  public client: boolean = false;
  public map: boolean = true;
    option: any;
    isAllSelected: any;

  //public addApplication = this.formBuilder.group({
  //  newApplicationName: ['', Validators.required]

  //})

  CurrentUser: any;
  stringifiedData: any;

  constructor(private modalService: NgbModal, private applicationsService: ApplicationsService, private shared: SharedService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData); this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
  }

  displayedColumns: string[] = ['bp', 'name', 'surname', 'professionalRegNumber'];
  dataSource = ELEMENT_DATA;
  clickedRows = new Set<PeriodicElement>();

  clearAll() {
    this.clickedRows.clear();
  }


  reciveOption($event: any) {
    this.option = $event
    if (this.option == "client") {
      this.client = true;
      this.external = false;
      this.map = false;
    }
    else if (this.option == "internal") {
      this.internal = true;
      this.external = false;
    }

  }

  onWayleaveCreate() {
/*    this.clientDetailsComponent.initClientDetails();*/

    //let newApplicationName = this.addApplication.controls["newApplicationName"].value;

    //let clientName1 = this.clientDetailsComponent.clientName;
    //let clientSurname = this.clientDetailsComponent.addApplicationClient.controls["clientSurname"].value;
    //let clientEmail = this.clientDetailsComponent.addApplicationClient.controls["clientEmail"].value;
    //let clientCellNo = this.clientDetailsComponent.addApplicationClient.controls["clientCellNo"].value;
    //let clientAddress = this.clientDetailsComponent.addApplicationClient.controls["clientAddress"].value;
    //let clientRefNo = this.clientDetailsComponent.addApplicationClient.controls["clientRefNo"].value;
    /*    getContactorData();*/
/*    this.shared.getContactorData();*/
/*    this.CurrentUser("appUserID")*/
    //ven: to access the clientDetailsComponent variable, we import it and add it to the constructor of this file.
    this.applicationsService.addUpdateApplication(0, this.CurrentUser.appUserId, this.clientName + ' ' + this.clientSurname, this.clientEmail, this.clientCellNo, this.clientAddress, this.clientRefNo, '0', this.typeOfApplication, this.notificationNumber, this.wbsNumber, this.physicalAddressOfProject, this.descriptionOfProject, this.natureOfWork, this.excavationType, this.expectedStartDate, this.expectedEndType, '10 Stella Road, Newholme, PMB, KZN', this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {
        alert(data.responseMessage);
      }
      else {
        alert(data.responseMessage);
      }
      console.log("response", data);
    }, error => {
      console.log("Error", error);
    })
  }


  displayedColumnss: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSources = ELEMENT_DATAS;
  clickedRowsS = new Set<PeriodicElements>();

  clearSAll() {
    this.clickedRowsS.clear();
  }
}
