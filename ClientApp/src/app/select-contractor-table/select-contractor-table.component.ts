import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SharedService } from "src/app/shared/shared.service";
import { ProfessionalService } from 'src/app/service/Professionals/professional.service';

export interface ProfessialList {
  professinalID: number;
  ProfessinalType: string;
  professionalRegNo: string;
  bpNumber: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  idNumber?: string;
  CIBRating?: string;
}


@Component({
  selector: 'app-select-contractor-table',
  templateUrl: './select-contractor-table.component.html',
  styleUrls: ['./select-contractor-table.component.css']
})
export class SelectContractorTableComponent implements OnInit {


  @Input() PrfessionalType: any;
  @Output() change: EventEmitter<any> = new EventEmitter();
  //Local storage userID
  CurrentUser: any;
  //Convert the local storage JSON data to an array object
  stringifiedData: any;
  @Input() ProfessialList: ProfessialList[] = [];
  @ViewChild(MatTable) ProfessialTable: MatTable<ProfessialList> | undefined;
  displayedColumns: string[] = ['ProfessinalType', 'name', 'surname', 'email', 'phoneNumber'];
  dataSourceProfessials = this.ProfessialList;
  clickedRowsProfessials = new Set<ProfessialList>();
  ProfessionalsDataForShared: ProfessialList[] = [];
  isSelectNoneButtonSelected: boolean = false;
  isProfessionalSelected: boolean = false;

  constructor(private professionalService: ProfessionalService, private shared: SharedService) { }

  ngOnInit(): void {

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.getProfessionalsListByProfessionalType(this.PrfessionalType)
    this.getGoNext();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ProfessialList']) {
      this.dataSourceProfessials = this.ProfessialList;  // assuming dataSource is your MatTableDataSource
      this.ProfessialTable.renderRows();
    }
  }

  refreshTable() {
    this.ProfessialTable?.renderRows();
  }

  getProfessionalsListByProfessionalType(professionalType: string, appUserId?: string | null) {
    /*    this.EngineerList.splice(0, this.EngineerList.length);*/


    if (appUserId == null) {
      
      this.professionalService.getProfessionalsListByProfessionalType(this.CurrentUser.appUserId, professionalType).subscribe((data: any) => {
        
        if (data.responseCode == 1) {
          console.log("data.dateSet get", data.dateSet);
          
          for (let i = 0; i < data.dateSet.length; i++) {
            //Check if Engineer or Contractor
            if (professionalType == "Engineer") {
              const tempProfessionalList = {} as ProfessialList;
              const current = data.dateSet[i];
              tempProfessionalList.bpNumber = current.bP_Number;
              tempProfessionalList.email = current.email;
              tempProfessionalList.idNumber = current.idNumber;
              tempProfessionalList.name = current.fullName.substring(0, current.fullName.indexOf(' '));
              tempProfessionalList.surname = current.fullName.substring(current.fullName.indexOf(' ') + 1);
              tempProfessionalList.phoneNumber = current.phoneNumber;
              tempProfessionalList.ProfessinalType = current.professinalType;
              tempProfessionalList.professionalRegNo = current.professionalRegNo;
              tempProfessionalList.professinalID = current.professinalID;
              this.ProfessialList.push(tempProfessionalList);
              console.log("this.ProfessialList", this.ProfessialList);
            } else {
              
              const tempProfessionalList = {} as ProfessialList;
              const current = data.dateSet[i];
              tempProfessionalList.bpNumber = current.bP_Number;
              tempProfessionalList.email = current.email;
              tempProfessionalList.idNumber = current.idNumber;
              tempProfessionalList.name = current.fullName.substring(0, current.fullName.indexOf(' '));
              tempProfessionalList.surname = current.fullName.substring(current.fullName.indexOf(' ') + 1);
              tempProfessionalList.phoneNumber = current.phoneNumber;
              tempProfessionalList.ProfessinalType = current.professinalType;
              tempProfessionalList.professionalRegNo = current.professionalRegNo;
              tempProfessionalList.professinalID = current.professinalID;
              tempProfessionalList.CIBRating = current.cibRating;
              this.ProfessialList.push(tempProfessionalList);

            }

          }

          this.ProfessialTable?.renderRows();
          if (professionalType == "Engineer") {
            this.ProfessialTable?.renderRows();
 
            this.shared.setEngineerData(this.ProfessialList);
          }
          else {
            this.ProfessialTable?.renderRows();

            this.shared.setContactorData(this.ProfessialList);
          }
        }

        else {

          alert(data.responseMessage);
        }
        this.ProfessialTable?.renderRows();
        console.log("reponse", data);


      }, error => {
        console.log("Error: ", error);
      })
    }
    else {
      
      this.professionalService.getProfessionalsListByProfessionalType(appUserId, professionalType).subscribe((data: any) => {
        
        if (data.responseCode == 1) {
          console.log("data.dateSet get", data.dateSet);

          for (let i = 0; i < data.dateSet.length; i++) {
            //Check if Engineer or Contractor
            if (professionalType == "Engineer") {
              const tempProfessionalList = {} as ProfessialList;
              const current = data.dateSet[i];
              tempProfessionalList.bpNumber = current.bP_Number;
              tempProfessionalList.email = current.email;
              tempProfessionalList.idNumber = current.idNumber;
              tempProfessionalList.name = current.fullName.substring(0, current.fullName.indexOf(' '));
              tempProfessionalList.surname = current.fullName.substring(current.fullName.indexOf(' ') + 1);
              tempProfessionalList.phoneNumber = current.phoneNumber;
              tempProfessionalList.ProfessinalType = current.professinalType;
              tempProfessionalList.professionalRegNo = current.professionalRegNo;
              tempProfessionalList.professinalID = current.professinalID;
              this.ProfessialList.push(tempProfessionalList);
              console.log("this.ProfessialList", this.ProfessialList);
            } else {
              
              const tempProfessionalList = {} as ProfessialList;
              const current = data.dateSet[i];
              tempProfessionalList.bpNumber = current.bP_Number;
              tempProfessionalList.email = current.email;
              tempProfessionalList.idNumber = current.idNumber;
              tempProfessionalList.name = current.fullName.substring(0, current.fullName.indexOf(' '));
              tempProfessionalList.surname = current.fullName.substring(current.fullName.indexOf(' ') + 1);
              tempProfessionalList.phoneNumber = current.phoneNumber;
              tempProfessionalList.ProfessinalType = current.professinalType;
              tempProfessionalList.professionalRegNo = current.professionalRegNo;
              tempProfessionalList.professinalID = current.professinalID;
              tempProfessionalList.CIBRating = current.cibRating;
              this.ProfessialList.push(tempProfessionalList);

            }

          }

          this.ProfessialTable?.renderRows();
          if (professionalType == "Engineer") {
            this.ProfessialTable?.renderRows();
            this.shared.setEngineerData(this.ProfessialList);
          }
          else {
            this.ProfessialTable?.renderRows();
            this.shared.setContactorData(this.ProfessialList);
          }
        }

        else {

          alert(data.responseMessage);
        }
        this.ProfessialTable?.renderRows();
        console.log("reponse", data);


      }, error => {
        console.log("Error: ", error);
      })
    }

  }



  //RemovefromProList(row: any) {




  //  for (var i = 0; i < this.ProfessionalsDataForShared.length; i++) {
  //    if (this.clickedRowsProfessials.has(row)) {
  //      this.ProfessionalsDataForShared.splice(this.ProfessionalsDataForShared[i], 1);
  //    } else {

  //    }




  //  }
  //}



  SetSharedData(row: any) {
    debugger;

    this.isSelectNoneButtonSelected = false;
    this.isProfessionalSelected = true;

    const tempData = {} as ProfessialList;
    const currentRow = row;


    tempData.bpNumber = currentRow.bpNumber;
    tempData.CIBRating = currentRow.CIBRating;
    tempData.email = currentRow.email;
    tempData.idNumber = currentRow.idNumber;
    tempData.name = currentRow.name;
    tempData.phoneNumber = currentRow.phoneNumber;
    tempData.professinalID = currentRow.professinalID;
    tempData.ProfessinalType = currentRow.ProfessinalType;
    tempData.professionalRegNo = currentRow.professionalRegNo;
    tempData.surname = currentRow.surname;

    this.ProfessionalsDataForShared.push(tempData);
    this.pushToShared();

    this.getGoNext();
  }

  pushToShared() {
    if (this.PrfessionalType == "Engineer") {

      this.shared.setEngineerData(this.ProfessionalsDataForShared);
    }
    else {
      this.shared.setContactorData(this.ProfessionalsDataForShared);
    }
  }

  clearAllEngineers() {
    debugger;
    this.clickedRowsProfessials.clear();

    this.ProfessionalsDataForShared.splice(0, this.ProfessionalsDataForShared.length);
    this.pushToShared();

    this.isSelectNoneButtonSelected = true;
    this.isProfessionalSelected = false;

    this.getGoNext();
  }

  onAddEngineer(bpNoApplicant: string, professionalRegNo: string, name: string, surname: string, applicantEmail: string, applicantTellNo: string, engineerIDNo: string) {
    ;
    //const newEnineer = {} as EngineerList;
    //newEnineer.ProfessinalType = "Engineer";:
    //newEnineer.bpNumber = this.bpNoApplicant;
    //newEnineer.professionalRegNo = this.professionalRegNo;
    //newEnineer.name = this.name;
    //newEnineer.surname = this.surname;
    //newEnineer.email = this.applicantEmail;
    //newEnineer.phoneNumber = this.applicantTellNo;

    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.professionalService.addUpdateProfessional(0, "Engineer", name + " " + surname, bpNoApplicant, false, applicantEmail, applicantTellNo.toString(), professionalRegNo, this.CurrentUser.appUserId, engineerIDNo, this.CurrentUser.appUserId, null).subscribe((data: any) => {

      if (data.responseCode == 1) {
        alert(data.responseMessage);

        this.ProfessialList = [];


        // code for adding an engineer

        // Clear the ProfessialList array before calling getProfessionalsListByProfessionalType
        this.ProfessialList = [];

        // retrieve the updated data for professionals of type 'Engineer'
        this.professionalService.getProfessionalsListByProfessionalType(this.CurrentUser.appUserId, 'Engineer').subscribe((data: any) => {
          if (data.responseCode == 1) {
            console.log("data.dateSet get", data.dateSet);
            for (let i = 0; i < data.dateSet.length; i++) {
              //Check if Engineer or Contractor
              // if (professionalType == "Engineer") {
              const tempProfessionalList = {} as ProfessialList;
              const current = data.dateSet[i];
              tempProfessionalList.bpNumber = current.bP_Number;
              tempProfessionalList.email = current.email;
              tempProfessionalList.idNumber = current.idNumber;
              tempProfessionalList.name = current.fullName.substring(0, current.fullName.indexOf(' '));
              tempProfessionalList.surname = current.fullName.substring(current.fullName.indexOf(' ') + 1);
              tempProfessionalList.phoneNumber = current.phoneNumber;
              tempProfessionalList.ProfessinalType = current.professinalType;
              tempProfessionalList.professionalRegNo = current.professionalRegNo;
              tempProfessionalList.professinalID = current.professinalID;
              this.ProfessialList.push(tempProfessionalList);
              //   }
            }
          }
        });
        // Re-render the table rows
        this.ProfessialTable?.renderRows();
      }






      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })


    this.ProfessialTable?.renderRows();


  }

  getGoNext() {
    debugger;
    if ((this.isSelectNoneButtonSelected == false && this.isProfessionalSelected == true) || (this.isSelectNoneButtonSelected == true && this.isProfessionalSelected == false)) {
      this.shared.setCanGoNextAfterContractorSelection(true);
      this.shared.getCanGoNextE();
      this.shared.getCanGoNextC();
    }
    else {
      this.shared.setCanGoNextAfterContractorSelection(false);
      this.shared.getCanGoNextE();
      this.shared.getCanGoNextC();
    }
    console.log("Appropriate engineer selections?", this.shared.isSelectedEngineer);
    console.log("Appropriate contractor selections?", this.shared.isSelectedContractor);
  }
}
