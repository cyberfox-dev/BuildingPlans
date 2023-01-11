import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

export interface PeriodicElement {
  name: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Cover letter explaning the extent of the work' },
  { name: 'Please upload a copy of your ID' },

];
export interface linkusersToZone {
  name: string;
}
const LinkUsersToZone: PeriodicElement[] = [
  { name: 'Department Comment' },
  { name: 'ESU approved' },
  { name: 'Application Approved' },
];


@Component({
  selector: 'app-mandatory-docs-config',
  templateUrl: './mandatory-docs-config.component.html',
  styleUrls: ['./mandatory-docs-config.component.css']
})
export class MandatoryDocsConfigComponent implements OnInit {

  openXl(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }
  openAddUserToAccessGroup(addUserToAccessGroup: any) {
    this.modalService.open(addUserToAccessGroup, { centered: true, size: 'lg' });
  }
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

  displayedColumns: string[] = ['name', 'actions'];
  dataSource = ELEMENT_DATA;

  displayedColumnsAddUser: string[] = ['name', 'actions'];
  dataSourceAddUser = LinkUsersToZone;

}
