import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class AccessGroupUserLinkServiceService {
  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "accessGroupUserLink/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public getAccessGroupByUserID(userID: string) {
    // Create an object with the userID property
    const requestBody = { userID: userID };

    return this.httpClient.post(this.baseURL + "GetAccessGroupByUserID", requestBody);
  }
}
