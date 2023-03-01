import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MandatoryDocumentUploadService {
  private readonly baseURL: string = "https://localhost:7123/api/mandatoryDocumentUploads/"
  constructor(private httpClient: HttpClient) { }

  public addUpdateMandatoryDocument(mandatoryDocumentID: number | null, mandatoryDocumentName: string | null, createdByID: string | null) {

    const body = {
      mandatoryDocumentID: mandatoryDocumentID,
      mandatoryDocumentName: mandatoryDocumentName,
      CreatedByID: createdByID,

    }
    return this.httpClient.post(this.baseURL + "AddUpdateMandatoryDocument", body);

  }

  public deleteMandatoryDocument(mandatoryDocumentID: number) {

    return this.httpClient.post(this.baseURL + "DeleteMandatoryDocument", mandatoryDocumentID);

  }

  public getAllMandatoryDocumentsByID(mandatoryDocumentID: any) {
    //const body = {
    //  StageID: stageID,
    //}
    return this.httpClient.post(this.baseURL + "GetAllMandatoryDocumentsByID", mandatoryDocumentID);

  }

  public getAllMandatoryDocuments() {

    return this.httpClient.get(this.baseURL + "GetAllMandatoryDocuments");

  }







}
