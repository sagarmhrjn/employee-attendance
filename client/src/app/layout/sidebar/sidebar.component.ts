import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, map, Subject, takeUntil, tap, throwError } from 'rxjs';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { RoleService } from 'src/app/data/role/service/role.service';
import { User } from 'src/app/data/user/schema/user.model';
import { UserService } from 'src/app/data/user/service/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  userRole: string = ''
  currentUser!: User
  private readonly destroy$ = new Subject<void>();

  constructor(
    private _tokenStorageService: TokenStorageService,
    private _roleService: RoleService,
    private _userService: UserService
  ) { }

  ngOnInit(): void {
    const userInfo = this._tokenStorageService.getDecodedAccessToken();
    if (userInfo) {
      this.getRole(userInfo.roleId)
      this.getUser(userInfo.userId)
    }
  }

  getRole(id: string): void {
    this._roleService.getRole(id)
      .pipe(
        map((data) => this.userRole = data.name),
        catchError(err => {
          return throwError(() => err);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  getUser(id: string): void {
    this._userService.getUser(id)
      .pipe(
        map((data) => this.currentUser = data),
        catchError(err => {
          return throwError(() => err);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
