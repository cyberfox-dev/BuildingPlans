import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class MandatoryDocumentUploadService {

  private readonly apiUrl: string = this.sharedService.getApiUrl();
  private readonly baseURL: string = this.apiUrl + "mandatoryDocumentUploads/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

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
