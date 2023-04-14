import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private readonly baseURL: string = "http://197.242.150.226:7123/api/notification/"

  constructor(private httpClient: HttpClient) { }

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

}
