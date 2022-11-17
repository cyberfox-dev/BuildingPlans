import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  headers = new HttpHeaders();
  // options = { headers: this.headers, withCredintials: false };

  options = { headers: this.headers };

  private readonly baseURL: string = "https://localhost:7123/api/userprofile/"

  constructor(private httpClient: HttpClient) { }

  public addUpdateUserProfiles(userProfileID: number | null, userID: string | null, fullName: string, email: string, phoneNumber: string | null, isInternal: boolean, bp_Number: string | null, companyName: string | null, companyRegNo: string | null, physcialAddress: string | null, directorate: string | null, departmentID: number | null, subDepartmentID: number | null, branch: string | null, costCenterNumber: string | null, costCenterOwner: string | null, copyOfID: any | null,createdById: string | null,idNumber: number |null) {

    const body = {
      UserProfileID: userProfileID,
      UserID: userID,
      FullName: fullName,
      Email: email,
      PhoneNumber: phoneNumber, 
      isInternal: isInternal,
      BP_Number: bp_Number,
      CompanyName: companyName,
      CompanyRegNo: companyRegNo,
      PhyscialAddress: physcialAddress,
      Directorate: directorate,
      DepartmentID: departmentID,
      SubDepartmentID: subDepartmentID,
      Branch: branch,
      CostCenterNumber: costCenterNumber,
      CostCenterOwner: costCenterOwner,
      CopyOfID: copyOfID,
      CreatedById: createdById,
      idNumber: idNumber,
      isActive: true

    }
    return this.httpClient.post(this.baseURL + "AddUpdateUserProfiles", body);

  }

  public deleteUserProfile(professinalID: number) {

    return this.httpClient.post(this.baseURL + "DeleteUserProfile", professinalID);

  }

  public getUserProfileById(userId: string) {

    const body = {
      UserID: userId,
    }
   
    return this.httpClient.post(this.baseURL + "GetUserByUserID", body);

  }




}
