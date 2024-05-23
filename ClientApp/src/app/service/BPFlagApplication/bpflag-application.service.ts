import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class BPFlagApplicationService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bPFlagApplication/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateFlagApplication(applicationID: number | null, userID: string | null, applicantName: string | null, applicantSurname: string | null, applicantEmail: string | null, applicantFax: string | null, applicantCell:string|null,applicantTelephone:string|null,applicantAddress:string|null,applicationType:string|null,location:string|null,poleNumber:string|null,startPole:string|null,endPole:string|null,subjectMatter:string|null,noOfFlags:string|null,noOfAgents:string|null,natureOfAdvert:string|null,startDate:any|null,endDate:any|null,placeOfEvent:string|null, applicationFee:string|null,createdById:string|null) {
    const body = {
      ApplicationID: applicationID,
      UserID: userID,
      ApplicantNaeme: applicantName,
      ApplicantSurname: applicantSurname,
      ApplicantEmail: applicantEmail,
      ApplicantFax: applicantFax,
      ApplicantCell: applicantCell,
      ApplicantTelephone: applicantTelephone,
      ApplicantAddress: applicantAddress,
      ApplicationType: applicationType,
      Location: location,
      PoleNumber: poleNumber,
      StartPOle: startPole,
      EndPole: endPole,
      SubjectMatter: subjectMatter,
      NoOfFlags: noOfFlags,
      NoOfAgents: noOfAgents,
      NatureOfAdvert: natureOfAdvert,
      StartDate: startDate,
      EndDate: endDate,
      PlaceOfEvent: placeOfEvent,
      ApplicationFee: applicationFee,
      CreatedById :createdById,

    }
    return this.httpClient.post(this.baseURL + "AddUpdateFlagApplication", body);
  }

  public getAllFlagApplications() {
    return this.httpClient.get(this.baseURL + "GetAllFlagApplications");
  }

  public getFlagApplicationByApplicationID(applicationId: number | null) {
    const body = {
      ApplicationID :applicationId
    }

    return this.httpClient.post(this.baseURL + "GetFlagApplicationByApplicationID", body);
  }

  public deleteFlagApplicationByApplicationID(applicationID: number | null) {
    const body = {
      ApplicationID:applicationID
    }

    return this.httpClient.post(this.baseURL + "DeleteFlagApplicationByAplicationID", body);
  }
}
