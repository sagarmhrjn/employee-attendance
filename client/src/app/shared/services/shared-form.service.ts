import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SharedFormService {

  attendanceForm: FormGroup;

  constructor(
    private _fb: FormBuilder
  ) {
    this.attendanceForm = this.createAttendanceForm()
  }


  createAttendanceForm(): FormGroup {
    return this._fb.group({
      user: [null],
      userFilter: [null],
      date: [null],
      start_time: [null],
      end_time: [null],
      check_in_out: [null],
      remarks: [null]
    });
  }


  setAttendanceCreateValidation() {
    this.attendanceForm.get('user')!.setValidators(Validators.required);
    this.attendanceForm.get('user')!.updateValueAndValidity();
    this.attendanceForm.get('date')!.setValidators(Validators.required);
    this.attendanceForm.get('date')!.updateValueAndValidity();
    // this.attendanceForm.get('start_time')!.setValidators(Validators.required);
    // this.attendanceForm.get('start_time')!.updateValueAndValidity();
    // this.attendanceForm.get('end_time')!.setValidators(Validators.required);
    // this.attendanceForm.get('end_time')!.updateValueAndValidity();
    this.attendanceForm.get('check_in_out')!.clearValidators();
    this.attendanceForm.get('check_in_out')!.updateValueAndValidity();
  }

  setAttendanceUpdateValidation() {
    this.attendanceForm.get('check_in_out')!.setValidators(Validators.required);
    this.attendanceForm.get('check_in_out')!.updateValueAndValidity();
    this.attendanceForm.get('check_in_out')!.setValue('check-in');
    this.attendanceForm.get('user')!.clearValidators();
    this.attendanceForm.get('user')!.updateValueAndValidity();
    this.attendanceForm.get('date')!.clearValidators();
    this.attendanceForm.get('date')!.updateValueAndValidity();
    // this.attendanceForm.get('start_time')!.clearValidators();
    // this.attendanceForm.get('start_time')!.updateValueAndValidity();
    // this.attendanceForm.get('end_time')!.clearValidators();
    // this.attendanceForm.get('end_time')!.updateValueAndValidity();
  }
}
