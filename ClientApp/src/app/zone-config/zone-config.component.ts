import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
  selector: 'app-zone-config',
  templateUrl: './zone-config.component.html',
  styleUrls: ['./zone-config.component.css']
})
export class ZoneConfigComponent implements OnInit {

  displayedColumns: string[] = ['name', 'actions'];
  dataSource = ELEMENT_DATA;

  constructor(private matdialog: MatDialog) { }


  ngOnInit(): void {
  }



}
