import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class BPComplaintsService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bPComplaints/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateComplaint(complaintID: number | null, idNumber: string | null, fullName: string | null, emailAddress: string | null, cellNumber: string | null, telephoneNumber: string | null, address: string | null, cadastralDescription: string | null, lotNumber: string | null,portion:string|null,township:string|null,details:string|null,createdById:string|null) {
    const body = {
      ComplaintID: complaintID,
      IDNumber: idNumber,
      FullName: fullName,
      EmailAddress: emailAddress,
      CellNumber: cellNumber,
      TelephoneNumber: telephoneNumber,
      Address: address,
      CadastralDescription: cadastralDescription,
      LotNumber: lotNumber,
      Portion: portion,
      Township: township,
      Details: details,
      CreatedById: createdById
    }

    return this.httpClient.post(this.baseURL + "AddUpdateComplaint", body);
  }

  public getAllComplaints() {
    return this.httpClient.get(this.baseURL + "GetAllComplaints");
  }

  public getComplaintByComplaintID(complaintID: string | null) {
    const body = {
      ComplaintID:complaintID
    }

    return this.httpClient.post(this.baseURL + "GetComplaintByComplaintID", body);
  }

  public getComplaintByUserId(userId: string | null) {
    const body = {
      CreatedById:userId
    }

    return this.httpClient.post(this.baseURL + "GetComplaintByUserId", body);
  }

  public deleteComplaintByComplaintID(complaintID: number | null) {
    const body = {
      ComplaintID:complaintID
    }

    return this.httpClient.post(this.baseURL + "DeleteComplaintByComplaintID", body);
  }
}
