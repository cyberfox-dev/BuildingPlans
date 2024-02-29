import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

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
  Coordinates: string,
  userID: string
  //Coordinates: string
    UserID: any;
  clientAlternativeEmail: string; // checkingNotifications Sindiswa 15 February 2024
  NetworkLicensees: string; //Project size Kyle 27-02-24
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
  glCode: string;
  profitCenter: string;
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
  alternativeEmail: string; // chekingNotifications Sindiswa 13 February 2024
}

export interface ConfigList {
  configID: number,
  configName: string,
  configDescription: string,
  dateCreated: Date,
  dateUpdated: Date,
  createdById: string,
  isActive: boolean,
  utilitySlot1: string,
  utilitySlot2: string,
  utilitySlot3: string,
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

  //#region reapply Sindisiswa 26 January 2024
  oldApplicationID: number; //used when reapplying
  showFormerApps: boolean = true;
  fromReApplyArchive: boolean = false;
  routerSubscription: Subscription;
  //#endregion

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
  public AllConfig: ConfigList[] = [];

  ProjectNumber: string;
  canReapply: any = false;
  reapply: boolean = false;
  userRoles = '';
  public totalAddedFeatures: number = 0;
  public APIURL: string;
  public ServerType: string;

  RepFileUploadSubName?: any | null;
  RepFileUploadSubID?: any | null;
  RepFileUploadCat?: any | null;
    userIDForWalkIn: any;
  isDraft: boolean;

  isEscalated: boolean;
  EMBLoggedIn: boolean = false;
  //Audit Trail Kyle
  isReports: boolean = false;
  isViewReport: boolean = false;
  auditTrail: boolean = false;
  //Audit Trail Kyle


  // #region reapply Sindisiswa 26 January 2024
  setShowFormerApps(data: any) {
    this.showFormerApps = data;
  }
  getShowFormerApps() {
    return this.showFormerApps;
  }
  setFromReApplyArchive(data: any) {
    this.fromReApplyArchive = data;
  }
  getFromReApplyArchive() {
    return this.fromReApplyArchive;
  }
  setRoutingToOldAapp(data:any) {
    this.routerSubscription = data;
  }
  getRoutingToOldAapp() {
    return this.routerSubscription;
  }
  // #endregion
  // #region escalation Sindiswa 29 January 2024
  setIsEscalated(data: any) {
    this.isEscalated = data;
  }
  getIsEscalatedDeets() {
    return this.isEscalated;
  }
  // #endregion
  // #region escalation Sindiswa 30 January 2024
  setIsEMBUser(data: any) {
    this.EMBLoggedIn = data;
  }
  getIsEMBUser() {
    return this.EMBLoggedIn;
  }
  // #endregion

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

  setAllConfig(data: any) {

    this.AllConfig = data;

  }

  getAllConfig() {
    return this.AllConfig;
  }

  getApiUrl() {
    let baseUrl = window.location.origin; // Get the base URL of the server

    if (baseUrl == 'https://localhost:44440') { //Dev environment fix. If these ports ever change, change here too.
      baseUrl = 'https://localhost:7123'
    } else {
      //Do nothing
    };

    this.APIURL = baseUrl;

    return this.APIURL;
/*      return "https://localhost:7123";*/
    /*    return "http://172.29.166.10/api/";*/
/*        return "https://wayleaveqa.capetown.gov.za"; */
/*        return "https://wayleave.capetown.gov.za"; */
    //this is the original ip address for venolin :)
    /*  return "https://197.242.150.226:7123/api/";*/
  }

  setServerType(data: any) {
    this.ServerType = data;
  }

  getServerType() {
    return this.ServerType;
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
  // #region reapply Sindiswa 24 January 2024
  setOldApplicationID(data: any) {
    this.oldApplicationID = data;
  }
  getOldApplicationID() {
   return this.oldApplicationID;
  }
  // #endregion

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

  // #region selectedProfessionals and notifications Sindiswa 12 February 2024
  isSelectedEngineer: boolean;
  isSelectedContractor: boolean;

  setCanGoNextAfterEngineerSelection(data) {
    this.isSelectedEngineer = data;
  }

  setCanGoNextAfterContractorSelection(data) {
    this.isSelectedContractor = data;
  }

  getCanGoNextE() {
    return this.isSelectedEngineer;
  }

  getCanGoNextC() {
    return this.isSelectedContractor;
  }

  hasNotifications: boolean;
  notificationsQuantity: number;
  sethasNotifications(data) {
    this.hasNotifications = data;
  }
  getHasNotifications() {
    return this.hasNotifications;
  }
  setNotificationsQuantity(data) {
    this.notificationsQuantity = data;
  }
  getNotificationsQuantity() {
    return this.notificationsQuantity
  }
  // #endregion
}
