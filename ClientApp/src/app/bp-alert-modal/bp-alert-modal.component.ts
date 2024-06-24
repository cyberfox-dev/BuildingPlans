import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-bp-alert-modal',
  templateUrl: './bp-alert-modal.component.html',
  styleUrls: ['./bp-alert-modal.component.css']
})
export class BpAlertModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<BpAlertModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) { }

  ngOnInit(): void {
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
