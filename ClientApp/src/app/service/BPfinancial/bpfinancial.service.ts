import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class BPFinancialService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bPFinancial/";


  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateFinancial(financialID?: number | null, financialName?: string | null, financialType?: string | null, documentName?: string | null, documentLocalPath?: any | null, applicationID?: number | null, createdById?: string | null) {
    const body = {
      FinancialID: financialID,
      FinancialName: financialName,
      FinancialType: financialType,
      FinancialDocumentName: documentName,
      FinancialDocumentLocalPath: documentLocalPath,
      ApplicationID: applicationID,
      CreatedById: createdById,
    }
    return this.httpClient.post(this.baseURL + "AddUpdateFinancial", body);
  }


  public deleteFinancial(financialID: number) {

    return this.httpClient.post(this.baseURL + "DeleteFinancial", financialID);

  }
  DeleteFinancial

  public getFinancialByApplicationID(ApplicationID: number) {

    return this.httpClient.post(this.baseURL + "GetFinancialByApplicationID", ApplicationID);

  }
}
