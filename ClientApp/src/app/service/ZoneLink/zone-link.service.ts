import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ZoneLinkService {
  private readonly baseURL: string = "https://localhost:7123/api/zonelinks/"
  constructor(private httpClient: HttpClient) { }


  public addUpdateZoneLink(zoneLinkID: number | null, departmentID: number, subDepartmentID: number, assignedUserID: string | null, userType: string | null) {

    const body = {
      ZoneLinkID: zoneLinkID,
      DepartmentID: departmentID,
      SubDepartmentID: subDepartmentID,
      AssignedUserID: assignedUserID,
      UserType: userType,
    }
    return this.httpClient.post(this.baseURL + "AddUpdateZoneLink", body);

  }

  public deleteZoneLink(zoneLinkID: number) {

    return this.httpClient.post(this.baseURL + "DeleteZoneLink", zoneLinkID);

  }

  public getZoneLinkssList(zoneLinkID: any) {

    return this.httpClient.get(this.baseURL + "GetZoneLinksList", zoneLinkID);

  }
}
