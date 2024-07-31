import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class BpDepartmentForCommentService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "BPDepartmentForComment/";
  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateDepartmentForComment(BPDepartmentForCommentID: number | null, applicationID: number | null, DepartmentID: number | null, DepartmentName: string | null, userAssaignedToComment: string | null, commentStatus: string | null, createdByID: string | null) {

    const body = {
      BPDepartmentForCommentID: BPDepartmentForCommentID,
      ApplicationID: applicationID,
      DepartmentID: DepartmentID,
      DepartmentName: DepartmentName,
      UserAssaignedToComment: userAssaignedToComment,
      CommentStatus: commentStatus,
      CreatedById: createdByID,

    }
    return this.httpClient.post(this.baseURL + "AddUpdateDepartmentForComment", body);

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



  public getDepartmentForComment(applicationID: number | null) {

    const body = {
      ApplicationID: applicationID,
    }
    return this.httpClient.post(this.baseURL + "GetDepartmentForComment", body);

  }
  public getDepartmentForCommentByDepID(applicationID: number | null, DepartmentID: number | null, userID?: number | null) {

    const body = {
      ApplicationID: applicationID,
      DepartmentID: DepartmentID,
      UserAssaignedToComment: userID,
    }
    return this.httpClient.post(this.baseURL + "GetDepartmentForCommentByDepID", body);

  }

  public updateCommentStatus(BPDepartmentForCommentID: number | null, commentStatus: string | null, isAwaitingClarity: boolean | null, userAssaignedToComment?: string | null, isFinalApproved?: boolean | null) {

    const body = {

      isAwaitingClarity: isAwaitingClarity,
      BPDepartmentForCommentID: BPDepartmentForCommentID,
      CommentStatus: commentStatus,
      UserAssaignedToComment: userAssaignedToComment,
      isFinalApproved: isFinalApproved,
    }
    return this.httpClient.post(this.baseURL + "UpdateCommentStatus", body);

  }

}
