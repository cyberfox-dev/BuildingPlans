import { Injectable } from '@angular/core';


export interface ProfessionalList {
  professinalID: number;
  ProfessinalType: string;
  professionalRegNo: string;
  bpNumber: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber?: number;
  idNumber?: string;
  CIBRating: string | null;

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
  contactorData: ProfessionalList[] = [];
  applicationData: ApplicationList[] = [];
  engineerData: ProfessionalList[] = [];

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

  setContactorData(data: any) {
    debugger;
/*        this.contactorData.splice(0, this.contactorData.length);*/
    this.contactorData = data;

    console.log("Shared this.contactorData ", this.contactorData);
  }
  getContactorDataByIndex(index: number) {
    return this.contactorData[index];
  }
  getContactorData() {
    debugger;
    return this.contactorData;
  }
  setEngineerData(data: any) {
 //   this.engineerData.splice(0, this.engineerData.length);
    this.engineerData = data;
    console.log("Shared this.engineerData ", this.engineerData);
  }
  getEngineerData() {
    return this.engineerData;
  }

  setApplicationData(data: ApplicationList[]) {
    debugger;
    this.applicationData = data;
  }

}
