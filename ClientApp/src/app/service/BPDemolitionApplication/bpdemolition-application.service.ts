import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class BPDemolitionApplicationService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bPDemolitionApplication/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateDemolitionApplication(demolitionID: number | null, mainMunicaplity: string | null, applicantName: string | null, applicantSurname: string | null, applicantIDNumber: string | null, applicantEmailAddress: string | null, applicantContactNumber: string | null, isPropertyOwner: boolean | null, ownerIDNumber: string | null, ownerName: string | null, ownerSurname: string | null, ownerEmailAddress: string | null, ownerContactNumber: string | null, applicantAddress: string | null, siteAddress: string | null, siteERFNumber: string | null, siteCadastralDescription: string | null, reasonForDemolition: string | null, propertyUse: string | null, demolitionFees: string | null, isArchive: boolean | null, createdById: string | null, currentStage :string|null ,previousStage :string|null,nextStage :string | null) {

    const body = {
      DemolitionID: demolitionID,
      MainMunicipality: mainMunicaplity,
      ApplicantName: applicantName,
      ApplicantSurname: applicantSurname,
      ApplicantIDNumber: applicantIDNumber,
      ApplicantEmailAddress: applicantEmailAddress,
      ApplicantContactNumber: applicantContactNumber,
      isPropertyOwner: isPropertyOwner,
      OwnerIDNumber: ownerIDNumber,
      OwnerName: ownerName,
      OwnerSurname: ownerSurname,
      OwnerEmailAddress: ownerEmailAddress,
      OwnerContactNumber: ownerContactNumber,
      ApplicantAddress: applicantAddress,
      SiteAddress: siteAddress,
      SiteERFNumber: siteERFNumber,
      SiteCadastralDescription: siteCadastralDescription,
      ReasonForDemolition: reasonForDemolition,
      PropertyUse: propertyUse,
      DemolitionFees: demolitionFees,
      isArchive: isArchive,
      CreatedById: createdById,
      CurrentStage: currentStage,
      PreviousStage: previousStage,
      NextStage :nextStage
    }


    return this.httpClient.post(this.baseURL + "AddUpdateDemolitionApplication", body);
  }

  public getAllDemolitionApplications() {

    return this.httpClient.get(this.baseURL + "GetAllDemolitionApplication");
  }

  public getDemolitionApplicationByDemolitionID(demolitionId: number | null) {
    const body = {
      DemolitionID :demolitionId
    }

    return this.httpClient.post(this.baseURL + "GetDemolitionApplicationByDemolitionID", body);
  }

  public deleteDemolitonApplicationByDemolitionID(demolitionID: number | null) {
    const body = {
      DemolitionID :demolitionID
    }

    return this.httpClient.post(this.baseURL + "DeleteDemolitionApoplicationByDemolitionID", body);
  }
}
  
