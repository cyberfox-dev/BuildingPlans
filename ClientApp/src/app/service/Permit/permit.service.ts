import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class PermitService {
  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "permitSubForComment/";


  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }


  public addUpdatePermitSubForComment(permitSubForCommentID: number | null, applicationID: number | null, subDepartmentID: number | null, subDepartmentName: string | null, userAssaignedToComment: string | null, permitComment: string | null, permitCommentStatus: string | null, createdByID: string | null, zoneID?: number | null, zoneName?: string | null, documentLocalPath?: any | null, documentName?: string | null, requestForDelete?: boolean | null, isPaid?: boolean | null, hasSupervisionFee?: boolean | null, moveToPaidDate?:any | null) {

    const body = {
      PermitSubForCommentID: permitSubForCommentID,
      ApplicationID: applicationID,
      SubDepartmentID: subDepartmentID,
      SubDepartmentName: subDepartmentName,
      UserAssaignedToComment: userAssaignedToComment,
      PermitComment: permitComment,
      PermitCommentStatus: permitCommentStatus,
      CreatedById: createdByID,
      ZoneID: zoneID,
      ZoneName: zoneName,
       // #region permitupload Sindiswa 08 January 2024 - for the purpose of uploading documents under the "Permits" tab
      DocumentLocalPath: documentLocalPath,
      PermitDocName: documentName,
      // #endregion
      RequestForDelete: requestForDelete,
      isPaid: isPaid,
      hasSupervisionFee: hasSupervisionFee,
      MoveToPaidDate: moveToPaidDate,
    }
    return this.httpClient.post(this.baseURL + "AddUpdatePermitSubForComment", body);

  }

  public getPermitSubForCommentByApplicationID(applicationID: number | null) {

    //const body = {
    //  ApplicationID: applicationID,
    //}
    return this.httpClient.post(this.baseURL + "GetPermitSubForCommentByApplicationID", applicationID);

  }


  public getPermitForCommentBySubID(applicationID: number | null, subDepartmentID: number | null, userAssaignedToComment?: string | null) {

    const body = {
      ApplicationID: applicationID,
      SubDepartmentID: subDepartmentID,
      UserAssaignedToComment: userAssaignedToComment,
    }
    return this.httpClient.post(this.baseURL + "GetPermitSubForCommentBySubID", body);

  }

  // #region permitupload Sindiswa 09 January 2024

  public hasPermitSubForCommentDocuments(permitSubForCommentID: number | null) {


    return this.httpClient.post<any>(this.baseURL + 'HasPermitSubForCommentDocuments', permitSubForCommentID);
  }
  // #endregion
  // Permit Kyle 13-02-24
  public deleteDocumentFromPermitSubForComment(applicationID: number | null, permitSubForCommentID: number |null) {
    const body = {
      ApplicationID: applicationID,
      PermitSubForCommentID: permitSubForCommentID
    }

    return this.httpClient.post(this.baseURL + "DeleteDocumentFromPermitSubForComment",body)
  }

  public getAllRequestsForDelete() {

    return this.httpClient.get(this.baseURL + "GetAllRequestsForDelete");
  }
  // Permit Kyle 13-02-24
}
