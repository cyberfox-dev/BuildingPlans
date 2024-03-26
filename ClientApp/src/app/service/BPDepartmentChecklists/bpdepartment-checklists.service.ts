import { Injectable } from '@angular/core';
import { SharedService } from '../../shared/shared.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class BPDepartmentChecklistsService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bPDepartmentChecklists/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateChecklistItem(checklistItemId: number | null, checklistItem: string | null, functionalArea: string | null, departmentName: string | null, createdById: string | null) {
    const body = {
      ChecklistItemID : checklistItemId,
      ChecklistItem: checklistItem,
      FunctionalArea: functionalArea,
      DepartmentName: departmentName,
      CreatedById: createdById
    }

    return this.httpClient.post(this.baseURL + "AddUpdateChecklistItem", body);
  }

  public getAllChecklistItemsForDepartment(departmentName :string|null , functionalArea :string|null) {

    const body = {
      DepartmentName: departmentName,
      FunctionalArea: functionalArea
    }

    return this.httpClient.post(this.baseURL + "GetAllChecklistItemsForDepartment", body);
  }

  public deleteDepartmentChecklistItemByChecklistItemId(checklistItemId: number | null) {
    const body = {

      ChecklistItemID: checklistItemId
    }

    return this.httpClient.post(this.baseURL + "DeleteDepartmentChecklistItemByChecklistItemId", body);
  }
}
