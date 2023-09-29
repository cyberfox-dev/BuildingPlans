import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-config-acting-department',
  templateUrl: './config-acting-department.component.html',
  styleUrls: ['./config-acting-department.component.css']
})



export class ConfigActingDepartmentComponent implements OnInit {
  @Input() isInternal: any;



  constructor() { }

  ngOnInit(): void {
  }

}
