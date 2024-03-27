import { UserAttrsEnum, UserBusinessCategoriesEnum } from './enums';

export interface IFileData {
  file: File;
}

export interface IQueryParams {
  [key: string]: string | string[];
}

export interface IDefaultBusinessCategoriesParams {
  default_business_categories: UserBusinessCategoriesEnum | UserBusinessCategoriesEnum[];
}


export interface IListUsersParams {
  attr?: UserAttrsEnum;
  attr_value?: string;
  limit: number;
  offset: number;
}

export interface IUserRead {
  entryUUID: string;
  mail: string;
  cn: string | null;
  sn: string | null;
  userPassword: string | null;
  telephoneNumber: string | null;
  businessCategory: string[] | null;
  displayName: string | null;
  employeeType: string[] | null;
  employeeNumber: string | null;
  creatorsName: string;
  createTimestamp: Date;
  modifyTimestamp: Date;
  structuralObjectClass: string;
}

export interface IUsersPaginated {
  users: IUserRead[];
  total_users_count: number;
  filtered_users_count: number;
}

export interface IUserCreate {
  mail: string;
  cn: string;
  sn: string;
  userPassword: string;
  businessCategory: string[];    // # apps
  telephoneNumber?: string;       // # telegramId
  displayName?: string;           // # teamleadEmail
  employeeType?: string[];        // # roles
  employeeNumber?: string;        // # active/inactive
}