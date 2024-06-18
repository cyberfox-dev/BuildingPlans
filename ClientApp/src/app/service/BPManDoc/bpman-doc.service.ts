import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class BPManDocService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bPManDoc/";
  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public getAllMandatoryDocuments() {
    debugger;
    return this.httpClient.get(this.baseURL + "GetAllMandatoryDocuments");

  }
}
