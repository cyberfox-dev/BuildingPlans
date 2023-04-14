import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
  private readonly baseURL: string = "http://197.242.150.226:7123/api/departments/"

  constructor(private httpClient: HttpClient) { }

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

  public getDepartmentsList() {

    return this.httpClient.get(this.baseURL + "GetDepartmentsList");

  }
}
