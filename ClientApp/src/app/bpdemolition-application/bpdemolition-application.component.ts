import { Component, OnInit } from '@angular/core';
import { OccupationClassificationService } from 'src/app/service/OccupationClassification/occupation-classification.service';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { SharedService } from '../shared/shared.service';
export interface OccupationsClassificationsList {

}
@Component({
  selector: 'app-bpdemolition-application',
  templateUrl: './bpdemolition-application.component.html',
  styleUrls: ['./bpdemolition-application.component.css']
})
export class BPDemolitionApplicationComponent implements OnInit {

  constructor(private occupationService: OccupationClassificationService , private router :Router,private sharedService:SharedService) { }

  OccupationsClassificationList: OccupationsClassificationsList[] = [];

  isOwner: boolean = false;
  isArchive: boolean;
  ngOnInit(): void {
    this.isArchive = this.sharedService.isDemolitionArchive;
  }

  onCheckIsOwner() {
    if (this.isOwner == false) {
      this.isOwner = true;
    }
    else {
      this.isOwner = false;
    }
  }

  //getAllOccupationClassifications() {
  //  this.occupationService.getAllClassificationForFunctionalArea("Building Plan").subscribe((data:any))
  //}

  Create() {
    this.router.navigate(["/home"]);
  }
}
