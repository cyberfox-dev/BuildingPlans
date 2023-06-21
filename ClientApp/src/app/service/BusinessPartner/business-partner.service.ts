import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusinessPartnerService {
  private apiUrl = 'https://poqci01.capetown.gov.za:8151/RESTAdapter/WLMS_Q/BPValidation';

  constructor(private http: HttpClient) { }


  //validateBP(bpNumber: string): Observable<boolean> {
  //  const url = `${this.apiUrl}?bpNumber=${encodeURIComponent(bpNumber)}`;

  //  // Set up the request headers with the username and password
  //  const headers = new HttpHeaders({
  //    'Authorization': 'Basic ' + btoa(username + ':' + password)
  //  });

  //  return this.http.get<boolean>(url, { headers });
  //}

  //validateBP(): Observable<boolean> {
  //  return this.http.get<boolean>(this.apiUrl);
  //}
  //validateBP(bpNumber: number): Observable<boolean> {
  //  const url = `${this.apiUrl}?bpNumber=${encodeURIComponent(bpNumber)}`;
  //  return this.http.get<boolean>(url);
  //}



  validateBP(bpNumber: number): Observable<any> {
    
    const url = `${this.apiUrl}`;
    const body = { "BusinessPartnerNumber": bpNumber };

    return this.http.post<any>(url, body);
  }

}
