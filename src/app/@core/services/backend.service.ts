import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private baseUrl = environment.BACKEND_BASE_URL;
  protected apiVersionUrl: string = '/api/v1';

  constructor(
    private _http: HttpClient,
    private _notificator: NotificationService,
  ) {}


  public get<T>(_url: string, options = {}): Observable<T> {
    return this._http.get<T>(this.baseUrl + this.apiVersionUrl + _url, options)
      .pipe(catchError((err) => this._notificator.errorHandler(err)));
  }

  public post<T>(_url: string, data: any, options = {}): Observable<T> {
    return this._http.post<T>(this.baseUrl + this.apiVersionUrl + _url, data, options)
      .pipe(
        map((resp) => this._notificator.successHandler(resp)),
        catchError((err) => this._notificator.errorHandler(err)),
      );
  }

  public put<T>(_url: string, data: any, options = {}): Observable<T> {
    return this._http.put<T>(this.baseUrl + this.apiVersionUrl + _url, data, options)
      .pipe(
        map((resp) => this._notificator.successHandler(resp)),
        catchError((err) => this._notificator.errorHandler(err)));
  }

  public delete<T>(_url: string, options = {}): Observable<T> {
    return this._http.delete<T>(this.baseUrl + this.apiVersionUrl + _url, options)
      .pipe(
        map((resp) => this._notificator.successHandler(resp)),
        catchError((err) => this._notificator.errorHandler(err)));
  }
}

@Injectable({
  providedIn: 'root',
})
export class BackendServiceV1 extends BackendService {
  protected override apiVersionUrl = '/api/v1';
}