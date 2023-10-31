import { Component, OnInit, ChangeDetectorRef, Input, ViewChildren, QueryList, ElementRef, Renderer2 } from '@angular/core';
import { ZoneLinkService } from 'src/app/service/ZoneLink/zone-link.service';

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



@Component({
  selector: 'app-config-acting-department',
  templateUrl: './config-acting-department.component.html',
  styleUrls: ['./config-acting-department.component.css']
})



export class ConfigActingDepartmentComponent implements OnInit {
  @Input() isInternal: any;

  ZoneLinks: ZoneLinks[] = []; // Adapt to your type
  SubDepartmentList: { subDepartmentId: number, subDepartmentName: string }[] = [];
  ZoneList: { zoneId: number, zoneName: string }[] = [];

  selectedDep: string | number = ''; // Depending on your ID type
  selectedZone: string | number = '';
    stringifiedDataUserProfile: any;
    CurrentUserProfile: any;
    allZoneLinks: any;
  @ViewChildren('carouselItem') carouselItems: QueryList<ElementRef>;

  constructor(private zoneLinkService: ZoneLinkService, private cdRef: ChangeDetectorRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);
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
    this.setupCarousel();
  }
  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
  currentItem: string = this.items[0];
  setupCarousel() {
    this.carouselItems.forEach(item => {
      this.renderer.listen(item.nativeElement, 'click', () => {
        this.carouselItems.forEach(element => {
          if (element !== item) {
            this.renderer.removeClass(element.nativeElement, 'active');
          }
        });
        this.renderer.addClass(item.nativeElement, 'active');
      });
    });
  }

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
}
