import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NavMenuComponent } from 'src/app/nav-menu/nav-menu.component';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { SharedService } from '../shared/shared.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DepartmentsService } from '../service/Departments/departments.service';
import { MatTable } from '@angular/material/table';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FrequentlyAskedQuestionsService } from '../service/FAQ/frequently-asked-questions.service';
import { AccessGroupsService } from '../service/AccessGroups/access-groups.service';

@Component({
  selector: 'app-bp-configurations',
  templateUrl: './bp-configurations.component.html',
  styleUrls: ['./bp-configurations.component.css']
})
export class BpConfigurationsComponent implements OnInit {

  constructor(private router: Router, private shared: SharedService, private departmentService: DepartmentsService, private modalService: NgbModal, private faq: FrequentlyAskedQuestionsService, private accessGroupsService: AccessGroupsService) { }

  ngOnInit(): void {
  }

}
