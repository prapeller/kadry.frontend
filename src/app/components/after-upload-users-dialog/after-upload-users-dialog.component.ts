import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-after-upload-users-dialog',
  template: `
    <h1 mat-dialog-title>Upload Results</h1>
    <div mat-dialog-content>
      <h2>Created Users</h2>
      <ul>
        <li *ngFor="let user of data.created">{{ JSON.stringify(user) }}</li>
      </ul>
      <h2>Updated Users</h2>
      <ul>
        <li *ngFor="let user of data.updated">{{ JSON.stringify(user) }}</li>
      </ul>
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="true">Close</button>
    </div>
  `,
  styles: []
})
export class AfterUploadUsersDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  protected readonly JSON = JSON;
}