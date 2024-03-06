import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ContactDetailsService } from '../service/ContactDetails/contact-details.service';
import { SubDepartmentsService } from 'src/app/service/SubDepartments/sub-departments.service';
import { ZonesService } from 'src/app/service/Zones/zones.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

export interface ZoneDropdown {
  zoneID: number;
  zoneName: string;
}
export interface ZoneDropdownForName {
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

export interface SubDepartmentListForName {
  subDepartmentID: number;
  subDepartmentName: string;
  departmentID: number;
  dateUpdated: any;
  dateCreated: any;
}
export interface ContactDetailsList {
  ContactDetailID: number;
  FullName: string;
  CellNo: string;
  Email: Date;
}



@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})


export class ContactDetailsComponent implements OnInit {
  SubDepartmentList: SubDepartmentList[] = [];
  SubDepartmentListForName: SubDepartmentListForName[] = [];
  ZoneDropdown: ZoneDropdown[] = [];
  ZoneDropdownForName: ZoneDropdownForName[] = [];
  ContactDetailsList: ContactDetailsList[] = [];

  name = '';
  email= '';
  number = '';
  selectedZone: number;
  Department :number;
    selectedSubDepartmentName: string;
    selectedZoneName: string;
    selectedSubDep: any;


  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  length: any;

  constructor(private modalService: NgbModal, private contactDetails: ContactDetailsService, private zoneService: ZonesService, private subDepartmentsService: SubDepartmentsService, private cdr: ChangeDetectorRef) { }
  CurrentUser: any;
  stringifiedData: any;  
  ngOnInit() {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.getAllSubDepartments();
    this.getAllContactDetails();
  }
  ngAfterViewInit() {
    

    this.dataSource.data = this.ContactDetailsList;
    this.length = this.ContactDetailsList.length;

    if (this.paginator) {
      this.paginator.page.subscribe((pageEvent: PageEvent) => {
        this.pageSize = pageEvent.pageSize;
        // Reload data based on the new page size if needed
        this.getAllContactDetails();// Call the function to load the data with the updated page size

      });
    }

  }

  displayedColumns: string[] = ['FullName', 'Email', 'CellNumber','actions'];
  dataSource = new MatTableDataSource<ContactDetailsList>([]);

  openContactDetailsModal(ContactDetailsModal:any)
  {
    this.name = '';
    this.email = '';
    this.number = '';
    this.selectedZone = 0;
    this.Department = 0;
    this.modalService.open(ContactDetailsModal, { centered: true, size: 'xl' });
  }
  @ViewChild(MatTable) ContactDetailsTable: MatTable<ContactDetailsList> | undefined;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  getAllContactDetails() {

    this.ContactDetailsList = []; // Initialize or clear the array

    this.contactDetails.getAllContactDetials().subscribe((data: any) => {
      if (data.responseCode === 1) {
        // Successful response, update the data
        this.ContactDetailsList = data.dateSet.map((current: any) => {
          const tempContactDetailsList: ContactDetailsList = {
            ContactDetailID: current.contactDetailID,
            FullName: current.fullName,
            CellNo: current.cellNo,
            Email: current.email,
          };
          return tempContactDetailsList;
        });

        // Update the length and data source
        this.length = this.ContactDetailsList.length;
        this.dataSource.data = this.ContactDetailsList;
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        const endIndex = startIndex + this.paginator.pageSize;
        const displayedData = this.ContactDetailsList.slice(startIndex, endIndex);
        this.dataSource.data = displayedData;



        // Trigger change detection
        this.cdr.detectChanges();

        // Ensure that renderRows is called (optional)
        if (this.ContactDetailsTable) {
          this.ContactDetailsTable.renderRows();
        }

        console.log("ContactDetailsList", this.ContactDetailsList);
      } else {
        alert(data.responseMessage);
      }
      console.log("response", data);
    }, error => {
      console.error("Error:", error);
    });
  }



  selectedZone7 = 0;
  select = 0;
  addContactDetail() {



    this.subDepartmentsService.getSubDepartmentBySubDepartmentID(this.Department).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempSubDepartmentList = {} as SubDepartmentListForName;
          const current = data.dateSet[i];
          console.log("DepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListhDepartmentListh", current);
          tempSubDepartmentList.subDepartmentID = current.subDepartmentID;
          tempSubDepartmentList.subDepartmentName = current.subDepartmentName;
          tempSubDepartmentList.departmentID = current.departmentID;
          tempSubDepartmentList.dateUpdated = current.dateUpdated;
          tempSubDepartmentList.dateCreated = current.dateCreated;
          this.SubDepartmentListForName.push(tempSubDepartmentList);

        }

        this.zoneService.getZoneByZoneID(Number(this.selectedZone)).subscribe((data: any) => {

          if (data.responseCode == 1) {

            for (let i = 0; i < data.dateSet.length; i++) {
              const tempZoneList = {} as ZoneDropdownForName;
              const current = data.dateSet[i];
              tempZoneList.zoneID = current.zoneID;
              tempZoneList.zoneName = current.zoneName;
              console.log("THISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONES", current);
              this.ZoneDropdownForName.push(tempZoneList);

            }
            if (!this.isValidPhoneNumber(this.number)) {
              alert("Please enter a valid phone number.");
              return; // Stop further execution
            }
            if (!this.isValidEmail(this.email)) {
              alert("Please enter a valid email address.");
              return; // Stop further execution
            }

            this.contactDetails.addUpdateContactDetail(0, this.name, this.number, this.email, this.Department, this.SubDepartmentListForName[0].subDepartmentName, Number(this.selectedZone), this.ZoneDropdownForName[0].zoneName, this.CurrentUser.appUserId).subscribe((data: any) => {

              if (data.responseCode == 1) {
                alert(data.responseMessage);
                this.SubDepartmentListForName = [];
                this.ZoneDropdownForName = [];
                
                this.getAllContactDetails();

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
          else {
            alert(data.responseMessage);
          }
          console.log("reponse", data);


        }, error => {
          console.log("Error: ", error);
        })
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

  isValidPhoneNumber(phoneNumber: string): boolean {
    // You can implement your phone number validation logic here
    // For example, you can use regular expressions to validate the format
    const phoneNumberPattern = /^\d{10}$/; // Example: 1234567890

    return phoneNumberPattern.test(phoneNumber);
  }

  isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format pattern

    return emailPattern.test(email);
  }

  deleteContactDetail(index: any) {
    if (confirm("Are you sure you want to delete " + this.ContactDetailsList[index].FullName + "'s contact details")) {
      this.contactDetails.deleteContactDetail(this.ContactDetailsList[index].ContactDetailID).subscribe((data: any) => {


        if (data.responseCode == 1) {


          alert(data.responseMessage);

          this.getAllContactDetails();
        }
        else {
          alert(data.responseMessage);
        }
        console.log("reponse", data);

      }, error => {
        console.log("Error: ", error);
      })
    }
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

  onSelectToPopulateZone(event: any) {
    this.selectedSubDep = event.target.value;

    if (event.target.value > 0) {

      this.ZoneDropdown.splice(0, this.ZoneDropdown.length);
      this.zoneService.getZonesBySubDepartmentsID(event.target.value).subscribe((data: any) => {

        if (data.responseCode == 1) {

          for (let i = 0; i < data.dateSet.length; i++) {
            const tempZoneList = {} as ZoneDropdown;
            const current = data.dateSet[i];
            tempZoneList.zoneID = current.zoneID;
            tempZoneList.zoneName = current.zoneName;
            console.log("THISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONESTHISTHEZONES", current);
            this.ZoneDropdown.push(tempZoneList);
            const selectedSubDepartment = this.SubDepartmentList.find(subDept => subDept.subDepartmentID === this.Department);
            this.selectedSubDepartmentName = selectedSubDepartment ? selectedSubDepartment.subDepartmentName : '';

            // Find the selected zone
            const selectedZone = this.ZoneDropdown.find(zone => zone.zoneID === this.selectedZone);
            this.selectedZoneName = selectedZone ? selectedZone.zoneName : '';
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
  

}
