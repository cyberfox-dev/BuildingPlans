import { Component, OnInit } from '@angular/core';

export interface PeriodicElements {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElements[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },

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

  displayedColumnss: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSources = ELEMENT_DATA;
  clickedRows = new Set<PeriodicElements>();

  clearAll() {
    this.clickedRows.clear();
  }

}
