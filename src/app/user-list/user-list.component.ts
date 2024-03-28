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
  displayedColumns: string[] = ['actions', 'createTimestamp', 'mail', 'cn', 'sn', 'businessCategory'];
  users: IUserRead[] = [];
  pageSizeOptions = [15, 50, 100];
  pageSize = 15;
  currentPage = 0;
  totalUsersCount = 0;
  filteredUsersCount = 0;
  searchAttr: UserAttrsEnum | null = null;
  searchValue: string | null = null;
  currentOrder: OrderEnum = OrderEnum.desc;
  currentOrderBy: UserAttrsEnum = UserAttrsEnum.createTimestamp;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.flushSorting();
    this.loadUsers();
  }

  private flushSorting() {
    this.currentOrder = OrderEnum.desc;
    this.currentOrderBy = UserAttrsEnum.createTimestamp;
  }

  private loadUsers() {
    const queryParams: IListUsersParams = {
      order: this.currentOrder,
      order_by: this.currentOrderBy,
      limit: this.pageSize,
      offset: this.currentPage * this.pageSize,
    };
    if (this.currentOrder && this.currentOrderBy) {
      queryParams.order = this.currentOrder;
      queryParams.order_by = this.currentOrderBy;
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

  searchUser(attr: UserAttrsEnum, attrValue: string) {
    this.searchAttr = attr;
    this.searchValue = attrValue;
    this.currentPage = 0;
    this.loadUsers();
  }

  public onSortChange(event: any) {
    if (event.direction === '') {
      this.flushSorting();
    } else {
      this.currentOrder = event.direction;
      this.currentOrderBy = event.active;
    }
    this.loadUsers();
  }

  public onPaginateChange(event: any) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
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