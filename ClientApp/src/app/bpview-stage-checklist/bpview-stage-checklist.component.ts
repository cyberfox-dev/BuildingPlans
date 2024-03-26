import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { BPStagesChecklistsService } from '../service/BPStagesChecklists/bpstages-checklists.service';

export interface StageChecklist {
  ChecklistItemID: number;
  ChecklistItem: string;
}
@Component({
  selector: 'app-bpview-stage-checklist',
  templateUrl: './bpview-stage-checklist.component.html',
  styleUrls: ['./bpview-stage-checklist.component.css']
})
export class BPViewStageChecklistComponent implements OnInit {

  functionalArea: string;
  stageName: string;

  StageChecklist: StageChecklist[] = [];
  constructor(private bpStageChecklistService: BPStagesChecklistsService) { }

  ngOnInit(): void {
  }

  GetStageChecklistForApplication() {
    this.bpStageChecklistService.getAllChecklistItemsForStage(this.stageName, this.functionalArea).subscribe((data: any) => {
      debugger;
      if (data.responseCode == 1) {
        debugger;
        for (let i = 0; i < data.dateSet.length; i++) {
          debugger;

          const tempChecklistItem = {} as StageChecklist;
          const current = data.dateSet[i];

          tempChecklistItem.ChecklistItemID = current.checklistItemID;
          tempChecklistItem.ChecklistItem = current.checklistItem;

          this.StageChecklist.push(tempChecklistItem);
        }

      }
      else {
        alert(data.responseMessage);
      }
    }, error => {
      console.log("Error: ", error);
    })
  }

}
