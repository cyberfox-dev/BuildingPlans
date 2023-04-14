import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalsLinksService {
  private readonly baseURL: string = "http://197.242.150.226:7123/api/professionalslinks/"

  constructor(private httpClient: HttpClient) { }
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
