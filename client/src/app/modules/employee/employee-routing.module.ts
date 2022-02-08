import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeAttendanceComponent } from './page/employee-attendance/employee-attendance.component';
import { EmployeeComponent } from './page/employee.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/employees',
    pathMatch: 'full'
  },
  {
    path: '',
    component: EmployeeComponent
  },
  {
    path: ':id/attendances',
    component: EmployeeAttendanceComponent
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
