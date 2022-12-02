import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatTable } from '@angular/material/table';
import { SharedService } from 'src/app/shared/shared.service';
import { ProfessionalService } from 'src/app/service/Professionals/professional.service';

export interface ContractorList {
  professinalID: number;
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
  selector: 'app-edit-contractor',
  templateUrl: './edit-contractor.component.html',
  styleUrls: ['./edit-contractor.component.css']
})
export class EditContractorComponent implements OnInit {
  closeResult = "";
  ProfessionalID: number | undefined;
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
  editContractorTell?: number;
  editContractorEmail = '';
  editContractorIDNo?= '';

  forEditIndex = 0;

  ContractorList: ContractorList[] = [];

  CurrentUser: any;
  stringifiedData: any;  
  constructor(private modalService: NgbModal, private shared: SharedService, private professionalService: ProfessionalService) { }

  displayedColumns: string[] = ['ProfessinalType', 'bpNumber', 'name', 'surname', 'professionalRegNo', 'phoneNumber', 'CIBRating', 'email', 'actions'];
  dataSource = this.ContractorList;
  @ViewChild(MatTable) ContractorTable: MatTable<ContractorList> | undefined;

  ngOnInit(): void {

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.getProfessionalsListByProfessionalType();

  }
  openXl(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }


  getProfessionalsListByProfessionalType() {
    this.ContractorList.splice(0, this.ContractorList.length);

    this.professionalService.getProfessionalsListByProfessionalType(this.CurrentUser.appUserId,"Contractor").subscribe((data: any) => {

      if (data.responseCode == 1) {
        console.log("data.dateSet get", data.dateSet);

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempContactorList = {} as ContractorList;
          const current = data.dateSet[i];
          tempContactorList.bpNumber = current.bP_Number;
          tempContactorList.CIBRating = current.cibRating;
          tempContactorList.email = current.email;
          tempContactorList.idNumber = current.idNumber;
          tempContactorList.name = current.fullName.substring(0, current.fullName.indexOf(' '));;
          tempContactorList.surname = current.fullName.substring(current.fullName.indexOf(' ') + 1);
          tempContactorList.phoneNumber = current.phoneNumber;
          tempContactorList.ProfessinalType = current.professinalType;
          tempContactorList.professionalRegNo = current.professionalRegNo;
          tempContactorList.professinalID = current.professinalID;
        
          this.ContractorList.push(tempContactorList);
          this.ContractorTable?.renderRows();
        }
        this.ContractorTable?.renderRows();
      }

      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }


  onAddcontractor() {


    this.professionalService.addUpdateProfessional(0, "Contractor", this.Name + " " + this.Surname, this.bpNoContractor, false, this.ContractorEmail, this.ContractorTell?.toString(), this.ProfessionalRegNo, this.CurrentUser.appUserId, this.contractorIDNo, this.CurrentUser.appUserId, this.CIBRating).subscribe((data: any) => {

      if (data.responseCode == 1) {
        alert(data.responseMessage);
        this.getProfessionalsListByProfessionalType();
        this.ContractorTable?.renderRows();
      }

      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })

    this.clearCreateComponent();
  }

  onDelete(position: any) {
    const deleteContractor = this.ContractorList[position];
    if (confirm("Are you sure to delete " + deleteContractor.name + " " + deleteContractor.surname + "?")) {
      this.ContractorList.splice(position, 1);

      this.professionalService.deleteProfessional(deleteContractor.professinalID).subscribe((data: any) => {

        if (data.responseCode == 1) {
          alert(data.responseMessage);
          //this.getProfessionalsListByProfessionalType();
          this.ContractorTable?.renderRows();
        }

        else {

          alert(data.responseMessage);
        }
        console.log("reponse", data);

      }, error => {
        console.log("Error: ", error);
      })

      this.ContractorTable?.renderRows();

    }

  }

  openEditModal(edit: any, index: any) {
    this.modalService.open(edit, { size: 'xl' });

    const forEditContactor = this.ContractorList[index];
    this.editBpNoContractor = forEditContactor.bpNumber;
    this.editProfessionalRegNo = forEditContactor.professionalRegNo;
    this.editName = forEditContactor.name;
    this.editSurname = forEditContactor.surname;
    this.editContractorTell = forEditContactor.phoneNumber;
    this.editContractorEmail = forEditContactor.email;
    this.editCIBDrating = forEditContactor.CIBRating;
    this.editContractorIDNo = forEditContactor.idNumber;
    this.ProfessionalID = forEditContactor.professinalID;

    this.forEditIndex = index;
  }

  onEditContractor() {

    this.professionalService.addUpdateProfessional(Number(this.ProfessionalID), "Contractor", this.editName + " " + this.editSurname, this.editBpNoContractor, false, this.editContractorEmail, this.editContractorTell?.toString(), this.editProfessionalRegNo, this.CurrentUser.appUserId, this.editContractorIDNo, this.CurrentUser.appUserId, this.editCIBDrating).subscribe((data: any) => {

      if (data.responseCode == 1) {
        alert(data.responseMessage);
        this.getProfessionalsListByProfessionalType();
        this.ContractorTable?.renderRows();
      }

      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })


    this.ContractorTable?.renderRows();


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
