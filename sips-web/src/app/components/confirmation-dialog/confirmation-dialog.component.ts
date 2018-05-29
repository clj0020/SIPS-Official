import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {
  public confirmMessage: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>
  ) { }

}
