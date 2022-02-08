import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AttendanceFormService {
  attendanceForm: FormGroup;

  constructor(
    private _fb: FormBuilder
  ) {
    this.attendanceForm = this.createAttendanceForm()
  }


  createAttendanceForm(): FormGroup {
    return this._fb.group({
      date: [null, Validators.required],
      start_time: [null, Validators.required],
      end_time: [null, Validators.required],
      check_in_out: ['check_in', Validators.required],
      remarks: [null]
    });
  }
}
