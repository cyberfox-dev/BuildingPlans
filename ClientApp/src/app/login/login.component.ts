import { Component, EventEmitter, OnInit, Output, ElementRef } from '@angular/core';
import { UntypedFormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { UserService } from '../service//User/user.service';
import { SharedService } from "src/app/shared/shared.service"
import { UserProfileService } from 'src/app/service/UserProfile/user-profile.service';
import { NotificationsService } from "src/app/service/Notifications/notifications.service";
import { NewProfileComponent } from 'src/app/new-user/new-profile/new-profile.component';
import { HomeComponent } from 'src/app/home/home.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})



export class LoginComponent implements OnInit {
  isLoading = false;
  error!: string;
  checkEmail = "";
  otp = '';
  sendOTPBtn: boolean = true;

  isExpired: boolean = false;
  expirationTime: number = 7200; // Time limit in seconds (5 minutes)
  expirationTimer: any;

  public container = document.getElementById('container');

  public loginForm = this.formBuilder.group({
    email: ['', Validators.required], /**/
    password: ['', Validators.required],

  })

  public registerForm = this.formBuilder.group({
    registerEmail: ['', Validators.required],
    registerPassword: ['', Validators.required],
    reenterPassword: ['', Validators.required],
    fullName: ['', Validators.required],
    OTPField: ['', Validators.required],
  })
  space1: number | undefined;
  space2: number | undefined;

  CurrentUser: any;
  stringifiedData: any;

  @Output() checkForInternalOption = new EventEmitter<string>();
  FullName: string;
  Email: string;
  Password: string;


  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private sharedService: SharedService,
    private userPofileService: UserProfileService,
    private notification: NotificationsService,
    private newProfileComponent: NewProfileComponent,
    // private homeComponent: HomeComponent,

  ) { }



  ngOnInit() {


  }
  characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  public generateOTP(length: number): string {
    let otp = '';
    const charactersLength = this.characters.length;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      otp += this.characters.charAt(randomIndex);

    }
    this.DoChecksForRegister();
    if (this.registerForm.controls["registerEmail"] != null) {
      alert("OTP Sent, Please check your email");
      this.sendOTPBtn = false;
      this.notification.sendEmail(this.registerForm.controls["registerEmail"].value, "OTP", "Hello, you have recently tried to create an account on the Wayleave Management System, here is your one-time pin for your account: " + otp + " . This code will be invalid in the next 2 hours.", "Hello, you have recently tried to create an account on the Wayleave Management System, here is your one-time pin for your account: " + otp + " . This code will be invalid in the next 2 hours.");
      this.startExpirationTimer();
    }
    else {
      alert("There was an error")
    }
    return otp;

  }
  // characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  //public generateOTP(length: number): string {
  //  let otp = '';
  //  const charactersLength = this.characters.length;

  //  for (let i = 0; i < length; i++) {
  //    const randomIndex = Math.floor(Math.random() * charactersLength);
  //    otp += this.characters.charAt(randomIndex);

  //  }
  //  this.DoChecksForRegister();
  //  if (this.registerForm.controls["registerEmail"] != null) {
  //    alert("OTP Sent, Please check your email");
  //    this.sendOTPBtn = false;
  //    this.notification.sendEmail(this.registerForm.controls["registerEmail"].value, "OTP", "Hello, you have recently tried to create an account on the Wayleave Management System, here is your one-time pin for your account: " + otp +" . This code will be invalid in the next 2 hours.");
  //    this.startExpirationTimer();
  //  }
  //  else {
  //    alert("There was an error")
  //  }
  //  return otp;

  //}
  ngOnDestroy() {
    clearTimeout(this.expirationTimer);
  }

  startExpirationTimer() {
    this.expirationTimer = setTimeout(() => {
      this.isExpired = true;
      this.sendOTPBtn = true;
    }, this.expirationTime * 1000);
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

          this.error = "" + data.responseMessage;

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

  DoChecksForRegister() {




    /*    this.notification.sendEmail("jahdiel@cyberfox.co.za", "Test", "testing 1, 2, 3...");*/

    let fullName = this.registerForm.controls["fullName"].value;
    let email = this.registerForm.controls["registerEmail"].value;
    let password = this.registerForm.controls["registerPassword"].value;
    let passwordConfirm = this.registerForm.controls["reenterPassword"].value;




    // Use a regular expression to check if the email is valid 
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email != null) {
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address!");
        this.otp = '';
        let numberOfSpaces = 0;
        if (fullName != null) {
          numberOfSpaces = (fullName.split(" ").length - 1);
          if (password != passwordConfirm) {
            alert("The passwords entered do not match");
            this.otp = '';
            if (numberOfSpaces >= 2 || numberOfSpaces == 0) {
              alert("Please enter your first name and surname only!");
              this.otp = '';
            } else {
              this.FullName = fullName;
              this.Email = email;
              this.Password = password;


            }
          }
          else {
          }
        }
        else {
          alert("Please enter your first name and surname only!");
          this.otp = '';
        }

      }
    } else {
      alert("Please enter a valid email address!");
      this.otp = '';
      return;
    }




    // Count the number of spaces in the full name


    //Check if passwords entered, match.




  }


 async onRegister(clientFullName?: string | null, clientEmail?: string | null, phoneNumber?: string | null, BpNo?: string | null, CompanyName?: string | null, CompanyRegNo?: string | null, PhyscialAddress?: string | null, ApplicantIDUpload?: string | null, ApplicantIDNumber?: string | null) {
    if (clientFullName != null || clientFullName != "" && clientEmail != null || clientEmail != "") {
      this.sharedService.errorForRegister = false;
      // Use a regular expression to check if the email is valid
      const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (clientEmail != null) {
        if (!emailRegex.test(clientEmail)) {
          alert("Please enter a valid email address!");
          return;
        }
      } else {
        alert("Please enter a valid email address!");
        return;
      }


      // Count the number of spaces in the full name
      let numberOfSpaces = 0;
      if (clientFullName != null) {
        numberOfSpaces = (clientFullName.split(" ").length - 1);
      }
      else {
        alert("Please enter your first name and surname only!");
        return;
      }


      if (numberOfSpaces >= 2 || numberOfSpaces == 0) {
        alert("Please enter your first name and surname only!");
      } else {
   
       await this.userService.register(clientFullName, clientEmail, "Password@" + clientFullName).subscribe((data: any) => {
          if (data.responseCode == 1) {
            console.log("After Register", data.dateSet);
            debugger;
            // this.homeComponent.openXl('content');
            
            this.newProfileComponent.onNewProfileCreate(data.dateSet.appUserId, clientFullName, clientEmail, phoneNumber, BpNo, CompanyName, CompanyRegNo, PhyscialAddress, ApplicantIDUpload, ApplicantIDNumber);

            this.sharedService.clientUserID = data.dateSet.appUserId;
            

          } else {
            //alert("Invalid Email or Password");
            debugger;
            this.sharedService.errorForRegister = true;
            alert(data.responseMessage);
          }
          //console.log("reponse", data);
        }, error => {
          console.log("Error: ", error);
        });
      }
    }
    else {

      let otpEntered = this.registerForm.controls["OTPField"].value;

      /*if it is expired*/
      if (this.isExpired) {
        alert("OTP has expired. Please send a new OTP");
        return;
      }

      if (this.otp == otpEntered) {

        this.userService.register(this.registerForm.controls["fullName"].value, this.registerForm.controls["registerEmail"].value, this.registerForm.controls["registerPassword"].value).subscribe((data: any) => {
          if (data.responseCode == 1) {
            debugger;
            this.sharedService.errorForRegister = false;
            console.log("After Register", data.dateSet);
            localStorage.setItem("LoggedInUserInfo", JSON.stringify(data.dateSet));
            alert(data.responseMessage);
            this.router.navigate(["/new-profile"]);
          } else {
            debugger;
            //alert("Invalid Email or Password");
            this.sharedService.errorForRegister = true;
            alert(data.responseMessage);
          }
          //console.log("reponse", data);
        }, error => {
          console.log("Error: ", error);
        });
      }

      else {
        alert("Invalid OTP");
      }
    }
  }

            //startExpirationTimer() {
            //  this.expirationTimer = setTimeout(() => {
            //    this.isExpired = true;
            //    this.sendOTPBtn = true;
            //  }, this.expirationTime * 1000);
            //}

            //  DoChecksForRegister() {




            ///*    this.notification.sendEmail("jahdiel@cyberfox.co.za", "Test", "testing 1, 2, 3...");*/

            //    let fullName = this.registerForm.controls["fullName"].value;
            //    let email = this.registerForm.controls["registerEmail"].value;
            //    let password = this.registerForm.controls["registerPassword"].value;
            //    let passwordConfirm = this.registerForm.controls["reenterPassword"].value;
            //            this.sharedService.clientUserID = data.dateSet.appUserId;


            //          } else {
            //            //alert("Invalid Email or Password");
            //            alert(data.responseMessage);
            //          }
            //          //console.log("reponse", data);
            //        }, error => {
            //          console.log("Error: ", error);
            //        });
            //      }
            //    }
            //    else {
            //      this.notification.sendEmail("venolin@cyberfox.co.za", "Test", "testing 1, 2, 3...");

            //      let fullName = this.registerForm.controls["fullName"].value;
            //      let email = this.registerForm.controls["registerEmail"].value;
            //      let password = this.registerForm.controls["registerPassword"].value;
            //      let passwordConfirm = this.registerForm.controls["reenterPassword"].value;




            //    // Use a regular expression to check if the email is valid
            //    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            //    if (email != null) {
            //      if (!emailRegex.test(email)) {
            //        alert("Please enter a valid email address!");
            //        this.otp = '';
            //        let numberOfSpaces = 0;
            //        if (fullName != null) {
            //          numberOfSpaces = (fullName.split(" ").length - 1);
            //          if (password != passwordConfirm) {
            //            alert("The passwords entered do not match");
            //            this.otp = '';
            //            if (numberOfSpaces >= 2 || numberOfSpaces == 0) {
            //              alert("Please enter your first name and surname only!");
            //              this.otp = '';
            //            } else {
            //              this.FullName = fullName;
            //              this.Email = email;
            //              this.Password = password;


            //            }
            //          }
            //          else {
            //          }
            //        }
            //        else {
            //          alert("Please enter your first name and surname only!");
            //          this.otp = '';
            //        }

            //      }
            //    } else {
            //      alert("Please enter a valid email address!");
            //      this.otp = '';
            //      return;
            //    }
            //      // Use a regular expression to check if the email is valid
            //      const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            //      if (email != null) {
            //        if (!emailRegex.test(email)) {
            //          alert("Please enter a valid email address!");
            //          return;
            //        }
            //      } else {
            //        alert("Please enter a valid email address!");
            //        return;
            //      }




            //    // Count the number of spaces in the full name


            //    //Check if passwords entered, match.




            //  }

            // Count the number of spaces in the full name
            //let numberOfSpaces = 0;
            //if (fullName != null) {
            //  numberOfSpaces = (fullName.split(" ").length - 1);
            //}
            //else {
            //  alert("Please enter your first name and surname only!");
            //  return;
            //}

            //  onRegister() {
            //    let otpEntered = this.registerForm.controls["OTPField"].value;

            ///*if it is expired*/
            //    if (this.isExpired) {
            //     alert("OTP has expired. Please send a new OTP");
            //      return;
            //    }
            //      //Check if passwords entered, match.
            //      if (password != passwordConfirm) {
            //        alert("The passwords entered do not match");
            //        return;
            //      }
            //      else {
            //      }

            //    if (this.otp == otpEntered) {

            //      this.userService.register(this.registerForm.controls["fullName"].value, this.registerForm.controls["registerEmail"].value, this.registerForm.controls["registerPassword"].value).subscribe((data: any) => {
            //        if (data.responseCode == 1) {
            //          console.log("After Register", data.dateSet);
            //          localStorage.setItem("LoggedInUserInfo", JSON.stringify(data.dateSet));
            //          alert(data.responseMessage);
            //          this.router.navigate(["/new-profile"]);
            //        } else {
            //          //alert("Invalid Email or Password");
            //          alert(data.responseMessage);
            //        }
            //        //console.log("reponse", data);
            //      }, error => {
            //        console.log("Error: ", error);
            //      });
            //    }

            //    else {
            //      alert("Invalid OTP");
            //    }
            //  }

            //  onLogin() {
            //    this.isLoading = true;
            //    let email = this.loginForm.controls["email"].value;
            //    let password = this.loginForm.controls["password"].value;

            //    this.userService.login(email, password).subscribe(
            //      (data: any) => {
            //        if (data.responseCode === 1) {
            //          localStorage.setItem("LoggedInUserInfo", JSON.stringify(data.dateSet));
            //          this.getUserProfile();

            //          this.isLoading = false;
            //          this.router.navigate(["/home"]);
            //        } else {
            //          this.isLoading = false;

            //          this.error = ""+ data.responseMessage;

            //        }
            //      },
            //      (error) => {
            //        console.log("Error: ", error);
            //      }
            //    );

            //  }

            //    getUserProfile() {
            //      let stringifiedData = JSON.parse(
            //        JSON.stringify(localStorage.getItem("LoggedInUserInfo"))
            //      );
            //      let currentUser = JSON.parse(stringifiedData);
            //      this.userPofileService
            //        .getUserProfileById(currentUser.appUserId)
            //        .subscribe(
            //          (data: any) => {
            //            localStorage.setItem("userProfile", JSON.stringify(data.dateSet));
            //          },
            //          (error) => {
            //            console.log("Error: ", error);
            //          }
            //        );
            //    }
            //      if (numberOfSpaces >= 2 || numberOfSpaces == 0) {
            //        alert("Please enter your first name and surname only!");
            //      } else {
            //        this.userService.register(fullName, email, password).subscribe((data: any) => {
            //          if (data.responseCode == 1) {
            //            console.log("After Register", data.dateSet);
            //            localStorage.setItem("LoggedInUserInfo", JSON.stringify(data.dateSet));
            //            alert(data.responseMessage);
            //            this.router.navigate(["/new-profile"]);
            //          } else {
            //            //alert("Invalid Email or Password");
            //            alert(data.responseMessage);
            //          }
            //          //console.log("reponse", data);
            //        }, error => {
            //          console.log("Error: ", error);
            //        });
            //      }
            //    }
            //  }


            //onRegister(clientFullName ?: string | null, clientEmail ?: string | null, phoneNumber ?: string | null, BpNo ?: string | null, CompanyName ?: string | null, CompanyRegNo ?: string | null, PhyscialAddress ?: string | null, ApplicantIDUpload ?: string | null, ApplicantIDNumber ?: string | null) {
            //  if (clientFullName != null || clientFullName != "" && clientEmail != null || clientEmail != "") {

            //    // Use a regular expression to check if the email is valid
            //    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            //    if (clientEmail != null) {
            //      if (!emailRegex.test(clientEmail)) {
            //        alert("Please enter a valid email address!");
            //        return;
            //      }
            //    } else {
            //      alert("Please enter a valid email address!");
            //      return;
            //    }


            //    // Count the number of spaces in the full name
            //    let numberOfSpaces = 0;
            //    if (clientFullName != null) {
            //      numberOfSpaces = (clientFullName.split(" ").length - 1);
            //    }
            //    else {
            //      alert("Please enter your first name and surname only!");
            //      return;
            //    }


            //    if (numberOfSpaces >= 2 || numberOfSpaces == 0) {
            //      alert("Please enter your first name and surname only!");
            //    } else {
            //      this.userService.register(clientFullName, clientEmail, "Password@" + clientFullName).subscribe((data: any) => {
            //        if (data.responseCode == 1) {
            //          console.log("After Register", data.dateSet);
            //          debugger;
            //          // this.homeComponent.openXl('content');
            //          this.newProfileComponent.onNewProfileCreate(data.dateSet.appUserId, clientFullName, clientEmail, phoneNumber, BpNo, CompanyName, CompanyRegNo, PhyscialAddress, ApplicantIDUpload, ApplicantIDNumber);

            //          this.sharedService.clientUserID = data.dateSet.appUserId;


            //        } else {
            //          //alert("Invalid Email or Password");
            //          alert(data.responseMessage);
            //        }
            //        //console.log("reponse", data);
            //      }, error => {
            //        console.log("Error: ", error);
            //      });
            //    }
            //  }
            //  else {
            //    this.notification.sendEmail("venolin@cyberfox.co.za", "Test", "testing 1, 2, 3...");

            //    let fullName = this.registerForm.controls["fullName"].value;
            //    let email = this.registerForm.controls["registerEmail"].value;
            //    let password = this.registerForm.controls["registerPassword"].value;
            //    let passwordConfirm = this.registerForm.controls["reenterPassword"].value;

            //    // Use a regular expression to check if the email is valid
            //    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            //    if (email != null) {
            //      if (!emailRegex.test(email)) {
            //        alert("Please enter a valid email address!");
            //        return;
            //      }
            //    } else {
            //      alert("Please enter a valid email address!");
            //      return;
            //    }


            //    // Count the number of spaces in the full name
            //    let numberOfSpaces = 0;
            //    if (fullName != null) {
            //      numberOfSpaces = (fullName.split(" ").length - 1);
            //    }
            //    else {
            //      alert("Please enter your first name and surname only!");
            //      return;
            //    }

            //    //Check if passwords entered, match.
            //    if (password != passwordConfirm) {
            //      alert("The passwords entered do not match");
            //      return;
            //    }
            //    else {
            //    }

            //    if (numberOfSpaces >= 2 || numberOfSpaces == 0) {
            //      alert("Please enter your first name and surname only!");
            //    } else {
            //      this.userService.register(fullName, email, password).subscribe((data: any) => {
            //        if (data.responseCode == 1) {
            //          console.log("After Register", data.dateSet);
            //          localStorage.setItem("LoggedInUserInfo", JSON.stringify(data.dateSet));
            //          alert(data.responseMessage);
            //          this.router.navigate(["/new-profile"]);
            //        } else {
            //          //alert("Invalid Email or Password");
            //          alert(data.responseMessage);
            //        }
            //        //console.log("reponse", data);
            //      }, error => {
            //        console.log("Error: ", error);
            //      });
            //    }
            //  }
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
  login() {
    this.router.navigate(["/home"]);
  }
  newUser() {
    this.router.navigate(["/new-profile"]);
  }


          }



    
   
