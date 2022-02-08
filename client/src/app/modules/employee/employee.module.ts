import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeComponent } from './page/employee.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmployeeFormDialogComponent } from './shared/components/employee-form-dialog/employee-form-dialog.component';
import { EmployeeAttendanceComponent } from './page/employee-attendance/employee-attendance.component';

@NgModule({
  declarations: [
    EmployeeComponent,
    EmployeeFormDialogComponent,
    EmployeeAttendanceComponent
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,

    SharedModule,

  ]
})
export class EmployeeModule { }
