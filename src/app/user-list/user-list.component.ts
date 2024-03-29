import { Component, OnInit } from '@angular/core';
import { UserService } from '../@core/services/user.service';
import { IListUsersParams, IUserRead } from '../@core/interfaces';
import { OrderEnum, UserAttrsEnum } from '../@core/enums';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = [
    'actions',
    UserAttrsEnum.createTimestamp,
    UserAttrsEnum.entryUUID,
    UserAttrsEnum.mail,
    UserAttrsEnum.cn,
    UserAttrsEnum.sn,
    UserAttrsEnum.businessCategory,
  ];
  users: IUserRead[] = [];
  pageSizeOptions = [20, 50, 100];
  pageSize = 20;
  currentPage = 0;
  totalUsersCount = 0;
  filteredUsersCount = 0;

  order: OrderEnum = OrderEnum.desc;
  orderBy: UserAttrsEnum = UserAttrsEnum.createTimestamp;

  searchAttr: UserAttrsEnum = UserAttrsEnum.createTimestamp;
  searchValue: string = '';

  entryUUIDSearchValue: string = '';
  createTimestampSearchValue: string = '';
  mailSearchValue: string = '';
  cnSearchValue: string = '';
  snSearchValue: string = '';
  businessCategorySearchValue: string = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.clearSorting();
    this.clearSearchInput();
    this.loadUsers();
  }

  private clearSorting() {
    this.order = OrderEnum.desc;
    this.orderBy = UserAttrsEnum.createTimestamp;
  }

  private loadUsers() {
    const queryParams: IListUsersParams = {
      order: this.order,
      order_by: this.orderBy,
      limit: this.pageSize,
      offset: this.currentPage * this.pageSize,
    };
    if (this.order && this.orderBy) {
      queryParams.order = this.order;
      queryParams.order_by = this.orderBy;
    }
    if (this.searchAttr && this.searchValue) {
      queryParams.attr = this.searchAttr;
      queryParams.attr_value = this.searchValue;
    }
    this.userService.usersList(queryParams).subscribe(resp => {
      this.users = resp.users;
      this.totalUsersCount = resp.total_users_count;
      this.filteredUsersCount = resp.filtered_users_count;
    });
  }

  private getNormalizedDate(date: string): string {
    const localDate = new Date(date);
    const timezoneOffset = localDate.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(localDate.getTime() - timezoneOffset);
    return new Date(adjustedDate).toISOString().split('T')[0];
  }

  searchUsers(attr: UserAttrsEnum, attrValue: string) {
    this.currentPage = 0;
    if (attr === UserAttrsEnum.createTimestamp) {
      this.searchValue = this.getNormalizedDate(attrValue);
    } else {
      this.searchValue = attrValue;
    }
    this.searchAttr = attr;
    this.loadUsers();
  }

  public onSortChange(event: any) {
    if (event.direction === '') {
      this.clearSorting();
    } else {
      this.order = event.direction;
      this.orderBy = event.active;
    }
    this.loadUsers();
  }

  public onPaginateChange(event: any) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadUsers();
  }

  public clearSearchInput() {
    this.searchAttr = UserAttrsEnum.createTimestamp;
    this.searchValue = '';

    this.entryUUIDSearchValue = '';
    this.createTimestampSearchValue = '';
    this.mailSearchValue = '';
    this.cnSearchValue = '';
    this.snSearchValue = '';
    this.businessCategorySearchValue = '';

    this.loadUsers();
  }

  onDelete(mail: string) {
    // Implement deletion logic here
  }

  onEdit(user: IUserRead) {
    // Implement edit logic here
  }

  protected readonly UserAttrsEnum = UserAttrsEnum;
}