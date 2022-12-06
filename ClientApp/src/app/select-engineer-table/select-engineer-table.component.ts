import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';

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

//const ELEMENT_DATA: PeriodicElement[] = [
//  { bp: 'fdf', name: 'FullName', surname: "", professionalRegNumber: 'H' },
//];



@Component({
  selector: 'app-select-engineer-table',
  templateUrl: './select-engineer-table.component.html',
  styleUrls: ['./select-engineer-table.component.css']
})
export class SelectEngineerTableComponent implements OnInit {
  @Input()
    data!: any[];
  EngineerList: EngineerList[] = [];
  @ViewChild(MatTable) EngineerTable: MatTable<EngineerList> | undefined;
  displayedColumns: string[] = ['ProfessinalType', 'professionalRegNo', 'bpNumber', 'name', 'surname', 'email', 'phoneNumber', 'idNumber'];
   dataSourceEngineers =  this.EngineerList;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      debugger;
      console.log("this.datafdgfdfdg", this.data);
      for (let i = 0; i < this.data.length; i++) {
        //Check if Engineer or Contractor
        
          const tempProfessionalList = {} as EngineerList;
        const current = this.data[i];
        tempProfessionalList.bpNumber = current.bpNumber;
        tempProfessionalList.email = current.email;
        tempProfessionalList.idNumber = current.idNumber;
        tempProfessionalList.name = current.name;
        tempProfessionalList.surname = current.surname;
          tempProfessionalList.phoneNumber = current.phoneNumber;
        tempProfessionalList.ProfessinalType = current.ProfessinalType;
        tempProfessionalList.professionalRegNo = current.professionalRegNo;
          tempProfessionalList.professinalID = current.professinalID;
          this.EngineerList.push(tempProfessionalList);
        
      }
    console.log("this.EngineerListfdgfdfdg", this.EngineerList);

      this.EngineerTable?.renderRows();
    });
  }

  public ngOnChanges(changes: SimpleChanges) {
   // this.dataSourceEngineers = new MatTableDataSource(changes.data.currentValue);
  }

  //displayedColumns: string[] = ['bp', 'name', 'surname', 'professionalRegNumber'];
  //dataSource = ELEMENT_DATA;
  clickedRowsEngineers = new Set<EngineerList>();

  clearAllEngineers() {
    this.clickedRowsEngineers.clear();
  }

  onLogin() {
    //let fullName = this.loginForm.controls["fullName"].value;
    //let email = this.loginForm.controls["email"].value;
    //let password = this.loginForm.controls["password"].value;


    //this.professionalService.addUpdateProfessional(email, password).subscribe((data: any) => {

    //  if (data.responseCode == 1) {
    //    localStorage.setItem("LoggedInUserInfo", data.DataSet);
    //    this.router.navigate(["/home"]);
    //  }
    //  else {
    //    //alert("Invalid Email or Password");
    //    alert(data.responseMessage);
    //  }
    //  console.log("reponse", data);

    //}, error => {
    //  console.log("Error: ", error);
    //})
  }

}
