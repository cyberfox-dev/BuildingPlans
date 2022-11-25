import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

export interface PeriodicElement {
  name: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Access Group 1' },
  { name: 'Access Group 2' },
  { name: 'Access Group 3' },
];
export interface linkusersToZone {
  name: string;
}
const LinkUsersToZone: PeriodicElement[] = [
  { name: 'User 1' },
  { name: 'User 2' },
  { name: 'User 3' },
];


@Component({
  selector: 'app-access-groups-config',
  templateUrl: './access-groups-config.component.html',
  styleUrls: ['./access-groups-config.component.css']
})



export class AccessGroupsConfigComponent implements OnInit {

  openXl(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }
  openAddUserToAccessGroup(addUserToAccessGroup :any) {
    this.modalService.open(addUserToAccessGroup, { centered:true,size: 'lg' });
  }
  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
  }

    displayedColumns: string[] = ['name', 'actions'];
  dataSource = ELEMENT_DATA;

  displayedColumnsAddUser: string[] = ['name', 'actions'];
  dataSourceAddUser = LinkUsersToZone;

}
