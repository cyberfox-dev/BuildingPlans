import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DepositRequiredService {

  private readonly baseURL: string = "https://localhost:7123/api/depositRequired/"

  constructor(private httpClient: HttpClient) { }


  public addUpdateDepositRequired(depositRequiredID?: number | null, subDepartmentForCommentID?: number | null, rate?: number | null, applicationID?: number | null, desciption?: string | null, subDepartmentID?: number | null, quantity?: number | null ,createdById?: string | null) {
    const body = {
      DepositRequiredID: depositRequiredID,
      SubDepartmentForCommentID: subDepartmentForCommentID,
      Rate: rate,
      ApplicationID: applicationID,
      Desciption: desciption,
      SubDepartmentID: subDepartmentID,
      Quantity: quantity,
      CreatedById: createdById
    }
    return this.httpClient.post(this.baseURL + "AddUpdateDepositRequired", body);
  }

  public deleteDepositRequiredByID(depositRequiredID: number) {

    return this.httpClient.post(this.baseURL + "DeleteDepositRequiredByID", depositRequiredID);

  }

  public getDepositRequiredByApplicationID(applicationID: number) {
   
    return this.httpClient.post(this.baseURL + "GetDepositRequiredByApplicationID", applicationID);

  }

}
