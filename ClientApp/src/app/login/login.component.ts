import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { UserService } from '../service//User/user.service';
import { SharedService } from "src/app/shared/shared.service"
import { UserProfileService } from 'src/app/service/UserProfile/user-profile.service';
import { NotificationsService } from "src/app/service/Notifications/notifications.service";





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
    reenterPassword: ['', Validators.required],
    fullName: ['', Validators.required],

  })
    space1: number | undefined;
  space2: number | undefined;

  CurrentUser: any;
  stringifiedData: any;  

  @Output() checkForInternalOption = new EventEmitter<string>();

  constructor(private router: Router, private formBuilder: FormBuilder, private userService: UserService, private sharedService: SharedService, private userPofileService: UserProfileService, private notification: NotificationsService) {



  }



  ngOnInit() {
    
  
  }

  onLogin() {
    this.isLoading = true;
    let email = this.loginForm.controls["email"].value;
    let password = this.loginForm.controls["password"].value;

    this.userService.login(email, password).subscribe(
      (data: any) => {
        if (data.responseCode === 1) {
          localStorage.setItem("LoggedInUserInfo", JSON.stringify(data.dateSet));
          this.getUserProfile();

          this.isLoading = false;
          this.router.navigate(["/home"]);
        } else {
          this.isLoading = false;

          this.error = ""+ data.responseMessage;
       
        }
      },
      (error) => {
        console.log("Error: ", error);
      }
    );
  
  }

  getUserProfile() {
    let stringifiedData = JSON.parse(
      JSON.stringify(localStorage.getItem("LoggedInUserInfo"))
    );
    let currentUser = JSON.parse(stringifiedData);
    this.userPofileService
      .getUserProfileById(currentUser.appUserId)
      .subscribe(
        (data: any) => {
          localStorage.setItem("userProfile", JSON.stringify(data.dateSet));
        },
        (error) => {
          console.log("Error: ", error);
        }
      );
  }

  onRegister() {
    this.notification.sendEmail("venolin@cyberfox.co.za","Test","testing 1, 2, 3...");
    
    let fullName = this.registerForm.controls["fullName"].value;
    let email = this.registerForm.controls["registerEmail"].value;
    let password = this.registerForm.controls["registerPassword"].value;
    let passwordConfirm = this.registerForm.controls["reenterPassword"].value;

    // Use a regular expression to check if the email is valid
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email != null) {
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address!");
        return;
      }
    } else {
      alert("Please enter a valid email address!");
      return;
    }


    // Count the number of spaces in the full name
    let numberOfSpaces = 0;
    if (fullName != null) {
      numberOfSpaces = (fullName.split(" ").length - 1);
    }
    else {
      alert("Please enter your first name and surname only!");
      return;
    }

    //Check if passwords entered, match.
    if (password != passwordConfirm) {
      alert("The passwords entered do not match");
      return;
    }
    else {
    }

    if (numberOfSpaces >= 2 || numberOfSpaces == 0) {
      alert("Please enter your first name and surname only!");
    } else {
      this.userService.register(fullName, email, password).subscribe((data: any) => {
        if (data.responseCode == 1) {
          console.log("After Register", data.dateSet);
          localStorage.setItem("LoggedInUserInfo", JSON.stringify(data.dateSet));
          alert(data.responseMessage);
          this.router.navigate(["/new-profile"]);
        } else {
          //alert("Invalid Email or Password");
          alert(data.responseMessage);
        }
        //console.log("reponse", data);
      }, error => {
        console.log("Error: ", error);
      });
    }
  }

 
  //this is the old one 
  //onRegister() {

    
  //  let fullName = this.registerForm.controls["fullName"].value;
  //  let email = this.registerForm.controls["registerEmail"].value;
  //  let password = this.registerForm.controls["registerPassword"].value;
  //  let checkEmail = email?.substring(email.indexOf("@"));
  //  this.sharedService.setCheckEmail(checkEmail);
  //  console.log(checkEmail);
  //  let spaceCount = 0;
 
  
  

  //  if (fullName != null) {
  //    spaceCount = (fullName.split(" ").length - 1);

  //  }

  //  if (spaceCount >= 2 || spaceCount == 0) {

  //    alert("Please enter your first name and surname only!");
  //  }
  //  else {
  //       this.userService.register(fullName, email, password).subscribe((data: any) => {
      
  //            if (data.responseCode == 1) {
  //              console.log("After Register", data.dateSet);
  //              localStorage.setItem("LoggedInUserInfo", JSON.stringify(data.dateSet));
  //              alert(data.responseMessage);
  //              this.router.navigate(["/new-profile"]);
  //            }
  //            else {
  //              //alert("Invalid Email or Password");
  //              alert(data.responseMessage);
  //            }
  //            //console.log("reponse", data);
      
  //          }, error => {
  //            console.log("Error: ", error);
  //       })


  //   }
  //}



  add() {
    this.container = document.getElementById('container');
    /* this.signUpButton.addEventListener('click', () => {
       this.container.classList.add("right-panel-active");
     });*/

    if (this.container != null) {

      this.container.classList.add('right-panel-active');
      console.log("toggle");
    }

    this.registerForm.controls["registerEmail"].setValue("");
    this.registerForm.controls["registerPassword"].setValue("");
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
