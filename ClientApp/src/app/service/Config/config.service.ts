import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "config/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  /*  , roleType: string | null, roleDescription: string | null, createdById: string | null*/

  public addUpdateConfig(configID?: number | null, configName?: string | null, configDescription?: string | null, utilitySlot1?: string | null, utilitySlot2?: string | null, utilitySlot3?: string | null, createdByID?: string | null) {

    const body = {
      ConfigID: configID,
      ConfigName: configName,
      ConfigDescription: configDescription,
      CreatedById: createdByID,
      UtilitySlot1: utilitySlot1,
      UtilitySlot2: utilitySlot2,
      UtilitySlot3: utilitySlot3


    }
    return this.httpClient.post(this.baseURL + "AddUpdateConfig", body);

  }
  //public addUpdateConfigg(configID?: number | null, configName?: string | null, configDescription?: string | null, createdByID?: string | null) {

  //  return this.httpClient.get(this.baseURL + "NEWTest");

  //}

  public deleteConfig(configID: number) {

    return this.httpClient.post(this.baseURL + "DeleteConfig", configID);

  }

  public getConfigsByConfigID(configID: number) {
    const body = {
      ConfigID: configID,
    }
    return this.httpClient.post(this.baseURL + "GetConfigsByConfigID", body);

  }

  public getConfigsByConfigName(configName: string) {
    const body = {
      ConfigName: configName,
    }
    return this.httpClient.post(this.baseURL + "GetConfigsByConfigName", body);

  }


  public getConfigByUserID(userID: any) {
    const body = {
      UserID: userID,
    }
    return this.httpClient.post(this.baseURL + "GetConfigsByUserID", body);

  }

  public getAllConfigs() {

    return this.httpClient.get(this.baseURL + "GetAllConfigs");

  }
}
