import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';


@Injectable({
  providedIn: 'root'
})
export class BPEmailMessagesService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "emailMessages/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateEmailMessage(emailMessageID: number | null, emailMessage: string | null , category :string | null ,createdById :string | null) {
    const body = {
      EmailMessageID: emailMessageID,
      EmailMessage: emailMessage,
      Category: category,
      CreatedById : createdById
    }

    return this.httpClient.post(this.baseURL + "AddUpdateEmailMessage", body);
  }

  public getAllEmailMessages() {

    return this.httpClient.get(this.baseURL + "GetAllEmailMessages");
  }

  public getAllEmailMessagesFroCategory(category:string | null) {
    const body = {
      Category :category
    }

    return this.httpClient.post(this.baseURL + "GetAllEmailMessagesForCategory", body);
  }

  public deleteEmailMessageByEmailMessageID(emailMessageID:number | null ) {
    const body = {
      EmailMessageID: emailMessageID
    }

    return this.httpClient.post(this.baseURL + "DeleteEmailMessageByEmailMessageID", body);
  }
}
