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
      check_in_out: ['check_in', Validators.required],
      remarks: [null]
    });
  }
}
