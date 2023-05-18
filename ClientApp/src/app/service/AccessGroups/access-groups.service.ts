import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class AccessGroupsService {

  private readonly apiUrl: string = this.sharedService.getApiUrl();
  private readonly baseURL: string = this.apiUrl + "accessGroups/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateAccessGroup(accessGroupID: number | null, accessGroupDescription: string | null, accessGroupName: string | null,createdById: string | null) {

    const body = {

      AccessGroupID: accessGroupID,
      AccessGroupDescription: accessGroupDescription,
      AccessGroupName: accessGroupName,
      CreatedById: createdById,

    }
    return this.httpClient.post(this.baseURL + "AddUpdateAccessGroup", body);

  }

  public addUpdateAccessGroupUserLink(accessGroupUserLinkID:number | null, accessGroupID: number | null, userID: string | null,createdById: string | null) {

    const body = {
      AccessGroupUserLinkID: accessGroupUserLinkID,
      AccessGroupID: accessGroupID,
      UserID: userID,
      CreatedById: createdById,

    }
    return this.httpClient.post(this.baseURL + "AddUpdateAccessGroupUserLink", body);

  }


  public addUpdateAccessGroupRoleLink(accessGroupRoleLinkID: number | null, accessGroupID: number | null, roleID: number | null, roleName: string | null, createdById: string | null) {

    const body = {
      AccessGroupRoleLinkID: accessGroupRoleLinkID,
      AccessGroupID: accessGroupID,
      RoleID: roleID,
      RoleName: roleName,
      CreatedById: createdById,

    }
    return this.httpClient.post(this.baseURL + "AddUpdateAccessGroupRoleLink", body);

  }

  public deleteAccessGroupByID(accessGroupID: number) {

    return this.httpClient.post(this.baseURL + "DeleteAccessGroupByID", accessGroupID);

  }

  public deleteAccessGroupUserLinkByID(accessGroupUserLinkID: number) {

    return this.httpClient.post(this.baseURL + "DeleteAccessGroupUserLinkByID", accessGroupUserLinkID);

  }

  public deleteAccessGroupRoleLinkByID(accessGroupRoleLinkID: number) {

    return this.httpClient.post(this.baseURL + "DeleteAccessGroupRoleLinkByID", accessGroupRoleLinkID);

  }


  public getAllAccessGroups() {

    return this.httpClient.get(this.baseURL + "GetAllAccessGroups");

  }
  public getAllAccessGroupRoles() {

    return this.httpClient.get(this.baseURL + "GetAllAccessGroupRoles");

  }
  public getAllAccessGroupUsers() {

    return this.httpClient.get(this.baseURL + "GetAllAccessGroupUsers");

  }
  public getAllLinkedUsers(accessGroupID: number) {

    return this.httpClient.post(this.baseURL + "GetAllLinkedUsers", accessGroupID);

  }

  

  public getAllRolesForUser(userID: string) {

    const body = {
      UserID: userID,
    }
    return this.httpClient.post(this.baseURL + "GetAllRolesForUser", body);

  }

  public getAllNotLinkedUsers(accessGroupID: number) {

    return this.httpClient.post(this.baseURL + "GetAllNotLinkedUsers", accessGroupID);

  }
  public getAllNotLinkedRoles(accessGroupID: number) {

    return this.httpClient.post(this.baseURL + "GetAllNotLinkedRoles", accessGroupID);

  }

  public getAllLinkedRoles(accessGroupID: number) {

    return this.httpClient.post(this.baseURL + "GetAllLinkedRoles", accessGroupID);

  }

}
