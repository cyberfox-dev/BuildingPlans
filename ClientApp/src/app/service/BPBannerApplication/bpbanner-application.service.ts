import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class BPBannerApplicationService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bPBannerApplication/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateBannerApplication(applicationID: number | null, userID: string | null, applicantName: string | null, applicantSurname: string | null, applicantEmail: string | null, applicantFax: string | null, applicantCell: string | null, applicantTelephone: string | null, address: string | null, typeOfAdvert: string | null, natureOfEvent: string | null,descriptionOfEvent:string|null, nameOfEvent:string|null,startDate: string | null, endDate: string | null, sizeOfPoster: string | null, numberOfPoster: string | null, applicationFee: string | null, previousStage: string|null,currentStage:string|null,nextStage:string|null,createdbyId:string|null) {
    const body = {
      ApplicationID: applicationID,
      UserID: userID,
      ApplicantName: applicantName,
      ApplicantSurname: applicantSurname,
      ApplicantEmail: applicantEmail,
      ApplicantFax: applicantFax,
      ApplicantCell: applicantCell,
      ApplicantTelephone: applicantTelephone,
      Address: address,
      TypeOfAdvert: typeOfAdvert,
      NatureOfEvent: natureOfEvent,
      DescriptionOfEvent: descriptionOfEvent,
      NameOfEvent: nameOfEvent,
      StartDate: startDate,
      EndDate: endDate,
      SizeOfPosters: sizeOfPoster,
      ApplicationFee: applicationFee,
      PreviousStage: previousStage,
      CurrentStage: currentStage,
      NextStage: nextStage

    }
    return this.httpClient.post(this.baseURL + "AddUpdateBannerApplication", body);
  }

  public getAllBannerApplications() {
    return this.httpClient.get(this.baseURL + "GetAllBannerApplications");
  }

  public getBannerApplicationByApplictionID(applicationID: number | null) {
    const body = {
      ApplicationID:applicationID
    }

    return this.httpClient.post(this.baseURL + "GetBannerApplicationByApplicationID", body);
  }

  public deleteBannerApplicationByApplicationID(applicationID: number | null) {
    const body = {
      ApplicationID :applicationID
    }

    return this.httpClient.post(this.baseURL + "DeleteBannerApplicationByApplicationID", body);
  }
}
