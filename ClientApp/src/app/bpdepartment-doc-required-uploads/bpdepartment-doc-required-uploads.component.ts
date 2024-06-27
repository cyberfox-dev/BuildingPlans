import { Component, OnInit } from '@angular/core';
import { BPFunctionalAreasService } from '../service/BPFunctionalAreas/bpfunctional-areas.service';
import { FunctionalAreasList } from '../bpdepartment-config/bpdepartment-config.component';
import { FormBuilder, Validators } from '@angular/forms';

export interface BPFunctionalAreas {
  FunctionalAreaId: number;
  FAName: string;
  FAItemCode: string;
  DateCreated: any;
  DateUpdated: any;

}


@Component({
  selector: 'app-bpdepartment-doc-required-uploads',
  templateUrl: './bpdepartment-doc-required-uploads.component.html',
  styleUrls: ['./bpdepartment-doc-required-uploads.component.css']
})

export class BPDepartmentDocRequiredUploadsComponent implements OnInit {
  BPFunctionalAreas: BPFunctionalAreas[] = [];



  constructor(private bpFunctionalAreasService: BPFunctionalAreasService, private formBuilder: FormBuilder) { }
  public addManDoc = this.formBuilder.group({
    newManDocName: ['', Validators.required],
    functionalArea: ['', Validators.required],

  })
  ngOnInit(): void {
  }

  getAllFunctionalAreas(complaint: any) {
    this.bpFunctionalAreasService.getAllFunctionalAreas().subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempFunctionArea = {} as BPFunctionalAreas;

          tempFunctionArea.FunctionalAreaId = current.functionalAreaID;
          tempFunctionArea.FAName = current.faName;

          this.BPFunctionalAreas.push(tempFunctionArea);

        }

      }
      else {
        alert(data.responseMessage);
      }

    }, error => {
      console.log("Error: ", error);
    })
  }

/*  onSelectToPopulateDocumentsTable(event:any) {
    let viewSelectedSubDep = Number(this.viewZonesLinkedtoSub.controls["viewSelectedSubDep"].value);
    this.ZoneList.splice(0, this.ZoneList.length);
    this.zoneService.getZonesBySubDepartmentsID(viewSelectedSubDep).subscribe((data: any) => {

      if (data.responseCode == 1) {

        for (let i = 0; i < data.dateSet.length; i++) {
          const tempZoneList = {} as ZoneList;
          const current = data.dateSet[i];
          tempZoneList.zoneID = current.zoneID;
          tempZoneList.zoneName = current.zoneName;
          tempZoneList.subDepartmentID = current.subDepartmentID;
          tempZoneList.departmentID = current.departmentID;

          this.ZoneList.push(tempZoneList);


        }
        this.setTab(Tabs.View_linked_sub_departments);
        this.openViewZones(viewlinkedZones);
        this.showViewSubLinkedToZone = true;

      }
      else {
        alert(data.responseMessage);
      }
      console.log("reponse", data);


    }, error => {
      console.log("Error: ", error);
    })
  }*/

}
