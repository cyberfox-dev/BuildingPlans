import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-bp-confirm-modal',
  templateUrl: './bp-confirm-modal.component.html',
  styleUrls: ['./bp-confirm-modal.component.css']
})
export class BpConfirmModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<BpConfirmModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) { }

  ngOnInit(): void {
  }

  onConfirm(result: boolean): void {
    this.dialogRef.close(result);
  }
}
