import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private readonly apiUrl: string = this.sharedService.getApiUrl();
  private readonly baseURL: string = this.apiUrl + "notification/";


  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateNotification(notificationID?: number | null, notificationName?: string | null, notificationDescription?: string | null, isRead?: boolean | null, userID?: string | null, createdByID?: string | null, applicationID?: number | null) {
    debugger;
    const body = {
      NotificationID: notificationID,
      NotificationName: notificationName,
      NotificationDescription: notificationDescription,
      IsRead: isRead,
      UserID: userID,
      ApplicationID: applicationID,
      CreatedById: createdByID,

    }
    return this.httpClient.post(this.baseURL + "AddUpdateNotification", body);

  }

  public getNotificationByID(applicationID: any ) {

    return this.httpClient.post(this.baseURL + "GetNotificationByID", applicationID);

  }

  public getNotificationByUserID(createdByID?: string) {

    const body = {
  
      CreatedById: createdByID,

    }
    return this.httpClient.post(this.baseURL + "GetNotificationByUserID", body);

  }

}
