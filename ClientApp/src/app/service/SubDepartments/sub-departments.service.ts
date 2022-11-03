import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubDepartmentsService {
  private readonly baseURL: string = "https://localhost:7123/api/subdepartments/"
  constructor(private httpClient: HttpClient) { }


  public addUpdateSubDepartment(subDepartmentID: number | null, subDepartmentName: string | null, departmentID: number | null) {

    const body = {
      SubDepartmentID: subDepartmentID,
      SubDepartmentName: subDepartmentName,
      DepartmentID: departmentID,
    }
    return this.httpClient.post(this.baseURL + "AddUpdateSubDepartment", body);

  }

  public deleteSubDepartment(subDepartmentID: number) {

    return this.httpClient.post(this.baseURL + "DeleteSubDepartment", subDepartmentID);

  }

  public getSubDepartmentsList(subDepartmentID: any) {

    return this.httpClient.get(this.baseURL + "GetSubDepartmentsList", subDepartmentID);

  }
}
