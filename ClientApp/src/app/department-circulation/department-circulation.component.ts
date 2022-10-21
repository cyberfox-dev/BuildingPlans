import { Component, OnInit } from '@angular/core';
export interface PeriodicElement {
  dep: string;
  status: number;
  action: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { dep: 'Water & Sanitation', status: 1.0079, action: 'H' },
  { dep: 'Ist', status: 4.0026, action: 'He' },
  { dep: 'Transport', status: 6.941, action: 'Li' },
  { dep: 'Energy', status: 9.0122, action: 'Be' },


];
@Component({
  selector: 'app-department-circulation',
  templateUrl: './department-circulation.component.html',
  styleUrls: ['./department-circulation.component.css']
})
export class DepartmentCirculationComponent implements OnInit {

  constructor() { }
  displayedColumns: string[] = ['dep', 'status', 'action'];
  dataSource = ELEMENT_DATA;
  ngOnInit(): void {
  }

}
