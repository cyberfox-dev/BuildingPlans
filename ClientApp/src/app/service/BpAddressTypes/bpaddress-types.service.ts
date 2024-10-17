import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class BPAddressTypesService {


  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bPAddressTypes/";
  //BPAddressTypes
  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public getAllAddressTypes() {
    
    console.log(this.apiUrl)
    return this.httpClient.get(this.baseURL +"GetAllAddressTypes")
  }

  public addUpdateAddressType(iD: number | null, Type: string | null, createdById: string) {
    const body = {
      AddressTypeID: iD,
      TypeName: Type,
      CreatedByID: createdById
    }
    
    
    return this.httpClient.post(this.baseURL + "AddUpdateAddressType", body);
  }

 
}
