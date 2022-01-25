import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceComponent } from './page/attendance.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/attendances',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AttendanceComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
