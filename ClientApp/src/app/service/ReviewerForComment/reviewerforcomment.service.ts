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

  public addUpdateReviewerForComment(reviewerForCommentID: number | null, applicationID: number | null, reviewerAssignedToComment: string | null, commentStatus: string | null, comment: string | null, createdByID: string | null, subdepartmentID: number | null, subdepartmentName: string | null, zoneID: number | null, zoneName: string | null) {


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
  // comments Sindiswa 19 January 2023
  public getAssignementDetails(applicationID: number | null, subdepartmentID: number | null, zoneID: number | null) {
    const body = {
      ApplicationID: applicationID,
      SubDepartmentID: subdepartmentID,
      ZoneID: zoneID,
    }
    return this.httpClient.post(this.baseURL + "GetUserDetails", body);
  }

  //Audit trail Kyle
  public getAllReviewerForCommentItems() {
    return this.httpClient.get(this.baseURL + "GetAllReviewerForCommentItems");
  }

  public getAllReviewerForCommentForApplication(applicationID: number | null) {
    const body = {
      ApplicationID: applicationID
    }

    return this.httpClient.post(this.baseURL + "GetAllReviewerForCommentForApplication", body);
  }

  public getAllReviewersForSubDepartmentAndZone(subDepartmentName: string | null, zoneName: string | null) {
    const body = {
      SubDepartmentName: subDepartmentName,
      ZoneName:zoneName,
    }

    return this.httpClient.post(this.baseURL + "GetAllReviewersForSubDepartmentAndZone", body);
  }

  public getAllReviewersForCommentsByUser(userId: string | null) {
    const body = {
      CreatedById:userId 
    }

    return this.httpClient.post(this.baseURL + " GetAllReviewersForCommentsByUser", body);
  }
}
