import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  //Send emails
/*  to = 'venolin@outlook.com';
  subject = 'Test';
  text = 'testing 1, 2, 3 ...';*/

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "notification/";


  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateNotification(notificationID?: number | null, notificationName?: string | null, notificationDescription?: string | null, isRead?: boolean | null, userID?: string | null, createdByID?: string | null, applicationID?: number | null , message?:string | null) {
    debugger;
    const body = {
      NotificationID: notificationID,
      NotificationName: notificationName,
      NotificationDescription: notificationDescription,
      IsRead: isRead,
      UserID: userID,
      ApplicationID: applicationID,
      CreatedById: createdByID,
      Message : message
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
  // #region escalation Sindiswa 30 January 2024 & 31 January 2024
  public getNotificationsForUserID(userID?: string) {
    debugger;
    const body = {
  
      UserID: userID,

    }
    return this.httpClient.post(this.baseURL + "GetNotificationsForUserID", body);

  }
  public getNotificationByNotificationID(notificationID: any) {

    return this.httpClient.post(this.baseURL + "GetNotificationByNotificationID", notificationID);

  }
  // #endregion
  public sendEmail(to: string, subject: string, text: string, html: string): void {
    const emailData = {
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    ////dev check
/*    if (emailData.to !== 'jahdiel@cyberfox.co.za') {

      emailData.to = 'jahdiel@cyberfox.co.za';
    } else {

    }*/

    const username = 'venolin'; // Replace with your actual username
    const password = '%VUkrO9@5a^0TO4k'; // Replace with your actual password
    const credentials = `${username}:${password}`;
    const encodedCredentials = btoa(credentials);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Basic ${encodedCredentials}`, // Set the Authorization header
    });


    
    this.httpClient.post(this.sharedService.getApiUrl() + "/mailapi/" + "send-email", emailData, { headers }).subscribe(
      
/*      this.httpClient.post("https://wayleave.capetown.gov.za/mailapi" + "/send-email", emailData, { headers }).subscribe(*/
      () => {
        console.log('Email sent successfully');
        // Handle success, e.g., show a success message
      },
      (error) => {
        console.error('Error sending email:', error);
        // Handle error, e.g., show an error message
      }
    );
  }

  // #region notifications Sindiswa 12 February 2024
  public getNotificationsCount(userID: string) {
    debugger;
    const body = {

      UserID: userID,

    }
    return this.httpClient.post(this.baseURL + "GetUnreadNotificationsCount", body);
  }
  // #endregion
}
