import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/service/Config/config.service';
import { tap } from 'rxjs/operators';
import { SharedService } from "src/app/shared/shared.service"

@Injectable({
  providedIn: 'root'
})
export class InitializationService {
  constructor(private httpClient: HttpClient, private configService: ConfigService, private sharedService: SharedService) { }

//  initializeApp(): Promise<any> {
//    /*    return this.configService.getBaseUrl().pipe(*/
//    return this.httpClient.get<string>('https://localhost:7123/api/config/GetBaseUrl') // Adjust the URL to match your API endpoint
//      .pipe(
//      tap((baseUrl: string) => {
//        // Store the base URL in a variable or service accessible to all components
//        // Example: this.configService.setBaseUrl(baseUrl);
//        this.sharedService.setAPIURL(baseUrl);
//      })
//    ).toPromise();
//  }
  //public baseUrl: string;

  //initializeApp(): Promise<any> {
  //  return this.configService.getBaseUrl().pipe(
  //    tap((baseUrl: string) => {
  //      // Store the base URL in a variable or service accessible to all components
  //      // Example: this.configService.setBaseUrl(baseUrl);
  //      console.log("BaseURL:", baseUrl);
  //      this.baseUrl = baseUrl;
  //      this.sharedService.setAPIURL(baseUrl);
  //    //  this.getConfig();
  //    })
  //  ).toPromise();

  //}


}
