import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalService {
  private readonly baseURL: string = "https://localhost:7123/api/professionals/"

  constructor(private httpClient: HttpClient) { }

 

  public addUpdateProfessional(professinalID: number | null, professinalType: string, fullName: string, bp_Number: string, bpVerified: boolean | null, email: string, phoneNumber: string, professionalRegNo: string, appUserID: string, createdById: string ) {

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
      
    }
    return this.httpClient.post(this.baseURL + "AddUpdateProfessional", body);

  }

  public deleteProfessional(professinalID: number) {

    return this.httpClient.post(this.baseURL + "DeleteProfessional", professinalID);

  }

  public getProfessionalsList(userId: any) {

    return this.httpClient.get(this.baseURL + "GetProfessionalsList", userId);

  }

}
