// map.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root',
})
export class MapService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "map/";

  /* private apiUrl = '/api/Map/ProcessGeometry'; // Adjust the URL based on your routing*/

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  processGeometry(Geometry: any, CreatedByID: string, ApplicationID: string, BufferedGeometry: any, IsInternal: string) {
    // Adjust the URL and endpoint according to your backend API

/*    const bufferedGeometryJson = JSON.stringify(BufferedGeometry);*/

    const body = {
      Geometry: Geometry,
      CreatedByID: CreatedByID,
      ApplicationID: ApplicationID,
      BufferedGeometry: BufferedGeometry,
      IsInternal: IsInternal
    }

    return this.httpClient.post(this.baseURL + "ProcessGeometry", body);
  }
}
