import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SharedService } from 'src/app/shared/shared.service';
import { applyPlugin } from 'jspdf-autotable';


@Injectable({
  providedIn: 'root'
})
export class BuildingApplicationsService {

  private readonly apiUrl: string = this.sharedService.getApiUrl() + '/api/';
  private readonly baseURL: string = this.apiUrl + "buildingApplication/";

  constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

  public addUpdateBuildingApplication(ApplicationID: number | null, LSNumber: string | null, UserID: string | null, FirstName: string | null, Surname: string | null, EmailAddress: string | null, CellNumber: string | null, AltEmail: string | null, AltCellNumber: string | null, IDNumber: string | null, PropertyDescription: string | null, PremisesName: string | null, AddressType: string | null, ErfNumber: string | null, PortionNumber: string | null, NoOfUnits: string | null, UnitNumber: string | null, PhysicalAddress: string | null, Latitude: string | null, Longitude: string | null, ArchitectName: string | null, ArchitectUserID: string | null, BuildingPlanFor: string | null, TypeOfDevelopment: string | null, TotalArea: string | null, OccupationClassification: string | null, PlanFees: string | null, PropertyValue: string | null, StreetAddress: string | null, Suburb: string | null, City: string | null, PostalCode: string | null, SGCode: string | null, CreatedByID: string | null, Status: string | null, Stage: string | null, StageNumber: number | null, OmnibusServitude: boolean | null, BPApplicationID:string|null){
    
    const body = {
      ApplicationID: ApplicationID,
      LSNumber: LSNumber,
      UserID: UserID,
      FirstName: FirstName,
      Surname: Surname,
      EmailAddress: EmailAddress,
      CellNumber: CellNumber,
      AltEmail: AltEmail,
      AltCellNumber: AltCellNumber,
      IDNumber: IDNumber,
      PropertyDescription: PropertyDescription,
      PremisesName: PremisesName,
      AddressType: AddressType,
      ErfNumber: ErfNumber,
      PortionNumber: PortionNumber,
      NoOfUnits: NoOfUnits,
      UnitNumber: UnitNumber,
      PhysicalAddress: PhysicalAddress,
      Latitude: Latitude,
      Longitude: Longitude,
      ArchitectName: ArchitectName,
      ArchitectUserID: ArchitectUserID,
      BuildingPlanFor: BuildingPlanFor,
      TypeOfDevelopment: TypeOfDevelopment,
      TotalArea: TotalArea,
      OccupationClassification:OccupationClassification,
      PlanFees: PlanFees,
      PropertyValue: PropertyValue,
      StreetAddress: StreetAddress,
      Suburb: Suburb,
      City: City,
      PostalCode: PostalCode,
      SGCode: SGCode,
      CreatedById: CreatedByID,
      Status: Status,
      Stage: Stage,
      StageNumber: StageNumber,
      OmnibusServitude: OmnibusServitude,
      BPApplicationID: BPApplicationID
    }
    return this.httpClient.post(this.baseURL + "AddUpdateBuildingApplication", body);
  }

  public getAllBuildingApplications() {
    return this.httpClient.get(this.baseURL + "GetAllBuildingApplications");
  }

  public getBuildingApplicationByApplicationID(applicationID: number | null) {
    const body = {
      ApplicationID:applicationID
    }
    return this.httpClient.post(this.baseURL + "GetBuildingApplicationByApplicationID", body);
  }

  public getApplicationsByInternalUserID(userId: string | null) {
    const body = {
      UserID : userId
    }
    return this.httpClient.post(this.baseURL + "GetApplicationsByInternalUserID",body);
  }
  public getApplicationsByExternalUserID(userID:string|null) {
    const body = {
      UserID :userID
    }
    return this.httpClient.post(this.baseURL + "GetApplicationsByExternalUserID", body);
  }
  public deleteApplicationByApplicationID(applicationId: number | null) {
    const body = {
      ApplicationID:applicationId
    }
    return this.httpClient.post(this.baseURL + "DeleteApplicationByApplicationID", body);
  }

  public removeBuildingApplication(applicationID: number | null) {
    const body = {
      ApplicationID: applicationID
    }
    return this.httpClient.post(this.baseURL + "RemoveBuildingApplication", body);
  }

  public getBuildingApplicationByStageName(stageName: string | null) {
    const body = {
      Stage :stageName
    }
    return this.httpClient.post(this.baseURL + "GetBuildingApplicationByStageName", body);
  }

  public getAllBuildingPlansApplications() {
    return this.httpClient.get(this.baseURL + "GetAllBuildingPlansApplications");
  }
  public getAllPreInvoiceScrutinyApplications() {
    return this.httpClient.get(this.baseURL + "GetAllPreInvoiceScrutinyApplications");
  }

}
