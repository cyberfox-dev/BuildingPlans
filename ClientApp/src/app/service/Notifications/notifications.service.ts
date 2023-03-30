import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private readonly baseURL: string = "https://localhost:7123/api/notification/"

  constructor(private httpClient: HttpClient) { }

  public addUpdateNotification(notificationID: number | null, notificationName: string | null, notificationDescription: string | null, isRead: boolean | null, userID: number | null, createdByID: string | null, applicationID: number | null) {

    const body = {
      notificationID: notificationID,
      notificationName: notificationName,
      notificationDescription: notificationDescription,
      isRead: isRead,
      userID: userID,
      applicationID: applicationID,
      createdByID: createdByID,

    }
    return this.httpClient.post(this.baseURL + "AddUpdateNotification", body);

  }

  public getNotificationByID(applicationID: any ) {

    return this.httpClient.post(this.baseURL + "GetNotificationByID", applicationID);

  }

}
