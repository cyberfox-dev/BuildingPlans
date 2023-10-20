import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class ProjectSizedSelectionService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "projectSizedSelection/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public AddUpdateProjectSizeSelection(SelectionID: number | null, ApplicationID: number | null, UserFullName: string | null, SelectedProject: string | null, ProjectDescription: string | null, CreatedByID: string| null) {
    debugger;
    const body = {

      SelectionID: SelectionID,
      ApplicationID: ApplicationID,
      UserFullName: UserFullName,
      SelectedProject: SelectedProject,
      ProjectDescription: ProjectDescription,
      CreatedByID: CreatedByID,
    };
    
    
    return this.httpClient.post(this.baseURL + "AddUpdateProjectSizedSelection", body)
      
  }

  public deleteProjectSizedSlection(applicationID: number | null, selectedProject: string | null)
  {
    const body = {
      applicationID: applicationID,
      selectedProject: selectedProject,
    }
    return this.httpClient.post(this.baseURL + "DeleteProjectSizedSelection", body);
  }

  public getProjectSizedSelectionForApplication(applicationID: number) {
    debugger;
    const body = {
      ApplicationID:applicationID
    }
    return this.httpClient.post(this.baseURL + "GetProjectSizedSelectionForApplication", body);
  }
}
