import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubDepartmentsService {
  private readonly baseURL: string = "https://localhost:7123/api/subDepartments/"
  constructor(private httpClient: HttpClient) { }


  public addUpdateSubDepartment(subDepartmentID: number | null, subDepartmentName: string | null, departmentID: number | null, createdById: string | null) {
    debugger;
    const body = {
      SubDepartmentID: subDepartmentID,
      SubDepartmentName: subDepartmentName,
      DepartmentID: departmentID,
      CreatedById: createdById
    }
    return this.httpClient.post(this.baseURL + "AddUpdateSubDepartments", body);

  }

  public deleteSubDepartment(subDepartmentID: number) {

    return this.httpClient.post(this.baseURL + "DeleteSubDepartment", subDepartmentID);

  }

  public getSubDepartmentsList() {

    return this.httpClient.get(this.baseURL + "GetSubDepartmentsList");

  }

  public getSubDepartmentsByDepartmentID(departmentId : number) {
    debugger;
    const body = {
 
      DepartmentID: departmentId,
      
    }
    return this.httpClient.post(this.baseURL + "GetSubDepartmentByDepartmentID", body);

  }
}
