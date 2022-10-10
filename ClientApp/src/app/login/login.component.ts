import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { UserService } from '../service/user.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public container = document.getElementById('container');

  public loginForm = this.formBuilder.group({
    email: ['', Validators.required], /**/
    password: ['', Validators.required],

  })

  public registerForm = this.formBuilder.group({
    email: ['',  Validators.required],
    password: ['', Validators.required],
    fullName: ['', Validators.required],

  })
  constructor(private router: Router, private formBuilder: FormBuilder, private userService: UserService) {



  }



  ngOnInit(): void {
  }

  onLogin() {
    //let fullName = this.loginForm.controls["fullName"].value;
    let email = this.loginForm.controls["email"].value;
    let password = this.loginForm.controls["password"].value;
    this.userService.login(email, password).subscribe((data: any) => {
      debugger;
      if (data.responseCode == 1) {
        localStorage.setItem("LoggedInUserInfo", data.DataSet);
        this.router.navigate(["/home"]);
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

  onRegister() {
    console.log("onRegister");
    let fullName = this.registerForm.controls["fullName"].value;
    let email = this.registerForm.controls["email"].value;
    let password = this.registerForm.controls["password"].value;
    this.userService.register(fullName, email, password).subscribe((data:any) => {
      
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  add() {
    this.container = document.getElementById('container');
    /* this.signUpButton.addEventListener('click', () => {
       this.container.classList.add("right-panel-active");
     });*/

    if (this.container != null) {

      this.container.classList.add('right-panel-active');
      console.log("toggle");
    }
  }

  remove() {
    this.container = document.getElementById('container');
    if (this.container != null) {
      console.log("remove");
      this.container.classList.remove('right-panel-active');
      console.log("remove");
    }
  }
  login(){
    this.router.navigate(["/home"]);
}

}
