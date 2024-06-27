import { Injectable } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ZXNumberService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "zxNumber/";
  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }
  public addUpdateZXNumber(zxNumberID: number, applicationID: number, departmentID: number, departmentName:string, zxNumber:string, createdByID:string) {
    
    const body = {
      ZXNumberID: zxNumberID,
      ApplicationID: applicationID,
      DepartmentID: departmentID,
      DepartmentName: departmentName,
      ZxNumber: zxNumber,
      CreatedById:createdByID
    }
    return this.httpClient.post(this.baseURL + "AddUpdateZXNumber", body);
  }

  public getZXNumberByApplicationID(applicationID: number) {

    return this.httpClient.post(this.baseURL + "GetZXNumbersByApplicationID", applicationID);
  }

  public getZXNumberByDepartmentID(applicationID:number, departmentID:number) {
    
    const body = {
      ApplicationID: applicationID,
      DepartmentID: departmentID,
    }
    return this.httpClient.post(this.baseURL + "GetZXNumbersByDepartmentID", body);
  }
}
