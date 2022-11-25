import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ZonesService {
  private readonly baseURL: string = "https://localhost:7123/api/zones/"
  constructor(private httpClient: HttpClient) { }


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
    debugger;
    const body = {

      SubDepartmentID: subDepartmentId,

    }
    return this.httpClient.post(this.baseURL + "GetZoneBySubDepartmentID", body);

  }
}
