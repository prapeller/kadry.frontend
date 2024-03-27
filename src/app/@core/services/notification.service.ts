import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageTypeEnum } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    private snackBar: MatSnackBar,
  ) {}

  public showMessage(messageType: MessageTypeEnum, message: string) {
    if (messageType === MessageTypeEnum.Error) {
      this.snackBar.open(message, 'Close', { duration: 0 }); // Persistent snackbar for errors
    } else {
      this.snackBar.open(message, 'Close', { duration: 2000 }); // Auto-close after 2 seconds for success messages
    }
  }

  private getBackendFastApiErrorStrFromDetail(detail: { loc: string[]; msg: string }[]): string {
    let errorString = '';
    detail.forEach((err) => {
      errorString += `Field: ${err?.loc[1]} Error: ${err?.msg}\n`;
    });
    return errorString;
  }

  private getErrorMessage(err: HttpErrorResponse | string): string {
    if (typeof err === 'string') {
      return err;
    } else if (typeof err?.error?.detail === 'string') {
      return err?.error?.detail;
    } else if (typeof err?.error?.detail?.error?.message === 'string') {
      return err.error.detail.error.message;
    } else if (err?.error?.detail?.length > 0) {
      return this.getBackendFastApiErrorStrFromDetail(err.error.detail);
    } else if (typeof err.error?.message === 'string') {
      return err.error.message;
    } else if (typeof err?.statusText === 'string') {
      return err.statusText;
    } else {
      return 'Something went wrong, please contact administrator.';
    }
  }

  public errorHandler(err: HttpErrorResponse | string) {
    console.error(err);
    const errMessage = this.getErrorMessage(err);

    this.showMessage(MessageTypeEnum.Error, errMessage);
    return throwError(() => err);
  }

  public successHandler<T>(response: T): T {
    if (response && typeof response === 'object' && 'message' in response) {
      const message = (response as any).message;
      this.showMessage(message, 'Success');
    }
    return response;
  }

}
