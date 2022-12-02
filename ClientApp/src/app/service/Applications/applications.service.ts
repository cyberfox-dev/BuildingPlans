import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {
  private readonly baseURL: string = "https://localhost:7123/api/applications/"

  constructor(private httpClient: HttpClient) { }
  public addUpdateApplication(ApplicationID?: number | null, userID?: string | null, fullName?: string | null, email?: string | null, phoneNumber?: string | null, physicalAddress?: string | null, referenceNumber?: string | null, companyRegNo?: string | null, typeOfApplication?: string | null, notificationNumber?: string | null, wBSNumber?: string | null, physicalAddressOfProject?: string | null, descriptionOfProject?: string | null, natureOfWork?: string | null, excavationType?: string | null, expectedStartDate?: Date | null, expectedEndDate?: Date | null, location?: string | null, createdById?: number | null) {

    const body = {
      ApplicationID: ApplicationID,
      UserID: userID,
      FullName: fullName,
      Email: email,
      PhysicalAddress: physicalAddress,
      ReferenceNumber: referenceNumber,
      CompanyRegNo: companyRegNo,
      TypeOfApplication: typeOfApplication,
      NotificationNumber: notificationNumber,
      WBSNumber: wBSNumber,
      PhysicalAddressOfProject: physicalAddressOfProject,
      DescriptionOfProject: descriptionOfProject,
      NatureOfWork: natureOfWork,
      ExcavationType: excavationType,
      ExpectedStartDate: expectedStartDate,
      ExpectedEndDate: expectedEndDate,
      Location: location,
      PhoneNumber: phoneNumber,
      CreatedById: createdById,
    }
    return this.httpClient.post(this.baseURL + "AddUpdateApplication", body);

  }

  public deleteApplication(applicationID: number) {

    return this.httpClient.post(this.baseURL + "DeleteApplications", applicationID);

  }

  public getApplicationsList() {

    return this.httpClient.get(this.baseURL + "GetApplicationsList");

  }

}
