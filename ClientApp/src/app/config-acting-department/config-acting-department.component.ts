import { Component, OnInit, ChangeDetectorRef, Input, ViewChildren, QueryList, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ZoneLinkService } from 'src/app/service/ZoneLink/zone-link.service';
import { UserProfileService } from '../service/UserProfile/user-profile.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { AccessGroupsService } from 'src/app/service/AccessGroups/access-groups.service';
import { delay } from 'rxjs/operators';
import { RefreshService } from 'src/app/shared/refresh.service';
import { Router, ActivatedRoute, Route, Routes } from "@angular/router";
export interface ZoneLinks {
  zoneLinkId?: number;
  zoneId?: number;
  zoneName?: string;
  departmentId?: number;
  subDepartmentId?: number;
  subDepartmentName?: string;
  assignedUserId?: string;
  userType?: string;
  isDepartmentAdmin?: boolean;
  isZoneAdmin?: boolean;
  isDefault?: boolean;
  accessGroupName?: string;
  accessGroupUserLinkId?: number;
}
interface Response {
  responseCode: number;
  responseMessage: string;
  dateSet: any;
}
export interface UserList {
  userProfileID?: number;
  UserID?: number;
  FullName?: string;
  Email?: string;
  PhoneNumber?: string;
  zoneName?: string;
  isInternal?: boolean;
  bp_Number?: string;
  CompanyName?: string;
  CompanyRegNo?: string;
  PhyscialAddress?: string;
  directorate?: string;
  vatNumber?: string;
  refNumber?: string;
  companyType?: string;
  alternateEmail?: string;
  alternateNumber?: string;
  branch?: string;
  costCenterNumber?: string;
  costCenterOwner?: string;
  copyOfID?: string;
  createdById?: string;
  IdNumber?: string;
  departmentId?: number;
  subDepartmentId?: number;
  zoneID?: number;
  subDepartmentName?: string;
  userType?: string;
  isDepartmentAdmin?: boolean;
  isZoneAdmin?: boolean;
  isDefault?: boolean;
  isActive: boolean;

}


@Component({
  selector: 'app-config-acting-department',
  templateUrl: './config-acting-department.component.html',
  styleUrls: ['./config-acting-department.component.css']
})



export class ConfigActingDepartmentComponent implements OnInit {
  @Input() isInternal: any;
  items: any[];
  ZoneLinks: ZoneLinks[] = []; // Adapt to your type
  UserList: UserList[] = []; // Adapt to your type
  SubDepartmentList: { subDepartmentId: number, subDepartmentName: string }[] = [];
  ZoneList: { zoneId: number, zoneName: string }[] = [];

  selectedDep: string | number = ''; // Depending on your ID type
  selectedZone: string | number = '';
    stringifiedDataUserProfile: any;
    CurrentUserProfile: any;
    allZoneLinks: any;
  @ViewChild('customCarousel') customCarousel!: ElementRef;

  constructor(private zoneLinkService: ZoneLinkService, private router: Router, private refreshService: RefreshService, private cdRef: ChangeDetectorRef, private renderer: Renderer2, private userPofileService: UserProfileService, private accessGroupsService: AccessGroupsService,) { }

  ngOnInit(): void {
    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);

    this.getUserProfileByUserID();

    this.getAllUserLinks(this.CurrentUserProfile[0].userID);
    this.UserList.forEach(user => {
      debugger;
      if (user.isDefault == false || user.isDefault == true) {
        debugger;
        user.isActive = false; // Deactivate other items
      }
    });

  }
  cancel(): void {
    // Implement your cancel logic here.
    console.log('Cancel button clicked');
  }

  continue(): void {
    // Implement your continue logic here.
    console.log('Continue button clicked');
  }

  getAllUserLinks(userId: string): void {
    this.zoneLinkService.getAllUserLinks(userId).subscribe(
      (data: any) => {
        debugger;
        if (data?.responseCode === 1 && data?.dateSet) {
          this.allZoneLinks = data.dateSet;
          this.SubDepartmentList = data.dateSet.map((link: ZoneLinks) => ({
            subDepartmentId: link.subDepartmentId!,
            subDepartmentName: link.subDepartmentName!
          }));
          this.updateZoneList();
        } else {
          console.error("Invalid data structure received: ", data);
        }
      },
      error => console.error("Error: ", error)
    );
  }

  updateZoneList(): void {
    debugger;
    if (this.selectedDep) {
      debugger;
      this.ZoneList = this.allZoneLinks
        .filter(link => link.subDepartmentId === this.selectedDep)
        .map(link => ({
      
          zoneId: link.zoneId!,
          zoneName: link.zoneName!
        }));
      this.cdRef.detectChanges();
    } else {
      this.ZoneList = [];
    }
  }

  setLocalStorage(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  ngAfterViewInit() {

  }
/*  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
  currentItem: string = this.items[0];*/
  toggleActive(item: UserList): void {
    debugger;
    this.UserList.forEach(user => {
      if (user !== item) {
        user.isActive = false; // Deactivate other items
      }
    });
    item.isActive = !item.isActive; // Toggle the active state
  }
   currentItem: any;
  prev(): void {
    const currentIndex = this.items.indexOf(this.currentItem);
    const prevIndex = (currentIndex - 1 + this.items.length) % this.items.length;
    this.currentItem = this.items[prevIndex];
  }
  isLoading = false;
  activateProfile(item: any) {

    const index = this.UserList.indexOf(item);
    debugger;
    if (confirm("Are you sure you want to change to this profile?")) {
      this.isLoading = true;
      this.userPofileService.updateActingDepartment(this.UserList[index].userProfileID).pipe(
        switchMap((data: Response) => {
          if (data.responseCode === 1) {
            debugger;

            return this.getUserProfile();
          }
          return throwError(data.responseMessage);
        }),
        tap((profileData: Response) => {
          debugger;
          const userId = profileData.dateSet[0].userProfileID;
          this.setLocalStorage("userProfile", profileData.dateSet);
          this.getAllRolesForUserForAllAG(userId);

        }),
        catchError(error => {
          console.error("Failed in the pipeline", error);
          // Ensure to handle errors appropriately or re-throw them
          return throwError(error);
        }),
        delay(5000) // consider reducing the delay if it’s not necessary
      ).subscribe(
        (response) => {
          console.log('Response:', response);

          window.location.reload();
          this.isLoading = false;
          // Handle the response from the service call
        },
        (error) => {
          console.error('Error:', error);
          // Handle errors if any
        }
      );
    }
  }


  next(): void {
    const currentIndex = this.items.indexOf(this.currentItem);
    const nextIndex = (currentIndex + 1) % this.items.length;
    this.currentItem = this.items[nextIndex];
  }

  item:any
  getUserProfileByUserID() {


    this.userPofileService.getUserProfileById(this.CurrentUserProfile[0].userID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempUserList = {} as UserList;
          const current = data.dateSet[i];

          tempUserList.userProfileID = current.userProfileID,
          tempUserList.UserID = current.userID;
          tempUserList.FullName = current.fullName;
          tempUserList.zoneName = current.zoneName;
          tempUserList.subDepartmentName = current.subDepartmentName;
          tempUserList.isDepartmentAdmin = current.isDepartmentAdmin;
          tempUserList.isZoneAdmin = current.isZoneAdmin;
          tempUserList.isDefault = current.isDefault;
          tempUserList.alternateEmail = current.alternateEmail;
          tempUserList.alternateNumber = current.alternateNumber;
          tempUserList.bp_Number = current.bp_Number;
          tempUserList.CompanyName = current.companyName;
          tempUserList.CompanyRegNo = current.companyRegNo;
          tempUserList.PhyscialAddress = current.physcialAddress;
          tempUserList.directorate = current.directorate;
          tempUserList.departmentId = current.departmentID;
          tempUserList.subDepartmentId = current.subDepartmentID;
          tempUserList.branch = current.branch;
          tempUserList.costCenterNumber = current.costCenterNumber;
          tempUserList.costCenterOwner = current.costCenterOwner;
          tempUserList.copyOfID = current.copyOfID;
          tempUserList.createdById = current.createdById;
          tempUserList.isActive = current.isActive;
          tempUserList.IdNumber = current.IdNumber;
          tempUserList.zoneID = current.zoneID;
          tempUserList.vatNumber = current.vatNumber;
          tempUserList.refNumber = current.refNumber;
          tempUserList.companyType = current.companyType;


          this.UserList.push(tempUserList);
        }
        // Assigning received user profiles to 'items' to display in the template
        this.items = this.UserList.map(user => user.zoneName);
        console.log(this.UserList);
        const defaultUser = this.UserList.find(user => user.isDefault == true);
        if (defaultUser) {
          defaultUser.isActive = true;
        }
        debugger;


      } else {
        alert(data.responseMessage);
      }
      console.log("response", data);
    }, error => {
      console.log("Error: ", error);
    });
  }
  isBlue = false;

  toggleBodyClass() {
    this.isBlue = !this.isBlue;
  }

  getUserProfile(): Observable<any> {
    debugger;
    const currentUser = JSON.parse(localStorage.getItem("LoggedInUserInfo"));


    return this.userPofileService.getDefaltUserProfile(currentUser.appUserId);
  }



  getAllRolesForUserForAllAG(userId: number): void {
    debugger;
    this.accessGroupsService.getAllRolesForUserForAllAG(userId).subscribe(
      (data: any) => {
        debugger;
        if (data?.responseCode === 1 && data?.dateSet) {
          this.setLocalStorage("AllCurrentUserRoles", data.dateSet);
        } else {
          debugger;
          console.error("Invalid data structure received: ", data);
        }
      },
      error => console.error("Error: ", error)
    );
  }
 
}
/*UserID ?: number;
UserName ?: string;
zoneName ?: string;
departmentId ?: number;
departmentName ?: string;
subDepartmentId ?: number;
subDepartmentName ?: string;
assignedUserId ?: string;
userType ?: string;
isDepartmentAdmin ?: boolean;
isZoneAdmin ?: boolean;
isDefault ?: boolean;
accessGroupName ?: string;
accessGroupUserLinkId ?: number;*/
