import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent {
  protected selectedFile: File | null = null;

  constructor(
    public dialogRef: MatDialogRef<UploadDialogComponent>,
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }

  onFileDropped(file: File): void {
    this.selectedFile = file;
  }

  uploadFile(): void {
    if (this.selectedFile) {
      this.dialogRef.close(this.selectedFile);
    } else {
      this.dialogRef.close();
    }
  }
}