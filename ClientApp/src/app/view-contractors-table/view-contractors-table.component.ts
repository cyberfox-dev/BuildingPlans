import { Component, OnInit } from '@angular/core';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  rating: number;
  cell: number;
  email: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', rating: 5, cell: 526205658, email: 'jjjj@gmail.com' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', rating: 5, cell: 526205658, email: 'jjjj@gmail.com' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', rating: 5, cell: 526205658, email: 'jjjj@gmail.com' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', rating: 5, cell: 526205658, email: 'jjjj@gmail.com' },

];

@Component({
  selector: 'app-view-contractors-table',
  templateUrl: './view-contractors-table.component.html',
  styleUrls: ['./view-contractors-table.component.css']
})
export class ViewContractorsTableComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'rating', 'cell' , 'email','actions'];
  dataSource = ELEMENT_DATA;
  constructor() { }

  ngOnInit(): void {
  }

}
