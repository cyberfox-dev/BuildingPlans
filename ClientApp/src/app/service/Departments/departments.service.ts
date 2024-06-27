import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "departments/";


  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateDepartment(departmentID: number | null, departmentName: string | null, hasSubDepartment?: boolean | null, createdById?: string | null, /*zxNumberUpdate Sindiswa 01 March 2024*/ needsZXNumber?: boolean | null  ) {
    
    const body = {
      DepartmentID: departmentID,
      DepartmentName: departmentName,
      hasSubDepartment: hasSubDepartment,
      CreatedById: createdById,
      needsZXNumber: needsZXNumber, //zxNumberUpdate Sindiswa 01 March 2024
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

  //#region zxNumberUpdate Sindiswa 04 March 2024
  public countDepartmentsThatNeedZXNumber() {
    
    
    return this.httpClient.get(this.baseURL + "CountDepartmentsThatNeedZXNumber");

  }
  //#endregion
}
