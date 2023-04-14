import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubDepartmentsService {
  private readonly baseURL: string = "http://197.242.150.226:7123/api/subDepartments/"
  constructor(private httpClient: HttpClient) { }


  public addUpdateSubDepartment(subDepartmentID: number | null, subDepartmentName: string | null, departmentID: number | null, createdById: string | null) {
    
    const body = {
      SubDepartmentID: subDepartmentID,
      SubDepartmentName: subDepartmentName,
      DepartmentID: departmentID,
      CreatedById: createdById
    }
    return this.httpClient.post(this.baseURL + "AddUpdateSubDepartments", body);

  }


  public addDepartmentAdmin(subDepartmentID: number | null, DepartmentAdminUserID:string) {

    const body = {
      SubDepartmentID: subDepartmentID,
      SubDepartmentAdminUserID: DepartmentAdminUserID,
  
    }
    return this.httpClient.post(this.baseURL + "AddSubDepartmentAdmin", body);

  }

  public deleteSubDepartment(subDepartmentID: number) {

    return this.httpClient.post(this.baseURL + "DeleteSubDepartments", subDepartmentID);

  }

  public getSubDepartmentsList() {

    return this.httpClient.get(this.baseURL + "GetAllSubDepartments");

  }
  public getAllNotLinkedSubDepartmentsForComment(applicationID: number) {

    return this.httpClient.post(this.baseURL + "GetAllNotLinkedSubDepartmentsForComment", applicationID);

  }

  public getAllLinkedSubDepartmentsForComment(applicationID: number) {

    return this.httpClient.post(this.baseURL + "GetAllLinkedSubDepartmentsForComment", applicationID);

  }

  public getSubDepartmentsByDepartmentID(departmentId : number) {
  
    const body = {
 
      DepartmentID: departmentId,
      
    }
    return this.httpClient.post(this.baseURL + "GetSubDepartmentByDepartmentID", body);

  }
  
  public getAllSubDepartmentsForAutoDistribution() {

    return this.httpClient.get(this.baseURL + "GetAllSubDepartmentsForAutoDistribution");

  }

}
