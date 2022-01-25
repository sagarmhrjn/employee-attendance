
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, Subject, takeUntil, throwError } from 'rxjs';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { Attendance } from 'src/app/data/attendance/schema/attendance.model';
import { AttendanceService } from 'src/app/data/attendance/service/attendance.service';
import { RoleService } from 'src/app/data/role/service/role.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { AttendanceFormDailogComponent } from '../shared/components/attendance-form-dailog/attendance-form-dailog.component';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {
  dataToDisplay: Attendance[] = [];

  user: any;
  userRole: string = ''

  attendances!: Attendance[]
  dialogRef!: MatDialogRef<ConfirmationDialogComponent>;

  displayedColumns: string[] = ['id', 'date', 'checked_in', 'checked_out', 'status', 'remarks', 'createdAt', 'updatedAt', 'actions'];
  dataSource!: MatTableDataSource<Attendance>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly destroy$ = new Subject();

  constructor(
    private _tokenStorageService: TokenStorageService,
    private _attendanceService: AttendanceService,
    private _toastrService: ToastrService,
    public dialog: MatDialog,
    private _roleService: RoleService
  ) {
  }


  ngOnInit(): void {
    this.getCurrentuser()
  }


  getCurrentuser() {
    const currentUser = this._tokenStorageService.getDecodedAccessToken();
    if (currentUser) {
      this.getRole(currentUser.roleId)
      this.getAttendances(currentUser.userId);
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

  checkEmptyField(value: any): string {
    return value ? value : '-'
  }
}
