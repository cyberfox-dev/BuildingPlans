import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})



export class SharedService {
  configShow!: any;

  userProfileData: any;
  contactorData: any;
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

  setContactorData(data: any) {
    this.contactorData = data;
  }
  getContactorData() {
    return this.engineerData;
  }
  setEngineerData(data: any) {
    this.contactorData = data;
  }
  getEngineerData() {
    return this.engineerData;
  }
}
