import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class NeighbourConsentService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "neighbourConsent/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }
  
  public addUpdateNeighbourConsent(consentID: number | null, applicationID: number | null, address: string | null, documentName: string | null, documentLocalPath: string | null, consentStatus: string | null, createdById: string | null, ownerName: string | null , ownerCell:string| null , ownerEmail:string|null) {
    const body = {
      ConsentID: consentID,
      ApplicationID: applicationID,
      Address: address,
      DocumentName: documentName,
      DocumentLocalPath: documentLocalPath,
      ConsentStatus: consentStatus,
      CreatedById: createdById,
      OwnerName: ownerName,
      OwnerCell: ownerCell,
      OwnerEmail:ownerEmail,
    }

    return this.httpClient.post(this.baseURL + "AddUpdateNeighboutConsent", body);
  }

  public getAllNeighbourConsentForApplication(applicationID: number|null) {
    const body = {
      ApplicationID:applicationID
    }

    return this.httpClient.post(this.baseURL + "GetAllNeighbourConsentForApplication", body);
  }

  public getNeighbourConsentByConsentID(consentID:number|null) {
    const body = {
      ConsentID:consentID
    }

    return this.httpClient.post(this.baseURL + "GetNeighbourConsentByConsentID", body);
  }

  public deleteNeighbourConsentByConsentID(consentID:number|null) {
    const body = {
      ConsentID:consentID
    }
    return this.httpClient.post(this.baseURL + "DeleteNeighbourConsentByConsentID", body);
  }

  public deleteDocumentFromNeighbourConsent(consentID: number | null) {
    const body = {
      ConsentID :consentID
    }
    return this.httpClient.post(this.baseURL + "DeleteDocumentFromNeighbourConsent", body);
  }
}
