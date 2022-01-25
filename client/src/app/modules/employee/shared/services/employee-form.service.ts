import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class EmployeeFormService {
  employeeRegisterForm: FormGroup;

  constructor(
    private _fb: FormBuilder
  ) {
    this.employeeRegisterForm = this.createEmployeeRegisterForm()
  }


  createEmployeeRegisterForm(): FormGroup {
    return this._fb.group({
      first_name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      last_name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-z]{2,4}$')]],
      password: [null],
      role: [null, Validators.required]
    });
  }

  setPasswordValidation() {
    this.employeeRegisterForm.get('password')!.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(20)]);
    this.employeeRegisterForm.get('password')!.updateValueAndValidity();
  }

  removePasswordValidation() {
    this.employeeRegisterForm.get('password')!.clearValidators();
    this.employeeRegisterForm.get('password')!.updateValueAndValidity();
  }
}
