import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApplicationsService } from 'src/app/service/Applications/applications.service';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { FormBuilder, Validators } from '@angular/forms';
import { empty } from 'rxjs';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { InternalOptionComponent } from 'src/app/create-new-wayleave/internal-option/internal-option.component';
import { SharedService } from "../../shared/shared.service";
import { ProfessionalService } from 'src/app/service/Professionals/professional.service';
import { UserProfileService } from 'src/app/service/UserProfile/user-profile.service';
import { ProfessionalsLinksService } from 'src/app/service/ProfessionalsLinks/professionals-links.service';
import { MatPaginator } from '@angular/material/paginator';


export interface EngineerList {
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

export interface ContractorList {
  professinalID: number;
  ProfessinalType: string;
  professionalRegNo: string;
  bpNumber: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: number;
  idNumber?: string;
  CIBRating: string;
}

export interface PeriodicElement {

  fileType: string;

}

export interface FileDocument {

  fileName: string;
  file: any;

}


const ELEMENT_DATA: PeriodicElement[] = [
  { fileType: "Cover letter explaning the extent of the work" },
  { fileType: "Drawing showing the proposed route and detail regarding the trench cross section, number of pipes etc." },
  { fileType: "A programme with proposed timelines" },
  { fileType: "Proof and payment"},
];

export interface PeriodicElementTest {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATATEst: PeriodicElementTest[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];



@Component({
  selector: 'app-new-wayleave',
  templateUrl: './new-wayleave.component.html',
  styleUrls: ['./new-wayleave.component.css']
})
export class NewWayleaveComponent implements OnInit {
  @ViewChild("placesRef")
  placesRef: GooglePlaceDirective | undefined;
  options = {
    types: [],
    componentRestrictions: { country: 'ZA' }
  } as unknown as Options
  /*Client details*/
  clientName = '';
  clientSurname = '';
  clientEmail = '';
  clientCellNo = '';
  clientAddress = '';
  clientRefNo = '';
  clientBPNum = '';
  clientCompanyName = '';
  clientCompanyRegNo = '';
  clientCompanyType = '';
  clientIDNumber = '';


  internalName = '';
  internalSurname = '';
  internalDepartmentName = '';
  internalDepartmentID = '';
  internalBranch = '';
  internalCostCenterNumber = '';
  internalCostCenterOwner = '';

  /*External details*/
  externalBPNumber = '';
  externalName = '';
  externalSurname = '';
  externalAddress = '';
  externalEmail = '';

  /*project details*/
  typeOfApplication = '';
  notificationNumber = '';
  wbsNumber = '';
  physicalAddressOfProject = '';
  descriptionOfProject = '';
  natureOfWork = '';
  excavationType = '';
  expectedStartDate: Date = new Date();
  expectedEndType: Date = new Date();

  //public addApplicationProject = this.formBuilder.group({
  //  typeOfApplication: ['', Validators.required],
  //  notificationNumber: ['', Validators.required],
  //  wbsNumber: ['', Validators.required],
  //  physicalAddressOfProject: ['', Validators.required],
  //  descriptionOfProject: ['', Validators.required],
  //  natureOfWork: ['', Validators.required],
  //  excavationType: ['', Validators.required],
  //  expectedStartDate: ['', Validators.required],
  //  expectedEndType: ['', Validators.required]
  //})

  EngineerList: EngineerList[] = [];

  FileDocument: FileDocument[] = [];
  ContractorList: ContractorList[] = [];

  public external: boolean = true;
  public internal: boolean = false;
  public client: boolean = false;
  public map: boolean = true;

  clientSelected = false;
  option: any;
  isAllSelected: any;
  Engineer = "Engineer";
  Contractor = "Contractor";

  //public addApplication = this.formBuilder.group({
  //  newApplicationName: ['', Validators.required]

  //})

  //Local storage userID
  CurrentUser: any;
  //Convert the local storage JSON data to an array object
  stringifiedData: any;
  venstringifiedData: any;
  venContractorData: any;

  CurrentUserProfile: any;
  stringifiedDataUserProfile: any;
  //Columns for both the engineer and contractor lists
  displayedColumns: string[] = ['ProfessinalType', 'professionalRegNo', 'bpNumber', 'name', 'surname', 'email', 'phoneNumber', 'idNumber'];
  displayedColumnsContractors: string[] = ['ProfessinalType', 'professionalRegNo', 'bpNumber', 'name', 'surname', 'email', 'phoneNumber', 'idNumber'];
  dataSourceEngineers = this.EngineerList;
  dataSourceContractors = this.ContractorList;
  @ViewChild(MatTable) EngineerTable: MatTable<EngineerList> | undefined;
  @ViewChild(MatTable) ContractorTable: MatTable<ContractorList> | undefined;
  @ViewChild(MatPaginator)
    paginator!: MatPaginator;

  displayedColumnsCUpload: string[] = ['fileType','actions'];
  dataSource = ELEMENT_DATA;

  constructor(private modalService: NgbModal, private applicationsService: ApplicationsService, private professionalsLinksService: ProfessionalsLinksService, private shared: SharedService, private formBuilder: FormBuilder, private professionalService: ProfessionalService, private userPofileService: UserProfileService) { }

  ngOnInit(): void {


    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);

    this.typeOfApplication = "TOA"


    this.getProfessionalsListByProfessionalType("Engineer");
    this.getProfessionalsListByProfessionalType("Contractor");

    this.stringifiedDataUserProfile = JSON.parse(JSON.stringify(localStorage.getItem('userProfile')));
    this.CurrentUserProfile = JSON.parse(this.stringifiedDataUserProfile);

 

    console.log("this.CurrentUserProfile ", this.CurrentUserProfile);

    if (this.CurrentUserProfile[0].isInternal == false) {

      this.external = true;
      this.internal = false;
      this.client = false;

     

        this.userPofileService.getUserProfileById(this.CurrentUser.appUserId).subscribe((data: any) => {

          if (data.responseCode == 1) {

         
            console.log("data Ex", data.dateSet);

            const currentUserProfile = data.dateSet[0];
            const fullname = currentUserProfile.fullName;

            this.externalBPNumber = currentUserProfile.bP_Number;
            this.externalName = fullname.substring(0, fullname.indexOf(' '));
            this.externalSurname = fullname.substring(fullname.indexOf(' ') + 1);
            this.externalAddress = currentUserProfile.physcialAddress;
            this.externalEmail = currentUserProfile.email;
            

          }

          else {

            alert(data.responseMessage);
          }
         /* console.log("reponse", data);*/

        }, error => {
          console.log("Error: ", error);
        })







    }
    else {
      this.internal = true;
      this.external = false;
      this.client = false;
    }
   

  }


  public handleAddressChange(address: Address) {
    // Do some stuff
    this.clientAddress = address.formatted_address;

  }
  ngAfterViewInit() {
    //  this.getProfessionalsListByProfessionalType("Contractor");
    this.dataSourceTest.paginator = this.paginator;

  }

  clickedRowsEngineers = new Set<EngineerList>();
  clickedRowsContractors = new Set<ContractorList>();

  clearAllEngineers() {
    this.clickedRowsEngineers.clear();
  }

  clearAllContractors() {
    this.clickedRowsContractors.clear();
  }

  reciveOption($event: any) {
    this.option = $event
    if (this.option == "client") {
      this.client = true;
      this.external = false;
      this.internal = false;
      this.map = false;
    }
    else if (this.option == "internal") {
      this.internal = true;
      this.external = false;




      this.userPofileService.getUserProfileById(this.CurrentUser.appUserId).subscribe((data: any) => {

        if (data.responseCode == 1) {

         
          console.log("data", data.dateSet);

          const currentUserProfile = data.dateSet[0];
          const fullname = currentUserProfile.fullName;

          this.internalName = fullname.substring(0, fullname.indexOf(' '));
          this.internalSurname = fullname.substring(fullname.indexOf(' ') + 1);
          //directorate is the department name for displaying to the user and departmentID is what we we may need to send to the db
          this.internalDepartmentName = currentUserProfile.directorate;
          //the is where the departmentID is saved
          this.internalDepartmentID = currentUserProfile.departmentID;
          this.internalBranch = currentUserProfile.branch;
          this.internalCostCenterNumber = currentUserProfile.costCenterNumber;
          this.internalCostCenterOwner = currentUserProfile.costCenterOwner;

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


  getProfessionalsListByProfessionalType(professionalType: string) {
    /*    this.EngineerList.splice(0, this.EngineerList.length);*/

    this.professionalService.getProfessionalsListByProfessionalType(this.CurrentUser.appUserId, professionalType).subscribe((data: any) => {

      if (data.responseCode == 1) {
        console.log("data.dateSet get", data.dateSet);

        for (let i = 0; i < data.dateSet.length; i++) {
          //Check if Engineer or Contractor
          if (professionalType == "Engineer") {
            const tempProfessionalList = {} as EngineerList;
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
            this.EngineerList.push(tempProfessionalList);
            console.log("this.EngineerList", this.EngineerList);
          } else {
            const tempProfessionalList = {} as ContractorList;
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
            this.ContractorList.push(tempProfessionalList);
            console.log("this.ContractorList", this.ContractorList);
          }
          //this.EngineerTable?.renderRows();
          //this.ContractorTable?.renderRows();
        }
        this.ContractorTable?.renderRows();
        this.EngineerTable?.renderRows();

      }

      else {

        alert(data.responseMessage);
      }

      console.log("reponse", data);
      this.ContractorTable?.renderRows();
      this.EngineerTable?.renderRows();
    }, error => {
      console.log("Error: ", error);
    })
  }

  onWayleaveCreate() {

    const contractorData = this.shared.getContactorData();
    const engineerData = this.shared.getEngineerData();

    if (this.client) {
      this.applicationsService.addUpdateApplication(0, this.CurrentUser.appUserId, this.clientName + ' ' + this.clientSurname, this.clientEmail, this.clientCellNo, this.clientAddress, this.clientRefNo, '0', this.typeOfApplication, this.notificationNumber, this.wbsNumber, this.physicalAddressOfProject, this.descriptionOfProject, this.natureOfWork, this.excavationType, this.expectedStartDate, this.expectedEndType, '10 Stella Road, Newholme, PMB, KZN', this.CurrentUser.appUserId).subscribe((data: any) => {

        if (data.responseCode == 1) {
          alert(data.responseMessage);

        

          //Add professional link for contractors when application is successfully captured
          if (contractorData.length > 0) {
            for (var i = 0; i < contractorData.length; i++) {
              this.addProfessionalsLinks(data.dateSet.applicationID, contractorData[i].professinalID);
            };
          } else {
            alert("This Application have no contractors linked");
          }
          

          //Add professional link for engineers when application is successfully captured
          if (engineerData.length > 0) {
            for (var i = 0; i < engineerData.length; i++) {
              this.addProfessionalsLinks(data.dateSet.applicationID, engineerData[i].professinalID);
            };
          }
          else {
            alert("This Application have no engineers linked");
          }

        }
        else {
          alert(data.responseMessage);
        }
        console.log("responseAddapplication", data);
      }, error => {
        console.log("Error", error);
      })
    }
    else if (this.internal) {
      this.applicationsService.addUpdateApplication(0, this.CurrentUser.appUserId, this.internalName + ' ' + this.internalSurname, this.CurrentUser.email, null, null, null, null, this.typeOfApplication, this.notificationNumber, this.wbsNumber, this.physicalAddressOfProject, this.descriptionOfProject, this.natureOfWork, this.excavationType, this.expectedStartDate, this.expectedEndType, '10 Stella Road, Newholme, PMB, KZN', this.CurrentUser.appUserId).subscribe((data: any) => {

        if (data.responseCode == 1) {
          alert(data.responseMessage);

          //Add professional link for contractors when application is successfully captured
          if (contractorData.length > 0) {
            for (var i = 0; i < contractorData.length; i++) {
              this.addProfessionalsLinks(data.dateSet.applicationID, contractorData[i].professinalID);
            };
          } else {
            alert("This Application have no contractors linked");
          }


          //Add professional link for engineers when application is successfully captured
          if (engineerData.length > 0) {
            for (var i = 0; i < engineerData.length; i++) {
              this.addProfessionalsLinks(data.dateSet.applicationID, engineerData[i].professinalID);
            };
          }
          else {
            alert("This Application have no engineers linked");
          }

        }
        else {
          alert(data.responseMessage);
        }
        console.log("responseAddapplication", data);
      }, error => {
        console.log("Error", error);
      })
    }

    else {
      //External



      this.applicationsService.addUpdateApplication(0, this.CurrentUser.appUserId, this.externalName + ' ' + this.externalSurname, this.externalEmail, this.externalAddress , null, null, null, this.typeOfApplication, this.notificationNumber, this.wbsNumber, this.physicalAddressOfProject, this.descriptionOfProject, this.natureOfWork, this.excavationType, this.expectedStartDate, this.expectedEndType, '10 Stella Road, Newholme, PMB, KZN', this.CurrentUser.appUserId).subscribe((data: any) => {
        
        if (data.responseCode == 1) {
          alert(data.responseMessage);

          //Add professional link for contractors when application is successfully captured
          if (contractorData.length > 0) {
            for (var i = 0; i < contractorData.length; i++) {
              this.addProfessionalsLinks(data.dateSet.applicationID, contractorData[i].professinalID);
            };
          } else {
            alert("This Application have no contractors linked");
          }


          //Add professional link for engineers when application is successfully captured
          if (engineerData.length > 0) {
            for (var i = 0; i < engineerData.length; i++) {
              this.addProfessionalsLinks(data.dateSet.applicationID, engineerData[i].professinalID);
            };
          }
          else {
            alert("This Application have no engineers linked");
          }

        }
        else {
          alert(data.responseMessage);
        }
        console.log("responseAddapplication", data);
      }, error => {
        console.log("Error", error);
      })


    }



    }




  generateInvoice() {
    var pdf = 'http://197.242.150.226/Files/SampleInvoice.pdf';
    window.open(pdf, '_blank');





    //var ven = new Blob(['src/Files/SampleInvoice.pdf'], { type: 'application/pdf' });
    //const fileURL = URL.createObjectURL(ven);
    //window.open(fileURL, '_blank');
  }

  coverLetterUpload(event: any) {
    const file = event.target.files[0];
  }


  addProfessionalsLinks(applicationID: number, professionalID: number) {

    this.professionalsLinksService.addUpdateProfessionalsLink(0, applicationID, professionalID, this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {
        alert(data.responseMessage);
      }
      else {
        /*        alert(data.responseMessage);*/
      }
      console.log("response", data);
    }, error => {
      console.log("Error", error);
    })
  }



  
@ViewChild('fileInput')
    fileInput!: ElementRef;
  fileAttr = 'Choose File';


  uploadFileEvtCoverLetter(File: any) {

    const tempFileDocumentList = {} as FileDocument;

    tempFileDocumentList.fileName = File.target.files[0].name;
    tempFileDocumentList.file = File.target.files[0];


    this.FileDocument.push(tempFileDocumentList);
    console.log("this.FileDocument", this.FileDocument);


    // Check if one or more files were selected
    if (File.target.files.length > 0) {
      // Reset the fileAttr property
      this.fileAttr = '';
      // Iterate over the selected files
      Array.from(File.target.files).forEach((file: any) => {
        // Create a new File object
        let fileObject = new File([file], file.name);
        // Concatenate the file names and add a separator
        this.fileAttr += file.name + ' - ';
        // Create a new FileReader object
        let reader = new FileReader();
        // Set the onload event handler 
        reader.onload = (e: any) => {
          // Create a Byte[] array from the file contents
          let fileBytes = new Uint8Array(e.target.result);
          console.log("fileBytes", fileBytes);
        };
        // Start reading the file as an ArrayBuffer
        reader.readAsArrayBuffer(fileObject);

        console.log("fileObject", fileObject);
        console.log("reader.readAsArrayBuffer(fileObject)", reader.readAsArrayBuffer(fileObject));
        
      });
      // Reset the value of the file input element
      this.fileInput.nativeElement.value = '';
    } else {
      // If no file was selected, set fileAttr to the default value
      this.fileAttr = 'Choose File';
    }
  }
  displayedColumnsTest: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSourceTest = new MatTableDataSource(ELEMENT_DATATEst);

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceTest.filter = filterValue.trim().toLowerCase();
  }






  uploadFileEvt(File: any) {
    debugger;
    const tempFileDocumentList = {} as FileDocument;

    tempFileDocumentList.fileName = File.target.files[0].name;
    tempFileDocumentList.file = File.target.files[0];
    this.fileAttr += File.target.files[0].name + ' - ';

    this.FileDocument.push(tempFileDocumentList);
    console.log("this.FileDocument", this.FileDocument);


    //// Check if one or more files were selected
    //if (File.target.files.length > 0) {
    //  // Reset the fileAttr property
    //  this.fileAttr = '';
    //  // Iterate over the selected files
    //  Array.from(File.target.files).forEach((file: any) => {
    //    // Create a new File object
    //    let fileObject = new File([file], file.name);
    //    // Concatenate the file names and add a separator
    //    this.fileAttr += file.name + ' - ';
    //    // Create a new FileReader object
    //    let reader = new FileReader();
    //    // Set the onload event handler 
    //    reader.onload = (e: any) => {
    //      // Create a Byte[] array from the file contents
    //      let fileBytes = new Uint8Array(e.target.result);
        
    //    };
    //    // Start reading the file as an ArrayBuffer
    //    reader.readAsArrayBuffer(fileObject);

    //    console.log("fileObject", fileObject);
    //    console.log("reader.readAsArrayBuffer(fileObject)", reader.readAsArrayBuffer(fileObject));

    //  });
    //  // Reset the value of the file input element
    //  this.fileInput.nativeElement.value = '';
    //} else {
    //  // If no file was selected, set fileAttr to the default value
    //  this.fileAttr = 'Choose File';
    //}
  }

}
