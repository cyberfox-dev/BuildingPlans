import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectSizeCheckListService {

  private readonly apiUrl: string = this.sharedService.getApiUrl();
  private readonly baseURL: string = this.apiUrl + "projectSizeCheckList/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }


  public getAllProjectSizeCheckList() {

    return this.httpClient.get(this.baseURL + "GetAllProjectSizeCheckList");

  }

}
