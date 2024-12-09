import { Component, EventEmitter, OnInit, Output, ElementRef } from '@angular/core';
import { UntypedFormGroup, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
import { UserService } from '../service//User/user.service';
import { SharedService } from "src/app/shared/shared.service"
import { UserProfileService } from 'src/app/service/UserProfile/user-profile.service';
import { NotificationsService } from "src/app/service/Notifications/notifications.service";
import { NewProfileComponent } from 'src/app/new-user/new-profile/new-profile.component';
import { HomeComponent } from 'src/app/home/home.component';
import { BusinessPartnerService } from 'src/app/service/BusinessPartner/business-partner.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { BpNumberService } from 'src/app/service/BPNumber/bp-number.service'
import { tap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from 'src/app/service/Config/config.service';
import { ZoneLinkService } from 'src/app/service/ZoneLink/zone-link.service';
import { AccessGroupsService } from 'src/app/service/AccessGroups/access-groups.service';
import { delay } from 'rxjs/operators';
import { BPAccessGroupUserLinkService } from '../service/BPAccessGroupsUserLink/bpaccess-group-user-link.service';
import { SnackBarAlertsComponent } from '../snack-bar-alerts/snack-bar-alerts.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NONE_TYPE } from '@angular/compiler';

export interface ConfigList {
  configID: number,
  configName: string,
  configDescription: string,
  dateCreated: Date,
  dateUpdated: Date,
  createdById: string,
  isActive: boolean,
  utilitySlot1: string,
  utilitySlot2: string,
  utilitySlot3: string,
}

interface LoginResponse {
  responseCode: number;
  responseMessage: string;
  dateSet: any;
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})



export class LoginComponent implements OnInit {
  hide2 = true;
  isLoading = false;
  error!: string;
  checkEmail = "";
  isMaintenanceMode = false;
  otp = '';
  otpPassword = '';
  sendOTPBtn: boolean = true;
  otpPasswordReset = '';
  isExpired: boolean = false;
  expirationTime: number = 900; // Time limit in seconds (15 minutes)
  expirationTimer: any;
  sentOTP: boolean = false;
  beforeSentOTP: boolean = true;
  public container = document.getElementById('container');

  //Creating an account things:
  showBPNumber: boolean;
  registerForm: FormGroup;
  regFormReadOnly: boolean;
  showDuplicatePassInput: boolean; //This will also hide the OTP button || It should hopefully reveal OTP textbox, and register button!



  public loginForm = this.formBuilder.group({
    email: ['', Validators.required], /**/
    password: ['', Validators.required],

  })

  /*public registerForm = this.formBuilder.group({
    registerEmail: ['', Validators.required],
    registerPassword: ['', Validators.required],
    reenterPassword: ['', Validators.required],
    fullName: ['', Validators.required],
    bpNumber: ['', Validators.required],
    OTPField: ['', Validators.required],
  })*/

  space1: number | undefined;
  space2: number | undefined;

  CurrentUser: any;
  stringifiedData: any;
  hide = true;
  @Output() checkForInternalOption = new EventEmitter<string>();
  FullName: string;
  Email: string;
  Password: string;
  emailPasswordReset = '';

  //Gets all configuration data
  AllConfig: ConfigList[] = [];
  public ServerType: string;
    otpValid: boolean = false;
    logIN: boolean = true;
    signIN: boolean = false;
    email: any;

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
    private modalService: NgbModal,
    private bpNumberService: BpNumberService,
    private _snackBar: MatSnackBar,
    private configService: ConfigService,
    private zoneLinkService: ZoneLinkService,
    private accessGroupsService: AccessGroupsService,
    private route: ActivatedRoute,
    private bpAccessGroupUserLinkService: BPAccessGroupUserLinkService,
  ) {     //Run this before anything else because weaccess the apiURL from it.
    this.getConfig();
  }

  ngOnInit() {
/*    this.getConfigForMaintenanceMode();*/
    // Initialize the registration form
    this.registerForm = this.formBuilder.group({
      registerEmail: ['', [Validators.required, Validators.email]],
      registerPassword: ['', Validators.required],
      reenterPassword: ['', Validators.required],
      fullName: ['', Validators.required],
/*      OTPField: ['', Validators.required],*/
    });

    this.showBPNumber = true; // Set showBPNumber to true initially
    this.regFormReadOnly = false; //form editable at first
    this.showDuplicatePassInput = true;

    // Subscribe to changes in the email field to toggle the BP number field
    this.registerForm.get('registerEmail').valueChanges.subscribe((email) => {
      if (email.toLowerCase().endsWith('@msunduzi.gov.za')) { //BPRegister Sindiswa 20062024
        this.showBPNumber = false; // Email is empty, so hide BP number textbox || The user is internal, so hide BP number textbox
      }
      else {
        this.showBPNumber = true;
      }
    });
   /* this.registerForm.reset();*/
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: light)').matches;
    }
    this.updateTheme();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.updateTheme();
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  updateTheme(): void {
    const theme = this.isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }

  characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  otpArray: string[] = ['', '', '', '', '', '']; // Array to store OTP digits
  isResendDisabled: boolean = false; // To disable the resend button
  resendTimer: number = 30; // Cooldown timer for resending OTP
  isDarkMode: boolean = false;

  checkOtpValidity(): void {
    this.otpValid = this.otpArray.every((digit) => digit !== '');
  }

  isOtpValid(): boolean {
    return this.otpValid;
  }

  resendOTP(): void {
    this.isResendDisabled = true;
    this.resendTimer = 30; // Reset the timer
    this.startResendTimer();
    // Logic to resend OTP goes here
    console.log('OTP resent to:', this.email);
  }

  startResendTimer(): void {
    const interval = setInterval(() => {
      if (this.resendTimer > 0) {
        this.resendTimer--;
      } else {
        this.isResendDisabled = false;
        clearInterval(interval);
      }
    }, 1000);
  }
  // Assuming this.characters is initialized somewhere above
  generateOTP(length: number): Observable<string> {
    this.email = this.registerForm.controls["registerEmail"].value;

    return this.userService.emailExists(this.email).pipe(
      tap(exists => {
        if (exists) {
          this.handleEmailExists();//It seems like this means that the email exists in wayleave system
          throw new Error('Email exists'); // throw an error to skip the following logic
        }
      }),
      map(() => this.createOTP(length)),
      tap(otp => this.handleNewEmail(otp, this.email)),
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
  isValid: boolean = false;
  isInvalid: boolean = false;
  isInvalidEmail: boolean = false;
  isValidEmail: boolean = false;
  errorMessage: string;
  isPasswordValid: boolean = false;
  passwordsMatch: boolean = false;
  showPasswordError: boolean = false;
  showReenterPasswordError: boolean = false;
  validatePassword() {
    const password = this.registerForm.controls['registerPassword']?.value;
    this.isPasswordValid = !!password && password.length >= 5; // Add more validation criteria here
    this.showPasswordError = !this.isPasswordValid;

    if (password == null || password == '') {
      this.errorMessage = "";
    }
    else if (!this.isPasswordValid) {
      this.errorMessage = "Please enter a password longer than 5 char";
    }
    else {
      this.errorMessage = "";
    }
  }

  validateReenteredPassword() {
    const password = this.registerForm.controls['registerPassword']?.value;
    const reenteredPassword = this.registerForm.controls['reenterPassword']?.value;
    this.passwordsMatch = password === reenteredPassword;
    this.showReenterPasswordError = !this.passwordsMatch;

    if (reenteredPassword == null || reenteredPassword == '') {
      this.errorMessage = "";
    }
    else if (!this.passwordsMatch) {
      this.errorMessage = "Passwords do not match!";
    }
    else {
      this.errorMessage = "";
      
    }
  }
  async checkNewEmail() {
    debugger;
    this.validEmail = false;
    this.isValidEmail = null;
    this.isInvalidEmail = false;
    let email = this.registerForm.controls["registerEmail"].value;
    const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.registerForm.controls["registerEmail"].value == null || this.registerForm.controls["registerEmail"].value == '') {
      this.validEmail = null;
    }
    else {
      if (email == null) {
        this.errorMessage = "";
        this.validEmail = null;
      }


      else if (!emailRegex.test(email)) {
        this.errorMessage = "Please enter a vaild email address";
        this.validEmail = false;
      }
      else {
        this.validEmail = true;

        if (email.endsWith("@msunduzi.gov.za")) { ////BPRegister Sindiswa 20062024
          this.internalUserNoBP = true;
          // Leave it empty for internal folks -- OKAY, I CAN'T DO THAT! OR CAN I?
          this.externalWValidBP = false; // Make sure this is false for internal users

        }
        else {
          // Check if the email already exists in the wayleave system
          try {
            const exists = await this.userService.emailExists(email).toPromise();
            if (exists) {
              this.errorMessage = "Email already exists in system. Consider changing your password";
              this.validEmail = false;
            } else {
              console.log("Testing BP Number");
              // Ensure bpNumber is not empty before validating it

            }
          } catch (error) {
            console.error("An error occurred: ", error);
            this.validEmail = false;
            this.internalUserNoBP = false;
            this.externalWValidBP = false;
          }
        }
      }
    }

  }
  checkName() {
    this.isValid = false;
    this.isInvalid = false;
    let fullName = this.registerForm.controls["fullName"].value;

    const nameParts = fullName.split(' ');

    if (nameParts.length !== 2) {
/*      alert("Please enter your first name and surname only");*/
      this.errorMessage="Please enter your first name and surname only";
      this.validNameSurname = false;
      this.isValid = false;
      this.isInvalid = true;
      this.isInvalid = true;
    } else {
      // Check if both parts are non-empty
      if (nameParts[0].trim() === '' || nameParts[1].trim() === '') {
        this.isValid = false;
        this.isInvalid = true;
        this.errorMessage = "";
        this.validNameSurname = false;
      } else {
        this.isValid = true;
        this.isInvalid = false;
        this.errorMessage = "";
        this.validNameSurname = true;
      }
    }
    console.log("Full Name: " + this.validNameSurname);
  }
  openSnackBar(message: string) {
    this._snackBar.openFromComponent(SnackBarAlertsComponent, {
      data: { message }, // Pass the message as data to the component
      duration: 4 * 1000,
      panelClass: ['green-snackbar'],
      verticalPosition: 'top',
    });
  }



  handleNewEmail(otp: string, email: string): void {
    this.DoChecksForRegister();

    if (this.registerForm.controls["registerEmail"]) {
      alert("OTP Sent, Please check your email");
      this.sendOTPBtn = false;
      const emailContent = `
       <html>
        <head>
          <style>
            /* Define your font and styles here */
            body {
              font-family: Arial, sans-serif;
            }
            .email-content {
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            .footer {
              margin-top: 20px;
              color: #777;
            }
            .footer-logo {
              display: inline-block;
              vertical-align: middle;
            }
          </style>
        </head>
        <body>
          <div class="email-content">
            <p>Dear Applicant,</p>
            <p>Please enter the following one time pin to create your account on the Engage Development Services System System: <strong>${otp}</strong>. This code will be valid for the next 15 minutes.</p>
            <p>Should you have any queries, please contact <a href="#">cyberfxo@placeholderemail.com</a></p>
                <p >Regards,<br><a href="#">Engage Development Services System</a></p>
                          <p>
              <a href="http://www.msunduzi.gov.za//">Msunduzi Web</a> | <a href="http://www.msunduzi.gov.za/site/contactus/index.html">Contacts</a> | <a href="#">Media</a> | <a href="#">Report a fault</a> | <a href="mailto:accounts@placeholder.gov.za?subject=Account query">Accounts</a>              
            </p>
             <img class="footer-logo" src='src/assets/engage_dev_logo.png'' alt="Engage Development Services Logo" width="100">
          </div>

        </body>
      </html>
    `;

      this.notification.sendEmail(email, "OTP", emailContent, emailContent);
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
    }, this.expirationTime * 20);
  }

  getUserProfile(): Observable<any> {
    const currentUser = JSON.parse(localStorage.getItem("LoggedInUserInfo"));


    return this.userPofileService.getDefaltUserProfile(currentUser.appUserId);
  }
  getUserProfileOld(): Observable<any> {
    const currentUser = JSON.parse(localStorage.getItem("LoggedInUserInfo"));
    return this.userPofileService.getUserProfileById(currentUser.appUserId);
  }

  changeForm(check:any) {
    this.logIN = false;
    this.signIN = true;

    if (check == true) {
      this.logIN = false;
      this.signIN = true;
    }
   else if (check == false) {
      this.logIN = true;
      this.signIN = false;
    }
  }
  openOTP(otpModal: any) {
    this.onSendiOTP();
    this.modalService.open(otpModal, { centered: true, size: 'lg', backdrop: 'static' });
  }

  getAllRolesForUserForAllAG(userId: number): void {
    debugger;
    this.bpAccessGroupUserLinkService.getAllRolesForUserForAllAG(userId).subscribe(
      (data: any) => {
        
        if (data?.responseCode === 1 && data?.dateSet) {
          
          this.setLocalStorage("AllCurrentUserRoles", data.dateSet);
        } else {
          console.error("Invalid data structure received: ", data);
        }
      },
      error => console.error("Error: ", error)
    );
  }


  onLogin(): void {
    
    if (this.loginForm.invalid) {
      console.error("Form is invalid");
      return;
    }

    this.isLoading = true;
    
    const email = this.loginForm.controls["email"].value;
    const password = this.loginForm.controls["password"].value;

    this.userService.login(email, password).pipe(

      switchMap((data: LoginResponse) => {
        
        if (data.responseCode === 1) {
          this.setLocalStorage("LoggedInUserInfo", data.dateSet);
          return this.getUserProfile();
        }
        return throwError(data.responseMessage);
      }),
      tap((profileData: LoginResponse) => {
        
        const userId = profileData.dateSet[0].userProfileID;
        this.setLocalStorage("userProfile", profileData.dateSet);
        
        this.getAllRolesForUserForAllAG(userId);
      }),
      catchError(error => {
        console.error("Failed in the pipeline", error);
        return throwError(error);
      }),
      delay(5000) // consider reducing the delay if it’s not necessary
    ).subscribe(
      () => {
        this.router.navigate(["/home"]);
      },
      (error) => {
        console.error("Error: ", error);
        this.error = error.message;
      }
    ).add(() => {
      this.isLoading = false;
    });
  }



onLoginNewOld(): void {
  if(this.loginForm.invalid) {
  console.error("Form is invalid");
  return;
}

this.isLoading = true;

const email = this.loginForm.controls["email"].value;
const password = this.loginForm.controls["password"].value;

this.userService.login(email, password).pipe(
  switchMap((data: LoginResponse) => {
    if (data.responseCode === 1) {
      this.setLocalStorage("LoggedInUserInfo", data.dateSet);
      return this.getUserProfile();
    }
    return throwError(data.responseMessage);
  }),
  switchMap((profileData: LoginResponse) => {
    const userId = profileData.dateSet[0].userProfileID;
    this.setLocalStorage("userProfile", profileData.dateSet);
    this.getAllRolesForUserForAllAG(userId);
    return this.zoneLinkService.getAllUserLinks(userId);
  }),
  tap((response: LoginResponse) => this.handleUserLinks(response.dateSet)),
  catchError(error => {
    console.error("Failed in the pipeline", error);
    return throwError(error);
  }),
  delay(5000) // consider reducing the delay if it’s not necessary
).subscribe(
  () => {
    this.router.navigate(["/home"]);
  },
  (error) => {
    console.error("Error: ", error);
    this.error = error.message;
  }
).add(() => {
  this.isLoading = false;
});
}

  setLocalStorage(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  handleUserLinks(zoneLinks: any[]): void {
    const defaultZoneLink = zoneLinks?.find(link => link.isDefault) || zoneLinks?.[0];
    if (!defaultZoneLink) return;

    let userProfile = JSON.parse(localStorage.getItem("userProfile") || '[]');
    if (!Array.isArray(userProfile)) {
      console.error("userProfile is not an array: ", userProfile);
      return;
    }

    const mergedProfile = { ...userProfile[0], ...defaultZoneLink };
    this.setLocalStorage("userProfile", [mergedProfile]);
  }

 
  


  //old login 10-10-23
/*  onLogin() {
    // Removed the checkBPValidity and its warning

    this.isLoading = true;
    const email = this.loginForm.controls["email"].value;
    const password = this.loginForm.controls["password"].value;

    this.userService.login(email, password).pipe(
      switchMap((data: any) => {
        if (data.responseCode === 1) {
          localStorage.setItem("LoggedInUserInfo", JSON.stringify(data.dateSet));
          return this.getUserProfileOld();
        } else {
          // Throw error if login failed
          throw new Error(data.responseMessage);
        }
      }),
      switchMap((profileData: any) => {
        localStorage.setItem("userProfile", JSON.stringify(profileData.dateSet));
        return of(true); // Return an observable of true to proceed with the rest of the flow
      }),
      delay(5000) // Delay for 5 seconds after successful login and profile retrieval
    ).subscribe(
      () => {
        this.router.navigate(["/home"]);

        // Wait for an additional 5 seconds before setting isLoading to false

        this.isLoading = false;

      },
      (error) => {
        console.log("Error: ", error);
        this.isLoading = false;
        this.error = error.message;
      }
    );
  }*/


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
        console.log('bpNumber:', response);
        // Handle the response data here
      });
  }

  //REGISTERREGISTERREGISTERREGISTERREGISTERREGISTERREGISTERREGISTERREGISTERREGISTERREGISTERREGISTER
  testBp2(BpNo: any): Promise<boolean> {
    return this.businessPartnerService.validateBP(Number(BpNo))
      .toPromise()
      .then((response: any) => {
        const apiResponse = response.Response;
        return apiResponse === "X";
      })
      .catch((error: any) => {
        // Handle API error
        console.error('API error:', error);
        return false; // Return false in case of an error
      });
  }

  validNameSurname: boolean = false;
  validEmail: boolean = false;
  matchingRegPasswords: boolean = false;
  internalUserNoBP: boolean = false;
  externalWValidBP: boolean;

  async onChecksRegistration() {
    let fullName = this.registerForm.controls["fullName"].value;
    let email = this.registerForm.controls["registerEmail"].value;
    let password = this.registerForm.controls["registerPassword"].value;
    let passwordConfirm = this.registerForm.controls["reenterPassword"].value;

    const nameParts = fullName.split(' ');

    if (nameParts.length !== 2) {
      alert("Please enter your first name and surname only");
      this.validNameSurname = false;
    } else {
      // Check if both parts are non-empty
      if (nameParts[0].trim() === '' || nameParts[1].trim() === '') {
        alert("Both first name and last name should be non-empty.");
        this.validNameSurname = false;
      } else {
        this.validNameSurname = true;
      }
    }
    console.log("Full Name: " + this.validNameSurname);
    const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (email === null || !emailRegex.test(email)) {
      alert("Please enter a valid email address");
      this.validEmail = false;
    } else {
      this.validEmail = true;

      if (email.endsWith("@msunduzi.gov.za")) { ////BPRegister Sindiswa 20062024
        this.internalUserNoBP = true;
        // Leave it empty for internal folks -- OKAY, I CAN'T DO THAT! OR CAN I?
        this.externalWValidBP = false; // Make sure this is false for internal users

      }
      else {
        // Check if the email already exists in the wayleave system
        try {
          const exists = await this.userService.emailExists(email).toPromise();
          if (exists) {
            alert("Email already exists in wayleave system. Consider changing your password");
            this.validEmail = false;
          } else {
            console.log("Testing BP Number");
            // Ensure bpNumber is not empty before validating it

          }
        } catch (error) {
          console.error("An error occurred: ", error);
          this.validEmail = false;
          this.internalUserNoBP = false;
          this.externalWValidBP = false;
        }
      }
    }
    console.log("Email is okay?" + this.validEmail);
    console.log("Is User Internal? " + this.internalUserNoBP);
    console.log("User has valid BP Num " + this.externalWValidBP);
    
    if (password.trim() === '' || passwordConfirm.trim() === '') {
      // At least one of the passwords is empty or contains only whitespace.
      alert("Password field has been left empty");
      this.matchingRegPasswords = false;
    } else {
      if (password !== passwordConfirm) {
        alert("Passwords do not match");
        this.matchingRegPasswords = false;
      } else {
        this.matchingRegPasswords = true;
      }
      console.log("Passwords are: " + this.matchingRegPasswords);
    }
  }
  //I WONDER IF I CAN FIX THE ISSUE WITHE THE CREATE WAYLEAVE FOR NEW CLIENT SO THAT THE USER ID IS STILL ACCESSIBLE

  async onSendiOTP() {

    try {
      await this.onChecksRegistration();

      // icasadetails Sindiswa 10 January 2024 - I temporarily commmented some conditions out because I don't have a valid BP Number, for some reason this 1000110197 didn't work
      //if (this.validNameSurname && this.validEmail && this.matchingRegPasswords) {
      if (this.validNameSurname && this.validEmail && this.matchingRegPasswords ) {
        this.regFormReadOnly = true;
        this.showDuplicatePassInput = false;
        this.onSendOTP();

      }
      else {
        alert("OTP not sent: make sure to fill-in all fields appropriately.");
        return;
      }
    }
    catch (error) {
      console.error("Error in onChecksRegistration:", error);
    }

  }

  first: string;
  second: string;
  third: string;
  fourth: string;
  fifth: string;
  sixth: string;

  async onVerifyOTPRegister(
    clientFullName?: string | null,
    clientEmail?: string | null,
    phoneNumber?: string | null, //Create new account doesn't have?
    BpNo?: string | null,
    CompanyName?: string | null, //Create new account doesn't have?
    CompanyRegNo?: string | null, //Create new account doesn't have?
    PhyscialAddress?: string | null, //Create new account doesn't have?
    ApplicantIDUpload?: string | null, //Create new account doesn't have?
    ApplicantIDNumber?: string | null //Create new account doesn't have?



  ) {



    let onLoginForm = true;
    let clientRegisterPassword = this.registerForm.controls["registerPassword"].value;
    /*let otpEntered = this.registerForm.controls["OTPField"].value;*/

    clientFullName = this.registerForm.controls["fullName"].value;
    clientEmail = this.registerForm.controls["registerEmail"].value;
    let otpEntered = this.first + this.second + this.third + this.fourth + this.fifth + this.sixth;
    

    if (this.otp != otpEntered) {
      alert("Invalid OTP");
    }
    else { 
    //Not sure what this does TBH
    this.sharedService.errorForRegister = false;
      this.userService.register(clientFullName, clientEmail, clientRegisterPassword).subscribe((data: any) => {
      if (data.responseCode == 1) {
        if (onLoginForm === false) {

          this.sharedService.userIDForWalkIn == data.dateSet.appUserId; //added to add access user ID, when trying to create new wayleave for new client?
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
        this.otpValid = true;
  
        } else {
          this.sharedService.errorForRegister = true;
          alert(data.responseMessage);
        }
      }, error => {
        console.log("Error: ", error);
      });
    }
    console.log("Your password is: " + clientRegisterPassword);
  }
  Architect: boolean = false;
  //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
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
     

    } else {
      onLoginForm = false;
    }
    
   /* this.VerifyBP(BpNo);*/

    this.testBp(BpNo).subscribe(isBpValid => {
      if (!isBpValid) {
        alert("Please enter a valid Business Partner (BP) Number!");
        return;
      }

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
      else if (clientRegisterPassword != null) {
        this.userService.register(clientFullName, clientEmail, clientRegisterPassword).subscribe((data: any) => {
          if (data.responseCode == 1) {
            if (onLoginForm === false) {
              
              this.sharedService.userIDForWalkIn == data.dateSet.appUserId;
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


  //forgot password

  openForgotPassModal(forgotPasswordModal: any) {
    this.modalService.open(forgotPasswordModal, { centered: true, size: 'lg', backdrop: 'static' });
  }

  /*External*/
  extApplicantBpNoApplicant = '';
  extApplicantCompanyName = '';
  extApplicantCompanyRegNo = '';
  extApplicantCompanyType = '';
  extApplicantName = '';
  extApplicantSurname = '';
  extApplicantTellNo = '';
  extApplicantEmail = '';
  extApplicantPhyscialAddress = '';
  extApplicantIDNumber = '';
  extApplicantIDUpload: any;
  extApplicantICASANumber = ''; //icasadetails Sindiswa 10 January 2023

  showTelecommsPrompt = true; //icasadetails Sindiswa 10 January 2023
  isRepresentingTelecommsCompany = false; //icasadetails Sindiswa 10 January 2023


  /*Internal*/
  internalApplicantName = '';
  internalApplicantSurname = '';
  internalApplicantDirectorate = '';
  internalApplicantDepartment = '';
  internalApplicantTellNo = '';
  internalApplicantEmail = ''; //BPRegister Sindiswa 20062024
  internalApplicantAlternativeEmail = ''; //BPRegister Sindiswa 20062024
  internalApplicantBranch = '';
  internalApplicantCostCenterNo = '';
  internalApplicantCostCenterOwner = '';
  selectedZone = '';
  extApplicantVatNumber = '';
  internalApplicantICASANumber = ''; //icasadetails Sindiswa 10 January 2023



  subDepartmentID: any;
  departmentID: any;

  openNewUser(newUser: any) {
    this.modalService.open(newUser, { centered: true, size: 'xl', backdrop: 'static' });
  }

  sendOTPForPasswordReset() {
    
    this.otpPassword = '';
    const digits = 5; // Specify the number of digits for your OTP

    for (let i = 0; i < digits; i++) {
      const randomIndex = Math.floor(Math.random() * this.characters.length);
      this.otpPassword += this.characters.charAt(randomIndex);
    }

    const emailContent = `
      <html>
        <head>
          <style>
            /* Define your font and styles here */
            body {
              font-family: Arial, sans-serif;
            }
            .email-content {
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            .footer {
              margin-top: 20px;
              color: #777;
            }
            .footer-logo {
              display: inline-block;
              vertical-align: middle;
            }
          </style>
        </head>
        <body>
          <div class="email-content">
            <p>Dear User,</p>
            <p>You are trying to reset your password. Your OTP code is : <strong>${this.otpPassword}</strong>. This code will be valid for the next 15 minutes.</p>
            <p>Should you have any queries, please contact us at <a href="#">cyberfox@placeholdermail.com</a></p>
          </div>
          <div class="footer">

            <img class="footer-logo" src='src/assets/engage_dev_logo.png' alt="Engage Development Services Logo" width="100">
            <p>Regards,<br>Engage Development Services</p>
            <p>
              <a href="#">Msunduzi Web</a> | <a href="#">Contacts</a> | <a href="#">Media</a> | <a href="#">Report a fault</a> | <a href="#">Accounts</a>
            </p>
          </div>
        </body>
      </html>
    `;

    this.notification.sendEmail(this.emailPasswordReset, "Password Reset", emailContent, emailContent);
    this.startExpirationTimer();
    this.sentOTP = true;
    this.beforeSentOTP = false;

  }

  validateOTP(newPasswordModal: any) {
    
    if (this.otpPasswordReset === this.otpPassword) {
      this.modalService.dismissAll();
      this.modalService.open(newPasswordModal, { centered: true, size: 'lg', backdrop: 'static' });
    }
    else {
      alert("OTP Incorrect");
    }
  }
  newPassword = '';
  newReEnterPassword = '';

  changePassword() {
    if (this.newPassword === this.newReEnterPassword) {


      this.userService.updatePassword(this.emailPasswordReset, this.newPassword).subscribe((data: any) => {
        
        if (data.responseCode === 1) {


          this.modalService.dismissAll();

          this.newPassword = '';
          this.newReEnterPassword = '';
          this.otpPassword = '';
          this.otpPasswordReset = '';
          this.emailPasswordReset = '';
          this.sentOTP = false;
          this.beforeSentOTP = true;
          alert("Password Changed Successfully");
        }

        else {
          alert(data.responseMessage);
        }
        console.log("reponse", data);

      }, error => {
        console.log("Error: ", error);
      })
    }

    else if (this.newPassword !== this.newReEnterPassword && this.newPassword != null || this.newReEnterPassword != null) {
      alert("The passwords do not match");
    }
    else {
      alert("Please enter in both fields");
    }
  }

  dismissAll() {
    this.newPassword = '';
    this.newReEnterPassword = '';
    this.otpPassword = '';
    this.otpPasswordReset = '';
    this.emailPasswordReset = '';
    this.sentOTP = false;
    this.beforeSentOTP = true;
  }

  getConfig() {
    this.AllConfig.splice(0, this.AllConfig.length);

    this.configService.getAllConfigs().subscribe((data: any) => {

      if (data) {
        this.AllConfig = data.dateSet;

       

        this.sharedService.setAllConfig(this.AllConfig);
        this.ServerType = this.AllConfig.find((Config) => Config.configName === 'ServerType').utilitySlot1;
      } else {
        alert("Error");
      }

      console.log("response", data);
    }, error => {
      console.log("Error", error);
    })




  }

  getConfigForMaintenanceMode() {
    this.configService.getConfigsByConfigName("MaintenanceMode").subscribe((data: any) => {
      if (data.responseCode == 1) {
        
          const current = data.dateSet[0];
          if (current.isActive == false) {
            this.isMaintenanceMode = false;
          }
          else {
            this.isMaintenanceMode = true;
          }
         
        
      }
      else {
        //alert("Invalid Email or Password");
        alert(data.responseMessage);
      }
      console.log("getConfigsByConfigNameReponse", data);

    }, error => {
      console.log("getConfigsByConfigNameError: ", error);
    })

  }

  isArchitect: boolean = false;
  onCheckboxClick() {
    
    if (this.isArchitect == false) {
      this.isArchitect = true;

    }
    else {
      this.isArchitect = false;
    }

    this.sharedService.setIsArchitect(this.isArchitect);
  }


}





