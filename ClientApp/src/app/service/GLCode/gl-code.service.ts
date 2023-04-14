import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class GlCodeService {

  private readonly baseURL: string = "http://197.242.150.226:7123/api/glCode/"
  constructor(private httpClient: HttpClient) { }

  public addUpdateGLCode(glCodeID: number | null, glCodeName: string | null, createdByID: string | null, profitCenter: string | null) {

    const body = {
      glCodeID: glCodeID,
      glCodeName: glCodeName,
      CreatedByID: createdByID,
      ProfitCenter: profitCenter

    }
    return this.httpClient.post(this.baseURL + "AddUpdateGLCode", body);

  }

  public deleteGLCode(glCodeID: number) {

    return this.httpClient.post(this.baseURL + "DeleteGLCode", glCodeID);

  }

  public getGLCodeByID(glCodeID: any) {

    return this.httpClient.post(this.baseURL + "GetGLCodeByID", glCodeID);

  }

  public getAllGLCodes() {

    return this.httpClient.get(this.baseURL + "GetAllGLCodes");

  }

  public setLinkDepartmentToGLCode(glCodeID: any, departmentID: any,departmentName:any| null) {

    const body = {
      GLCodeID: glCodeID,
      DepartmentID: departmentID,
      DepartmentName: departmentName  

    }

    return this.httpClient.post(this.baseURL + "SetLinkDepartmentToGLCode",body);

  }
}
