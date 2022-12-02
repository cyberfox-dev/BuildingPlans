import { Component, Injectable, OnInit, ViewChild } from '@angular/core'; 
import { FormBuilder, Validators } from '@angular/forms';
import { SharedService } from "../../shared/shared.service";

//export interface ClientDetailsList {
//  ClientEmail: string;
//  clientCellNo: string;
//  clientAddress: string;
//  clientRefNo: string;
//  ClientName: string;
////-------------------------------------
//  CompanyRegNo: string,
//  TypeOfApplication: string,
//  NotificationNumber: string,
//  WBSNumber: string,
//  PhysicalAddressOfProject: string,
//  DescriptionOfProject: string,
//  NatureOfWork: string,
//  ExcavationType: string,
//  ExpectedStartDate: Date,
//  ExpectedEndDate: Date,
//  Location: string,

//  CreatedById: number,
//}

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css']
})

@Injectable({ providedIn: 'root' })
export class ClientDetailsComponent implements OnInit {

/*  tempClientDetailsList: ClientDetailsList[] = [];*/
  //clientName = '';
  //clientSurname = '';
  //clientEmail = '';
  //clientCellNo = '';
  //clientAddress = '';
  //clientRefNo = '';

/*  @Input() clientName= 'testes';*/
/*  @Input() clientSurname: any;*/
  //@Input() clientEmail: any;
  //@Input() clientCellNo: any;
  //@Input() clientAddress: any;
  //@Input() clientRefNo: any;
  constructor(private formBuilder: FormBuilder, private shared: SharedService) { }


  //public addApplicationClient = this.formBuilder.group({
  //  clientName: ['', Validators.required]
  //})

  public addApplicationClient = this.formBuilder.group({
    clientNameAdd: ['', Validators.required],
    clientSurnameAdd: ['', Validators.required],
    clientEmailAdd: ['', Validators.required],
    clientCellNoAdd: ['', Validators.required],
    clientAddressAdd: ['', Validators.required],
    clientRefNoAdd: ['', Validators.required]
  })

  ngOnInit(): void {

  }

  public initClientDetails() {
    debugger;
/*    let newStageName = this.addStage.controls["newStageName"].value;*/
    let clientName = this.addApplicationClient.controls["clientNameAdd"].value;
    let clientSurname = this.addApplicationClient.controls["clientSurnameAdd"].value;
    let clientEmail = this.addApplicationClient.controls["clientEmailAdd"].value;
    let clientCellNo = this.addApplicationClient.controls["clientCellNoAdd"].value;
    let clientAddress = this.addApplicationClient.controls["clientAddressAdd"].value;
    let clientRefNo = this.addApplicationClient.controls["clientRefNoAdd"].value;
/*    this.tempClientDetailsList[0].clientName = this.clientName*/

/*    this.shared.setApplicationData(this.tempClientDetailsList)*/
  }


}
