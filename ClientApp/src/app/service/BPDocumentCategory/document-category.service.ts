import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';


@Injectable({
  providedIn: 'root'
})
export class DocumentCategoryService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bPDocumentsCategoryTable/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateDocumentCategory(categoryId: number | null, categoryName: string | null, functionalArea: string | null, createdById: string | null) {
    const body = {
      CategoryId: categoryId,
      CategoryName: categoryName,
      FunctionalArea: functionalArea,
      CreatedById: createdById

    }

    return this.httpClient.post(this.baseURL + "AddUpdateDocumentCategory", body);
  }

  public getAllDocumentCategories() {

    return this.httpClient.get(this.baseURL + "GetAllDocumentCategories");
  }

  public deleteDocumentCategoryByCategoryId(categoryId: number | null) {

    return this.httpClient.post(this.baseURL + "DeleteDocumentCategoryByCategoryId", categoryId);
  }

  public getDocumentCategoryByFunctionalArea(functionalArea: string | null) {
    const body = {
      FunctionalArea:functionalArea
    }
    return this.httpClient.post(this.baseURL + "GetDocumentCategoryByFunctionArea", body);
  }

  public getDocumentCategoryByCategoryId(categoryId: number | null) {

    return this.httpClient.post(this.baseURL + "GetDocumentCategoryByCategoryID", categoryId);
  }
}
