import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewerforcommentService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "reviewerAssignment/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateReviewerForComment(reviewerForCommentID: number | null, applicationID: number | null, reviewerAssignedToComment:string |null, commentStatus: string | null, comment: string | null, createdByID: string|null, subdepartmentID: number | null, subdepartmentName: string|null, zoneID: number|null, zoneName:string|null) {

    debugger;
    const body = {

      ReviewerForCommentID: reviewerForCommentID,
      ApplicationID: applicationID,
      ReviewerAssignedToComment: reviewerAssignedToComment,
      CommentStatus: commentStatus,
      Comment: comment,
      SubDepartmentID: subdepartmentID,
      SubDepartmentName: subdepartmentName,
      ZoneID: zoneID,
      ZoneName: zoneName,
      CreatedById: createdByID,
    }
    return this.httpClient.post(this.baseURL + "AddUpdateReviewerForComment", body)
  }

   
}
