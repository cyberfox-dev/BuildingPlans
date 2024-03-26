import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class OccupationClassificationService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "occupationClassification/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateOccupationClassfication(occupationID: number | null, occupationName: string | null, occupationCode: string | null, occupancy: string | null, occupancyDescription: string | null, itemTypeID: number | null, createdByID: string | null) {
    debugger;
    const body = {
      OccupationID: occupationID,
      OccupationName: occupationName,
      OccupationCode: occupationCode,
      Occupancy: occupancy,
      OccupancyDescription: occupancyDescription,
      ItemTypeID: itemTypeID,
      CreatedById: createdByID
    }
    return this.httpClient.post(this.baseURL + "AddUpdateOccupationClassification", body);
  }

  public getAllOccupationClassifications() {
    return this.httpClient.get(this.baseURL + "GetAllOccupationClassifications");
  }

  public deleteOccupationClassificationByOccupationID(occupationID: number | null) {
    debugger;
    return this.httpClient.post(this.baseURL + "DeleteOccupationClassificationByOccupationID", occupationID);
  }
  public getAllClassificationForFunctionalArea(functionalArea: string | null) {
    const body = {
      FunctionalArea: functionalArea
    }

    return this.httpClient.post(this.baseURL + "GetClassificationByFunctionalArea", body);
  }
}

