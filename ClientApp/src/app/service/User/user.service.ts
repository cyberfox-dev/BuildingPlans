import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { ConfigService } from 'src/app/service/Config/config.service';

export interface ConfigList {
  configID: number,
  configName: string,
  configDescription: string,
  dateCreated: Date,
  dateUpdated: Date,
  createdById: string,
  isActive: boolean,
  utilitySlot1: string,
  utilitySlot2: string,
  utilitySlot3: string,
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "user/";



  constructor(private httpClient: HttpClient, private sharedService: SharedService, private configService: ConfigService) {
}


  public login(email: string | null, password: string | null) {
   
    const body = {
      Email: email,
      Password: password
    }
    return this.httpClient.post(this.baseURL + "Login", body);

  }

  public register(fullName: string | null, email: string | null, password: string | null) {

    const body = {
      FullName: fullName,
      Email: email,
      Password: password
    }
    return this.httpClient.post(this.baseURL + "RegisterUser", body);

  }

  public emailExists(email: string | null) {

    const body = {
      Email: email,
    }
    return this.httpClient.post(this.baseURL + "EmailExists", body);

  }

  public updatePassword(email: string | null, password: string | null) {

    const body = {
      Email: email,
      Password: password
    }
    return this.httpClient.post(this.baseURL + "UpdatePassword", body);

  }

}
