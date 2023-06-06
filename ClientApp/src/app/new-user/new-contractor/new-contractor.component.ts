import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatTable } from '@angular/material/table';
import { SharedService } from 'src/app/shared/shared.service';

export interface ContractorList {

  ProfessinalType: string;
  professionalRegNo: string;
  bpNumber: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber?: number;
  CIBRating: string;
  idNumber?: string;

}




@Component({
  selector: 'app-new-contractor',
  templateUrl: './new-contractor.component.html',
  styleUrls: ['./new-contractor.component.css']
})
export class NewContractorComponent implements OnInit {
  closeResult = "";
  contractorIDNo = '';
  bpNoContractor = "";
  ProfessionalRegNo = "";
  CIBRating = "";
  Name = "";
  Surname = '';
  ContractorTell?: number;
  ContractorEmail = '';




  editBpNoContractor = '';
  editProfessionalRegNo = '';
  editCIBDrating = '';
  editName = '';
  editSurname = '';
  editContractorTell?:number;
  editContractorEmail = '';
  editContractorIDNo? = '';

  forEditIndex = 0;

  tempContractorList: ContractorList[] = [];

 

  constructor(private modalService: NgbModal, private shared: SharedService) { }

  displayedColumns: string[] = ['ProfessinalType', 'name', 'surname', 'phoneNumber','CIBRating' ,'email', 'actions'];
  dataSource = this.tempContractorList;
  @ViewChild(MatTable) table: MatTable<ContractorList> | undefined;

  ngOnInit(): void {
  }
  openXl(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }

  onAddcontractor() {
    const newContractor = {} as ContractorList;
    newContractor.ProfessinalType = "Contractor";
    newContractor.bpNumber = this.bpNoContractor;
    newContractor.professionalRegNo = this.ProfessionalRegNo;
    newContractor.name = this.Name;
    newContractor.surname = this.Surname;
    newContractor.email = this.ContractorEmail;
    newContractor.phoneNumber = this.ContractorTell;
    newContractor.CIBRating = this.CIBRating;
    newContractor.idNumber = this.contractorIDNo;

    this.tempContractorList.push(newContractor);
    this.table?.renderRows();
    this.shared.setContactorData(this.tempContractorList);
   this.clearCreateComponent();
  }

  onDelete(position: any) {
    const deleteContractor = this.tempContractorList[position]; 
    if (confirm("Are you sure to delete " + deleteContractor.name +" "+ deleteContractor.surname +"?")) {
      this.tempContractorList.splice(position, 1);
      this.table?.renderRows();
      this.shared.setContactorData(this.tempContractorList);
    }
    
  }

  openEditModal(edit: any, index: any) {
    this.modalService.open(edit, { size: 'xl' });

    const forEditContactor = this.tempContractorList[index];
    this.editBpNoContractor = forEditContactor.bpNumber;
    this.editProfessionalRegNo = forEditContactor.professionalRegNo;
    this.editName = forEditContactor.name;
    this.editSurname = forEditContactor.surname;
    this.editContractorTell = forEditContactor.phoneNumber;
    this.editContractorEmail = forEditContactor.email;
    this.editCIBDrating = forEditContactor.CIBRating;
    this.editContractorIDNo = forEditContactor.idNumber;

    this.forEditIndex = index;
  }

  onEditContractor() {
    this.tempContractorList.splice(this.forEditIndex, 1);
    const toEdit = {} as ContractorList;
    toEdit.ProfessinalType = "Contractor";
    toEdit.bpNumber = this.editBpNoContractor;
    toEdit.professionalRegNo = this.editProfessionalRegNo;
    toEdit.name = this.editName;
    toEdit.surname = this.editSurname;
    toEdit.email = this.editContractorEmail;
    toEdit.phoneNumber = this.editContractorTell;
    toEdit.CIBRating = this.editCIBDrating;
    toEdit.idNumber = this.editContractorIDNo;

    this.tempContractorList.push(toEdit);
    this.table?.renderRows();
    this.shared.setContactorData(this.tempContractorList);

  }

  clearCreateComponent() {
    this.bpNoContractor = "";
    this.ProfessionalRegNo = "";
    this.CIBRating = "";
    this.Name = "";
    this.Surname = '';
    this.ContractorTell = undefined;
    this.ContractorEmail = '';
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
