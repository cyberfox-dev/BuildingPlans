import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class BPDepartmentLinkService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bPDepartmentLink/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateDepartmentLink(departmentLinkID: number | null, functionalArea: string | null, departmentId: number | null, departmentName: string | null, assignedUserID: string | null, isAdmin: boolean | null, accessGroupName: string | null, accessGroupUserLinkID: number | null, createdById: string | null)
  {
    const body = {
      DepartmentLinkID: departmentLinkID,
      FunctionalArea: functionalArea,
      DepartmentID: departmentId,
      DepartmentNAme: departmentName,
      AssignedUserID: assignedUserID,
      AccessGroupName: accessGroupName,
      AccessGroupUserLinkID: accessGroupUserLinkID,
      CreatedById:createdById
    }

    return this.httpClient.post(this.baseURL + "AddUpdateDepartmentLink", body);
  }

  public getAllUsersForDeparment(functionalArea: string | null, departmentName: string | null) {
    const body = {
      FunctionalArea: functionalArea,
      DepartmentName:departmentName
    }

    return this.httpClient.post(this.baseURL + "GetAllUsersForDepartment", body);
  }

  public deleteUserFromDepartment(departmentLinkId: number | null) {
    const body = {
      DepartmentLinkID: departmentLinkId
    }
    return this.httpClient.post(this.baseURL + "DeleteUserFromDepartment", body);
  }

  public getAllDepartmentLinksForUser(userId: string | null) {
    const body = {
      AssignedUserID: userId
    }

    return this.httpClient.post(this.baseURL + "GetAllDepartmentLinksForUser", body);
  }
}
