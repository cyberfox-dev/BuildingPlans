import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseURL: string = "http://197.242.150.226:7123/api/user/"
  constructor(private httpClient: HttpClient) { }


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
