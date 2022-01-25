import { Component, EventEmitter, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User, UserDTO } from 'src/app/data/user/schema/user.model';
import { EmployeeFormService } from '../../services/employee-form.service';

@Component({
  selector: 'app-register-form-dialog',
  templateUrl: './register-form-dialog.component.html',
  styleUrls: ['./register-form-dialog.component.scss']
})
export class RegisterFormDialogComponent implements OnInit, OnDestroy {
  isPasswordField: boolean = true;
  hide: boolean = true
  userRole!: string;
  onSave = new EventEmitter();

  constructor(
    private _employeeFormService: EmployeeFormService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    if (this.data.action === 'edit') {
      this.patchEmployeeForm(this.data['data'])
    } else {
      this._employeeFormService.setPasswordValidation()
    }
  }

  get employeeRegisterForm() {
    return this._employeeFormService.employeeRegisterForm;
  }


  getEmailErrorMessage(value: string): string {
    return this.employeeRegisterForm.get(value)!.hasError('required') ? 'Field is required' : this.employeeRegisterForm.get(value)!.hasError('pattern') ? 'Please enter a valid email address' : ''
  }

  getNameErrorMessage(value: string): string {
    return this.employeeRegisterForm.get(value)!.hasError('required') ? 'Field is required' : this.employeeRegisterForm.get(value)!.hasError('minlength') ? 'Minimum character should be at least 3 characters long' : this.employeeRegisterForm.get(value)!.hasError('maxlength') ? 'Minimum character should be at least 20 characters long' : '';
  }

  getPasswordErrorMessage(value: string): string {
    return this.employeeRegisterForm.get(value)!.hasError('required') ? 'Field is required' : this.employeeRegisterForm.get(value)!.hasError('minlength') ? 'Password should be at least 6 characters long' : this.employeeRegisterForm.get(value)!.hasError('maxlength') ? 'Password should be at least 20 characters long' : '';
  }

  onEmployeeRegisterSubmit(value: UserDTO) {
    let dataObj = { action: this.data.action }
    if (this.employeeRegisterForm.invalid) return
    this.onSave.emit({ ...dataObj, data: value })
  }

  patchEmployeeForm(data: User): void {
    this.isPasswordField = false
    this._employeeFormService.removePasswordValidation();
    this.employeeRegisterForm.patchValue({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      role: data.role_name
    })
  }

  ngOnDestroy(): void {
    this.employeeRegisterForm.reset();
  }
}
