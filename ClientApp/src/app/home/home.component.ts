import { Component } from '@angular/core';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {

  constructor(private router: Router) {

  }

  ngOnInit(): void {
  }
  viewProject() {
    this.router.navigate(["/view-project-info"]);
  }


  goToNewWayleave(){
    this.router.navigate(["/new-wayleave"]);
  }
}
