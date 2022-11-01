import { Component, OnInit,Input } from '@angular/core';
import { NavMenuComponent } from 'src/app/nav-menu/nav-menu.component';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {



  public zone: boolean = false;
  public dep: boolean = false;

  configShow: any;


  constructor(private router: Router,private shared: SharedService) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.configShow = this.shared.getConfigShow();

    console.log(this.configShow);
  } 


}
