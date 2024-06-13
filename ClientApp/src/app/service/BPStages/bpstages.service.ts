import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class BPStagesService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bPStages/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateStage(stageID:number|null, stageName: string|null , stageOrder:string| null , functionalArea:string | null,createdByID: string | null) {
    const body = {
      StageID: stageID,
      StageName: stageName,
      StageOrder: stageOrder,
      FunctionalArea :functionalArea,
      CreatedById: createdByID
    }
    return this.httpClient.post(this.baseURL + "AddUpdateStage", body);
  }

  public deleteStagebyStageID(stageID: number | null) {

    return this.httpClient.post(this.baseURL + "DeleteStageByStageID", stageID);
  }

  public getAllStages() {
    return this.httpClient.get(this.baseURL + "GetAllStages");
  }

  public getAllStagesForFunctionalArea(functionalArea: string | null) {
    const body = {
      FunctionalArea: functionalArea
    }
    return this.httpClient.post(this.baseURL + "GetStageByFunctionalArea",body);
  }
}
