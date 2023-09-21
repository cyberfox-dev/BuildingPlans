import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessPartnerService {

/*  private apiUrl = 'https://orchestrationhubqa.capetown.gov.za/RESTAdapter/WLMS_Q/BPValidation';*/

  constructor(private http: HttpClient, private sharedService: SharedService) { }

  validateBP(bpNumber: number): Observable<any> {
/*    const url = '/RESTAdapter/WLMS_Q/BPValidation'; //proxy*/
/*    const url = 'https://orchestrationhubqa.capetown.gov.za/RESTAdapter/WLMS_Q/BPValidation'; */
    //const url = 'https://wayleaveqa.capetown.gov.za/venapi/BPValidation';
    //const url = 'https://wayleave.capetown.gov.za/venapi/BPValidation';
    const url = this.sharedService.getApiUrl() + '/venapi/' + 'BPValidation';

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
