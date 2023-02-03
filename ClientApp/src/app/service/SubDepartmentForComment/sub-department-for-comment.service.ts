import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SubDepartmentForCommentService {

  private readonly baseURL: string = "https://localhost:7123/api/subDepartmentForComment/"

  constructor(private httpClient: HttpClient) { }

  public addUpdateDepartmentForComment(subDepartmentForCommentID: number | null, applicationID: number | null, subDepartmentID: number | null, subDepartmentName: string | null, userAssaignedToComment: string | null, commentStatus: string | null,createdByID: string | null) {

    const body = {
      SubDepartmentForCommentID: subDepartmentForCommentID,
      ApplicationID: applicationID,
      SubDepartmentID: subDepartmentID,
      SubDepartmentName: subDepartmentName,
      UserAssaignedToComment: userAssaignedToComment,
      CommentStatus: commentStatus,
      CreatedById: createdByID,

    }
    return this.httpClient.post(this.baseURL + "AddUpdateDepartmentForComment", body);

  }

  public deleteDepartmentForComment(subDepartmentForCommentID: number) {

    return this.httpClient.post(this.baseURL + "DeleteDepartmentForComment", subDepartmentForCommentID);

  }

  public getSubDepartmentForComment(applicationID: number | null ) {

    const body = {
      ApplicationID: applicationID,
    }
    return this.httpClient.post(this.baseURL + "GetSubDepartmentForComment", body);

  }


  public updateCommentStatus(subDepartmentForCommentID: number | null, commentStatus: string | null) {

    const body = {
      SubDepartmentForCommentID: subDepartmentForCommentID,
      CommentStatus: commentStatus,
    }
    return this.httpClient.post(this.baseURL + "UpdateCommentStatus", body);

  }


  public updateCommentStatusToAwaitingClarity(subDepartmentForCommentID: number | null, commentStatus: string | null, isAwaitingClarity: boolean | null) {

    const body = {
      SubDepartmentForCommentID: subDepartmentForCommentID,
      CommentStatus: commentStatus,
      isAwaitingClarity: isAwaitingClarity,
    }
    return this.httpClient.post(this.baseURL + "UpdateCommentStatusToAwaitingClarity", body);

  }




}

