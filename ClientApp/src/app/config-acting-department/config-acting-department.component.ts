import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-config-acting-department',
  templateUrl: './config-acting-department.component.html',
  styleUrls: ['./config-acting-department.component.css']
})



export class ConfigActingDepartmentComponent implements OnInit {
  @Input() isInternal: any;

  selectedDep = 0;
  SelectActingDep = '';
  selectedZone = 0;
  SelectActingDZone = '';

  constructor() { }

  ngOnInit(): void {
  }

}
