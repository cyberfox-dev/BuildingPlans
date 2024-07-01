import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';
import { User } from 'oidc-client';


@Injectable({
  providedIn: 'root'
})
export class UserLinkToArchitectService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "userLinkToArchitect/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateLinkedUser(userLinkId:number|null , architectUserId:string|null,architectName:string | null,clientUserId:string|null , clientFullName:string|null,createdById:string|null , address:string|null) {
    
    const body = {
      UserLinkID: userLinkId,
      ArchitectUserID: architectUserId,
      ArchitectName: architectName,
      Address:address,
      ClientUserId: clientUserId,
      ClientFullName: clientFullName,
      CreatedById: createdById
    }

    return this.httpClient.post(this.baseURL + "AddUpdateLinkedUser", body);
  }

  public getAllClientsForArchitect(ArchitectUserId: string | null) {
    const body = {
      ArchitectUserID: ArchitectUserId
    }
    return this.httpClient.post(this.baseURL + "GetAllClientsForArchitect",body)
  }

  public deleteUserLinkToArchitect(UserLinkId: number | null) {
    const body = {
      UserLinkID: UserLinkId
    }

    return this.httpClient.post(this.baseURL + "DeleteUserLinkToArchitect", body);
  }

  public getArchitectsForUser(UserId: string | null) {
    const body = {
      ClientUserId:UserId
    }
    return this.httpClient.post(this.baseURL + "GetArchitectForUser", body);
  }
}
