import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

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
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', cell: 526205658, email: 'jjjj@gmail.com' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', cell: 526205658, email: 'jjjj@gmail.com' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', cell: 526205658, email: 'jjjj@gmail.com' },
];

@Component({
  selector: 'app-new-contractor',
  templateUrl: './new-contractor.component.html',
  styleUrls: ['./new-contractor.component.css']
})
export class NewContractorComponent implements OnInit {
  closeResult = "";
  bpNoContractor = "";
  ProfessionalRegNo = "";
  CIBDrating = "";
  Name = "";
  Surname = '';
  ContractorTell = 0;
  ContractorEmail = '';


  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'cell', 'email', 'actions'];
  dataSource = ELEMENT_DATA;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }
  openXl(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
