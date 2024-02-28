import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "applications/";


  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }
  public addUpdateApplication(ApplicationID?: number | null, userID?: string | null, fullName?: string | null, email?: string | null,/*checkingNotifications Sindiswa 15 February 2024*/ alternativeEmail?: string | null, phoneNumber?: string | null, physicalAddress?: string | null, referenceNumber?: string | null, companyRegNo?: string | null, typeOfApplication?: string | null, notificationNumber?: string | null, wbsNumber?: string | null, physicalAddressOfProject?: string | null, descriptionOfProject?: string | null, natureOfWork?: string | null, excavationType?: string | null, expectedStartDate?: Date | null, expectedEndDate?: Date | null, location?: string | null, createdById?: string | null, previousStageName?: string | null, previousStageNumber?: number | null, currentStageName?: string | null, currentStageNumber?: number | null, nextStageName?: string | null, nextStageNumber?: number | null, applicationStatus?: string | null, isDrafted?: boolean, projectNumber?: string | null, isPlanning?: boolean | null, permitStartDate?: Date | null, datePaid?: Date | null, WBSRequired?: boolean | null, coordinates?: string | null ,networkLicenses?: boolean |null) {

    const body = {
      ApplicationID: ApplicationID,
      UserID: userID,
      FullName: fullName,
      Email: email,
      AlternativeEmail: alternativeEmail, //checkingNotifications Sindiswa 15 February 2024
      PhysicalAddress: physicalAddress,
      ReferenceNumber: referenceNumber,
      CompanyRegNo: companyRegNo,
      TypeOfApplication: typeOfApplication,
      NotificationNumber: notificationNumber,
      WBSNumber: wbsNumber,
      PhysicalAddressOfProject: physicalAddressOfProject,
      DescriptionOfProject: descriptionOfProject,
      NatureOfWork: natureOfWork,
      ExcavationType: excavationType,
      ExpectedStartDate: expectedStartDate,
      ExpectedEndDate: expectedEndDate,
      Location: location,
      PhoneNumber: phoneNumber,
      CreatedById: createdById,
      PreviousStageName: previousStageName,
      PreviousStageNumber: previousStageNumber,
      CurrentStageName: currentStageName,
      CurrentStageNumber: currentStageNumber,
      NextStageName: nextStageName,
      NextStageNumber: nextStageNumber,
      ApplicationStatus: applicationStatus,
      ProjectNumber: projectNumber,
      isPlanning: isPlanning,
      PermitStartDate: permitStartDate,
      DatePaid: datePaid,
      WBSRequired: WBSRequired,
      Coordinates: coordinates,
      NetworkLicense:networkLicenses
  
    }
    return this.httpClient.post(this.baseURL + "AddUpdateApplication", body);

  }


  public updateApplicationStage(ApplicationID?: number | null, previousStageName?: string | null, previousStageNumber?: number | null, currentStageName?: string | null, currentStageNumber?: number | null, nextStageName?: string | null, nextStageNumber?: number | null, applicationStatus?: string | null, projectNumber?:string | null) {
    
    const body = {
      ApplicationID: ApplicationID,
      PreviousStageName: previousStageName,
      PreviousStageNumber: previousStageNumber,
      CurrentStageName: currentStageName,
      CurrentStageNumber: currentStageNumber,
      NextStageName: nextStageName,
      NextStageNumber: nextStageNumber,
      ApplicationStatus: applicationStatus,
      ProjectNumber: projectNumber
    }
    return this.httpClient.post(this.baseURL + "UpdateApplicationStage", body);

  }




  public deleteApplication(applicationID: number) {

    return this.httpClient.post(this.baseURL + "DeleteApplication", applicationID);

  }

  public getApplicationsByApplicationID(applicationID: number) {
 
    return this.httpClient.post(this.baseURL + "GetApplicationsByApplicationID", applicationID);

  }

  public getApplicationsList(userID: string, isInternal: boolean) {
    const body = {
      UserID: userID,
      isInternal: isInternal
    }
    return this.httpClient.post(this.baseURL + "GetApplicationsList", body);

  }

  /*this if for getting all applications that have been saved as a draft*/
  public getAllDraftedApplications(userID: string, isInternal: boolean, isDrafted: boolean) {
    const body = {
      UserID: userID,
      isInternal: isInternal,
      isDrafted: isDrafted
    }
    return this.httpClient.post(this.baseURL + "GetAllDraftedApplications", body);

  }

  /*Get all the applications that share a ProjectNumber (an application is assigned a ProjectNumber once it is paid for)*/
  public getApplicationsByProjectNumber(ProjectNumber: string) {
  
    const body = {
      ProjectNumber: ProjectNumber
      }
    return this.httpClient.post(this.baseURL + "GetApplicationsByProjectNumber", body);

  }
  public getApplicationsForReviewer(ZoneID: number, UserID: string){
    const body = {
      ZoneID: ZoneID,
      UserID: UserID
    };
    return this.httpClient.post(this.baseURL + "GetApplicationsForReviewer", body);
  }

  public getApplicationsForDepAdmin(ZoneID: number, UserID: string) {
    const body = {
      ZoneID: ZoneID,
      UserID: UserID
    };
    return this.httpClient.post(this.baseURL + "GetApplicationsForDepAdmin", body);
  }
  public getApplicationsForFinalReview(ZoneID: number, UserID: string) {
    const body = {
      ZoneID: ZoneID,
      UserID: UserID
    };
    return this.httpClient.post(this.baseURL + "GetApplicationsForFinalReview", body);
  }

  //JJS TODO: getting all applications for EMB so that the projects appear for them in my reviews

  public getApplicationsForEMB(UserID: string) {
    const body = {
      UserID: UserID
    };
    return this.httpClient.post(this.baseURL + "GetApplicationsForEMB", body);
  }

  public getApplicationsForDepartment(ZoneID: number, SubDepartmentID: number) {
    const body = {
      ZoneID: ZoneID,
      SubDepartmentID: SubDepartmentID
    };
    return this.httpClient.post(this.baseURL + "GetApplicationsForDepartment", body);
  }

  // reapply Sindiswa 24 January 2024
  public increaseReapplyCount(ProjectNumber: string) {
    
    const body = {
      ProjectNumber: ProjectNumber
    }
    return this.httpClient.post(this.baseURL + "IncreaseReapplyCount", body);
  }
  // reapply Sindiswa 25 January 2024
  public makeOldAppDisappear(ProjectNumber: string) {
    
    const body = {
      ProjectNumber: ProjectNumber
    }
    return this.httpClient.post(this.baseURL + "DeActivateOldAppsAfterReapply", body);
  }
  //reapply Sindiswa 26 January 2024
  public getApplicationsByProjectNumberRA(ProjectNumber: string) {

    const body = {
      ProjectNumber: ProjectNumber
    }
    return this.httpClient.post(this.baseURL + "GetApplicationsByProjectNumberRA", body);

  }
  //escalation Sindiswa 29 January 2024
  public escalateApplication(applicationID?: number | null) {
    const body = {
      ApplicationID: applicationID,
    }
    return this.httpClient.post(this.baseURL + "EscalateApplication", body);

  }
  //escalation Sindiswa 30 January 2024
  public cancelEscalation(applicationID?: number | null) {
    const body = {
      ApplicationID: applicationID,
    }
    return this.httpClient.post(this.baseURL + "CancelEscalation", body);

  }
}
