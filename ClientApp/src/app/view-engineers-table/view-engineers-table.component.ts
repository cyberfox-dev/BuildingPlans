import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;

  cell: number;
  email: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', cell: 526205658, email: 'jjjj@gmail.com' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He',  cell: 526205658, email: 'jjjj@gmail.com' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li',  cell: 526205658, email: 'jjjj@gmail.com' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be',  cell: 526205658, email: 'jjjj@gmail.com' },
];


@Component({
  selector: 'app-view-engineers-table',
  templateUrl: './view-engineers-table.component.html',
  styleUrls: ['./view-engineers-table.component.css']
})
export class ViewEngineersTableComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'cell', 'email', 'actions'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit(): void {
  }

}
