import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  name: string;
  bp: string;
  surname: string;
  professionalRegNumber: string;


}

const ELEMENT_DATA: PeriodicElement[] = [
  { bp: 'fdf', name: 'FullName', surname: "", professionalRegNumber: 'H' },
];



@Component({
  selector: 'app-select-engineer-table',
  templateUrl: './select-engineer-table.component.html',
  styleUrls: ['./select-engineer-table.component.css']
})
export class SelectEngineerTableComponent implements OnInit {

 
  constructor() { }

  ngOnInit(): void {
  }
  displayedColumns: string[] = ['bp', 'name', 'surname', 'professionalRegNumber'];
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
