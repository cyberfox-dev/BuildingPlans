import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})

@Injectable({ providedIn: 'root' })
export class ProjectDetailsComponent implements OnInit {

  typeOfApplication = '';
  notificationNumber = '';
  wbsNumber = '';
  physicalAddressOfProject = '';
  descriptionOfProject = '';
  natureOfWork = '';
  excavationType = '';
  expectedStartDate: Date = new Date();
  expectedEndType: Date = new Date();

  constructor(private formBuilder: FormBuilder) { }

  public addApplicationProject = this.formBuilder.group({
    typeOfApplication: ['', Validators.required],
    notificationNumber: ['', Validators.required],
    wbsNumber: ['', Validators.required],
    physicalAddressOfProject: ['', Validators.required],
    descriptionOfProject: ['', Validators.required],
    natureOfWork: ['', Validators.required],
    excavationType: ['', Validators.required],
    expectedStartDate: ['', Validators.required],
    expectedEndType: ['', Validators.required]
  })

  ngOnInit(): void {
  }

}
