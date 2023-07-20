import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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

//const ELEMENT_DATA: PeriodicElement[] = [
//  { bp: 'fdf', name: 'FullName', surname: "", professionalRegNumber: 'H' },
//];



@Component({
  selector: 'app-select-engineer-table',
  templateUrl: './select-engineer-table.component.html',
  styleUrls: ['./select-engineer-table.component.css']
})
export class SelectEngineerTableComponent implements OnInit {
  //@Input()
  //data!: any[];
 
  @Input() PrfessionalType: any;
  @Input() UserID?: any | null;
  //Local storage userID
  CurrentUser: any;
  //Convert the local storage JSON data to an array object
  stringifiedData: any;
  ProfessialList: ProfessialList[] = [];
  @ViewChild(MatTable) ProfessialTable: MatTable<ProfessialList> | undefined;
  displayedColumns: string[] = ['ProfessinalType', 'name', 'surname', 'email', 'phoneNumber'];
  dataSourceProfessials = this.ProfessialList;
  clickedRowsProfessials = new Set<ProfessialList>();
  ProfessionalsDataForShared: ProfessialList[] = [];
  constructor(private professionalService: ProfessionalService, private shared: SharedService) { }

  ngOnInit(): void {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.getProfessionalsListByProfessionalType(this.PrfessionalType,this.UserID)


  }
  refreshTable() {
    this.ProfessialTable?.renderRows();
  }

  getProfessionalsListByProfessionalType(professionalType: string, appUserId?:string | null ) {
    /*    this.EngineerList.splice(0, this.EngineerList.length);*/

    
    if (appUserId == "") {
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
            this.shared.setEngineerData(this.ProfessialList);
          }
          else {
            this.shared.setContactorData(this.ProfessialList);
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
          this.shared.setEngineerData(this.ProfessialList);
          //this.shared.clientUserID = null;
        }
        else {
          this.shared.setContactorData(this.ProfessialList);
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

  }



  //RemovefromProList(row: any) {

    


  //  for (var i = 0; i < this.ProfessionalsDataForShared.length; i++) {
  //    if (this.clickedRowsProfessials.has(row)) {
  //      this.ProfessionalsDataForShared.splice(this.ProfessionalsDataForShared[i], 1);
  //    } else {

  //    }


  

  //  }
  //}



  SetSharedData(row:any) {
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
    this.clickedRowsProfessials.clear();

    this.ProfessionalsDataForShared.splice(0, this.ProfessionalsDataForShared.length);
    this.pushToShared();
  }

  onAddEngineer(bpNoApplicant: string, professionalRegNo: string, name: string, surname: string, applicantEmail: string, applicantTellNo: string, engineerIDNo: string, appUserId?:string | null ) {
    
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
    if (appUserId != "") {
      
      this.professionalService.addUpdateProfessional(0, "Engineer", name + " " + surname, bpNoApplicant, false, applicantEmail, applicantTellNo.toString(), professionalRegNo, appUserId, engineerIDNo, this.CurrentUser.appUserId, null).subscribe((data: any) => {

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
    } else {
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
    }

   


    this.ProfessialTable?.renderRows();


  }


  onAddContractor(bpNoContractor: string, professionalRegNo: string, name: string, surname: string, ContractorEmail: string, ContractorTell: string, contractorIDNo: string,  CIBRating: string, appUserId?: string | null ) {
    
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
    
    if (appUserId != "") {
      
      this.professionalService.addUpdateProfessional(0, "Contractor", name + " " + surname, bpNoContractor, false, ContractorEmail, ContractorTell.toString(), professionalRegNo, appUserId, contractorIDNo, this.CurrentUser.appUserId, CIBRating).subscribe((data: any) => {
        
        if (data.responseCode == 1) {
          alert(data.responseMessage);
          
          this.ProfessialList = [];


          // code for adding an engineer

          // Clear the ProfessialList array before calling getProfessionalsListByProfessionalType
          this.ProfessialList = [];

          // retrieve the updated data for professionals of type 'Engineer'
          this.professionalService.getProfessionalsListByProfessionalType(this.CurrentUser.appUserId, 'Contractor').subscribe((data: any) => {
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
    } else {
      this.professionalService.addUpdateProfessional(0, "Contractor", name + " " + surname, bpNoContractor, false, ContractorEmail, ContractorTell.toString(), professionalRegNo, appUserId, contractorIDNo, this.CurrentUser.appUserId, CIBRating).subscribe((data: any) => {

        if (data.responseCode == 1) {
          alert(data.responseMessage);

          this.ProfessialList = [];


          // code for adding an engineer

          // Clear the ProfessialList array before calling getProfessionalsListByProfessionalType
          this.ProfessialList = [];

          // retrieve the updated data for professionals of type 'Engineer'
          this.professionalService.getProfessionalsListByProfessionalType(this.CurrentUser.appUserId, 'Contractor').subscribe((data: any) => {
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
    }




    this.ProfessialTable?.renderRows();


  }
}
