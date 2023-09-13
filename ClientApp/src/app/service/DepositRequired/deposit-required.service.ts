import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class DepositRequiredService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "depositRequired/";


  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }


  public addUpdateDepositRequired(depositRequiredID?: number | null, subDepartmentForCommentID?: number | null, rate?: number | null, applicationID?: number | null, desciption?: string | null, subDepartmentID?: number | null, quantity?: number | null, createdById?: string | null, subDepartmentName?: string | null, serviceItemCode?: string | null, wbsNumber?: string | null, totalAmount?: number | null, remarks?: string | null, serviceItemCodeID?: number | null) {
    const body = {
      DepositRequiredID: depositRequiredID,
      SubDepartmentForCommentID: subDepartmentForCommentID,
      Rate: rate,
      ApplicationID: applicationID,
      Desciption: desciption,
      SubDepartmentID: subDepartmentID,
      Quantity: quantity,
      CreatedById: createdById,
      SubDepartmentName: subDepartmentName,
      ServiceItemCode: serviceItemCode,
      Wbs: wbsNumber,
      TotalAmount: totalAmount,
      Remarks: remarks,
      ServiceItemCodeID: serviceItemCodeID,
    }
    return this.httpClient.post(this.baseURL + "AddUpdateDepositRequired", body);
  }

  public deleteDepositRequiredByID(depositRequiredID: number) {

    return this.httpClient.post(this.baseURL + "DeleteDepositRequiredByID", depositRequiredID);

  }

  public getDepositRequiredByApplicationID(applicationID: number) {
   
    return this.httpClient.post(this.baseURL + "GetDepositRequiredByApplicationID", applicationID);

  }

  public addUpdateWBSNUmber(depositRequiredID?: number | null, createdById?: string | null, wbsNumber?: string | null) {
    const body = {
      DepositRequiredID: depositRequiredID,
      Wbs: wbsNumber,
      CreatedById: createdById,
    }
    return this.httpClient.post(this.baseURL + "AddUpdateDepositRequired", body);
  }


}
