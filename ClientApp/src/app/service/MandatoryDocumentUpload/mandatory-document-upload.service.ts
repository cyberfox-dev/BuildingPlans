import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MandatoryDocumentUploadService {
  private readonly baseURL: string = "https://localhost:7123/api/mandatoryDocumentUploads/"
  constructor(private httpClient: HttpClient) { }

  public addUpdateMandatoryDocument(mandatoryDocumentID: string | null, mandatoryDocumentName: string | null, stageID: string | null) {

    const body = {
      mandatoryDocumentID: mandatoryDocumentID,
      mandatoryDocumentName: mandatoryDocumentName,
      stageID: stageID,
      //im just adding this to see if this fixes the project
    }
    return this.httpClient.post(this.baseURL + "AddUpdateMandatoryDocument", body);

  }

  public deleteMandatoryDocument(mandatoryDocumentID: number) {

    return this.httpClient.post(this.baseURL+"DeleteMandatoryDocument", mandatoryDocumentID);

  }

  public getAllMandatoryDocumentsByStageID(stageID: any) {
    const body = {
      StageID: stageID,
    }
    return this.httpClient.post(this.baseURL+"GetAllMandatoryDocumentsByStageID", body);

  }

  public getAllMandatoryDocuments() {
 
    return this.httpClient.get(this.baseURL + "GetAllMandatoryDocuments");

  }







}
