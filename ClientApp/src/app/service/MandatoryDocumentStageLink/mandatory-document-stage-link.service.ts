import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class MandatoryDocumentStageLinkService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "mandatoryDocumentStageLink/";


  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateMandatoryDocumentStageLink(mandatoryDocumentStageLinkID: number | null, mandatoryDocumentID: number, stageID: number | null, stageName: string, createdByID : number| null) {

    const body = {
      MandatoryDocumentStageLinkID: mandatoryDocumentStageLinkID,
      MandatoryDocumentID: mandatoryDocumentID,
      StageID: stageID,
      StageName: stageName,
      CreatedByID: createdByID,
    }
    return this.httpClient.post(this.baseURL + "AddUpdateMandatoryDocumentStageLink", body);

  }

  public deleteMandatoryDocumentStageLink(mandatoryDocumentStageLinkID: number) {

    return this.httpClient.post(this.baseURL + "DeleteMandatoryDocumentStageLink", mandatoryDocumentStageLinkID);

  }

  public getAllMandatoryDocumentStageLink() {

    return this.httpClient.get(this.baseURL + "GetAllMandatoryDocumentStageLink");

  }

  public getAllMandatoryDocumentStageLinkByStageID(mandatoryDocumentID: any) {

    return this.httpClient.post(this.baseURL + "GetAllMandatoryDocumentStageLinkByStageID", mandatoryDocumentID);

  }

  public getAllMandatoryDocumentsByStageID(stageID: any) {

    return this.httpClient.post(this.baseURL + "GetAllMandatoryDocumentsByStageID", stageID);

  }




}
