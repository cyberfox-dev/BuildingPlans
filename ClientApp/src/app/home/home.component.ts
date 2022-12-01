import { Component } from '@angular/core';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
  CurrentUser: any;
  stringifiedData: any;
  constructor(private router: Router) {

  }

  ngOnInit(): void {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);


  }
  viewProject() {
    this.router.navigate(["/view-project-info"]);
  }


  goToNewWayleave(){
    this.router.navigate(["/new-wayleave"]);
  }
}
