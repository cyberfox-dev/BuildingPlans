import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';
  message: any;

  recieveConfigShow($event: string) {
    console.log('msdsdessage', $event);
    this.message = $event;


  }
  @ViewChild('sidenav') sidenav: MatSidenav;

  reason = '';


  logOut() {

  }
}
