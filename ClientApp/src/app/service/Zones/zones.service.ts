import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ZonesService {
  private readonly baseURL: string = "https://localhost:7123/api/zones/"
  constructor(private httpClient: HttpClient) { }


  public addUpdateZone(zoneID: number | null, zoneName: string, departmentID: number, subDepartmentID: number) {

    const body = {
      ZoneID: zoneID,
      ZoneName: zoneName,
      DepartmentID: departmentID,
      SubDepartmentID: subDepartmentID,
    }
    return this.httpClient.post(this.baseURL + "AddUpdateZone", body);

  }

  public deleteZone(zoneID: number) {

    return this.httpClient.post(this.baseURL + "DeleteZone", zoneID);

  }

  public getZonesList() {

    return this.httpClient.get(this.baseURL + "GetZonesList");

  }
}
