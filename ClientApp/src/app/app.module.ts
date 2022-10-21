import { BrowserModule } from '@angular/platform-browser';
import { Component, NgModule } from '@angular/core';
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



@NgModule({
  declarations: [
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
    SelectEngineerTableComponent,
    SelectContractorTableComponent,
    ProjectDetailsComponent,
    ProjectDetailsMapComponent,
    ViewProjectInfoComponent,
    ViewProjectDetailsComponent,
    ActionCenterComponent,

  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTabsModule,
    MatExpansionModule,
    MatIconModule,
    MatTableModule,
    MatSidenavModule,
    MatButtonModule,
    MatTabsModule,
    MatExpansionModule,
    MatIconModule,
    NgbModule,
    RouterModule.forRoot([
      { path: '', component: LoginComponent },
      { path: 'home', component: HomeComponent},
      { path: 'new-profile', component: NewProfileComponent },
      { path: 'new-wayleave', component: NewWayleaveComponent },
      { path: 'view-project-info', component: ViewProjectInfoComponent },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
