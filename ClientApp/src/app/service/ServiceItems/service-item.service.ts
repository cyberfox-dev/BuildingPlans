import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ServiceItemService {
  private readonly baseURL: string = "http://197.242.150.226:7123/api/serviceItem/"
  constructor(private httpClient: HttpClient) { }



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
