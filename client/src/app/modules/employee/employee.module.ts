import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeComponent } from './page/employee.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RegisterFormDialogComponent } from './shared/components/register-form-dialog/register-form-dialog.component';

@NgModule({
  declarations: [
    EmployeeComponent,
    RegisterFormDialogComponent
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,

    SharedModule,

  ]
})
export class EmployeeModule { }
