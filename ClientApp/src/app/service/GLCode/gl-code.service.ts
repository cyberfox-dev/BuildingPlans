import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class GlCodeService {

  private readonly baseURL: string = "https://localhost:7123/api/glCode/"
  constructor(private httpClient: HttpClient) { }

  public addUpdateGLCode(glCodeID: number | null, glCodeName: string | null, createdByID: string | null) {

    const body = {
      glCodeID: glCodeID,
      glCodeName: glCodeName,
      CreatedByID: createdByID,

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
}
