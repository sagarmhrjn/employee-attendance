import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { catchError, Subject, takeUntil, throwError } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { AuthFormService } from '../../shared/services/auth-form.service';
import { SubmitAttendanceDialogComponent } from '../submit-attendance-dialog/submit-attendance-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { AttendanceWithAuthDTO } from 'src/app/data/attendance/schema/attendance.model';
import { AttendanceService } from 'src/app/data/attendance/service/attendance.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { AuthDTO } from 'src/app/data/auth/schema/auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  hide: boolean = true
  private readonly destroy$ = new Subject();

  constructor(
    private _authFormService: AuthFormService,
    private _authService: AuthService,
    private _tokenStorageService: TokenStorageService,
    private _router: Router,
    private _toastrService: ToastrService,
    public dialog: MatDialog,
    private _attendanceService: AttendanceService
  ) { }

  ngOnInit(): void {
  }


  get loginForm() {
    return this._authFormService.loginForm;
  }

  getErrorMessage(value: string): string {
    return this.loginForm.get(value)!.hasError('required') ? 'Field is required' : this.loginForm.get(value)!.hasError('pattern') ? 'Please enter a valid email address' : ''
  }

  onSubmit(value: AuthDTO) {
    if (this.loginForm.invalid) return;

    this._authService.login(value)
      .pipe(
        catchError(err => {
          return throwError(() => err);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res) => {
          this._tokenStorageService.saveToken(res.accessToken)
          this._toastrService.success('Login Successfull', '', { timeOut: 2000 })
          this._router.navigate(['/dashboard'])
        },
        error: (err) => {
          this._toastrService.error('Invalid username/password', '', { timeOut: 2000 })
        }
      });
  }

  openAttendanceDialog() {
    const dialogRef = this.dialog.open(SubmitAttendanceDialogComponent, {
      panelClass: 'mat-dialog-responsive'
    });

    dialogRef.componentInstance.onSave.subscribe(data => {
      this.submitAttendanceWithAuth(data);
    })
  }


  submitAttendanceWithAuth(data: AttendanceWithAuthDTO) {
    this._attendanceService.submitAttendanceWithAuth(data)
      .pipe(
        catchError(err => {
          return throwError(() => err);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res) => {
          this._toastrService.success('Attendance Successfull', '', { timeOut: 3000 })
          this._router.navigate(['/dashboard'])
        },
        error: (err) => {
          this._toastrService.error(err, '', { timeOut: 3000 })
        }
      });
  }

  ngOnDestroy(): void {
      
  }
}
