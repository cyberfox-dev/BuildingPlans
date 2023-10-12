import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';


@Injectable({
  providedIn: 'root'
})
export class DocumentRepositoryConfigService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "documentsRepositoryConfig/";
  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateDocumentCategory(documentRepID:number|null , documentCategory:string|null, departmentID:number|null, createdByID:string| null ) {
    debugger;
    const body = {
      
      DocumentsRepositoryID: documentRepID,
      DocumentsCategory: documentCategory,
      DepartmentID: departmentID,
      CreatedById: createdByID,
    }

    return this.httpClient.post(this.baseURL + "AddUpdateDocumentsCategory", body)
  }

  public getAllDocumentCategories() {
    
    return this.httpClient.get(this.baseURL + "GetAllDocumentCategories");

  }


  public deleteDocumentCategoryByID(documentRepositoryID: number) {
    return this.httpClient.post(this.baseURL + "DeleteDocumentCategoryByID", documentRepositoryID)
  }

  public GetDocumentCategoryByDepartmentID(departmentID: number) {
    

    return this.httpClient.post(this.baseURL + "GetDocumentCategoryByDepartmentID", departmentID)
  }
}
