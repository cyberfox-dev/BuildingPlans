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

@Injectable({
  providedIn: 'root'
})




export class SharedService {



  configShow!: any;

  userProfileData: any;
  contactorData: ContractorList[] =[];
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
}
