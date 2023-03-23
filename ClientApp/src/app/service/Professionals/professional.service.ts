import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalService {
  private readonly baseURL: string = "https://localhost:7123/api/professionals/"

  constructor(private httpClient: HttpClient) { }

 

  public addUpdateProfessional(professinalID: number | null, professinalType: string, fullName: string, bp_Number: string, bpVerified: boolean | null, email: string, phoneNumber: string | undefined, professionalRegNo: string, appUserID: string,idNumber:string | undefined,createdById: string,cibRating: string | null ) {

    const body = {
      ProfessinalID: professinalID,
      ProfessinalType : professinalType,
      FullName: fullName,
      BP_Number: bp_Number,
      BpVerified: bpVerified,
      PhoneNumber: phoneNumber,
      Email: email,
      ProfessionalRegNo: professionalRegNo,
      AppUserID: appUserID, 
      CreatedById: createdById,
      IDNumber: idNumber,
      CIBRating: cibRating,
      
    }
    return this.httpClient.post(this.baseURL + "AddUpdateProfessional", body);

  }

  public deleteProfessional(professinalID: number) {

    return this.httpClient.post(this.baseURL + "DeleteProfessional", professinalID);

  }

  public getProfessionalsList(userId: any) {

    return this.httpClient.get(this.baseURL + "GetProfessionalsList", userId);

  }

  public getProfessionalsListByProfessionalType(userId: string, professinalType: string) {
    
    const body = {

      ProfessinalType: professinalType,
      AppUserID: userId,

    }

    return this.httpClient.post(this.baseURL + "GetProfessionalsListByProfessionalType", body);

  }

  public getAllProfessionalsLinkByApplicationID(applicationID: number, professionalType: string) {

    const body = {
      ApplicationID: applicationID,
      ProfessinalType: professionalType,
    }

    return this.httpClient.post(this.baseURL + "GetAllProfessionalsLinkByApplicationID",body);

  }


  

}
