import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { NbToastrService } from '@nebular/theme';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private baseUrl = environment.BACKEND_BASE_URL;
  private apiV1Url = '/api/v1';

  constructor(
    private http: HttpClient,
    private toastrService: NbToastrService,
    ) {}

  private errorHandler(error: HttpErrorResponse | string) {
    console.error(error);
    const errMessage = this.getErrorMessage(error);

    this.toastrService.danger(errMessage, 'Unsuccessful', {
      duration: 6000,
      destroyByClick: true,
    });
    return throwError(() => error);
  }

  private getErrorFromDetail(detail: { loc: string[]; msg: string }[]): string {
    let errorString = '';
    detail.forEach((error) => {
      errorString += `Field: ${error?.loc[1]} Error: ${error?.msg}\n`;
    });
    return errorString;
  }

  private getErrorMessage(error: HttpErrorResponse | string): string {
    if (typeof error === 'string') {
      return error;
    } else if (typeof error?.error?.detail === 'string') {
      return error?.error?.detail;
    } else if (typeof error?.error?.detail?.error?.message === 'string') {
      return error.error.detail.error.message;
    } else if (error?.error?.detail?.length > 0) {
      return this.getErrorFromDetail(error.error.detail);
    } else if (typeof error.error?.message === 'string') {
      return error.error.message;
    } else if (typeof error?.statusText === 'string') {
      return error.statusText;
    } else {
      return 'Something went wrong';
    }
  }

  public get<T>(_url: string, options = {}): Observable<T> {
    return this._http.get<T>(this.baseUrl + _url, options).pipe(catchError((err) => this.errorHandler(err)));
  }

  public post<T>(_url: string, data: any, options = {}): Observable<T> {
    return this._http.post<T>(this.baseUrl + _url, data, options).pipe(catchError((err) => this.errorHandler(err)));
  }

  public put<T>(_url: string, data: any, options = {}): Observable<T> {
    return this._http.put<T>(this.baseUrl + _url, data, options).pipe(catchError((err) => this.errorHandler(err)));
  }

  public delete<T>(_url: string, options = {}): Observable<T> {
    return this._http.delete<T>(this.baseUrl + _url, options).pipe(catchError((err) => this.errorHandler(err)));
  }
}