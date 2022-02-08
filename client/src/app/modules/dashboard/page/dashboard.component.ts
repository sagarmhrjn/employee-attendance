import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { AttendanceService } from 'src/app/data/attendance/service/attendance.service';
import { Attendance } from 'src/app/data/attendance/schema/attendance.model';
import { catchError, Subject, takeUntil, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import * as moment from 'moment';

export interface Event {
  id: string
  title: string
  start: string;
  end: string
  color: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  userId!: string;
  calendar: any;
  attendances!: Attendance[]
  events: Event[] = []

  private readonly destroy$ = new Subject<void>();

  @ViewChild("calendar") calendarEl!: ElementRef;

  constructor(
    private _attendanceService: AttendanceService,
    private _toastrService: ToastrService,
    private _tokenStorageService: TokenStorageService
  ) { }

  ngOnInit(): void {
  }


  ngAfterViewInit() {
    this.initCalendar();
    this.getCurrentuser()
  }

  // Get current user
  getCurrentuser() {
    const currentUser = this._tokenStorageService.getDecodedAccessToken();
    this.userId = currentUser.userId;
    this.getAttendances(this.userId);
  }

  // Initialize calendar
  initCalendar() {
    const _this = this;
    _this.calendar = new Calendar(this.calendarEl.nativeElement, {
      plugins: [
        interactionPlugin,
        dayGridPlugin,
        timeGridPlugin,
        listPlugin
      ],
      customButtons: {
        everyoneBtn: {
          text: 'Everyone',
          click: function () {
            _this.getAllAttendances()
          }
        },
        myBtn: {
          text: 'Only You',
          click: function () {
            _this.getAttendances(_this.userId)
          }
        }
      },
      header: {
        left: 'everyoneBtn, myBtn',
        center: 'prev title next',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      navLinks: true,
      editable: false,
      height: 570,
      events: this.events,
      displayEventEnd: true,
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        meridiem: 'short'
      },
    });

    _this.calendar.render();
  }

  // Get attendances
  getAttendances(value: string): void {
    this.calendar.removeAllEvents();
    this._attendanceService.getAttendances(value)
      .pipe(
        catchError(err => {
          return throwError(() => err);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (attendances: Attendance[]) => {
          this.attendances = attendances;
          const eventsData: Event[] = []
          this.attendances.map((attendance) => {
            let start_date = attendance.start_date ? moment.utc(attendance.start_date, "hh:mm").local().format('LT') : ''
            let end_date = attendance.end_date ? moment.utc(attendance.end_date, "hh:mm").local().format('LT') : ''
            let status = attendance.status ? attendance.status : ''
            eventsData.push({
              id: attendance._id,
              title: start_date + '-' + end_date + ' (' + status + ')',
              start: moment.utc(attendance.start_date).local().format('YYYY-MM-DD'),
              end: moment.utc(attendance.end_date).local().format('YYYY-MM-DD'),
              color: this.setEventColor(attendance)
            })
          })
          this.events = eventsData;
          this.calendar.addEventSource(this.events);
        },
        error: (err) => {
          this._toastrService.error('Error in fetching attendances', '', { timeOut: 2000 })
        }
      });
  }

  // Get all attendances
  getAllAttendances(): void {
    this.calendar.removeAllEvents();
    this._attendanceService.getAllAttendances()
      .pipe(
        catchError(err => {
          return throwError(() => err);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (attendances: Attendance[]) => {
          this.attendances = attendances;
          const eventsData: Event[] = []
          this.attendances.map((attendance) => {
            let start_date = attendance.start_date ? moment.utc(attendance.start_date, "hh:mm").local().format('LT') : ''
            let end_date = attendance.end_date ? moment.utc(attendance.end_date, "hh:mm").local().format('LT') : ''
            let status = attendance.status ? attendance.status : 'Please submit your attendance'
            eventsData.push({
              id: attendance._id,
              title: start_date + '-' + end_date + ' (' + status + ')',
              start: moment.utc(attendance.start_date).local().format('YYYY-MM-DD'),
              end: moment.utc(attendance.end_date).local().format('YYYY-MM-DD'),
              color: this.setEventColor(attendance)
            })
          })
          this.events = eventsData;
          this.calendar.addEventSource(this.events);
        },
        error: (err) => {
          this._toastrService.error('Error in fetching attendances', '', { timeOut: 2000 })
        }
      });
  }

  // Set event color
  setEventColor(attendance: Attendance): string {
    let color;
    if (attendance.status === 'present') {
      color = '#009A44';
    } else if (attendance.status === 'missed') {
      color = '#ffcc00';
    } else if (attendance.status === 'absent') {
      color = '#cc3300';
    } else {
      color = '#3498DB';
    }
    return color
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
