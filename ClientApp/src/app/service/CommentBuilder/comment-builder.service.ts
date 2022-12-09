import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommentBuilderService {

  private readonly baseURL: string = "https://localhost:7123/api/roles/"
  constructor(private httpClient: HttpClient) { }

  /*  , roleType: string | null, roleDescription: string | null, createdById: string | null*/

  public addUpdateComment(commentID: string | null, commentName: string | null, createdByID: string | null) {

    const body = {
      CommentID: commentID,
      CommentName: commentName,
      createdByID: createdByID,

    }
    return this.httpClient.post(this.baseURL + "AddUpdateComment", body);

  }

  public deleteComment(commentID: number) {

    return this.httpClient.post(this.baseURL + "DeleteComment", commentID);

  }

  public getCommentByUserID(userID: any) {

    return this.httpClient.get(this.baseURL + "GetCommentByUserID", userID);

  }



}
