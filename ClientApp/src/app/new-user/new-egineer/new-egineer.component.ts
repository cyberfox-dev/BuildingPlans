import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatTable } from '@angular/material/table';

export interface EngineerList {
 
  ProfessinalType: string;
  professionalRegNo: string;
  bpNumber: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;

}





@Component({
  selector: 'app-new-egineer',
  templateUrl: './new-egineer.component.html',
  styleUrls: ['./new-egineer.component.css']
})
export class NewEgineerComponent implements OnInit {
  closeResult = '';

  engineerIDNo = '';
  bpNoApplicant = '';
  professionalRegNo = '';
  name = '';
  surname = '';
  applicantTellNo = '';
  applicantEmail = '';

  editBpNoApplicant = '';
  editProfessionalRegNo = '';
  editName = '';
  editSurname = '';
  editApplicantTellNo = '';
  editApplicantEmail = '';


  tempEngineerList: EngineerList[] = [];
  forEditEngineer: EngineerList[] = [];
  forEditIndex: any;

  constructor(private modalService: NgbModal) { }

  displayedColumns: string[] = ['ProfessinalType', 'bpNumber', 'name', 'surname', 'professionalRegNo', 'phoneNumber', 'email', 'actions'];
  myDataSource = this.tempEngineerList;
  @ViewChild(MatTable) table: MatTable<EngineerList> | undefined;

  ngOnInit() {
    
  }

  ngDoCheck() {
  //  debugger;
    
  // this.myDataSource = this.tempEngineerList;
  }

  onAddEngineer() {
    const newEnineer = {} as EngineerList;
    newEnineer.ProfessinalType = "Engineer";
    newEnineer.bpNumber = this.bpNoApplicant;
    newEnineer.professionalRegNo = this.professionalRegNo;
    newEnineer.name = this.name;
    newEnineer.surname = this.surname;
    newEnineer.email = this.applicantEmail;
    newEnineer.phoneNumber = this.applicantTellNo;

    this.tempEngineerList.push(newEnineer);
    this.table?.renderRows();
    this.clearCreateComponent();
  }
  onDelete(position: any) {
    const deleteContractor = this.tempEngineerList[position];
    if (confirm("Are you sure to delete " + deleteContractor.name + " " + deleteContractor.surname + "?")) {
      this.tempEngineerList.splice(position, 1);
      this.table?.renderRows();
    }
  }

  openXl(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }

  openEditModal(edit: any, index:any) {
    this.modalService.open(edit, { size: 'xl' });

    const forEditEngineer  = this.tempEngineerList[index];
    this.editBpNoApplicant = forEditEngineer.bpNumber;
    this.editProfessionalRegNo = forEditEngineer.professionalRegNo;
    this.editName = forEditEngineer.name;
    this.editSurname = forEditEngineer.surname;
    this.editApplicantTellNo = forEditEngineer.phoneNumber;
    this.editApplicantEmail = forEditEngineer.email;

    this.forEditIndex = index;
  }

  onEditEngineer() {
    this.tempEngineerList.splice(this.forEditIndex, 1);
    const toEdit = {} as EngineerList;
    toEdit.ProfessinalType = "Engineer";
    toEdit.bpNumber = this.editBpNoApplicant;
    toEdit.professionalRegNo = this.editProfessionalRegNo;
    toEdit.name = this.editName;
    toEdit.surname = this.editSurname;
    toEdit.email = this.editApplicantEmail;
    toEdit.phoneNumber = this.editApplicantTellNo;
    this.tempEngineerList.push(toEdit);

    this.table?.renderRows();

  }


  clearCreateComponent() {
    this.bpNoApplicant = '';
    this.professionalRegNo = '';
    this.name = '';
    this.surname = '';
    this.applicantTellNo = '';
    this.applicantEmail = '';
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

  panelOpenState = false;

}
