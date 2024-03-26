import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class BPAccessGroupUserLinkService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bPAccessGroupsUserLink/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateAccessGroupUserLink(accessGroupUserLinkId: number | null, accessGroupID: number | null, accessGroupName: string | null, zoneId: number | null, zoneName: string | null, subdepartmentName: string | null, userID: string | null, createdById: string | null, functionalArea: string | null, departmentName: string | null) {
    const body = {
      AccessGroupUserLinkID: accessGroupUserLinkId,
      AccessGroupID: accessGroupID,
      AccessGroupName: accessGroupName,
      ZonedID: zoneId,
      ZoneName: zoneName,
      SubdepartmentName: subdepartmentName,
      UserID: userID,
      CreatedById: createdById,
      FunctionalArea: functionalArea,
      DepartmentName: departmentName
    }

    return this.httpClient.post(this.baseURL + "AddUpdateAccessGroupUserLink", body);
  }

  public getAllUsersForAccessGroupAndZone(accessGroupName: string | null, zoneName: string | null, subdepartmentName: string) {
    const body = {
      AccessGroupName: accessGroupName,
      ZoneName: zoneName,
      SubdepartmentName: subdepartmentName

    }

    return this.httpClient.post(this.baseURL + "GetAllUsersForAccessGroupAndZone", body);
  }

  public deleteUserFromAccessGroup(accessGroupUserLinkID: number | null) {
    const body = {
      AccessGroupUserLinkID: accessGroupUserLinkID
    }
    return this.httpClient.post(this.baseURL + "DeleteUserFromAccessGroup", body);
  }

  public getAllAccessGroupsForUser(userId: string) {
    const body = {
      UserID: userId
    }

    return this.httpClient.post(this.baseURL + "GetAllAccessGroupsForUser", body);
  }
  public getAllAccessGroupLinksForUserInDepartment(userId: string | null, functionalArea: string | null, departmentName: string | null) {
    const body = {
      UserId: userId,
      FunctionalArea: functionalArea,
      DepartmentName:departmentName
    }

    return this.httpClient.post(this.baseURL + "GetAllAccessGroupLinksForUserInDepartment", body);
  }
}
