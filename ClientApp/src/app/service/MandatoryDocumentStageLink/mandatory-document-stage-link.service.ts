import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MandatoryDocumentStageLinkService {

  private readonly baseURL: string = "https://localhost:7123/api/mandatoryDocumentStageLinking/"

  constructor(private httpClient: HttpClient) { }

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

  public getAllMandatoryDocumentStageLinkByStageID(stageID: any) {

    return this.httpClient.post(this.baseURL + "GetAllMandatoryDocumentStageLinkByStageID", stageID);

  }




}
