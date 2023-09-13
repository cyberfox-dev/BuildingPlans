import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectSizeCheckListService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "projectSizeCheckList/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }


  public getAllProjectSizeCheckList() {

    return this.httpClient.get(this.baseURL + "GetAllProjectSizeCheckList");

  }
  //
  public getProjectSizeCheckListByActivityType(projectSizeCheckListActivityType: string) {

    return this.httpClient.post(this.baseURL + "GetProjectSizeCheckListByActivityType", projectSizeCheckListActivityType );

  }
  public getProjectSizeCheckListByID(projectSizeCheckListID: number) {

    return this.httpClient.post(this.baseURL + "GetProjectSizeCheckListByID", projectSizeCheckListID );

  }
  public getProjectSizeCheckListByManDocCategory(mandatoryDocumentCategory: string) {

    return this.httpClient.post(this.baseURL + "GetProjectSizeCheckListByManDocCategory", mandatoryDocumentCategory);

  }
  // Wait, did I need to do these too? I might have jumped an API gun
  public deleteProjectSizeCheckListByID(projectSizeCheckListID: number) {

    return this.httpClient.post(this.baseURL + "DeleteProjectSizeCheckListByID", projectSizeCheckListID );

  }
  public addUpdatedProjectSizeCheckList(createdByID: string | null, mandatoryDocumentCategory: string | null, projectSizeCheckListActivityType: string | null, projectSizeCheckListActivity: string | null, projectSizeCheckListID: number | null) {

    const body = {
      createdByID: createdByID,
      projectSizeCheckListActivity: projectSizeCheckListActivity,
      projectSizeCheckListActivityType: projectSizeCheckListActivityType,
      mandatoryDocumentCategory: mandatoryDocumentCategory,
      projectSizeCheckListID: projectSizeCheckListID,
    }

    return this.httpClient.post(this.baseURL + "AddUpdatedProjectSizeCheckList", body);

  }

}
