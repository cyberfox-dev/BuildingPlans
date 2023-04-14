import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class CommentBuilderService {


  private readonly apiUrl: string = this.sharedService.getApiUrl();
  private readonly baseURL: string = this.apiUrl + "commentBuilder/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  /*  , roleType: string | null, roleDescription: string | null, createdById: string | null*/

  public addUpdateComment(commentID: string | null, commentName: string | null, createdByID: string | null) {

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

  public getCommentByUserID(userID: any) {
    const body = {
      UserID: userID,
    }
    return this.httpClient.post(this.baseURL + "GetCommentByUserID", body);

  }



}
