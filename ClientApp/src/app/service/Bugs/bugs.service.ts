import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class BugsService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bugs/";
  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateBug(bugID: number | null, description: string | null, isFixed: boolean | null, fixedBy: string | null, component: string | null, category: string | null, createdById: string | null) {
    const body = {
      BugID: bugID,
      Description: description,
      isFixed: isFixed,
      FixedBy: fixedBy,
      Component: component,
      Category:category,
      CreatedById :createdById
    }

    return this.httpClient.post(this.baseURL + "AddUpdateBug", body);
  }

  public getAllBugs() {

    return this.httpClient.get(this.baseURL + "GetAllBugs");
  }

  public deleteBug(bugID: number | null) {

    const body = {
      BugID :bugID
    }

    return this.httpClient.post(this.baseURL + "DeleteBug", body);
  }
}
