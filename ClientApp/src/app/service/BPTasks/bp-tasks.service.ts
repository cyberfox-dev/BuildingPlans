import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class BpTasksService {
  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "bPTasks/";
  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateTask(TaskID: number | null, TaskName: string | null, ApplicationID: string | null, FunctionalArea: string | null, CreatedById: string | null, TaskCreatedFor: string | null, departmentName: string | null) {
    const body = {
      TaskID: TaskID,
      TaskName: TaskName,
      ApplicationID: ApplicationID,
      FunctionalArea: FunctionalArea,
      CreatedById: CreatedById,
      TaskCreatedFor: TaskCreatedFor,
      DepartmentName :departmentName ,
    }
    return this.httpClient.post(this.baseURL + "AddUpdateTask", body);
  }


  public getAllTasks() {
    return this.httpClient.get(this.baseURL + "GetAllTasks");
  }

  public getTasksForApplication(ApplicationID: number | null) {
    const body = {
      ApplicationID: ApplicationID
    }
    return this.httpClient.post(this.baseURL + "GetTasksForApplication", body);
  }

  public taskCompleted(TaskID: number | null, checkedBy:string|null) {
    const body = {
      TaskID: TaskID,
      CheckedBy: checkedBy
    }
    return this.httpClient.post(this.baseURL + "TaskCompleted", body);
  }

  public getAllTasksForDepartment(departmentName: string | null) {
    const body = {
      DepartmentName : departmentName
    }

    return this.httpClient.post(this.baseURL + "GetAllTaskForDepartment", body);
  }
}
