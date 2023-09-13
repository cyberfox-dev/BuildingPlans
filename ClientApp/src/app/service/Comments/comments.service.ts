import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "comment/";


  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateComment(CommentID?: number | null, applicationID?: number | null, subDepartmentForCommentID?: number | null, subDepartmentID?: number | null, subDepartmentName?: string | null, Comment?: string | null, CommentStatus?: string | null, createdById?: string | null, isClarifyCommentID?: number | null, isApplicantReplay?: string | null, UserName?: string | null, ZoneName?: string | null) {
    const body = {
      CommentID: CommentID,
      ApplicationID: applicationID,
      SubDepartmentForCommentID: subDepartmentForCommentID,
      Comment: Comment,
      CommentStatus: CommentStatus,
      CreatedById: createdById,
      SubDepartmentID: subDepartmentID,
      SubDepartmentName: subDepartmentName,
      isClarifyCommentID: isClarifyCommentID,
      isApplicantReplay: isApplicantReplay,
      UserName: UserName,
      ZoneName: ZoneName,

    }
    return this.httpClient.post(this.baseURL + "AddUpdateComment", body);
  }

  public getCommentByApplicationID(applicationID: number) {

    return this.httpClient.post(this.baseURL + "GetCommentByApplicationID", applicationID);

  }

  public getSubDepByCommentStatus(CommentStatus: string, applicationID: number) {
    const body = {
      ApplicationID: applicationID,
      CommentStatus: CommentStatus,

    }

    return this.httpClient.post(this.baseURL + "GetSubDepByCommentStatus", body);

  }


  public getCommentsForSpecialConditions(applicationID: number) {

    return this.httpClient.post(this.baseURL + "GetCommentsForSpecialConditions", applicationID);

  }

}
