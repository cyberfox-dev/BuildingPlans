import { Injectable } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BPMandatoryStageDocumentService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bPMandatoryStageDocuments/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateMandatoryStageDocument(documentId: number | null, documentName: string | null, stageName: string | null, functionalArea: string | null, createdById: string | null) {
    const body = {
      DocumentID: documentId,
      DocumentName: documentName,
      StageName: stageName,
      FunctionalArea: functionalArea,
      CreatedById: createdById
    }

    return this.httpClient.post(this.baseURL + "AddUpdateMandatoryStageDocument", body);
  }

  public getAllDocumentsForStage(stageName: string | null, functionalArea: string | null) {
    const body = {
      StageName: stageName,
      FunctionalArea:functionalArea
    }

    return this.httpClient.post(this.baseURL + "GetAllDocumentsForStage", body);
  }

  public deleteMandatoryStageDocByDocumentID(documentID: number | null) {
    const body = {
      DocumentID: documentID
    }

    return this.httpClient.post(this.baseURL + "DeleteMandatoryStageDocByDocumentID", body);
  }
}
