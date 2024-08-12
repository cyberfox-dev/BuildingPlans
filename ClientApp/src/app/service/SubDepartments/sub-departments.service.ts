import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class SubDepartmentsService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "subDepartments/";


  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }


  public addUpdateSubDepartment(subDepartmentID: number | null, subDepartmentName: string | null, departmentID: number | null, createdById: string | null, glCode: string | null, profitCenter: string | null, permitExpiration: number | null, wayleaveExpiration: number | null, needsZXNumber: boolean | null) {

    const body = {
      SubDepartmentID: subDepartmentID,
      SubDepartmentName: subDepartmentName,
      DepartmentID: departmentID,
      CreatedById: createdById,
      GlCode: glCode,
      ProfitCenter: profitCenter,
      PermitExpiration: permitExpiration,
      WayleaveExpiration: wayleaveExpiration,
      needsZXNumber: needsZXNumber, //zxNum Sindiswa 08 Fenruary 2024
    }
    return this.httpClient.post(this.baseURL + "AddUpdateSubDepartments", body);

  }


  public addDepartmentAdmin(subDepartmentID: number | null, DepartmentAdminUserID: string) {

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

  public getSubDepartmentsByDepartmentID(departmentId: number) {

    const body = {

      DepartmentID: departmentId,

    }
    return this.httpClient.post(this.baseURL + "GetSubDepartmentByDepartmentID", body);

  }

  public getSubDepartmentBySubDepartmentID(subDepID: number) {

    const body = {

      SubDepartmentID: subDepID,

    }
    return this.httpClient.post(this.baseURL + "GetSubDepartmentBySubDepartmentID", body);

  }

  public getAllSubDepartmentsForAutoDistribution() {

    return this.httpClient.get(this.baseURL + "GetAllSubDepartmentsForAutoDistribution");

  }
  public GetSubDepartmentID(selectedSubDepartment: number) {

    const body = {

      SubDepartmentID: selectedSubDepartment,

    }
    return this.httpClient.post(this.baseURL + " GetSubDepartmentID", body);
  }

  public getSubDepartmentForComment(applicationID: number | null) {
    const body = {
      ApplicationID :applicationID
    }
    return this.httpClient.post(this.baseURL + "GetSubDepartmentForComment", body);
  }
}
