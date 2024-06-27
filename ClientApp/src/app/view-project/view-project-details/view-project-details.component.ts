import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SharedService } from "src/app/shared/shared.service";

export interface ApplicationList {
  applicationID: number,
  clientName: string,
  clientEmail: string,
  clientAddress: string,
  clientRefNo: string,
  CompanyRegNo: string,
  TypeOfApplication: string,
  NotificationNumber: string,
  WBSNumber: string,
  PhysicalAddressOfProject: string,
  DescriptionOfProject: string,
  NatureOfWork: string,
  ExcavationType: string,
  ExpectedStartDate: Date,
  ExpectedEndDate: Date,
  Location: string,
  clientCellNo: string,
  CreatedById: number,
  ApplicationStatus: string,
  CurrentStageName: string,
  CurrentStageNumber: number,
  CurrentStageStartDate: Date,
  NextStageName: string,
  NextStageNumber: number,
  PreviousStageName: string,
  PreviousStageNumber: number,
  Coordinates: string,
  NetworkLicensees: string;
}

@Component({
  selector: 'app-view-project-details',
  templateUrl: './view-project-details.component.html',
  styleUrls: ['./view-project-details.component.css']
})
export class ViewProjectDetailsComponent implements OnInit {

  public viewProjectDetails = this.formBuilder.group({
   typeOfApplication: ['', Validators.required],
    notificationNumber: ['', Validators.required],
    WBSNo: ['', Validators.required],
    physicalAddress: ['', Validators.required],
    descriptionOfWork: ['', Validators.required],
    typeOfWorks: ['', Validators.required],
    typeOfExcavation: ['', Validators.required],
    expectedStartDate: ['', Validators.required],
    expectedEndDate: ['', Validators.required],
    physicalAddressOfProject: ['', Validators.required],
    coordinates: ['', Validators.required],
    fibreNetworkLicensees: ['',Validators.required],
  }) 
  applicationDataForView: ApplicationList[] = [];
  constructor(private sharedService: SharedService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.applicationDataForView.push(this.sharedService.getViewApplicationIndex())
    const setValues = this.applicationDataForView[0];
    
    this.viewProjectDetails.controls["typeOfApplication"].setValue(setValues.TypeOfApplication);
    this.viewProjectDetails.controls["notificationNumber"].setValue(setValues.NotificationNumber);
    this.viewProjectDetails.controls["WBSNo"].setValue(setValues.WBSNumber);
    this.viewProjectDetails.controls["physicalAddress"].setValue(setValues.PhysicalAddressOfProject);
    this.viewProjectDetails.controls["descriptionOfWork"].setValue(setValues.DescriptionOfProject);
    this.viewProjectDetails.controls["typeOfWorks"].setValue(setValues.NatureOfWork);
    this.viewProjectDetails.controls["typeOfExcavation"].setValue(setValues.ExcavationType);
  /*JJS Commit 20-02-24*/

    this.viewProjectDetails.controls["physicalAddressOfProject"].setValue(setValues.PhysicalAddressOfProject);
    this.viewProjectDetails.controls["coordinates"].setValue(setValues.Coordinates);
    this.viewProjectDetails.controls["expectedEndDate"].setValue(setValues.ExpectedEndDate.toString().substring(0, setValues.ExpectedEndDate.toString().indexOf('T')));
    this.viewProjectDetails.controls["expectedStartDate"].setValue(setValues.ExpectedStartDate.toString().substring(0, setValues.ExpectedStartDate.toString().indexOf('T')));
    this.viewProjectDetails.controls["fibreNetworkLicensees"].setValue(setValues.NetworkLicensees);
    // this.viewProjectDetails.controls["typeOfApplication"].setValue(this.applicationDataForView.)
   
  }


  settingView() {
   
  }

  actionCenter() {
    if (true) {

    }
    else if (true) {

    }
    else if (true) {

    }
    else if (true) {

    }
  }

}
