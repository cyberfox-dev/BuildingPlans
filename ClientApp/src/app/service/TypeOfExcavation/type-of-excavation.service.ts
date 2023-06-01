import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class TypeOfExcavationService {

  private readonly apiUrl: string = this.sharedService.getApiUrl();
  private readonly baseURL: string = this.apiUrl + "typesOfExcavation/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }



  public addUpdateTypesOfExcavation(typeOfExcavationID: number | null, typeOfExcavationName: string | null, typeOfExcavationDescription: string | null, createdById: string | null) {

    const body = {

      TypeOfExcavationID: typeOfExcavationID,
      TypeOfExcavationName: typeOfExcavationName,
      TypeOfExcavationDescription: typeOfExcavationDescription,
      CreatedById: createdById,

    }
    return this.httpClient.post(this.baseURL + "AddUpdateTypesOfExcavation", body);

  }

  public deleteTypesOfExcavationByID(typeOfExcavationID: number) {

    return this.httpClient.post(this.baseURL + "DeleteTypesOfExcavationByID", typeOfExcavationID);

  }

  public getAllTypesOfExcavation() {

      return this.httpClient.get(this.baseURL + "GetAllTypesOfExcavation");

  }





}
