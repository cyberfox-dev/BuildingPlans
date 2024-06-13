import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class BPRolesService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bPRoles/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateRole(roleID: number |null, roleName :string|null,roleDescripton:string|null,roleType:string|null,createdById:string|null) {
    const body = {
      RoleID: roleID,
      RoleName: roleName,
      RoleDescription: roleDescripton,
      RoleType: roleType,
      CreatedById:createdById
    }

    return this.httpClient.post(this.baseURL + "AddUpdateRole", body);
  }

  public getAllRoles() {
    return this.httpClient.get(this.baseURL + "GetAllRoles");
  }

  public getRoleByRoleID(roleId: number | null) {
    const body = {
      RoleID :roleId
    }
    return this.httpClient.post(this.baseURL + "GetRoleByRoleID", body);
  }

  public deleteRoleByRoleID(roleID: number | null) {
    const body = {
      RoleID :roleID
    }

    return this.httpClient.post(this.baseURL + "DeleteRoleByRoleID", body);
  }
  public getAllRolesAndAccessGroupLinks(accessGroupName: string | null) {
    const body = {
      AccessGroupName:accessGroupName
    }

    return this.httpClient.post(this.baseURL + "GetAllRolesAndAccessGroupLinks", body);
  }
}
