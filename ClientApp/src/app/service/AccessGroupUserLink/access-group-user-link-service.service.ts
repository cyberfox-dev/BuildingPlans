import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class AccessGroupUserLinkServiceService {
  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "accessGroupUserLink/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public getAccessGroupByUserID(userID: string) {
    // Create an object with the userID property
    const requestBody = { UserID: userID };

    return this.httpClient.post(this.baseURL + "GetAccessGroupByUserID", requestBody);
  }

  public getAGBySubDeptAndUserID(userID: string, subDepartmentId: number| null) {
    const requestBody = {
      UserID: userID,
      SubDepartmentID: subDepartmentId
    };

    return this.httpClient.post(this.baseURL + "GetAccessGroupsBySubDeptAndUserID", requestBody);
  }
  public getAccessGroupsBySubDeptZoneAndUserID(userID: string, zoneId: number | null, subDepartmentId: number | null) {
    const requestBody = {
      UserID: userID,
      ZoneID: zoneId,
      SubDepartmentID: subDepartmentId
    };

    return this.httpClient.post(this.baseURL + "GetAccessGroupsBySubDeptZoneAndUserID", requestBody);
  }
  public getPeopleByAccessGroupAndSubDept(agID: number|null, subDepartmentId: number | null) {
    debugger;
    const requestBody = {
      AccessGroupID: agID,
      SubDepartmentID: subDepartmentId
    };
    return this.httpClient.post(this.baseURL + "GetPeopleByAccessGroupAndSubDept", requestBody);
  }
  public getPeopleByZone(zoneId: number | null) {
    debugger;
    const requestBody = {
      ZoneID: zoneId
    };
    return this.httpClient.post(this.baseURL + "GetPeopleByZone", requestBody);
  }
}
