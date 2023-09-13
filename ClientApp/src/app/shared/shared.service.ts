import { Injectable } from '@angular/core';


export interface FileDocument {
  fileName: string;

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
  ProjectNumber: string,
  isPlanning?: boolean,
  permitStartDate: Date,
  DatePaid: Date;
  wbsrequired: boolean;
  Coordinates: string
}


export interface RolesList {
  RoleID: number;
  RoleName: string;
  //RoleType: string;
  //RoleDescription: string;
}

export interface SubDepartmentList {
  subDepartmentID: number;
  subDepartmentName: string;
  mapLayerID: number;
  departmentID: number;
  dateUpdated: any;
  dateCreated: any;
  isSetForAutomaticDistribution: boolean;
}

export interface DistributionList {

  directorate: string;
  email: string;
  fullName: string;
  mapObjectID: number;
  subDepartmentID: number;
  subDepartmentName: string;
  userID: string;
  zoneID: number;
  zoneName: string;

}

export interface ConfigList {
  ConfigID: number,
  ConfigName: string,
  ConfigDescription: string,
  DateCreated: Date,
  DateUpdated: Date,
  CreatedById: string,
  isActive: boolean,
  UtilitySlot1: string,
  UtilitySlot2: string,
  UtilitySlot3: string,
}

@Injectable({
  providedIn: 'root'
})

export class SharedService {

  checkEmail!: string;

  configShow!: any;
  option: string;
  newUserProfileBp: any;

  //this is for if an internal user is applying for a client 
  clientUserID?: string | null;
  errorForRegister?: boolean;
  clientEmailAdress?: string | null;

  userProfileData: any;
  FileDocument: FileDocument[] = [];
  contactorData: ProfessionalList[] = [];
  applicationData: ApplicationList[] = [];
  applicationDataForView: ApplicationList[] = [];
  engineerData: ProfessionalList[] = [];
  StagesList: StagesList[] = [];
  RolesList: RolesList[] = [];
  subDepartmentList: SubDepartmentList[] = [];
  distributionList: DistributionList[] = [];
  public MapConfig: ConfigList[] = [];

  ProjectNumber: string;
  canReapply: any = false;
  reapply: boolean = false;
  userRoles = '';
  public totalAddedFeatures: number = 0;

  RepFileUploadSubName?: any | null;
  RepFileUploadSubID?: any | null;
  RepFileUploadCat?: any | null;

  constructor() { }

  setCheckEmail(data: any) {
    this.checkEmail = data;
    console.log("Set method" + this.checkEmail);
  }
  getCheckEmail() {
    return this.checkEmail;
  }


  setConfigShow(data: any) {
    this.configShow = data;
  }
  getConfigShow() {
    return this.configShow;
  }

  setCurrentUserRole(data: any) {
    this.RolesList = data;
  }

  getCurrentUserRoles() {
    return this.RolesList;
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

  setMapConfig(data: any) {

    this.MapConfig = data;

  }

  getMapConfig() {
    return this.MapConfig;
  }

  getApiUrl() {
      return "https://localhost:7123/api/";
    /*    return "http://172.29.166.10/api/";*/
/*        return "https://wayleaveqa.capetown.gov.za/api/"; */
    /*    return "https://wayleave.capetown.gov.za/api/"; */
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
  coordinates!: string;

  setAddressData(data: any) {
    this.esriAddress = data;
  }

  getAddressData() {
    return this.esriAddress;
  }

  setCoordinateData(data: any) {
    this.coordinates = data;
  }

  getCoordinateData() {
    return this.coordinates;
  }

  //Using NotificationNumber for now, until the ApplicationID is created
  setApplicationID(data: any) {

    this.applicationID = data;
    console.log("setting ..." + this.applicationID);
  }

  getApplicationID(): any {
    console.log("getting ..." + this.applicationID);
    if (this.applicationID == undefined || this.applicationID == null) {
      this.applicationID = 0;
    }
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


  DeleteUploadedFile() {

    this.FileDocument.splice(0, this.FileDocument.length);

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

  setCanReapply(data: boolean) {

    this.canReapply = data;

  }

  getCanReapply() {
    return this.canReapply;
  }

  setReapply(data: any) {
    this.reapply = data; //application type refers to whether it is a brand new application or if it is a reapply.
  }

  getReapply() {
    return this.reapply; //application type refers to whether it is a brand new application or if it is a reapply.
  }

  getUserRoles() {
    return this.userRoles;
  }

  setUserRoles(data: any) {
    this.userRoles = data;
  }
}
