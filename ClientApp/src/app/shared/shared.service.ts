import { Injectable } from '@angular/core';


export interface ContractorList {

  ProfessinalType: string;
  professionalRegNo: string;
  bpNumber: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber?: number;
  CIBRating: string;
  idNumber?: string;

}

export interface ApplicationList {

  clientName: string,
  clientEmail: string,
  clientAddress: string,
  clientRefNo: string,
  CompanyRegNo: string,
  TypeOfApplication: string,
  NotificationNumber: string,
  WBSNumber: string,
  PhysicalAddressOfProject: string,
  DescriptionOfProject: string,
  NatureOfWork: string,
  ExcavationType: string,
  ExpectedStartDate: Date,
  ExpectedEndDate: Date,
  Location: string,
  clientCellNo: string,
  CreatedById: number,

}

@Injectable({
  providedIn: 'root'
})




export class SharedService {



  configShow!: any;

  userProfileData: any;
  contactorData: ContractorList[] = [];
  applicationData: ApplicationList[] = [];
  engineerData: any;

  constructor() { }
 setConfigShow(data:any){
  this.configShow=data
 }
 getConfigShow(){
  return this.configShow;
  }


  setUserProfileData(data: any) {
    this.userProfileData = data;
  }
  getUserProfileData() {
    return this.userProfileData;
  }

  setContactorData(data: ContractorList[]) {
    debugger;
    this.contactorData = data;
  }
  getContactorDataByIndex(index: number) {
    return this.contactorData[index];
  }
  getContactorData() {
    debugger;
    return this.contactorData;
  }
  setEngineerData(data: any) {
    this.contactorData = data;
  }
  getEngineerData() {
    return this.engineerData;
  }

  setApplicationData(data: ApplicationList[]) {
    debugger;
    this.applicationData = data;
  }

}
