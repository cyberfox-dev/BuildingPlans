import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalsLinksService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "professionalslinks/";


  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }
  public addUpdateProfessionalsLink(professionalsLinkID?: number | null, applicationID?: number | null, professionalID?: number | null, createdById?: string | null) {

    const body = {
      ProfessionalsLinkID: professionalsLinkID,
      ApplicationID: applicationID,
      ProfessionalID: professionalID,
      CreatedById: createdById,
    }
    return this.httpClient.post(this.baseURL + "AddUpdateProfessionalsLink", body);

  }

  public deleteProfessionalsLink(professionalsLinkID: number) {

    return this.httpClient.post(this.baseURL + "DeleteProfessionalsLink", professionalsLinkID);

  }

  public getAllProfessionalsLink() {

    return this.httpClient.get(this.baseURL + "GetAllProfessionalsLink");

  }

}
