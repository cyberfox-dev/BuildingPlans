import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentUploadService {

  private readonly apiUrl: string = this.sharedService.getApiUrl();
  private readonly baseURL: string = this.apiUrl + "documentUpload/";


  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateDocument(documentID?: number | null, documentName?: string | null, documentLocalPath?: any | null, applicationID?: number | null, assignedUserID?: string | null, createdById?: string | null ) {
    const body = {
      DocumentID: documentID,
      DocumentName: documentName,
      DocumentLocalPath: documentLocalPath,
      ApplicationID: applicationID,
      AssignedUserID: assignedUserID,
      CreatedById: createdById
    }
    return this.httpClient.post(this.baseURL + "AddUpdateDocument", body);
  }

  public deleteDocument(documentID: number) {

    return this.httpClient.post(this.baseURL + "DeleteDocument", documentID);

  }

  public getAllDocuments() {

    return this.httpClient.get(this.baseURL + "GetAllDocuments");

  }


  public getAllDocumentsForUser(assignedUserID: number) {

    const body = {
      
      AssignedUserID: assignedUserID,
 
    }
    return this.httpClient.post(this.baseURL + "GetAllDocumentsForUser", body);

  }
}
