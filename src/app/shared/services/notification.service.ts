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
    this.snackBar.open(message, 'Close', {
      duration: messageType === MessageTypeEnum.error ? 0 : 3000,
      panelClass: messageType === MessageTypeEnum.error ? 'snack-bar-error' : 'snack-bar-success',
      horizontalPosition: 'right'
    });
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

    this.showMessage(MessageTypeEnum.error, errMessage);
    return throwError(() => err);
  }

  public successHandler<T>(response: T): T {
    if (response && typeof response === 'object') {
      let message = '';
      if ('message' in response) {
        message = (response as any).message;
      } else if ('detail' in response) {
        message = (response as any).detail;
      }
      if (message !== '') {
        this.showMessage(MessageTypeEnum.success, message);
      }
    }
    return response;
  }

}
