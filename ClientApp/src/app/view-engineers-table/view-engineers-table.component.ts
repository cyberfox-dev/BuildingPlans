import { Component, OnInit } from '@angular/core';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfessionalsLinksService } from 'src/app/service/ProfessionalsLinks/professionals-links.service';
import { ProfessionalService } from 'src/app/service/Professionals/professional.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;

  cell: number;
  email: string;

}

export interface ProfessionalsLinkslist {

  professinalID: number;
  ProfessinalType: string;
  professionalRegNo: string;
  bpNumber: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  idNumber?: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'jj', weight: 1.0079, symbol: 'H', cell: 526205658, email: 'jjjj@gmail.com' },

];



@Component({
  selector: 'app-view-engineers-table',
  templateUrl: './view-engineers-table.component.html',
  styleUrls: ['./view-engineers-table.component.css']
})


export class ViewEngineersTableComponent implements OnInit {

  ProfessionalsLinksService: ProfessionalsLinksService[] = [];

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'cell', 'email', 'actions'];
  dataSource = ELEMENT_DATA;



  constructor(private professionalService: ProfessionalService, private professionalsLinksService: ProfessionalsLinksService,) { }

  ngOnInit(): void {
  }

  getAllEngineersApplicationID() {

    this.ProfessionalsLinksService.splice(0, this.ProfessionalsLinksService.length);

  }

}
