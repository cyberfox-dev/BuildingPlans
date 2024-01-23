import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class AuditTrailService {
   //Audit Trail Kyle 
  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "auditTrail/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateAuditTrailItem(auditTrailID: number | null, applicationID: number | null, description: string | null, isInternal: boolean | null, subDepartmentName: string | null, zoneName: string | null, createdById: string | null) {
    const body = {
      AuditTrailID: auditTrailID,
      ApplicationID: applicationID,
      Description: description,
      IsInternal: isInternal,
      SubDepartmentName: subDepartmentName,
      ZoneName: zoneName,
      CreatedById:createdById
    }
    return this.httpClient.post(this.baseURL + "AddUpdateAuditTrailItem", body);
  }

  public getAllAuditTrailItemsForApplication(applicationID: number | null) {
    const body = {
      ApplicationID: applicationID
    }
    return this.httpClient.post(this.baseURL + "GetAllAuditTrailItemsForApplication", body);
  }

  public deleteAuditTrailItemByAuditTrailID(auditTrailID: number | null) {
    const body = {
      AuditTrailID:auditTrailID
    }
    return this.httpClient.post(this.baseURL + "DeleteAuditTrailItemByAuditTrailID", body);
  }
  
}
