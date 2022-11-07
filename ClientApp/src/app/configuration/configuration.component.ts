import { Component, OnInit,Input } from '@angular/core';
import { NavMenuComponent } from 'src/app/nav-menu/nav-menu.component';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { SharedService } from '../shared/shared.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {




  constructor(private router: Router,private shared: SharedService) { }

  ngOnInit() {

  }

  



}
