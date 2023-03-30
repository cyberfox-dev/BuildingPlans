import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'

var img = new Image();
img.src = 'assets/cctlogoblack.png';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})


export class InvoiceComponent implements OnInit {




  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    const imagePath = 'assets/cctlogoblack.png';

    this.logoUrl = img.src;
    
  }
  logoUrl:any;
 
currentDate = new Date();
datePipe = new DatePipe('en-ZA');
formattedDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');

  public downloadInvoice() {
    console.log("downloadInvoice");
    const doc = new jsPDF();

    autoTable(doc, {
      body: [
        [
          {
            content: this.logoUrl,

            styles: {
              halign: 'left',
              fontSize: 20,
              textColor: '#ffffff',
            }
          },
          {
            content: 'Wayleave Application Fee Invoice',
            styles: {
              halign: 'right',
              fontSize: 15,
              textColor: '#ffffff',
            }
          }
        ],
      ],

      theme: 'plain',
      styles: {
        fillColor: '#3366ff',
      }
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Wayleave Ref No.: '
              + '\nDate: ' + this.formattedDate
              + '\nInvoice Number: ' + "12345678",

            styles: {
              halign: 'right',
            }
          }
        ],
      ],

      theme: 'plain',
    });

    const startY = 100; // set the starting Y position for the table

    autoTable(doc, {
      head: [['Service Item Code', 'Description', 'Rate', 'Quantity', 'Amount']],
      body: [
        ['001', 'Consultation Services', '$100.00', '2', '$200.00'],
        ['002', 'Site Survey', '$200.00', '1', '$200.00'],
        ['003', 'Permitting Services', '$300.00', '3', '$900.00'],
      ],

      theme: 'plain',
      startY: startY,
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Wayleave Ref No.: '
              + '\nDate: ' + this.currentDate
              + '\nInvoice Number: ' + "12345678",

            styles: {
              halign: 'left',

            }
          }
        ],
      ],

      theme: 'plain',
      startY: startY + 30, // add 30 units of Y position to create space between the tables
    });

    return doc.save("invoice");

  }



}



