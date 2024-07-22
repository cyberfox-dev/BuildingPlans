import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class BPCommentsService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bPComments/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateComment(commentID: number | null, applicationID: number | null, functionalArea: string | null, comment: string | null, commentStatus: string | null, subDepartmentForCommentID: number | null, isApplicantReply: string | null, secondReply: string | null, userName: string | null, canReplyUserID: string | null, createdById: string | null) {
    debugger;
    const body = {
  
      CommentID: commentID,
      ApplicationID: applicationID,
      FunctionalArea: functionalArea,
      Comment: comment,
      CommentStatus:commentStatus,
      SubDepartmentForComment: subDepartmentForCommentID,
      isApplicantReplay: isApplicantReply,
      SecondReply: secondReply,
      UserName: userName,
      CanReplyUserID: canReplyUserID,
      CreatedById:createdById
    }

    return this.httpClient.post(this.baseURL + "AddUpdateComment", body);


  }

  public getAllCommentsForApplication(applicationID: number | null) {
    const body = {
      ApplicationID:applicationID
    }

    return this.httpClient.post(this.baseURL + "GetAllCommentsForApplication", body);
  }

  public getAllCommentForApplicationByFunctionalArea(applicationID: number | null, functionalArea: string | null) {
    const body = {
      ApllicationID: applicationID,
      FunctionalArea:functionalArea
    }

    return this.httpClient.post(this.baseURL + "GetAllCommentsForAPplicationByFunctionalArea", body);
  }
}
