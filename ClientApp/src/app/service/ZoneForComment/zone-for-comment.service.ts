import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ZoneForCommentService {
  private readonly baseURL: string = "https://localhost:7123/api/zoneForComment/"

  constructor(private httpClient: HttpClient) { }

  public addUpdateZoneForComment(zoneForCommentID: number | null, subDepartmentID: number | null, applicationID: number | null, ZoneID: number | null, ZoneName: string | null, createdByID: string | null) {

    const body = {
      ZoneForCommentID: zoneForCommentID,
      ApplicationID: applicationID,
      SubDepartmentID: subDepartmentID,
      ZoneID: ZoneID,
      ZoneName: ZoneName,
      CreatedById: createdByID,

    }
    return this.httpClient.post(this.baseURL + "AddUpdateZoneForComment", body);

  }

  public deleteZoneForComment(zoneForCommentID: number) {

    return this.httpClient.post(this.baseURL + "DeleteZoneForComment", zoneForCommentID);

  }


  public getZonesForComment(applicationID: number | null, subDepartmentID: number | null) {

    const body = {

      ApplicationID: applicationID,
      SubDepartmentID: subDepartmentID,

    }
    return this.httpClient.post(this.baseURL + "GetZonesForComment", body);

  }

}
