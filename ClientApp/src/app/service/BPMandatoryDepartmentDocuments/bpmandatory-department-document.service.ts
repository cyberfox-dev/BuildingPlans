import { Injectable } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BPMandatoryDepartmentDocumentService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bPMandatoryDepartmentDocuments/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateMandatoryDepartmentDocument(documentId: number | null, documentName: string | null, functionalArea: string | null, departmentName: string | null, createdById: string | null)
  {
    const body = {
      DocumentID: documentId,
      DocumentName: documentName,
      FunctionalArea: functionalArea,
      DepartmentName: departmentName,
      CreatedById: createdById
    }

    return this.httpClient.post(this.baseURL + "AddUpdateMandatoryDepartmentDocument",body)
  }

  public getAllDocumentsForDepartment(departmentName: string | null, functionalArea: string | null) {
    const body = {
      DepartmentName: departmentName,
      FunctionalArea: functionalArea
    }

    return this.httpClient.post(this.baseURL + "GetAllDocumentsForDepartment", body);
  }

  public deleteDepartmentDocumentByDocumentId(documentId: number | null) {
    const body = {
      DocumentID:documentId
    }

    return this.httpClient.post(this.baseURL + "DeleteDepartmentManDocByDocumentId", body);
  }
}
