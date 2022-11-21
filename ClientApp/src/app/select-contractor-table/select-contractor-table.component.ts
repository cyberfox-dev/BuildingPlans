import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  name: string;
  bp: string;
  surname: string;
  professionalRegNumber: string;
  CIBDNumber: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { bp: 'fdf', name: 'FullName', surname: "", professionalRegNumber: 'H', CIBDNumber :'554'},
];


@Component({
  selector: 'app-select-contractor-table',
  templateUrl: './select-contractor-table.component.html',
  styleUrls: ['./select-contractor-table.component.css']
})
export class SelectContractorTableComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  displayedColumns: string[] = ['bp', 'name', 'surname', 'professionalRegNumber','CIBDNumber'];
  dataSource = ELEMENT_DATA;
  clickedRows = new Set<PeriodicElement>();

  clearAll() {
    this.clickedRows.clear();
  }

}
