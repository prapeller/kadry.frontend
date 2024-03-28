import { Injectable } from '@angular/core';
import { BackendServiceV1 } from './backend.service';
import { NotificationService } from './notification.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  IDefaultBusinessCategoriesParams,
  IFileData,
  IListUsersParams,
  IUserCreate,
  IUserRead,
  IUsersPaginated
} from '../interfaces';
import { MessageTypeEnum } from '../enums';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private urlPrefix = '/users';

  constructor(
    private _backendServiceV1: BackendServiceV1,
    private _notificator: NotificationService,
  ) {}

  public usersCreate(payload: IUserCreate): Observable<IUserRead> {
    return this._backendServiceV1.post('/users', payload);
  }

  public usersList(queryParams: IListUsersParams): Observable<IUsersPaginated> {
    let paramsObj: { [key: string]: string | string[] } = {};
    paramsObj['order'] = queryParams.order;
    paramsObj['order_by'] = queryParams.order_by;
    paramsObj['limit'] = queryParams.limit.toString();
    paramsObj['offset'] = queryParams.offset.toString();

    if (queryParams?.attr && queryParams?.attr_value) {
      paramsObj['attr'] = queryParams.attr;
      paramsObj['attr_value'] = queryParams.attr_value;
    }
    return this._backendServiceV1.get(this.urlPrefix, { params: new HttpParams({ fromObject: paramsObj }) });
  }

  public usersGetMe(): Observable<IUserRead> {
    return this._backendServiceV1.get(`${this.urlPrefix}/me`);
  }

  public usersGetByMail(mail: string): Observable<IUserRead> {
    return this._backendServiceV1.get(`${this.urlPrefix}/${mail}`);
  }

  public usersUpdate(mail: string, data: any): Observable<IUserRead> {
    return this._backendServiceV1.put(`${this.urlPrefix}/${mail}`, data);
  }

  public usersDelete(mail: string): Observable<string> {
    return this._backendServiceV1.delete(`${this.urlPrefix}/${mail}`);
  }

  public usersListUserRoles(mail: string) {
    return this._backendServiceV1.get(`${this.urlPrefix}/${mail}/roles`);
  }

  public usersCreateOrUpdateFromExcel(data: IFileData, queryParams: IDefaultBusinessCategoriesParams | null) {
    if (data.file.type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return this._notificator.showMessage(MessageTypeEnum.error, 'Only Excel files are allowed.');
    }

    let params = new HttpParams({ fromObject: {} });
    if (queryParams?.default_business_categories) {
      if (Array.isArray(queryParams.default_business_categories)) {
        queryParams.default_business_categories.forEach((value) => {
          params = params.append('default_business_categories', value);
        });
      } else if (typeof queryParams.default_business_categories === 'string') {
        params = params.append('default_business_categories', queryParams.default_business_categories);
      }
    }
    const options = { params: params, responseType: 'json' };
    const formData: FormData = new FormData();
    formData.append('file', data.file, data.file.name);
    return this._backendServiceV1.post(`${this.urlPrefix}/create-or-update-from-excel`, formData, options);
  }

  public usersUpdateFromExcel(data: IFileData) {
    if (data.file.type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return this._notificator.showMessage(MessageTypeEnum.error, 'Only Excel files are allowed.');
    }
    const formData: FormData = new FormData();
    formData.append('file', data.file, data.file.name);
    return this._backendServiceV1.post(`${this.urlPrefix}/update-from-excel`, formData);
  }

}
