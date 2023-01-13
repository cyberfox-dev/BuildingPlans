import { Component, OnInit } from '@angular/core';
export interface PeriodicElement {
  dep: string;
  indication: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { dep: 'Water & Sanitation', indication:'green' },
  { dep: 'Ist', indication: 'red' },
  { dep: 'Transport', indication: 'wait' },
  { dep: 'Energy', indication: 'orange' },
  { dep: 'Department', indication: 'blue' },


];
@Component({
  selector: 'app-department-circulation',
  templateUrl: './department-circulation.component.html',
  styleUrls: ['./department-circulation.component.css']
})
export class DepartmentCirculationComponent implements OnInit {

  approveIcon = false;
  rejectIcon = false;
  waitingIcon = true;
  referIcon = false;
  ClarifyIcon = false;


  constructor() { }
  displayedColumns: string[] = ['dep', 'indication'];
  dataSource = ELEMENT_DATA;
  ngOnInit(): void {
  }

  setIcon() {

  }

}
