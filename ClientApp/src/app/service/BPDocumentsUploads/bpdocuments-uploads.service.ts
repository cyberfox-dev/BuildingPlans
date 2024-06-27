import { Injectable } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BPDocumentsUploadsService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bPDocumentUploads/";


  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateDocument(documentId?: number | null, documentName?: string | null, documentLocalPath?: string | null, applicationId?: number | null, assignedUserId?: string | null,createdById?:string|null,documentGroupName?:string|null,subdepartmentID?:number|null,subdepartmentName?:string|null,isPlanning?:boolean|null,isRepository?:boolean|null) {
    
    const body = {
      
      DocumentID: documentId,
      DocumentName: documentName,
      ApplicationID: applicationId,
      AssignedUserID: assignedUserId,
      CreatedById: createdById,
      DocumentGroupName: documentGroupName,
      SubdepartmentID: subdepartmentID,
      SubdepartmentName: subdepartmentName,
      isPlanning: isPlanning,
      isRepository: isRepository,
      DocumentLocalPath: documentLocalPath,
    }
    return this.httpClient.post(this.baseURL + "AddUpdateDocument", body);
  }

  public deleteDocument(documentId: number | null) {
    return this.httpClient.post(this.baseURL + "DeleteDocument", documentId);
  }

  public getAllDocuments() {
    return this.httpClient.get(this.baseURL + "GetAllDocuments");
  }

  public getAllDocumentsForApplication(applicationId: number | null) {
    return this.httpClient.post(this.baseURL + "GetAllDocumentsForApplication", applicationId);
  }

  public getAllDocumentsForUser(assignedUserId:string|null) {
    const body = {
      AssignedUserID: assignedUserId
    }
    return this.httpClient.post(this.baseURL + "GetAllDocumentsForUser", body);
  }

  public getAllDocumentsForRepository() {
    
    return this.httpClient.get(this.baseURL + "GetAllBPDocumentsForRepository");

  }
}
