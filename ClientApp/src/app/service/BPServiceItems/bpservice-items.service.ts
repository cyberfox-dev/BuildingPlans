import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';
import { throwDialogContentAlreadyAttachedError } from '@angular/cdk/dialog';

@Injectable({
  providedIn: 'root'
})
export class BPServiceItemsService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bPServiceItems/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateServiceItem(serviceItemID: number | null, serviceItemCode: string | null, description: string | null, rate: number | null, totalVat: number | null, category: string | null, functionalArea: string | null, createdById: string | null, vatApplicable: boolean | null) {
    const body = {
      ServiceItemID: serviceItemID,
      ServiceItemCode: serviceItemCode,
      Description: description,
      Rate: rate,
      TotalVat: totalVat,
      Category: category,
      FunctionalArea: functionalArea,
      VatApplicable: vatApplicable,
      CreatedById: createdById
    }

    return this.httpClient.post(this.baseURL + "AddUpdateServiceItem", body);
  }

  public getAllServiceItems() {

    return this.httpClient.get(this.baseURL + "GetAllServiceItems");
  }

  public getServiceItemByCategory(category: string | null) {
    const body = {
      Category: category
    }

    return this.httpClient.post(this.baseURL + "GetServiceItemByCategory", body);
  }
  public getServiceItemByServiceItemID(serviceItemID: number | null) {
    const body = {
      ServiceItemID:serviceItemID
    }

    return this.httpClient.post(this.baseURL + "GetServiceItemByServiceItemID", body);
  }
}
