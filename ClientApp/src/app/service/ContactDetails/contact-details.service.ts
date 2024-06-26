import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ContactDetailsService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "ContactDetails/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateContactDetail(contactDetailID: number | null, fullName: string | null, cellNo: string | null, email: string | null, subDepID: number | null, subDepName: string | null, zoneID: number | null, zoneName: string | null, createdByID: string | null) {
    const body = {
      ContactDetailID: contactDetailID,
      FullName: fullName,
      CellNo: cellNo,
      Email: email,
      SubDepartmentID: subDepID,
      SubDepartmentName: subDepName,
      ZoneID: zoneID,
      ZoneName: zoneName,
      CreatedById: createdByID,

    }
    return this.httpClient.post(this.baseURL + "AddUpdateContactDetail", body);
  }

  public deleteContactDetail(contactDetailID: number) {

    return this.httpClient.post(this.baseURL + "DeleteContactDetail", contactDetailID);

  }

  public getAllContactDetials() {

    return this.httpClient.get(this.baseURL + "GetAllContactDetials");

  }

}
