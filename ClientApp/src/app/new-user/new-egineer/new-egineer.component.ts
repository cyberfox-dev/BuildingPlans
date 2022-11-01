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

  bpNoApplicant = '';
  professionalRegNo = '';
  name = '';
  surname = '';
  applicantTellNo = '';
  applicantEmail = '';


tempEngineerList: EngineerList[] = [];

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
  }
  onDelete(position: any) {
   
    debugger;
    console.log("de ",position );
    this.tempEngineerList.splice(position,1);
    this.table?.renderRows();
    console.log("tempEngineerList",this.tempEngineerList);

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

  panelOpenState = false;

}
