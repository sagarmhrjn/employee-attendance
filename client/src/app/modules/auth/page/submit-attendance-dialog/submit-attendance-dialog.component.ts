import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AttendanceWithAuthDTO } from 'src/app/data/attendance/schema/attendance.model';
import { AuthFormService } from '../../shared/services/auth-form.service';

@Component({
  selector: 'app-submit-attendance-dialog',
  templateUrl: './submit-attendance-dialog.component.html',
  styleUrls: ['./submit-attendance-dialog.component.scss']
})
export class SubmitAttendanceDialogComponent implements OnInit {
  hide: boolean = true
  onSave = new EventEmitter();

  constructor(
    private _authFormService: AuthFormService,
    public dialog: MatDialog) { }

  ngOnInit() {
  }

  get attendanceWithAuthForm(): FormGroup {
    return this._authFormService.attendanceWithAuthForm;

  }

  getErrorMessage(value: string): string {
    return this.attendanceWithAuthForm.get(value)!.hasError('required') ? 'Field is required' : this.attendanceWithAuthForm.get(value)!.hasError('pattern') ? 'Not a valid email address' : ''
  }

  onAttendanceSubmit(value: AttendanceWithAuthDTO) {
    if (this.attendanceWithAuthForm.invalid) return
    this.onSave.emit(value)
  }
}
