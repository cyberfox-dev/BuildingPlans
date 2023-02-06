import { Injectable } from '@angular/core';


export interface FileDocument {

  formData: any;
  UploadFor: string;
}


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

export interface StagesList {
  StageID: number;
  StageName: string;
  StageOrderNumber: number;
  CurrentUser: any

}

export interface ApplicationList {
  applicationID: number,
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
  ApplicationStatus: string,
  CurrentStageName: string,
  CurrentStageNumber: number,
  CurrentStageStartDate: Date,
  NextStageName: string,
  NextStageNumber: number,
  PreviousStageName: string,
  PreviousStageNumber: number,
}

@Injectable({
  providedIn: 'root'
})

 


export class SharedService {

  checkEmail!: string;

  configShow!: any;

  userProfileData: any;
  FileDocument: FileDocument[] = [];
  contactorData: ProfessionalList[] = [];
  applicationData: ApplicationList[] = [];
  applicationDataForView: ApplicationList[] = [];
  engineerData: ProfessionalList[] = [];
  StagesList: StagesList[] = [];

  constructor() { }

  setCheckEmail(data:any) {
    this.checkEmail = data;
    console.log("Set method" + this.checkEmail);
  }
  getCheckEmail() {
    return this.checkEmail;
  }


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

  setStageData(data: any) {
    
    this.StagesList = data;

  }

  getStageData() {
    return this.StagesList;
  }


  setContactorData(data: any) {
   
   // this.contactorData.splice(0, this.contactorData.length);
    
/*        this.contactorData.splice(0, this.contactorData.length);*/
    this.contactorData = data;

    console.log("Shared this.contactorData ", this.contactorData);
  }
  getContactorDataByIndex(index: number) {
    return this.contactorData[index];
  }
  getContactorData() {
 
    return this.contactorData;
  }
  setEngineerData(data: any) {
 //   this.engineerData.splice(0, this.engineerData.length);
    this.engineerData = data;
    console.log("Shared this.engineerData ", this.engineerData);
  }

  getEngineerDataByIndex(index: number) {
    return this.engineerData[index];
  }

  getEngineerData() {
    return this.engineerData;
  }

  setApplicationData(data: ApplicationList[]) {
    
    this.applicationData = data;
  }

  setViewApplicationIndex(ApplicationList: ApplicationList[]) {
    this.applicationDataForView = ApplicationList;
    console.log("THIS IS THE LIST", this.applicationDataForView);
  }
  getViewApplicationIndex() {
    return this.applicationDataForView[0];
  }



  pushFileForTempFileUpload(formData: any, uploadFor: any) {

    //TODO: Remember to clear this when invoice is generated
    for (var i = 0; i < this.FileDocument.length; i++) {
      if (this.FileDocument[i].UploadFor == uploadFor) {
        this.FileDocument[i].UploadFor = uploadFor;
        this.FileDocument[i].formData = formData;
      } else {
        this.FileDocument.push(formData, uploadFor);
      }  
    }
  }

  pullFilesForUpload() {
    return this.FileDocument;
  }

}
