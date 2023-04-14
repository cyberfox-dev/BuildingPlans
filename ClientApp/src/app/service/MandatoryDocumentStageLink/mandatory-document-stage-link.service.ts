import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MandatoryDocumentStageLinkService {

  private readonly baseURL: string = "http://197.242.150.226:7123/api/mandatoryDocumentStageLink/"

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

  public getAllMandatoryDocumentStageLinkByStageID(mandatoryDocumentID: any) {

    return this.httpClient.post(this.baseURL + "GetAllMandatoryDocumentStageLinkByStageID", mandatoryDocumentID);

  }

  public getAllMandatoryDocumentsByStageID(stageID: any) {

    return this.httpClient.post(this.baseURL + "GetAllMandatoryDocumentsByStageID", stageID);

  }




}
