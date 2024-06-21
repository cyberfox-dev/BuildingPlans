import { Component, OnInit ,ViewChild} from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BPFinancialService } from '../service/BPfinancial/bpfinancial.service';
import { SharedService } from '../shared/shared.service';
export interface FinancialDocumentList {
  FinancialID: number;
  FinancialDocumentName: string;
  FinancialName: string;
  FinancialType: string;
  FinancialDocumentLocalPath: string;
  ApplicationID: number;
  CreatedById: string;
}
@Component({
  selector: 'app-bpfinancials',
  templateUrl: './bpfinancials.component.html',
  styleUrls: ['./bpfinancials.component.css']
})
export class BPFinancialsComponent implements OnInit {

  ApplicationID: number;

  hasRelaxationInvoice: boolean = false;
  isFinancial: boolean;
  hasFile: boolean;


  fileCount: number = 0;
  fileAttrs = '';

  financialDocumentList: FinancialDocumentList[] = [];
  @ViewChild(MatTable) financialsTable: MatTable<FinancialDocumentList> | null;
  displayedColumns: string[] = ['FinancialName', 'FinancialDocumentName', 'actions'];
  dataSource = this.financialDocumentList;

  constructor(private financialService: BPFinancialService, private sharedService: SharedService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.ApplicationID = this.sharedService.getApplicationID();
    this.getAllFinancialDocuments();
  }

  onPassFileName(event: { uploadFor: string; fileName: string }) {

    const { uploadFor, fileName } = event;
   

    this.hasFile = true;
    this.fileCount = this.fileCount + 1;
  }

  onFileDelete(event: any, index: number) {
    this.hasFile = false;
   

    //this.getAllDocsForApplication();
    this.fileCount = this.fileCount - 1;

  }


  onFileUpload(event: any) {



  }

  openUpload(UploadProof: any) {
    this.isFinancial = true;
    this.fileAttrs = "Relaxation POP";
    this.modalService.open(UploadProof, { centered: true, size: 'xl' });
  }
  getAllFinancialDocuments() {
    debugger;
    this.financialService.getFinancialByApplicationID(this.ApplicationID).subscribe((data: any) => {
      debugger;
      if (data.responseCode == 1) {
        for (let i = 0; i < data.dateSet.length; i++) {
          const current = data.dateSet[i];
          const tempDoc = {} as FinancialDocumentList;

          tempDoc.FinancialID = current.financialID;
          tempDoc.FinancialName = current.financialName;
          tempDoc.FinancialDocumentName = current.documentName;
          tempDoc.FinancialDocumentLocalPath = current.documentLocalPath;
          tempDoc.FinancialType = current.financialType;
          tempDoc.ApplicationID = current.applicationID;
          tempDoc.CreatedById = current.createdById;

          this.financialDocumentList.push(tempDoc);
        }
        this.dataSource = this.financialDocumentList;
        this.financialsTable?.renderRows();

      }
      else {
        alert(data.responseMessage);
      }
      console.log("BPFinancials ", this.dataSource);
    }, error => {
      console.log(error);
    })
  }
}
