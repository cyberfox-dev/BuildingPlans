import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StagesService {
  private readonly baseURL: string = "https://localhost:7123/api/stage/"
  constructor(private httpClient: HttpClient) { }


  public addUpdateStage(stageID: number | null, stageName: string | null, stageOrderNumber: number | null) {

    const body = {
      StageID: stageID,
      StageName: stageName,
      StageOrderNumber: stageOrderNumber,
    }
    return this.httpClient.post(this.baseURL + "AddUpdateStage", body);

  }

  public deleteStage(stageID: number) {

    return this.httpClient.post(this.baseURL + "DeleteStage", stageID);

  }

  public getStageList(stageID: any) {

    return this.httpClient.get(this.baseURL + "GetStagesList", stageID);

  }

  public getAllStages() {

    return this.httpClient.get(this.baseURL + "GetAllStages");

  }
}
