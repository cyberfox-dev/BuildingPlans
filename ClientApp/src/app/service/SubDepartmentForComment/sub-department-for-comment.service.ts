import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class SubDepartmentForCommentService {

  private readonly apiUrl: string = this.sharedService.getApiUrl();
  private readonly baseURL: string = this.apiUrl + "subDepartmentForComment/";


  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

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

  public departmentForCommentUserAssaignedToComment(subDepartmentForCommentID: number | null, userAssaignedToComment: string | null) {

    const body = {
      SubDepartmentForCommentID: subDepartmentForCommentID,
      UserAssaignedToComment: userAssaignedToComment,

    }
    return this.httpClient.post(this.baseURL + "DepartmentForCommentUserAssaignedToComment", body);
  }

  public departmentForCommentFinalAppovalUserToComment(subDepartmentForCommentID: number | null, userAssaignedToComment: string | null) {

    const body = {
      SubDepartmentForCommentID: subDepartmentForCommentID,
      UserAssaignedToComment: userAssaignedToComment,

    }
    return this.httpClient.post(this.baseURL + "DepartmentForCommentFinalAppovalUserToComment", body);

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
  public getSubDepartmentForCommentBySubID(applicationID: number | null, subDepartmentID: number|null) {

    const body = {
      ApplicationID: applicationID,
      SubDepartmentID: subDepartmentID,
    }
    return this.httpClient.post(this.baseURL + "GetSubDepartmentForCommentBySubID", body);

  }


  public updateCommentStatus(subDepartmentForCommentID: number | null, commentStatus: string | null, isAwaitingClarity: boolean | null, isRefered?: boolean | null, userAssaignedToComment?: string | null) {

    const body = {

      isRefered: isRefered,
      isAwaitingClarity: isAwaitingClarity,
      SubDepartmentForCommentID: subDepartmentForCommentID,
      CommentStatus: commentStatus,
      UserAssaignedToComment: userAssaignedToComment
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

