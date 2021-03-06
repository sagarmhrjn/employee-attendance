import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subject, catchError, throwError, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { User, UserDTO } from 'src/app/data/user/schema/user.model';
import { UserService } from 'src/app/data/user/service/user.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { EmployeeFormDialogComponent } from '../shared/components/employee-form-dialog/employee-form-dialog.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit, OnDestroy {
  dialogRef!: MatDialogRef<ConfirmationDialogComponent>;

  dataToDisplay: User[] = [];
  displayedColumns: string[] = ['id', 'first_name', 'last_name', 'email', 'createdAt', 'updatedAt', 'actions'];
  dataSource!: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private _userService: UserService,
    private _authService: AuthService,
    private _toastrService: ToastrService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getUsers()
  }

  // Get users
  getUsers(): void {
    this._userService.getUsers()
      .pipe(
        catchError(err => {
          return throwError(() => err);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (users: User[]) => {
          this.dataToDisplay = users;
          this.dataSource = new MatTableDataSource(this.dataToDisplay);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          this._toastrService.error('Error in fetching employees', '', { timeOut: 3000 })
        }
      });
  }

// Open add employee dialog
  openAddEmployeeDialog(): void {
    const dialogRef = this.dialog.open(EmployeeFormDialogComponent, {
      panelClass: 'mat-dialog-responsive',
      data: {
        title: 'Add Employee',
        action: 'add'
      },
    });

    dialogRef.componentInstance.onSave.subscribe(data => {
      this.registerEmployee(data.data)
    })
  }

// Register employee
  registerEmployee(data: UserDTO): void {
    this._authService.register(data)
      .pipe(
        catchError(err => {
          return throwError(() => err);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (user: User) => {
          this.dataToDisplay = [...this.dataToDisplay, user]
          this.dataSource.data = this.dataToDisplay

        },
        error: (err) => {
          this._toastrService.error('Error in registering employee', '', { timeOut: 3000 })
        }
      });
  }

  // Update employee
  updateEmployee(data: User): void {
    const dialogRef = this.dialog.open(EmployeeFormDialogComponent, {
      panelClass: 'mat-dialog-responsive',
      data: {
        title: 'Update employee',
        data,
        action: 'edit'
      },
    });

    dialogRef.componentInstance.onSave.subscribe(res => {
      delete res['data']['password']
      this._userService.updateUser(data._id, res)
        .pipe(
          catchError(err => {
            return throwError(() => err);
          }),
          takeUntil(this.destroy$)
        )
        .subscribe({
          next: (user: User) => {
            this.dataToDisplay = this.dataToDisplay.map(data => {
              if (data._id == user._id) data = user;
              return data
            })
            this.dataSource.data = this.dataToDisplay
            this._toastrService.success('Employee update successfull.', '', { timeOut: 3000 })
          },
          error: (err) => {
            this._toastrService.error('Error in updating employee', '', { timeOut: 3000 })
          }
        });
    })
  }

  // Delete employee
  deleteEmployee(id: string) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete employee',
        content: 'Are you sure wou want to delete this employee?'
      },
    });

    this.dialogRef.afterClosed()
      .subscribe((result) => {
        if (!result) return
        this._userService.deleteUser(id)
          .pipe(
            catchError(err => {
              return throwError(() => err);
            }),
            takeUntil(this.destroy$)
          )
          .subscribe({
            next: (res) => {
              this.dataToDisplay = this.dataToDisplay.filter(data => data._id != id)
              this.dataSource.data = this.dataToDisplay
              this._toastrService.success('Employee delete successfull.', '', { timeOut: 3000 })
            },
            error: (err) => {
              this._toastrService.error('Error in deleting employee', '', { timeOut: 3000 })
            }
          });
      })

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
