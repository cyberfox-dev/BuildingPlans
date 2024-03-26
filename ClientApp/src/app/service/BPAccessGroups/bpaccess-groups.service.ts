import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class BPAccessGroupsService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bPAccessGroups/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateAccessGroup(accessGroupID: number|null , accessGroupName:string|null, accessGroupDescription:string|null ,createdById:string|null) {
    const body = {
      AccessGroupID: accessGroupID,
      AccessGroupName: accessGroupName,
      AccessGroupDescription: accessGroupDescription,
      CreatedById: createdById
    }

    return this.httpClient.post(this.baseURL + "AddUpdateAccessGroup", body);
  }

  public getAllAccessgroups() {
    return this.httpClient.get(this.baseURL + "GetAllAccessGroups");
  }

  public getAccessGroupByAccessGroupID(accessGroupID: number | null) {
    const body = {
      AccessGroupID: accessGroupID
    }

    return this.httpClient.post(this.baseURL + "GetAccessGroupByAccessGroupID", body);
  }

  public deleteAccessGroupByAccessGroupID(accessGroupID: number | null) {
    const body = {
      AccessGroupID: accessGroupID
    }

    return this.httpClient.post(this.baseURL + "GetAccessGroupByAccessGroupID", body);
  }
}
