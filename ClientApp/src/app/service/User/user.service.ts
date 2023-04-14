import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl: string = this.sharedService.getApiUrl();
  private readonly baseURL: string = this.apiUrl + "user/";



  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }


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

}
