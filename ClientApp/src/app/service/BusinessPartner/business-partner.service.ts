import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusinessPartnerService {
  private apiUrl = 'https://orchestrationhubqa.capetown.gov.za/RESTAdapter/WLMS_Q/BPValidation';

  constructor(private http: HttpClient) { }

  validateBP(bpNumber: number): Observable<any> {
    const url = '/RESTAdapter/WLMS_Q/BPValidation'; 
    const body = JSON.stringify({ BusinessPartnerNumber: bpNumber });

    const username = 'RFC_BPWLMS';
    const password = 'B@sis1234';
    const base64Auth = btoa(`${username}:${password}`);

    const headers = new HttpHeaders({
      'Content-Type': 'text/plain',
      'Authorization': `Basic ${base64Auth}`,
    });

    return this.http.post<any>(url, body, { headers }).pipe(
      catchError(error => {
        console.error('Error occurred:', error);
        return throwError(error);
      }),
    );
  }
}
