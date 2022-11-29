import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ZoneLinkService {
  private readonly baseURL: string = "https://localhost:7123/api/zoneLinking/"
  constructor(private httpClient: HttpClient) { }


  public addUpdateZoneLink(zoneLinkID: number | null, departmentID: number, zoneID: number | null, subDepartmentID: number, assignedUserID: string | null, userType: string | null,createdById: string|null) {

    const body = {
      ZoneLinkID: zoneLinkID,
      DepartmentID: departmentID,
      SubDepartmentID: subDepartmentID,
      AssignedUserID: assignedUserID,
      UserType: userType,
      ZoneID: zoneID,
      CreatedById:createdById
    }
    return this.httpClient.post(this.baseURL + "AddUpdateZoneLink", body);

  }

  public deleteZoneLink(zoneLinkID: number) {

    return this.httpClient.post(this.baseURL + "DeleteZoneLink", zoneLinkID);

  }

  public getZoneLinkssList(zoneLinkID: any) {

    return this.httpClient.get(this.baseURL + "GetZoneLinksList", zoneLinkID);

  }

  public getUsersNotLinkedByUserID(zoneID:any) {
   
    return this.httpClient.post(this.baseURL + "GetUsersNotLinkedByUserID", zoneID);

  }
}
