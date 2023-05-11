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
  ProjectNumber: string
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

  ProjectNumber: string = "Ven123";

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

  getApiUrl() {
        return "https://localhost:7123/api/";
    /*    return "http://172.29.166.10/api/";*/
/*    return "https://wayleavesQA.capetown.gov.za/api/";*/

    //this is the original ip address for venolin :)
  /*  return "https://197.242.150.226:7123/api/";*/
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

  clearEngineerData() {
    this.engineerData.splice(0, this.engineerData.length);
  }

  clearContractorData() {
    this.contactorData.splice(0, this.contactorData.length);
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

  //ESRI DATA BEGIN
  esriAddress!: string;
  applicationID!: number;
  createdByID!: string;

  setAddressData(data: any) {
    this.esriAddress = data;
  }

  getAddressData() {
    return this.esriAddress;
  }

  //Using NotificationNumber for now, until the ApplicationID is created
setApplicationID(data: any) {
    this.applicationID = data;
    console.log("setting ..." + this.applicationID);
  }

getApplicationID(): any {
    console.log("getting ..." + this.applicationID);
    return this.applicationID;
  }

  setCreatedByID(data: any) {
    console.log("setting ..." + this.applicationID);
    this.applicationID = data;
  }

  getCreatedByID() {
    console.log("getting ..." + this.applicationID);
    return this.applicationID;
  }
  //ESRI Data END

  pushFileForTempFileUpload(formData: any, uploadFor: any) {

    //TODO: Remember to clear this when invoice is generated
  
    if (this.FileDocument.length != 0) {
      for (var i = 0; i < this.FileDocument.length; i++) {
        if (this.FileDocument[i].UploadFor == uploadFor) {
          this.FileDocument[i].UploadFor = uploadFor;
          this.FileDocument[i].formData = formData;

          console.log("return this.FileDocument;", this.FileDocument);
        } else {
          const tempFileDocument = {} as FileDocument;
          tempFileDocument.formData = formData;
          tempFileDocument.UploadFor = uploadFor;
          this.FileDocument.push(tempFileDocument);
          console.log("return this.FileDocument;", this.FileDocument);
        }
      }
    } else {
      const tempFileDocument = {} as FileDocument;
      tempFileDocument.formData = formData;
      tempFileDocument.UploadFor = uploadFor;

      this.FileDocument.push(tempFileDocument);
    }
    
  }

  pullFilesForUpload() {
    return this.FileDocument;
  }

  setProjectNumber(data: any) {

    this.ProjectNumber = data;

  }

  getProjectNumber() {
    return this.ProjectNumber;
  }


}
