import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatTable } from '@angular/material/table';

export interface ContractorList {

  ProfessinalType: string;
  professionalRegNo: string;
  bpNumber: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: number;
  CIBDrating: string;

}




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



  editBpNoApplicant = '';
  editProfessionalRegNo = '';
  editName = '';
  editSurname = '';
  editApplicantTellNo = '';
  editApplicantEmail = '';


  tempContractorList: ContractorList[] = [];

 

  constructor(private modalService: NgbModal) { }

  displayedColumns: string[] = ['ProfessinalType', 'bpNumber', 'name', 'surname', 'professionalRegNo', 'phoneNumber','CIBDrating' ,'email', 'actions'];
  dataSource = this.tempContractorList;
  @ViewChild(MatTable) table: MatTable<ContractorList> | undefined;

  ngOnInit(): void {
  }
  openXl(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }

  onAddcontractor() {
    const newContractor = {} as ContractorList;
    newContractor.ProfessinalType = "Contactor";
    newContractor.bpNumber = this.bpNoContractor;
    newContractor.professionalRegNo = this.ProfessionalRegNo;
    newContractor.name = this.Name;
    newContractor.surname = this.Surname;
    newContractor.email = this.ContractorEmail;
    newContractor.phoneNumber = this.ContractorTell;
    newContractor.bpNumber = this.CIBDrating;

    this.tempContractorList.push(newContractor);
    this.table?.renderRows();
   // this.clearCreateComponent();
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
