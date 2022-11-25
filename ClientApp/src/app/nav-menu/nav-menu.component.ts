import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DepartmentConfigComponent } from 'src/app/department-config/department-config.component';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SharedService } from '../shared/shared.service';

export interface PeriodicElement {
  Comment: string;
  date: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { Comment: 'This is a test', date:'10/10/10' },
  { Comment: 'These comments are hardcoded', date: '10/10/10' },
  { Comment: 'They are not real', date: '10/10/10' },
];
@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  isExpanded = false;
  configShow : number | undefined;

  constructor(private modalService: NgbModal, private router: Router, private shared: SharedService) { }

  displayedColumns: string[] = ['Comment','date', 'actions'];
  dataSource = ELEMENT_DATA;



  ngOnInit(): void {
  
     
  }

  goToConfig() {
    this.router.navigate(["/configuration"]);
  }

  goToSettings() {
    this.router.navigate(["/user-settings"]);
  }
  goToCyberfoxCofig() {
    this.router.navigate(["/cyberfox-config"]);
  }

  openCommentBuilder(commentBuilder:any) {
    this.modalService.open(commentBuilder, { centered:true,size: 'xl' });
  }
  openCreateNewComment(createNewComment : any) {
    this.modalService.open(createNewComment, { centered: true, size: 'lg' });
  }
  viewEditComment(editComment: any) {
    this.modalService.open(editComment, { centered: true, size: 'lg' });
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  openModal() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;

    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.modalService.open(DepartmentConfigComponent);
  }

  openXl(content: any) {
		this.modalService.open(content, { size: 'xl' });
  }


  goHome() {
    this.router.navigate(["/home"]);
  }


  

}
