import { Injectable } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BPNotificationsService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bPNotifications/";


  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateNotification(notificationId: number | null, applicationId: number | null, notificationName: string | null, notificationDescription: string | null, isRead: boolean | null, userId: string | null, createdById: string | null) {
    
    const body = {
      NotificationID: notificationId,
      ApplicationID: applicationId,
      NotificationName: notificationName,
      NotificationDescription: notificationDescription,
      IsRead: isRead,
      UserId: userId,
      CreatedById :createdById
    }

    return this.httpClient.post(this.baseURL + "AddUpdateNotification", body);
  }

  public getAllNotifications() {

    return this.httpClient.get(this.baseURL + "GetAllNotifications");
  }

  public getAllNewNotificationsForUser(userId: string | null) {
    const body = {
      UserID :userId
    }
    return this.httpClient.post(this.baseURL + "GetAllNewNotificationsForUser", body);
  }

  public deleteNotificationByNotificationID(notificationID: number | null) {
    const body = {
      NotificationID: notificationID
    }

    return this.httpClient.post(this.baseURL + "DeleteNotificationByNotificationID", body);
  }

  public getAllReadNotificationsForUser(userId:string|null) {
    const body = {
      UserId:userId
    }

    return this.httpClient.post(this.baseURL + "GetAllReadNotificationsForUser",body)
  }

  public getNotificationByNotificationID(notificationID: number) {
    const body = {
      NotificationID: notificationID
    }

    return this.httpClient.post(this.baseURL + "GetNotificationByNotificationID", body);
  }


  public getNotificationByApplicationID(applicationID: number | null) {
    const body = {
      ApplicationID: applicationID
    }

    return this.httpClient.post(this.baseURL + "GetNotificationByApplicationID", body);
  }
}
