import { Component, OnInit,ViewChild, Input} from '@angular/core';
import { BPApplicationChecklistService } from '../service/BPApplicationChecklists/bpapplication-checklist.service';
import { MatTable } from '@angular/material/table';
import { SharedService } from 'src/app/shared/shared.service';
export interface Checklist {
  ChecklistItemID: number;
  ApplicationID: number;
  ChecklistItem: string;
  FunctionalArea: string;
  StageName: string;
  isChecked: boolean;
  CheckedBy: string;
  DateCreated: any;
  DateUpdated: any;
}
@Component({
  selector: 'app-bpapplication-checklist',
  templateUrl: './bpapplication-checklist.component.html',
  styleUrls: ['./bpapplication-checklist.component.css']
})
export class BPApplicationChecklistComponent implements OnInit {

  @Input() ApplicationID: number;
  @Input() FunctionalArea: string;
  @Input() isExpand: boolean;
  @Input() StageName: string;

  @ViewChild(MatTable) ChecklistTable: MatTable<Checklist> | undefined;
  
  Checklist: Checklist[] = [];
  dataSource = this.Checklist;
  displayedColumns: string[] = ["ChecklistItem", "isChecked", "CheckedBy", "DateUpdated"];

  constructor(private bpChecklistService: BPApplicationChecklistService) { }

  ngOnInit(): void {
  }

  getChecklistForApplication() {
    this.bpChecklistService.getChecklistForApplicationAndStage(this.ApplicationID, this.StageName, this.FunctionalArea).subscribe((data: any) => {
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempCheckList = {} as Checklist;

          tempCheckList.ChecklistItemID = current.checklistItemID;
          tempCheckList.ApplicationID = current.applicationID;
          tempCheckList.FunctionalArea = current.functionalArea;
          tempCheckList.StageName = current.stageName;
          tempCheckList.isChecked = current.isChecked;
          tempCheckList.CheckedBy = current.checkedBy;
          tempCheckList.DateCreated = current.dateCreated.substring(0, current.dateCreated.indexOf("T"));
          tempCheckList.DateUpdated = current.dateUpdated.substring(0, current.dateUpdated.indexOf("T"));

          this.Checklist.push(tempCheckList);
        }
      }
      else {
        alert(data.responseMessage);
      }
    })
  }
}
