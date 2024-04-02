import { Component, Inject, Injectable } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) {}

  public openConfirmDialog(action: string, width: string = '300px', confirmButtonText?: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      width: width,
      data: {
        title: `Confirm ${action}`,
        message: `Are you sure you want to ${action} this item?`,
        confirmButtonText: confirmButtonText,
        cancelButtonText: 'Cancel'
      }
    });
  }
}