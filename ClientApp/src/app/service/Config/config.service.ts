import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private readonly apiUrl: string = this.sharedService.getApiUrl();
  private readonly baseURL: string = this.apiUrl + "config/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  /*  , roleType: string | null, roleDescription: string | null, createdById: string | null*/

  public addUpdateConfig(configID?: number | null, configName?: string | null, configDescription?: string | null, createdByID?: string | null) {

    const body = {
      ConfigID: configID,
      ConfigName: configName,
      ConfigDescription: configDescription,
      CreatedById: createdByID,

    }
    return this.httpClient.post(this.baseURL + "AddUpdateConfig", body);

  }
  public addUpdateConfigg(configID?: number | null, configName?: string | null, configDescription?: string | null, createdByID?: string | null) {

    return this.httpClient.get(this.baseURL + "NEWTest");

  }

  public deleteConfig(configID: number) {

    return this.httpClient.post(this.baseURL + "DeleteConfig", configID);

  }

  public getConfigByUserID(userID: any) {
    const body = {
      UserID: userID,
    }
    return this.httpClient.post(this.baseURL + "GetConfigsByUserID", body);

  }

}
