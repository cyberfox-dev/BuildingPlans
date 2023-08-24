import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ZonesService {

  private readonly apiUrl: string = this.sharedService.getApiUrl();
  private readonly baseURL: string = this.apiUrl + "zones/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }


  public addUpdateZone(zoneID: number, zoneName: string | null, departmentID: number, subDepartmentID: number | null, createdById: string | null) {

    const body = {
      ZoneID: zoneID,
      ZoneName: zoneName,
      DepartmentID: departmentID,
      SubDepartmentID: subDepartmentID,
      CreatedById: createdById
    }
    return this.httpClient.post(this.baseURL + "AddUpdateZones", body);

  }

  public deleteZone(zoneID: number) {

    return this.httpClient.post(this.baseURL + "DeleteZone", zoneID);

  }

  public getZonesList() {

    return this.httpClient.get(this.baseURL + "GetZonesList");

  }

  public getZonesBySubDepartmentsID(subDepartmentId: number) {
    
    const body = {

      SubDepartmentID: subDepartmentId,

    }
    return this.httpClient.post(this.baseURL + "GetZoneBySubDepartmentID", body);

  }

  public getUsersLinkedByZoneID(zoneID: any) {
  
    return this.httpClient.post(this.baseURL + "GetUsersLinkedByZoneID", zoneID);

  }

  public getZoneByZoneID(zoneID: number) {

    return this.httpClient.post(this.baseURL + "GetZoneByZoneID", zoneID);

  }

  public getZoneByMapObjectID(subDepartmentID ,mapObjectID: number) {

    const body = {
      SubDepartmentID: subDepartmentID,
      MapObjectID: mapObjectID,
    }

    return this.httpClient.post(this.baseURL + "GetZoneByMapObjectID", body);

  }
}
