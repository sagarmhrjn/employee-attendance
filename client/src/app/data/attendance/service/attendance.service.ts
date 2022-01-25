import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { HandleErrorService } from 'src/app/core/services/handle-error.service';
import { Attendance, AttendanceDTO, AttendanceWithAuthDTO } from '../schema/attendance.model';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(
    private _http: HttpClient,
    private _handleErrorService: HandleErrorService) { }

  submitAttendanceWithAuth(data: AttendanceWithAuthDTO): Observable<AttendanceWithAuthDTO> {
    return this._http.post<AttendanceWithAuthDTO>('attendances/create_with_auth', data)
      .pipe(
        catchError(this._handleErrorService.handleError)
      );;
  }

  getAttendances(id: string): Observable<Attendance[]> {
    return this._http.get<{ data: Attendance[] }>('attendances?userId=' + id,)
      .pipe(
        map((user) => user['data'] || {}),
        catchError(this._handleErrorService.handleError)
      );;
  }

  getAllAttendances(): Observable<Attendance[]> {
    return this._http.get<{ data: Attendance[] }>('attendances/all')
      .pipe(
        map(attendances => attendances['data'] || []),
        catchError(this._handleErrorService.handleError)
      )
  }

  getAttendance(): Observable<Attendance> {
    return this._http.get<{ data: Attendance }>('attendances')
      .pipe(
        map(attendances => attendances['data'] || []),
        catchError(this._handleErrorService.handleError)
      )
  }

  updateAttendance(id: string, data: AttendanceDTO): Observable<Attendance> {
    return this._http.patch<{ data: Attendance }>('attendances/' + id + '/update', data)
      .pipe(
        map((user) => user['data'] || {}),
        catchError(this._handleErrorService.handleError)
      );;
  }

  deleteAttendance(id: string): Observable<Attendance> {
    return this._http.delete<Attendance>('attendances/' + id + '/delete',)
      .pipe(
        catchError(this._handleErrorService.handleError)
      );;
  }
}
