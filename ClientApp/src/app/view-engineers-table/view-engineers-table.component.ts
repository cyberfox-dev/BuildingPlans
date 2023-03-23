import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfessionalsLinksService } from 'src/app/service/ProfessionalsLinks/professionals-links.service';
import { ProfessionalService } from 'src/app/service/Professionals/professional.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;

  cell: number;
  email: string;

}

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
  selector: 'app-view-engineers-table',
  templateUrl: './view-engineers-table.component.html',
  styleUrls: ['./view-engineers-table.component.css']
})


export class ViewEngineersTableComponent implements OnInit {
  ProfessionalsList: ProfessionalsList[] = [];

  @Input() ApplicationID: any;
  professionalsType = "Engineer";

  displayedColumns: string[] = ['ProfessinalType', 'bpNumber', 'name', 'surname', 'professionalRegNo', 'phoneNumber', 'email', 'actions'];
  dataSource = this.ProfessionalsList;


  @ViewChild(MatTable) EngineersTable: MatTable<ProfessionalsList> | undefined;
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
        this.EngineersTable?.renderRows();
        console.log("GOT ALL ENGINEERS FOR APPLICATION", this.ProfessionalsList);

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
