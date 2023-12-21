import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  headers = new HttpHeaders();
  // options = { headers: this.headers, withCredintials: false };

  options = { headers: this.headers };

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "userprofile/";



  constructor(private httpClient: HttpClient, private sharedService: SharedService
) {
  }

  public addUpdateUserProfiles(userProfileID?: number | null, userID?: string | null, fullName?: string | null, email?: string | null,
    phoneNumber?: string | null, isInternal?: boolean | null, bp_Number?: string | null, companyName?: string | null, companyRegNo?: string | null,
    physcialAddress?: string | null, directorate?: string | null, departmentID?: number | null, subDepartmentID?: number | null, branch?: string | null,
    costCenterNumber?: string | null, costCenterOwner?: string | null, copyOfID?: any | null, createdById?: string | null, idNumber?: string | null,
    zoneID?: number | null, vatNumber?: string | null, refNumber?: string | null, companyType?: string | null, isDepartmentAdmin?: boolean | null,
    isZoneAdmin?: boolean | null, subDepartmentName?: string | null, alternateEmail?: string | null, alternateNumber?: string | null,
    name?: string | null, surname?: string | null, departmentName?: string | null, zoneName?: string | null, isDefault?: boolean | null, icasaLicense?: string | null, depConfirmation?:boolean|null) {

    const isCreatingNewUser = userProfileID === null || userProfileID === undefined; // Check if a new user is being created

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
      IdNumber: idNumber,
      isActive: true,
      //HEBANA!!!!!!!!!!!! --- This should only be false at creation, when I update then it should keep whatever value I have
      depConfirmation: isCreatingNewUser ? false : depConfirmation,
      zoneID: zoneID,
      vatNumber: vatNumber,

      //Reference Number & Company Type??
      refNumber: refNumber,
      companyType: companyType,

      isDepartmentAdmin: isDepartmentAdmin,
      isZoneAdmin: isZoneAdmin,

      subDepartmentName: subDepartmentName,

      AlternativeEmail: alternateEmail,
      AlternativePhoneNumber: alternateNumber,
      //things added later:
      Name: name,
      Surname: surname,
      zoneName:zoneName,
      DepartmentName: departmentName,
      isDefault: isDefault,
      ICASALicense: icasaLicense,
    }
    return this.httpClient.post(this.baseURL + "AddUpdateUserProfiles", body);

  }
  //(int? userProfileID, bool? isDepartmentAdmin, bool? isZoneAdmin, string? createdById)
  public updateAdminBool(userProfileID?: number | null, isDepartmentAdmin?: boolean | null, isZoneAdmin?: boolean | null, createdById?: string | null) {
    const body = {
      UserProfileID: userProfileID,
      isDepartmentAdmin: isDepartmentAdmin,
      isZoneAdmin: isZoneAdmin,
      CreatedById: createdById,
    }
    return this.httpClient.post(this.baseURL + "AdminConfig", body);
  }
  public deleteUserProfile(professinalID: number) {

    return this.httpClient.post(this.baseURL + "DeleteUserProfile", professinalID);

  }

  public userGainsApproval(professinalID: number) {
    debugger;
    return this.httpClient.post(this.baseURL + "UserGainsApproval", professinalID);

  }
  public noApproval(professinalID: number) {
    debugger;

    return this.httpClient.post(this.baseURL + "UserDoesntGainApproval", professinalID);

  }

  public getUserProfileById(userId: string) {

    const body = {
      UserID: userId,
    }
   
    return this.httpClient.post(this.baseURL + "GetUserByUserID", body);

  }
  public getUserProfileByUserProfileID(userProfileId: number) {

    const body = {
      UserProfileID: userProfileId,
    }
   
    return this.httpClient.post(this.baseURL + "GetUserByUserProfileID", body);

  }

  public getExternalUsers() {

    return this.httpClient.get(this.baseURL + "GetExternalUsers");

  }

  public getDefaltUserProfile(userId: string) {
    const body = {
      UserID: userId,
    }
    return this.httpClient.post(this.baseURL + "GetDefaltUserProfile", body);

  }

  public getInternalUsers() {

    return this.httpClient.get(this.baseURL + "GetInternalUsers");

  }

  public getAllDepartmentAdmins() {

    return this.httpClient.get(this.baseURL + "GetAllDepartmentAdmins");

  }

  public getAllUsersToLinkToDep(depID: number) {


    return this.httpClient.post(this.baseURL + "GetAllUsersToLinkToDep", depID);

  }

  public getUsersBySubDepartmentName(subDepartmentName: string) {

    const body = {
      SubDepartmentName: subDepartmentName,
    }

    return this.httpClient.post(this.baseURL + "GetUsersBySubDepartmentName", body);

  }
  public getUserByEmail(email: string) {

    const body = {
      Email: email,
    }

    return this.httpClient.post(this.baseURL + "GetUserByEmail", body);
  }



  public updateActingDepartment(userProfileID: number) {

    return this.httpClient.post(this.baseURL + "UpdateActingDepartment", userProfileID);

  }


}
