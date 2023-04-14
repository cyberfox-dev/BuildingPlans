import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StagesService {
  private readonly baseURL: string = "http://197.242.150.226:7123/api/stage/"
  constructor(private httpClient: HttpClient) { }


  public addUpdateStage(stageID: number | null, stageName: string | null, stageOrderNumber: number | null, createdById: string ) {
   
    const body = {
      StageID: stageID,
      StageName: stageName,
      StageOrderNumber: stageOrderNumber,
      CreatedById: createdById,
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
