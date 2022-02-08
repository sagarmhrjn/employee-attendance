import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Subject, catchError, throwError, takeUntil, tap } from 'rxjs';
import { Attendance } from 'src/app/data/attendance/schema/attendance.model';
import { AttendanceService } from 'src/app/data/attendance/service/attendance.service';
import { User } from 'src/app/data/user/schema/user.model';
import { UserService } from 'src/app/data/user/service/user.service';
import { AttendanceFormDailogComponent } from 'src/app/shared/components/attendance-form-dailog/attendance-form-dailog.component';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';

@Component({
  selector: 'app-employee-attendance',
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.scss']
})
export class EmployeeAttendanceComponent implements OnInit {

  dataToDisplay: Attendance[] = [];

  users: User[] = [];
  userId: string = ''
  userRole: string = ''

  attendances!: Attendance[]
  dialogRef!: MatDialogRef<ConfirmationDialogComponent>;

  displayedColumns: string[] = ['id', 'date', 'checked_in', 'checked_out', 'status', 'remarks', 'createdAt', 'updatedAt', 'actions'];
  dataSource!: MatTableDataSource<Attendance>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private _attendanceService: AttendanceService,
    private _toastrService: ToastrService,
    public dialog: MatDialog,
    private _sharedDataService: SharedDataService,
    private _userService: UserService,
    private _activatedRoute: ActivatedRoute
  ) {
  }


  ngOnInit(): void {
    this._activatedRoute.params.subscribe(params => {
      this.userId = params['id'];
      this.getAttendances(this.userId)
    });
    this.getCurrentUserRole()
    this.getUsers()
  }

  // Get all users
  getUsers(): void {
    this._userService.getUsers()
      .pipe(
        catchError(err => {
          return throwError(() => err);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (data: User[]) => {
          this.users = data
        },
        error: (err) => {
          this._toastrService.error('Error in fetching attendances', '', { timeOut: 3000 })
        }
      });
  }

  // Get current role
  getCurrentUserRole() {
    this._sharedDataService.getCurrentUserRole()
      .pipe(
        tap(res => {
          this.userRole = res ?? res
        }),
        catchError(err => {
          return throwError(() => err);
        }),
        takeUntil(this.destroy$)
      ).subscribe()
  }

  // Gete user attendnaces
  getAttendances(value: string): void {
    this._attendanceService.getAttendances(value)
      .pipe(
        catchError(err => {
          return throwError(() => err);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (attendances: Attendance[]) => {
          this.dataToDisplay = attendances;
          this.dataSource = new MatTableDataSource(this.dataToDisplay);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          this._toastrService.error('Error in fetching attendances', '', { timeOut: 2000 })
        }
      });
  }

  // Set status background
  setStatusBackground(value: string): string {
    let badge = 'badge'
    if (value === 'present') {
      badge = badge + ' ' + 'bg-success'
    } else if (value === 'missed') {
      badge = badge + '' + 'bg-warning'
    } else {
      badge = badge + ' ' + 'bg-danger'
    }
    return badge
  }

  // Update attendance
  updateAttendance(data: Attendance) {
    if (data.status === 'absent' && this.userRole === 'admin') {
      this._toastrService.error('You are not allowed to change this attendance', '', { timeOut: 3000 })
    }
    const dialogRef = this.dialog.open(AttendanceFormDailogComponent, {
      panelClass: 'mat-dialog-responsive',
      data: {
        title: 'Update attendance',
        data,
        action: 'edit'
      },
    });

    dialogRef.componentInstance.onSave.subscribe(res => {
      if (data.start_date && res.data.check_in_out === 'check_in') {
        this._toastrService.error('You have already checked in, Would you like to check out?', '', { timeOut: 3000 })
        return
      }
      if (!data.start_date && res.data.check_in_out === 'check_out') {
        this._toastrService.error('You have not checked in yet!, Please check in.', '', { timeOut: 3000 })
        return
      }

      if (data.end_date && this.userRole === 'user') {
        this._toastrService.error('You have already submitted your attendance for today.', '', { timeOut: 3000 })
        return
      }
      const attendanceObj = res
      attendanceObj['user'] = data.user
      attendanceObj['start_date'] = data.start_date
      this._attendanceService.updateAttendance(data._id, attendanceObj)
        .pipe(
          catchError(err => {
            return throwError(() => err);
          }),
          takeUntil(this.destroy$)
        )
        .subscribe({
          next: (attendance: Attendance) => {
            this.dataToDisplay = this.dataToDisplay.map(data => {
              if (data._id == attendance._id) data = attendance;
              return data
            })
            this.dataSource.data = this.dataToDisplay
            this._toastrService.success('Attendance update successfull.', '', { timeOut: 3000 })
          },
          error: (err) => {
            this._toastrService.error(err, '', { timeOut: 3000 })
          }
        });
    })
  }

  // Delete attendance
  deleteAttendance(id: string) {
    this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete attendance',
        content: 'Are you sure wou want to delete this attendance?'
      },
    });

    this.dialogRef.afterClosed()
      .subscribe((result) => {
        if (!result) return
        this._attendanceService.deleteAttendance(id)
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
              this._toastrService.success('Attendance delete successfull.', '', { timeOut: 2000 })
            },
            error: (err) => {
              this._toastrService.error('Error in deleting attendance.', '', { timeOut: 2000 })
            }
          });
      });

  }

  // Check empty field
  checkEmptyField(value: any): string {
    return value ? value : '-'
  }

  // Open add attendnace dialog
  openAddAttendanceDialog() {
    const dialogRef = this.dialog.open(AttendanceFormDailogComponent, {
      panelClass: 'mat-dialog-responsive',
      data: {
        title: 'Create attendance',
        action: 'create',
        users: this.users
      },
    });

    dialogRef.componentInstance.onSave.subscribe(res => {
      const userId = res.data.user._id
      const date = res.data.date
      let start_date, end_date;
      if (res.data.start_time) {
        start_date = cloneDeep(res.data.date)
        start_date.setHours(res.data.start_time.getHours())
        start_date.setMinutes(res.data.start_time.getMinutes())
        start_date.setSeconds(res.data.start_time.getSeconds())
      }
      if (res.data.end_time) {
        end_date = cloneDeep(res.data.date)
        end_date.setHours(res.data.end_time.getHours())
        end_date.setMinutes(res.data.end_time.getMinutes())
        end_date.setSeconds(res.data.end_time.getSeconds())
      }
      const attendanceObj = {
        date: date,
        start_date: res.data.start_time ? start_date : null,
        end_date: res.data.end_time ? end_date : null,
        remarks: res.remarks,
      }
      this._attendanceService.createEmployeeAttendance(userId, attendanceObj)
        .pipe(
          catchError(err => {
            return throwError(() => err);
          }),
          takeUntil(this.destroy$)
        )
        .subscribe({
          next: (attendance: Attendance) => {
            this.dataToDisplay = [...this.dataToDisplay, attendance]
            this.dataSource.data = this.dataToDisplay
            this._toastrService.success('Attendance create successfull.', '', { timeOut: 3000 })
          },
          error: (err) => {
            this._toastrService.error(err, '', { timeOut: 3000 })
          }
        });
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
