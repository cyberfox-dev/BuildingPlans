import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class PermitService {
    private readonly apiUrl: string = this.sharedService.getApiUrl();
  private readonly baseURL: string = this.apiUrl + "permitSubForComment/";


  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }


  public addUpdatePermitSubForComment(permitSubForCommentID: number | null, applicationID: number | null, subDepartmentID: number | null, subDepartmentName: string | null, userAssaignedToComment: string | null, permitComment: string | null, permitCommentStatus: string | null, createdByID: string | null) {

    const body = {
      PermitSubForCommentID: permitSubForCommentID,
      ApplicationID: applicationID,
      SubDepartmentID: subDepartmentID,
      SubDepartmentName: subDepartmentName,
      UserAssaignedToComment: userAssaignedToComment,
      PermitComment: permitComment,
      PermitCommentStatus: permitCommentStatus,
      CreatedById: createdByID,

    }
    return this.httpClient.post(this.baseURL + "AddUpdatePermitSubForComment", body);

  }

  public getPermitSubForCommentByApplicationID(applicationID: number | null) {

    //const body = {
    //  ApplicationID: applicationID,
    //}
    return this.httpClient.post(this.baseURL + "GetPermitSubForCommentByApplicationID", applicationID);

  }


  public getPermitForCommentBySubID(applicationID: number | null, subDepartmentID: number | null) {

    const body = {
      ApplicationID: applicationID,
      SubDepartmentID: subDepartmentID,
    }
    return this.httpClient.post(this.baseURL + "GetPermitSubForCommentBySubID", body);

  }


}