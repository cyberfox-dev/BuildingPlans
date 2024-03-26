import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class BPStagesChecklistsService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "stagesChecklists/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public AddUpdateChecklistItem(checklistItemId:number|null , checklistItem:string|null ,stageName:string|null , functionalArea:string|null, createdById:string|null) {
    const body = {
      CheckListItemID: checklistItemId,
      ChecklistItem: checklistItem,
      StageName: stageName,
      FunctionalArea: functionalArea,
      CreatedById : createdById
    }

    return this.httpClient.post(this.baseURL + "AddUpdateChecklistItem", body);
  }

  public getAllChecklistItemsForStage(stageName: string | null, functionalArea: string | null) {
    const body = {

      StageName: stageName,
      FunctionalArea:functionalArea
    }

    return this.httpClient.post(this.baseURL + "GetAllChecklistItemsForStage", body);
  }

  public deleteChecklistItemByChecklistItemId(checklistItemId: number | null) {
    const body = {
      CheckListItemId: checklistItemId
    }

    return this.httpClient.post(this.baseURL + "DeleteChecklistItemByChecklistItemId", body);
  }
}
