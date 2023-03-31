import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private readonly baseURL: string = "https://localhost:7123/api/comment/"

  constructor(private httpClient: HttpClient) { }

  public addUpdateComment(CommentID?: number | null, applicationID?: number | null, subDepartmentForCommentID?: number | null, subDepartmentID?: number | null ,subDepartmentName?: string | null ,Comment?: string | null, CommentStatus?: string | null , createdById?: string | null) {
    const body = {
      CommentID: CommentID,
      ApplicationID: applicationID,
      SubDepartmentForCommentID: subDepartmentForCommentID,
      Comment: Comment,
      CommentStatus: CommentStatus,
      CreatedById: createdById,
      SubDepartmentID: subDepartmentID,
      SubDepartmentName: subDepartmentName
    }
    return this.httpClient.post(this.baseURL + "AddUpdateComment", body);
  }

  public getCommentByApplicationID(applicationID: number) {

    return this.httpClient.post(this.baseURL + "GetCommentByApplicationID", applicationID);

  }

  public getSubDepByCommentStatus(CommentStatus: string) {

    return this.httpClient.post(this.baseURL + "GetSubDepByCommentStatus", CommentStatus);

  }

}
