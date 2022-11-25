import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { empty } from 'rxjs';
import { InternalOptionComponent } from 'src/app/create-new-wayleave/internal-option/internal-option.component';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];
@Component({
  selector: 'app-new-wayleave',
  templateUrl: './new-wayleave.component.html',
  styleUrls: ['./new-wayleave.component.css']
})
export class NewWayleaveComponent implements OnInit {

  public external: boolean = true;
  public internal: boolean = false;
  public client: boolean = false;
  public map: boolean = true;
    option: any;
    isAllSelected: any;
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
   
  }

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  clickedRows = new Set<PeriodicElement>();

  clearAll() {
    this.clickedRows.clear();
  }


  reciveOption($event: any) {
    this.option = $event
    if (this.option == "client") {
      this.client = true;
      this.external = false;
      this.map = false;
    }
    else if (this.option == "internal") {
      this.internal = true;
      this.external = false;
    }

  }

}
