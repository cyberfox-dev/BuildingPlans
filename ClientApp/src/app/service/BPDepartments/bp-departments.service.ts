import { Injectable } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BpDepartmentsService {
  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bpDepartments/";


  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateDepartment(departmentID: number | null, departmentName: string | null, hasSubDepartment?: boolean, createdById?: string, functionalArea?: string ) {
    debugger;
    const body = {
      DepartmentID: departmentID,
      DepartmentName: departmentName,
      hasSubDepartment: hasSubDepartment,
      CreatedById: createdById,
      FunctionalArea: functionalArea
    }
    return this.httpClient.post(this.baseURL + "AddUpdateDepartments", body);

  }

  public deleteDepartment(departmentID: number) {

    return this.httpClient.post(this.baseURL + "DeleteDepartments", departmentID);

  }

  public getDepartmentByDepartmentID(departmentID: number) {

    return this.httpClient.post(this.baseURL + "GetDepartmentByDepartmentID", departmentID);

  }

  public getDepartmentsList() {

    return this.httpClient.get(this.baseURL + "GetAllDepartments");

  }

  public getAllDepartmentsForFunctionalArea(functionalArea) {
    debugger;
    const body = {
      FunctionalArea: functionalArea,
      hasSubDepartment:false
    }
    return this.httpClient.post(this.baseURL + "GetAllDepartmentsForFunctionalArea", body);
  }

  public getDepartmentByDepartmentName(departmentName: string | null) {
    const body = {
      DepartmentName: departmentName
    }

    return this.httpClient.post(this.baseURL + "GetDepartmentByDepartmentName", body);
  }
}
