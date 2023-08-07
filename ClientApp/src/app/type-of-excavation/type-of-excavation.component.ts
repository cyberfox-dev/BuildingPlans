import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TypeOfExcavationService} from '../service/TypeOfExcavation/type-of-excavation.service';


export interface TypeOfExcavationList {
  typeOfExcavationID: number;
  typeOfExcavationName: string;
  typeOfExcavationDescription: string;
  dateCreated: any;
}

@Component({
  selector: 'app-type-of-excavation',
  templateUrl: './type-of-excavation.component.html',
  styleUrls: ['./type-of-excavation.component.css']
})
export class TypeOfExcavationComponent implements OnInit {

  TypeOfExcavationList: TypeOfExcavationList[]=[];


  public addTypeOfExcavation = this.formBuilder.group({
    newTOEName: ['', Validators.required]

  })

  public editTOEForm = this.formBuilder.group({
    editTOEName: ['', Validators.required]

  })


  CurrentUser: any;
  stringifiedData: any;
    CurrentTOEID: number;
    forEditIndex: any;
  editTOEID: any;


  openXl(content: any) {
    this.addTypeOfExcavation.controls["newTOEName"].setValue("");
    this.modalService.open(content, { size: 'lg' });
  }

  openEditTOEModal(editTOEmodal: any, index: any) {

    this.editTOEForm.controls["editTOEName"].setValue(this.TypeOfExcavationList[index].typeOfExcavationName);
    this.editTOEID = this.TypeOfExcavationList[index].typeOfExcavationID
    this.forEditIndex = index;

    console.log("FUCCCCCCCCCCCCCCCCCCKKKKKKKKKKKKKKKKKKKKK", this.forEditIndex, this.editTOEID);


    this.modalService.open(editTOEmodal, { size: 'lg' });


  }

  @ViewChild(MatTable) TypeOfExcavationTable: MatTable<TypeOfExcavationList> | undefined;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private typeOfExcavationService: TypeOfExcavationService ) { }

  ngOnInit() {
    this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData); this.stringifiedData = JSON.parse(JSON.stringify(localStorage.getItem('LoggedInUserInfo')));
    this.CurrentUser = JSON.parse(this.stringifiedData);
    this.getAllTOE();
  }

  displayedColumns: string[] = ['typeOfExcavationName', 'actions'];
  dataSource = this.TypeOfExcavationList;


  getAllTOE() {

    this.TypeOfExcavationList.splice(0, this.TypeOfExcavationList.length);

    this.typeOfExcavationService.getAllTypesOfExcavation().subscribe((data: any) => {

      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const tempTOEList = {} as TypeOfExcavationList;
          const current = data.dateSet[i];
          tempTOEList.typeOfExcavationID = current.typeOfExcavationID;
          tempTOEList.typeOfExcavationName = current.typeOfExcavationName;
          tempTOEList.typeOfExcavationDescription = current.typeOfExcavationDescription;
          tempTOEList.dateCreated = current.dateCreated;
          this.TypeOfExcavationList.push(tempTOEList);

        }
        this.TypeOfExcavationTable?.renderRows();
        console.log("Got ALL Types of excavation", this.TypeOfExcavationList);

        console.log("datadatadatadata", data);
      }
      else {
        alert(data.responseMessage);

      }
      console.log("response", data);


    }, error => {
      console.log("Error: ", error);
    })
  }

  getCurrentTOEID(index:any) {
    this.CurrentTOEID = this.TypeOfExcavationList[index].typeOfExcavationID;

  }

  onTOEDelete(index: any) {


    if (confirm("Are you sure to delete " + this.TypeOfExcavationList[index].typeOfExcavationName + "?"))
    {

      this.typeOfExcavationService.deleteTypesOfExcavationByID(this.TypeOfExcavationList[index].typeOfExcavationID).subscribe((data: any) => {
        this.TypeOfExcavationList.splice(0, this.TypeOfExcavationList.length);

        if (data.responseCode == 1) {

          alert(data.responseMessage);
          this.getAllTOE();
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

  onTOECreate() {

    let newTOEName = this.addTypeOfExcavation.controls["newTOEName"].value;

    this.typeOfExcavationService.addUpdateTypesOfExcavation(0, newTOEName,"", this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {

        alert(data.responseMessage);

        this.getAllTOE();

      }
      else {

        alert(data.responseMessage);
      }
      console.log("reponse", data);

    }, error => {
      console.log("Error: ", error);
    })

  }

  onTOEEdit() {
    let editTOEName = this.editTOEForm.controls["editTOEName"].value;

    this.typeOfExcavationService.addUpdateTypesOfExcavation(this.editTOEID, editTOEName, "", this.CurrentUser.appUserId).subscribe((data: any) => {

      if (data.responseCode == 1) {

        alert(data.responseMessage);

        this.getAllTOE();

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
