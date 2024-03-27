import { Component, OnInit } from '@angular/core';
import { UserService } from '../@core/services/user.service';
import { IListUsersParams, IUserRead } from '../@core/interfaces';
import { UserAttrsEnum } from '../@core/enums';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['actions', 'mail', 'cn', 'sn', 'businessCategory'];
  users: IUserRead[] = [];
  pageSizeOptions = [20, 50, 100];
  pageSize = 20;
  currentPage = 0;
  totalUsersCount = 0;
  filteredUsersCount = 0;
  searchTerm: UserAttrsEnum | null = null;
  searchValue: string | null = null;


  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers()
  }

  private loadUsers() {
    const queryParams: IListUsersParams = { limit: this.pageSize, offset: this.currentPage * this.pageSize };
    if (this.searchTerm && this.searchValue) {
      queryParams.attr = this.searchTerm;
      queryParams.attr_value = this.searchValue;
    }
    this.userService.usersList(queryParams).subscribe(resp => {
      this.users = resp.users;
      this.totalUsersCount = resp.total_users_count;
      this.filteredUsersCount = resp.filtered_users_count;
    });
  }
  searchUser(term: UserAttrsEnum, value: string) {
    this.searchTerm = term;
    this.searchValue = value;
    this.currentPage = 0;
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