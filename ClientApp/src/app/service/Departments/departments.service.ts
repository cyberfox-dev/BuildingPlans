import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {

  private readonly apiUrl: string = this.sharedService.getApiUrl();
  private readonly baseURL: string = this.apiUrl + "departments/";


  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateDepartment(departmentID: number | null, departmentName: string | null,hasSubDepartment :boolean ,createdById?:string  ) {
   
    const body = {
      DepartmentID: departmentID,
      DepartmentName: departmentName,
      hasSubDepartment: hasSubDepartment,
      CreatedById: createdById,
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

    return this.httpClient.get(this.baseURL + "GetDepartmentsList");

  }
}
