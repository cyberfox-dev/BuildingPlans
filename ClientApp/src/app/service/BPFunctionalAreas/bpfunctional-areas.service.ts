
import { Injectable } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BPFunctionalAreasService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bPFunctionalAreas/";


  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public getAllFunctionalAreas() {

    return this.httpClient.get(this.baseURL + "GetAllFuntionalAreas");
  }

  public getFunctionalAreaByFunctionalAreaID(functionalAreaId: number | null) {
    return this.httpClient.post(this.baseURL + "GetFunctionalAreaByFunctionalAreaID", functionalAreaId)
  }

  public getFunctionalAreaByFunctionalAreaName(functionalAreaName: string | null) {
    const body = {
      FAName:functionalAreaName
    }
    return this.httpClient.post(this.baseURL + "GetFunctionalAreaByFunctionalAreaName", body);
  }
}
