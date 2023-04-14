import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class StagesService {

  private readonly apiUrl: string = this.sharedService.getApiUrl();
  private readonly baseURL: string = this.apiUrl + "stage/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }


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
