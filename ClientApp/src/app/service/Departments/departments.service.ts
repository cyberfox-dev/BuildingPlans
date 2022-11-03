import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {
  private readonly baseURL: string = "https://localhost:7123/api/departments/"

  constructor(private httpClient: HttpClient) { }

  public addUpdateDepartment(departmentID: number | null, departmentName: string) {

    const body = {
      DepartmentID: departmentID,
      DepartmentName: departmentName,
    }
    return this.httpClient.post(this.baseURL + "AddUpdateDepartment", body);

  }

  public deleteDepartment(departmentID: number) {

    return this.httpClient.post(this.baseURL + "DeleteDepartment", departmentID);

  }

  public getDepartmentsList(departmentID: any) {

    return this.httpClient.get(this.baseURL + "GetDepartmentsList", departmentID);

  }
}
