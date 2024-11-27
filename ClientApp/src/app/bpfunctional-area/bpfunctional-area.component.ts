import { Component, OnInit } from '@angular/core';
import { BPFunctionalAreasService } from '../service/BPFunctionalAreas/bpfunctional-areas.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BpAlertModalComponent } from '../bp-alert-modal/bp-alert-modal.component';
import { MatDialog } from '@angular/material/dialog';
export interface FunctionalAreasList {
  FunctionalAreaId: number;
  FAName: string;
  FAItemCode: string;
  DateCreated: any;
  DateUpdated: any;

}

@Component({
  selector: 'app-bpfunctional-area',
  templateUrl: './bpfunctional-area.component.html',
  styleUrls: ['./bpfunctional-area.component.css']
})
export class BPFunctionalAreaComponent implements OnInit {
  FunctionalAreasList: FunctionalAreasList[] = [];

  public addFunctionalArea = this.formBuilder.group({
    newFAName: ['', Validators.required]

  })
  constructor(private formBuilder: FormBuilder, private modalService: NgbModal, private bpFunctionalAreasService: BPFunctionalAreasService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.GetAllFunctionalAreas();
  }
  openXl(content: any) {
    this.modalService.open(content, { backdrop: 'static', size: 'lg' });
  }
  GetAllFunctionalAreas() {
    debugger;
    this.bpFunctionalAreasService.getAllFunctionalAreas().subscribe((data: any) => {
      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempFunctionalAreasList = {} as FunctionalAreasList;
          const current = data.dateSet[i];

          tempFunctionalAreasList.FunctionalAreaId = current.functionalAreaID;
          tempFunctionalAreasList.FAName = current.faName;
          tempFunctionalAreasList.FAItemCode = current.faItemCode;
          tempFunctionalAreasList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
          tempFunctionalAreasList.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));

          this.FunctionalAreasList.push(tempFunctionalAreasList);
          console.log("THIS IS THE FUNCTIONAL AREA", this.FunctionalAreasList);
        }
      }
      else {

        //alert(data.responseMessage);
        const dialogRef = this.dialog.open(BpAlertModalComponent, {
          data: {
            message: data.responseMessage
          }
        });
      }
      console.log("reponse", data);
    }, error => {
      console.log("Error: ", error);
    })
  }

  displayedColumns: string[] = ['functionalArea', 'actions'];
  dataSource = this.FunctionalAreasList;
/*
  onDepartmentCreate() {
    let newFAName = this.addFunctionalArea.controls["newFAName"].value;

    this.bpFunctionalAreasService.(0, newFAName).subscribe((data: any) => {

      if (data.responseCode == 1) {

        //alert(data.responseMessage);
        const dialogRef = this.dialog.open(BpAlertModalComponent, {
          data: {
            message: data.responseMessage
          }
        });
        console.log("This shpuld pop up if you were able to successfully add a department", data.responseMessage);
       
        this.addFunctionalArea.get('newFAName').setValue('');
      }
      else {

        //alert(data.responseMessage);
        const dialogRef = this.dialog.open(BpAlertModalComponent, {
          data: {
            message: data.responseMessage
          }
        });
      }
      console.log("reponse", data);
    }, error => {
      console.log("Error: ", error);
    })
  }*/
}
