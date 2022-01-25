import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './page/auth.component';
import { LoginComponent } from './page/login/login.component';

import { SubmitAttendanceDialogComponent } from './page/submit-attendance-dialog/submit-attendance-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    SubmitAttendanceDialogComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,

    SharedModule
    
  ]
})
export class AuthModule { }
