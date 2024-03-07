import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class SubDepartmentForCommentService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "subDepartmentForComment/";


  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateDepartmentForComment(subDepartmentForCommentID: number | null, applicationID: number | null, subDepartmentID: number | null, subDepartmentName: string | null, userAssaignedToComment: string | null, commentStatus: string | null, createdByID: string | null, zoneID: number | null, zoneName: string | null) {

    const body = {
      SubDepartmentForCommentID: subDepartmentForCommentID,
      ApplicationID: applicationID,
      SubDepartmentID: subDepartmentID,
      SubDepartmentName: subDepartmentName,
      UserAssaignedToComment: userAssaignedToComment,
      CommentStatus: commentStatus,
      CreatedById: createdByID,
      ZoneID: zoneID,
      ZoneName: zoneName,

    }
    return this.httpClient.post(this.baseURL + "AddUpdateDepartmentForComment", body);

  }
          //JJS GISReviewer 04-03-24
  public departmentForCommentUserAssaignedToComment(subDepartmentForCommentID: number | null, userAssaignedToComment: string | null, isGISReviewing: boolean|null,GISReviewerUserID:string|null) {

    const body = {
      SubDepartmentForCommentID: subDepartmentForCommentID,
      UserAssaignedToComment: userAssaignedToComment,
      isGISReviewing: isGISReviewing,
      GISReviewerUserID: GISReviewerUserID
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
  public getSubDepartmentForCommentBySubID(applicationID: number | null, subDepartmentID: number | null, userID?: number | null) {

    const body = {
      ApplicationID: applicationID,
      SubDepartmentID: subDepartmentID,
      UserAssaignedToComment: userID,
    }
    return this.httpClient.post(this.baseURL + "GetSubDepartmentForCommentBySubID", body);

  }


  public updateCommentStatus(subDepartmentForCommentID: number | null, commentStatus: string | null, isAwaitingClarity: boolean | null, isRefered?: boolean | null, userAssaignedToComment?: string | null, finalApproval?: boolean | null) {

    const body = {

      isRefered: isRefered,
      isAwaitingClarity: isAwaitingClarity,
      SubDepartmentForCommentID: subDepartmentForCommentID,
      CommentStatus: commentStatus,
      UserAssaignedToComment: userAssaignedToComment,
      FinalApproval: finalApproval
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

  // #region actionCentreEdits Sindiswa 16 January 2024
  public getAssignedReviewer(applicationID: number | null, subDepartmentID: | null, zoneID: | null) {
    
    const body = {
      ApplicationID: applicationID,
      SubDepartmentID: subDepartmentID,
      ZoneID: zoneID,
    }
    return this.httpClient.post(this.baseURL + "GetAssignedReviewer", body);

  }

  public assignSeniorReviewerOrFinalApprover(subDepartmentForCommentID: number | null, userAssaignedToComment?: string | null) {
    const body = {
      SubDepartmentForCommentID: subDepartmentForCommentID,
      UserAssaignedToComment: userAssaignedToComment,
    }
    return this.httpClient.post(this.baseURL + "AssignSeniorReviewerOrFinalApprover", body);
  }
  // #endregion



}

