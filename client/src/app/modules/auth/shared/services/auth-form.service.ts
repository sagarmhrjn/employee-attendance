import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthFormService {
  loginForm: FormGroup;
  attendanceWithAuthForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.createLoginForm()
    this.attendanceWithAuthForm = this.createAttendanceWithAuthForm();
  }

  createLoginForm(): FormGroup {
    return this.fb.group({
      email: [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-z]{2,4}$')]],
      password: [null, Validators.required],
    });
  }

  createAttendanceWithAuthForm(): FormGroup {
    return this.fb.group({
      email: [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-z]{2,4}$')]],
      password: [null, Validators.required],
      check_in_out: ['check_in', Validators.required],
      remarks: [null]
    });
  }
}
