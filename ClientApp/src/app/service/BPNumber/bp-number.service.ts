import { Injectable } from '@angular/core';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BpNumberService {

  private baseUrl = 'https://orchestrationhubqa.capetown.gov.za/RESTAdapter/WLMS_Q/BPValidation';
  private authToken = btoa('RFC_BPWLMS:B@sis1234'); // Encode username:password in Base64

  constructor(private http: HttpClient) { }

  makeApiCall(requestBody: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Basic ${this.authToken}`
    });

    return this.http.post<any>(this.baseUrl, requestBody, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Server returned code ${error.status}, error message: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
