import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { AttendanceFormDailogComponent } from './components/attendance-form-dailog/attendance-form-dailog.component';
import { MatSortModule } from '@angular/material/sort';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';



@NgModule({
  declarations: [

    ConfirmationDialogComponent,
    AttendanceFormDailogComponent
  ],
  imports: [
    CommonModule,

    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    MatButtonModule,
    
    MatFormFieldModule,
    MatInputModule,

    MatSelectModule,

    MatDatepickerModule,
    MatNativeDateModule,
    TimepickerModule,

    MatDialogModule,
    MatTooltipModule,

    ToastrModule.forRoot(),
    NgxMatSelectSearchModule
  ],
  exports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,

    MatDatepickerModule,
    MatNativeDateModule,
    TimepickerModule,

    ToastrModule,

    NgxMatSelectSearchModule,

    ConfirmationDialogComponent,
    AttendanceFormDailogComponent
  ]
})
export class SharedModule { }
