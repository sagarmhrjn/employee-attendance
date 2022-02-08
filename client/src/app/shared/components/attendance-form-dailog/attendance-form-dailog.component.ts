import { AfterViewInit, Component, EventEmitter, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';
import { Attendance, AttendanceDTO } from 'src/app/data/attendance/schema/attendance.model';
import { User } from 'src/app/data/user/schema/user.model';
import { SharedFormService } from '../../services/shared-form.service';

@Component({
  selector: 'app-attendance-form-dailog',
  templateUrl: './attendance-form-dailog.component.html',
  styleUrls: ['./attendance-form-dailog.component.scss']
})
export class AttendanceFormDailogComponent implements OnInit, AfterViewInit, OnDestroy {
  mytime: Date = new Date();
  hoursPlaceholder = 'hh';
  minutesPlaceholder = 'mm';
  isDisabled: boolean = true;
  onSave = new EventEmitter();

  /** list of users filtered by search keyword */
  filteredUsers: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;

  protected _onDestroy = new Subject<void>();


  constructor(
    private _sharedFormService: SharedFormService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    if (this.data.action === 'create') {
      this._sharedFormService.setAttendanceCreateValidation()
      // load initial user list
      this.filteredUsers.next(this.data.users.slice());
      // listen for search field value changes
      this.attendanceForm.get('userFilter')!.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterUsers();
        });

    }
    if (this.data.action === 'edit') {
      this._sharedFormService.setAttendanceCreateValidation()
      this.patchAttendanceForm(this.data['data'])
    }
  }


  get attendanceForm() {
    return this._sharedFormService.attendanceForm;
  }

  ngAfterViewInit(): void {
    this.attendanceForm.get('start_time')!.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe((res) => {
        if (res) {
          this.isDisabled = false;
        }
      });
  }

  onAttendanceSubmit(value: AttendanceDTO): void {
    let dataObj = { action: this.data.action }
    if (this.attendanceForm.invalid) return
    this.onSave.emit({ ...dataObj, data: value })
  }

  patchAttendanceForm(data: Attendance): void {
    this.attendanceForm.patchValue({
      check_in_out: this.setAttendanceStatus(data.status),
      remarks: data.remarks
    })
  }

  setAttendanceStatus(value: string) {
    if (value == 'present') {
      return 'check_in'
    } else {
      return 'check_out'
    }
  }

  protected filterUsers() {
    if (!this.data.users) {
      return;
    }
    // get the search keyword
    let search = this.attendanceForm.get('userFilter')!.value;
    if (!search) {
      this.filteredUsers.next(this.data.users.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the users
    const filteredUsers = this.data.users.filter((user: User) => (user.first_name + ' ' + user.last_name).toLowerCase().indexOf(search) > -1)

    this.filteredUsers.next(filteredUsers);
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
