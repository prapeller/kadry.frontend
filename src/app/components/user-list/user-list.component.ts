import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { IListUsersParams, IUserRead, IUserUpdate } from '../../shared/interfaces';
import { OrderEnum, UserAttrsEnum, UserBusinessCategoriesEnum } from '../../shared/enums';
import { SpinnerService } from '../../shared/services/spinner.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getEnumValues } from '../../shared/functions';
import { DialogService } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: IUserRead[] = [];

  displayedColumns: string[] = [
    'actions',
    UserAttrsEnum.mail,
    UserAttrsEnum.cn,
    UserAttrsEnum.sn,
    UserAttrsEnum.businessCategory,
    UserAttrsEnum.createTimestamp,
    UserAttrsEnum.entryUUID,
  ];

  searchAttr?: UserAttrsEnum;
  searchValue?: string;

  entryUUIDSearchValue: string = '';
  createTimestampSearchValue: string = '';
  mailSearchValue: string = '';
  cnSearchValue: string = '';
  snSearchValue: string = '';
  businessCategorySearchValue: string = '';

  order: OrderEnum = OrderEnum.desc;
  orderBy: UserAttrsEnum = UserAttrsEnum.createTimestamp;

  pageSizeOptions = [20, 50, 100];
  pageSize = 20;
  currentPage = 0;
  totalUsersCount = 0;
  filteredUsersCount = 0;

  createUserForm!: FormGroup;

  editingRowId: string | null = null;
  userUpdate: IUserUpdate = {};

  constructor(private userService: UserService,
              protected spinnerService: SpinnerService,
              private formBuilder: FormBuilder,
              public dialogService: DialogService) {}

  ngOnInit() {
    this.clearSorting();
    this.clearSearchInput();
    this.loadUsers();
    this.createUserForm = this.formBuilder.group({
      mail: ['', [Validators.required, Validators.email]],
      cn: ['', Validators.required],
      sn: ['', Validators.required],
      userPassword: ['', Validators.required],
      businessCategory: [[], Validators.required],
    });
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

  public searchUsers(attr: UserAttrsEnum, attrValue: string) {
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

  public onDelete(mail: string) {
    this.dialogService.openConfirmDialog('delete', '600px').afterClosed().subscribe(res => {
      if (res) {
        this.userService.usersDelete(mail).subscribe({
          next: () => {this.loadUsers();}
        });
      }
    });
  }

  public startEdit(id: string) {
    this.editingRowId = id;
  }

  public cancelEdit() {
    this.editingRowId = null;
    this.userUpdate = {}
  }

  public saveEdit(mail: string) {
    this.userService.usersUpdate(mail, this.userUpdate).subscribe({
      next: () => {this.loadUsers()}
    });
    this.cancelEdit();
  }

  onCreateUser() {
    if (this.createUserForm.valid) {
      this.userService.usersCreate(this.createUserForm.value).subscribe({
        next: () => {this.loadUsers();}
      });
    }
  }

  protected readonly UserAttrsEnum = UserAttrsEnum;
  protected readonly UserBusinessCategoriesEnum = UserBusinessCategoriesEnum;
  protected readonly getEnumValues = getEnumValues;
}