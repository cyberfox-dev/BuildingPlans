import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ZoneForCommentService {

  private readonly apiUrl: string = this.sharedService.getApiUrl();
  private readonly baseURL: string = this.apiUrl + "zoneForComment/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateZoneForComment(zoneForCommentID: number | null, subDepartmentID: number | null, applicationID: number | null, ZoneID: number | null, ZoneName: string | null, createdByID: string | null) {
    debugger;
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
