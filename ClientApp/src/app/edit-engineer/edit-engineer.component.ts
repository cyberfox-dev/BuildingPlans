import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatTable } from '@angular/material/table';
import { SharedService } from 'src/app/shared/shared.service';
import { ProfessionalService } from 'src/app/service/Professionals/professional.service';


export interface EngineerList {
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

@Component({
  selector: 'app-edit-engineer',
  templateUrl: './edit-engineer.component.html',
  styleUrls: ['./edit-engineer.component.css']
})
export class EditEngineerComponent implements OnInit {
  closeResult = '';
  ProfessionalID: number | undefined;
  engineerIDNo? = '';
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
  editEngineerIDNo?= '';

  EngineerList: EngineerList[] = [];
  forEditEngineer: EngineerList[] = [];
  forEditIndex: any;

  constructor(private modalService: NgbModal, private shared: SharedService, private professionalService: ProfessionalService) { }
  CurrentUser: any;
  stringifiedData: any;  
  displayedColumns: string[] = ['ProfessinalType','professionalRegNo', 'name', 'surname', 'phoneNumber', 'email', 'actions'];
  myDataSource = this.EngineerList;
  @ViewChild(MatTable) EngineerTable: MatTable<EngineerList> | undefined;

  ngOnInit() {

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.getProfessionalsListByProfessionalType();
   
  }



  getProfessionalsListByProfessionalType() {
    this.EngineerList.splice(0, this.EngineerList.length);

    this.professionalService.getProfessionalsListByProfessionalType(this.CurrentUser.appUserId, "Engineer").subscribe((data: any) => {

      if (data.responseCode == 1) {
        console.log("data.dateSet get", data.dateSet);

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempEngineerList = {} as EngineerList;
          const current = data.dateSet[i];
          tempEngineerList.bpNumber = current.bP_Number;
          tempEngineerList.email = current.email;
          tempEngineerList.idNumber = current.idNumber;
          tempEngineerList.name = current.fullName.substring(0, current.fullName.indexOf(' '));;
          tempEngineerList.surname = current.fullName.substring(current.fullName.indexOf(' ') + 1);
          tempEngineerList.phoneNumber = current.phoneNumber;
          tempEngineerList.ProfessinalType = current.professinalType;
          tempEngineerList.professionalRegNo = current.professionalRegNo;
          tempEngineerList.professinalID = current.professinalID;

          this.EngineerList.push(tempEngineerList);
          this.EngineerTable?.renderRows();
        }
        this.EngineerTable?.renderRows();
      }

      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
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
    this.professionalService.addUpdateProfessional(0, "Engineer", this.name + " " + this.surname, this.bpNoApplicant, false, this.applicantEmail, this.applicantTellNo.toString(), this.professionalRegNo, this.CurrentUser.appUserId, this.engineerIDNo, this.CurrentUser.appUserId, null).subscribe((data: any) => {

      if (data.responseCode == 1) {
        alert(data.responseMessage);
        this.getProfessionalsListByProfessionalType();
        this.EngineerTable?.renderRows();
      }

      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })

    this.clearCreateComponent();
    this.EngineerTable?.renderRows();

    this.clearCreateComponent();
  }
  onDelete(position: any) {
    const deleteEngineer = this.EngineerList[position];
    if (confirm("Are you sure to delete " + deleteEngineer.name + " " + deleteEngineer.surname + "?")) {
      this.EngineerList.splice(position, 1);

      this.professionalService.deleteProfessional(deleteEngineer.professinalID).subscribe((data: any) => {

        if (data.responseCode == 1) {
          alert(data.responseMessage);
          //this.getProfessionalsListByProfessionalType();
          this.EngineerTable?.renderRows();
        }

        else {

          alert(data.responseMessage);
        }
        console.log("reponse", data);

      }, error => {
        console.log("Error: ", error);
      })

      this.EngineerTable?.renderRows();
    }
  }

  openXl(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }

  openEditModal(edit: any, index: any) {
    this.modalService.open(edit, { size: 'xl' });

    const forEditEngineer = this.EngineerList[index];
    this.editBpNoApplicant = forEditEngineer.bpNumber;
    this.editProfessionalRegNo = forEditEngineer.professionalRegNo;
    this.editName = forEditEngineer.name;
    this.editSurname = forEditEngineer.surname;
    this.editApplicantTellNo = forEditEngineer.phoneNumber;
    this.editApplicantEmail = forEditEngineer.email;
    this.editEngineerIDNo = forEditEngineer.idNumber;
    this.ProfessionalID = forEditEngineer.professinalID;

    this.forEditIndex = index;
  }

  onEditEngineer() {

    this.professionalService.addUpdateProfessional(Number(this.ProfessionalID), "Engineer", this.editName + " " + this.editSurname, this.editBpNoApplicant, false, this.editApplicantEmail, this.editApplicantTellNo?.toString(), this.editProfessionalRegNo, this.CurrentUser.appUserId, this.editEngineerIDNo, this.CurrentUser.appUserId, null).subscribe((data: any) => {

      if (data.responseCode == 1) {
        alert(data.responseMessage);
        this.getProfessionalsListByProfessionalType();
        this.EngineerTable?.renderRows();
      }

      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })


    this.EngineerTable?.renderRows();


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

}
