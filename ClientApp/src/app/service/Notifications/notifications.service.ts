import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  //Send emails
  to = 'venolin@outlook.com';
  subject = 'Test';
  text = 'testing 1, 2, 3 ...';

  private readonly apiUrl: string = this.sharedService.getApiUrl();
  private readonly baseURL: string = this.apiUrl + "notification/";


  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateNotification(notificationID?: number | null, notificationName?: string | null, notificationDescription?: string | null, isRead?: boolean | null, userID?: string | null, createdByID?: string | null, applicationID?: number | null) {
    
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

  public sendEmail(to :string,subject: string,text: string): void {
    const emailData = {
      to: to,
      subject: subject,
      text: text,
     
    };

    this.httpClient.post("http://localhost:7124" + "/send-email", emailData).subscribe(
/*    this.httpClient.post("https://wayleaveqa.capetown.gov.za:7124" + "/send-email", emailData).subscribe(*/
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

}
