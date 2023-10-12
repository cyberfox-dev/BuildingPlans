import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ZoneLinkService {

  
  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "zoneLinking/";


  constructor(private httpClient: HttpClient, private sharedService: SharedService) {}




  public addUpdateZoneLink(zoneLinkID: number | null, zoneID: number | null, zoneName: string | null, departmentID: number, subDepartmentID: number, subDepartmentName: string | null, assignedUserID: string | null, userType: string | null, createdById: string | null, isDepartmentAdmin: boolean | null, isZoneAdmin: boolean | null, accessGroupUserLinkID: number | null, accessGroupName: string |null ) {

    const body = {
      ZoneLinkID: zoneLinkID,
      DepartmentID: departmentID,
      SubDepartmentID: subDepartmentID,
      AssignedUserID: assignedUserID,
      UserType: userType,
      ZoneID: zoneID,
      CreatedById: createdById,
      isDepartmentAdmin: isDepartmentAdmin,
      isZoneAdmin: isZoneAdmin,
      SubDepartmentName: subDepartmentName,
      ZoneName: zoneName,
      AccessGroupUserLinkID: accessGroupUserLinkID,
      AccessGroupName: accessGroupName,
      
    }
    return this.httpClient.post(this.baseURL + "AddUpdateZoneLink", body);

  }

  //public getBySubAndUserID(subDepartmentID: number | null, assignedUserID: string | null) {
  //  debugger;
  //  const body = {

  //    SubDepartmentID: subDepartmentID,
  //    AssignedUserID: assignedUserID,
  //  }
  //  return this.httpClient.post(this.baseURL + "FindME", body);

  //}
  public getBySubAndUserID(subDepartmentID: number | null, assignedUserID: string | null) {
    debugger;
    const body = {
      subDepartmentID: subDepartmentID,
      assignedUserID: assignedUserID
    }
    return this.httpClient.post(this.baseURL + "GetBySubAndUserID", body);

  }

  public deleteZoneLink(zoneLinkID: number) {

    return this.httpClient.post(this.baseURL + "DeleteZoneLink", zoneLinkID);

  }

  public getZoneLinkssList(zoneLinkID: any) {

    return this.httpClient.get(this.baseURL + "GetZoneLinksList", zoneLinkID);

  }

  public getAllUserLinks(assignedUserID: any) {
    const body = {

      AssignedUserID: assignedUserID,
   
    }
   
    return this.httpClient.post(this.baseURL + "GetAllUserLinks", body);

  }

  public getUsersNotLinkedByUserID(zoneID: any) {
   
    return this.httpClient.post(this.baseURL + "GetUsersNotLinkedByUserID", zoneID);

  }

  public getAllRecordsByUserIdIfDeleted(userID: any) {
    const body = {
      UserID: userID,
    }
    return this.httpClient.post(this.baseURL + "GetAllRecordsByUserIdIfDeleted", body);

  }
  
}
