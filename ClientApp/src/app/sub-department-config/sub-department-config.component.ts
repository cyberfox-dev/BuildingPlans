import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  name: string;


}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Water' },
  { name: 'IST' },
  { name: 'Energy' },
  { name: 'Fire' },
];

@Component({
  selector: 'app-sub-department-config',
  templateUrl: './sub-department-config.component.html',
  styleUrls: ['./sub-department-config.component.css']
})
export class SubDepartmentConfigComponent implements OnInit {
  displayedColumns: string[] = ['name', 'actions'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit(): void {
  }

}
