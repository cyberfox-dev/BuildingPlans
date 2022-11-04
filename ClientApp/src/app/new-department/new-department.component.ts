import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormGroup, FormBuilder, Validators } from '@angular/forms';
import { DepartmentsService } from '../service/Departments/departments.service';

@Component({
  selector: 'app-new-department',
  templateUrl: './new-department.component.html',
  styleUrls: ['./new-department.component.css']
})


export class NewDepartmentComponent implements OnInit {
  closeResult = '';
  CurrentUser: any;
  stringifiedData: any;
  public addDepartment = this.formBuilder.group({
    newDepName: ['', Validators.required]

  })

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private departmentService: DepartmentsService) {}

  ngOnInit(): void {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData); this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
  }

  openXl(content: any) {
    this.modalService.open(content, { size: 'lg' });
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

  onDepartmentCreate() {
    let newDepName = this.addDepartment.controls["newDepName"].value;



    this.departmentService.addUpdateDepartment(0, newDepName, this.CurrentUser.appUserId).subscribe((data: any) => {
     
      if (data.responseCode == 1) {
        
        alert(data.responseMessage);
      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

}
