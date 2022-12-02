import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApplicationsService } from 'src/app/service/Applications/applications.service';
import { FormBuilder, Validators } from '@angular/forms';
import { empty } from 'rxjs';
import { InternalOptionComponent } from 'src/app/create-new-wayleave/internal-option/internal-option.component';
import { ClientDetailsComponent } from '../../type-of-applicant/client-details/client-details.component';
import { ProjectDetailsComponent } from '../project-details/project-details.component';
import { SharedService } from "../../shared/shared.service";

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];
@Component({
  selector: 'app-new-wayleave',
  /*  templateUrl: './new-wayleave.component.html',*/
  templateUrl: './new-wayleave.component.html',
  styleUrls: ['./new-wayleave.component.css']
})
export class NewWayleaveComponent implements OnInit {

  public external: boolean = true;
  public internal: boolean = false;
  public client: boolean = false;
  public map: boolean = true;
    option: any;
    isAllSelected: any;

  public addApplication = this.formBuilder.group({
    newApplicationName: ['', Validators.required]

  })

  CurrentUser: any;
  stringifiedData: any;

  constructor(private modalService: NgbModal, private applicationsService: ApplicationsService, private shared: SharedService, public clientDetailsComponent: ClientDetailsComponent, public projectDetailsComponent: ProjectDetailsComponent, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData); this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
  }

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
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
    this.clientDetailsComponent.initClientDetails();
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
    //this.applicationsService.addUpdateApplication(0, 'test', this.shared.applicationData[0].clientName + ' ' + this.clientDetailsComponent.clientSurname, this.clientDetailsComponent.clientEmail, this.clientDetailsComponent.clientCellNo, this.clientDetailsComponent.clientAddress, this.clientDetailsComponent.clientRefNo, '0', this.projectDetailsComponent.typeOfApplication, this.projectDetailsComponent.notificationNumber, this.projectDetailsComponent.wbsNumber, this.projectDetailsComponent.physicalAddressOfProject, this.projectDetailsComponent.descriptionOfProject, this.projectDetailsComponent.natureOfWork, this.projectDetailsComponent.excavationType, this.projectDetailsComponent.expectedStartDate, this.projectDetailsComponent.expectedEndType, 'ven', 8).subscribe((data: any) => {

    //  if (data.responseCode == 1) {
    //    alert(data.responseMessage);
    //  }
    //  else {
    //    alert(data.responseMessage);
    //  }
    //  console.log("response", data);
    //}, error => {
    //  console.log("Error", error);
    //})
  }

}
