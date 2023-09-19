import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/service/Config/config.service';
import { tap } from 'rxjs/operators';
import { SharedService } from "src/app/shared/shared.service"

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
  AllConfig: ConfigList[] = [];
  public baseUrl: string;

  initializeApp(): Promise<any> {
    return this.configService.getBaseUrl().pipe(
      tap((baseUrl: string) => {
        // Store the base URL in a variable or service accessible to all components
        // Example: this.configService.setBaseUrl(baseUrl);
        console.log("BaseURL:", baseUrl);
        this.baseUrl = baseUrl;
        this.sharedService.setAPIURL(baseUrl);
      //  this.getConfig();
      })
    ).toPromise();

  }

  getConfig() {
    this.AllConfig.splice(0, this.AllConfig.length);

    this.configService.getAllConfigs().subscribe((data: any) => {

      if (data) {
        this.AllConfig = data.dateSet;

        this.sharedService.setAllConfig(this.AllConfig);
        this.sharedService.setServerType(this.AllConfig.find((Config) => Config.configName === 'ServerType').utilitySlot1);
        this.sharedService.setAPIURL(this.AllConfig.find((Config) => Config.configName === 'BaseUrl').utilitySlot2);
      }
      else {
        alert("Error");
      }

      console.log("response", data);
    }, error => {
      console.log("Error", error);
    })

  }

}
