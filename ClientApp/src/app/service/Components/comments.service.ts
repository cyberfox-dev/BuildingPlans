import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "comments/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }


  public addUpdateComment(commentID: string | null, commentName: string | null, createdByID: string | null)
  {

    const body = {
      commentID: commentID,
      commentName: commentName,
      createdByID: createdByID,

    }
    return this.httpClient.post(this.baseURL + "AddUpdateComment", body);

  }

  public deleteComment(commentID: number) {

    return this.httpClient.post(this.baseURL + "DeleteComment", commentID);

  }

  public getCommentByApplicationID(applicationID: any) {
    const body = {
      ApplicationID: applicationID,
    }
    return this.httpClient.post(this.baseURL + "GetCommentByApplicationID", body);

  }


}
