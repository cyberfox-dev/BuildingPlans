import { Component, EventEmitter, OnInit, Output, ElementRef } from '@angular/core';
import { UntypedFormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { UserService } from '../service//User/user.service';
import { SharedService } from "src/app/shared/shared.service"
import { UserProfileService } from 'src/app/service/UserProfile/user-profile.service';
import { NotificationsService } from "src/app/service/Notifications/notifications.service";
import { NewProfileComponent } from 'src/app/new-user/new-profile/new-profile.component';
import { HomeComponent } from 'src/app/home/home.component';
import { BusinessPartnerService } from 'src/app/service/BusinessPartner/business-partner.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { BpNumberService } from 'src/app/service/BPNumber/bp-number.service'
import { tap } from 'rxjs/operators';


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
    bpNumber: ['', Validators.required],
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
    private businessPartnerService: BusinessPartnerService,
    // private homeComponent: HomeComponent,
    private bpNumberService: BpNumberService,

  ) { }



  ngOnInit() {


  }
  characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // Assuming this.characters is initialized somewhere above
  generateOTP(length: number): Observable<string> {
    const email = this.registerForm.controls["registerEmail"].value;

    return this.userService.emailExists(email).pipe(
      tap(exists => {
        if (exists) {
          this.handleEmailExists();
          throw new Error('Email exists'); // throw an error to skip the following logic
        }
      }),
      map(() => this.createOTP(length)),
      tap(otp => this.handleNewEmail(otp, email)),
      catchError((error) => {
        this.handleErrorCheckingEmail(error);
        return of(''); // Return an empty string if there's an error
      })
    );
  }

  onSendOTP(): void {
    this.generateOTP(6).subscribe(otp => {
      this.otp = otp;
    });
  }

  createOTP(length: number): string {
    let otp = '';
    const charactersLength = this.characters.length;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      otp += this.characters.charAt(randomIndex);
    }
    return otp;
  }

  handleEmailExists(): void {
    alert('Email already exists. Please login or use another email.');
  }

  handleNewEmail(otp: string, email: string): void {
    this.DoChecksForRegister();

    if (this.registerForm.controls["registerEmail"]) {
      alert("OTP Sent, Please check your email");
      this.sendOTPBtn = false;
      this.notification.sendEmail(email, "OTP",
        `Hello, you have recently tried to create an account on the Wayleave Management System, here is your one-time pin for your account: ${otp} . This code will be invalid in the next 2 hours.`,
        `Hello, you have recently tried to create an account on the Wayleave Management System, here is your one-time pin for your account: ${otp} . This code will be invalid in the next 2 hours.`);
      this.startExpirationTimer();
    } else {
      alert("There was an error");
    }
  }

  handleErrorCheckingEmail(error: any): void {
    console.error("Error checking email:", error);
    alert('There was an error. Please try again.');
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

  getUserProfile(): Observable<any> {
    const currentUser = JSON.parse(localStorage.getItem("LoggedInUserInfo"));
    return this.userPofileService.getUserProfileById(currentUser.appUserId);
  }

  onLogin() {
    // Removed the checkBPValidity and its warning

    this.isLoading = true;
    const email = this.loginForm.controls["email"].value;
    const password = this.loginForm.controls["password"].value;

    this.userService.login(email, password).pipe(
      switchMap((data: any) => {
        if (data.responseCode === 1) {
          localStorage.setItem("LoggedInUserInfo", JSON.stringify(data.dateSet));
          return this.getUserProfile();
        } else {
          // Throw error if login failed
          throw new Error(data.responseMessage);
        }
      }),
      switchMap((profileData: any) => {
        localStorage.setItem("userProfile", JSON.stringify(profileData.dateSet));
        return of(true); // Return an observable of true to proceed with the rest of the flow
      })
    ).subscribe(
      // Since we're no longer expecting a boolean for bp validity, adjust accordingly
      () => {
        this.isLoading = false;
        this.router.navigate(["/home"]);
      },
      (error) => {
        console.log("Error: ", error);
        this.isLoading = false;
        this.error = error.message;
      }
    );
  }


  //onLogin() {
  //  let isValidBP = this.checkBPValidity();

  //  // We will still display the warning if it's not valid but not halt the login.
  //  if (!isValidBP) {
  //    console.warn("Invalid Business Partner (BP) Number! Please contact CCT eServices.");
  //    // Notice the "return;" line is removed/commented out.
  //  }
  //  this.isLoading = true;
  //  const email = this.loginForm.controls["email"].value;
  //  const password = this.loginForm.controls["password"].value;

  //  this.userService.login(email, password).pipe(
  //    switchMap((data: any) => {
  //      if (data.responseCode === 1) {
  //        localStorage.setItem("LoggedInUserInfo", JSON.stringify(data.dateSet));
  //        return this.getUserProfile();
  //      } else {
  //        // Throw error if login failed
  //        throw new Error(data.responseMessage);
  //      }
  //    }),
  //    switchMap((profileData: any) => {
        
  //      localStorage.setItem("userProfile", JSON.stringify(profileData.dateSet));
  //      const isInternal = profileData.dateSet[0].isInternal; // assuming isInternal is part of the dateSet at index 0
  //      const bpNo = profileData.dateSet[0].bP_Number;  // assuming bpNumber is part of the dateSet at index 0
        
  //      // Only test the bpNumber if isInternal is false
  //      if (!isInternal) {
          
  //        return this.testBp(bpNo);
  //      } else {
  //        // If isInternal is true, return an Observable of true to proceed with login
  //        return of(true);
  //      }
  //    })
  //  ).subscribe(
  //    (isValidBp: boolean) => {
  //      this.isLoading = false;
  //      if (isValidBp) {
          
  //        this.router.navigate(["/home"]);
  //      } else {
  //        this.error = "Invalid Business Partner (BP) Number! Please contact CCT eServices for more information.";
  //      }
  //    },
  //    (error) => {
  //      console.log("Error: ", error);
  //      this.isLoading = false;
  //      this.error = error.message;
  //    }
  //  );
  //}

  checkBPValidity(): boolean {
    // Some code here to check validity
    return true; // Placeholder
  }

  //onLogin() {
  //  this.isLoading = true;
  //  let email = this.loginForm.controls["email"].value;
  //  let password = this.loginForm.controls["password"].value;

  //  this.userService.login(email, password).subscribe(
  //    (data: any) => {
  //      if (data.responseCode === 1) {
  //        localStorage.setItem("LoggedInUserInfo", JSON.stringify(data.dateSet));
  //        this.getUserProfile();

  //        this.isLoading = false;
  //        this.router.navigate(["/home"]);
  //      } else {
  //        this.isLoading = false;

  //        this.error = "" + data.responseMessage;

  //      }
  //    },
  //    (error) => {
  //      console.log("Error: ", error);
  //    }
  //  );

  //}



  //getUserProfile() {
  //  let stringifiedData = JSON.parse(
  //    JSON.stringify(localStorage.getItem("LoggedInUserInfo"))
  //  );
  //  let currentUser = JSON.parse(stringifiedData);
  //  this.userPofileService
  //    .getUserProfileById(currentUser.appUserId)
  //    .subscribe(
  //      (data: any) => {
  //        localStorage.setItem("userProfile", JSON.stringify(data.dateSet));
  //      },
  //      (error) => {
  //        console.log("Error: ", error);
  //      }
  //    );
  //}


  testBp(BpNo: any): Observable<boolean> {
    return new Observable(observer => {
      this.businessPartnerService.validateBP(Number(BpNo)).subscribe(
        (response: any) => {
          
          const apiResponse = response.Response;
          if (apiResponse == "X") {
            observer.next(true);
          } else {
            observer.next(false);
          }
          observer.complete();
        },
        (error: any) => {
          // Handle API error
          console.error('API error:', error);
          observer.next(false);
          observer.complete();
        }
      );
    });
  }

  VerifyBP(BpNo: any) {
    const requestBody = "{'BusinessPartnerNumber': " + BpNo + "},";

    this.bpNumberService.makeApiCall(requestBody)
      .subscribe(response => {
        console.log('bpNumber:',response);
        // Handle the response data here
      });
  }


  DoChecksForRegister() {
    /*    this.notification.sendEmail("jahdiel@cyberfox.co.za", "Test", "testing 1, 2, 3...");*/

    let fullName = this.registerForm.controls["fullName"].value;
    let bpNumber = this.registerForm.controls["bpNumber"].value;
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


  async onRegister(
    clientFullName?: string | null,
    clientEmail?: string | null,
    phoneNumber?: string | null,
    BpNo?: string | null,
    CompanyName?: string | null,
    CompanyRegNo?: string | null,
    PhyscialAddress?: string | null,
    ApplicantIDUpload?: string | null,
    ApplicantIDNumber?: string | null
  ) {
    let onLoginForm = true;
    let clientRegisterPassword = null;
    // If the method is called without parameters, then get the values from the form
    if (clientFullName === undefined || clientEmail === undefined || BpNo === undefined || clientFullName == null || clientEmail == null || BpNo == null || clientFullName == "" || clientEmail == "" || BpNo == "") {
      clientFullName = this.registerForm.controls["fullName"].value;
      clientEmail = this.registerForm.controls["registerEmail"].value;
      clientRegisterPassword = this.registerForm.controls["registerPassword"].value;
      BpNo = this.registerForm.controls["bpNumber"].value;

    } else {
      onLoginForm = false;
    }

    this.VerifyBP(BpNo);

    this.testBp(BpNo).subscribe(isBpValid => {
/*      if (!isBpValid) {
        alert("Please enter a valid Business Partner (BP) Number!");
        return;
      }*/

      this.sharedService.errorForRegister = false;

      // Validate email
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
      }
      else if (clientRegisterPassword != null){
        this.userService.register(clientFullName, clientEmail, clientRegisterPassword).subscribe((data: any) => {
          if (data.responseCode == 1) {
            if (onLoginForm === false) {
              this.newProfileComponent.onNewProfileCreate(
                data.dateSet.appUserId,
                clientFullName,
                clientEmail,
                phoneNumber,
                BpNo,
                CompanyName,
                CompanyRegNo,
                PhyscialAddress,
                ApplicantIDUpload,
                ApplicantIDNumber
              );
              this.sharedService.errorForRegister = false;
            }

            this.sharedService.clientUserID = data.dateSet.appUserId;
            localStorage.setItem("LoggedInUserInfo", JSON.stringify(data.dateSet));
            this.sharedService.newUserProfileBp = BpNo;
            this.router.navigate(["/new-profile"]);
          } else {
            this.sharedService.errorForRegister = true;
            alert(data.responseMessage);
          }
        }, error => {
          console.log("Error: ", error);
        });
      }
      else {
        // If BP Number is valid, proceed with user registration
        this.userService.register(clientFullName, clientEmail, "Password@" + clientFullName).subscribe((data: any) => {
          if (data.responseCode == 1) {
            if (onLoginForm === false) {
              this.newProfileComponent.onNewProfileCreate(
                data.dateSet.appUserId,
                clientFullName,
                clientEmail,
                phoneNumber,
                BpNo,
                CompanyName,
                CompanyRegNo,
                PhyscialAddress,
                ApplicantIDUpload,
                ApplicantIDNumber
              );
              this.sharedService.errorForRegister = false;
            }
           
            this.sharedService.clientUserID = data.dateSet.appUserId;
            localStorage.setItem("LoggedInUserInfo", JSON.stringify(data.dateSet));
            this.sharedService.newUserProfileBp = BpNo;
            this.router.navigate(["/new-profile"]);
          } else {
            this.sharedService.errorForRegister = true;
            alert(data.responseMessage);
          }
        }, error => {
          console.log("Error: ", error);
        });
      }
    });
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
            //          
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



    
   
