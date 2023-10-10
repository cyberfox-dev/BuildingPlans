import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ManuallyAssignUsersService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "manuallyAssignUsers/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addManuallyAssignedUser(ReferalID:number|null, ApplicationID: number|null, ProjectNumber:string|null, AssignedToUserId:string|null , Description:string|null,CreatedById: string|null ) {
    const body = {
      ReferalID: ReferalID,
      ApplicationID: ApplicationID,
      ProjectNumber: ProjectNumber,
      AssignedToUserId: AssignedToUserId,
      Description: Description,
      CreatedById: CreatedById,
    }
    return this.httpClient.post(this.baseURL + "AddManuallyAssignedUser", body)
  }
}
