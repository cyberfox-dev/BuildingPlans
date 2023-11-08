import { Component, OnInit, ChangeDetectorRef, Input, ViewChildren, QueryList, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ZoneLinkService } from 'src/app/service/ZoneLink/zone-link.service';
import { UserProfileService } from '../service/UserProfile/user-profile.service';

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
export interface UserList {
  UserID?: number;
  UserName?: string;
  zoneName?: string;
  departmentId?: number;
  departmentName?: string;
  subDepartmentId?: number;
  subDepartmentName?: string;
  assignedUserId?: string;
  userType?: string;
  isDepartmentAdmin?: boolean;
  isZoneAdmin?: boolean;
  isDefault?: boolean;
  accessGroupName?: string;
  accessGroupUserLinkId?: number;
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

  constructor(private zoneLinkService: ZoneLinkService, private cdRef: ChangeDetectorRef, private renderer: Renderer2, private userPofileService: UserProfileService) { }

  ngOnInit(): void {
    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);

    this.getUserProfileByUserID();

    this.getAllUserLinks(this.CurrentUserProfile[0].userID);

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

  next(): void {
    const currentIndex = this.items.indexOf(this.currentItem);
    const nextIndex = (currentIndex + 1) % this.items.length;
    this.currentItem = this.items[nextIndex];
  }
  getUserProfileByUserID() {
    this.userPofileService.getUserProfileById(this.CurrentUserProfile[0].userID).subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempUserList = {} as UserList;
          const current = data.dateSet[i];
          tempUserList.UserID = current.userID;
          tempUserList.UserName = current.fullName;
          tempUserList.zoneName = current.zoneName;
          tempUserList.subDepartmentName = current.subDepartmentName;
          tempUserList.isDepartmentAdmin = current.isDepartmentAdmin;
          tempUserList.isZoneAdmin = current.isZoneAdmin;
          tempUserList.isDefault = current.isDefault;
          this.UserList.push(tempUserList);
        }
        // Assigning received user profiles to 'items' to display in the template
        this.items = this.UserList.map(user => user.zoneName);

        const defaultUser = this.UserList.find(user => user.isDefault === true);
        if (defaultUser) {
          defaultUser.isActive = true;
        }
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
