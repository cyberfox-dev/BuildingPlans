import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class MobileFieldTrackingService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "MFT/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }



  public addUpdateMFT(mftID: number | null, mftNote: string | null, applicationID: number | null, documentName: string | null, documentLocalPath: string | null, createdBy: string | null, fullName: string | null) {
    const body = {
      MFTID: mftID,
      ApplicationID: applicationID,
      MFTNote: mftNote,
      DocumentName: documentName,
      DocumentLocalPath: documentLocalPath,
      CreatedById: createdBy,
      FullName: fullName,
    }
    return this.httpClient.post(this.baseURL + "AddUpdateMFT", body);
  }

  public deleteMFT(mftID: number) {

    return this.httpClient.post(this.baseURL + "DeleteMFT", mftID);

  }

  public getMFTByApplicationID(applicationID: number) {

    return this.httpClient.post(this.baseURL + "GetMFTByApplicationID", applicationID);

  }

  public deleteDocumentFromMFT(applicationID: number | null, documentName: string | null) {

    const body = {
      ApplicationID: applicationID,
      DocumentName :documentName
    }

    return this.httpClient.post(this.baseURL + "DeleteDocumentFromMFT", body);
  }
}
