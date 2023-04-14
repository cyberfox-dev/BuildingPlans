import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private readonly apiUrl: string = this.sharedService.getApiUrl();
  private readonly baseURL: string = this.apiUrl + "roles/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

/*  , roleType: string | null, roleDescription: string | null, createdById: string | null*/

  public addUpdateRole(roleID: number | null, roleName: string | null, roleType: string | null, roleDescription: string | null, createdById: string | null) {  

    const body = {
      RoleID: roleID,
      RoleName: roleName,
      RoleType: roleType,
      RoleDescription: roleDescription,
      CreatedById: createdById,

    }
    return this.httpClient.post(this.baseURL + "AddUpdateRole", body);

  }

  public deleteRole(roleID: number) {

    return this.httpClient.post(this.baseURL + "DeleteRole", roleID);

  }

  public getRoleByRoleID(roleID: any) {

    return this.httpClient.get(this.baseURL + "GetRoleByRoleID", roleID);

  }

  public getAllRoles() {

    return this.httpClient.get(this.baseURL + "GetAllRoles");

  }



}
