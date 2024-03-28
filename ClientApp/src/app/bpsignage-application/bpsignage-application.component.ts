import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bpsignage-application',
  templateUrl: './bpsignage-application.component.html',
  styleUrls: ['./bpsignage-application.component.css']
})
export class BPSignageApplicationComponent implements OnInit {

  constructor() { }
  typeOfApplicant: string;
  isSingleApplicant: boolean;

  ngOnInit(): void {
  }

  onSelectApplicant() {
    if (this.typeOfApplicant == "Single") {
      this.isSingleApplicant = true;
    }
    else if (this.typeOfApplicant == "Organisation") {
      this.isSingleApplicant = false;
    }
  }
}
