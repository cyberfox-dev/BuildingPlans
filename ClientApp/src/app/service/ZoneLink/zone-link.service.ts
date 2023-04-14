import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ZoneLinkService {

  
  private readonly apiUrl: string = this.sharedService.getApiUrl();
  private readonly baseURL: string = this.apiUrl + "zoneLinking/";
  constructor(private httpClient: HttpClient, private sharedService: SharedService) {}




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
    return this.httpClient.post(this.baseURL + + "AddUpdateZoneLink", body);

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

  public getAllRecordsByUserIdIfDeleted(userID: any) {
    const body = {
      UserID: userID,
    }
    return this.httpClient.post(this.baseURL + "GetAllRecordsByUserIdIfDeleted", body);

  }
  
}
