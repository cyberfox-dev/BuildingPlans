import { Component, OnInit } from '@angular/core';
export interface PeriodicElement {
  dep: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { dep: 'Water & Sanitation' },
  { dep: 'Ist' },
  { dep: 'Transport' },
  { dep: 'Energy' },


];
@Component({
  selector: 'app-department-circulation',
  templateUrl: './department-circulation.component.html',
  styleUrls: ['./department-circulation.component.css']
})
export class DepartmentCirculationComponent implements OnInit {

  constructor() { }
  displayedColumns: string[] = ['dep', 'indication'];
  dataSource = ELEMENT_DATA;
  ngOnInit(): void {
  }

}
