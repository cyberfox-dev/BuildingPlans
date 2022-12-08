import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { UserService } from '../service//User/user.service';
import { SharedService} from "src/app/shared/shared.service"


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  error!: string;
  checkEmail = "";

  public container = document.getElementById('container');

  public loginForm = this.formBuilder.group({
    email: ['', Validators.required], /**/
    password: ['', Validators.required],

  })

  public registerForm = this.formBuilder.group({
    registerEmail: ['',  Validators.required],
    registerPassword: ['', Validators.required],
    fullName: ['', Validators.required],

  })
    space1: number | undefined;
  space2: number | undefined;

  @Output() checkForInternalOption = new EventEmitter<string>();

  constructor(private router: Router, private formBuilder: FormBuilder, private userService: UserService, private sharedService: SharedService) {



  }

 

  ngOnInit(): void {
  }

  onLogin() {
    this.isLoading = true;
    //let fullName = this.loginForm.controls["fullName"].value;
    let email = this.loginForm.controls["email"].value;
    let password = this.loginForm.controls["password"].value;
    this.userService.login(email, password).subscribe((data: any) => {
      
    
      if (data.responseCode == 1) {
        localStorage.setItem("LoggedInUserInfo", JSON.stringify(data.dateSet));

        this.router.navigate(["/home"]);
        this.isLoading = false;
      }
      else {
        //alert("Invalid Email or Password");
       
        this.isLoading = false;
        this.error='An error ocured'
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }


  onRegister() {

    
    let fullName = this.registerForm.controls["fullName"].value;
    let email = this.registerForm.controls["registerEmail"].value;
    let password = this.registerForm.controls["registerPassword"].value;
    let checkEmail = email?.substring(email.indexOf("@"));
    this.sharedService.setCheckEmail(checkEmail);
    console.log(checkEmail);
    let spaceCount = 0;
 
  
  

    if (fullName != null) {
      spaceCount = (fullName.split(" ").length - 1);

    }

    if (spaceCount >= 2 || spaceCount == 0) {

      alert("Please enter your first name and surname only!");
    }
    else {
         this.userService.register(fullName, email, password).subscribe((data: any) => {
      
              if (data.responseCode == 1) {
                console.log("After Register", data.dateSet);
                localStorage.setItem("LoggedInUserInfo", JSON.stringify(data.dateSet));
                alert(data.responseMessage);
                this.router.navigate(["/new-profile"]);
              }
              else {
                //alert("Invalid Email or Password");
                alert(data.responseMessage);
              }
              //console.log("reponse", data);
      
            }, error => {
              console.log("Error: ", error);
         })


     }
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
  newUser() {
    this.router.navigate(["/new-profile"]);
  }

}
