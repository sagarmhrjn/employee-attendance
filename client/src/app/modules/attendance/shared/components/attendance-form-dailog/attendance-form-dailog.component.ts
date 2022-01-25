import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Attendance, AttendanceDTO } from 'src/app/data/attendance/schema/attendance.model';
import { AttendanceFormService } from '../../services/attendance-form.service';

@Component({
  selector: 'app-attendance-form-dailog',
  templateUrl: './attendance-form-dailog.component.html',
  styleUrls: ['./attendance-form-dailog.component.scss']
})
export class AttendanceFormDailogComponent implements OnInit {

  onSave = new EventEmitter();

  constructor(
    private _attendanceFormService: AttendanceFormService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    if (this.data.action === 'edit') this.patchAttendanceForm(this.data['data'])
  }

  get attendanceForm() {
    return this._attendanceFormService.attendanceForm;
  }


  onAttendanceSubmit(value: AttendanceDTO) {
    let dataObj = { action: this.data.action }
    if (this.attendanceForm.invalid) return
    this.onSave.emit({ ...dataObj, data: value })
  }

  patchAttendanceForm(data: Attendance): void {
    this.attendanceForm.patchValue({
      check_in_out: this.setAttendanceStatus(data.status),
      remarks: data.remarks
    })
  }

  setAttendanceStatus(value: string) {
    if (value == 'present') {
      return 'check_in'
    } else {
      return 'check_out'
    }
  }
}
