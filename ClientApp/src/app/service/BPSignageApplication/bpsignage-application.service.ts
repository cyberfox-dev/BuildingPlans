import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class BPSignageApplicationService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bPSignageApplication/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateSignageApplication(applicationID:number|null,applicationType:string|null,applicantType:string,organisationName:string|null,UserID:string|null,applicantName:string|null,applicantSurname:string|null,applicantCell:string|null,applicantTelephone:string|null,applicantFax:string|null,applicantEmail:string|null,addressType:string|null,address:string|null,natureOfAdvertisement:string|null,areasOfControl:string|null,height:string|null,width:string|null,noOfFaces:string|null,startDate:any|null,endDate:any|null,applicationFee:string|null,monthlyFee:string|null,voltage:string|null,electricityRequired:boolean|null,environmentalImpactAssessment:boolean|null,advertisingSignRight:boolean|null,encroachment:boolean|null,previousStage:string|null,currentStage:string|null,nextStage:string|null) {
    const body = {
      ApplicationID: applicationID,
      Applicationtype: applicationType,
      ApplicantType: applicantType,
      OrganisationName: organisationName,
      UserID: UserID,
      ApplicantName: applicantName,
      ApplicantSurname: applicantSurname,
      ApplicantCell: applicantCell,
      ApplicantTelephone: applicantTelephone,
      ApplicantFax: applicantFax,
      ApplicantEmail: applicantEmail,
      Addresstype: addressType,
      Address: address,
      NatureOfAdvertisement: natureOfAdvertisement,
      AreasOfControl: areasOfControl,
      Height: height,
      Width: width,
      NoOfFaces: noOfFaces,
      StartDate: startDate,
      EndDate: endDate,
      ApplicationFee: applicationFee,
      MonthlyFee: monthlyFee,
      Voltage: voltage,
      ElectrictyRequired: electricityRequired,
      EnvironmentalImpactAssessment: environmentalImpactAssessment,
      AdvertisingSignRight: advertisingSignRight,
      Encroachment: encroachment,
      PreviousStage: previousStage,
      CurrentStage: currentStage,
      NextStage:nextStage
    }
    return this.httpClient.post(this.baseURL + "AddUpdateSignageApplication", body);
  }

  public getAllSignageApplications() {

    return this.httpClient.get(this.baseURL + "GetAllSignageApplications");
  }
}
