import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceItemService {

  private readonly apiUrl: string = this.sharedService.getApiUrl();
  private readonly baseURL: string = this.apiUrl + "serviceItem/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }



  public addUpdateServiceItem(ServiceItemID: number | null, ServiceItemCode: string | null, Description: string | null, Rate: number | null, totalVat:number| null, createdById: string) {

    const body = {
      ServiceItemID: ServiceItemID,
      ServiceItemCode: ServiceItemCode,
      Description: Description,
      Rate: Rate,
      TotalVat: totalVat,
      CreatedById: createdById,
    }
    return this.httpClient.post(this.baseURL + "AddUpdateServiceItemCode", body);

  }
  public deleteServiceItem(ServiceItemID: number) {

    return this.httpClient.post(this.baseURL + "DeleteServiceItemID", ServiceItemID);

  }

  public getAllServiceItem() {

    return this.httpClient.get(this.baseURL + "GetAllServiceItem");

  }

  public getServiceItemByServiceItemID(ServiceItemID: number) {

    return this.httpClient.post(this.baseURL + "GetServiceItemByServiceItemID", ServiceItemID);

  }
}
