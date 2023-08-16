import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfessionalsLinksService } from 'src/app/service/ProfessionalsLinks/professionals-links.service';
import { ProfessionalService } from 'src/app/service/Professionals/professional.service';


export interface ProfessionalsList {

  professinalID: number;
  ProfessinalType: string;
  professionalRegNo: string;
  bpNumber: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  idNumber?: string;

}



@Component({
  selector: 'app-view-contractors-table',
  templateUrl: './view-contractors-table.component.html',
  styleUrls: ['./view-contractors-table.component.css']
})
export class ViewContractorsTableComponent implements OnInit {

  ProfessionalsList: ProfessionalsList[] = [];

  @Input() ApplicationID: any;
  professionalsType = "Contractor";

  displayedColumns: string[] = ['ProfessinalType', 'name', 'surname', 'phoneNumber', 'email'];
  dataSource = this.ProfessionalsList;

  @ViewChild(MatTable) ContractorsTable: MatTable<ProfessionalsList> | undefined;

  constructor(private professionalService: ProfessionalService) { }

  ngOnInit(): void {
    this.getAllProfessionalsLinkedToApplication();
  }

  getAllProfessionalsLinkedToApplication() {

    /*    this.ProfessionalsList.splice(0, this.ProfessionalsList.length);*/
    console.log("THIS IS THE APPLICATION ID", this.ApplicationID + "" + this.professionalsType);
    this.professionalService.getAllProfessionalsLinkByApplicationID(this.ApplicationID, this.professionalsType).subscribe((data: any) => {

      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempProfessionalsList = {} as ProfessionalsList;
          const current = data.dateSet[i];
          tempProfessionalsList.bpNumber = current.bP_Number;
          tempProfessionalsList.email = current.email;
          tempProfessionalsList.idNumber = current.idNumber;
          tempProfessionalsList.name = current.fullName.substring(0, current.fullName.indexOf(' '));;
          tempProfessionalsList.surname = current.fullName.substring(current.fullName.indexOf(' ') + 1);
          tempProfessionalsList.phoneNumber = current.phoneNumber;
          tempProfessionalsList.ProfessinalType = current.professinalType;
          tempProfessionalsList.professionalRegNo = current.professionalRegNo;
          tempProfessionalsList.professinalID = current.professinalID;
          this.ProfessionalsList.push(tempProfessionalsList);
        }
        this.ContractorsTable?.renderRows();
        console.log("GOT ALL CONTRACTORS FOR APPLICATION", this.ProfessionalsList);

      }
      else {
        alert(data.responseMessage);

      }
      console.log("response", data);


    }, error => {
      console.log("Error: ", error);
    })

  }

}
