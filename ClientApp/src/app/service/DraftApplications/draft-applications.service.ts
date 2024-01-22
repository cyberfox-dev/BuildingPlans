import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class DraftApplicationsService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "draftApplications/";
  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateDraftApplication(draftID: number | null, applicationID: number | null, userID: string | null, fullName: string | null, email: string | null, phoneNumber: string | null, physicalAddress: string | null, referenceNumber: string | null, companyRegNo: string | null, typeOfapplication: string | "Unknown", wBSNumber: string | null, physicalAddressOfProject: string | "Unknown", descriptionOfProject: string | "Unknown", natureOfWork: string | "Unknown", excavationType: string | "Unknown", expectedStartDate: any | "Unknown", expectedEndDate: any | "Unknown", createdById: string | null, projectNumber: string | null,engineer:string|"Unknown" , contractor:string|"Unknown") {
    
    const body = {
     
      DraftID: draftID,
      ApplicationID: applicationID,
      UserID: userID,
      FullName: fullName,
      PhoneNumber: phoneNumber,
      PhyscialAddress: physicalAddress,
      ReferenceNumber: referenceNumber,
      CompanyRegNo: companyRegNo,
      TypeOfApplication: typeOfapplication,
      WBSNumber: wBSNumber,
      PhysicalAddressOfProject: physicalAddressOfProject,
      NatureOfWork: natureOfWork,
      ExcavationType: excavationType,
      ExpectedStartDate: expectedStartDate,
      ExpectedEndDate: expectedEndDate,
      CreatedById: createdById,
      ProjectNumber: projectNumber,
      DescriptionOfProject: descriptionOfProject,
      Email: email,
      Engineer: engineer,
      Contractor: contractor,

      
    }
    return this.httpClient.post(this.baseURL + "AddUpdateDraftApplication", body)
  }

  public getDraftedApplicationsList(userID: string ) {
    
    const body = {
      UserID:userID
    }
    console.log("Base URL:    "+this.baseURL)
    return this.httpClient.post(this.baseURL + "GetDraftedApplicationsList", body)
  }

  public GetAllDraftApplications(isInternal: boolean ) {

    return this.httpClient.post(this.baseURL + "GetAllDraftApplications", isInternal)
  }
  public deleteDraftedApplication(draftID: number ) {

    return this.httpClient.post(this.baseURL + "DeleteDraftedApplication", draftID)
  }

  public getDraftedApplicationsByApplicationID(applicationID: number) {
    const body = {
      ApplicationID:applicationID
    }
    return this.httpClient.post(this.baseURL + "GetDraftedApplicationsByDraftID", body)
  }

  public getDraftedApplicationsListForExternal(UserId: string) {
    
    const body = {
      UserID: UserId
    }
    return this.httpClient.post(this.baseURL + "GetDraftedApplicationsListForExternal", body)
  }
}
