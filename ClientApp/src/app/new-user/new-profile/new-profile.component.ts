import { Component, OnInit, ViewChild } from '@angular/core';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import Stepper from 'bs-stepper';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/shared/shared.service';
import { UserProfileService } from 'src/app/service/UserProfile/user-profile.service';
import { ProfessionalService } from 'src/app/service/Professionals/professional.service';
import { DepartmentsService } from '../../service/Departments/departments.service';
import { Router } from '@angular/router';
import { ZoneLinkService } from 'src/app/service/ZoneLink/zone-link.service';
import { SelectionModel } from '@angular/cdk/collections';
import { NotificationsService } from 'src/app/service/Notifications/notifications.service';
import { ZonesService } from '../../service/Zones/zones.service';
import { SubDepartmentsService } from 'src/app/service/SubDepartments/sub-departments.service';
import { BusinessPartnerService } from '../../service/BusinessPartner/business-partner.service';
import { Observable } from 'rxjs';

export interface DepartmentList {
  departmentID: number;
  departmentName: string;
  dateUpdated: any;
  dateCreated: any;
}
export interface ZoneDropdown {
  zoneID: number;
  zoneName: string;
}

export interface SubDepartmentList {
  subDepartmentID: number;
  subDepartmentName: string;
  departmentID: number;
  dateUpdated: any;
  dateCreated: any;
}

export interface DepartmentAdminList {
  userId: any;
  idNumber: string;
  fullName: string;
  departmentAdmin: boolean;
}

export interface UserZoneList {
  id: string;
  fullName: string;
  zoneLinkID?: any;
}



export interface ExternalList {

  extApplicantBpNoApplicant:string;
  extApplicantCompanyName: string;
  extApplicantCompanyRegNo: string;
  extApplicantCompanyType: string;
  extApplicantName: string;
  extApplicantSurname: string;
  extApplicantTellNo: string;
  extApplicantEmail: string;
  extApplicantPhyscialAddress: string;
  extApplicantIDNumber: string;
  extApplicantIDUpload: string;

}
export interface InternalList {

  internalApplicantName: string;
  internalApplicantSurname: string;
  internalApplicantDirectorate: string;
  internalApplicantDepartment: string;
  internalApplicantTellNo: string;
  internalApplicantBranch: string;
  internalApplicantCostCenterNo: string;
  internalApplicantCostCenterOwner: string;

}

export interface ContractorList {

  ProfessinalType: string;
  professionalRegNo: string;
  bpNumber: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber?: number;
  CIBRating: string;
  idNumber?: string;

}

@Component({
  selector: 'app-new-profile',
  templateUrl: './new-profile.component.html',
  styleUrls: ['./new-profile.component.css']
})
export class NewProfileComponent implements OnInit {
  checkEmail!: string;
  checke!: string;
  DepartmentDropdown: DepartmentList[] = [];

  @ViewChild("placesRef")
  placesRef: GooglePlaceDirective | undefined;
  options = {
    types: [],
    componentRestrictions: { country: 'ZA' }
  } as unknown as Options

  ZoneDropdown: ZoneDropdown[] = [];
  DepartmentAdminList: DepartmentAdminList[] = [];
  SubDepartmentList: SubDepartmentList[] = [];

  public showExternal: boolean = false;
  public showInternal: boolean = false;
  public External: boolean = false;
  public Internal: boolean = false;
  public einfoactive: boolean = false;

  closeResult = '';

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


  /*Internal*/
  internalApplicantName = '';
  internalApplicantSurname = '';
  internalApplicantDirectorate = '';
  internalApplicantDepartment = '';
  internalApplicantTellNo = '';
  internalApplicantBranch = '';
  internalApplicantCostCenterNo = '';
  internalApplicantCostCenterOwner = '';
  selectedZone = '';
  extApplicantVatNumber = '';
  internalApplicantICASANumber = ''; //icasadetails Sindiswa 10 January 2023

  CurrentUser: any;
  stringifiedData: any;  
  ExternalUserProfileData: ExternalList[] = [];
  InternalUserProfileData: InternalList[] = [];
  linkedContractors: ContractorList[] = [];
  selection = new SelectionModel<UserZoneList>(true, []);
    subDepartmentID: any;
    departmentID: any;

  constructor(private modalService: NgbModal,
    private shared: SharedService,
    private userPofileService: UserProfileService,
    private professionalService: ProfessionalService,
    private departmentService: DepartmentsService,
    private router: Router,
    private notificationsService:NotificationsService,
    private zoneService: ZonesService,
    private zoneLinkService: ZoneLinkService,
    private subDepartmentsService: SubDepartmentsService,
    private businessPartnerService: BusinessPartnerService,

  ) { }
  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public handleAddressChange(address: Address) {
    // Do some stuff
    this.extApplicantPhyscialAddress = address.formatted_address;
   
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


  ngOnInit(): void {
   
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    
    const fullname = this.CurrentUser.fullName;
    this.internalApplicantDepartment = "0";
    this.selectedZone = "0";

    this.internalApplicantName = fullname.substring(0, fullname.indexOf(' '));
    this.internalApplicantSurname = fullname.substring(fullname.indexOf(' ') + 1);

    this.extApplicantName = fullname.substring(0, fullname.indexOf(' '));
    this.extApplicantSurname = fullname.substring(fullname.indexOf(' ') + 1);
    this.extApplicantEmail = this.CurrentUser.email;
    this.checke = this.extApplicantEmail.toString();
    this.checkEmail = this.checke.substring(this.checke.indexOf('@'));
    console.log(this.checkEmail);
    if (this.checkEmail === "@capetown.gov.za") {
      this.showInternal = true; 
    }
    else {
      this.showExternal = true;
      if (this.shared.newUserProfileBp != null || this.shared.newUserProfileBp != "" || this.shared.newUserProfileBp != undefined) {
        this.extApplicantBpNoApplicant = this.shared.newUserProfileBp;
      }
      else {
        this.extApplicantBpNoApplicant = '';
      }

    }
  /*  this.getAllDeps();*/
    this.getAllSubDepartments();



  }

  ngDoCheck() {

    
   
   
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

  onNewProfileCreate(userID?: string | null, fullName?: string | null, email?: string | null, phoneNumber?: string | null, BpNo?: string | null, CompanyName?: string | null, CompanyRegNo?: string | null, PhyscialAddress?: string | null, ApplicantIDUpload?: string | null, ApplicantIDNumber?: string | null, refNumber?:string | null, companyType?: string | null) {
    debugger;
    if (this.showInternal) {
      ///// 

      this.subDepartmentsService.getSubDepartmentBySubDepartmentID(Number(this.internalApplicantDepartment)).subscribe((data: any) => {

        if (data.responseCode == 1) {

          const current = data.dateSet[0];
          debugger;
          this.subDepartmentID = current.subDepartmentID;
          this.departmentID = current.departmentID;
          console.log("reponse this.subDepartmentID this.subDepartmentID this.subDepartmentID this.subDepartmentID this.subDepartmentID this.subDepartmentID this.subDepartmentID", this.subDepartmentID, this.departmentID);
          this.userPofileService.addUpdateUserProfiles(null, this.CurrentUser.appUserId, this.internalApplicantName + " " + this.internalApplicantSurname, this.CurrentUser.email,
            this.internalApplicantTellNo, this.showInternal, null, null, null, null,/*THE DIRECTORATE IS NOW SENDING THROUGH THE DEPSRTMENT NAME*/ this.internalApplicantDirectorate,
            this.departmentID, this.subDepartmentID, this.internalApplicantBranch, this.internalApplicantCostCenterNo, this.internalApplicantCostCenterOwner, null, this.CurrentUser.appUserId,
            null, Number(this.selectedZone)).subscribe((data: any) => {

              if (data.responseCode == 1) {

                alert(data.responseMessage);


                const linkedContractors = this.shared.getContactorData();
                const linkedEngineers = this.shared.getEngineerData();


                for (let i = 0; i < linkedContractors.length; i++) {
                  const linkedContractor = this.shared.getContactorDataByIndex(i);

                  this.professionalService.addUpdateProfessional(null, linkedContractor.ProfessinalType, linkedContractor.name + " " + linkedContractor.surname, linkedContractor.bpNumber, false, linkedContractor.email, linkedContractor.phoneNumber?.toString(), linkedContractor.professionalRegNo, this.CurrentUser.appUserId, linkedContractor.idNumber, this.CurrentUser.appUserId, linkedContractor.CIBRating)
                    .subscribe((data: any) => {

                      if (data.responseCode == 1) {

                        //alert(data.responseMessage);
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

                for (let i = 0; i < linkedEngineers.length; i++) {
                  const linkedEngineer = this.shared.getEngineerDataByIndex(i);

                  this.professionalService.addUpdateProfessional(null, linkedEngineer.ProfessinalType, linkedEngineer.name + " " + linkedEngineer.surname, linkedEngineer.bpNumber, false, linkedEngineer.email, linkedEngineer.phoneNumber?.toString(), linkedEngineer.professionalRegNo, this.CurrentUser.appUserId, linkedEngineer.idNumber, this.CurrentUser.appUserId, linkedEngineer.CIBRating)
                    .subscribe((data: any) => {

                      if (data.responseCode == 1) {

                        //alert(data.responseMessage);
                      }
                      else {
                        //alert("Invalid Email or Password");
                        alert(data.responseMessage);
                        console.log("comeshere")

                      }
                      console.log("reponse", data);

                    }, error => {
                      console.log("Error: ", error);
                    })
                }
              }

              else {

                alert(data.responseMessage);
                localStorage.removeItem('LoggedInUserInfo');
                localStorage.removeItem('userProfile');
                this.router.navigate(["/"]);

              }
              console.log("reponse", data);
              localStorage.removeItem('LoggedInUserInfo');
              localStorage.removeItem('userProfile');
              this.router.navigate(["/"]);
            }, error => {
              console.log("Error: ", error);
            })

        }

        else {

          alert(data.responseMessage);
        }
        console.log("reponse", data);

      }, error => {
        console.log("Error: ", error);
      })





      //Engineer goes here

    }


    else if (userID != null || userID != "") {
      debugger;
      this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
      this.CurrentUser = JSON.parse(this.stringifiedData); 

      debugger;
      this.userPofileService.addUpdateUserProfiles(0, userID, fullName, email, phoneNumber, false, BpNo, CompanyName, CompanyRegNo,
        PhyscialAddress, null, null, null, null, null, null, ApplicantIDUpload, this.CurrentUser.appUserId, ApplicantIDNumber, null, null, refNumber, companyType).subscribe((data: any) => {

        if (data.responseCode == 1) {

          alert(data.responseMessage);
        }
        else {
          alert(data.responseMessage);
       
        }
          console.log("reponse - is this where the dashboard is stolen?", data);
      

      }, error => {
        console.log("Error: ", error);
      })
    }
    else if (this.showInternal === false) {
      debugger;

      this.userPofileService.addUpdateUserProfiles(0, this.CurrentUser.appUserId, this.extApplicantName + " " + this.extApplicantSurname, this.CurrentUser.email, this.extApplicantTellNo, this.showInternal, this.extApplicantBpNoApplicant, this.extApplicantCompanyName, this.extApplicantCompanyRegNo, this.extApplicantPhyscialAddress, null, null, null, null, null, null, this.extApplicantIDUpload, this.CurrentUser.appUserId, this.extApplicantIDNumber, Number(this.selectedZone), this.extApplicantVatNumber).subscribe((data: any) => {
        debugger;
        if (data.responseCode == 1) {

          alert(data.responseMessage);

          debugger;
          const linkedContractors = this.shared.getContactorData();
          const linkedEngineers = this.shared.getEngineerData();


          for (let i = 0; i < linkedContractors.length; i++) {
            const linkedContractor = this.shared.getContactorDataByIndex(i);

            this.professionalService.addUpdateProfessional(null, linkedContractor.ProfessinalType, linkedContractor.name + " " + linkedContractor.surname, linkedContractor.bpNumber, false, linkedContractor.email, linkedContractor.phoneNumber?.toString(), linkedContractor.professionalRegNo, this.CurrentUser.appUserId, linkedContractor.idNumber, this.CurrentUser.appUserId, linkedContractor.CIBRating)
              .subscribe((data: any) => {

                if (data.responseCode == 1) {

                  //alert(data.responseMessage);
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

          for (let i = 0; i < linkedEngineers.length; i++) {
            const linkedEngineer = this.shared.getEngineerDataByIndex(i);

            this.professionalService.addUpdateProfessional(null, linkedEngineer.ProfessinalType, linkedEngineer.name + " " + linkedEngineer.surname, linkedEngineer.bpNumber, false, linkedEngineer.email, linkedEngineer.phoneNumber?.toString(), linkedEngineer.professionalRegNo, this.CurrentUser.appUserId, linkedEngineer.idNumber, this.CurrentUser.appUserId, linkedEngineer.CIBRating)
              .subscribe((data: any) => {

                if (data.responseCode == 1) {

                  //alert(data.responseMessage);
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

        else {
          debugger;
          alert(data.responseMessage);
          localStorage.removeItem('LoggedInUserInfo');
          localStorage.removeItem('userProfile');
          this.router.navigate(["/"]);
        }
        console.log("reponse", data);
        localStorage.removeItem('LoggedInUserInfo');
        localStorage.removeItem('userProfile');
        this.router.navigate(["/"]);
      }, error => {
        console.log("Error: ", error);
      })




      /*      const linkedEngineers = this.shared.getEngineerData;*/








      /*this is some other type of code im not sure*/
      //const newExternalUserProfile = {} as ExternalList;
      //this.extApplicantBpNoApplicant;
      //this.extApplicantCompanyName;
      //this.extApplicantCompanyRegNo;
      //this.extApplicantCompanyType;
      //this.extApplicantName;
      //this.extApplicantSurname;
      //this.extApplicantTellNo;.
      //this.extApplicantEmail;
      //this.extApplicantPhyscialAddress;
      //this.extApplicantIDNumber;
      //this.extApplicantIDUpload;
    }

    

    else {
      alert("Error Saving User Profile Infomation");
    }




  }
  routeChange() {
  
  }

  refresh() {
    localStorage.removeItem('LoggedInUserInfo');
    localStorage.removeItem('userProfile');
    this.router.navigate(["/"]);
  }


  getAllDeps() {

    this.DepartmentDropdown.splice(0, this.DepartmentDropdown.length);
    this.departmentService.getDepartmentsList().subscribe((data: any) => {

      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDepartmentList = {} as DepartmentList;
          const current = data.dateSet[i];
          tempDepartmentList.departmentID = current.departmentID;
          tempDepartmentList.departmentName = current.departmentName;

          this.DepartmentDropdown.push(tempDepartmentList);
       
        }
        console.log("the derpartment thing works");
        
        
      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);


    }, error => {
      console.log("Error: ", error);
    })
  }

  onSelectToSendDepName(event: any) {

    for (var i = 0; i < this.DepartmentDropdown.length; i++) {
      if (this.DepartmentDropdown[i].departmentID == Number(this.internalApplicantDepartment)) {
    
        this.internalApplicantDirectorate = this.DepartmentDropdown[i].departmentName; 
      }
    }


 
    
    
  }

  /*notification*/


/*  getAllDepartmentAdminsForNotifications() {

    this.userPofileService.getUserProfileById().subscribe((data: any) => {


      if (data.responseCode == 1) {


        for (let i = 0; i < data.dateSet.length; i++) {
          const tempDepartmentAdminList = {} as DepartmentAdminList;
          const current = data.dateSet[i];
          tempDepartmentAdminList.userId = current.userID;
          tempDepartmentAdminList.departmentAdmin = current.idDepartmentAdmin;
          tempDepartmentAdminList.fullName = current.fullname;




          this.DepartmentAdminList.push(tempDepartmentAdminList);

        }



        console.log("Got all departmentAdmins", data.dateSet);


      }

      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })

  }*/

  notiName: string;
  notiDescription: string;
  applicationID: any;

  onCreateNotification() {

/*    this.notiName = "A user has requested to join your department";
    this.notiDescription = this.applicationID + " was created ";
    
    this.notificationsService.addUpdateNotification(0, this.notiName, this.notiDescription, false, this.DepartmentAdminList[0].userId, this.CurrentUser.appUserId, null).subscribe((data: any) => {

      if (data.responseCode == 1) {
        alert(data.responseMessage);

      }
      else {
        alert(data.responseMessage);
      }

      console.log("response", data);
    }, error => {
      console.log("Error", error);
    })*/


  }

  onSelectToPopulateZoneDropDownView(event: any, viewlinkedZones: any) {
    this.ZoneDropdown.splice(0, this.ZoneDropdown.length);
    if (event.target.value > 0) {

      this.zoneService.getZonesBySubDepartmentsID(event.target.value).subscribe((data: any) => {

        if (data.responseCode == 1) {

          for (let i = 0; i < data.dateSet.length; i++) {
            const tempZoneList = {} as ZoneDropdown;
            const current = data.dateSet[i];
            tempZoneList.zoneID = current.zoneID;
            tempZoneList.zoneName = current.zoneName;

            this.ZoneDropdown.push(tempZoneList);

          }

        }
        else {
          alert(data.responseMessage);
        }
        console.log("reponse", data);


      }, error => {
        console.log("Error: ", error);
      })
    }
    else {
  
   

    }

  }

  onSelectToPopulateZone(event: any) {
    

    if (event.target.value > 0) {

      this.ZoneDropdown.splice(0, this.ZoneDropdown.length);
      this.zoneService.getZonesBySubDepartmentsID(event.target.value).subscribe((data: any) => {

        if (data.responseCode == 1) {

          for (let i = 0; i < data.dateSet.length; i++) {
            const tempZoneList = {} as ZoneDropdown;
            const current = data.dateSet[i];
            tempZoneList.zoneID = current.zoneID;
            tempZoneList.zoneName = current.zoneName;
            console.log("THISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONES",current);
            this.ZoneDropdown.push(tempZoneList);

          }


        }
        else {
          alert(data.responseMessage);
        }
        console.log("reponse", data);


      }, error => {
        console.log("Error: ", error);
      })

    }

    else {


    }

  }

  //onZoneUserLink() {
  //  ;
  //  let selectedDep = Number(this.internalApplicantDepartment);
  //  let selectedZone = Number(this.selectedZone);

  //  console.log("this.selection.selectedthis.selection.selectedthis.selection.selectedthis.selection.selectedthis.selection.selectedthis.selection.selectedthis.selection.selected", this.selection.selected);


  //  for (let i = 0; i < this.selection.selected.length; i++) {
  //    const current = this.selection.selected[i];

  //    this.zoneLinkService.getAllRecordsByUserIdIfDeleted(current.id).subscribe((data: any) => {

  //      if (data.responseCode == 1) {
  //        if (data.dateSet.length > 0) {
  //          this.zoneLinkService.addUpdateZoneLink(data.dateSet[0].zoneLinkID, selectedDep, selectedZone, this.subDepartmentID, current.id, null, this.CurrentUser.appUserId,).subscribe((data: any) => {
  //            ;
  //            if (data.responseCode == 1) {
  //              alert(data.responseMessage);
  //            }
  //            else {
  //              alert(data.responseMessage);
  //            }
  //            console.log("reponse", data);


  //          }, error => {
  //            console.log("Error: ", error);
  //          })
  //        }
  //        else {
  //          this.zoneLinkService.addUpdateZoneLink(0, selectedDep, selectedZone, this.subDepartmentID, current.id, null, this.CurrentUser.appUserId,).subscribe((data: any) => {

  //            if (data.responseCode == 1) {
  //              alert(data.responseMessage);


  //            }
  //            else {
  //              alert(data.responseMessage);
  //            }
  //            console.log("reponse", data);


  //          }, error => {
  //            alert(data.responseMessage);
  //            console.log("Error: ", error);
  //          })
  //        }



  //      }
  //      else {
  //        alert(data.responseMessage);
  //      }
  //      console.log("reponse", data);


  //    }, error => {
  //      alert("Error");
  //      console.log("Error: ", error);
  //    })
  //  }
  //}

  checkValue() {
    alert(this.extApplicantCompanyType);
  }



  /*getAllDepartmentsforZonesDropDown*/
  getAllSubDepartments() {
    this.SubDepartmentList.splice(0, this.SubDepartmentList.length);
    this.subDepartmentsService.getSubDepartmentsList().subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempSubDepartmentList = {} as SubDepartmentList;
          const current = data.dateSet[i];
          console.log("DepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListh", current);
          tempSubDepartmentList.subDepartmentID = current.subDepartmentID;
          tempSubDepartmentList.subDepartmentName = current.subDepartmentName;
          tempSubDepartmentList.departmentID = current.departmentID;
          tempSubDepartmentList.dateUpdated = current.dateUpdated;
          tempSubDepartmentList.dateCreated = current.dateCreated;
          this.SubDepartmentList.push(tempSubDepartmentList);

        }

        //this.DepartmentList = data.dateSet;


        console.log("DepartmentListh", this.SubDepartmentList);
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
