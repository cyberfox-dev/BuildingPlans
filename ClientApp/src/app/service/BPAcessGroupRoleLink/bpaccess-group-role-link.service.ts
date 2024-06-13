import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';
@Injectable({
  providedIn: 'root'
})
export class BPAccessGroupRoleLinkService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bPAccessGroupRoleLink/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateAccessGroupRoleLink(accessGroupRoleLinkID:number|null, accessGroupName:string|null, roleName:string|null , createdById:string|null, accessGroupID:number|null,roleID:number|null) {
    const body = {
      AccessGroupRoleLinkID: accessGroupRoleLinkID,
      AccessGroupName: accessGroupName,
      RoleName: roleName,
      CreatedById: createdById,
      AccessGroupID: accessGroupID,
      RoleID:roleID
    }

    return this.httpClient.post(this.baseURL + "AddUpdateAccessGroupRoleLink", body);
  }

  public getAllRoleForAccessGroup(accessGroupName) {
    const body = {
      AccessGroupName: accessGroupName
    }

    return this.httpClient.post(this.baseURL + "GetAllRolesForAccessGroup", body);
  }

  public getAccessGroupRoleLinkByID(accessGroupRoleLinkID: number | null) {
    const body = {
      AccessGroupRoleLinkID: accessGroupRoleLinkID
    }

    return this.httpClient.post(this.baseURL + "GetAccessGroupRoleLinkByID", body);
  }

  public deleteAccessGroupRoleLinkByID(accessGroupRoleLinkID: number | null) {
    const body = {
      AccessGroupRoleLinkID: accessGroupRoleLinkID
    }

    return this.httpClient.post(this.baseURL + "DeleteAccessGroupRoleLinkByID", body);
  }
}
