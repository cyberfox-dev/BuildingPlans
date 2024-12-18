import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, Component, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { NewProfileComponent } from './new-user/new-profile/new-profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NewEgineerComponent } from './new-user/new-egineer/new-egineer.component';
import { NewContractorComponent } from './new-user/new-contractor/new-contractor.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepperModule } from '@angular/material/stepper';
import { NewWayleaveComponent } from './create-new-wayleave/new-wayleave/new-wayleave.component';
import { MatTableModule } from '@angular/material/table';
import { ExternalDetailsComponent } from './type-of-applicant/external-details/external-details.component';
import { InternalDetailsComponent } from './type-of-applicant/internal-details/internal-details.component';
import { InternalOptionComponent } from './create-new-wayleave/internal-option/internal-option.component';
import { MatIconModule } from '@angular/material/icon';
import { SelectEngineerTableComponent } from './select-engineer-table/select-engineer-table.component';
import { SelectContractorTableComponent } from './select-contractor-table/select-contractor-table.component';
import { ProjectDetailsComponent } from './create-new-wayleave/project-details/project-details.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ProjectDetailsMapComponent } from './create-new-wayleave/project-details-map/project-details-map.component';
import { ViewProjectInfoComponent } from './view-project/view-project-info/view-project-info.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ViewProjectDetailsComponent } from './view-project/view-project-details/view-project-details.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActionCenterComponent } from './action-center/action-center.component';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentCirculationComponent } from './department-circulation/department-circulation.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { DepartmentConfigComponent } from './department-config/department-config.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ConfigurationComponent } from './configuration/configuration.component';
import { ViewEngineersTableComponent } from './view-engineers-table/view-engineers-table.component';
import { ViewContractorsTableComponent } from './view-contractors-table/view-contractors-table.component';
import { EditEngineerComponent } from './edit-engineer/edit-engineer.component';
import { EditContractorComponent } from './edit-contractor/edit-contractor.component';
import { MatDividerModule } from '@angular/material/divider';
import { NewDepartmentComponent } from './new-department/new-department.component';
import { NewSubDepartmentComponent } from './new-sub-department/new-sub-department.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SubDepartmentConfigComponent } from './sub-department-config/sub-department-config.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ZoneConfigComponent } from './zone-config/zone-config.component';
import { NewZoneComponent } from './new-zone/new-zone.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { ClientDetailsComponent } from 'src/app/type-of-applicant/client-details/client-details.component';
import { RolesConfigComponent } from './roles-config/roles-config.component';
import { NewRoleComponent } from './new-role/new-role.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { StagesConfigComponent } from './stages-config/stages-config.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CyberfoxConfigComponent } from './cyberfox-config/cyberfox-config.component';
import { AccessGroupsConfigComponent } from './access-groups-config/access-groups-config.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MandatoryDocsConfigComponent } from './mandatory-docs-config/mandatory-docs-config.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ServiceItemsConfigComponent } from './service-items-config/service-items-config.component';
import { GlCodeConfigComponent } from './gl-code-config/gl-code-config.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { AuditTrailComponent } from './audit-trail/audit-trail.component';
import { ProjectDetailsMapViewComponent } from './create-new-wayleave/project-details-map-view/project-details-map-view.component';
import { NotificationCenterComponent } from './notification-center/notification-center.component';
import { MatSliderModule } from '@angular/material/slider';
import { UserManagementComponent } from './user-management/user-management.component';
import { InternalUserUnassignedDepartmentComponent } from './internal-user-unassigned-department/internal-user-unassigned-department.component';
import { DocumentsComponentComponent } from './documents-component/documents-component.component';
import { TypeOfExcavationComponent } from './type-of-excavation/type-of-excavation.component';
import { PermitComponentComponent } from './permit-component/permit-component.component';
import { SharedService } from './shared/shared.service';
import { DepartmentCirculationPlanningComponent } from './department-circulation-planning/department-circulation-planning.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { ProjectSizeConfigComponent } from './project-size-config/project-size-config.component';
import { InitializationService } from './service/Initialization/initialization.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ServiceConditionsComponent } from './service-conditions/service-conditions.component';
import { ConfigActingDepartmentComponent } from './config-acting-department/config-acting-department.component';
import { DocumentRepositoryComponent } from './document-repository/document-repository.component';
import { SnackBarAlertsComponent } from './snack-bar-alerts/snack-bar-alerts.component'
import { DocumentRepositoryConfigComponent } from './document-repository-config/document-repository-config.component';
import { DraftsComponent } from 'src/app/drafts/drafts.component';
import { MatChipsModule } from '@angular/material/chips';
import { QuillModule } from 'ngx-quill';
import { ApprovalPackComponent } from 'src/app/Packs/ApprovalPackComponent/approval-pack.component';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { SystemAlertConfigComponent } from 'src/app/system-alert-config/system-alert-config.component';
import { OldApplicationVersionsComponent } from './old-application-versions/old-application-versions.component'; //reapply Sindiswa 26 January 2024
import { ApplicationAlertsComponent } from 'src/app/application-alerts/application-alerts.component'; //Clarify Alerts Kyle
import { SubdeptWayleaveExpirationComponent } from './subdept-wayleave-expiration/subdept-wayleave-expiration.component'; //wayleaveExpiry Sindiswa 08 February 2024
import { StatusOfWorksComponent } from './status-of-works/status-of-works.component';
import { BuildingApplicationComponent } from 'src/app/building-application/building-application.component';
import { GoogleMapsComponentComponent } from './create-new-wayleave/google-maps-component/google-maps-component.component';
import { GoogleMapsModule } from '@angular/google-maps'
import { OccupationClassificationConfigComponent } from 'src/app/occupation-classification-config/occupation-classification-config.component';
import { BPDepartmentConfigComponent } from './bpdepartment-config/bpdepartment-config.component';
import { ChecklistConfigComponent } from 'src/app/checklist-config/checklist-config.component';
import { BPAccessGroupsConfigComponent } from './bpaccess-groups-config/bpaccess-groups-config.component';
import { BPViewProjectInfoComponent } from './bpview-project-info/bpview-project-info.component';
import { EditClientsComponent } from './edit-clients/edit-clients.component';
import { EditArchitectsComponent } from './edit-architects/edit-architects.component';
import { BPFileUploadComponent } from './bpfile-upload/bpfile-upload.component';
import { BPViewStageChecklistComponent } from './bpview-stage-checklist/bpview-stage-checklist.component';
import { BPDemolitionApplicationComponent } from './bpdemolition-application/bpdemolition-application.component';
import { BPSignageApplicationComponent } from './bpsignage-application/bpsignage-application.component';
import { BPBannerApplicationComponent } from './bpbanner-application/bpbanner-application.component';
import { BpConfigurationsComponent } from 'src/app/bp-configurations/bp-configurations.component';
import { BPStagesComponent } from 'src/app/bpstages/bpstages.component';
import { BPRolesConfigComponent } from 'src/app/bproles-config/bproles-config.component';
import { BPDepartmentManagerComponent } from 'src/app/bpdepartment-manager/bpdepartment-manager.component';
import { BpActionCenterComponent } from './bp-action-center/bp-action-center.component';
import { BPFinancialsComponent } from './bpfinancials/bpfinancials.component';
import { BpAlertModalComponent } from './bp-alert-modal/bp-alert-modal.component'; //BPDialogBoxes Sindiswa 24062024
import { BpConfirmModalComponent } from './bp-confirm-modal/bp-confirm-modal.component'; //BPDialogBoxes Sindiswa 24062024
import { BPServiceItemsComponent } from './bpservice-items/bpservice-items.component';
import { BpMandoryDocumentsComponent } from './bp-mandory-documents/bp-mandory-documents.component';
import { BPDepartmentDocRequiredUploadsComponent } from './bpdepartment-doc-required-uploads/bpdepartment-doc-required-uploads.component'; //BPDialogBoxes Sindiswa 24062024
import { CreateNewApplicationComponent } from './create-new-application/create-new-application.component';
import { BPTasksComponent } from './bptasks/bptasks.component';
import { BPApplicationChecklistComponent } from './bpapplication-checklist/bpapplication-checklist.component';
import { BPFunctionalAreaComponent } from './bpfunctional-area/bpfunctional-area.component'
import { BugsConfigComponent } from './bugs-config/bugs-config.component';
//import { MatExpansionModule } from '@angular/material/expansion';

//import { MapModule } from 'arcgis-js-api';
//import Map from "@arcgis/core/Map";
// Define the APP_INITIALIZER provider
//export function initializeApp(initializationService: InitializationService) {
//  return () => initializationService.initializeApp();
//}

@NgModule({
  declarations: [
    //  Map,
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    LoginComponent,
    NewProfileComponent,
    NewEgineerComponent,
    NewContractorComponent,
    NewWayleaveComponent,
    ExternalDetailsComponent,
    InternalDetailsComponent,
    InternalOptionComponent,
    SelectEngineerTableComponent,
    SelectContractorTableComponent,
    ProjectDetailsComponent,
    ProjectDetailsMapComponent,
    ViewProjectInfoComponent,
    ViewProjectDetailsComponent,
    ActionCenterComponent,
    DepartmentCirculationComponent,
    NewWayleaveComponent,
    ExternalDetailsComponent,
    InternalDetailsComponent,
    InternalOptionComponent,
    //  SelectEngineerTableComponent,
    SelectContractorTableComponent,
    ProjectDetailsComponent,
    ViewProjectInfoComponent,
    ViewProjectDetailsComponent,
    ActionCenterComponent,
    DepartmentConfigComponent,
    ConfigurationComponent,
    ViewEngineersTableComponent,
    ViewContractorsTableComponent,
    EditEngineerComponent,
    EditContractorComponent,
    NewDepartmentComponent,
    NewSubDepartmentComponent,
    SubDepartmentConfigComponent,
    ZoneConfigComponent,
    NewZoneComponent,
    UserSettingsComponent,
    ClientDetailsComponent,
    RolesConfigComponent,
    NewRoleComponent,
    StagesConfigComponent,
    CyberfoxConfigComponent,
    AccessGroupsConfigComponent,
    MandatoryDocsConfigComponent,
    FileUploadComponent,
    ServiceItemsConfigComponent,
    GlCodeConfigComponent,
    InvoiceComponent,
    ProjectDetailsMapViewComponent,
    AuditTrailComponent,
    NotificationCenterComponent,
    UserManagementComponent,
    InternalUserUnassignedDepartmentComponent,
    DocumentsComponentComponent,
    TypeOfExcavationComponent,
    PermitComponentComponent,
    DepartmentCirculationPlanningComponent,
    ContactDetailsComponent,
    //MatExpansionModule,
    ProjectSizeConfigComponent,
    ServiceConditionsComponent,
    ConfigActingDepartmentComponent,
    DocumentRepositoryComponent,
    DocumentRepositoryConfigComponent,
    SnackBarAlertsComponent,
    SystemAlertConfigComponent,

    DraftsComponent,
      ApprovalPackComponent,
    OldApplicationVersionsComponent, //reapply Sindiswa 25 January 2024
    ApplicationAlertsComponent,//Clarify Alerts Kyle 
    SubdeptWayleaveExpirationComponent, //wayleaveExpiry Sindiswa 08 February 2024
    StatusOfWorksComponent,
    BuildingApplicationComponent,
    GoogleMapsComponentComponent,
    OccupationClassificationConfigComponent,
    BPDepartmentConfigComponent,
    ChecklistConfigComponent,
    BPAccessGroupsConfigComponent,
    BPViewProjectInfoComponent,
    EditClientsComponent,
    EditArchitectsComponent,
    BPFileUploadComponent,
    BPViewStageChecklistComponent,
    BPDemolitionApplicationComponent,
    BPSignageApplicationComponent,
    BPBannerApplicationComponent,
    BpConfigurationsComponent,
    BPStagesComponent, //BP Stages Kyle
    BPRolesConfigComponent, 
    BPDepartmentManagerComponent,
    BpActionCenterComponent,
    BPFinancialsComponent,
    BpAlertModalComponent, //BPDialogBoxes Sindiswa 24062024
    BpConfirmModalComponent, //BPDialogBoxes Sindiswa 24062024
    BPServiceItemsComponent,
    BpMandoryDocumentsComponent,
    BpConfirmModalComponent, BPDepartmentDocRequiredUploadsComponent, //BPDialogBoxes Sindiswa 24062024
    CreateNewApplicationComponent, BPTasksComponent,
    CreateNewApplicationComponent,
    BPApplicationChecklistComponent,
    BPFunctionalAreaComponent,
    BugsConfigComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    MatSlideToggleModule,
    MatSliderModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatRadioModule,
    MatChipsModule,
    MatBottomSheetModule,
    MatDividerModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSelectModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatTabsModule,
    MatExpansionModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatCheckboxModule,
    MatTableModule,
    MatSidenavModule,
    MatButtonModule,
    MatTabsModule,
    MatExpansionModule,
    NgbModule,
    GooglePlaceModule,
    GoogleMapsModule,
    DragDropModule,
    QuillModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: LoginComponent},
      { path: 'home', component: HomeComponent},
      { path: 'new-profile', component: NewProfileComponent },
      { path: 'new-wayleave', component: NewWayleaveComponent },
      { path: 'view-project-info', component: ViewProjectInfoComponent },
      { path: 'configuration', component: ConfigurationComponent },
      { path: 'bp-configuration', component: BpConfigurationsComponent },
      { path: 'user-settings', component: UserSettingsComponent },
      { path: 'cyberfox-config', component: CyberfoxConfigComponent },
      { path: 'invoice', component: InvoiceComponent },
      { path: 'internal-user-unassigned-department', component: InternalUserUnassignedDepartmentComponent },
      { path: 'building-application', component: BuildingApplicationComponent },
      { path: 'bpview-project-info', component: BPViewProjectInfoComponent },
      { path: 'bpdemolition-application', component: BPDemolitionApplicationComponent },
      { path: 'bpsignage-application', component: BPSignageApplicationComponent },
      { path: 'bpbanner-application', component: BPBannerApplicationComponent },
    ])
  ],
  providers: [
    //InitializationService,
    //{
    //  provide: APP_INITIALIZER,
    //  useFactory: initializeApp,
    //  multi: true,
    //  deps: [InitializationService]
    //},
    SelectEngineerTableComponent,
    SelectContractorTableComponent,
    HomeComponent,
    SharedService,
    LoginComponent,
    NewProfileComponent,
    // NewWayleaveComponent,
    DepartmentConfigComponent,
    ActionCenterComponent,
    ViewProjectInfoComponent,
    PermitComponentComponent,
    FileUploadComponent,
    NotificationCenterComponent,
    DocumentRepositoryConfigComponent,
    DraftsComponent,
    ApprovalPackComponent,
    DocumentsComponentComponent,
    //Audit Trail Kyle
    AuditTrailComponent,
    //Audit Trail Kyle
    UserManagementComponent, //actingAsInternal Sindiswa 05 February 2024
    ApplicationAlertsComponent,//Clarify Alerts Kyle
    StatusOfWorksComponent,
    GoogleMapsComponentComponent,
    BuildingApplicationComponent,
    OccupationClassificationConfigComponent,
    ChecklistConfigComponent,
    BPAccessGroupsConfigComponent,
    BPFileUploadComponent,
    BPViewStageChecklistComponent,
    BPDemolitionApplicationComponent,
    BPViewProjectInfoComponent,
    BpConfigurationsComponent,
    BPStagesComponent, // BP Stages Kyle
    BPRolesConfigComponent,
    BPDepartmentManagerComponent,
    BPFinancialsComponent,
    BPServiceItemsComponent,
    BpMandoryDocumentsComponent,
    CreateNewApplicationComponent,
    BPApplicationChecklistComponent,
    BugsConfigComponent,
  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
