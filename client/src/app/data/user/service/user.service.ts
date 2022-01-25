import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { HandleErrorService } from 'src/app/core/services/handle-error.service';
import { User, UserDTO } from '../schema/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private _http: HttpClient,
    private _handleErrorService: HandleErrorService
  ) { }


  getUsers(): Observable<User[]> {
    return this._http.get<{ data: User[] }>('users')
      .pipe(
        map((users) => users['data'] || {}),
        catchError(this._handleErrorService.handleError)
      );;
  }

  getUser(id: string): Observable<User> {
    return this._http.get<{ data: User }>('users/' + id,)
      .pipe(
        map((user) => user['data'] || {}),
        catchError(this._handleErrorService.handleError)
      );;
  }


  updateUser(id: string, data: UserDTO): Observable<User> {
    return this._http.patch<{ data: User }>('users/' + id + '/update', data)
      .pipe(
        map((user) => user['data'] || {}),
        catchError(this._handleErrorService.handleError)
      );;
  }

  deleteUser(id: string): Observable<User> {
    return this._http.delete<User>('users/' + id + '/delete',)
      .pipe(
        catchError(this._handleErrorService.handleError)
      );;
  }
}
