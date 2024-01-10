import { Component, OnInit, ViewEncapsulation, Input, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-bar-alerts',
  templateUrl: './snack-bar-alerts.component.html',
  styleUrls: ['./snack-bar-alerts.component.css'],

})
export class SnackBarAlertsComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string }) { }

  ngOnInit(): void {
  }
  @Input() message: string = '';
}
