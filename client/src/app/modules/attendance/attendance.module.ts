import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceComponent } from './page/attendance.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AttendanceFormDailogComponent } from './shared/components/attendance-form-dailog/attendance-form-dailog.component';


@NgModule({
  declarations: [
    AttendanceComponent,
    AttendanceFormDailogComponent,
  ],
  imports: [
    CommonModule,
    AttendanceRoutingModule,

    SharedModule,
  ]
})
export class AttendanceModule { }
