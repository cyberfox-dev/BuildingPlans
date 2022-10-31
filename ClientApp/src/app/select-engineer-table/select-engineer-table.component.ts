import { Component, OnInit, Input } from '@angular/core';
import { ProfessionalService } from '../service/professional.service';

export interface PeriodicElement {
  name: string;
  bp: number;
  surname: string;
  professionalRegNumber: string;
  cellNumber: string;
  email: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { bp: 1, name: 'FullName', surname: "", professionalRegNumber: 'H',cellNumber:"",email:"", },
];



@Component({
  selector: 'app-select-engineer-table',
  templateUrl: './select-engineer-table.component.html',
  styleUrls: ['./select-engineer-table.component.css']
})
export class SelectEngineerTableComponent implements OnInit {

  
  constructor(private professionalService: ProfessionalService) { }

  ngOnInit(): void {
  }
  displayedColumns: string[] = ['bp', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  clickedRows = new Set<PeriodicElement>();

  clearAll() {
    this.clickedRows.clear();
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
