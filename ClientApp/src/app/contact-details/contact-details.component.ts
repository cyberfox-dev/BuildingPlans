import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ContactDetailsService } from '../service/ContactDetails/contact-details.service';


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

  ContactDetailsList: ContactDetailsList[] = [];

  name = '';
  email= '';
  number = '';
  constructor(private modalService: NgbModal, private contactDetails: ContactDetailsService) { }

  ngOnInit(): void {
    this.getAllContactDetails();
  }

  displayedColumns: string[] = ['FullName', 'Email', 'CellNumber','actions'];
  dataSource = this.ContactDetailsList;

  openContactDetailsModal(ContactDetailsModal:any)
 {
    this.modalService.open(ContactDetailsModal, { centered: true, size: 'xl' });
  }
  @ViewChild(MatTable) ContactDetailsTable: MatTable<ContactDetailsList> | undefined;

  getAllContactDetails() {
    this.ContactDetailsList.splice(0, this.ContactDetailsList.length);
    this.contactDetails.getAllContactDetials().subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempContactDetailsList = {} as ContactDetailsList;
          const current = data.dateSet[i];
          tempContactDetailsList.ContactDetailID = current.contactDetailID;
          tempContactDetailsList.FullName = current.fullName;
          tempContactDetailsList.CellNo = current.cellNo;
          tempContactDetailsList.Email = current.email;
          
          this.ContactDetailsList.push(tempContactDetailsList);
          this.ContactDetailsTable?.renderRows();
        }

        console.log("ContactDetailsList", this.ContactDetailsList);
      }
      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })
  }

  addContactDetail() {

    if (!this.isValidPhoneNumber(this.number)) {
      alert("Please enter a valid phone number.");
      return; // Stop further execution
    }
    if (!this.isValidEmail(this.email)) {
      alert("Please enter a valid email address.");
      return; // Stop further execution
    }

    this.contactDetails.addUpdateContactDetail(0, this.name, this.number, this.email).subscribe((data: any) => {

      if (data.responseCode == 1) {
        alert(data.responseMessage);

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
  

}
