import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';


@Injectable({
  providedIn: 'root'
})
export class BPApplicationChecklistService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bPApplicationChecklists/";
  //BPAddressTypes
  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateApplicationChecklist(checklistItemID: number | null, applicationID: number | null, checklistItem: string | null, functionalArea: string | null, stageName: string | null, isChecked: boolean | null, checkedBy: string | null, createdById: string | null) {
    const body = {
      ChecklistItemID: checklistItemID,
      ApplicationID: applicationID,
      ChecklistItem: checklistItem,
      FunctionalArea: functionalArea,
      StageName: stageName,
      isChecked: isChecked,
      CheckedBy: checkedBy,
      CreatedById: createdById
    }

    return this.httpClient.post(this.baseURL + "AddUpdateApplicationChecklist", body);
  }

  public getChecklistForApplicationAndStage(applicationID: number | null, stageName: string | null, functionalArea: string | null) {
    const body = {
      ApplicationID: applicationID,
      StageName: stageName,
      FunctionalArea: functionalArea
    }

    return this.httpClient.post(this.baseURL + "GetChecklistForApplicationAndStage", body);
  }

  public changeIsCheckedStatus(checklistItemID: number | null, isChecked: boolean | null) {
    const body = {
      ChecklistItemID: checklistItemID,
      isChecked : isChecked
    }

    return this.httpClient.post(this.baseURL + "ChangeIsCheckedStatus", body);
  }
}
